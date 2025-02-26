import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePedidoDto {
  @ApiProperty({
    description: 'ID do cliente associado ao pedido.',
    type: Number,
  })
  @IsNotEmpty({ message: 'O cliente é obrigatório.' })
  @Type(() => Number)
  clienteId: number;

  @ApiProperty({
    description: 'Status do pedido.',
    enum: ['PENDENTE', 'APROVADO', 'ENVIADO', 'CANCELADO'],
    default: 'PENDENTE',
  })
  @IsEnum(['PENDENTE', 'APROVADO', 'ENVIADO', 'CANCELADO'], {
    message: 'O status deve ser PENDENTE, APROVADO, ENVIADO ou CANCELADO.',
  })
  status: 'PENDENTE' | 'APROVADO' | 'ENVIADO' | 'CANCELADO';

  @ApiProperty({
    description: 'Itens do pedido.',
  })
  @IsArray({ message: 'Os itens do pedido devem ser uma lista.' })
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itensPedido: ItemPedidoDto[];
}

class ItemPedidoDto {
  @ApiProperty({
    description: 'ID do produto no pedido.',
    type: Number,
  })
  @IsNotEmpty({ message: 'O ID do produto é obrigatório.' })
  @Type(() => Number)
  produtoId: number; 

  @ApiProperty({
    description: 'Quantidade do produto no pedido.',
    type: Number,
  })
  @IsNotEmpty({ message: 'A quantidade é obrigatória.' })
  @Type(() => Number)
  quantidade: number; 
}
