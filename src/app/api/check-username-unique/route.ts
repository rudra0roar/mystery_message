import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request){
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username : searchParams.get("username")
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success : false,
                message : usernameErrors?.length > 0 ? usernameErrors.join(",") : "Invalid Query Parameters"
            },
        {
            status : 400
        })
        }

        const {username} = result.data

        console.log("YE waali username ki value hai na sir",username);

        const existingVerifiedUser = await UserModel.findOne({username , isVerified : true})
        console.log("ye apna existing Verified User hai",existingVerifiedUser);

        if(existingVerifiedUser){
            return Response.json({
                success : false,
                message : "username is already taken"
            },
        {
            status : 400
        })
        }
        return Response.json({
            success : true,
            message : "username is available"
        },
    {
        status : 200
    })
    } catch (error) {
        console.error("Error Checking Username" , error);
        return Response.json(
            {
                success : false,
                message : "Error Checking Username"
            },
            {
                status : 500
            }
        )
    }
}