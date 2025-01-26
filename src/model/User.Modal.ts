import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    _id: string
    content: string;
    createdAt: Date;
}

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpire: Date;
    isVerified: boolean;
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
    username: {
        type: String,
        unique: true,
        required: [true, "username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
    isVerified: {
        type: Boolean,
        required: [true, "isVerified is required"],
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

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>("Message", MessageSchema);
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);


export { UserModel, MessageModel }