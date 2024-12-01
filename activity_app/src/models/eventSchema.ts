import mongoose, {Schema, Document, Model} from "mongoose";

export interface IItem extends Document {
    name: string;
    description: string;
    location: string;
    capacity: number;
    start_time: string;
    end_time: string;
    latitude: number;
    longitude: number;
    type: string;
    attendees?: number;
}

const eventSchema = new Schema<IItem>({
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
    capacity: {
        type: Number,  // Changed from String to Number
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
    latitude: {
        type: Number,
        default: 0,
        required: true
    },
    longitude: {
        type: Number,
        default: 0,
        required: true
    },
    type: {
        type: String,
        default: 'custom',
        required: true
    },
    attendees: {
        type: Number,
        default: 0
    }
});

const Event: Model<IItem> = mongoose.models.Event || mongoose.model<IItem>("Event", eventSchema);
export default Event;