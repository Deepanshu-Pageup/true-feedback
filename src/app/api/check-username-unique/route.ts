import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/user.model";
import * as z  from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req:Request) {
    await dbConnect();

    try {
        const {searchParams} = new URL(req.url);
        const queryParam = {
            username: searchParams.get('username')
        };
        // validate with zod 
       const result = UsernameQuerySchema.safeParse(queryParam) 
       if(!result.success) {
            const flattend = result.error.flatten();
            const fieldError = flattend.fieldErrors;

            const errorMessage = fieldError.username?.[0] || "Invalid error";

            return Response.json({
                success: false,
                message: errorMessage,
            }, {status: 400})   
       }

       const {username} = result.data;
       const existingVerifiedUser = await UserModel.findOne({username , isVerified: true});

       if(existingVerifiedUser) {
        return Response.json({
            success: false,
            message: "Username is already taken",
        }, {status: 400})
       }

       return Response.json({
        success: true,
        message: 'Username is available'
       }, {status: 200})

    } catch (error) {
        console.error("Error checking username" , error);
        return Response.json(
            {
                success: false,
                message: "Error Checking username"
            },
            { status: 500 }
        )
    }
    
}