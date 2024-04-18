import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request: Request) {
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

    const userId = user._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            { userId },
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Cannot get Updated User"
                }, { status: 401 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message acceptance Status Updated Successfully"
            }, { status: 200 }
        )
    } catch (error) {
        console.log("Failed to Update User Status to accept Messages ");
        return Response.json(
            {
                success: false,
                message: "Failed to Update User Status to accept Messages "
            }, { status: 500 }
        )
    }


}

export async function GET(request: Request) {
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

    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "Cannot get Updated User"
                }, { status: 401 }
            )
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessage : foundUser.isAcceptingMessage
            }, { status: 200 }
        )
    } catch (error) {
        console.log("Failed to Update User Status to accept Messages ");
        return Response.json(
            {
                success: false,
                message: "Error in Getting message acceptance status "
            }, { status: 500 }
        )
    }
}