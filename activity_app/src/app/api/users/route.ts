import connectMongoDB from "@/lib/mongodb";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    // Handle POST requests
    try {
        const { email, password} = await request.json();
        if (!email || !password) {
            return NextResponse.json(
              { error: "Email and password are required" },
              { status: 400 }
            );
          }
        await connectMongoDB();
        const newUser = await User.create({email, password});
        return NextResponse.json({message: "Item added successfully", user: newUser}, {status: 201});
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function GET(request: NextRequest) {
    // Handle GET requests
    await connectMongoDB();
    const users = await User.find();
    return NextResponse.json({users});
}