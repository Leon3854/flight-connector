export enum OrderStatus {
  PENDING = "pending",
  ASSIGNED = "assigned",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface TaxiOrder {
  id: string;
  user_id: string;
  yandex_order_id: string;
  status: OrderStatus;
  price: number;
  start_address: string;
  end_address: string;
  created_at: Date;
  updated_at: Date;
}

export interface PriceEstimate {
  amount: number;
  currency: string;
  duration: number; // in seconds
  distance: number; // in meters
}
