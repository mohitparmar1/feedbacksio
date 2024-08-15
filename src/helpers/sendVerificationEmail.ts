import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import {
    ApiResponse

} from "@/types/ApiResponse";

export async function sendVerificationEmail(
    username: string,
    email: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'mohitparmar3340@gmail.com',
            to: email,
            subject: 'Verify your email',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return (
            {
                success: true,
                message: "Verification email sent successfully",
            }
        )
    } catch (error) {
        console.error("Error in sending verification email", error);
        const errorMessage = error.message || "Error in sending verification email";
        return (
            {
                success: false,
                message: errorMessage
            }
        )
    }
}