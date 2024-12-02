import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
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

const eventSchema = new Schema<IEvent>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    start_time: {
        type: String,
        required: true,
    },
    end_time: {
        type: String,
        required: true,
    },
    geometry: {
        location: {
            lat: { type: Number, required: true, default: 0 },
            lng: { type: Number, required: true, default: 0 }
        }
    },
    attendees: {
        type: Number,
        default: 0
    }
});

const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
export default Event;