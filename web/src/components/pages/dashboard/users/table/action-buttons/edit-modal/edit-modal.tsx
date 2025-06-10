import { IconEdit } from "@tabler/icons-react";

import { CloseButton, Dialog, IconButton, Portal } from "@chakra-ui/react";

import { UserForm } from "../../form";

interface EditModalProps {
    userId: string;
}

export const EditModal = ({ userId }: EditModalProps) => {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <IconButton
                    w={8}
                    h={8}
                    color="primary"
                    bg="transparent"
                    _hover={{ bg: "hoverContrast" }}
                    transition="background 0.2s ease-in-out"
                    rounded="md"
                    p={0}
                    _icon={{ w: 4, h: 4 }}
                >
                    <IconEdit />
                </IconButton>
            </Dialog.Trigger>

            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Editar Usuário</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <UserForm userId={userId} />
                        </Dialog.Body>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
