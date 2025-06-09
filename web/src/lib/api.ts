import axios from "axios";
import cookies from "js-cookie";

import { toaster } from "@/components/ui";

const token = cookies.get("token");

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            cookies.remove("token");

            const toastId = "session-expired-toast";

            toaster.create({
                id: toastId,
                title: "Sessão expirada",
                description: "Sua sessão expirou. Por favor, faça login novamente.",
                closable: true,
                duration: 9999,
                type: "warning",
            });

            setTimeout(() => {
                window.location.href = "/";
            }, 1000 * 5);
        }

        return Promise.reject(error);
    },
);
