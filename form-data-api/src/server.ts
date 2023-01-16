import { initializeApp } from "npm:firebase-admin@11.4.1/app";

console.log("Hello World!");

initializeApp({
  credential: applicationDefault(),
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
});
