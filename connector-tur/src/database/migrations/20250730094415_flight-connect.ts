import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("flights", (table) => {
    table.string("id").primary();
    table.string("airline").notNullable();
    table.string("flight_number").notNullable();
    table.string("departure_airport").notNullable();
    table.timestamp("departure_time").notNullable();
    table.string("arrival_airport").notNullable();
    table.timestamp("arrival_time").notNullable();
    table.decimal("price_amount", 10, 2).notNullable();
    table.string("price_currency", 3).notNullable();
    table.integer("duration").notNullable(); // в минутах
    table.timestamps(true, true);

    // Индексы для быстрого поиска
    table.index(["departure_airport", "arrival_airport"]);
    table.index(["departure_time"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("flights");
}
