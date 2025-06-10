"use client";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib";
import { AssessmentReturn } from "@/types";

interface GetAssessmentsQueryParams {
    evaluatorsId?: string;
    studentsId?: string;
}

const getAssessmentsRequest = async (queryParams: GetAssessmentsQueryParams) => {
    const { data } = await api.get<{ data: AssessmentReturn[] }>("/assessment", {
        params: {
            evaluatorsId: queryParams.evaluatorsId,
            studentsId: queryParams.studentsId,
        },
    });

    return data.data;
};

export const useGetAssessments = (): { assessments: AssessmentReturn[]; isLoading: boolean } => {
    const searchParams = useSearchParams();

    const evaluatorsId = searchParams.get("evaluatorsId") || undefined;
    const studentsId = searchParams.get("studentsId") || undefined;

    const queryParams = {
        evaluatorsId,
        studentsId,
    };

    const { data, isLoading } = useQuery({
        queryKey: ["assessments", evaluatorsId, studentsId],
        queryFn: () => getAssessmentsRequest(queryParams),
    });

    return { assessments: data ?? [], isLoading };
};
