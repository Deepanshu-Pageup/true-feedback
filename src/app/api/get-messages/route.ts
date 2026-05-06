import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/user.model";
import { User } from "next-auth";


export async function GET(req : Request) {
    await dbConnect();
    const session = await getServerSession(authOption);
    const user: User = session?.user as User;

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Session is expierd',
        }, {status: 400})
    };

    const userId = user._id;
    
    try {
        const user = await UserModel.aggregate([
            {$match: {id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ]);

        if(!user || user.length === 0 ) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, {status: 404})
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        }, {status: 200})
        
    } catch (error) {
        console.error('Get all messages Error: ', error);
        return Response.json({
            success: false,
            message: 'Get all messages Error',
        }, {status: 500})
    }
};

