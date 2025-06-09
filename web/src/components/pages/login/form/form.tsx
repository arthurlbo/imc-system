"use client";

import NextLink from "next/link";
import cookies from "js-cookie";

import { api } from "@/lib";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { IconLock, IconUser } from "@tabler/icons-react";
import { Button, Flex, Text, Link as ChakraLink } from "@chakra-ui/react";

import { toaster, Input } from "@/components/ui";

import { LoginResponse } from "./types";
import { LoginSchema, loginSchema } from "./schema";

const postLogin = async (postData: LoginSchema) => {
    const { data } = await api.post<{ data: LoginResponse }>("/auth/login", postData);

    return data.data;
};

export const LoginForm = () => {
    const loginForm = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            user: "",
            password: "",
        },
    });

    const { handleSubmit } = loginForm;

    const { mutate, isPending } = useMutation({
        mutationFn: postLogin,
        onSuccess: async (response) => {
            cookies.set("token", response.refreshToken, { expires: 7 });

            window.location.href = "/";
        },
        onError: () => {
            toaster.create({
                title: "Error ao realizar login",
                description:
                    "Ocorreu um erro ao tentar realizar o login. Por favor, verifique suas credenciais e tente novamente.",
                closable: true,
                duration: 9999,
                type: "error",
            });
        },
    });

    const onHandleSubmit = async (data: LoginSchema) => {
        mutate(data);
    };

    return (
        <FormProvider {...loginForm}>
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
                        Login
                    </Text>

                    <Input
                        id="login-user-input"
                        name="user"
                        placeholder="Digite seu usuário"
                        icon={IconUser}
                        type="text"
                        label="Usuário"
                    />

                    <Input
                        id="login-input-password"
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
                        Entrar
                    </Button>

                    <ChakraLink asChild color="primary" fontSize="sm" fontWeight={600} textAlign="center">
                        <NextLink href="/auth/register">Cadastrar</NextLink>
                    </ChakraLink>
                </Flex>
            </form>
        </FormProvider>
    );
};
