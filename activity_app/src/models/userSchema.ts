import mongoose, {Schema, Document, Model} from "mongoose";

interface IItem extends Document {
    email: string;
    password: string;

}

const userSchema = new Schema<IItem>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
});

const User: Model<IItem> = mongoose.models.User || mongoose.model<IItem>("User", userSchema);
export default User;