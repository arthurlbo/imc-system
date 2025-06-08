import { Req, Res } from "express";

import { BadRequestException, UnauthorizedException } from "@/commons/http-exception";

import { User } from "@/modules/user/entity/user.entity";

import { AuthService } from "./auth.service";
import { loginSchema } from "./dto/login.dto";
import { updateSchema } from "./dto/update.dto";
import { GeneratedTokens, LoginResponse } from "./types";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    public async refreshAccessToken(req: Req, res: Res): Promise<GeneratedTokens> {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new BadRequestException("Refresh token is required");
        }

        const tokens = await this.authService.refreshAccessToken(refreshToken);

        return res.status(200).json({ data: tokens });
    }

    public async me(req: Req, res: Res): Promise<User> {
        const user = req.user as User;

        if (!user) {
            throw new UnauthorizedException("User not authenticated");
        }

        return res.status(200).json({ data: user });
    }

    public async register(req: Req, res: Res): Promise<GeneratedTokens> {
        const parsedData = loginSchema.safeParse(req.body);

        if (!parsedData.success) {
            throw new BadRequestException("Invalid registration data", parsedData.error.format());
        }

        const tokens = await this.authService.register(parsedData.data);

        return res.status(201).json({ data: tokens });
    }

    public async login(req: Req, res: Res): Promise<LoginResponse> {
        const parsedData = loginSchema.safeParse(req.body);

        if (!parsedData.success) {
            throw new BadRequestException("Invalid login data", parsedData.error.format());
        }

        const loggedUser = await this.authService.login(parsedData.data);

        return res.status(200).json({ data: loggedUser });
    }

    public async logout(req: Req, res: Res): Promise<{ success: boolean }> {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new BadRequestException("Refresh token is required");
        }

        await this.authService.logout(refreshToken);

        return res.status(200).json({ data: { success: true } });
    }

    public async update(req: Req, res: Res): Promise<User> {
        const parsedData = updateSchema.safeParse(req.body);

        if (!parsedData.success) {
            throw new BadRequestException("Invalid update data", parsedData.error.format());
        }

        const loggedUser = req.user as User;

        const data = parsedData.data;

        const updatedUser = await this.authService.update(data.id, data, loggedUser);

        return res.status(200).json({ data: updatedUser });
    }
}
