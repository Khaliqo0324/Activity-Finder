import connectMongoDB from "@/lib/mongodb";
import Event from "@/models/eventSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    // Handle POST requests
    const { name, description, location, capacity} = await request.json();
    await connectMongoDB();
    await Event.create({name, description, location, capacity});
    return NextResponse.json({message: "Event added successfully"}, {status: 201});
}


export async function GET(request: NextRequest) {
    // Handle GET requests
    await connectMongoDB();
    const events = await Event.find();
    return NextResponse.json({events});
}