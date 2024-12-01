import mongoose, {Schema, Document, Model} from "mongoose";
import { number, string } from "zod";

interface IItem extends Document {
    name: string;
    description: string;
    location: string;
    capacity: string;
}

const eventSchema = new Schema<IItem>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    capacity: {
        type: String,
    },

});

const Event: Model<IItem> = mongoose.models.Event || mongoose.model<IItem>("Event", eventSchema);
export default Event;