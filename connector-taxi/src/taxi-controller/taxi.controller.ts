import { Router, Request, Response, NextFunction } from "express";
import { YandexTaxiService } from "../taxi-service/taxi.service.js";
import { CreateOrderDto } from "../dto/create-order.dto.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { createOrderSchema } from "../validation/order.validation.js";

export class TaxiController {
  public router = Router();
  private taxiService = new YandexTaxiService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Валидация и создание заказа через контроллер
    this.router.post(
      "/orders",
      validateRequest(createOrderSchema),
      this.createOrder.bind(this)
    );

    // Пример: получение статуса заказа
    this.router.get("/orders/:id/status", this.getOrderStatus.bind(this));
  }

  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData: CreateOrderDto = req.body;

      // Вызываем сервис с преобразованным объектом
      const result = await this.taxiService.createOrder(orderData);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  }

  public async getOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      const status = await this.taxiService.getOrderStatus(orderId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to get order status" });
    }
  }
}
