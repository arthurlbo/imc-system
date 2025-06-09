import { Flex } from "@chakra-ui/react";

import { DashboardHeader } from "@/components/pages";

export const metadata = {
    title: "Dashboard - IMC Web",
};

export default function Dashboard() {
    return (
        <Flex as="section" direction="column" justify="start" align="start" h="100vh" w="full" bg="background">
            <DashboardHeader />
        </Flex>
    );
}
