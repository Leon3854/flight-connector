import express, { Request, Response } from "express";
import { yandexTaxiService } from "../taxi-service/taxi.service.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { createOrderSchema } from "../validation/order.validation.js";
import { TaxiController } from "@src/taxi-controller/taxi.controller.js";

const router = express.Router();
const taxiController = new TaxiController();

router.post(
  "/orders",
  validateRequest(createOrderSchema),
  taxiController.createOrder.bind(taxiController)
);

router.post("/order", authenticate, async (req: Request, res: Response) => {
  try {
    const orderRequest = req.body;
    const order = await yandexTaxiService.createOrder(orderRequest);
    res.json(order);
  } catch (error) {
    console.error("Failed to create Yandex Taxi order", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get(
  "/order/:id/status",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const status = await yandexTaxiService.getOrderStatus(orderId);
      res.json(status);
    } catch (error) {
      console.error("Failed to get order status", error);
      res.status(500).json({ error: "Failed to get order status" });
    }
  }
);

export default router;
