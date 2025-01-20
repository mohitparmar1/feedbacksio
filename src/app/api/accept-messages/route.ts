import { getServerSession } from "next-auth";
import { UserModel } from "@/model/User.Modal";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)

    console.log(session)


    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    const user = session?.user as User;

    console.log(user)

    const userId = user._id;

    const { acceptMessage } = await request.json();


    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage: acceptMessage
        }, { new: true })

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "unable to find user to update message acceptance status"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully "
        }, { status: 200 })
    } catch (error) {
        console.error("error while updating accepting message", error)
        return Response.json(
            { success: false, message: 'Error updating message acceptance status' },
            { status: 501 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user = session?.user;

    if (!session && !user) {
        return Response.json({
            success: false,
            message: "not authenticated"
        }, { status: 401 })
    }

    try {

        const foundUser = await UserModel.findById(user?._id)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage,
        }, { status: 200 })

    } catch (error) {
        console.error("error retrieving message acceptance status", error)
        return Response.json(
            { success: false, message: 'Error while retrieving message acceptance status' },
            { status: 501 }
        );
    }
}