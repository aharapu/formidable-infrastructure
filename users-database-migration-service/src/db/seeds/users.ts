import {
  AbstractSeed,
  Info,
  ClientPostgreSQL,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";

export default class extends AbstractSeed<ClientPostgreSQL> {
  /** Runs on seed */
  async run(info: Info): Promise<void> {
    this.client.queryArray(`
            INSERT INTO
                users (firebase_id)
            VALUES
                ('1234567890'),
                ('0987654321'),
                ('1234567891'),
                ('0987654322');
        `);
  }
}
