import { date, z } from "zod";

export const signupValid = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name should be more then 3 characters" })
      .max(20, { message: "Name should be less than 15 characters" }),
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
    confirm: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export type signupType = z.infer<typeof signupValid>;
