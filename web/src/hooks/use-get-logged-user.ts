"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib";
import { UserReturn } from "@/types";

const getLoggedUserRequest = async () => {
    const { data } = await api.get<{ data: UserReturn }>("/auth/me");
    return data.data;
};

export const useGetLoggedUser = (): { user: UserReturn | null; isLoading: boolean } => {
    const { data, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: getLoggedUserRequest,
    });

    return { user: data ?? null, isLoading };
};
