import { Request, Response } from "express";

import { Profile } from "@/enums/profile.enum";
import { BadRequestException, ForbiddenException, NotFoundException } from "@/commons/http-exception";

import { User } from "./entity/user.entity";
import { UserService } from "./user.service";
import { createUserSchema } from "./dto/create-user.dto";

export class UserController {
    constructor(private readonly userService: UserService) {}

    private getIsAdmin = (loggedUser: User): boolean => {
        return loggedUser.profile === Profile.Admin;
    };

    public findAllUsers = async (req: Request, res: Response): Promise<Response> => {
        const loggedUser = req.user as User;

        const users = await this.userService.findAllUsers(loggedUser);

        return res.status(200).json({ data: users });
    };

    public findOneUser = async (req: Request, res: Response): Promise<Response> => {
        const loggedUser = req.user as User;

        const { id } = req.params as { id: string };

        const user = await this.userService.findOneUser(id, loggedUser);

        if (!user) throw new NotFoundException(`User with id ${id} not found`);

        return res.status(200).json({ data: user });
    };

    public createUser = async (req: Request, res: Response) => {
        const result = createUserSchema.safeParse(req.body);

        if (!result.success) {
            throw new BadRequestException("Invalid user data", result.error.format());
        }

        const loggedUser = req.user as User;

        const isAdmin = this.getIsAdmin(loggedUser);

        if (!isAdmin && result.data.profile === Profile.Admin) {
            throw new ForbiddenException("Only admins can create users with admin profile");
        }

        const user = await this.userService.createUser(result.data);

        return res.status(201).json({ data: user });
    };

    public updateUser = async (req: Request, res: Response) => {
        const result = createUserSchema.safeParse(req.body);

        if (!result.success) {
            throw new BadRequestException("Invalid user data", result.error.format());
        }

        const loggedUser = req.user as User;
        const { id } = req.params;

        const isAdmin = this.getIsAdmin(loggedUser);

        if (!isAdmin && result.data.profile === Profile.Admin) {
            throw new ForbiddenException("Only admins can create users with admin profile");
        }

        const updatedUser = await this.userService.updateUser(id, result.data, loggedUser);

        return res.status(200).json({ data: updatedUser });
    };

    public deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;

        await this.userService.deleteUser(id);

        return res.status(200).json({ data: { success: true } });
    };
}