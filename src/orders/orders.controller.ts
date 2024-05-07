import { Controller, NotImplementedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // create order
  @MessagePattern({ cmd: 'create_order' })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  // find All orders
  @MessagePattern({ cmd: 'find_all_orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  // find One order by ID
  @MessagePattern({ cmd: 'find_one_order' })
  findOne(@Payload('id') id: number) {
    return this.ordersService.findOne(id);
  }

  // change order status
  @MessagePattern({ cmd: 'change_order_status' })
  changeOrderStatus() {
    // return this.ordersService.changeOrderStatus();

    throw new NotImplementedException();
  }
}
