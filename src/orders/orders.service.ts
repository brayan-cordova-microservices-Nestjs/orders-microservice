import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { envs, NATS_SERVICE } from '../config';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, OrderPaginationDto } from './dto';
import { firstValueFrom } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('colors');

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  // logger
  private readonly logger = new Logger('Orders-Service');

  // dependency Injection
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super();
  }

  // logger display
  async onModuleInit() {
    await this.$connect();
    this.logger.log(
      `${colors.black.bgWhite(envs.typeOfDatabase)} ${colors.white('DATABASE CONNECTED')} ${colors.green('Successfully using')} ${colors.white(envs.typeOfOrm)}`,
    );
  }

  // create a order
  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      //number arrangement - 1. Confirms product ids
      const productIds = createOrderDto.items.map((item) => item.productId);

      const products: any[] = await firstValueFrom(
        this.client.send({ cmd: 'validate_product' }, productIds),
      );

      // 2. value calculations
      const totalAmount = createOrderDto.items.reduce(
        (accumulatedValue, orderDetail) => {
          const price = products.find(
            (product) => product.id == orderDetail.productId,
          ).price;

          return price * orderDetail.quantity;
        },
        0,
      );

      const totalItems = createOrderDto.items.reduce(
        (accumulatedValue, orderDetail) => {
          return accumulatedValue + orderDetail.quantity;
        },
        0,
      );

      // 3. create a transaction in the database
      const order = await this.order.create({
        data: {
          totalAmount: totalAmount,
          totalItems: totalItems,
          OrderDetail: {
            createMany: {
              data: createOrderDto.items.map((orderDetail) => ({
                price: products.find(
                  (product) => product.id == orderDetail.productId,
                ).price,
                productId: orderDetail.productId,
                quantity: orderDetail.quantity,
              })),
            },
          },
        },
        include: {
          OrderDetail: {
            select: {
              productId: true,
              quantity: true,
              price: true,
            },
          },
        },
      });

      return {
        ...order,
        OrderDetail: order.OrderDetail.map((orderDetail) => ({
          ...orderDetail,
          name: products.find((product) => product.id == orderDetail.productId)
            .name,
        })),
      };
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Something went wrong, Check Logs',
        error: error,
      });
    }
  }

  // find All orders
  async findAllOrders(orderPaginationDto: OrderPaginationDto) {
    // Pagination using Prisma

    // Total Pages
    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status,
      },
    });

    // Page
    const page = orderPaginationDto.page;

    // Limit Pages
    const limit = orderPaginationDto.limit;

    // Last Pages
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.order.findMany({
        skip: (page - 1) * limit, // how many records per page
        take: limit,
        where: {
          status: orderPaginationDto.status,
        },
      }),
      meta: {
        totalPages: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  // find One order by ID
  async findOneOrder(id: string) {
    const order = await this.order.findFirst({
      where: { id },
      include: {
        OrderDetail: {
          select: {
            productId: true,
            quantity: true,
            price: true,
          },
        },
      },
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with ID ${id}, Not Found...!!!`,
      });
    }

    const productIds = order.OrderDetail.map(
      (orderDetail) => orderDetail.productId,
    );

    const products: any[] = await firstValueFrom(
      this.client.send({ cmd: 'validate_product' }, productIds),
    );

    return {
      ...order,
      OrderDetail: order.OrderDetail.map((orderDetail) => ({
        ...orderDetail,
        name: products.find((product) => product.id == orderDetail.productId)
          .name,
      })),
    };
  }

  // change Order Status (UPDATE-PATCH)
  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;

    const order = await this.findOneOrder(id);

    if (order.status === status) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: { status: status },
    });
  }
}
