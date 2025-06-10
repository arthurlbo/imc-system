"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib";
import { UserReturn } from "@/types";

const getUsersRequest = async () => {
    const { data } = await api.get<{ data: UserReturn[] }>("/user");

    return data.data;
};

export const useGetUsers = (): { users: UserReturn[]; isLoading: boolean } => {
    const { data, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: getUsersRequest,
    });

    return { users: data ?? [], isLoading };
};
