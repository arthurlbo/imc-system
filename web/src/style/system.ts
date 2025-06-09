import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const themeConfig = defineConfig({
    theme: {
        tokens: {
            colors: {
                background: { value: "#08070b" },
                hover: { value: "#212024" },
                hoverContrast: { value: "#0E0C12" },
                primary: { value: "#F1F5F9" },
                secondary: { value: "#CBD5E1" },
                tertiary: { value: "#94A3B8" },
                quaternary: { value: "#64748B" },
                accent: { value: "#0F52BA" },
                accentHover: { value: "#0D47A1" },
                complementary: { value: "#00D3D3" },
            },
            fonts: {
                heading: { value: "var(--font-poppins)" },
                body: { value: "var(--font-poppins)" },
            },
        },
    },
});

export const system = createSystem(defaultConfig, themeConfig);
