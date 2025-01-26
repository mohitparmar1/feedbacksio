import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { UserModel } from "@/model/User.Modal";

interface IUser {
    _id: string;
    email: string;
    username: string;
    password: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                try {
                    await dbConnect();

                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    }) as IUser | null;

                    if (!user) {
                        throw new Error("No user found with this email");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login");
                    }

                    const isPasswordMatch = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordMatch) {
                        throw new Error("Incorrect password");
                    }

                    return {
                        _id: user._id.toString(),
                        email: user.email,
                        username: user.username,
                        isVerified: user.isVerified,
                        isAcceptingMessage: user.isAcceptingMessage
                    };
                } catch (error: any) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user.id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};