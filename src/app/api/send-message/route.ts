import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.Modal";
import { Message } from "@/model/User.Modal"
import { truncate } from "fs/promises";

export async function POST(request: Request) {
    await dbConnect();

    const { content, username } = await request.json();

    try {

        const user = await UserModel.findOne({
            username
        })

        if (!user) {
            return Response.json({
                success: false,
                message: 'user not found'
            }, {
                status: 404
            })
        }

        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: 'user is not accepting the message'
            }, {
                status: 403
            })
        }


        const newMessage = { content, createdAt: new Date() }

        user.message.push(newMessage as Message)

        await user.save();

        return Response.json({
            success: true,
            message: 'Message sent successfully'
        }, {
            status: 200
        })

    } catch (error) {
        console.error("Error occured while sending message", error)

        return Response.json({
            success: false,
            message: 'internal server error'
        }, {
            status: 500
        })
    }
}