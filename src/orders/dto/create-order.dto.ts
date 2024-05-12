import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { OrderDetailDto } from './order-detail.dto';

export class CreateOrderDto {
  // here you can add discount coupons.

  @IsArray()
  @ArrayMinSize(1)
  // internally validates the elements contained in the array...items: any[];
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto) // convert to Order Detail Dto
  items: OrderDetailDto[];
}
