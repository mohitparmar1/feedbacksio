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
    // Connect to the database
    await dbConnect();

    // Get the user session
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // Check if the user is authenticated
    if (!session || !user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        // Retrieve the user from the database using the ID
        const foundUser = await UserModel.findById(user._id);

        if (!foundUser) {
            // User not found
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Return the user's message acceptance status
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
            { success: false, message: 'Error retrieving message acceptance status' },
            { status: 500 }
        );
    }
}