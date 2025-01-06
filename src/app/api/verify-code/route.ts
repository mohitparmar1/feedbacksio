import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.Modal";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: 'username not found'
            }, { status: 400 })
        }

        const isValidCode = user.verifyCode === code;
        const isNotExpiredCode = new Date(user.verifyCodeExpire) > new Date();

        if (isValidCode && isNotExpiredCode) {
            //update the user's verification status 
            user.isVerified = true
            await user.save();

            return Response.json({
                success : true,
                message : "account verified successfully"
            },{
                status:200
            })
        }
        // code is correct but expired
        else if (!isNotExpiredCode) {
            return Response.json({
                success: false,
                message: 'verification code has expired, please signup again to get a new code'
            }, { status: 401 })
        }
        // code is incorrect 
        else {
            return Response.json({
                success: false,
                message: 'Incorrect verification code'
            }, { status: 400 })
        }
    } catch (error) {
        console.error("Error while verifing code")
        return Response.json({
            success: false,
            message: 'error while verifing code'
        }, { status: 400 })
    }
}