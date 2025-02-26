import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, IsString } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

}
