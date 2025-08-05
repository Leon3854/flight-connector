// src/database/migrations/20250801000000_create_taxi_orders.ts
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("taxi_orders_2025", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("yandex_order_id").notNullable().unique();
    table
      .enum("status", [
        "pending",
        "driver_assigned",
        "in_progress",
        "completed",
        "cancelled",
        "failed",
      ])
      .notNullable()
      .defaultTo("pending");

    table.jsonb("route").notNullable(); // Новое поле для хранения маршрута
    table.decimal("price", 12, 2).notNullable(); // Поддержка больших сумм
    table.string("currency").defaultTo("RUB");
    table.jsonb("driver_info").nullable(); // Информация о водителе

    table.timestamp("scheduled_at").nullable(); // Для предзаказов
    table.timestamp("completed_at").nullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["user_id", "status"]);
    table.index(["yandex_order_id"]);
  });

  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER update_taxi_orders_updated_at
    BEFORE UPDATE ON taxi_orders_2025
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    "DROP TRIGGER IF EXISTS update_taxi_orders_updated_at ON taxi_orders_2025"
  );
  await knex.schema.dropTable("taxi_orders_2025");
}
