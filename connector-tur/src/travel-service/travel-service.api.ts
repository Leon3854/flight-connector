import axios, { AxiosInstance, AxiosError } from "axios";
import { envConfig } from "../config/env/env.js";
import { redisService } from "../lib/redis.js";
import db from "../database/db_knex.js";
import { FlightSearchParams } from "@src/types/FlightSearchParams.interface.js";
import { Flight } from "@src/types/flights.interface.js";

export class TravelApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: envConfig.travelApi.baseUrl,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${envConfig.travelApi.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async searchFlights(params: FlightSearchParams): Promise<Flight[]> {
    const cacheKey = `flights:${JSON.stringify(params)}`;

    // Пытаемся получить данные из кэша
    try {
      const cachedData = await redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (error) {
      console.error("Redis cache error:", error);
    }

    // Если нет в кэше, делаем запрос к API
    try {
      const response = await this.api.get("/flights/search", { params });
      const flights = this.normalizeFlights(response.data.flights);

      // Сохраняем в кэш на 1 час
      await redisService.setex(cacheKey, 3600, JSON.stringify(flights));

      // Сохраняем в базу данных асинхронно (без ожидания)
      this.saveFlightsToDb(flights).catch(console.error);

      return flights;
    } catch (error) {
      this.handleApiError(error as AxiosError);
      throw new Error("Failed to fetch flights data");
    }
  }

  private normalizeFlights(flights: any[]): Flight[] {
    return flights.map((flight) => ({
      id: flight.id,
      airline: flight.airline.name,
      flightNumber: flight.flightNumber,
      departure: {
        airport: flight.departure.airport.code,
        time: flight.departure.time,
      },
      arrival: {
        airport: flight.arrival.airport.code,
        time: flight.arrival.time,
      },
      price: {
        amount: flight.price.amount,
        currency: flight.price.currency,
      },
      duration: flight.duration,
    }));
  }

  private async saveFlightsToDb(flights: Flight[]): Promise<void> {
    try {
      await db.transaction(async (trx) => {
        for (const flight of flights) {
          await trx("flights")
            .insert({
              id: flight.id,
              airline: flight.airline,
              flight_number: flight.flightNumber,
              departure_airport: flight.departure.airport,
              departure_time: flight.departure.time,
              arrival_airport: flight.arrival.airport,
              arrival_time: flight.arrival.time,
              price_amount: flight.price.amount,
              price_currency: flight.price.currency,
              duration: flight.duration,
            })
            .onConflict("id")
            .merge();
        }
      });
    } catch (error) {
      console.error("Failed to save flights to DB:", error);
    }
  }

  private handleApiError(error: AxiosError): void {
    if (error.response) {
      console.error("Travel API Error:", {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
  }
}

export const travelApiService = new TravelApiService();
