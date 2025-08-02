import type { Knex } from "knex";
import path from "path";
import { fileURLToPath } from "url";

// Получаем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commonConfig: Partial<Knex.Config> = {
  client: "pg",
  connection: {
    host: "db", // Явно указываем имя сервиса
    port: 5432,
    user: "postgres",
    password: "123456",
    database: "flight-connector",
  },
  migrations: {
    directory: path.resolve(__dirname, "../../database/migrations"),
    extension: "ts",
    disableTransactions: false,
    loadExtensions: [".ts"],
  },
  seeds: {
    directory: path.resolve(__dirname, "../../database/seeds"),
    extension: "ts",
    loadExtensions: [".ts"],
  },
};

console.log(
  "Migrations dir:",
  path.resolve(__dirname, "../../database/migrations")
);
console.log("Seeds dir:", path.resolve(__dirname, "../../database/seeds"));

const config: { [key: string]: Knex.Config } = {
  development: {
    ...commonConfig,
    connection:
      process.env.DATABASE_URL ||
      `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
    debug: true,
  },
  production: {
    ...commonConfig,
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || "db",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "5432"),
    },
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
    },
  },
} as { [key: string]: Knex.Config };

export default config;
