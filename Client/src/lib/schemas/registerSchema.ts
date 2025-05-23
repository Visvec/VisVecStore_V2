import { z } from "zod";

const passwordValidation = new RegExp(
  /(?=^.{6,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/&>.<> ,])(?!.*\s).*$/ 
);

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().regex(passwordValidation, {
      message:
        "Password must contain 1 lowercase character, 1 uppercase character, 1 number, 1 special and be at least 6 characters long",
    }),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Date of birth is required",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
