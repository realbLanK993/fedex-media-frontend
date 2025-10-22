import { hash } from "argon2";
import { db } from ".";
import { users } from "./schema";

const seed = async () => {
  if (!process.argv[2]) {
    throw new Error("Provide password for the admin");
  }

  const h = await hash(process.argv[2]);
  await db.insert(users).values({
    name: "Admin2",
    email: "admin2@gmail.com",
    passwordHash: h,
    role: "ADMIN",
  });
  console.log("Admin user created successfully!");
};

seed().catch((err) => {
  console.error(" Error creating seed\n", err);
});
