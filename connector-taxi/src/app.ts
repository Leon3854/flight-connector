import express from "express";
import { envConfig } from "./config/env/env.js";
import { redisService } from "./lib/redis.js";
import knex from "./database/db_knex.js";
import { authenticate } from "./middlewares/auth.middleware.js";
import { TaxiController } from "./taxi-controller/taxi.controller.js";
import { errorHandler } from "./middlewares/error.middleware.js";

class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeDatabase();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    const taxiController = new TaxiController();

    this.app.use("/api/taxi", authenticate, taxiController.router);
    this.app.get("/health", (req, res) => res.json({ status: "OK" }));
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await knex.raw("SELECT 1");
      console.log("PostgreSQL connected successfully");

      if (redisService.isConnected) {
        console.log("Redis connected successfully");
      }

      await knex.migrate.latest();
      console.log("Database migrations applied");
    } catch (error) {
      console.error("Database connection failed:", error);
      process.exit(1);
    }
  }

  public start(): void {
    this.app.listen(envConfig.app.port, () => {
      console.log(`Taxi service running on port ${envConfig.app.port}`);
      console.log(`Environment: ${envConfig.app.env}`);
    });
  }
}

const app = new App();
app.start();
