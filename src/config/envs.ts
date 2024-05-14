// environment variable configuration

import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  // orders microservice
  PORT: number;

  // NATS Servers
  NATS_SERVERS: string[];

  // products microservice
  // PRODUCTS_MICROSERVICE_HOST: string;
  // PRODUCTS_MICROSERVICE_PORT: number;

  //  Database Url
  DATABASE_URL: string;

  // Type of database
  TYPE_OF_DATABASE: string;
  TYPE_OF_ORM: string;
}

// validation by scheme using joi
const envsSchema = joi
  .object({
    PORT: joi.number().required(),

    NATS_SERVERS: joi.array().items(joi.string()).required(),

    // PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
    // PRODUCTS_MICROSERVICE_PORT: joi.number().required(),

    DATABASE_URL: joi.string().required(),

    TYPE_OF_DATABASE: joi.string().required(),
    TYPE_OF_ORM: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  natsServers: envVars.NATS_SERVERS,

  // productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
  // productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,

  databaseUrl: envVars.DATABASE_URL,

  typeOfDatabase: envVars.TYPE_OF_DATABASE,
  typeOfOrm: envVars.TYPE_OF_ORM,
};
