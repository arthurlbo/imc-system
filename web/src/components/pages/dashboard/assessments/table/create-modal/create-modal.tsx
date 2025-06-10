"use client";

import { useState } from "react";

import { IconReportMedical } from "@tabler/icons-react";

import { Button, CloseButton, Dialog, Icon, Portal } from "@chakra-ui/react";

import { AssessmentForm } from "../form";

export const CreateAssessmentModal = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button
                    h={10}
                    w={{ base: "full", md: "auto" }}
                    px={4}
                    color="primary"
                    bg="green.500"
                    fontSize="sm"
                    fontWeight="semibold"
                    _hover={{ bg: "green.600" }}
                    transition="background 0.2s ease-in-out"
                    rounded="lg"
                >
                    <Icon as={IconReportMedical} h={5} w={5} />
                    <span>Cadastrar</span>
                </Button>
            </Dialog.Trigger>

            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Cadastrar Exame</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <AssessmentForm setOpen={setOpen} />
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
