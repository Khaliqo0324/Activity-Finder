import connectMongoDB from "@/lib/mongodb";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

interface RouteParams {
    params: { id: string };
}

export async function GET(request: NextRequest, {params}: RouteParams) {
    const {id} = await params;
    await connectMongoDB();
    const user = await User.findOne({_id: id });
    return NextResponse.json({user}, {status: 200});
}

export async function PUT(request: NextRequest, {params}: RouteParams) {
    const { id } = await params;
    const { email: email, password: password } = await request.json();
    await connectMongoDB();
    await User.findByIdAndUpdate(id, {email, password});
    return NextResponse.json({message: "User updated"}, {status: 200});
    
}

export async function DELETE(request: NextRequest, {params}: RouteParams) {
    const {id} = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({message: "Invalid ID format"}, {status: 400});
    }
    await connectMongoDB();
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        return NextResponse.json({message: "Item not found"}, {status: 404});
    }

    return NextResponse.json({message: "Item deleted"}, {status: 200});

}
