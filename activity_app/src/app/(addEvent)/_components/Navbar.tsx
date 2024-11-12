"use client";

import { Logo } from "../../../components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Navbar = () => {
    return (
        <div className="flex items-center w-full p-6 bg-background z-50">
            <Logo />
            <div className="md:ml-auto md:justify-end w-full flex items-center space-x-4">
                {/* Replace authentication checks with static buttons or links */}
               
                <Button>
                    <Link href="/base">
                        Home
                    </Link>
                </Button>

                <Button >
                    <Link href="/">
                        Sign out
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
