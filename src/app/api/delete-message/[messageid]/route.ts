import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function DELETE(request:Request , {params} : {params : {messageid : string }}) {
    const messageId = params.messageid
    dbConnect()

    const session = await getServerSession(authOptions)
    console.log(session);
    const user: User = session?.user

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            }, { status: 401 }
        )
    }

    try {
        const updatedResult = await UserModel.updateOne(
            {_id : user._id},
            {$pull : {messages : {_id : messageId}}},
        )
        if(updatedResult.modifiedCount === 0 ){
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already Deleted"
                }, { status: 401 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message Deleted"
            }, { status: 200 }
        )
    } catch (error) {
        console.log("Error in Deleting message" , error);
        return Response.json(
            {
                success: false,
                message: "Error Deleting Message"
            }, { status: 500 }
        )
    }
    

}


