import axios, { AxiosInstance } from "axios";
import env from "../config/env/env.js";

interface OrderRequest {
  // Пример полей для создания заказа
  source: {
    lat: number;
    lon: number;
    address?: string;
  };
  destination: {
    lat: number;
    lon: number;
    address?: string;
  };
  tariffClass?: string; // например, "econom", "business"
  paymentMethod?: string; // например, "card"
  // и другие параметры по API Yandex Taxi
  requirements?: {
    childChair?: boolean;
    animalTransportation?: boolean;
    luggage?: boolean;
    // другие требования к машине и водителю
  };
  comment?: string; // комментарий к заказу
  route?: Array<{ lat: number; lon: number }>; // дополнительный маршрут, если поддерживается
  call?: boolean; // нужна ли связь с водителем
  clientId?: string; // ID клиента в вашей системе
  maxWaitMinutes?: number; // максимальное время ожидания
}

interface OrderResponse {
  orderId: string;
  status: string;
  // другие поля согласно API
}

interface OrderStatusResponse {
  orderId: string;
  status: string;
  driver?: {
    name: string;
    phone: string;
    car: string;
  };
  // и другие поля
}

export class YandexTaxiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: env.YANDEX_TAXI_API_URL,
      headers: {
        Authorization: `Bearer ${env.YANDEX_TAXI_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 10_000, // 10 секунд таймаут
    });
  }

  /**
   * Создать заказ такси
   */
  async createOrder(orderRequest: OrderRequest): Promise<OrderResponse> {
    try {
      const response = await this.axiosInstance.post<OrderResponse>(
        "/orders",
        orderRequest
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Получить статус заказа по ID
   */
  async getOrderStatus(orderId: string): Promise<OrderStatusResponse> {
    try {
      const response = await this.axiosInstance.get<OrderStatusResponse>(
        `/orders/${orderId}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Универсальная обработка ошибок
   */
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          `YandexTaxi API error: ${error.response.status} - ${JSON.stringify(
            error.response.data
          )}`
        );
        throw new Error(
          `YandexTaxi API responded with status ${error.response.status}`
        );
      } else if (error.request) {
        console.error("YandexTaxi API no response received", error.request);
        throw new Error("No response from YandexTaxi API");
      } else {
        console.error("YandexTaxi API request error", error.message);
        throw new Error(error.message);
      }
    } else {
      console.error("Unknown error in YandexTaxiService", error);
      throw new Error("Unknown error in YandexTaxiService");
    }
  }
}

export const yandexTaxiService = new YandexTaxiService();
