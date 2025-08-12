import type { Knex } from "knex";
import path from "path";
import dotenv from "dotenv";

// Загружаем переменные окружения
dotenv.config();

// Получаем __dirname в ES модулях
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Базовые настройки (без connection)
const commonConfig: Partial<Knex.Config> = {
  client: "pg",
  migrations: {
    directory: path.resolve(__dirname, "../database/migrations"),
    extension: "ts",
    disableTransactions: false,
    loadExtensions: [".ts"],
  },
  seeds: {
    directory: path.resolve(__dirname, "../database/seeds"),
    extension: "ts",
    loadExtensions: [".ts"],
  },
};

console.log(
  "Migrations dir:",
  path.resolve(__dirname, "../database/migrations")
);
console.log("Seeds dir:", path.resolve(__dirname, "../database/seeds"));

const config: { [key: string]: Knex.Config } = {
  development: {
    ...commonConfig,
    connection: {
      host: process.env.DB_HOST || "db",
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "123456",
      database: process.env.DB_NAME || "flight-connector",
    },
    debug: true,
  },
  test: {
    ...commonConfig,
    connection: {
      host: process.env.DB_HOST || "test-db",
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "123456",
      database: process.env.DB_NAME || "flight-connector-test",
    },
  },
  production: {
    ...commonConfig,
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || "db",
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "123456",
      database: process.env.DB_NAME || "flight-connector",
    },
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
    },
  },
};

export default config;
