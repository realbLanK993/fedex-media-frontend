import { z, ZodError } from "zod/v4";
import { UsersInsert, usersInsertSchema } from "../schema";
import { ReturnData } from "@/lib/types/data";

export const createUser: (data: UsersInsert) => ReturnData = (
  data: UsersInsert
) => {
  try {
    const newUser = { ...data };
    const parsed = usersInsertSchema.safeParse(newUser);
    if (!parsed.success) {
      return {
        data: null,
        success: false,
        error: {
          message: parsed.error,
        },
      };
    } else {
      return {
        data: parsed.data,
        success: true,
        error: {
          message: parsed.error,
        },
      };
    }
  } catch (err) {
    return {
      data: null,
      success: false,
      error: {
        message: (err as Error).message,
      },
    };
  }
};
