import express from "express";
import dotenv from "dotenv";
import { userController } from "./service/user-service/user.controller.js";
import knex, { migrate, seed } from "@src/database/knex.js";
import "reflect-metadata";

dotenv.config();

const app = express();
const port = process.env.PORT || 3202;

app.use(express.json());
app.get("/users/:id", userController.getById.bind(userController));
app.post("/users", userController.create.bind(userController));

// Функция запуска сервера
export const startServer = async () => {
  await migrate.latest();
  await seed.run();

  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

// Универсальная проверка на прямой запуск
const isMainModule = () => {
  // Для ES модулей
  if (typeof import.meta?.url === "string") {
    return import.meta.url === `file://${process.argv[1]}`;
  }
  // Для CommonJS
  return require.main === module;
};

if (isMainModule()) {
  startServer().catch(console.error);
}

// Запуск только если файл исполняется напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch(console.error);
}
