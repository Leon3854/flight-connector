import { DateTime } from "luxon";

export interface IOrder {
  id: string;
  yandex_order_id: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  price: number;
  start_address: string;
  end_address: string;
  created_at: DateTime;
  updated_at: DateTime;
}

export class Order implements IOrder {
  constructor(
    public id: string,
    public yandex_order_id: string,
    public status: "pending" | "accepted" | "completed" | "cancelled",
    public price: number,
    public start_address: string,
    public end_address: string,
    public created_at: DateTime,
    public updated_at: DateTime
  ) {}
}
