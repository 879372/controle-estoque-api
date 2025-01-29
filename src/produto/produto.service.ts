import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from './entities/produto.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  async create(createProdutoDto: CreateProdutoDto) {
    const existingProduto = await this.produtoRepository.findOne({
      where: { nome: createProdutoDto.nome },
    });

    if (existingProduto) {
      throw new BadRequestException('Produto já cadastrado');
    }

    const newProduto = this.produtoRepository.create(createProdutoDto);
    return this.produtoRepository.save(newProduto);
  }

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, page = 0 } = paginationDto;
    const offset = (page - 1) * limit;

    const produto = await this.produtoRepository.find({
      take: limit,
      skip: offset,
    });
    return {
      page: page,
      limit,
      totalRecords: await this.produtoRepository.count(),
      totalPages: Math.ceil((await this.produtoRepository.count()) / limit),
      produto,
    };
  }

  async findOne(id_produto: number) {
    //const cliente = this.clientes.find(c => c.id === +id);
    const produto = await this.produtoRepository.findOne({
      where: {
        id_produto,
      },
    });
    if (produto) return produto;
    throw new BadRequestException('Produto não encontrado');
  }

  async update(id_produto: number, updateProdutoDto: UpdateProdutoDto) {
    const produto = await this.produtoRepository.preload({
      id_produto,
      ...updateProdutoDto,
    });

    if (!produto) throw new BadRequestException('Produto não encontrado');

    return this.produtoRepository.save(produto);
  }

  async delete(id_produto: number) {
    const produto = await this.produtoRepository.findOneBy({
      id_produto,
    });

    if (!produto) throw new BadRequestException('Produto não encontrado');

    return this.produtoRepository.remove(produto);
  }
}
