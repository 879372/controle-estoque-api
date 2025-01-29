import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString({
    message: 'A senha deve ser uma string',
  })
  @IsNotEmpty({
    message: 'A senha não pode ser vazio',
  })
  @MinLength(6)
  readonly password: string;
  @IsString({
    message: 'O email deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O email não pode ser vazio',
  })
  readonly email: string;
}
