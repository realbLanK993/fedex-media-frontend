import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import auth from "./_routes/auth";
import articles from "./_routes/articles";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");
app.use("/api/*", cors());

// app.use("*", async (c, next) => {
//   const token = await getToken(c, "session_token");
//   if (token) {
//     const [sessionId, sessionSecret] = token.split(".");
//     const session = await getSession(c, sessionId);
//     if (session) {
//       if (await verify(session.secretHash, sessionSecret)) {
//         const user = await db.query.users.findFirst({
//           where: eq(users.id, session.userId),
//         });
//         if (user) {
//           c.set("user", user);
//           c.set("session", { ...session, token: token });
//           await next();
//         }
//         return c.text("Contact sys admin", 401);
//       }
//       return c.text("Error validating your session. Try logging in again", 401);
//     }
//   }
// });

app.get("/hello", (c) => {
  return c.json({
    message: "Welcome to Fedex Media Presence Tracking!",
    link: "/dashboard/home",
  });
});

app.route("/auth", auth);
app.route("/dashboard", articles);

export const GET = handle(app);
export const POST = handle(app);
