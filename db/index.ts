import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/db/schema";
import "dotenv/config";

const sqlite = new Database(process.env.DB_FILE_NAME ?? "local.db");

export const db = drizzle(sqlite, { schema });
