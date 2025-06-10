"use client";

import { useState } from "react";

import { Icon, Input as ChakraInput, InputGroup, Field, IconButton } from "@chakra-ui/react";

import { IconEye, IconEyeClosed, TablerIcon } from "@tabler/icons-react";

import { useFormContext } from "react-hook-form";
import { useHookFormMask, withMask } from "use-mask-input";

interface InputProps {
    id: string;
    label: string;
    name: string;
    type?: string;
    icon: TablerIcon;
    placeholder: string;
    passwordInput?: boolean;
    mask?: string;
    customStyles?: {
        borderColor?: string;
        hoverBorderColor?: string;
        color?: string;
        hoverColor?: string;
    };
}

/**
 * Component that renders an Input used in almost all forms of the App.
 * @param id - Id of the input.
 * @param label - Label of the input.
 * @param name - Name of the input.
 * @param type - Type of the input.
 * @param icon - Icon of the input.
 * @param placeholder - Placeholder of the input.
 * @param passwordInput - If the input is a password input.
 */
export const Input = ({
    id,
    name,
    placeholder,
    passwordInput = false,
    label,
    icon,
    mask,
    type = "text",
    customStyles = {
        borderColor: "primary",
        hoverBorderColor: "tertiary",
        color: "primary",
        hoverColor: "secondary",
    },
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        formState: { errors },
    } = useFormContext();

    const registerWithMask = useHookFormMask(register);

    return (
        <Field.Root invalid={!!errors[name]}>
            <Field.Label color={customStyles.color}>{label}</Field.Label>

            <InputGroup
                startElement={<Icon as={icon} h={5} w={5} _invalid={{ color: "red.500" }} color={customStyles.color} />}
                endElement={
                    passwordInput && (
                        <IconButton
                            variant="ghost"
                            rounded="lg"
                            _hover={{ color: customStyles.hoverColor }}
                            _focusVisible={{ color: customStyles.hoverColor }}
                            transition="all 0.2s ease-in-out"
                            color={customStyles.color}
                            h="auto"
                            w="auto"
                            p={0}
                            bg="transparent"
                            _icon={{ w: 5, h: 5 }}
                            onClick={() => setShowPassword((prevShowPassword) => !prevShowPassword)}
                        >
                            {showPassword ? <IconEye /> : <IconEyeClosed />}
                        </IconButton>
                    )
                }
            >
                <ChakraInput
                    {...(mask ? registerWithMask(name, mask) : register(name))}
                    id={id}
                    h={10}
                    w="full"
                    pl={12}
                    rounded="lg"
                    borderColor={customStyles.borderColor}
                    placeholder={placeholder}
                    type={passwordInput ? (showPassword ? type : "password") : type}
                    _hover={{ borderColor: customStyles.hoverBorderColor }}
                    _focus={{
                        borderColor: customStyles.hoverBorderColor,
                        boxShadow: "none",
                        bg: "transparent",
                    }}
                    _invalid={{
                        borderColor: "red.500",
                        ring: 1,
                        ringColor: "red.500",
                        _hover: { borderColor: "red.500" },
                    }}
                    _placeholder={{ fontSize: "sm", color: "tertiary", fontWeight: 600 }}
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                    autoComplete="off"
                    transition="all 0.2s ease-in-out"
                />
            </InputGroup>

            <Field.ErrorText>{typeof errors[name]?.message === "string" ? errors[name]?.message : ""}</Field.ErrorText>
        </Field.Root>
    );
};
