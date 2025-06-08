import { CreateUser, createUserSchema } from "@/modules/user/schemas/create-user.schema";

export const registerSchema = createUserSchema;

export type Register = CreateUser;
