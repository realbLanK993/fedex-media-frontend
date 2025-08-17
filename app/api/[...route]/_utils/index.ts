import { sessions } from "@/db/schema";
import { hash, verify } from "argon2";
import { db } from "@/db";
import { SessionWithToken } from "@/lib/types/auth";
import { eq } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { Context } from "hono";

export const isProduction = () => process.env.NODE_ENV === "production";
export const CookieExpiryTime = 60 * 60 * 24;

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

export async function createSession(
  userId: number
): Promise<SessionWithToken | null> {
  try {
    const now = new Date().getTime();
    const id = generateSecureRandomString();
    const secret = generateSecureRandomString();
    const secretHash = await hash(secret);

    const token = id + "." + secret;
    const session: SessionWithToken = {
      id,
      secretHash,
      userId,
      createdAt: now,
      token,
    };

    await db.insert(sessions).values({
      id: session.id,
      secretHash,
      userId,
      createdAt: now,
    });

    return session;
  } catch (err) {
    console.error(
      `Something went wrong when creating the session for the user: ${userId}\n`,
      err
    );
    return null;
  }
}

export const getSession = async (c: Context, sessionId: string) => {
  try {
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.id, sessionId),
    });
    const now = new Date().getTime();
    if (session) {
      if (
        new Date(now) > new Date(session.createdAt + CookieExpiryTime * 1000)
      ) {
        await db.delete(sessions).where(eq(sessions.id, session.id));

        deleteToken(c, "session_token");
        return null;
      }
      return session;
    }
    return null;
  } catch (err) {
    console.error(
      `Something went wrong while getting the session: ${sessionId}\n`,
      err
    );
    return null;
  }
};

export async function validateSession(
  c: Context,
  sessionId: string,
  sessionSecret: string
) {
  try {
    const session = await getSession(c, sessionId);
    if (session) {
      const hash = session.secretHash;
      if (hash) {
        if (await verify(hash, sessionSecret)) {
          return true;
        }
      }
    }

    return false;
  } catch (err) {
    console.error(
      `Something went wrong when validating the session: ${sessionId}\n`,
      err
    );
    return false;
  }
}

export const createAndAssignToken = async (c: Context, token: string) => {
  try {
    setCookie(c, "session_token", token, {
      secure: false,
      httpOnly: true,
      maxAge: CookieExpiryTime,
    });
    return true;
  } catch (err) {
    console.error(
      `Some error occured while trying to create and assign token: ${token}`,
      err
    );
    return false;
  }
};

export const getToken = async (c: Context, token: string) => {
  try {
    const tk = getCookie(c, token);
    return tk;
  } catch (err) {
    console.error(`Some error while getting the cookie: ${token} \n`, err);
    return undefined;
  }
};

export const deleteToken = async (c: Context, token: string) => {
  try {
    deleteCookie(c, token);
    return true;
  } catch (err) {
    console.error(
      `Some error occured while trying to delete token: ${token} \n`,
      err
    );
    return false;
  }
};
