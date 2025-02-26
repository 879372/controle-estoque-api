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
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilterUserDto } from './dto/filter-usuario.dto';

@ApiTags('Usuários')
@Controller('user')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}
  
  @ApiBearerAuth()
  @ApiOperation({summary: 'Criar novo usuário'})
  @ApiResponse({status: 201, description: 'Usuários criado com sucesso'})
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }
  
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Obter todos os usuários com páginação'})
  @ApiResponse({
    status: 200,
    description: 'Usuários retornados com sucesso',
    schema: {
      example: {
        page: 1,
        limit: 10,
        totalRecords: 4,
        totalPages: 1,
        usuarios: [
          {
            id_usuario: 2,
            username: 'email@gmail.com',
            createdAt: '2025-01-01T08:17:05.732Z',
          },
          {
            id_usuario: 1,
            username: 'email@gmail.com',
            createdAt: '2025-01-01T08:17:05.732Z',
          },
        ],
      },
    },
  })
  @UseGuards(AuthTokenGuard)
  @Get()
  findAll(@Query() filterUserDto: FilterUserDto, @Req() req: Request) {
    return this.usuarioService.findAll(filterUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Obter usuário pelo seu id'})
  @ApiResponse({
    status: 200,
    description: 'Usuário retornado com sucesso',
    schema: {
      example: {
        id_usuario: 1,
        username: 'email@gmail.com',
        createdAt: '2025-01-01T08:17:05.732Z',
      },
    },
  })
  @ApiParam({name: 'id', description: 'id do usuário'})
  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usuarioService.findOne(id);
  }


  @ApiBearerAuth()
  @ApiOperation({summary: 'Atualizar usuário pelo seu id'})
  @ApiParam({name: 'id', description: 'id do usuário'})
  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Apagar usuário pelo seu id'})
  @ApiParam({name: 'id', description: 'id do usuário'})
  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usuarioService.delete(id);
  }
}
