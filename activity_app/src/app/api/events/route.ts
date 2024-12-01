import connectMongoDB from "@/lib/mongodb";
import Event from "@/models/eventSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Create new event
export async function POST(request: NextRequest) {
    try {
        const { name, description, location, capacity } = await request.json();
        await connectMongoDB();
        await Event.create({ name, description, location, capacity });
        return NextResponse.json({ message: "Event added successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error creating event" }, { status: 500 });
    }
}

// Get all events
export async function GET() {
    try {
        await connectMongoDB();
        const events = await Event.find();
        return NextResponse.json({ events });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching events" }, { status: 500 });
    }
}

// Update event by ID
export async function PUT(request: NextRequest) {
    try {
        const { id, name, description, location, capacity } = await request.json();
        await connectMongoDB();
        
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { name, description, location, capacity },
            { new: true }
        );

        if (!updatedEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        return NextResponse.json({ error: "Error updating event" }, { status: 500 });
    }
}

// Delete event by ID
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
        }

        await connectMongoDB();
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Event deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting event" }, { status: 500 });
    }
}