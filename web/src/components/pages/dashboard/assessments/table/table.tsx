"use client";

import { ReactNode } from "react";

import { Flex, Skeleton, Table } from "@chakra-ui/react";

import { dictionary } from "@/commons";
import { useGetAssessments } from "@/hooks";

import { ActionButtons } from "./action-buttons";
import { StudentsFilter } from "./students-filter";
import { EvaluatorsFilter } from "./evaluators-filter";
import { CreateAssessmentModal } from "./create-modal";

const columns = ["Nome do Avaliador", "Nome do Aluno", "Altura (cm)", "Peso (kg)", "IMC", "Classificação"];

interface TableCellProps {
    children: ReactNode;
    colSpan?: number;
}

const TableCell = ({ children, colSpan }: TableCellProps) => {
    return (
        <Table.Cell py={4} borderColor="secondary" colSpan={colSpan} textAlign={colSpan ? "center" : "left"}>
            {children}
        </Table.Cell>
    );
};

export const AssessmentsTable = () => {
    const { assessments, isLoading } = useGetAssessments();

    return (
        <Skeleton loading={isLoading} w="100%" h="100%" mt={4}>
            <Flex direction="column" w="full" h="auto" gap={8} justify="end" align="end">
                <Flex w="full" h="auto" justify="between" align="center" gap={4}>
                    <Flex flex={1} align="center" gap={4}>
                        <EvaluatorsFilter />
                        <StudentsFilter />
                    </Flex>

                    <CreateAssessmentModal />
                </Flex>

                <Flex w="full" h="auto" bg="hover" borderRadius="lg" overflow="hidden" pb={14}>
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
                            {assessments.length > 0 ? (
                                assessments.map((assessment) => {
                                    return (
                                        <Table.Row
                                            key={assessment.id}
                                            position="relative"
                                            bg="transparent"
                                            _hover={{ bg: "hover" }}
                                            borderColor="tertiary"
                                            color="primary"
                                            fontWeight={600}
                                        >
                                            <TableCell>{assessment.evaluator.name}</TableCell>
                                            <TableCell>{assessment.student.name}</TableCell>
                                            <TableCell>{assessment.height.toFixed(2)}</TableCell>
                                            <TableCell>{assessment.weight.toFixed(2)}</TableCell>
                                            <TableCell>{assessment.bmi}</TableCell>
                                            <TableCell>{dictionary(assessment.classification)}</TableCell>

                                            <ActionButtons assessmentId={assessment.id} />
                                        </Table.Row>
                                    );
                                })
                            ) : (
                                <Table.Row
                                    bg="transparent"
                                    _hover={{ bg: "hover" }}
                                    borderColor="tertiary"
                                    color="primary"
                                    fontWeight={600}
                                >
                                    <TableCell colSpan={columns.length}>Nenhum exame cadastrado.</TableCell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Flex>
            </Flex>
        </Skeleton>
    );
};
