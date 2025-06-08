import { RegisterDTO, registerSchema } from "./register.dto";

export const updateSchema = registerSchema;

export type UpdateDTO = RegisterDTO & {
    id?: string;
};
