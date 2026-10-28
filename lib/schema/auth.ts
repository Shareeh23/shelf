import { z } from "zod";

const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters long"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe(z.email("Enter a valid email address")),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(1, "Confirm Password is required")
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  password: z.string().min(1, "Password is required"),
});

export { signupSchema, loginSchema };
export type SignupValues = z.infer<typeof signupSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
