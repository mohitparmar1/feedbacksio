import { getServerSession } from "next-auth";
import { UserModel } from "@/model/User.Modal";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function GET(request: Request) {

    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, {
            status: 401
        })
    }
    const _user = session?.user;

    // for converting string/object into mongoos objectId
    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const user = await UserModel.aggregate([
            {
                $match: { _id: userId },

            },
            { $unwind: '$message' },
            { $sort: { 'message.createdAt': -1 } },
            {
                $group: { _id: '$_id', message: { $push: '$message' } }
            }
        ])

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found",
                data: null
            }, {
                status: 4014
            })
        }

        return Response.json({
            success: true,
            message: "messages retrived successfully",
            messages : user[0].message
        }, {
            status: 200
        })
    } catch (error) {
        console.error("An unexpected error occured at get message", error)

        return Response.json({
            success: false,
            message: 'Error occured while getting messages'
        }, { status: 500 })
    }
}