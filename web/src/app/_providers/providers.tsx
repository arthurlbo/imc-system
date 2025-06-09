"use client";

import { ReactNode } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { system } from "@/style/system";
import { Toaster } from "@/components/ui";

const QUERY_CLIENT = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 1000,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: true,
        },
    },
});

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <QueryClientProvider client={QUERY_CLIENT}>
            <ChakraProvider value={system}>
                {children}
                <Toaster />
            </ChakraProvider>
        </QueryClientProvider>
    );
};
