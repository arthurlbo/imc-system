import { Flex } from "@chakra-ui/react";

import { EditModal } from "./edit-modal";
import { DeleteButton } from "./delete-modal";

interface ActionButtonsProps {
    userId: string;
    shouldShowDeleteButton: boolean;
}

export const ActionButtons = ({ userId, shouldShowDeleteButton }: ActionButtonsProps) => {
    return (
        <Flex as="td" position="absolute" right={2} top="50%" transform="translateY(-50%)" gap={2} align="center">
            <EditModal userId={userId} />
            {shouldShowDeleteButton && <DeleteButton userId={userId} />}
        </Flex>
    );
};
