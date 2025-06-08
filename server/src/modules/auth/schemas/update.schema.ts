import { z } from "zod";

import { registerSchema } from "./register.schema";

export const updateSchema = registerSchema;

export type Update = z.infer<typeof updateSchema>;
