import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    user: z.string().min(1, "Usuário é obrigatório"),
    password: z.string().min(1, "A senha é obrigatória"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
