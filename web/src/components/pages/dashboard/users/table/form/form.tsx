"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib";
import { UserReturn } from "@/types";
import { Profile } from "@/enums/profile.enum";
import { useGetLoggedUser, useGetUser } from "@/hooks";

import { IconLock, IconUser, IconUserCircle } from "@tabler/icons-react";
import { Button, Flex } from "@chakra-ui/react";

import { toaster, Input, Select } from "@/components/ui";

import { userSchema, UserSchema } from "./schema";

interface UserFormProps {
    userId?: string;
    setOpen?: (open: boolean) => void;
}

const PROFILE_OPTIONS = [
    { value: "student", label: "Estudante" },
    { value: "teacher", label: "Professor" },
    { value: "admin", label: "Administrador" },
];

const STATUS_OPTIONS = [
    { value: "active", label: "Ativo" },
    { value: "inactive", label: "Inativo" },
];

const userRequest = async (postData: UserSchema, id?: string) => {
    const isEditForm = Boolean(id);

    const { data } = isEditForm
        ? await api.put<{ data: UserReturn }>(`/user/${id}`, postData)
        : await api.post<{ data: UserReturn }>("/user", postData);

    return data.data;
};

export const UserForm = ({ userId, setOpen }: UserFormProps) => {
    const isEditForm = Boolean(userId);

    const { user: loggedUser } = useGetLoggedUser();
    const { user, isLoading } = useGetUser(userId || "", isEditForm);

    const router = useRouter();
    const queryClient = useQueryClient();

    const userForm = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            user: "",
            name: "",
            profile: "student",
            status: "active",
            password: "",
        },
    });

    const { handleSubmit, setValue } = userForm;

    const { mutate, isPending } = useMutation({
        mutationFn: (postData: UserSchema) => userRequest(postData, userId),
        onSuccess: (response) => {
            toaster.create({
                title: isEditForm ? "Usuário editado com sucesso" : "Usuário criado com sucesso",
                description: `O usuário ${response.name} foi ${isEditForm ? "editado" : "criado"} com sucesso.`,
                closable: true,
                duration: 5000,
                type: "success",
            });

            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user", userId] });

            router.refresh();

            setOpen && setOpen(false);
        },
        onError: () => {
            toaster.create({
                title: isEditForm ? "Erro ao editar usuário" : "Erro ao criar usuário",
                description: `Ocorreu um erro ao ${
                    isEditForm ? "editar" : "criar"
                } o usuário. Tente novamente mais tarde.`,
                closable: true,
                duration: 5000,
                type: "error",
            });
        },
    });

    useEffect(() => {
        if (!isLoading && user) {
            setValue("user", user.user);
            setValue("name", user.name);
            setValue("profile", user.profile);
            setValue("status", user.status);
        }
    }, [isLoading, user]);

    const onHandleSubmit = async (data: UserSchema) => {
        mutate(data);
    };

    const isAdmin = loggedUser?.profile === Profile.Admin;

    const filteredProfiles = isAdmin ? PROFILE_OPTIONS : PROFILE_OPTIONS.filter((option) => option.value !== "admin");

    return (
        <FormProvider {...userForm}>
            <form onSubmit={handleSubmit(onHandleSubmit)} noValidate>
                <Flex direction="column" align="center" justify="start" gap={4} bg="transparent">
                    <Input
                        id="user-name-input"
                        name="name"
                        label="Nome"
                        placeholder="Digite o nome"
                        icon={IconUserCircle}
                        type="text"
                        customStyles={{
                            borderColor: "hover",
                            hoverBorderColor: "background",
                            color: "hover",
                        }}
                    />

                    <Input
                        id="user-user-input"
                        name="user"
                        label="Usuário"
                        placeholder="Digite o usuário"
                        icon={IconUser}
                        type="text"
                        customStyles={{
                            borderColor: "hover",
                            hoverBorderColor: "background",
                            color: "hover",
                        }}
                    />

                    {!isEditForm && (
                        <Input
                            id="login-input-password"
                            name="password"
                            label="Senha"
                            placeholder="Digite a senha"
                            icon={IconLock}
                            passwordInput
                            customStyles={{
                                borderColor: "hover",
                                hoverBorderColor: "background",
                                color: "hover",
                            }}
                        />
                    )}

                    <Select
                        id="user-profile-select"
                        name="profile"
                        label="Perfil"
                        placeholder="Selecione o perfil"
                        icon={IconUser}
                        options={filteredProfiles}
                        customStyles={{
                            borderColor: "hover",
                            hoverBorderColor: "background",
                            color: "hover",
                        }}
                    />

                    <Select
                        id="user-status-select"
                        name="status"
                        label="Status"
                        placeholder="Selecione o status"
                        icon={IconUser}
                        options={STATUS_OPTIONS}
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
                        {isEditForm ? "Editar Usuário" : "Criar Usuário"}
                    </Button>
                </Flex>
            </form>
        </FormProvider>
    );
};
