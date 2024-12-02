import connectMongoDB from "@/lib/mongodb";
import Event, { IEvent } from "@/models/eventSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { Event as EventType, Location } from "@/app/(main)/_components/types";
import { Document, Types } from 'mongoose';

// Define the lean document type (without Document methods)
interface MongoEventDoc {
    _id: Types.ObjectId;
    name: string;
    description: string;
    location: string;
    type: string;
    capacity: number;
    start_time: string;
    end_time: string;
    geometry: {
        location: Location;
    };
    attendees?: number;
}

// Create new event
export async function POST(request: NextRequest) {
    try {
        const eventData = await request.json();
        await connectMongoDB();
        const newEvent = await Event.create(eventData);
        
        const transformedEvent: EventType = {
            id: newEvent._id.toString(),
            name: newEvent.name,
            description: newEvent.description,
            location: newEvent.location,
            type: newEvent.type,
            capacity: newEvent.capacity,
            start_time: newEvent.start_time,
            end_time: newEvent.end_time,
            geometry: {
                location: {
                    lat: newEvent.geometry?.location?.lat || 0,
                    lng: newEvent.geometry?.location?.lng || 0
                }
            },
            attendees: newEvent.attendees
        };

        return NextResponse.json({ 
            message: "Event added successfully",
            event: transformedEvent 
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: "Error creating event" }, { status: 500 });
    }
}

// Update event by ID
export async function PUT(request: NextRequest) {
    try {
        const { id, ...updateData } = await request.json();
        await connectMongoDB();
        
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).lean() as MongoEventDoc | null;

        if (!updatedEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const transformedEvent: EventType = {
            id: updatedEvent._id.toString(),
            name: updatedEvent.name,
            description: updatedEvent.description,
            location: updatedEvent.location,
            type: updatedEvent.type,
            capacity: updatedEvent.capacity,
            start_time: updatedEvent.start_time,
            end_time: updatedEvent.end_time,
            geometry: {
                location: {
                    lat: updatedEvent.geometry?.location?.lat || 0,
                    lng: updatedEvent.geometry?.location?.lng || 0
                }
            },
            attendees: updatedEvent.attendees
        };

        return NextResponse.json({ 
            message: "Event updated successfully", 
            event: transformedEvent 
        });
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: "Error updating event" }, { status: 500 });
    }
}

// Get all events
export async function GET() {
    try {
        await connectMongoDB();
        const events = await Event.find().lean() as unknown as MongoEventDoc[];
        
        const transformedEvents: EventType[] = events.map(event => ({
            id: event._id.toString(),
            name: event.name,
            description: event.description,
            location: event.location,
            type: event.type,
            capacity: event.capacity,
            start_time: event.start_time,
            end_time: event.end_time,
            geometry: {
                location: {
                    lat: event.geometry?.location?.lat || 0,
                    lng: event.geometry?.location?.lng || 0
                }
            },
            attendees: event.attendees
        }));

        return NextResponse.json({ events: transformedEvents });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: "Error fetching events" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
        }

        await connectMongoDB();
        const deletedEvent = await Event.findByIdAndDelete(id).lean() as unknown as MongoEventDoc;

        if (!deletedEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const transformedEvent: EventType = {
            id: deletedEvent._id.toString(),
            name: deletedEvent.name,
            description: deletedEvent.description,
            location: deletedEvent.location,
            type: deletedEvent.type,
            capacity: deletedEvent.capacity,
            start_time: deletedEvent.start_time,
            end_time: deletedEvent.end_time,
            geometry: {
                location: {
                    lat: deletedEvent.geometry?.location?.lat || 0,
                    lng: deletedEvent.geometry?.location?.lng || 0
                }
            },
            attendees: deletedEvent.attendees
        };

        return NextResponse.json({ 
            message: "Event deleted successfully",
            event: transformedEvent
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: "Error deleting event" }, { status: 500 });
    }
}