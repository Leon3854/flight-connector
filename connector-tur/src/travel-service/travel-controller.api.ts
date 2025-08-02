import { Request, Response } from "express";
import { travelApiService } from "./travel-service.api.js";
import { redisService } from "../lib/redis.js";

export class TravelController {
  async searchFlights(req: Request, res: Response) {
    try {
      const params = {
        origin: req.query.origin as string,
        destination: req.query.destination as string,
        departureDate: req.query.departureDate as string,
        returnDate: req.query.returnDate as string | undefined,
        adults: req.query.adults ? parseInt(req.query.adults as string) : 1,
        children: req.query.children
          ? parseInt(req.query.children as string)
          : 0,
        currency: (req.query.currency as string) || "USD",
      };

      if (!params.origin || !params.destination || !params.departureDate) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const flights = await travelApiService.searchFlights(params);
      res.json({ success: true, data: flights });
    } catch (error) {
      console.error("Search flights error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search flights",
        details: error instanceof Error ? error.message : undefined,
      });
    }
  }

  async clearCache(_req: Request, res: Response) {
    try {
      await redisService.del("flights:*");
      res.json({ success: true, message: "Cache cleared" });
    } catch (error) {
      console.error("Clear cache error:", error);
      res.status(500).json({ success: false, error: "Failed to clear cache" });
    }
  }
}

export const travelController = new TravelController();
