import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import Email from "next-auth/providers/email";

export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id : "credentials",
            name : "Credentials",
            credentials : {
                email : { label : "Email" , type : "text" },
                password : {label : "Password" , type : "password"}
            },
            async authorize(credentials : any) : Promise<any>{
                await dbConnect();
                try {
                    console.log("IDhar aaya na");
                    const user = await UserModel.findOne({
                        $or : [
                            {email : credentials.identifier},
                            {username : credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("No User Found with This Email")
                    }
                    if(!user.isVerified){
                        throw new Error('Please Verify Your Account Before Login')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password , user.password)

                    if(isPasswordCorrect){
                        return user
                    }
                    else{
                        throw new Error("Incorrect Password")
                    }


                } catch (error: any) {
                    throw new Error(error)   
                }
            }
        })
    ],
    callbacks : {
        async session ({session , token}){
                if(token){
                    session.user._id = token._id,
                    session.user.isVerified = token.isVerified
                    session.user.isAcceptingMessage = token.isVerified
                    session.user.username = token.username
                }
            return session
        },
        async jwt ({token , user }){
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessage
                token.username = user.username
            }
            return token
        }
    },
    pages : {
        signIn : "/sign-in"
    },
    session : {
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET
}