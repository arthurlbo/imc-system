"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useQueryParamSetter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const setQueryParam = useCallback(
        (key: string, value: string | null, path: string = "") => {
            const params = new URLSearchParams(searchParams);

            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }

            const stringifiedParams = params.toString();

            const replacePath = path ? `${path}?${stringifiedParams}` : `?${stringifiedParams}`;

            router.replace(replacePath, { scroll: false });
            router.refresh(); // Need to keep this refresh for the ssr identify the route change.
        },
        [router, searchParams],
    );

    return setQueryParam;
};
