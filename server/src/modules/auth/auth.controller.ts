import { Req, Res } from "express";

import { BadRequestException, UnauthorizedException } from "@/commons/http-exception";

import { User } from "@/modules/user/entity/user.entity";

import { LoginResponse } from "./types";
import { AuthService } from "./auth.service";
import { loginSchema } from "./dto/login.dto";
import { registerSchema } from "./dto/register.dto";
import { UpdateDTO, updateSchema } from "./dto/update.dto";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    public refreshAccessToken = async (req: Req, res: Res): Promise<{ refreshToken: string }> => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new BadRequestException("Refresh token is required");
        }

        const tokens = await this.authService.refreshAccessToken(refreshToken);

        return res.status(200).json({ data: tokens });
    };

    public me = async (req: Req, res: Res): Promise<User> => {
        const user = req.user as User;

        if (!user) {
            throw new UnauthorizedException("User not authenticated");
        }

        return res.status(200).json({ data: user });
    };

    public register = async (req: Req, res: Res): Promise<{ refreshToken: string }> => {
        const parsedData = registerSchema.safeParse(req.body);

        if (!parsedData.success) {
            throw new BadRequestException("Invalid registration data", parsedData.error.format());
        }

        const token = await this.authService.register(parsedData.data);

        return res.status(201).json({ data: token });
    };

    public login = async (req: Req, res: Res): Promise<LoginResponse> => {
        const parsedData = loginSchema.safeParse(req.body);

        if (!parsedData.success) {
            throw new BadRequestException("Invalid login data", parsedData.error.format());
        }

        const loggedUser = await this.authService.login(parsedData.data);

        return res.status(200).json({ data: loggedUser });
    };

    public logout = async (req: Req, res: Res): Promise<{ success: boolean }> => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new BadRequestException("Refresh token is required");
        }

        await this.authService.logout(refreshToken);

        return res.status(200).json({ data: { success: true } });
    };

    public update = async (req: Req, res: Res): Promise<User> => {
        const parsedData = updateSchema.safeParse(req.body);

        if (!parsedData.success) {
            throw new BadRequestException("Invalid update data", parsedData.error.format());
        }

        const loggedUser = req.user as User;
        const { id } = req.params as { id: string };

        const data = parsedData.data as UpdateDTO;

        const updatedUser = await this.authService.update(id, data, loggedUser);

        return res.status(200).json({ data: updatedUser });
    };
}
