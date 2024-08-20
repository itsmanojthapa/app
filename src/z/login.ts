import { date, z } from "zod";

export const loginValid = z
  .object({
    email: z
      .string()
      .email()
      .refine((email) => email.endsWith("@gmail.com"), {
        message: "Only Gmail addresses are allowed",
      }),
    password: z
      .string()
      .min(6, { message: "Password should be more then 6 characters" })
      .max(15, { message: "Password should be less than 15 characters" }),
  })
  .strict();

export type loginType = z.infer<typeof loginValid>;
