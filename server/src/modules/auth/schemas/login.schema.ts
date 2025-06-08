import { z } from "zod";

export const loginSchema = z.object({
    user: z
        .string()
        .min(1, { message: "User is required" })
        .max(60, { message: "User must be at most 60 characters long" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .max(255, { message: "Password must be at most 255 characters long" }),
});

export type Login = z.infer<typeof loginSchema>;
