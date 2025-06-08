import { z } from "zod";
import { createUserSchema } from "./create-user.dto";

export const updateUserSchema = createUserSchema;

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
