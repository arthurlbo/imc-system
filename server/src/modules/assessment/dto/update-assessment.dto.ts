import { z } from "zod";

import { createAssessmentSchema } from "./create-assessment.dto";

export const updateAssessmentSchema = createAssessmentSchema;

export type UpdateAssessmentDTO = z.infer<typeof updateAssessmentSchema>;
