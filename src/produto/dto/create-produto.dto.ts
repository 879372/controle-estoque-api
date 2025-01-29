import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProdutoDto {
  @IsString({
    message: 'O nome deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O nome não pode ser vazio',
  })
  @MaxLength(100)
  readonly nome: string;
  @IsString({
    message: 'A descrição deve ser uma string',
  })
  @IsOptional()
  readonly descricao: string;
  @IsNumber()
  @IsNotEmpty({
    message: 'O preço não pode ser vazio',
  })
  readonly preco: number;
  @IsNumber()
  @IsNotEmpty({
    message: 'O preço não pode ser vazio',
  })
  readonly estoque: number;
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: 'A data de validade não pode ser vazia' })
  readonly data_validade: Date;
}
