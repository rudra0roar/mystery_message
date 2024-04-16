import {z} from "zod"

export const usernameValidation = z.string()
.min(2 , "Username must be atleast 2 Charecters")
.max(20 , "Username must be atmax 20 Charecters ")
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special Charecters")


export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message : "Invalid Email Address"}),
    password : z.string().min(6 , "Password must be atleast 6 Charecters")
})