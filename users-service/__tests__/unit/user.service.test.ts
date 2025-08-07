import { jest } from "@jest/globals";
import { UserService } from "../../src/service/user-service/user.service.js";
import { cacheUser } from "../../src/lib/redis.js";
import { User } from "../../src/types/users.interface.js";

type JestMock<T = any> = T extends (...args: any) => any
  ? jest.Mock<T>
  : jest.Mock<never> & {
      mockResolvedValue: (
        value: T extends Promise<infer U> ? U : T
      ) => JestMock<T>;
      mockReturnThis: () => JestMock<T>;
    };

const mockUser: User = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  first_name: "Test",
  last_name: "User",
  imei: "123456789012345",
  phone: "+1234567890",
  address: "Test City, Test Street",
  company: "Test Company",
  country: "Россия",
  avatar: "https://example.com/avatar.jpg",
  created_at: new Date(),
  updated_at: new Date(),
};

const mockKnex = () => {
  const firstMock = jest.fn() as unknown as JestMock<Promise<User | null>>;
  firstMock.mockResolvedValue(mockUser);

  const returningMock = jest.fn() as unknown as JestMock<Promise<User[]>>;
  returningMock.mockResolvedValue([mockUser]);

  return {
    select: jest.fn().mockReturnThis() as unknown as JestMock,
    from: jest.fn().mockReturnThis() as unknown as JestMock,
    where: jest.fn().mockReturnThis() as unknown as JestMock,
    first: firstMock,
    insert: jest.fn().mockReturnThis() as unknown as JestMock,
    update: jest.fn().mockReturnThis() as unknown as JestMock,
    delete: jest.fn().mockReturnThis() as unknown as JestMock,
    returning: returningMock,
  };
};

type KnexMock = ReturnType<typeof mockKnex>;

// Мокируем Knex и Redis
jest.mock("../../database/knex", () => ({
  __esModule: true,
  default: jest.fn(() => mockKnex()),
}));

jest.mock("../../lib/redis", () => ({
  cacheUser: jest.fn(),
  invalidateUserCache: jest.fn(),
  redisCache: jest.fn(
    () => (target: any, key: string, descriptor: PropertyDescriptor) =>
      descriptor
  ),
}));

describe("UserService", () => {
  let service: UserService;
  let knexInstance: ReturnType<typeof mockKnex>;

  beforeEach(() => {
    // Создаем новый экземпляр мока Knex для каждого теста
    knexInstance = mockKnex();
    (require("../../database/knex").default as jest.Mock).mockReturnValue(
      knexInstance
    );

    service = new UserService();
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create user", async () => {
      const knexInstance = mockKnex();

      const result = await service.create({
        username: "testuser",
        email: "test@example.com",
        first_name: "Test",
      });

      expect(result).toEqual(mockUser);
      expect(knexInstance.first).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return user when exists", async () => {
      knexInstance.first.mockResolvedValue(mockUser);

      const result = await service.findById(1);

      expect(result).toEqual(mockUser);
      expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
      expect(knexInstance.first).toHaveBeenCalled();
      expect(cacheUser).toHaveBeenCalledWith(mockUser);
    });

    it("should throw error when user not found", async () => {
      knexInstance.first.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow("User not found");
    });
  });

  describe("update", () => {
    it("should update user", async () => {
      knexInstance.first.mockResolvedValue(mockUser);

      const updateData = { first_name: "Updated" };
      await service.update(1, updateData);

      expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
      expect(knexInstance.update).toHaveBeenCalledWith(updateData);
      expect(cacheUser).toHaveBeenCalled();
    });
  });

  describe("getAll", () => {
    it("should return all users", async () => {
      knexInstance.select.mockResolvedValue([mockUser]);

      const result = await service.getAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe("delete", () => {
    it("should delete user and invalidate cache", async () => {
      knexInstance.where.mockReturnThis();
      knexInstance.delete.mockResolvedValue(1); // 1 - количество удаленных строк

      await service.delete(1);

      expect(knexInstance.where).toHaveBeenCalledWith({ id: 1 });
      expect(knexInstance.delete).toHaveBeenCalled();

      const { invalidateUserCache } = require("../../lib/redis");
      expect(invalidateUserCache).toHaveBeenCalledWith(1);
    });

    it("should throw error when user not found", async () => {
      knexInstance.delete.mockResolvedValue(0); // 0 - ничего не удалено

      await expect(service.delete(1)).rejects.toThrow("User not found");
    });

    it("should handle cache invalidation error gracefully", async () => {
      knexInstance.delete.mockResolvedValue(1);
      const { invalidateUserCache } = require("../../lib/redis");
      invalidateUserCache.mockRejectedValue(new Error("Cache error"));

      await expect(service.delete(1)).resolves.not.toThrow();
      expect(invalidateUserCache).toHaveBeenCalledWith(1);
    });
  });
});
