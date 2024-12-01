import mongoose, {Document, Schema, Model} from "mongoose";


export interface MyUser extends Document {
    email: string;
    password: string;
}

const userSchema = new Schema<MyUser>({
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true},

});

export const User: Model<MyUser> = mongoose.models.User ?? mongoose.model<MyUser>("User", userSchema);
