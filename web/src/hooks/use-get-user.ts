"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib";
import { UserReturn } from "@/types";

const getUserRequest = async (id: string) => {
    const { data } = await api.get<{ data: UserReturn }>(`/user/${id}`);

    return data.data;
};

export const useGetUser = (id: string, enabled: boolean = true): { user: UserReturn | null; isLoading: boolean } => {
    const { data, isLoading } = useQuery({
        queryKey: ["user", id],
        queryFn: () => getUserRequest(id),
        enabled: Boolean(id) && enabled,
    });

    return { user: data ?? null, isLoading };
};
