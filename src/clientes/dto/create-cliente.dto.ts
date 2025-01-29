import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateClienteDto {
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
  @IsString({
    message: 'O telefone deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O telefone não pode ser vazio',
  })
  readonly telefone: string;
  @IsString({
    message: 'O endereco deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O endereco não pode ser vazio',
  })
  readonly endereco: string;
  @IsString({
    message: 'O bairro deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O bairro não pode ser vazio',
  })
  readonly bairro: string;
  @IsString({
    message: 'O cidade deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O cidade não pode ser vazio',
  })
  readonly cidade: string;
  @IsString({
    message: 'O estado deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O estado não pode ser vazio',
  })
  @MaxLength(2)
  readonly estado: string;
  @IsString({
    message: 'O cep deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O cep não pode ser vazio',
  })
  @MaxLength(9)
  readonly cep: string;
}
