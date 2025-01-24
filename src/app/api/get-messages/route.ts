import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { UserModel } from "@/model/User.Modal";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, {
            status: 401
        });
    }

    const _user = session.user as User;
    console.log("_user object", _user);

    // Convert string to ObjectId
    const userId = new mongoose.Types.ObjectId(_user._id);
    console.log("userId", userId);

    try {
        const user = await UserModel.aggregate([
            {
                $match: { _id: userId },
            },
            {
                $project: {
                    message: {
                        $sortArray: {
                            input: "$message",
                            sortBy: { createdAt: -1 }
                        }
                    }
                }
            }
        ]);

        console.log(user[0].message)

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found",
                messages: null
            }, {
                status: 404
            });
        }

        return Response.json({
            success: true,
            message: "Messages retrieved successfully",
            messages: user[0].message || [] // Note: 'message' (singular) matches your schema
        }, {
            status: 200
        });
    } catch (error) {
        console.error("An unexpected error occurred at get message", error);

        return Response.json({
            success: false,
            message: 'Error occurred while getting messages'
        }, { status: 500 });
    }
}