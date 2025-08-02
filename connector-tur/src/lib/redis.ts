import { Redis } from "ioredis";
import env from "../config/env/env.js";

class RedisService {
  private client: Redis;
  public isConnected = false;

  constructor() {
    this.client = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      // Дополнительные опции при необходимости:
      // retryStrategy: (times) => Math.min(times * 50, 2000),
      // reconnectOnError: (err) => {
      //   const targetErrors = [/READONLY/, /ETIMEDOUT/];
      //   return targetErrors.some(pattern => pattern.test(err.message));
      // }
    });

    this.client.on("connect", () => {
      this.isConnected = true;
      console.log("Redis connected successfully");
    });

    this.client.on("error", (err: Error) => {
      console.error("Redis Client Error", err);
      this.isConnected = false;
    });

    this.client.on("end", () => {
      this.isConnected = false;
      console.log("Redis connection closed");
    });
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected) return null;
    return this.client.get(key);
  }

  async setex(key: string, seconds: number, value: string): Promise<void> {
    if (!this.isConnected) return;
    await this.client.setex(key, seconds, value);
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected) return;
    await this.client.del(key);
  }

  async quit(): Promise<void> {
    if (!this.isConnected) return;
    await this.client.quit();
    this.isConnected = false;
  }
}

export const redisService = new RedisService();
