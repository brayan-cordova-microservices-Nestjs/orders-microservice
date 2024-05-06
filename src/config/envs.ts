// environment variable configuration

import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  TYPE_OF_DATABASE: string;
  TYPE_OF_ORM: string;
}

// validation by scheme using joi
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    TYPE_OF_DATABASE: joi.string().required(),
    TYPE_OF_ORM: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  typeOfDatabase: envVars.TYPE_OF_DATABASE,
  typeOfOrm: envVars.TYPE_OF_ORM,
};
