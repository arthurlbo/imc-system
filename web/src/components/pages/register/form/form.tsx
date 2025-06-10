"use client";

import NextLink from "next/link";
import cookies from "js-cookie";

import { api } from "@/lib";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { IconLock, IconUser, IconUserCircle } from "@tabler/icons-react";
import { Button, Flex, Text, Link as ChakraLink } from "@chakra-ui/react";

import { toaster, Input } from "@/components/ui";

import { RegisterResponse } from "./types";
import { registerSchema, RegisterSchema } from "./schema";

const postRegister = async (postData: RegisterSchema) => {
    const { data } = await api.post<{ data: RegisterResponse }>("/auth/register", postData);

    return data.data;
};

export const RegisterForm = () => {
    const registerForm = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            user: "",
            password: "",
        },
    });

    const { handleSubmit } = registerForm;

    const { mutate, isPending } = useMutation({
        mutationFn: postRegister,
        onSuccess: async (response) => {
            cookies.set("token", response.refreshToken, { expires: 7 });

            window.location.href = "/";
        },
        onError: () => {
            toaster.create({
                title: "Error ao realizar o cadastro",
                description: "Ocorreu um erro ao tentar realizar o cadastro. Por favor, tente novamente.",
                closable: true,
                duration: 5000,
                type: "error",
            });
        },
    });

    const onHandleSubmit = async (data: RegisterSchema) => {
        mutate(data);
    };

    return (
        <FormProvider {...registerForm}>
            <form onSubmit={handleSubmit(onHandleSubmit)} noValidate>
                <Flex
                    direction="column"
                    w={{ base: "250px", md: "400px" }}
                    align="center"
                    justify="start"
                    gap={4}
                    bg="transparent"
                >
                    <Text color="primary" fontSize="3xl" fontWeight={700} textAlign="center">
                        Cadastro
                    </Text>

                    <Input
                        id="register-name-input"
                        name="name"
                        placeholder="Digite seu nome"
                        icon={IconUserCircle}
                        type="text"
                        label="Nome"
                    />

                    <Input
                        id="register-user-input"
                        name="user"
                        placeholder="Digite seu usuário"
                        icon={IconUser}
                        type="text"
                        label="Usuário"
                    />

                    <Input
                        id="register-input-password"
                        name="password"
                        label="Senha"
                        placeholder="Digite sua senha"
                        icon={IconLock}
                        passwordInput
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
                        Cadastrar
                    </Button>

                    <ChakraLink asChild color="primary" fontSize="sm" fontWeight={600} textAlign="center">
                        <NextLink href="/auth/login">Login</NextLink>
                    </ChakraLink>
                </Flex>
            </form>
        </FormProvider>
    );
};
