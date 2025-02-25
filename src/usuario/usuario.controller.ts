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
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/hashing/auth.constants';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('usuario')
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
  @ApiResponse({status: 200, description: 'Usuários retornados com sucesso'})
  @UseGuards(AuthTokenGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Req() req: Request) {
    console.log(req[REQUEST_TOKEN_PAYLOAD_KEY])
    return this.usuarioService.findAll(paginationDto);
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Obter usuário pelo seu id'})
  @ApiResponse({status: 200, description: 'Usuários retornados com sucesso'})
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
