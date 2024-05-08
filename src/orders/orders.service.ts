import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { envs } from '../config';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('colors');

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  // logger
  private readonly logger = new Logger('Orders-Service');

  async onModuleInit() {
    await this.$connect();
    this.logger.log(
      `${colors.black.bgWhite(envs.typeOfDatabase)} ${colors.white('DATABASE CONNECTED')} ${colors.green('Successfully using')} ${colors.white(envs.typeOfOrm)}`,
    );
  }

  // create a order
  createOrder(createOrderDto: CreateOrderDto) {
    return this.order.create({
      data: createOrderDto,
    });
  }

  // find All orders
  findAllOrders() {
    return `This action returns all orders`;
  }

  // find One order by ID
  async findOneOrder(id: string) {
    const order = await this.order.findFirst({
      where: { id },
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with ID ${id}, Not Found...!!!`,
      });
    }

    return order;
  }
}
