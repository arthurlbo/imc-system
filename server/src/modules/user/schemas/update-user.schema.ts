import { z } from "zod";
import { createUserSchema } from "./create-user.schema";

export const updateUserSchema = createUserSchema.extend({
    password: z.string().optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;
