import { z } from 'zod';


export const messageSchema = z.object({
    content: z.string().min(10, "content must be 10 character long").max(300, "content must not be 300 character long"),
})