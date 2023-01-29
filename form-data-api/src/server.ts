// TODO -> add CORS

import { googleAuthLib, Application, Router, Client } from "./deps.ts";

import {
  extractJwtData,
  getGoogleJWTokenKeys,
  isValidJwtTokenSignature,
} from "./auth/jwt.ts";

// TODO -> move google auth stuff to own file
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

// TODO -> add a logger middleware
const router = new Router();

router
  .get("/", (context) => {
    console.log("serving hello world");
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

    context.response.headers.set("Content-Type", "application/json");
    context.response.body = payload;
  })
  .post("/v2/singIn/withGoogleToken", async (context) => {
    // TODO -> move this to a middleware
    const headers = context.request.headers;
    const authorization = headers.get("Authorization");
    const token = authorization?.split("Bearer ")[1];

    const keys = await getGoogleJWTokenKeys();

    const [header, payload] = extractJwtData(token);

    // TODO -> verify issuer
    // TODO -> veryfiy audience
    // TODO -> verify expiration

    const googleJwtKeyId = header?.kid;
    if (!googleJwtKeyId) {
      throw new Error("Key id not found");
    }

    const criptoKey = keys[googleJwtKeyId];
    if (!criptoKey) {
      throw new Error("Key not found");
    }

    const success = await isValidJwtTokenSignature(token, criptoKey);
    if (!success) {
      throw new Error("Invalid token signature");
    }

    context.response.headers.set("Content-Type", "application/json");
    context.response.body = { success };
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Starting server on port 80");
await app.listen({ port: 80 });
