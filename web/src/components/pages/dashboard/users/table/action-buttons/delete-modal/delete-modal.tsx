"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib";

import { IconTrash } from "@tabler/icons-react";
import { Button, CloseButton, Dialog, IconButton, Portal } from "@chakra-ui/react";

import { toaster } from "@/components/ui";

interface DeleteButtonProps {
    userId: string;
}

const deleteRequest = async (userId: string) => {
    const { data } = await api.delete(`/user/${userId}`);

    return data;
};

export const DeleteButton = ({ userId }: DeleteButtonProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteRequest(userId),
        onSuccess: () => {
            toaster.create({
                title: "Usuário deletado com sucesso!",
                description: "O usuário foi removido do sistema.",
                type: "success",
                duration: 5000,
            });

            queryClient.invalidateQueries({
                queryKey: ["users"],
            });

            router.refresh();
        },
        onError: (error) => {
            toaster.create({
                title: "Erro ao deletar usuário",
                description:
                    error.message || "Ocorreu um erro ao tentar deletar o usuário. Por favor, tente novamente.",
                type: "error",
                duration: 5000,
            });
        },
    });

    return (
        <Dialog.Root role="alertdialog">
            <Dialog.Trigger asChild>
                <IconButton
                    w={8}
                    h={8}
                    _icon={{ w: 4, h: 4 }}
                    color="red.500"
                    bg="transparent"
                    rounded="md"
                    _hover={{ bg: "red.500/20" }}
                    transition="all 0.2s ease-in-out"
                >
                    <IconTrash />
                </IconButton>
            </Dialog.Trigger>

            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Você tem certeza?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <p>
                                Você está prestes a deletar este usuário. Esta ação é irreversível e todos os dados
                                associados a este usuário serão perdidos permanentemente.
                            </p>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancelar</Button>
                            </Dialog.ActionTrigger>

                            <Button colorPalette="red" onClick={() => mutate()} loading={isPending}>
                                Deletar
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
