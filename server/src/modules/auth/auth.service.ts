import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { sign, SignOptions, verify, JwtPayload } from "jsonwebtoken";

import { Status } from "@/enums/status.enum";
import { TIMEZONE } from "@/constants/timezone";
import { BadRequestException, UnauthorizedException } from "@/commons/http-exception";

import { User } from "@/modules/user/entity/user.entity";
import { UserService } from "@/modules/user/user.service";
import { UserTokens } from "@/modules/auth/entity/user-tokens.entity";

import { LoginResponse } from "./types";
import { LoginDTO } from "./dto/login.dto";
import { UpdateDTO } from "./dto/update.dto";
import { RegisterDTO } from "./dto/register.dto";

export class AuthService {
    private readonly audience = "users";
    private readonly issuer = "Authentication";
    private readonly refreshTokenExpiresIn = "7d";

    constructor(
        private readonly usersRepository: Repository<User>,
        private readonly userTokensRepository: Repository<UserTokens>,
        private readonly userService: UserService,
    ) {}

    private generateToken = (id: string): string => {
        const defaultConfig: SignOptions = {
            expiresIn: this.refreshTokenExpiresIn,
            issuer: this.issuer,
            audience: this.audience,
        };

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new BadRequestException("JWT secret is not defined in environment variables.");
        }

        const payload = { sub: id };

        const token = sign(payload, secret, defaultConfig);

        return token;
    };

    private generateRefreshToken = async (userId: string): Promise<string> => {
        const refreshToken = this.generateToken(userId);

        const expirationDate = toZonedTime(new Date(), TIMEZONE);
        expirationDate.setDate(expirationDate.getDate() + 7);

        const userToken = this.userTokensRepository.create({
            refreshToken,
            userId,
            expirationDate,
        });

        await this.userTokensRepository.save(userToken);

        return refreshToken;
    };

    private verifyToken = async (token: string): Promise<{ id: string }> => {
        const defaultConfig: SignOptions = { issuer: this.issuer, audience: this.audience };

        const secret = process.env.JWT_SECRET;

        const data = verify(token, secret, defaultConfig);

        if (!data) {
            throw new UnauthorizedException("Invalid token");
        }

        const id = typeof data === "string" ? data : (data as JwtPayload).sub;

        if (!id) {
            throw new UnauthorizedException("Invalid token payload");
        }

        return { id };
    };

    public validateRefreshToken = async (refreshToken: string): Promise<UserTokens> => {
        const { id: userId } = await this.verifyToken(refreshToken);

        const userToken = await this.userTokensRepository.findOne({
            where: { refreshToken, userId },
            relations: ["user"],
        });

        if (!userToken) {
            throw new UnauthorizedException("Refresh token not found");
        }

        if (userToken.expirationDate < fromZonedTime(new Date(), TIMEZONE)) {
            await this.userTokensRepository.remove(userToken);
            throw new UnauthorizedException("Refresh token expired");
        }

        return userToken;
    };

    public refreshAccessToken = async (refreshToken: string): Promise<{ refreshToken: string }> => {
        const userToken = await this.validateRefreshToken(refreshToken);

        await this.userTokensRepository.remove(userToken);

        const newRefreshToken = await this.generateRefreshToken(userToken.user.id);

        return { refreshToken: newRefreshToken };
    };

    public register = async (data: RegisterDTO): Promise<{ refreshToken: string }> => {
        const newUser = await this.userService.createUser(data);

        const refreshToken = await this.generateRefreshToken(newUser.id);

        return { refreshToken };
    };

    public login = async ({ user, password }: LoginDTO): Promise<LoginResponse> => {
        const userInfo = await this.usersRepository.findOneBy({
            user,
        });

        if (!userInfo || !(await bcrypt.compare(password, userInfo.password))) {
            throw new UnauthorizedException("Invalid username or password");
        }

        if (userInfo.status === Status.Inactive) {
            throw new UnauthorizedException("User is inactive");
        }

        const refreshToken = await this.generateRefreshToken(userInfo.id);

        return { refreshToken, user: userInfo };
    };

    public update = async (id: string, data: UpdateDTO, loggedUser: User): Promise<User> => {
        if (id !== data.id) {
            throw new UnauthorizedException("You can only update your own account");
        }

        return this.userService.updateUser(id, data, loggedUser);
    };

    public logout = async (refreshToken: string): Promise<void> => {
        const { id: userId } = await this.verifyToken(refreshToken);

        const userToken = await this.userTokensRepository.findOne({
            where: { refreshToken, userId },
        });

        if (userToken) {
            await this.userTokensRepository.remove(userToken);
        }
    };
}
