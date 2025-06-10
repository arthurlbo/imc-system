import { Flex } from "@chakra-ui/react";

import { EditModal } from "./edit-modal";
import { DeleteModal } from "./delete-modal";

interface ActionButtonsProps {
    userId: string;
    shouldShowDeleteButton: boolean;
}

export const ActionButtons = ({ userId, shouldShowDeleteButton }: ActionButtonsProps) => {
    return (
        <Flex gap={2} align="center">
            <EditModal userId={userId} />
            {shouldShowDeleteButton && <DeleteModal userId={userId} />}
        </Flex>
    );
};
