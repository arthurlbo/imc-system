import { Request, Response, NextFunction } from "express";

import { Profile } from "@/enums/profile.enum";
import { ForbiddenException } from "@/commons/http-exception";

export const profileMiddleware = (profiles: Profile[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ForbiddenException("User is not authenticated"));
        }

        if (profiles.length > 0 && !profiles.includes(req.user.profile)) {
            return next(new ForbiddenException("User does not have the required profile"));
        }

        next();
    };
};
