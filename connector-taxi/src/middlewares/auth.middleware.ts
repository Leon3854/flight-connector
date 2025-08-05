import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { z, ZodError } from "zod";
import { User } from "../types/users.interface.js";
import { redisService } from "../lib/redis.js";

const AuthValidateSchema = z.object({
  user: z.object({
    id: z.uuid(),
    email: z.email(),
    role: z.enum(["user", "admin", "driver"]).optional(),
    phone: z.string().optional(),
  }),
});

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const USERS_SERVICE_URL =
      process.env.USERS_SERVICE_URL || "http://user-service:3201";

    if (!req.headers.authorization) {
      res.status(401).json({ error: "Authorization header is required" });
      return;
    }

    // Проверка кэша Redis
    const cacheKey = `auth:${req.headers.authorization}`;
    const cachedUser = await redisService.get(cacheKey);

    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next();
    }

    // Запрос к микросервису пользователей
    const authResponse = await axios.get<{ user: User }>(
      `${USERS_SERVICE_URL}/auth/validate`,
      {
        headers: { Authorization: req.headers.authorization },
        timeout: 5000, // Таймаут 5 секунд
      }
    );

    // Валидация ответа
    const validatedData = AuthValidateSchema.parse(authResponse.data);
    req.user = validatedData.user;

    // Кэширование на 15 минут
    await redisService.setex(
      cacheKey,
      900, // 15 минут
      JSON.stringify(validatedData.user)
    );

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error instanceof ZodError) {
      res.status(400).json({ error: "Invalid data format", details: error });
      return;
    }

    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 502).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
  }
}
