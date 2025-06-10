import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    user: z.string().min(1, "Usuário é obrigatório"),
    status: z.string().min(1, "Status é obrigatório"),
    profile: z.string().min(1, "Perfil é obrigatório"),
    password: z.string().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;
