"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib";
import { AssessmentReturn } from "@/types";
import { useGetAssessment, useGetStudents } from "@/hooks";

import { IconCircleDottedLetterH, IconUser, IconWeight } from "@tabler/icons-react";
import { Button, Flex } from "@chakra-ui/react";

import { toaster, Input, Select, SelectOption } from "@/components/ui";

import { assessmentSchema, AssessmentSchema } from "./schema";

interface AssessmentFormProps {
    assessmentId?: string;
    setOpen?: (open: boolean) => void;
}

const assessmentRequest = async (postData: AssessmentSchema, id?: string) => {
    const isEditForm = Boolean(id);

    const parsedPostData = {
        ...postData,
        height: Number(postData.height),
        weight: Number(postData.weight),
    };

    const { data } = isEditForm
        ? await api.put<{ data: AssessmentReturn }>(`/assessment/${id}`, parsedPostData)
        : await api.post<{ data: AssessmentReturn }>("/assessment", parsedPostData);

    return data.data;
};

export const AssessmentForm = ({ assessmentId, setOpen }: AssessmentFormProps) => {
    const isEditForm = Boolean(assessmentId);

    const { students } = useGetStudents();
    const { assessment, isLoading } = useGetAssessment(assessmentId || "", isEditForm);

    const router = useRouter();
    const queryClient = useQueryClient();

    const assessmentForm = useForm<AssessmentSchema>({
        resolver: zodResolver(assessmentSchema),
        defaultValues: {
            height: "",
            weight: "",
            studentId: "",
        },
    });

    const { handleSubmit, setValue } = assessmentForm;

    const { mutate, isPending } = useMutation({
        mutationFn: (postData: AssessmentSchema) => assessmentRequest(postData, assessmentId),
        onSuccess: () => {
            toaster.create({
                title: isEditForm ? "Exame editado com sucesso" : "Exame criado com sucesso",
                description: `O Exame foi ${isEditForm ? "editado" : "criado"} com sucesso.`,
                closable: true,
                duration: 5000,
                type: "success",
            });

            queryClient.invalidateQueries({ queryKey: ["assessments"] });
            queryClient.invalidateQueries({ queryKey: ["assessment", assessmentId] });

            router.refresh();

            setOpen && setOpen(false);
        },
        onError: () => {
            toaster.create({
                title: isEditForm ? "Erro ao editar o Exame" : "Erro ao criar o Exame",
                description: `Ocorreu um erro ao ${
                    isEditForm ? "editar" : "criar"
                } o Exame. Tente novamente mais tarde.`,
                closable: true,
                duration: 5000,
                type: "error",
            });
        },
    });

    useEffect(() => {
        if (!isLoading && assessment) {
            setValue("height", assessment?.height.toFixed(2) || "");
            setValue("weight", assessment?.weight.toFixed(2) || "");
            setValue("studentId", assessment?.student.id || "");
        }
    }, [isLoading, assessment]);

    const onHandleSubmit = async (data: AssessmentSchema) => {
        mutate(data);
    };

    const studentsOptions: SelectOption[] = useMemo(
        () =>
            students.map((student) => ({
                label: student.name,
                value: student.id,
            })),
        [students],
    );

    return (
        <FormProvider {...assessmentForm}>
            <form onSubmit={handleSubmit(onHandleSubmit)} noValidate>
                <Flex direction="column" align="center" justify="start" gap={4} bg="transparent">
                    <Input
                        id="assessment-height-input"
                        name="height"
                        label="Altura (cm)"
                        placeholder="Digite a altura"
                        icon={IconCircleDottedLetterH}
                        type="text"
                        customStyles={{
                            borderColor: "hover",
                            hoverBorderColor: "background",
                            color: "hover",
                        }}
                        mask="9.99"
                    />

                    <Input
                        id="assessment-weight-input"
                        name="weight"
                        label="Peso (kg)"
                        placeholder="Digite o peso"
                        icon={IconWeight}
                        type="text"
                        customStyles={{
                            borderColor: "hover",
                            hoverBorderColor: "background",
                            color: "hover",
                        }}
                    />

                    <Select
                        id="assessment-students-select"
                        name="studentId"
                        label="Aluno"
                        placeholder="Selecione o aluno"
                        icon={IconUser}
                        options={studentsOptions}
                        customStyles={{
                            borderColor: "hover",
                            hoverBorderColor: "background",
                            color: "hover",
                        }}
                    />

                    <Button
                        type="submit"
                        loading={isPending}
                        w="full"
                        mt={4}
                        h={10}
                        bg="accent"
                        color="primary"
                        rounded="xl"
                        _hover={{
                            bg: "accentHover",
                        }}
                        _focusVisible={{ ring: 2, ringColor: "primary", ringOffset: "2px" }}
                        transitionProperty="all"
                        transitionDuration="0.3s"
                        transitionTimingFunction="ease-in-out"
                    >
                        {isEditForm ? "Editar Exame" : "Criar Exame"}
                    </Button>
                </Flex>
            </form>
        </FormProvider>
    );
};
