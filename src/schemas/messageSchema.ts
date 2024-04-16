import {z} from "zod";

export const messageSchema = z.object({
    content : z.string().min(10 , "Content must be atleast 10 Charecters")
    .max(300 , "Content must be no Longer than 300 Charecters")
})