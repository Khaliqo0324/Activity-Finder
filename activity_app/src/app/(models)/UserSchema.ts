import mongoose, {Document, Schema} from "mongoose";

export interface MyUser extends Document {
    email: string;
    password: string;
}

const userSchema = new Schema<MyUser>({
    email: {type: String, unique: true, required: true},
    password: { type: String, required: true, select: false},

});

export const User = mongoose.models.User ?? mongoose.model("User", userSchema);