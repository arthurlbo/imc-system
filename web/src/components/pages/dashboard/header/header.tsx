"use client";

import { Flex, Skeleton, Text } from "@chakra-ui/react";

import { useGetLoggedUser } from "@/hooks";

import { LogoutButton } from "./logout-button";

export const DashboardHeader = () => {
    const { user, isLoading } = useGetLoggedUser();

    return (
        <Flex as="header" w="full" h="auto" py={4} bg="transparent" align="center" justify="space-between">
            <Skeleton loading={isLoading} w="auto" h="auto">
                <Text color="primary" fontSize="2xl" fontWeight={700}>{`Seja bem vindo ${user?.name || ""} 👋`}</Text>
            </Skeleton>

            <LogoutButton />
        </Flex>
    );
};
