import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString({
    message: 'O username deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O username não pode ser vazio',
  })
  readonly username: string;

  @IsString({
    message: 'A senha deve ser uma string',
  })
  @IsNotEmpty({
    message: 'A senha não pode ser vazia',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  readonly password: string;
}
