// TODO -> verify token using firebase-admin
// import { initializeApp } from "npm:firebase-admin@11.4.1/app";

// initializeApp({
//   credential: applicationDefault(),
//   databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
// });

console.log("Hello World!");

// TODO -> add CORS
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/users", async (context) => {
    const client = new Client({
      database: "ff-users",
      hostname: "users-database",
      port: 5432,
      user: "admin",
      password: "admin",
    });

    await client.connect();

    const array_result = await client.queryArray("SELECT * FROM users");
    const rows = array_result.rows;
    console.log("/users result:", rows);

    await client.end();

    context.response.body = array_result.rows;
  });
// example of a route with a parameter
// .get("/book/:id", (context) => {
//   if (books.has(context?.params?.id)) {
//     context.response.body = books.get(context.params.id);
//   }
// });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 80 });
