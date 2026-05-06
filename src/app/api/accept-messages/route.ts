import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOption);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 },
    );
  }

  const userId = user._id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      {
        new: true,
      },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User is not Updated",
        },
        { status: 401 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Acceptance status updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOption);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 },
    );
  }

  const userId = user._id;
  try {
    const userFound = await UserModel.findById({ userId });

    if (!userFound) {
      return Response.json(
        {
          success: false,
          message: "User not Found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        isAccetingMessage: userFound.isAcceptingMessage,
        message: "User is Accepting messages",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("The Accepting messages Error" , error);
    return Response.json({
        success: true,
        message: "Accepting messages status error"
    }, {status: 500})
  }
}
