import { sessionSelectSchema } from "@/db/schema";
import { z } from "zod/v4";

export type Session = z.infer<typeof sessionSelectSchema>;
export interface SessionWithToken extends Session {
  token: string;
}
