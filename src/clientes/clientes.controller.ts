import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ResponseClienteDto } from './dto/response-cliente.dto';

@UseGuards(AuthTokenGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clienteService: ClientesService) { }
  
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter todos os clientes com paginação' })
  @ApiResponse({ status: 200, description: 'Clientes retornados com sucesso', type: ResponseClienteDto })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.clienteService.findAll(paginationDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter cliente pelo seu id' })
  @ApiResponse({ status: 200, description: 'Cliente retornado com sucesso' })
  @ApiParam({ name: 'id', description: 'id do pedido' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.clienteService.findOne(id);
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar cliente pelo seu id' })
  @ApiResponse({ status: 204, description: 'Cliente atualizado com sucesso' })
  @ApiParam({ name: 'id', description: 'id do pedido' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apagar cliente pelo seu id' })
  @ApiResponse({ status: 200, description: 'Cliente excluido com sucesso' })
  @ApiParam({ name: 'id', description: 'id do pedido' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.clienteService.delete(id);
  }
}
