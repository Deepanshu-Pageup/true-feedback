import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnection";


export async function POST(req: Request) {
  await dbConnect();

  const { username, content } = await req.json();

  try {
    const user = await UserModel.findOne({username});
    if(!user) {
        return Response.json({
            success: false,
            message: "User not Found",
        }, {status: 404});
    };

    if(!user.isAcceptingMessages) {
        return Response.json({
            success: false,
            message: 'User is not Accepting a messages',
        }, {status: 403})
    };

    const newMessage = {
        content,
        createdAt: new Date()
    }

    user.messages.push(newMessage);
    await user.save()

    return Response.json({
        success: true,
        message: "Message is sent successfully",
    }, {status: 200});

  } catch (error) {
    console.error("Send message Error: ", error);
    return Response.json({
        success: true,
        message: 'Send message error',
    }, {status: 500})
  }
}

