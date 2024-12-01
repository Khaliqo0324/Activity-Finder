'use client';
import mongoose, {Document, Schema} from "mongoose";

export interface MyUser extends Document {
    email: string;
    password: string;
}

const userSchema = new Schema<MyUser>({
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true},

});

export const User = mongoose.models.User || mongoose.model<MyUser>("User", userSchema);
