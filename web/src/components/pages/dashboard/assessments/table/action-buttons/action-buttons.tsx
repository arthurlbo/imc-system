import { Flex } from "@chakra-ui/react";

import { EditModal } from "./edit-modal";
import { DeleteModal } from "./delete-modal";

interface ActionButtonsProps {
    assessmentId: string;
}

export const ActionButtons = ({ assessmentId }: ActionButtonsProps) => {
    return (
        <Flex gap={2} align="center">
            <EditModal assessmentId={assessmentId} />
            <DeleteModal assessmentId={assessmentId} />
        </Flex>
    );
};
