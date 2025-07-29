// src/services/connector.service.ts
import axios, { AxiosInstance } from "axios";

export class ConnectorService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.CONNECTOR_URL || "http://connector:3202",
      timeout: 5000,
    });
  }

  async searchFlights(userId: string, params: any) {
    try {
      const response = await this.api.post("/flights/search", {
        userId,
        ...params,
      });
      return response.data;
    } catch (error) {
      console.error("Connector service error:", error);
      throw error;
    }
  }
}
