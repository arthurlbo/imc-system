"use client";

import { ReactNode } from "react";

import { Flex, Skeleton, Table } from "@chakra-ui/react";

import { useGetUsers } from "@/hooks";
import { dictionary } from "@/commons";
import { Profile } from "@/enums/profile.enum";

import { ActionButtons } from "./action-buttons";
import { CreateUserModal } from "./create-modal";

const columns = ["Nome", "Usuário", "Perfil", "Exames aplicados", "Exames realizados", "Status", ""];

interface TableCellProps {
    children: ReactNode;
    width?: string | number;
}

const TableCell = ({ children, width }: TableCellProps) => {
    return (
        <Table.Cell py={4} borderColor="secondary" w={width}>
            {children}
        </Table.Cell>
    );
};

export const UsersTable = () => {
    const { users, isLoading } = useGetUsers();

    return (
        <Skeleton loading={isLoading} w="100%" h="100%" mt={4}>
            <Flex direction="column" w="full" h="auto" gap={8} justify="end" align="end">
                <CreateUserModal />

                <Flex w="full" h="auto" bg="hover" borderRadius="lg" overflow="hidden" pb={14}>
                    <Table.ScrollArea w="full">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row bg="primary" color="background">
                                    {columns.map((column) => (
                                        <Table.Cell key={column} fontWeight="semibold" fontSize="sm">
                                            {column}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {users.map((user) => {
                                    const appliedAssessments = user.appliedAssessments.length;
                                    const receivedAssessments = user.receivedAssessments.length;

                                    const shouldShowDeleteButton =
                                        appliedAssessments === 0 && receivedAssessments === 0;

                                    return (
                                        <Table.Row
                                            key={user.id}
                                            position="relative"
                                            bg="transparent"
                                            _hover={{ bg: "hover" }}
                                            borderColor="tertiary"
                                            color="primary"
                                            fontWeight={600}
                                        >
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.user}</TableCell>
                                            <TableCell>{dictionary(user.profile)}</TableCell>
                                            <TableCell>{user.appliedAssessments.length}</TableCell>
                                            <TableCell>{user.receivedAssessments.length}</TableCell>
                                            <TableCell>{dictionary(user.status)}</TableCell>

                                            <TableCell width={20}>
                                                {user.profile !== Profile.Admin && (
                                                    <ActionButtons
                                                        userId={user.id}
                                                        shouldShowDeleteButton={shouldShowDeleteButton}
                                                    />
                                                )}
                                            </TableCell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                </Flex>
            </Flex>
        </Skeleton>
    );
};
