import { z } from "zod/v4";

export function ReturnDataSchema<T extends z.ZodType | undefined>(data?: T) {
  return z.object({
    data: data || z.undefined(), // If data is not provided, default to z.undefined()
    success: z.boolean(),
    error: z.object({
      message: z.string(),
    }),
  });
}
