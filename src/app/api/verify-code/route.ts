import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";

export async function POST(request : Request){
    await dbConnect()

    try {
        const {username , code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        console.log("apan idhar verify code mein hai",username , code);

        const user = await UserModel.findOne({username : decodedUsername})

        if(!user){
            return Response.json(
                {
                    success : false,
                    message : "User not found"
                },{status : 400}
            )
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success : true,
                    message : "Account Verified Successfully"
                },{status : 200}
            )
        }else if(!isCodeNotExpired){
            return Response.json(
                {
                    success : false,
                    message : "Verification Code has Expired , Please Signup Again to get a new Code"
                },{status : 400}
            )
        }
        else{
            return Response.json(
                {
                    success : false,
                    message : "Incorrect Verification Code"
                },{status : 400}
            )
        }
    } catch (error) {
        console.error("Error Checking User" , error);
        return Response.json(
            {
                success : false,
                message : "Error Checking User"
            },
            {
                status : 500
            }
        )
    }
}