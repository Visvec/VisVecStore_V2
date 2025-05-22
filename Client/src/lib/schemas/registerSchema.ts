import { z } from "zod";

const passwordValidation  = new RegExp(
    /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/
)

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(passwordValidation, {
        message: 'Password must contain 1 lowercase character, 1 uppercase character, 1 number, 1 special and be 6-10 characters'
    }),
    firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  })
});

export type RegisterSchema = z.infer<typeof registerSchema>;