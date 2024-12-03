/*
Middleware
Allow authenticated users to access protected routes
Redirect unauthenticated users to login
Allow everyone to access public routes
*/

import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "auth.config";

const { auth } = NextAuth(authConfig);

export async function middleware(request: any) {
    const { nextUrl } = request;
    const session = await auth();
    const isAuthenticated = !!session?.user;
    console.log(isAuthenticated, nextUrl.pathname);

    const reqUrl = new URL(request.url);
    if (isAuthenticated && reqUrl.pathname !== "/") {
        return NextResponse.redirect(new URL("/", request.url));

    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/create-item/",
        "/edit-item/:path*"
    ]
};
