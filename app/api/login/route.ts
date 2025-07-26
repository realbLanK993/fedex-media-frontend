import { login } from "@/db/utils/auth";
import { createAndAssignToken, validateSession } from "@/lib/auth-utils";
import { cookies } from "next/headers";

type LoginPayload = {
  email: string;
  password: string;
};

export default async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { email, password }: LoginPayload = await req.json();

  if (token && token.value) {
    const [sessionId, sessionSecret] = token.value.split(".");

    const isValidated = await validateSession(sessionId, sessionSecret);
    if (isValidated) {
      return {
        data: {
          isAuthenticated: true,
        },
        success: true,
        error: {
          message: null,
        },
      };
    }
  } else {
    if (email && password) {
      const data = await login(email, password);
      if (data) {
        const tk = data.token;
        if (tk) {
          const created = await createAndAssignToken(tk);
          if (created) {
            delete data.token;
            return {
              ...data,
            };
          }
        }
      }
    } else {
      if (!email) {
        const r = {
          data: null,
          success: false,
          error: {
            message: "No email provided",
          },
        };
        return Response.json(
          { ...r },
          {
            status: 400,
          }
        );
      }
      if (!password) {
        const r = {
          data: null,
          success: false,
          error: {
            message: "No password provided",
          },
        };
        return Response.json(
          { ...r },
          {
            status: 400,
          }
        );
      }
    }
  }
}
