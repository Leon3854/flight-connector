import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { z } from "zod";
import { User } from "../types/users.interface.js";

// Новая версия схемы валидации с актуальным синтаксисом Zod
const AuthValidateSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(), // Новый синтаксис .email() без параметров
  }),
});

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!process.env.USERS_SERVICE_URL) {
      throw new Error("USERS_SERVICE_URL is not defined");
    }

    if (!req.headers.authorization) {
      res.status(401).json({ error: "Authorization header is required" });
      return;
    }

    const authResponse = await axios.get<{ user: User }>(
      `${process.env.USERS_SERVICE_URL}/auth/validate`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    const validatedData = AuthValidateSchema.parse(authResponse.data);
    req.user = validatedData.user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      if (status === 401) {
        res.status(401).json({ error: "Invalid token", details: message });
      } else {
        res.status(502).json({
          error: "User service unavailable",
          details: message,
        });
      }
      return;
    }

    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Invalid user data format",
        details: error.flatten(),
      });
      return;
    }

    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
