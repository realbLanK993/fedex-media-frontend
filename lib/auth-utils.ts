import { sessions } from "@/db/schema";
import { hash } from "argon2";
import { SessionWithToken } from "./types/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { hashPwd, isProduction, verifyPwd } from "./utils";
import { cookies } from "next/headers";

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

export async function createSession(userId: number): Promise<SessionWithToken> {
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
    userId,
    createdAt: now.getTime(),
    token,
  };

  await db.insert(sessions).values({
    id: session.id,
    secretHash: generateSecureRandomString(),
    userId,
    createdAt: now.getTime(),
  });

  return session;
}

export const getSession = async (sessionId: string) => {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
  });
  if (session) {
    return session;
  }
  return null;
};

export async function validateSession(
  sessionId: string,
  sessionSecret: string
) {
  const session = await getSession(sessionId);
  if (session) {
    const hash = session.secretHash;
    if (hash) {
      if (await verifyPwd(hash, sessionSecret)) {
        return true;
      }
    }
  }

  return false;
}

export const createAndAssignToken = async (token: string) => {
  try {
    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      secure: isProduction(),
      httpOnly: true,
      //TODO: Need to change this to a proper time later
      maxAge: 60, // This is 60 seconds
    });
    return true;
  } catch (err) {
    console.error(
      " Some error occured while trying to create and assign tokens\n",
      err
    );
    return false;
  }
};

export const deleteToken = async (token: string) => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session_token");
    return true;
  } catch (err) {
    console.error(" Some error occured while trying to delete tokens\n", err);
    return false;
  }
};
