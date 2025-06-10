import { Flex } from "@chakra-ui/react";

import { DashboardHeader, TabButton, TabButtonProps } from "@/components/pages";

export const metadata = {
    title: "Dashboard - IMC Web",
};

const tabs: TabButtonProps[] = [
    {
        label: "Usuários",
        href: "/dashboard/users",
    },
    {
        label: "Exames",
        href: "/dashboard/assessments",
    },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <Flex
            as="section"
            direction="column"
            w="full"
            h="100vh"
            bg="background"
            justify="start"
            align="start"
            overflowY="auto"
            gap={4}
            px={4}
        >
            <DashboardHeader />

            <Flex w="full" justify="start" align="center" gap={4}>
                {tabs.map((tab) => (
                    <TabButton key={tab.href} {...tab} />
                ))}
            </Flex>

            {children}
        </Flex>
    );
}
