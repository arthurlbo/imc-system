import { z } from "zod";

export const assessmentSchema = z.object({
    height: z.string(),
    weight: z.string(),
    studentId: z.string().uuid("Student ID must be a valid UUID."),
});

export type AssessmentSchema = z.infer<typeof assessmentSchema>;
