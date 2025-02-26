import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoService } from './pedido.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthTokenGuard)
@Controller('order')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso',
  })
  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter pedidos com paginação' })
  @ApiResponse({ status: 200, description: 'Pedidos retornados com sucesso',
    schema: {
      example: {
        page: 2,
        limit: 2,
        totalRecords: 18,
        totalPages: 9,
        pedidos: [
          {
            id_pedido: 3,
            data_pedido: '2025-02-21T08:21:49.712Z',
            status: 'APROVADO',
            quantidade_total: 4,
            valor_total: '40.00',
            cliente: {
              id_cliente: 3,
              nome: 'string',
              email: 'string',
              telefone: 'string',
              endereco: 'string',
              bairro: 'string',
              cidade: 'string',
              estado: 'st',
              cep: 'string',
              data_cadastro: '2025-01-31T05:21:29.783Z',
            },
            itensPedido: [
              {
                id_item_pedido: 1,
                quantidade: 2,
                preco_unitario: '10.00',
                produto: {
                  id_produto: 1,
                  descricao: 'dor de cabeça',
                },
              },
              {
                id_item_pedido: 2,
                quantidade: 2,
                preco_unitario: '10.00',
                produto: {
                  id_produto: 2,
                  descricao: 'dor de cabeça',
                },
              },
            ],
            total_produtos: 4,
          },
          {
            id_pedido: 4,
            data_pedido: '2025-02-21T08:26:07.454Z',
            status: 'APROVADO',
            quantidade_total: 1,
            valor_total: '8.00',
            cliente: {
              id_cliente: 1,
              nome: 'teste',
              email: 'teste@teste.com',
              telefone: '9999999999',
              endereco: 'teste',
              bairro: 'centro',
              cidade: 'teste',
              estado: 'sp',
              cep: '999999',
              data_cadastro: '2025-01-31T04:27:18.070Z',
            },
            itensPedido: [
              {
                id_item_pedido: 3,
                quantidade: 1,
                preco_unitario: '8.00',
                produto: {
                  id_produto: 3,
                  descricao: 'dor de cabeça',
                },
              },
            ],
            total_produtos: 1,
          },
        ],
      },
    },
   })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.pedidoService.findAll(paginationDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter pedido pelo seu id' })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado com sucesso',
    schema: {
      example: {
        id_pedido: 3,
        data_pedido: '2025-02-21T08:21:49.712Z',
        status: 'APROVADO',
        quantidade_total: 4,
        valor_total: '40.00',
        cliente: {
          id_cliente: 3,
          nome: 'string',
          email: 'string',
          telefone: 'string',
          endereco: 'string',
          bairro: 'string',
          cidade: 'string',
          estado: 'st',
          cep: 'string',
          data_cadastro: '2025-01-31T05:21:29.783Z',
        },
        itensPedido: [
          {
            id_item_pedido: 1,
            quantidade: 2,
            preco_unitario: '10.00',
            produto: {
              id_produto: 1,
              descricao: 'dor de cabeça',
            },
          },
          {
            id_item_pedido: 2,
            quantidade: 2,
            preco_unitario: '10.00',
            produto: {
              id_produto: 2,
              descricao: 'dor de cabeça',
            },
          },
        ],
        total_produtos: 4,
      },
    },
  })
  @ApiParam({ name: 'id', description: 'id do pedido' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar pedido pelo seu id' })
  @ApiResponse({ status: 204, description: 'Pedido atualizado com sucesso' })
  @ApiParam({ name: 'id', description: 'id do pedido' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoService.update(+id, updatePedidoDto);
  }
}
