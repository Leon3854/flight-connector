import type { Knex } from "knex";

/**
 * @param {Knex} knex - Экземпляр Knex
 * @returns {Promise<void>}
 */

export async function seed(knex: Knex): Promise<void> {
  // Очистка таблицы перед вставкой данных
  // await knex("table_name").del();
  // Вставка начальных данных
  // await knex('table_name').insert([
  //   { column1: 'value1', column2: 'value2' },
  //   { column1: 'value3', column2: 'value4' },
  // ]);
}
