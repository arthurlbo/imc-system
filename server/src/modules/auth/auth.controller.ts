import { Req, Res } from "express";

import { BadRequestException, UnauthorizedException } from "@/commons/http-exception";

import { User } from "@/modules/user/entity/user.entity";

import { AuthService } from "./auth.service";
import { loginSchema } from "./schemas/login.schema";
import { registerSchema } from "./schemas/register.schema";
import { Update, updateSchema } from "./schemas/update.schema";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    public refreshAccessToken = async (req: Req, res: Res) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new BadRequestException("Refresh token is required");
        }

        const tokens = await this.authService.refreshAccessToken(refreshToken);

        return res.status(200).json({ data: tokens });
    };

    public me = async (req: Req, res: Res) => {
        const user = req.user as User;

        if (!user) {
            throw new UnauthorizedException("User not authenticated");
        }

        return res.status(200).json({ data: user });
    };

    public register = async (req: Req, res: Res) => {
        const parsedData = registerSchema.safeParse(req.body);

        if (!parsedData.success) {
            throw new BadRequestException("Invalid registration data", parsedData.error.format());
        }

        const token = await this.authService.register(parsedData.data);

        return res.status(201).json({ data: token });
    };

    public login = async (req: Req, res: Res) => {
        const parsedData = loginSchema.safeParse(req.body);

        if (!parsedData.success) {
            throw new BadRequestException("Invalid login data", parsedData.error.format());
        }

        const loggedUser = await this.authService.login(parsedData.data);

        return res.status(200).json({ data: loggedUser });
    };

    public logout = async (req: Req, res: Res) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new BadRequestException("Refresh token is required");
        }

        await this.authService.logout(refreshToken);

        return res.status(200).json({ data: { success: true } });
    };

    public update = async (req: Req, res: Res) => {
        const parsedData = updateSchema.safeParse(req.body);

        if (!parsedData.success) {
            throw new BadRequestException("Invalid update data", parsedData.error.format());
        }

        const loggedUser = req.user as User;
        const { id } = req.params as { id: string };

        const data = parsedData.data as Update;

        const updatedUser = await this.authService.update(id, data, loggedUser);

        return res.status(200).json({ data: updatedUser });
    };
}
