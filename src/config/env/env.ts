import dotenv from "dotenv";
import z from "zod";

dotenv.config();

// схема валидации и трансформации переменных окружения с помощью Zod.
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
});

// Проверяем и преобразовываем переменных окружения
const env = envSchema.parse({
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  NODE_ENV: process.env.NODE_ENV,
  APP_PORT: process.env.APP_PORT,
});

export default env;
