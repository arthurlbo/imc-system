import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const themeConfig = defineConfig({
    theme: {
        tokens: {
            colors: {
                background: { value: "#08070b" },
                hover: { value: "#212024" },
            },
            fonts: {
                heading: { value: "var(--font-poppins)" },
                body: { value: "var(--font-poppins)" },
            },
        },
    },
});

export const system = createSystem(defaultConfig, themeConfig);
