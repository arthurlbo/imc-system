"use client";

import cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib";

import { Button } from "@chakra-ui/react";

import { toaster } from "@/components/ui";

const logoutRequest = async () => {
    const token = cookies.get("token");

    const { data } = await api.post("/auth/logout", { refreshToken: token });

    return data;
};

export const LogoutButton = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            cookies.remove("token");
            window.location.href = "/";
        },
        onError: () => {
            toaster.create({
                title: "Error ao realizar logout",
                description: "Ocorreu um erro ao tentar realizar o logout. Por favor, tente novamente.",
                closable: true,
                duration: 9999,
                type: "error",
            });
        },
    });

    return (
        <Button
            w="auto"
            h="auto"
            py={2}
            px={4}
            bg="transparent"
            color="primary"
            fontSize="sm"
            fontWeight={600}
            _hover={{ bg: "hover" }}
            transition="all 0.2s ease-in-out"
            loading={isPending}
            onClick={() => mutate()}
        >
            Logout
        </Button>
    );
};
