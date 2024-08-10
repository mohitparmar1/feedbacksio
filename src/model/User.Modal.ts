import mongoose, { Schema, Document } from "mongoose";


export interface Message extends Document {
    content: string;
    createdAt: Date;
}

export interface User extends Document {
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpire: Date;
    isAcceptingMessage: boolean;
    message: Message[];
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const UserSchema: Schema<User> = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: true
    },
    verifyCode: {
        type: String,
        required: true
    },
    verifyCodeExpire: {
        type: Date,
        required: true
    },
    isAcceptingMessage: {
        type: Boolean,
        required: true,
        default: true
    },
    message: [MessageSchema]
})

const MessageModel = mongoose.model<Message>("Message", MessageSchema);
const UserModel = mongoose.model<User>("User", UserSchema);

export { MessageModel, UserModel }