import { Request, Response } from "express";

import { Profile } from "@/enums/profile.enum";
import { BadRequestException, ForbiddenException, NotFoundException } from "@/commons/http-exception";

import { User } from "@/modules/user/entity/user.entity";

import { AssessmentService } from "./assessment.service";
import { createAssessmentSchema } from "./dto/create-assessment.dto";
import { updateAssessmentSchema } from "./dto/update-assessment.dto";

export class AssessmentController {
    constructor(private readonly assessmentService: AssessmentService) {}

    public findAllAssessment = async (req: Request, res: Response): Promise<Response> => {
        const loggedUser = req.user as User;

        const assessments = await this.assessmentService.findAllAssessments(loggedUser);

        return res.status(200).json({ data: assessments });
    };

    public findOneAssessment = async (req: Request, res: Response): Promise<Response> => {
        const loggedUser = req.user as User;
        const { id } = req.params as { id: string };

        const assessment = await this.assessmentService.findOneAssessment(id, loggedUser);

        if (!assessment) throw new NotFoundException(`Assessment with id ${id} not found`);

        return res.status(200).json({ data: assessment });
    };

    public createAssessment = async (req: Request, res: Response) => {
        const result = createAssessmentSchema.safeParse(req.body);

        if (!result.success) {
            throw new BadRequestException("Invalid assessment data", result.error.format());
        }

        const loggedUser = req.user as User;

        const canCreate = loggedUser.profile !== Profile.Student;

        if (!canCreate) {
            throw new ForbiddenException("You do not have permission to create assessments");
        }

        const assessment = await this.assessmentService.createAssessment(result.data, loggedUser);

        return res.status(201).json({ data: assessment });
    };

    public updateAssessment = async (req: Request, res: Response) => {
        const result = updateAssessmentSchema.safeParse(req.body);

        if (!result.success) {
            throw new BadRequestException("Invalid assessment data", result.error.format());
        }

        const loggedUser = req.user as User;
        const { id } = req.params;

        const updatedAssessment = await this.assessmentService.updateAssessment(id, result.data, loggedUser);

        return res.status(200).json({ data: updatedAssessment });
    };

    public deleteAssessment = async (req: Request, res: Response) => {
        const { id } = req.params;

        await this.assessmentService.deleteAssessment(id);
        
        return res.status(200).json({ data: { success: true } });
    };
}
