import { z } from "zod";

import { Status } from "@/enums/status.enum";
import { Profile } from "@/enums/profile.enum";

export const createUserSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(60, { message: "Name must be at most 60 characters long" }),
    user: z
        .string()
        .min(1, { message: "User is required" })
        .max(60, { message: "User must be at most 60 characters long" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .max(255, { message: "Password must be at most 255 characters long" }),
    profile: z.nativeEnum(Profile, { message: "Invalid Profile" }).default(Profile.Student),
    status: z.nativeEnum(Status, { message: "Invalid Status" }).default(Status.Active),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
