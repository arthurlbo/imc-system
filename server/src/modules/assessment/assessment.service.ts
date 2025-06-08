import { FindOptionsWhere, Repository } from "typeorm";

import { Profile } from "@/enums/profile.enum";
import { ForbiddenException } from "@/commons/http-exception";
import { BmiClassification } from "@/enums/bmi-classification";

import { User } from "@/modules/user/entity/user.entity";

import { Assessment } from "./entity/assessment.entity";
import { CreateAssessmentDTO } from "./dto/create-assessment.dto";

export class AssessmentService {
    constructor(private readonly assessmentRepository: Repository<Assessment>) {}

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

    public findAllAssessments = async (loggedUser: User): Promise<Assessment[]> => {
        const whereCondition = this.getWhereCondition(loggedUser);

        return this.assessmentRepository.find({
            where: whereCondition,
            relations: ["evaluator", "student"],
        });
    };

    public findOneAssessment = async (assessmentId: string, loggedUser: User): Promise<Assessment | null> => {
        const whereCondition = this.getWhereCondition(loggedUser);

        return this.assessmentRepository.findOne({
            where: {
                ...whereCondition,
                id: assessmentId,
            },
            relations: ["evaluator", "student"],
        });
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

    public createAssessment = async (assessmentData: CreateAssessmentDTO, loggedUser: User): Promise<Assessment> => {
        const { id: evaluatorId } = loggedUser;

        const bmi = this.getBmi(assessmentData.weight, assessmentData.height);
        const classification = this.getClassification(bmi);

        const assessment = this.assessmentRepository.create({
            ...assessmentData,
            bmi,
            classification,
            evaluator: {
                id: evaluatorId,
            },
            student: {
                id: assessmentData.studentId,
            },
        });

        return this.assessmentRepository.save(assessment);
    };

    public updateAssessment = async (
        assessmentId: string,
        assessmentData: CreateAssessmentDTO,
        loggedUser: User,
    ): Promise<Assessment> => {
        const { id: evaluatorId } = loggedUser;

        const bmi = this.getBmi(assessmentData.weight, assessmentData.height);
        const classification = this.getClassification(bmi);

        const whereCondition = this.getWhereCondition(loggedUser);

        const assessmentToUpdate = await this.assessmentRepository.findOne({
            where: {
                ...whereCondition,
                id: assessmentId,
            },
        });

        if (!assessmentToUpdate) {
            throw new ForbiddenException(
                `Assessment with id ${assessmentId} not found or you do not have permission to update it.`,
            );
        }

        await this.assessmentRepository.update(assessmentId, {
            ...assessmentData,
            bmi,
            classification,
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