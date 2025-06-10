import { FindOptionsWhere, Repository } from "typeorm";

import { Profile } from "@/enums/profile.enum";
import { ForbiddenException } from "@/commons/http-exception";
import { convertDateToTz } from "@/commons/convert-date-to-tz";
import { BmiClassification } from "@/enums/bmi-classification";

import { User } from "@/modules/user/entity/user.entity";

import { AssessmentReturn } from "./types";
import { Assessment } from "./entity/assessment.entity";
import { CreateAssessment } from "./schemas/create-assessment.schema";
import { UpdateAssessment } from "./schemas/update-assessment.schema";

export class AssessmentService {
    constructor(private readonly assessmentRepository: Repository<Assessment>) {}

    private formatAssessmentToReturn = (assessment: Assessment): AssessmentReturn => {
        return {
            id: assessment.id,
            weight: Number(assessment.weight.toFixed(2)),
            height: Number(assessment.height.toFixed(2)),
            bmi: Number(assessment.bmi.toFixed(2)),
            classification: assessment.classification,
            createdAt: convertDateToTz(assessment.createdAt),
            updatedAt: convertDateToTz(assessment.updatedAt),
            evaluator: {
                id: assessment.evaluator.id,
                name: assessment.evaluator.name,
                profile: assessment.evaluator.profile,
            },
            student: {
                id: assessment.student.id,
                name: assessment.student.name,
                profile: assessment.student.profile,
            },
        };
    };

    private getWhereCondition = (loggedUser: User): FindOptionsWhere<Assessment> => {
        const whereConditionMap: Record<string, FindOptionsWhere<Assessment>> = {
            [Profile.Admin]: {},
            [Profile.Teacher]: {
                evaluator: {
                    id: loggedUser.id,
                },
            },
            [Profile.Student]: {
                student: {
                    id: loggedUser.id,
                },
            },
        };

        return whereConditionMap[loggedUser.profile];
    };

    public findAllAssessments = async (loggedUser: User): Promise<AssessmentReturn[]> => {
        const whereCondition = this.getWhereCondition(loggedUser);

        const assessments = await this.assessmentRepository.find({
            where: whereCondition,
            relations: ["evaluator", "student"],
        });

        const formattedAssessments = assessments.map(this.formatAssessmentToReturn);

        return formattedAssessments;
    };

    public findOneAssessment = async (assessmentId: string, loggedUser: User): Promise<AssessmentReturn | null> => {
        const whereCondition = this.getWhereCondition(loggedUser);

        const assessment = await this.assessmentRepository.findOne({
            where: {
                ...whereCondition,
                id: assessmentId,
            },
            relations: ["evaluator", "student"],
        });

        return this.formatAssessmentToReturn(assessment);
    };

    private getBmi = (weight: number, height: number): number => {
        return Number((weight / (height * height)).toFixed(2));
    };

    private getClassification = (bmi: number): BmiClassification => {
        switch (true) {
            case bmi < 18.5:
                return BmiClassification.Underweight;
            case bmi < 25:
                return BmiClassification.Normal;
            case bmi < 30:
                return BmiClassification.Overweight;
            case bmi < 35:
                return BmiClassification.ObesityClass1;
            case bmi < 40:
                return BmiClassification.ObesityClass2;
            default:
                return BmiClassification.ObesityClass3;
        }
    };

    public createAssessment = async (assessmentData: CreateAssessment, loggedUser: User): Promise<AssessmentReturn> => {
        const { id: evaluatorId } = loggedUser;

        const bmi = this.getBmi(assessmentData.weight, assessmentData.height);
        const classification = this.getClassification(bmi);

        const assessment = this.assessmentRepository.create({
            weight: assessmentData.weight,
            height: assessmentData.height,
            bmi,
            classification,
            evaluator: {
                id: evaluatorId,
            },
            student: {
                id: assessmentData.studentId,
            },
        });

        const createdAssessment = await this.assessmentRepository.save(assessment);

        return this.formatAssessmentToReturn(createdAssessment);
    };

    public updateAssessment = async (
        assessmentId: string,
        assessmentData: UpdateAssessment,
        loggedUser: User,
    ): Promise<AssessmentReturn> => {
        const { id: evaluatorId } = loggedUser;

        const whereCondition = this.getWhereCondition(loggedUser);

        const assessmentToUpdate = await this.assessmentRepository.findOne({
            where: {
                ...whereCondition,
                id: assessmentId,
            },
            relations: ["evaluator", "student"],
        });

        if (!assessmentToUpdate) {
            throw new ForbiddenException(
                `Assessment with id ${assessmentId} not found or you do not have permission to update it.`,
            );
        }

        const bmi = this.getBmi(assessmentData.weight, assessmentData.height);
        const classification = this.getClassification(bmi);

        await this.assessmentRepository.update(assessmentId, {
            bmi,
            classification,
            weight: assessmentData.weight,
            height: assessmentData.height,
            evaluator: {
                id: evaluatorId,
            },
            student: {
                id: assessmentData.studentId,
            },
        });

        return this.findOneAssessment(assessmentId, loggedUser);
    };

    public deleteAssessment = async (assessmentId: string): Promise<void> => {
        await this.assessmentRepository.delete(assessmentId);
    };
}
