import { NextRequest } from "next/server";
import { JWK } from "node-jose";
import * as jose from "jose";

export async function GET(request: NextRequest) {
  async function generateRSAJWK() {
    const keyPair = await JWK.createKey("RSA", 2048, { use: "sig" });
    const jwk = keyPair.toJSON(true); // Include private key details
    return jwk;
  }
  generateRSAJWK().catch((error) => {
    console.error("Error:", error);
  });

  const alg = "RS256";
  const jwk = (await generateRSAJWK()) as jose.JWK;

  const privateKey = await jose.importJWK(jwk, alg);

  const jwt = await new jose.SignJWT({ sub: "1" })
    .setProtectedHeader({ alg })
    .setExpirationTime("60m")
    .setIssuedAt()
    .setSubject("1")
    .sign(privateKey);
  console.log(jwt);

  const JWKS = jose.createLocalJWKSet({
    keys: [
      {
        kty: "RSA",
        e: jwk.e,
        n: jwk.n,
      },
    ],
  });

  const { payload } = await jose.jwtVerify(jwt, JWKS);
  console.log(payload.sub);
}
