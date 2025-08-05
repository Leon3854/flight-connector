import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { logger } from "../lib/logger.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err.stack);

  if (err instanceof ZodError) {
    const validationError = fromZodError(err);
    return res.status(400).json({
      error: "Validation failed",
      details: validationError.details,
    });
  }

  // Обработка других типов ошибок
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
}
