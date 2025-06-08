import { z } from "zod";

export const createAssessmentSchema = z.object({
    height: z.number().min(1, "Height is required and must be a positive number."),
    weight: z.number().min(1, "Weight is required and must be a positive number."),
    studentId: z.string().uuid("Student ID must be a valid UUID."),
});

export type CreateAssessmentDTO = z.infer<typeof createAssessmentSchema>;
