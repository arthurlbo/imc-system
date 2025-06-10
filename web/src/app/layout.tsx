import "./globals.css";

import { Providers } from "@/app/_providers";
import { Flex } from "@chakra-ui/react";

import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
    display: "swap",
    preload: true,
});

export const metadata = {
    title: "IMC Web",
    description: "IMC Web Application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.variable}`}>
                {
                    <Providers>
                        <Flex
                            as="main"
                            direction="column"
                            position="relative"
                            w="100%"
                            maxW="100vw"
                            h="100vh"
                            bg="background"
                            align="start"
                            justify="start"
                            overflowX="hidden"
                            padding={4}
                            gap={4}
                            fontFamily="body"
                            color="primary"
                        >
                            {children}
                        </Flex>
                    </Providers>
                }
            </body>
        </html>
    );
}
