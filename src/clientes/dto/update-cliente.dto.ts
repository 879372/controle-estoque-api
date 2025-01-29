import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  // @IsString({
  //   message: 'O nome deve ser uma string',
  // })
  // @IsNotEmpty({
  //   message: 'O nome não pode ser vazio',
  // })
  // readonly name: string;
}
