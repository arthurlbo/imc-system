"use client";

import { Icon, Select as ChakraSelect, Field, createListCollection, Portal } from "@chakra-ui/react";
import { TablerIcon } from "@tabler/icons-react";
import { Controller, useFormContext } from "react-hook-form";

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    id: string;
    label: string;
    name: string;
    icon: TablerIcon;
    placeholder: string;
    options: SelectOption[];
    customStyles?: {
        borderColor?: string;
        hoverBorderColor?: string;
        color?: string;
    };
}

export const Select = ({
    id,
    name,
    placeholder,
    label,
    icon,
    options,
    customStyles = {
        borderColor: "primary",
        hoverBorderColor: "tertiary",
        color: "primary",
    },
}: SelectProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const collection = createListCollection({
        items: options.map((option) => ({
            value: option.value,
            label: option.label,
            textValue: option.label,
        })),
    });

    return (
        <Field.Root invalid={!!errors[name]}>
            <Field.Label color={customStyles.color}>{label}</Field.Label>

            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <ChakraSelect.Root
                        name={field.name}
                        value={[field.value]}
                        onValueChange={({ value }) => field.onChange(value[0])}
                        collection={collection}
                    >
                        <ChakraSelect.HiddenSelect />

                        <ChakraSelect.Control>
                            <ChakraSelect.Trigger
                                id={id}
                                h={10}
                                w="full"
                                pl={12}
                                rounded="lg"
                                position="relative"
                                color={customStyles.color}
                                borderColor={customStyles.borderColor}
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
                                transition="all 0.2s ease-in-out"
                            >
                                <Icon
                                    as={icon}
                                    h={5}
                                    w={5}
                                    _invalid={{ color: "red.500" }}
                                    position="absolute"
                                    top="50%"
                                    transform="translateY(-50%)"
                                    left={3}
                                />

                                <ChakraSelect.ValueText
                                    placeholder={placeholder}
                                    _placeholder={{ fontSize: "sm", color: "tertiary", fontWeight: 600 }}
                                />
                            </ChakraSelect.Trigger>

                            <ChakraSelect.IndicatorGroup>
                                <ChakraSelect.Indicator />
                            </ChakraSelect.IndicatorGroup>
                        </ChakraSelect.Control>

                        <ChakraSelect.Content>
                            {collection.items.map((item) => (
                                <ChakraSelect.Item key={item.value} item={item} color={customStyles.color}>
                                    {item.label}
                                    <ChakraSelect.ItemIndicator />
                                </ChakraSelect.Item>
                            ))}
                        </ChakraSelect.Content>
                    </ChakraSelect.Root>
                )}
            />

            <Field.ErrorText>{typeof errors[name]?.message === "string" ? errors[name]?.message : ""}</Field.ErrorText>
        </Field.Root>
    );
};
