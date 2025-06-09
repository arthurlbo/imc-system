import { Flex } from "@chakra-ui/react";

import { LoginForm } from "@/components/pages";

export const metadata = {
    title: "Login - IMC Web",
};

export default async function Login() {
    return (
        <Flex as="section" justify="center" align="center" h="100vh" w="full">
            <Flex align="center" justify="center" w="auto" h="auto" bg="hover" borderRadius="2xl" p={6}>
                <LoginForm />
            </Flex>
        </Flex>
    );
}
