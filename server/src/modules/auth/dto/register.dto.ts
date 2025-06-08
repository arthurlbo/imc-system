import { CreateUserDTO, createUserSchema } from "@/modules/user/dto/create-user.dto";

export const registerSchema = createUserSchema;

export type RegisterDTO = CreateUserDTO & {
    id?: string;
};
