import {
  ClientPostgreSQL,
  NessieConfig,
  // @ts-ignore
} from "https://deno.land/x/nessie@2.0.10/mod.ts";

/** Select one of the supported clients */
const client = new ClientPostgreSQL({
  database: "ff-users",
  hostname: "users-database",
  port: 5432,
  user: "admin",
  password: "admin",
});

/** This is the final config object */
const config: NessieConfig = {
  client,
  migrationFolders: ["./db/migrations"],
  seedFolders: ["./db/seeds"],
};

export default config;
