"use client";

import { Button, Flex, Skeleton, Text } from "@chakra-ui/react";

import { useGetUser } from "@/hooks";

import { LogoutButton } from "./logout-button";

export const DashboardHeader = () => {
    const { user, isLoading } = useGetUser();

    return (
        <Flex as="header" w="full" h="auto" p="4" bg="transparent" align="center" justify="space-between">
            <Skeleton loading={isLoading} w="auto" h="auto">
                <Text color="primary" fontSize="2xl" fontWeight={700}>{`Seja bem vindo ${user?.name || ""} 👋`}</Text>
            </Skeleton>

            <LogoutButton />
        </Flex>
    );
};
