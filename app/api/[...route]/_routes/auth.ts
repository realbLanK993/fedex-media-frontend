import { db } from "@/db";
import { sessions, users, UserSelectSchema } from "@/db/schema";
import { verify } from "argon2";
import { eq } from "drizzle-orm";
import {
  createAndAssignToken,
  createSession,
  deleteToken,
  getSession,
  getToken,
  validateSession,
} from "../_utils";
import { Hono } from "hono";
import { SessionWithToken } from "@/lib/types/auth";

type Variables = {
  session: SessionWithToken | null;
  user: UserSelectSchema | null;
};

const auth = new Hono<{ Variables: Variables }>();

auth
  .post("/login", async (c) => {
    const { email, password } = await c.req.json<{
      email: string;
      password: string;
    }>();
    if (!email || !password) {
      return c.text("Fill all fields before submitting", 400);
    } else {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
        with: {
          profileMetadata: true,
        },
      });
      if (user) {
        const verified = await verify(user.passwordHash, password);

        if (verified) {
          const session = await createSession(user.id);
          if (session) {
            const token = session.token;
            const created = await createAndAssignToken(c, token);
            if (created) {
              return c.json({
                data: {
                  id: user.id,
                  name: user.name,
                  profileMetadata: user.profileMetadata,
                  email: user.email,
                  role: user.role,
                },
              });
            } else {
              return c.text(
                "Something went wrong while trying to log you in. Please try again.",
                500
              );
            }
          } else {
            return c.text(
              "Something went wrong while trying to log you in. Please try again.",
              500
            );
          }
        } else {
          return c.text("Invalid credentials", 403);
        }
      } else {
        return c.text("Invalid credentials", 403);
      }
    }
  })
  .get((c) => {
    return c.text("Method not allowed", 405);
  });

auth
  .post("/logout", async (c) => {
    const token = await getToken(c, "session_token");

    if (token) {
      const [sessionId, sessionSecret] = token.split(".");
      const session = await getSession(c, sessionId);
      if (session) {
        if (await verify(session.secretHash, sessionSecret)) {
          const deleted = await db
            .delete(sessions)
            .where(eq(sessions.id, session.id));
          if (deleted.lastInsertRowid) {
            await deleteToken(c, "session_token");
            return c.text("You are logged out", 200);
          } else {
            return c.text(
              "Something went wrong when logging out. Please try again",
              500
            );
          }
        } else {
          return c.text("You are logged out", 200);
        }
      } else {
        deleteToken(c, "session_token");
        return c.text("You are already logged out", 400);
      }
    } else {
      return c.text("You are already logged out", 400);
    }
  })
  .get((c) => {
    return c.text("Method not allowed", 405);
  });

auth.get("/validate", async (c) => {
  const token = await getToken(c, "session_token");

  if (token) {
    const [sessionId, sessionSecret] = token.split(".");
    const validated = await validateSession(c, sessionId, sessionSecret);
    if (validated) {
      return c.text("You are authenticated", 200);
    } else {
      return c.text("You are not authenticated", 403);
    }
  }
  return c.text("You are not authenticated", 403);
});

export default auth;
