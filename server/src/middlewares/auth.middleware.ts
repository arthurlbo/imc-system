import { Request, Response, NextFunction } from "express";

import { Status } from "@/enums/status.enum";
import { UnauthorizedException } from "@/commons/http-exception";

import { AuthService } from "@/modules/auth/auth.service";

export const authMiddleware = (authService: AuthService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authorizationHeader = req.headers.authorization || "";
            const token = authorizationHeader.split(" ")[1];

            if (!token) {
                throw new UnauthorizedException("Token not provided");
            }

            const tokenPayload = await authService.validateRefreshToken(token);

            const user = tokenPayload.user;

            if (!user) {
                throw new UnauthorizedException("User account not found");
            }

            if (user.status === Status.Inactive) {
                throw new UnauthorizedException("User account is inactive");
            }

            req.user = user;

            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return next(new UnauthorizedException("Token expired"));
            }

            if (error.name === "JsonWebTokenError") {
                return next(new UnauthorizedException("Invalid token"));
            }

            next(new UnauthorizedException(error.message));
        }
    };
};
