import { UserReturn } from "@/types";

export interface LoginResponse {
    refreshToken: string;
    user: UserReturn;
}
