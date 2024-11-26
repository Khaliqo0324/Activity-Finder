import connectMongoDB from "../../(libs)/mongodb";
import { User } from "@/app/(models)/UserSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    const {email, password} = await request.json();
    await connectMongoDB();
    const hashedPassword = await bcrypt.hash(password, 5);
    const foundEmail = await User.findOne({email});
    if (foundEmail) {
        return new Response(
            JSON.stringify({error: "email already exists..."}),
            { status: 400}
        );
    } else {
    const newUser = {
        email,
        password: hashedPassword
    }
    try {
    await User.create(newUser);
    } catch (err) {
        console.log(err);
    }

    return NextResponse.json({ message: "Item added" }, {status: 201});
    }
}


