import type { Knex } from "knex";
import path from "path";
import { fileURLToPath } from "url";

// Получаем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commonConfig: Partial<Knex.Config> = {
  client: "pg",
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
    connection: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT || "5432"),
    },
    debug: true, // Логирование SQL для разработки
  },

  production: {
    ...commonConfig,
    connection: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT || "5432"),
    },
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
    },
  },
};
export default config;
