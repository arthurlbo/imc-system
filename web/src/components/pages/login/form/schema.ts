import { z } from "zod";

export const loginSchema = z.object({
    user: z.string().min(1, "Usuário é obrigatório"),
    password: z.string().min(1, "A senha é obrigatória"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
