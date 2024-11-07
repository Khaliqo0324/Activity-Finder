"use client";

import { Logo } from "../../../components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Navbar = () => {
    return (
        <div className="flex items-center w-full p-6 bg-background z-50">
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex">
                {/* Replace authentication checks with static buttons or links */}
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">
                        Log in
                    </Link>
                </Button>
                
                <Button size="sm" asChild>
                    <Link href="/base">
                        Enter NAME
                    </Link>
                </Button>
                
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/profile">
                        Profile
                    </Link>
                </Button>
            </div>
        </div>
    );
}
