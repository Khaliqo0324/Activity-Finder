"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Heading = () => {
    return (
        <div className="max-w-2xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-4xl font-bold">
                Discover, Connect, and Participate – All in One Place. Welcome to <span className="underline">TivQuest</span>.
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium mt-4">
                <span className="underline">TivQuest</span> is your ultimate destination for finding and joining activities, bringing people together with ease and simplicity.
            </h3>
            <Button> 
                <Link href="/base">
                    Enter TivQuest
                    
                </Link>
            </Button>
            
           
        </div>
    );
}