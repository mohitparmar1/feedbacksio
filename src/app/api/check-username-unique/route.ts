import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.Modal";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: usernameErrors?.length >
                    0 ? usernameErrors.join(', ') : 'Invalid query paramaters'
            }, {
                status: 401
            })
        }

        const { username } = result.data;
        console.log(result.data.username)

        const existingVerified = await UserModel.findOne({ username, isVerified: true })

        if (existingVerified) {
            return Response.json({
                success: false,
                message: 'username is already taken'
            },
                { status: 401 })
        }
        return Response.json({
            success: true,
            message: 'username is unique',
        }, {
            status: 200
        })
    } catch (error) {
        console.error("Error checking usernmae:", error)

        return Response.json({
            success: false,
            message: "Error while checkng username unique"
        }, {
            status: 400,
        })
    }
}