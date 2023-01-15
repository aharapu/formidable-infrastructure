import {
  AbstractMigration,
  Info,
  ClientPostgreSQL,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(info: Info): Promise<void> {
    await this.client.queryArray("CREATE TABLE users (id int)");
  }

  /** Runs on rollback */
  async down(info: Info): Promise<void> {
    await this.client.queryArray("DROP TABLE users");
  }
}
