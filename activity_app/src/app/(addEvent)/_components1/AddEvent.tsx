"use client";

import { Avatar } from "@/components/ui/avatar";
import { Logo } from "../../../components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserAvatar } from "@/components/avatar";

export const AddEvent = () => {
    return (
        <div className="flex items-center w-full p-6 bg-background z-50">
        <Logo />
        <div className="md:ml-auto md:justify-end w-full flex items-center space-x-4">
            
            


        <Button>
            Sign out
        </Button>

        <UserAvatar/>
        </div>
    </div>
    );
}
