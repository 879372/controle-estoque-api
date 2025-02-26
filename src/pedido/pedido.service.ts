import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Pedido } from './entities/pedido.entity';
import { ItemPedido } from 'src/item_pedido/entities/item_pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(ItemPedido)
    private readonly itemPedidoRepository: Repository<ItemPedido>,
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) { }

  async create(createPedidoDto: CreatePedidoDto) {
    const { clienteId, status, itensPedido } = createPedidoDto;

    const pedido = this.pedidoRepository.create({
      cliente: { id_cliente: clienteId },
      status,
    });

    const savedPedido = await this.pedidoRepository.save(pedido);

    let quantidadeTotal = 0;
    let valorTotal = 0;
    const datadeHoje = new Date();

    const itens = await Promise.all(

      itensPedido.map(async item => {
        const produto = await this.produtoRepository.findOne({
          where: { id_produto: item.produtoId },
        });

        if (!produto) {
          throw new BadRequestException(
            `Produto com ID ${item.produtoId} não encontrado`,
          );
        }

        if (produto.estoque < item.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto ${produto.nome}`,
          );
        }

        if (new Date(produto.data_validade) <= datadeHoje) {
          throw new BadRequestException(
            `${produto.nome} está vencido`,
          );
        }


        produto.estoque -= item.quantidade;
        await this.produtoRepository.save(produto);

        const itemPedido = this.itemPedidoRepository.create({
          pedido: savedPedido,
          produto,
          quantidade: item.quantidade,
          preco_unitario: produto.preco,
        });

        quantidadeTotal += item.quantidade;
        valorTotal += item.quantidade * produto.preco;

        return itemPedido;
      }),
    );

    if (itens.length <= 0) {
      throw new BadRequestException('Adicione os produtos no pedido');
    }
  
    await this.itemPedidoRepository.save(itens);

    savedPedido.quantidade_total = quantidadeTotal;
    savedPedido.valor_total = valorTotal;

    await this.pedidoRepository.save(savedPedido);

    return this.pedidoRepository.findOne({
      where: { id_pedido: savedPedido.id_pedido },
      relations: ['itensPedido', 'itensPedido.produto'],
    });
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    const pedido = await this.pedidoRepository.findOne({
      where: { id_pedido: id },
      relations: ['itensPedido', 'itensPedido.produto'],
    });

    if (!pedido) {
      throw new BadRequestException('Pedido não encontrado');
    }

    if (updatePedidoDto.status === 'CANCELADO') {
      const quantidadePorProduto = new Map<number, number>();

      pedido.itensPedido.forEach(item => {
        const produtoId = item.produto.id_produto;
        const quantidade = item.quantidade;

        if (quantidadePorProduto.has(produtoId)) {
          quantidadePorProduto.set(
            produtoId,
            quantidadePorProduto.get(produtoId) + quantidade,
          );
        } else {
          quantidadePorProduto.set(produtoId, quantidade);
        }
      });

      await Promise.all(
        Array.from(quantidadePorProduto.entries()).map(
          async ([produtoId, quantidadeRestaurada]) => {
            const produto = await this.produtoRepository.findOne({
              where: { id_produto: produtoId },
            });

            if (!produto) {
              throw new BadRequestException(
                `Produto com ID ${produtoId} não encontrado`,
              );
            }

            produto.estoque += quantidadeRestaurada;
            await this.produtoRepository.save(produto);
          },
        ),
      );
    }

    pedido.status = updatePedidoDto.status;
    await this.pedidoRepository.save(pedido);

    return pedido;
  }

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, page = 1, search, startDate, endDate, status } = paginationDto;
    const offset = (page - 1) * limit;

    const queryBuilder = this.pedidoRepository.createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.cliente', 'cliente')
      .leftJoinAndSelect('pedido.itensPedido', 'itensPedido')
      .leftJoinAndSelect('itensPedido.produto', 'produto')
      .take(limit)
      .skip(offset);

    if (search) {
      queryBuilder.andWhere('cliente.nome LIKE :search', { search: `%${search}%` });
    }

    if (status) {
      queryBuilder.andWhere('pedido.status = :status', { status });
    }

    if (startDate || endDate) {
      let start = startDate ? `${startDate}T00:00:00.000Z` : null;
      let end = endDate ? `${endDate}T23:59:59.999Z` : null;
  
      if (start && end) {
        queryBuilder.andWhere('pedido.data_pedido BETWEEN :startDate AND :endDate', { startDate: start, endDate: end });
      } else if (start) {
        queryBuilder.andWhere('pedido.data_pedido >= :startDate', { startDate: start });
      } else if (end) {
        queryBuilder.andWhere('pedido.data_pedido <= :endDate', { endDate: end });
      }
    }

    const [pedidos, totalRecords] = await queryBuilder.getManyAndCount();

    const pedidosFormatados = pedidos.map(pedido => {
      let total_produtos = 0;
      let valor_total = 0;

      const itensComTotal = pedido.itensPedido.map(item => {
        total_produtos += item.quantidade;
        valor_total += item.quantidade * Number(item.preco_unitario);

        return {
          ...item,
          produto: {
            id_produto: item.produto.id_produto,
            descricao: item.produto.descricao,
          },
        };
      });

      return {
        ...pedido,
        total_produtos,
        valor_total: valor_total.toFixed(2),
        itensPedido: itensComTotal,
      };
    });

    return {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      pedidos: pedidosFormatados,
    };
  }

  async findOne(id: number) {
    const pedido = await this.pedidoRepository.findOne({
      where: { id_pedido: id },
      relations: ['cliente', 'itensPedido', 'itensPedido.produto'],
    });

    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    let total_produtos = 0;
    let valor_total = 0;

    const itensComTotal = pedido.itensPedido.map(item => {
      total_produtos += item.quantidade;
      valor_total += item.quantidade * Number(item.preco_unitario);

      return {
        ...item,
        produto: {
          id_produto: item.produto.id_produto,
          descricao: item.produto.descricao,
        },
      };
    });

    return {
      ...pedido,
      itensPedido: itensComTotal,
      total_produtos,
      valor_total: valor_total.toFixed(2),
    };
  }
}
