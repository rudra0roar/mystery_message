import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";


export async function POST(request : Request){
    console.log("sign in mein aaya kya");
    await dbConnect();

    try {
        const {username , email , password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({username , isVerified : true})
        if(existingUserVerifiedByUsername){
            return NextResponse.json({success : false , message : "User Already Exist"},{status : 400});
        }
        console.log(existingUserVerifiedByUsername);
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json({success : false , message : "User Already Verifed"},{status : 400});
            }
            else{
                console.log("Idhar aay kya");
                const hasedPassword = await bcrypt.hash(password , 10)
                existingUserByEmail.password = hasedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else{
            const hasedPassword = await bcrypt.hash(password , 10)
            console.log("Hashed Password" , hasedPassword);
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
            console.log(newUser);
            console.log("Yha tak to mushkil hii ponche honge");

            await newUser.save()

        }

        // send Verification Email
        const emailResponse = await sendVerificationEmail(email , username , verifyCode)
        console.log("email response k baad aaya kya" , emailResponse);
        if(!emailResponse.success){
            console.log("Idhar to aaya hoga");
            return NextResponse.json({success : false , message : emailResponse.message});
        }

        return NextResponse.json({success : true , message : "User Registered Successfully. Please Verify Your Email."},{status : 200});
        
    } catch (error) {
        console.error("Error Registring User" , error);
        return NextResponse.json({success : false , message : "Error in Registering User"},{status : 400});
    }
}