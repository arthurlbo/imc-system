"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib";
import { AssessmentReturn } from "@/types";

const getAssessmentRequest = async (id: string) => {
    const { data } = await api.get<{ data: AssessmentReturn | null }>(`/assessment/${id}`);

    return data.data;
};

export const useGetAssessment = (
    id: string,
    enabled = true,
): { assessment: AssessmentReturn | null; isLoading: boolean } => {
    const { data, isLoading } = useQuery({
        queryKey: ["assessment", id],
        queryFn: () => getAssessmentRequest(id),
        enabled: Boolean(id) && enabled,
    });

    return { assessment: data ?? null, isLoading };
};
