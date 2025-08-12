// test/unit/user.service.test.ts
// import "reflect-metadata";
import { UserService } from "../../src/service/user-service/user.service";
// import { jest } from "@jest/globals";
// import type { Knex } from "knex";

// 1. Отключаем проверку типов для всего файла
// @ts-nocheck

// 2. Простые моки без сложных типов
jest.mock("../../src/database/knex", () => ({
  __esModule: true,
  default: () => ({
    select: jest.fn(function () {
      return this;
    }),
    from: jest.fn(function () {
      return this;
    }),
    where: jest.fn(function () {
      return this;
    }),
    first: jest.fn().mockResolvedValue({
      id: 1,
      username: "testuser",
      // ... другие поля
    }),
    insert: jest.fn(function () {
      return this;
    }),
    update: jest.fn(function () {
      return this;
    }),
    delete: jest.fn(function () {
      return this;
    }),
    returning: jest.fn().mockResolvedValue([{ id: 1 }]),
  }),
}));

jest.mock("../../src/lib/redis", () => ({
  __esModule: true,
  cacheUser: jest.fn(),
  invalidateUserCache: jest.fn(),
}));

describe("UserService", () => {
  let service: UserService;

  beforeAll(() => {
    // Убедитесь, что reflect-metadata загружена
    if (typeof Reflect.getOwnMetadata !== "function") {
      require("reflect-metadata");
    }
  });

  beforeEach(() => {
    service = new UserService();
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should return user when exists", async () => {
      const result = await service.findById(1);
      expect(result).toEqual(
        expect.objectContaining({
          id: 1,
          username: "testuser",
        })
      );
    });

    it("should throw error when user not found", async () => {
      require("../../src/database/knex")
        .default()
        .first.mockResolvedValueOnce(null);
      await expect(service.findById(1)).rejects.toThrow("User not found");
    });
  });
});
//
//
//
//
//
// import "reflect-metadata";
// import { jest } from "@jest/globals";
// import type { User } from "../../src/types/users.interface";
// import { UserService } from "@/service/user-service/user.service";

// // 1. Мок пользователя без сложных типов
// const mockUser = {
//   id: 1,
//   username: "testuser",
//   email: "test@example.com",
//   first_name: "Test",
//   last_name: "User",
//   imei: "123456789012345",
//   phone: "+1234567890",
//   address: "Test City, Test Street",
//   company: "Test Company",
//   country: "Россия",
//   avatar: "https://example.com/avatar.jpg",
//   created_at: new Date(),
//   updated_at: new Date(),
// };
// // 2. Простой мок Knex без строгой типизации
// const createMockKnex = () => ({
//   select: jest.fn(function () {
//     return this;
//   }),
//   from: jest.fn(function () {
//     return this;
//   }),
//   where: jest.fn(function () {
//     return this;
//   }),
//   first: jest.fn(() => Promise.resolve(mockUser)),
//   insert: jest.fn(function () {
//     return this;
//   }),
//   update: jest.fn(function () {
//     return this;
//   }),
//   delete: jest.fn(function () {
//     return this;
//   }),
//   returning: jest.fn(() => Promise.resolve([mockUser])),
//   getMockUser: () => ({ ...mockUser }),
// });

// // 3. Мокируем модули
// jest.mock("../../src/database/knex", () => ({
//   __esModule: true,
//   default: createMockKnex(),
// }));

// jest.mock("../../src/lib/redis", () => ({
//   __esModule: true,
//   cacheUser: jest.fn(),
//   invalidateUserCache: jest.fn(),
//   redisCache: jest.fn(),
// }));

// describe("UserService", () => {
//   let service: UserService;
//   let knexInstance: ReturnType<typeof createMockKnex>;

//   beforeEach(() => {
//     // Полностью отключаем типизацию для knexInstance
//     knexInstance = require("../../src/database/knex").default as any;
//     service = new UserService();
//     jest.clearAllMocks();
//   });
//   describe("findById", () => {
//     it("should return user when exists", async () => {
//       const user = knexInstance.getMockUser();

//       // Альтернативный способ настройки мока без проблем с типами
//       knexInstance.first.mockImplementationOnce(() => Promise.resolve(user));

//       const result = await service.findById(1);

//       expect(result).toEqual(user);
//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.first).toHaveBeenCalled();
//     });

//     it("should throw error when user not found", async () => {
//       knexInstance.first.mockImplementationOnce(() => Promise.resolve(null));

//       await expect(service.findById(1)).rejects.toThrow("User not found");
//     });
//   });
//   describe("update", () => {
//     it("should update user", async () => {
//       const user = knexInstance.getMockUser();
//       knexInstance.first.mockImplementationOnce(() => Promise.resolve(user));

//       const updateData = { first_name: "Updated" };
//       await service.update(1, updateData);

//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.update).toHaveBeenCalledWith(updateData);
//     });
//   });

//   afterAll(async () => {
//     // Очищаем асинхронные операции
//     await new Promise((resolve) => setTimeout(resolve, 100));
//   });
// });
//
//
//
//
// import "reflect-metadata";
// import { jest } from "@jest/globals";
// import type { User } from "../../src/types/users.interface";

// // 1. Простейший тип для Knex мока без сложных зависимостей
// type KnexMock = {
//   [key: string]: any; // Разрешаем любые методы
//   select: jest.Mock;
//   from: jest.Mock;
//   where: jest.Mock;
//   first: jest.Mock;
//   insert: jest.Mock;
//   update: jest.Mock;
//   delete: jest.Mock;
//   returning: jest.Mock;
//   getMockUser: () => User;
// };

// // 2. Создаем мок без строгой типизации
// const createMockKnex = (): KnexMock => {
//   const mockUser: User = {
//     id: 1,
//     username: "testuser",
//     email: "test@example.com",
//     first_name: "Test",
//     last_name: "User",
//     imei: "123456789012345",
//     phone: "+1234567890",
//     address: "Test City, Test Street",
//     company: "Test Company",
//     country: "Россия",
//     avatar: "https://example.com/avatar.jpg",
//     created_at: new Date(),
//     updated_at: new Date(),
//   };

//   const mock: KnexMock = {
//     select: jest.fn().mockReturnThis(),
//     from: jest.fn().mockReturnThis(),
//     where: jest.fn().mockReturnThis(),
//     first: jest.fn(),
//     insert: jest.fn().mockReturnThis(),
//     update: jest.fn().mockReturnThis(),
//     delete: jest.fn().mockReturnThis(),
//     returning: jest.fn(),
//     getMockUser: () => ({ ...mockUser }),
//   };

//   // Настраиваем возвращаемые значения без строгой типизации
//   (mock.first as jest.Mock<any>).mockResolvedValue(mockUser);
//   (mock.returning as jest.Mock<any>).mockResolvedValue([mockUser]);

//   return mock;
// };

// // 3. Мок Redis
// const mockRedis = {
//   cacheUser: jest.fn(),
//   invalidateUserCache: jest.fn(),
//   redisCache: jest.fn(),
// };

// // 4. Мокируем модули
// jest.mock("../../src/database/knex", () => ({
//   __esModule: true,
//   default: createMockKnex(),
// }));

// jest.mock("../../src/lib/redis", () => ({
//   __esModule: true,
//   ...mockRedis,
// }));

// // 5. Импортируем сервис
// import { UserService } from "../../src/service/user-service/user.service";

// describe("UserService", () => {
//   let service: UserService;
//   let knexInstance: KnexMock;

//   beforeEach(() => {
//     knexInstance = require("../../src/database/knex").default;
//     service = new UserService();
//     jest.clearAllMocks();
//   });

//   describe("findById", () => {
//     it("should return user when exists", async () => {
//       const mockUser = knexInstance.getMockUser();
//       knexInstance.first.mockResolvedValueOnce(mockUser);

//       const result = await service.findById(1);

//       expect(result).toEqual(mockUser);
//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.first).toHaveBeenCalled();
//     });
//   });
// });
//
//
//
//
// import "reflect-metadata";
// import { jest } from "@jest/globals";
// import type { User } from "../../src/types/users.interface";

// // 1. Правильный тип для Knex мока
// interface KnexMock {
//   select: jest.Mock<KnexMock>;
//   from: jest.Mock<KnexMock>;
//   where: jest.Mock<KnexMock>;
//   first: jest.Mock<Promise<User | null>>;
//   insert: jest.Mock<KnexMock>;
//   update: jest.Mock<KnexMock>;
//   delete: jest.Mock<KnexMock>;
//   returning: jest.Mock<Promise<User[]>>;
//   getMockUser: () => User;
// }

// // 2. Создаем мок Knex
// const createMockKnex = () => {
//   const mockUser: User = {
//     id: 1,
//     username: "testuser",
//     email: "test@example.com",
//     first_name: "Test",
//     last_name: "User",
//     imei: "123456789012345",
//     phone: "+1234567890",
//     address: "Test City, Test Street",
//     company: "Test Company",
//     country: "Россия",
//     avatar: "https://example.com/avatar.jpg",
//     created_at: new Date(),
//     updated_at: new Date(),
//   };

//   const mock = {
//     select: jest.fn().mockReturnThis(),
//     from: jest.fn().mockReturnThis(),
//     where: jest.fn().mockReturnThis(),
//     first: jest.fn(),
//     insert: jest.fn().mockReturnThis(),
//     update: jest.fn().mockReturnThis(),
//     delete: jest.fn().mockReturnThis(),
//     returning: jest.fn(),
//     getMockUser: () => ({ ...mockUser }),
//   };

//   // Настраиваем дефолтные значения
//   (mock.first as jest.Mock<any>).mockResolvedValue(mockUser);
//   (mock.returning as jest.Mock<any>).mockResolvedValue([mockUser]);

//   return mock;
// };

// const mockRedis = {
//   cacheUser: jest.fn() as jest.Mock<any>,
//   invalidateUserCache: jest.fn() as jest.Mock<any>,
//   redisCache: jest.fn(),
// };

// // 4. Мокируем модули
// jest.mock("../../src/database/knex", () => ({
//   __esModule: true,
//   default: createMockKnex(),
// }));

// jest.mock("../../src/lib/redis", () => ({
//   __esModule: true,
//   ...mockRedis,
// }));

// // 5. Импортируем сервис
// import { UserService } from "../../src/service/user-service/user.service";

// describe("UserService", () => {
//   let service: UserService;
//   let knexInstance: KnexMock;

//   beforeEach(() => {
//     knexInstance = require("../../src/database/knex").default;
//     service = new UserService();
//     jest.clearAllMocks();
//   });

//   describe("findById", () => {
//     it("should return user when exists", async () => {
//       const mockUser = knexInstance.getMockUser();
//       knexInstance.first.mockResolvedValueOnce(mockUser);

//       const result = await service.findById(1);

//       expect(result).toEqual(mockUser);
//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.first).toHaveBeenCalled();
//       expect(mockRedis.cacheUser).toHaveBeenCalledWith(mockUser);
//     });

//     it("should throw error when user not found", async () => {
//       knexInstance.first.mockResolvedValueOnce(null);

//       await expect(service.findById(1)).rejects.toThrow("User not found");
//       expect(mockRedis.cacheUser).not.toHaveBeenCalled();
//     });
//   });

//   describe("update", () => {
//     it("should update user", async () => {
//       const mockUser = knexInstance.getMockUser();
//       knexInstance.first.mockResolvedValueOnce(mockUser);

//       const updateData = { first_name: "Updated" };
//       await service.update(1, updateData);

//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.update).toHaveBeenCalledWith(updateData);
//       expect(mockRedis.cacheUser).toHaveBeenCalledWith(mockUser);
//     });
//   });

//   describe("delete", () => {
//     it("should delete user and invalidate cache", async () => {
//       knexInstance.delete.mockResolvedValueOnce(1);

//       await service.delete(1);

//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.delete).toHaveBeenCalled();
//       expect(mockRedis.invalidateUserCache).toHaveBeenCalledWith(1);
//     });

//     it("should handle cache invalidation error", async () => {
//       knexInstance.delete.mockResolvedValueOnce(1);
//       mockRedis.invalidateUserCache.mockRejectedValueOnce(
//         new Error("Cache error")
//       );

//       await expect(service.delete(1)).resolves.not.toThrow();
//     });
//   });
// });
//
//
//
//
//
// import "reflect-metadata";
// import { jest } from "@jest/globals";
// import type { User } from "../../src/types/users.interface";

// // 1. Правильное мокирование inversify
// jest.mock("inversify", () => ({
//   injectable: () => (target: any) => target,
//   inject: () => () => {},
//   decorate: () => () => {},
// }));

// // 1. Упрощенный тип для Jest моков
// type JestMock<T = any> = jest.Mock<any> & {
//   mockReturnThis: () => JestMock<T>;
// };

// // 2. Хелпер для создания моков
// const createMock = <T = any>(): JestMock<T> => {
//   const mock = jest.fn() as JestMock<T>;
//   mock.mockReturnThis = () => mock;
//   return mock;
// };
// // 3. Объявляем моки (включая Redis)
// const mockRedis = {
//   cacheUser: jest.fn(),
//   redisCache: jest.fn(),
//   invalidateUserCache: jest.fn(),
// };

// // 3. Тип для Knex мока
// // interface KnexMock {
// //   select: JestMock<KnexMock>;
// //   from: JestMock<KnexMock>;
// //   where: JestMock<KnexMock>;
// //   first: JestMock<Promise<User | null>>;
// //   insert: JestMock<KnexMock>;
// //   update: JestMock<KnexMock>;
// //   delete: JestMock<KnexMock>;
// //   returning: JestMock<Promise<User[]>>;
// //   getMockUser: () => User;
// // }

// // 4. Создание мока Knex без циклических зависимостей
// const createMockKnex = () => {
//   const mockUser: User = {
//     id: 1,
//     username: "testuser",
//     email: "test@example.com",
//     first_name: "Test",
//     last_name: "User",
//     imei: "123456789012345",
//     phone: "+1234567890",
//     address: "Test City, Test Street",
//     company: "Test Company",
//     country: "Россия",
//     avatar: "https://example.com/avatar.jpg",
//     created_at: new Date(),
//     updated_at: new Date(),
//   };

//   // Создаем пустой объект
//   const mock = {
//     select: jest.fn().mockReturnThis(),
//     from: jest.fn().mockReturnThis(),
//     where: jest.fn().mockReturnThis(),
//     first: jest.fn().mockResolvedValue(mockUser),
//     insert: jest.fn().mockReturnThis(),
//     update: jest.fn().mockReturnThis(),
//     delete: jest.fn().mockReturnThis(),
//     returning: jest.fn().mockResolvedValue([mockUser]),
//     getMockUser: () => ({ ...mockUser }),
//   };

//   return mock;
// };

// // 6. Мокируем модули
// jest.mock("../../src/database/knex", () => ({
//   __esModule: true,
//   default: createMockKnex(),
// }));

// jest.mock("../../src/lib/redis", () => ({
//   __esModule: true,
//   ...mockRedis,
// }));

// // 7. Импортируем тестируемые сервисы
// import { UserService } from "../../src/service/user-service/user.service";
// // import { cacheUser, invalidateUserCache } from "../../src/lib/redis";

// describe("UserService", () => {
//   let service: UserService;
//   let knexInstance: ReturnType<typeof createMockKnex>;

//   beforeEach(() => {
//     knexInstance = require("../../src/database/knex").default;
//     service = new UserService();
//     jest.clearAllMocks();
//   });
//   describe("findById", () => {
//     it("should return user when exists", async () => {
//       const mockUser = knexInstance.getMockUser();
//       knexInstance.first.mockResolvedValue(mockUser);

//       const result = await service.findById(1);

//       expect(result).toEqual(mockUser);
//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.first).toHaveBeenCalled();
//       expect(mockRedis.cacheUser).toHaveBeenCalledWith(mockUser);
//     });

//     it("should throw error when user not found", async () => {
//       knexInstance.first.mockResolvedValue(null);

//       await expect(service.findById(1)).rejects.toThrow("User not found");
//       expect(mockRedis.cacheUser).not.toHaveBeenCalled();
//     });
//   });

//   describe("update", () => {
//     it("should update user", async () => {
//       const mockUser = knexInstance.getMockUser();
//       knexInstance.first.mockResolvedValue(mockUser);

//       const updateData = { first_name: "Updated" };
//       await service.update(1, updateData);

//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.update).toHaveBeenCalledWith(updateData);
//       expect(mockRedis.cacheUser).toHaveBeenCalledWith(mockUser);
//     });
//   });

//   describe("getAll", () => {
//     it("should return all users", async () => {
//       const mockUser = knexInstance.getMockUser();
//       knexInstance.select.mockResolvedValue([mockUser]);

//       const result = await service.getAll();
//       expect(result).toEqual([mockUser]);
//       // Для getAll кеширование обычно не проверяется
//     });
//   });

//   describe("delete", () => {
//     it("should delete user and invalidate cache", async () => {
//       knexInstance.delete.mockResolvedValue(1);

//       await service.delete(1);

//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.delete).toHaveBeenCalled();
//       expect(mockRedis.invalidateUserCache).toHaveBeenCalledWith(1);
//     });

//     it("should throw error when user not found", async () => {
//       knexInstance.delete.mockResolvedValue(0);

//       await expect(service.delete(1)).rejects.toThrow("User not found");
//       expect(mockRedis.invalidateUserCache).not.toHaveBeenCalled();
//     });

//     it("should handle cache invalidation error gracefully", async () => {
//       knexInstance.delete.mockResolvedValue(1);
//       mockRedis.invalidateUserCache.mockRejectedValue(new Error("Cache error"));

//       await expect(service.delete(1)).resolves.not.toThrow();
//       expect(mockRedis.invalidateUserCache).toHaveBeenCalledWith(1);
//     });
//   });
// });
//
//
//
//
//
// import "reflect-metadata";
// import { jest } from "@jest/globals";
// import type { User } from "../../src/types/users.interface";

// // 1. Типы и моки
// interface JestMock<T = any> extends jest.Mock<T> {
//   mockResolvedValue: (value: T extends Promise<infer U> ? U : T) => JestMock<T>;
//   mockReturnThis: () => JestMock<T>;
// }

// // type JestMock<T = any> = jest.Mock<T> & {
// //   mockResolvedValue: (value: T extends Promise<infer U> ? U : T) => JestMock<T>;
// //   mockReturnThis: () => JestMock<T>;
// // };

// const createMock = <T = any>(): JestMock<T> => {
//   const mock = jest.fn() as unknown as JestMock<T>;
//   mock.mockReturnThis = () => mock;
//   mock.mockResolvedValue = (value) => {
//     mock.mockResolvedValueOnce(value);
//     return mock;
//   };
//   return mock;
// };

// interface KnexMock {
//   select: JestMock;
//   from: JestMock;
//   where: JestMock;
//   first: JestMock<Promise<User | null>>;
//   insert: JestMock;
//   update: JestMock;
//   delete: JestMock;
//   returning: JestMock<Promise<User[]>>;
//   getMockUser: () => User;
// }

// const createMockKnex = (): KnexMock => {
//   const mockUser: User = {
//     id: 1,
//     username: "testuser",
//     email: "test@example.com",
//     first_name: "Test",
//     last_name: "User",
//     imei: "123456789012345",
//     phone: "+1234567890",
//     address: "Test City, Test Street",
//     company: "Test Company",
//     country: "Россия",
//     avatar: "https://example.com/avatar.jpg",
//     created_at: new Date(),
//     updated_at: new Date(),
//   };

//   return {
//     select: createMock().mockReturnThis(),
//     from: createMock().mockReturnThis(),
//     where: createMock().mockReturnThis(),
//     first: createMock<Promise<User | null>>().mockResolvedValue(mockUser),
//     insert: createMock().mockReturnThis(),
//     update: createMock().mockReturnThis(),
//     delete: createMock().mockReturnThis(),
//     returning: createMock<Promise<User[]>>().mockResolvedValue([mockUser]),
//     getMockUser: () => ({ ...mockUser }),
//   };
// };

// const mockRedis = {
//   cacheUser: jest.fn(),
//   redisCache: jest.fn(),
//   invalidateUserCache: jest.fn(),
// };

// // 2. Мокируем модули
// jest.mock("../../src/database/knex", () => ({
//   __esModule: true,
//   default: createMockKnex(),
// }));

// jest.mock("../../src/lib/redis", () => mockRedis);

// // 3. Импортируем тестируемые сервисы после моков
// import { UserService } from "../../src/service/user-service/user.service";
// import { cacheUser, invalidateUserCache } from "../../src/lib/redis";

// describe("UserService", () => {
//   let service: UserService;
//   let knexInstance: KnexMock;

//   beforeEach(() => {
//     knexInstance = require("../../src/database/knex").default;
//     service = new UserService();
//     jest.clearAllMocks();
//   });

//   describe("create", () => {
//     it("should create user", async () => {
//       const result = await service.create({
//         username: "testuser",
//         email: "test@example.com",
//         first_name: "Test",
//       });

//       expect(result).toEqual(knexInstance.getMockUser());
//       expect(knexInstance.insert).toHaveBeenCalled();
//       expect(knexInstance.returning).toHaveBeenCalled();
//     });
//   });

//   describe("findById", () => {
//     it("should return user when exists", async () => {
//       const mockUser = knexInstance.getMockUser();
//       knexInstance.first.mockResolvedValue(mockUser);

//       const result = await service.findById(1);

//       expect(result).toEqual(mockUser);
//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.first).toHaveBeenCalled();
//       expect(cacheUser).toHaveBeenCalledWith(mockUser);
//     });

//     it("should throw error when user not found", async () => {
//       knexInstance.first.mockResolvedValue(null);

//       await expect(service.findById(1)).rejects.toThrow("User not found");
//     });
//   });

//   describe("update", () => {
//     it("should update user", async () => {
//       const mockUser = knexInstance.getMockUser();
//       knexInstance.first.mockResolvedValue(mockUser);

//       const updateData = { first_name: "Updated" };
//       await service.update(1, updateData);

//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.update).toHaveBeenCalledWith(updateData);
//       expect(cacheUser).toHaveBeenCalledWith(mockUser);
//     });
//   });

//   describe("getAll", () => {
//     it("should return all users", async () => {
//       const mockUser = knexInstance.getMockUser();
//       knexInstance.select.mockResolvedValue([mockUser]);

//       const result = await service.getAll();
//       expect(result).toEqual([mockUser]);
//     });
//   });

//   describe("delete", () => {
//     it("should delete user and invalidate cache", async () => {
//       knexInstance.where.mockReturnThis();
//       knexInstance.delete.mockResolvedValue(1);

//       await service.delete(1);

//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.delete).toHaveBeenCalled();
//       expect(invalidateUserCache).toHaveBeenCalledWith(1);
//     });

//     it("should throw error when user not found", async () => {
//       knexInstance.delete.mockResolvedValue(0);

//       await expect(service.delete(1)).rejects.toThrow("User not found");
//     });

//     it("should handle cache invalidation error gracefully", async () => {
//       knexInstance.delete.mockResolvedValue(1);
//       mockRedis.invalidateUserCache.mockRejectedValue(new Error("Cache error"));

//       await expect(service.delete(1)).resolves.not.toThrow();
//       expect(invalidateUserCache).toHaveBeenCalledWith(1);
//     });
//   });
// });

// import "reflect-metadata";
// import { jest } from "@jest/globals";
// import { User } from "../../src/types/users.interface";

// // type KnexMock = ReturnType<typeof mockKnex>;

// // type JestMock<T = any> = T extends (...args: any) => any
// //   ? jest.Mock<T>
// //   : jest.Mock<never> & {
// //       mockResolvedValue: (
// //         value: T extends Promise<infer U> ? U : T
// //       ) => JestMock<T>;
// //       mockReturnThis: () => JestMock<T>;
// //     };
// type JestMock<T = any> = jest.Mock<T> & {
//   mockResolvedValue: (value: T extends Promise<infer U> ? U : T) => JestMock<T>;
//   mockReturnThis: () => JestMock<T>;
// };

// // 2. Хелпер для создания моков с правильным типом
// const createMock = <T = any>(): JestMock<T> => {
//   const mock = jest.fn() as unknown as JestMock<T>;
//   mock.mockReturnThis = () => mock;
//   mock.mockResolvedValue = (value) => {
//     mock.mockResolvedValueOnce(value);
//     return mock;
//   };
//   return mock;
// };

// interface KnexMock {
//   select: JestMock;
//   from: JestMock;
//   where: JestMock;
//   first: JestMock<Promise<User>>;
//   insert: JestMock;
//   update: JestMock;
//   delete: JestMock;
//   returning: JestMock<Promise<User[]>>;
//   getMockUser: () => User;
// }

// const createMockKnex = (): KnexMock => {
//   const mockUser: User = {
//     id: 1,
//     username: "testuser",
//     email: "test@example.com",
//     first_name: "Test",
//     last_name: "User",
//     imei: "123456789012345",
//     phone: "+1234567890",
//     address: "Test City, Test Street",
//     company: "Test Company",
//     country: "Россия",
//     avatar: "https://example.com/avatar.jpg",
//     created_at: new Date(),
//     updated_at: new Date(),
//   };

//   return {
//     select: createMock().mockReturnThis(),
//     from: createMock().mockReturnThis(),
//     where: createMock().mockReturnThis(),
//     first: createMock<Promise<User>>().mockResolvedValue(mockUser),
//     insert: createMock().mockReturnThis(),
//     update: createMock().mockReturnThis(),
//     delete: createMock().mockReturnThis(),
//     returning: createMock<Promise<User[]>>().mockResolvedValue([mockUser]),
//     getMockUser: () => ({ ...mockUser }),
//   };
// };

// // const mockUser: User = {
// //   id: 1,
// //   username: "testuser",
// //   email: "test@example.com",
// //   first_name: "Test",
// //   last_name: "User",
// //   imei: "123456789012345",
// //   phone: "+1234567890",
// //   address: "Test City, Test Street",
// //   company: "Test Company",
// //   country: "Россия",
// //   avatar: "https://example.com/avatar.jpg",
// //   created_at: new Date(),
// //   updated_at: new Date(),
// // };

// // const mockKnex = () => {
// //   const firstMock = jest.fn() as unknown as JestMock<Promise<User | null>>;
// //   firstMock.mockResolvedValue(mockUser);

// //   const returningMock = jest.fn() as unknown as JestMock<Promise<User[]>>;
// //   returningMock.mockResolvedValue([mockUser]);

// //   return {
// //     select: jest.fn().mockReturnThis() as unknown as JestMock,
// //     from: jest.fn().mockReturnThis() as unknown as JestMock,
// //     where: jest.fn().mockReturnThis() as unknown as JestMock,
// //     first: firstMock,
// //     insert: jest.fn().mockReturnThis() as unknown as JestMock,
// //     update: jest.fn().mockReturnThis() as unknown as JestMock,
// //     delete: jest.fn().mockReturnThis() as unknown as JestMock,
// //     returning: returningMock,
// //   };
// // };

// // Мокируем модули
// // jest.mock("../../src/database/knex", () => ({
// //   __esModule: true,
// //   default: mockKnex(),
// // }));

// // jest.mock("../../src/lib/redis", () => ({
// //   cacheUser: jest.fn(),
// //   redisCache: jest.fn(),
// //   invalidateUserCache: jest.fn(),
// // }));

// // 3. Теперь импортируем все остальное
// import { UserService } from "../../src/service/user-service/user.service";
// import { cacheUser } from "../../src/lib/redis";

// // Мокируем Knex и Redis
// // jest.mock("../../src/database/knex", () => ({
// //   __esModule: true,
// //   default: mockKnex(),
// //   // default: jest.fn(() => mockKnex()),
// // }));

// // jest.mock("../../src/lib/redis", () => ({
// //   cacheUser: jest.fn(),
// //   redisCache: jest.fn(),
// //   invalidateUserCache: jest.fn(),
// //   // cacheUser: jest.fn(),
// //   // invalidateUserCache: jest.fn(),
// //   // redisCache: jest.fn(
// //   //   () => (target: any, key: string, descriptor: PropertyDescriptor) =>
// //   //     descriptor
// //   // ),
// // }));

// describe("UserService", () => {
//   let service: UserService;
//   let knexInstance: ReturnType<typeof mockKnex>;

//   // beforeEach(() => {
//   //   // Создаем новый экземпляр мока Knex для каждого теста
//   //   knexInstance = mockKnex();
//   //   jest.requireMock("../../src/database/knex").default = knexInstance;
//   //   // (require("../../database/knex").default as jest.Mock).mockReturnValue(
//   //   //   knexInstance
//   //   // );

//   //   service = new UserService();
//   //   jest.clearAllMocks();
//   // });

//   // beforeEach(() => {
//   //   knexInstance = mockKnex();
//   //   (
//   //     jest.requireMock("../../src/database/knex") as { default: KnexMock }
//   //   ).default = knexInstance;
//   //   service = new UserService();
//   //   jest.clearAllMocks();
//   // });

//   beforeEach(() => {
//     knexInstance = require("../../src/database/knex").default;
//     service = new UserService();
//     jest.clearAllMocks();
//   });

//   describe("create", () => {
//     it("should create user", async () => {
//       const knexInstance = mockKnex();

//       const result = await service.create({
//         username: "testuser",
//         email: "test@example.com",
//         first_name: "Test",
//       });

//       expect(result).toEqual(mockUser);
//       // expect(knexInstance.first).toHaveBeenCalled();
//       expect(knexInstance.insert).toHaveBeenCalled();
//       expect(knexInstance.returning).toHaveBeenCalled();
//     });
//   });

//   describe("findById", () => {
//     it("should return user when exists", async () => {
//       knexInstance.first.mockResolvedValue(mockUser);

//       const result = await service.findById(1);

//       expect(result).toEqual(mockUser);
//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.first).toHaveBeenCalled();
//       expect(cacheUser).toHaveBeenCalledWith(mockUser);
//     });

//     it("should throw error when user not found", async () => {
//       knexInstance.first.mockResolvedValue(null);

//       await expect(service.findById(1)).rejects.toThrow("User not found");
//     });
//   });

//   describe("update", () => {
//     it("should update user", async () => {
//       knexInstance.first.mockResolvedValue(mockUser);

//       const updateData = { first_name: "Updated" };
//       await service.update(1, updateData);

//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.update).toHaveBeenCalledWith(updateData);
//       expect(cacheUser).toHaveBeenCalled();
//     });
//   });

//   describe("getAll", () => {
//     it("should return all users", async () => {
//       knexInstance.select.mockResolvedValue([mockUser]);

//       const result = await service.getAll();
//       expect(result).toEqual([mockUser]);
//     });
//   });

//   describe("delete", () => {
//     it("should delete user and invalidate cache", async () => {
//       knexInstance.where.mockReturnThis();
//       knexInstance.delete.mockResolvedValue(1); // 1 - количество удаленных строк

//       await service.delete(1);

//       expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
//       expect(knexInstance.delete).toHaveBeenCalled();

//       const { invalidateUserCache } = require("../../lib/redis");
//       expect(invalidateUserCache).toHaveBeenCalledWith(1);
//     });

//     it("should throw error when user not found", async () => {
//       knexInstance.delete.mockResolvedValue(0); // 0 - ничего не удалено

//       await expect(service.delete(1)).rejects.toThrow("User not found");
//     });

//     it("should handle cache invalidation error gracefully", async () => {
//       knexInstance.delete.mockResolvedValue(1);
//       const { invalidateUserCache } = require("../../lib/redis");
//       invalidateUserCache.mockRejectedValue(new Error("Cache error"));

//       await expect(service.delete(1)).resolves.not.toThrow();
//       expect(invalidateUserCache).toHaveBeenCalledWith(1);
//     });
//   });
// });
