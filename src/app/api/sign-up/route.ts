import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import Error from "next/error";
import { ApiResponse } from "@/types/ApiResponse";


export async function POST(request : Request) : Promise<ApiResponse>{
    await dbConnect();

    try {
        const {username , email , password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({username , isVerified : true})
        if(existingUserVerifiedByUsername){
            return ({success : false , message : "Username Already Taken"})
        }
        
        const existingUserByEmail = await UserModel.findOne(email)
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return {success : false , message : "User Already Verifed"}
            }
            else{
                const hasedPassword = await bcrypt.hash(password , 10)
                existingUserByEmail.password = hasedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else{
            const hasedPassword = bcrypt.hash(password , 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email ,
                password : hasedPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isAcceptingMessage : true,
                messages : []
            })

            await newUser.save()

        }

        // send Verification Email
        const emailResponse = await sendVerificationEmail(email , username , verifyCode)

        if(!emailResponse.success){
            return {success : false , message : emailResponse.message}
        }

        return {success : true , message : "User Registered Successfully. Please Verify Your Email."}
        
    } catch (error) {
        console.error("Error Registring User" , error);
        return {success : false , message : "Error Registering User"}
    }
}