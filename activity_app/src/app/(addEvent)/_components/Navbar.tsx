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
            </div>
        </div>
    );
}
