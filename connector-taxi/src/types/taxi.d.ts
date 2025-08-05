declare namespace YandexTaxi {
  interface PriceEstimate {
    currency: "RUB";
    amount: number;
    minimum: number;
  }

  interface RoutePoint {
    coordinates: [number, number];
    address: string;
  }

  interface VehicleOption {
    id: string;
    name: string;
    description: string;
  }
}
