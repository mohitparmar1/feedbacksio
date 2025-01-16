import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.Modal";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<any> {
                if (!credentials) throw new Error("No credentials provided");
                try {
                    await dbConnect();

                    const user = await UserModel.findOne({
                        $or: [{
                            email: credentials.email,
                        }, { username: credentials.email, }]
                    })
                    if (!user) {
                        throw new Error("no user found with this email")
                    }
                    if (!user.isVerified) {
                        throw new Error("please verify your account before login")
                    }
                    const isPasswordMatch = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordMatch) {
                        return user
                    } else {
                        throw new Error("Incorrect Password")
                    }
                } catch (error: any) {
                    throw new Error(error.message)
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }

            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}