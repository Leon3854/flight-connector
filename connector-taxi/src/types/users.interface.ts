import { Request } from "express";

export interface User {
  id: string;
  email: string;
  role?: string;
}

export interface AuthValidateResponse {
  user: User;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
