import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function POST(request:Request) {
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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {
                $match : {id : userId}
            },
            {
                $unwind : '$messages'
            },
            {
                $sort : {
                    '$messages.createdAt' : -1
                }
            },
            {
                $group : {_id : "$_id" , messages : {$push : "$messages"}}
            }
        ])
        if(!user || user.length === 0){
            return Response.json({
                success : false,
                message : "User not Found"
            }, { status : 401})
        }
        return Response.json({
            success : false,
            message : user[0].messages
        }, { status : 200})
    } catch (error) {
        console.log("Failed to get Message ");
        return Response.json(
            {
                success: false,
                message: "Failed to get Message  "
            }, { status: 500 }
        )
    }

}


