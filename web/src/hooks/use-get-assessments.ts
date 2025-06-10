"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib";
import { AssessmentReturn } from "@/types";

const getAssessmentsRequest = async () => {
    const { data } = await api.get<{ data: AssessmentReturn[] }>("/assessment");

    return data.data;
};

export const useGetAssessments = (): { assessments: AssessmentReturn[]; isLoading: boolean } => {
    const { data, isLoading } = useQuery({
        queryKey: ["assessments"],
        queryFn: getAssessmentsRequest,
    });

    return { assessments: data ?? [], isLoading };
};
