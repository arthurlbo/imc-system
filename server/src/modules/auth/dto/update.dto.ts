import { z } from "zod";

import { registerSchema } from "./register.dto";

export const updateSchema = registerSchema;

export type UpdateDTO = z.infer<typeof updateSchema>;
