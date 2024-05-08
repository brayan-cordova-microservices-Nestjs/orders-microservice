import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ChangeOrderStatusDto, OrderPaginationDto } from './dto';
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // create order
  @MessagePattern({ cmd: 'create_order' })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  // find All orders
  @MessagePattern({ cmd: 'find_all_orders' })
  findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
    return this.ordersService.findAllOrders(orderPaginationDto);
  }

  // find One order by ID
  @MessagePattern({ cmd: 'find_one_order' })
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOneOrder(id);
  }

  // change Order Status (UPDATE-PATCH)
  @MessagePattern({ cmd: 'change_order_status' })
  changeStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
    return this.ordersService.changeOrderStatus(changeOrderStatusDto);
  }
}
