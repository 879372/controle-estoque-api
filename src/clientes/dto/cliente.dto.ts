import { ApiProperty } from '@nestjs/swagger';

export class ClienteDto {
  @ApiProperty()
  id_cliente: number;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  telefone: string;

  @ApiProperty()
  endereco: string;

  @ApiProperty()
  bairro: string;

  @ApiProperty()
  cidade: string;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  cep: string;

  @ApiProperty()
  data_cadastro: Date;
}
