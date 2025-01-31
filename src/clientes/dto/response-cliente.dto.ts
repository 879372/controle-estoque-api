import { ApiProperty } from '@nestjs/swagger';
import { ClienteDto } from './cliente.dto';

export class ResponseClienteDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalRecords: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty({ type: () => [ClienteDto] }) 
  clientes: ClienteDto[];
}
