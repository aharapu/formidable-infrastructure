import {
  ClientPostgreSQL,
  NessieConfig,
  // @ts-ignore
} from "https://deno.land/x/nessie@2.0.10/mod.ts";

// TODO -> use env variables to set the database connection
const client = new ClientPostgreSQL({
  database: "ff-users",
  // host and port are the ones assigned by docker-compose to the postgres container
  hostname: "users-database",
  port: 5432,
  user: "admin",
  password: "admin",
});

const config: NessieConfig = {
  client,
  migrationFolders: ["./db/migrations"],
  seedFolders: ["./db/seeds"],
};

export default config;
