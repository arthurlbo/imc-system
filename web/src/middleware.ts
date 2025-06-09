import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL + "/login");
    }

    const response = NextResponse.next();

    response.headers.set("x-url", request.url);

    return response;
}

export const config = {
    matcher: ["/", "/dashboard:path*"],
};
