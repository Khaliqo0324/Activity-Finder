import connectMongoDB from "./../../../(libs)/mongodb";
import { User } from "@/app/(models)/UserSchema";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {signIn} from "next-auth/react"
import bcrypt from 'bcryptjs';


export async function POST(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email, password } = req.body;

    await connectMongoDB();

    const user = await User.findOne( {email}).select('+password');
    if (!user) {
        console.log(user);
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("password has issues");
    }
    //return res.status(201).json({success: true, message: 'Authentication successful'});

    //await signIn('credentials', { email, password })
    



console.log(res);
}