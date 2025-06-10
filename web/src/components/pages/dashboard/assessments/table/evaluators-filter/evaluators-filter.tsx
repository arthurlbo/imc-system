"use client";

import { useState } from "react";

import { useGetTeachers, useQueryParamSetter } from "@/hooks";

import { IconUser } from "@tabler/icons-react";
import { createListCollection, Icon, Portal, Select, Skeleton } from "@chakra-ui/react";

export const EvaluatorsFilter = () => {
    const [value, setValue] = useState<string[]>([]);

    const { teachers, isLoading } = useGetTeachers();
    const setQueryParam = useQueryParamSetter();

    const collection = createListCollection({
        items: teachers.map((student) => ({
            value: student.id,
            label: student.name,
            textValue: student.name,
        })),
    });

    const handleValueChange = (teachers: string[]) => {
        const parsedTeachers = teachers.join(",");
        setQueryParam("evaluatorsId", parsedTeachers);
        setValue(teachers);
    };

    return (
        <Skeleton loading={isLoading} w={{ base: "full", md: 72 }}>
            <Select.Root
                multiple
                disabled={isLoading}
                collection={collection}
                value={value}
                onValueChange={(e) => handleValueChange(e.value)}
                w={{ base: "full", md: 72 }}
            >
                <Select.HiddenSelect />

                <Select.Control>
                    <Select.Trigger
                        position="relative"
                        h={10}
                        w="full"
                        pl={12}
                        rounded="lg"
                        color="primary"
                        borderColor="primary"
                        _hover={{ borderColor: "tertiary" }}
                        _focus={{
                            borderColor: "tertiary",
                            boxShadow: "none",
                            bg: "transparent",
                        }}
                        transition="all 0.2s ease-in-out"
                    >
                        <Icon
                            as={IconUser}
                            h={5}
                            w={5}
                            position="absolute"
                            top="50%"
                            transform="translateY(-50%)"
                            left={3}
                        />

                        <Select.ValueText
                            placeholder="Selecione um professor"
                            _placeholder={{ fontSize: "sm", color: "tertiary", fontWeight: 600 }}
                        />
                    </Select.Trigger>

                    <Select.IndicatorGroup>
                        <Select.ClearTrigger color="primary" />
                        <Select.Indicator color="primary" />
                    </Select.IndicatorGroup>
                </Select.Control>

                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {collection.items.map((student) => (
                                <Select.Item item={student} key={student.value} color="hover">
                                    {student.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
        </Skeleton>
    );
};
