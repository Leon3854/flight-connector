import express from "express";
import { envConfig } from "./config/env/env.js";
import db from "./database/db_knex.js";
import { redisService } from "./lib/redis.js"; // Исправляем импорт
import { travelController } from "./travel-service/travel-controller.api.js";
import { authenticate } from "./middlewares/auth.middleware.js";

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Пример защищённого роута
  app.get("/api/protected", authenticate, (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    res.json({
      message: "Access granted",
      user: req.user,
    });
  });

  // Routes
  app.get(
    "/flights/search",
    travelController.searchFlights.bind(travelController)
  );
  app.post(
    "/flights/cache/clear",
    travelController.clearCache.bind(travelController)
  );

  // Health checks
  app.get("/health", async (_req, res) => {
    const dbHealthy = await db
      .raw("SELECT 1")
      .then(() => true)
      .catch(() => false);
    const redisHealthy = redisService.isConnected;

    res.json({
      status: "OK",
      db: dbHealthy ? "healthy" : "unhealthy",
      redis: redisHealthy ? "healthy" : "unhealthy",
    });
  });

  // Проверка подключений
  try {
    await db.raw("SELECT 1");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }

  // Для ioredis проверка соединения
  if (redisService.isConnected) {
    console.log("Redis connected successfully");
  } else {
    console.error("Redis connection failed");
    process.exit(1);
  }

  // Запуск сервера
  app.listen(envConfig.app.port, () => {
    console.log(`Travel API connector running on port ${envConfig.app.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
