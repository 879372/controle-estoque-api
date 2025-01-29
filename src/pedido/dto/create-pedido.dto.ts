import { IsEnum, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePedidoDto {
  @IsNotEmpty({ message: 'O cliente é obrigatório.' })
  @Type(() => Number)
  clienteId: number; // Representa a relação com o cliente pelo ID.

  @IsEnum(['PENDENTE', 'APROVADO', 'ENVIADO', 'CANCELADO'], {
    message: 'O status deve ser PENDENTE, APROVADO, ENVIADO ou CANCELADO.',
  })
  status: 'PENDENTE' | 'APROVADO' | 'ENVIADO' | 'CANCELADO';

  @IsArray({ message: 'Os itens do pedido devem ser uma lista.' })
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itensPedido: ItemPedidoDto[]; // Representa os itens do pedido como objetos.
}

class ItemPedidoDto {
  @IsNotEmpty({ message: 'O ID do produto é obrigatório.' })
  @Type(() => Number)
  produtoId: number; // Representa o produto pelo ID.

  @IsNotEmpty({ message: 'A quantidade é obrigatória.' })
  @Type(() => Number)
  quantidade: number; // Quantidade do produto no pedido.
}
