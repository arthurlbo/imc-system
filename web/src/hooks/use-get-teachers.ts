"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib";
import { UserReturn } from "@/types";

const getTeachersRequest = async () => {
    const { data } = await api.get<{ data: UserReturn[] }>("/user/teachers");

    return data.data;
};

export const useGetTeachers = (): { teachers: UserReturn[]; isLoading: boolean } => {
    const { data, isLoading } = useQuery({
        queryKey: ["teachers"],
        queryFn: getTeachersRequest,
    });

    return { teachers: data ?? [], isLoading };
};
