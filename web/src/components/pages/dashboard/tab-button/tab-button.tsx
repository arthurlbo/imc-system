"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";

import { Link as ChakraLink } from "@chakra-ui/react";

export interface TabButtonProps {
    label: string;
    href: string;
}

export const TabButton = ({ label, href }: TabButtonProps) => {
    const pathname = usePathname();

    const isActive = href.split("?")[0].includes(pathname.split("/")[2]);

    return (
        <ChakraLink
            asChild
            px={4}
            py={2}
            color="primary"
            bg={isActive ? "hover" : "transparent"}
            rounded="lg"
            fontSize="sm"
            fontWeight={isActive ? "bold" : "semibold"}
            textDecoration="none"
            _hover={{ bg: "hover" }}
            _focusVisible={{ ring: 2, ringColor: "primary", ringOffset: "2px" }}
            transition="background 0.2s ease-in-out"
        >
            <NextLink href={href}>{label}</NextLink>
        </ChakraLink>
    );
};
