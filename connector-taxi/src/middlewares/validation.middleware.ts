import { Request, Response, NextFunction } from "express";
import Joi, { Schema } from "joi";

// Универсальный middleware для валидации по Joi-схеме
export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    next();
  };
};
