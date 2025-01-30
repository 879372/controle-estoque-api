import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, page = 0, search } = paginationDto;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.nome = Like(`%${search}%`);
    }

    const clientes = await this.clienteRepository.find({
      where,
      take: limit,
      skip: offset,
    });
    
    return {
      page: page,
      limit,
      totalRecords: await this.clienteRepository.count(),
      totalPages: Math.ceil((await this.clienteRepository.count()) / limit),
      clientes,
    };
  }

  async findOne(id_cliente: number) {
    const cliente = await this.clienteRepository.findOne({
      where: {
        id_cliente,
      },
    });
    if (cliente) return cliente;
    throw new BadRequestException('Cliente não encontrado');
  }

  async create(createClienteDto: CreateClienteDto) {
    const existingCliente = await this.clienteRepository.findOne({
      where: { email: createClienteDto.email },
    });

    if (existingCliente) {
      throw new BadRequestException('Email já cadastrado');
    }

    const newCliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(newCliente);
  }

  async update(id_cliente: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.clienteRepository.preload({
      id_cliente,
      ...updateClienteDto,
    });

    if (!cliente) throw new BadRequestException('Cliente não encontrado');

    return this.clienteRepository.save(cliente);
  }

  async delete(id_cliente: number) {
    const cliente = await this.clienteRepository.findOneBy({
      id_cliente,
    });

    if (!cliente) throw new BadRequestException('Cliente não encontrado');

    return this.clienteRepository.remove(cliente);
  }
}
