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
@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter pedidos com paginação' })
  @ApiResponse({ status: 200, description: 'Pedidos retornados com sucesso' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.pedidoService.findAll(paginationDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter pedido pelo seu id' })
  @ApiResponse({ status: 200, description: 'Pedido retornado com sucesso' })
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
