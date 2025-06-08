import { Status } from "@/enums/status.enum";
import { Profile } from "@/enums/profile.enum";

import { BmiClassification } from "@/enums/bmi-classification";

export interface AppliedAssessment {
    id: string;
    weight: number;
    height: number;
    bmi: number;
    classification: BmiClassification;
    createdAt: Date;
    updatedAt: Date;
    student: {
        id: string;
        name: string;
        profile: Profile;
    };
}

export interface ReceivedAssessment {
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
}

export interface UserReturn {
    id: string;
    name: string;
    user: string;
    profile: Profile;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
    appliedAssessments: AppliedAssessment[];
    receivedAssessments: ReceivedAssessment[];
}
