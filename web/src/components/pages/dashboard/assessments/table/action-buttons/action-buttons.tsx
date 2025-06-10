import { Flex } from "@chakra-ui/react";

import { EditModal } from "./edit-modal";
import { DeleteModal } from "./delete-modal";

interface ActionButtonsProps {
    assessmentId: string;
}

export const ActionButtons = ({ assessmentId }: ActionButtonsProps) => {
    return (
        <Flex as="td" position="absolute" right={2} top="50%" transform="translateY(-50%)" gap={2} align="center">
            <EditModal assessmentId={assessmentId} />
            <DeleteModal assessmentId={assessmentId} />
        </Flex>
    );
};
