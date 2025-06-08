import { z } from "zod";

import { createAssessmentSchema } from "./create-assessment.schema";

export const updateAssessmentSchema = createAssessmentSchema;

export type UpdateAssessment = z.infer<typeof updateAssessmentSchema>;
