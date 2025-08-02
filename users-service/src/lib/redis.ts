import { Redis } from "ioredis";
import { User } from "../types/users.interface.js";

const redis = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

type AsyncFunction = (...args: any[]) => Promise<any>;

export function redisCache(
  keyBuilder: (...args: any[]) => string,
  ttl: number = 3600
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value as AsyncFunction;

    if (typeof originalMethod !== "function") {
      throw new Error("Decorator can only be applied to methods");
    }

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyBuilder(...args);

      try {
        // Проверяем кэш
        const cached = await redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }

        // Вызываем оригинальный метод
        const result = await originalMethod.apply(this, args);

        // Кэшируем результат, если он не пустой
        if (result !== undefined && result !== null) {
          await redis.setex(cacheKey, ttl, JSON.stringify(result));
        }

        return result;
      } catch (error) {
        console.error(`Cache failed for ${cacheKey}:`, error);
        // В случае ошибки кэширования, возвращаем оригинальный результат
        return originalMethod.apply(this, args);
      }
    };
    return descriptor;
  };
}

export async function getCachedUser(userId: number): Promise<User | null> {
  const key = `user:${userId}`;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function cacheUser(user: User, ttl: number = 3600): Promise<void> {
  await redis.setex(`user:${user.id}`, ttl, JSON.stringify(user));
}

export async function invalidateUserCache(userId: number): Promise<void> {
  await redis.del(`user:${userId}`);
}

export async function cacheAllUsers(users: User[]): Promise<void> {
  const pipeline = redis.pipeline();
  users.forEach((user) => {
    pipeline.setex(`user:${user.id}`, 3600, JSON.stringify(user));
  });
  await pipeline.exec();
}

export default redis;
