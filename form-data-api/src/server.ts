// TODO -> add CORS
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

// TODO -> move google auth stuff to own file
import googleAuthLib from "npm:google-auth-library";

const { OAuth2Client } = googleAuthLib;

const CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID");
const client = new OAuth2Client(CLIENT_ID);

// TODO -> if the auth library does not work in deno, implement it manually
// get jwt key from https://www.googleapis.com/oauth2/v3/certs
// check cache control header to see when it needs updating
// https://medium.com/deno-the-complete-reference/using-jwt-json-web-token-in-deno-9d0c0346982f
async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  return payload;
}

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
  })
  .post("/v1/singIn/withGoogle", async (context) => {
    const headers = context.request.headers;
    const authorization = headers.get("Authorization");
    const token = authorization?.split("Bearer ")[1];

    console.log("token", token);
    const payload = await verifyGoogleToken(token);

    // TODO -> set response headers?
    context.response.headers.set("Content-Type", "application/json");
    context.response.body = payload;
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

console.log("Starting server on port 80");
await app.listen({ port: 80 });
