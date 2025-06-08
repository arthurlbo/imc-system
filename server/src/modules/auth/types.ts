import { User } from "../user/entity/user.entity";

export interface GeneratedTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse extends GeneratedTokens {
    user: User;
}
