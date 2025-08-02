import { knex } from "./knex.js";

export const migrate = {
  latest: async () => {
    const [batchNo, log] = await knex.migrate.latest();
    console.log(`Ran ${log.length} migrations in batch ${batchNo}`);
  },
};

export const seed = {
  run: async () => {
    const [seedCount] = await knex.seed.run();
    console.log(`Ran ${seedCount} seed files`);
  },
};
