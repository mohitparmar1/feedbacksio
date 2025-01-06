import { z } from 'zod';


export const verifySchem = z.object({
    code: z.string().length(6, "code must be 6 character long")
})