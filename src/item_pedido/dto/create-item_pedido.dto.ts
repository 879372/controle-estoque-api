import { IsNotEmpty, IsString } from 'class-validator';

export class CreateItemPedidoDto {
  @IsString({
    message: 'O nome deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O nome não pode ser vazio',
  })
  readonly nome: string;
  @IsString({
    message: 'O email deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O email não pode ser vazio',
  })
  readonly email: string;
}
