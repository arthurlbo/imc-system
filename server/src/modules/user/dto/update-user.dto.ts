import { CreateUserDTO, createUserSchema } from "./create-user.dto";

export const updateUserSchema = createUserSchema;

export type UpdateUserDTO = CreateUserDTO;
