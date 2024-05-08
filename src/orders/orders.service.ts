import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { envs } from '../config';
import { PrismaClient } from '@prisma/client';

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
  create(createOrderDto: CreateOrderDto) {
    return createOrderDto;
  }

  // find All orders
  findAll() {
    return `This action returns all orders`;
  }

  // find One order by ID
  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
}
