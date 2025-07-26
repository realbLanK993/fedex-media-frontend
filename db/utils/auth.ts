import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { sessions, users, UsersSelect, UsersWithMetadata } from "../schema";
import { hashPwd, verifyPwd } from "@/lib/utils";
import { createSession } from "@/lib/auth-utils";

export const login: (
  email: string,
  password: string
) => Promise<
  | {
      token?: string;
      user: UsersWithMetadata;
    }
  | undefined
> = async (email: string, password: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      profileMetadata: true,
    },
  });
  if (user) {
    const hash = await hashPwd(password);
    if (hash) {
      if (await verifyPwd(hash, password)) {
        const session = createSession(user.id);
        const token = (await session).token;
        const userMetadata = user.profileMetadata || undefined;
        const userData: UsersWithMetadata = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          metadata: userMetadata,
        };
        return {
          token,
          user: { ...userData },
        };
      } else {
        console.error("Wrong password");
        return;
      }
    } else {
      console.error("Error creating hash for the password");
      return;
    }
  } else {
    console.error("No user found");
    return;
  }
};
