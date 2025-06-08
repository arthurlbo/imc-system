import { toZonedTime, format } from "date-fns-tz";
import { Request, Response, NextFunction } from "express";

import { TIMEZONE } from "@/constants/timezone";
import { HttpException } from "@/commons/http-exception";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
    const zonedDate = toZonedTime(new Date(), TIMEZONE);
    const date = format(zonedDate, "yyyy-MM-dd HH:mm:ssXXX");

    if (err instanceof HttpException) {
        return res.status(err.status).json({
            status: "error",
            message: err.message,
            path: req.path,
            errors: err.errors,
            date,
        });
    }

    return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        path: req.path,
        date,
    });
}
