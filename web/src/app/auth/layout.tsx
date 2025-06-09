import { Flex } from "@chakra-ui/react";

import { ReactNode } from "react";

export const metadata = {
    title: "Auth - IMC Web",
};

export default async function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <Flex as="section" justify="center" align="center" h="100vh" w="full">
            <Flex align="center" justify="center" w="auto" h="auto" bg="hover" borderRadius="2xl" p={6}>
                {children}
            </Flex>
        </Flex>
    );
}
