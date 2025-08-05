import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Очищаем таблицу
  await knex("taxi_orders").del();

  // Вставляем тестовые данные
  await knex("taxi_orders").insert([
    {
      user_id: "550e8400-e29b-41d4-a716-446655440000",
      yandex_order_id: "yandex_order_1",
      status: "completed",
      price: 350.5,
      start_address: "ул. Ленина, 1",
      end_address: "ул. Пушкина, 10",
    },
    {
      user_id: "550e8400-e29b-41d4-a716-446655440001",
      yandex_order_id: "yandex_order_2",
      status: "in_progress",
      price: 420.0,
      start_address: "ул. Гагарина, 5",
      end_address: "ул. Циолковского, 15",
    },
  ]);
}
