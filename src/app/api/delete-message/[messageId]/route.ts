import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.Modal";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const messageId = params.messageId

    await dbConnect();
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return Response.json({ success: false, message: 'Not authenticated' },
            { status: 401 })
    }
    const user = session.user
    try {
        const updateResult = await UserModel.updateOne({
            _id: user._id
        }, {
            $pull: { message: { _id: messageId } }
        })
        if (updateResult.modifiedCount === 0) {
            return Response.json(
                { message: 'Message not found or already deleted', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { message: 'Message deleted', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting message:', error);
        return Response.json(
            { message: 'Error deleting message', success: false },
            { status: 500 }
        );
    }
}