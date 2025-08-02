import "reflect-metadata";
import express from "express";
import { userController } from "./service/user-service/user.controller.js";
import { migrate, seed } from "./database/knex.js";
import _knex from "./database/knex.js";

const knex = _knex;
// Инициализация приложения
const app = express();
const port = parseInt(process.env.PORT || "3202");

// Middleware
app.use(express.json());

// Routes
app.get("/users/:id", userController.getById.bind(userController));
app.post("/users", userController.create.bind(userController));
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

// Проверка подключения к БД
const testConnection = async () => {
  try {
    await knex.raw("SELECT 1");
    console.log("✅ PostgreSQL connection successful");
    console.log(
      "✅ PostgreSQL connected at:",
      process.env.DATABASE_URL?.replace(/:\/\/[^:]+:[^@]+@/, "://***:***@")
    );
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err);
    process.exit(1);
  }
};

// Запуск сервера
const startServer = async () => {
  console.log("Starting server with config:", {
    port,
    dbHost: process.env.POSTGRES_HOST,
    dbPort: process.env.POSTGRES_PORT,
  });

  await testConnection();
  await migrate.latest();
  await seed.run();

  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

// Автозапуск при прямом вызове
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch((err) => {
    console.error("Fatal error during startup:", err);
    process.exit(1);
  });
}

export { app, startServer };
