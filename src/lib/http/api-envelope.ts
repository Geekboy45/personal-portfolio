import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export const failureSchema = z
  .object({
    success: z.literal(false),
    error: z.object({ code: z.number().int(), message: z.string() }).strict(),
  })
  .strict();

export function successSchema<T extends z.ZodType>(value: T) {
  return z
    .object({
      success: z.literal(true),
      value,
      meta: z.object({ pagination: paginationSchema }).optional(),
    })
    .strict();
}
export type ApiSuccess<T> = {
  success: true;
  value: T;
  meta?: { pagination: z.infer<typeof paginationSchema> };
};
