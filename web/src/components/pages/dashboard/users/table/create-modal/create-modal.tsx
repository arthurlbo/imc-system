import { IconEdit, IconUserPlus } from "@tabler/icons-react";

import { Button, CloseButton, Dialog, Icon, Portal } from "@chakra-ui/react";

import { UserForm } from "../form";

export const CreateUserModal = () => {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button
                    h={10}
                    w="auto"
                    px={4}
                    color="primary"
                    bg="green.500"
                    fontSize="sm"
                    fontWeight="semibold"
                    _hover={{ bg: "green.600" }}
                    transition="background 0.2s ease-in-out"
                    rounded="lg"
                >
                    <Icon as={IconUserPlus} h={5} w={5} />
                    <span>Cadastrar</span>
                </Button>
            </Dialog.Trigger>

            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Cadastrar Usuário</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <UserForm />
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
