import { SessionSelectSchema } from "@/db/schema";
export interface SessionWithToken extends SessionSelectSchema {
  token: string;
}
