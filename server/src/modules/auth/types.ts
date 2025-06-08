import { User } from "../user/entity/user.entity";

export interface LoginResponse {
    user: User;
    refreshToken: string;
}
