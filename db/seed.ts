import { hashPwd } from "@/lib/utils";
import { db } from ".";
import { users } from "./schema";

const seed = async () => {
  if (!process.argv[2]) {
    throw new Error("Provide password for the admin");
  }
  const hash = await hashPwd(process.argv[2]);
  await db.insert(users).values({
    name: "Admin",
    email: "admin@gmail.com",
    passwordHash: hash,
    role: "ADMIN",
  });
};

seed().catch((err) => {
  console.error(" Error creating seed\n", err);
});
