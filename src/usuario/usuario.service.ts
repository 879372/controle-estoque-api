import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const passwordHash = await this.hashingService.hashPassword(
      createUsuarioDto.password,
    );

    const existingCliente = await this.usuarioRepository.findOne({
      where: { email: createUsuarioDto.email },
    });

    if (existingCliente) {
      throw new BadRequestException('Email já cadastrado');
    }

    const dadosUsuario = {
      email: createUsuarioDto.email,
      password: passwordHash,
    };
    const newCliente = this.usuarioRepository.create(dadosUsuario);
    return this.usuarioRepository.save(newCliente);
  }

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, page = 0 } = paginationDto;
    const offset = (page - 1) * limit;

    const usuarios = await this.usuarioRepository.find({
      take: limit,
      skip: offset,
    });
    return {
      page: page,
      limit,
      totalRecords: await this.usuarioRepository.count(),
      totalPages: Math.ceil((await this.usuarioRepository.count()) / limit),
      usuarios,
    };
  }

  async findOne(id_usuario: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id_usuario,
      },
    });
    if (usuario) return usuario;
    throw new BadRequestException('Usuario não encontrado');
  }

  async update(id_usuario: number, updateUsuarioDto: UpdateUsuarioDto) {
    const dadosUsuario = {
      email: updateUsuarioDto.email,
    };

    if (updateUsuarioDto?.password) {
      const passwordHash = await this.hashingService.hashPassword(
        updateUsuarioDto.password,
      );

      dadosUsuario['password'] = passwordHash;
    }

    const usuario = await this.usuarioRepository.preload({
      id_usuario,
      ...dadosUsuario,
    });

    if (!usuario) throw new BadRequestException('Usuario não encontrado');

    return this.usuarioRepository.save(usuario);
  }

  async delete(id_usuario: number) {
    const usuario = await this.usuarioRepository.findOneBy({
      id_usuario,
    });

    if (!usuario) throw new BadRequestException('Usuario não encontrado');

    return this.usuarioRepository.remove(usuario);
  }
}
