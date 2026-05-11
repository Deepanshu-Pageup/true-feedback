import * as z from "zod"

export const acceptMessageSchema = z.object({
    isAcceptingMessages: z.boolean(),
})