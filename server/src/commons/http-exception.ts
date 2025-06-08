export class HttpException extends Error {
    public status: number;
    public errors?: unknown;

    constructor(status: number, message: string, errors?: unknown) {
        super(message);
        this.status = status;
        this.errors = errors;
        Object.setPrototypeOf(this, HttpException.prototype);
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string, errors?: unknown) {
        super(404, message, errors);
    }
}

export class BadRequestException extends HttpException {
    constructor(message: string, errors?: unknown) {
        super(400, message, errors);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message = "Unauthorized", errors?: unknown) {
        super(401, message, errors);
    }
}

export class ForbiddenException extends HttpException {
    constructor(message = "Forbidden", errors?: unknown) {
        super(403, message, errors);
    }
}

export class InternalServerErrorException extends HttpException {
    constructor(message = "Internal Server Error", errors?: unknown) {
        super(500, message, errors);
    }
}
