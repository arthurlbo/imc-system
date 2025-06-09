"use client";

import { useState } from "react";

import { Icon, Input as ChakraInput, InputGroup, Button, Text, Field } from "@chakra-ui/react";

import { IconEye, IconEyeClosed, TablerIcon } from "@tabler/icons-react";

import { useFormContext } from "react-hook-form";

interface InputProps {
    id: string;
    label: string;
    name: string;
    type?: string;
    icon: TablerIcon;
    placeholder: string;
    passwordInput?: boolean;
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
export const Input = ({ id, name, placeholder, passwordInput = false, label, icon, type = "text" }: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <Field.Root invalid={!!errors[name]}>
            <Field.Label color="primary">{label}</Field.Label>

            <InputGroup
                startElement={<Icon as={icon} h={5} w={5} _invalid={{ color: "red.500" }} color="primary" />}
                endElement={
                    passwordInput && (
                        <Button
                            variant="ghost"
                            rounded="lg"
                            _hover={{ color: "secondary" }}
                            _focusVisible={{ color: "secondary" }}
                            transition="all 0.2s ease-in-out"
                            color="primary"
                            h="auto"
                            w="auto"
                            p={0}
                            bg="transparent"
                            onClick={() => setShowPassword((prevShowPassword) => !prevShowPassword)}
                        >
                            {showPassword ? <Icon as={IconEye} h={5} w={5} /> : <Icon as={IconEyeClosed} h={5} w={5} />}
                        </Button>
                    )
                }
            >
                <ChakraInput
                    {...register(name)}
                    id={id}
                    h={10}
                    w="full"
                    pl={12}
                    rounded="lg"
                    borderColor="primary"
                    placeholder={placeholder}
                    type={passwordInput ? (showPassword ? type : "password") : type}
                    _hover={{ borderColor: "tertiary" }}
                    _focus={{
                        borderColor: "tertiary",
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
