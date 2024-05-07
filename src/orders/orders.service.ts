import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { envs } from '../config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('colors');

@Injectable()
export class OrdersService {
  // logger
  private readonly logger = new Logger('Orders-Service');
  onModuleInit() {
    // this.$connect();
    this.logger.log(
      `${colors.black.bgWhite(envs.typeOfDatabase)} ${colors.white('DATABASE CONNECTED')} ${colors.green('Successfully using')} ${colors.white(envs.typeOfOrm)}`,
    );
  }

  // create a order
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
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
