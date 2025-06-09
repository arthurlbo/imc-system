"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import * as NProgress from "nprogress";
import NextTopLoader from "nextjs-toploader";

import { system } from "@/style/system";

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
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (document) {
            NProgress.start();
        }

        NProgress.done();
    }, [pathname, router]);

    return (
        <QueryClientProvider client={QUERY_CLIENT}>
            <ChakraProvider value={system}>
                <NextTopLoader color="#ccc" showSpinner={false} />
                {children}
            </ChakraProvider>
        </QueryClientProvider>
    );
};
