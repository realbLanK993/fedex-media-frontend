import { hash } from "argon2";
import { db } from ".";
import { users } from "./schema";

const seed = async () => {
  if (!process.argv[2]) {
    throw new Error("Provide password for the admin");
  }
  const h = await hash(process.argv[3]);
  await db.insert(users).values({
    name: "Admin",
    email: "admin@gmail.com",
    passwordHash: h,
    role: "ADMIN",
  });
};

seed().catch((err) => {
  console.error(" Error creating seed\n", err);
});
