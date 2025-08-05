import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  APP_PORT: z
    .string()
    .regex(/^[0-9]+$/)
    .default("3202")
    .transform((value: string) => parseInt(value)),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z
    .string()
    .regex(/^[0-9]+$/)
    .default("5432")
    .transform((value: string) => parseInt(value)),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  JWT_SECRET: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z
    .string()
    .regex(/^[0-9]+$/)
    .default("6379")
    .transform((value: string) => parseInt(value)),
  YANDEX_TAXI_API_URL: z.url(),
  YANDEX_TAXI_API_KEY: z.string(),
});

const env = envSchema.parse({
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  NODE_ENV: process.env.NODE_ENV,
  APP_PORT: process.env.APP_PORT,
  YANDEX_TAXI_API_URL: process.env.YANDEX_TAXI_API_URL,
  YANDEX_TAXI_API_KEY: process.env.YANDEX_TAXI_API_KEY,
});

export const envConfig = {
  travelApi: {
    baseUrl: env.YANDEX_TAXI_API_URL,
    apiKey: env.YANDEX_TAXI_API_KEY,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
  db: {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
  },
  app: {
    port: env.APP_PORT,
    env: env.NODE_ENV,
  },
} as const;

export default env;
