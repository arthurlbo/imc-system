import { Profile } from "@/enums/profile.enum";
import { BmiClassification } from "@/enums/bmi-classification";

export interface AssessmentReturn {
    id: string;
    weight: number;
    height: number;
    bmi: number;
    classification: BmiClassification;
    createdAt: Date;
    updatedAt: Date;
    evaluator: {
        id: string;
        name: string;
        profile: Profile;
    };
    student: {
        id: string;
        name: string;
        profile: Profile;
    };
}
