import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.Modal";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUserByUsername) {
            return Response.json({
                success: false,
                message: "Username already exists"
            }, {
                status: 400
            })
        }
        const existingUserByEmail = await UserModel.findOne({
            email
        })

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already Exists with this email"
                }, {
                    status: 400
                })
            } else {
                const hashPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpire = new Date(Date.now() + 60 * 60 * 1000);
                await existingUserByEmail.save();
            }
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode: verifyCode,
                verifyCodeExpire: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
            })
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(
            username,
            email,
            verifyCode
        );
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }
        return Response.json({
            success: true,
            message: "User Registered Successfully,Please Verify Your Email",
            verificationCode: verifyCode
        }, {
            status: 200
        })
    } catch (error) {
        console.error("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        })
    }
}