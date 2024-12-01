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
        location: {
            lat: number;
            lng: number;
        }
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
        default: 'No description available'
    },
    location: {
        type: String,
        required: true,
    },
    geometry: {
        location: {
            lat: { type: Number, required: true, default: 0 },
            lng: { type: Number, required: true, default: 0 }
        }
    },
    type: {
        type: String,
        required: true,
        default: 'custom'
    },
    capacity: {
        type: Number,
        required: true,
    },
    start_time: {
        type: String,
        required: true,
        default: () => new Date().toISOString()
    },
    end_time: {
        type: String,
        required: true,
        default: () => new Date(Date.now() + 86400000).toISOString()
    },
    attendees: {
        type: Number,
        default: 0
    }
});

const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
export default Event;