import { z } from 'zod';

export const usernameValidation = z.string().min(2, "username must be 2 character Long").max(12, "username must not be 12 character long").regex(/^[a-zA-Z0-9_]*$/, "username must be not contain special character");


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid Email" }),
    password: z.string().min(8, "password must be 8 character long"),
})