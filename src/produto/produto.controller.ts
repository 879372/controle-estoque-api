import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ResponseProdutoDto } from './dto/response-produto.dto';

@UseGuards(AuthTokenGuard)
@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @Post()
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtoService.create(createProdutoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter todos os produto com paginação' })
  @ApiResponse({ status: 200, description: 'Produtos retornados com sucesso' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.produtoService.findAll(paginationDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter produto pelo seu id' })
  @ApiResponse({ status: 200, description: 'Produto retornado com sucesso' })
  @ApiParam({ name: 'id', description: 'id do do produto' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtoService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto pelo seu id' })
  @ApiResponse({ status: 204, description: 'Produto atualizado com sucesso' })
  @ApiParam({ name: 'id', description: 'id do do produto' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtoService.update(+id, updateProdutoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apagar produto pelo seu id' })
  @ApiResponse({ status: 200, description: 'Produto excluido com sucesso' })
  @ApiParam({ name: 'id', description: 'id do do produto' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtoService.delete(+id);
  }
}
