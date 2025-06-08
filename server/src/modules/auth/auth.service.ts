import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { sign, SignOptions, verify, JwtPayload } from "jsonwebtoken";

import { Status } from "@/enums/status.enum";
import { TIMEZONE } from "@/constants/timezone";
import { UnauthorizedException } from "@/commons/http-exception";

import { User } from "@/modules/user/entity/user.entity";
import { UserTokens } from "@/modules/auth/entity/user-tokens.entity";
import { UserService } from "@/modules/user/user.service";

import { LoginDTO } from "./dto/login.dto";
import { UpdateDTO } from "./dto/update.dto";
import { RegisterDTO } from "./dto/register.dto";
import { GeneratedTokens, LoginResponse } from "./types";

export class AuthService {
    private readonly audience = "users";
    private readonly issuer = "Authentication";
    private readonly accessTokenExpiresIn = "15m";
    private readonly refreshTokenExpiresIn = "7d";
    private readonly secret: string = process.env.JWT_SECRET;

    constructor(
        private readonly usersRepository: Repository<User>,
        private readonly userTokensRepository: Repository<UserTokens>,
        private readonly userService: UserService,
    ) {}

    private generateToken(id: string, config: SignOptions = {}): string {
        const defaultConfig: SignOptions = {
            expiresIn: this.accessTokenExpiresIn,
            issuer: this.issuer,
            audience: this.audience,
        };

        const { expiresIn, issuer, audience } = { ...defaultConfig, ...config };

        if (!this.secret) {
            throw new Error("JWT secret is not defined in environment variables.");
        }

        const payload = { sub: id };

        const token = sign(payload, this.secret, {
            expiresIn,
            issuer,
            audience,
        });

        return token;
    }

    private async generateRefreshToken(userId: string): Promise<string> {
        const refreshToken = this.generateToken(userId, { expiresIn: this.refreshTokenExpiresIn });

        const expirationDate = toZonedTime(new Date(), TIMEZONE);
        expirationDate.setDate(expirationDate.getDate() + 7);

        const userToken = this.userTokensRepository.create({
            refreshToken,
            userId,
            expirationDate,
        });

        await this.userTokensRepository.save(userToken);

        return refreshToken;
    }

    private async verifyToken(token: string, config: SignOptions = {}): Promise<{ id: string }> {
        const defaultConfig: SignOptions = { issuer: this.issuer, audience: this.audience };

        const { issuer, audience } = { ...defaultConfig, ...config };

        const data = verify(token, this.secret, {
            issuer,
            audience,
        });

        if (!data) {
            throw new UnauthorizedException("Invalid token");
        }

        const id = typeof data === "string" ? data : (data as JwtPayload).sub;

        if (!id) {
            throw new UnauthorizedException("Invalid token payload");
        }

        return { id };
    }

    public async validateRefreshToken(refreshToken: string): Promise<UserTokens> {
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
    }

    public async refreshAccessToken(refreshToken: string): Promise<GeneratedTokens> {
        const userToken = await this.validateRefreshToken(refreshToken);

        const accessToken = this.generateToken(userToken.user.id);

        await this.userTokensRepository.remove(userToken);

        const newRefreshToken = await this.generateRefreshToken(userToken.user.id);

        return { accessToken, refreshToken: newRefreshToken };
    }

    public async register(data: RegisterDTO): Promise<GeneratedTokens> {
        const newUser = await this.userService.createUser(data);

        const accessToken = this.generateToken(newUser.id);
        const refreshToken = await this.generateRefreshToken(newUser.id);

        return { accessToken, refreshToken };
    }

    public async login({ user, password }: LoginDTO): Promise<LoginResponse> {
        const userInfo = await this.usersRepository.findOneBy({
            user,
        });

        if (!userInfo || !(await bcrypt.compare(password, userInfo.password))) {
            throw new UnauthorizedException("Invalid username or password");
        }

        if (userInfo.status === Status.Inactive) {
            throw new UnauthorizedException("User is inactive");
        }

        const accessToken = this.generateToken(userInfo.id);
        const refreshToken = await this.generateRefreshToken(userInfo.id);

        return { accessToken, refreshToken, user: userInfo };
    }

    public async update(id: string, data: UpdateDTO, loggedUser: User): Promise<User> {
        if (id !== data.id) {
            throw new UnauthorizedException("You can only update your own account");
        }

        return this.userService.updateUser(id, data, loggedUser);
    }

    public async logout(refreshToken: string): Promise<void> {
        const { id: userId } = await this.verifyToken(refreshToken, {});

        const userToken = await this.userTokensRepository.findOne({
            where: { refreshToken, userId },
        });

        if (userToken) {
            await this.userTokensRepository.remove(userToken);
        }
    }
}
