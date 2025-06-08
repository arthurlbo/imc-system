import { z } from "zod";

import { RegisterDTO, registerSchema } from "./register.dto";

export const updateSchema = registerSchema.extend({
    id: z.string().min(1, "ID is required").optional(),
});

export type UpdateDTO = RegisterDTO & {
    id?: string;
};
