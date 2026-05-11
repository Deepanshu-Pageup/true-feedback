import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/user.model";
import { authOption } from "../../auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ messageid: string }> },
) => {
  await dbConnect();
  const { messageid: messageId } = await params;
  const session = await getServerSession(authOption);
  const user = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "User is not authenticated",
      },
      { status: 400 },
    );
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid message id",
        },
        { status: 400 },
      );
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: user._id,
        "messages._id": new mongoose.Types.ObjectId(messageId),
      },
      {
        $pull: {
          messages: { _id: new mongoose.Types.ObjectId(messageId) },
        },
      },
      {
        returnDocument: "after",
      },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Message not found or deleted",
        },
        { status: 400 },
      );
    };

    return Response.json({
        success: true,
        message: "Message deleted Successfully",
    }, {status: 200})
  } catch (error) {
     console.error('Error deleting message:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
};
