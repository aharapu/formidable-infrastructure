import { decodeBase64 } from "../deps.ts";

export function extractJwtData(token: string) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("invalid token");
  }

  const header = JSON.parse(new TextDecoder().decode(decodeBase64(parts[0])));
  const payload = JSON.parse(new TextDecoder().decode(decodeBase64(parts[1])));
  return [header, payload];
}

export async function getGoogleJWTokenKeys() {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  const data = await response.json();

  const keys = {};

  for (const pubJWK of data.keys) {
    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      pubJWK,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      true,
      ["verify"]
    );

    keys[pubJWK.kid] = cryptoKey;
  }

  return keys;
}

export async function isValidJwtTokenSignature(
  token: string,
  criptoKey: CryptoKey
) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("invalid token");

  const [headerb64, payloadb64, signatureb64] = parts;

  const signature = decodeBase64(signatureb64);
  const data = new TextEncoder().encode(`${headerb64}.${payloadb64}`);

  const result = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    criptoKey,
    signature,
    data
  );

  return result;
}
