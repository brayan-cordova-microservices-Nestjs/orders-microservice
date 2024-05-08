import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number) // convert the query params (comes as string) and here convert to number
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number) // convert the query params (comes as string) and here convert to number
  limit?: number = 10;
}
