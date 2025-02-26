import { BadRequestException, Injectable } from '@nestjs/common';
import { Between, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { FilterUserDto } from './dto/filter-usuario.dto';

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
      where: { username: createUsuarioDto.username },
    });

    if (existingCliente) {
      throw new BadRequestException('Email já cadastrado');
    }

    const dadosUsuario = {
      username: createUsuarioDto.username,
      password: passwordHash,
    };

    const newCliente = this.usuarioRepository.create(dadosUsuario);
    const usuarioSalvo = await this.usuarioRepository.save(newCliente);

    return {
      id_usuario: usuarioSalvo.id_usuario,
      username: usuarioSalvo.username,
    };
  }

  async findAll(filterUserDto?: FilterUserDto) {
    const { limit = 10, page = 0, search, startDate, endDate } = filterUserDto;
    const offset = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.username = Like(`%${search}%`);
    }

    if (startDate || endDate) {
      let start = startDate ? `${startDate}T00:00:00.000Z` : null;
      let end = endDate ? `${endDate}T23:59:59.999Z` : null;
  
      if (start && end) {
        where.createdAt = Between(start, end);
      } else if (start) {
        where.createdAt = MoreThanOrEqual(start);
      } else if (end) {
        where.createdAt = LessThanOrEqual(end);
      }
    }

    const [usuarios, totalRecords] = await this.usuarioRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
    });

    return {
      page: page,
      limit,
      totalRecords: totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      usuarios: usuarios.map(({ id_usuario, username, createdAt }) => ({
        id_usuario,
        username,
        createdAt
      })),
    };
  }

  async findOne(id_usuario: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id_usuario,
      },
    });
    
    if (usuario) {
      return {
        id_usuario: usuario.id_usuario,
        username: usuario.username,
        createAt: usuario.createdAt
      };
    }
    
    throw new BadRequestException('Usuario não encontrado');
  }

  async update(id_usuario: number, updateUsuarioDto: UpdateUsuarioDto) {
    const dadosUsuario = {
      username: updateUsuarioDto.username,
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

    this.usuarioRepository.save(usuario);

    return {
      id_usuario: usuario.id_usuario,
      username: usuario.username,
      createAt: usuario.createdAt
    }
  }

  async delete(id_usuario: number) {
    const usuario = await this.usuarioRepository.findOneBy({
      id_usuario,
    });

    if (!usuario) throw new BadRequestException('Usuario não encontrado');

    this.usuarioRepository.remove(usuario);

    return { message: `Usuário ${usuario.username} excluido com sucesso!`}
  }
}
