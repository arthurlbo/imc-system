"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib";
import { UserReturn } from "@/types";

const getStudentsRequest = async () => {
    const { data } = await api.get<{ data: UserReturn[] }>("/user/students");

    return data.data;
};

export const useGetStudents = (): { students: UserReturn[]; isLoading: boolean } => {
    const { data, isLoading } = useQuery({
        queryKey: ["students"],
        queryFn: getStudentsRequest,
    });

    return { students: data ?? [], isLoading };
};
