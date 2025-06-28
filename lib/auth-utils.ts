import { LibSQLDatabase } from "drizzle-orm/libsql";
import { SessionWithToken } from "./types/auth";
import { sessionTable } from "@/db/schema";
import { hash } from "argon2";

function generateSecureRandomString(): string {
  // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
  const alphabet = "abcdefghijklmnpqrstuvwxyz23456789";

  // Generate 24 bytes = 192 bits of entropy.
  // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);

  let id = "";
  for (let i = 0; i < bytes.length; i++) {
    // >> 3 s"removes" the right-most 3 bits of the byte
    id += alphabet[bytes[i] >> 3];
  }
  return id;
}

async function createSession(db: LibSQLDatabase): Promise<SessionWithToken> {
  const now = new Date();
  const id = generateSecureRandomString();
  const secret = generateSecureRandomString();
  const secretHash = await hash(secret, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const token = id + "." + secret;
  const session: SessionWithToken = {
    id,
    secretHash,
    createdAt: now,
    token,
  };

  await db.insert(sessionTable).values({
    id: session.id,
    secret_hash: generateSecureRandomString(),
    createdAt: now.getTime(),
  });

  return session;
}

async function hashSecret(secret: string): Promise<Uint8Array> {
  const secretBytes = new TextEncoder().encode(secret);
  const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
  return new Uint8Array(secretHashBuffer);
}
