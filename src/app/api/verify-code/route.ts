import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/user.model";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, code } = await req.json();
    const decodedUser = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUser });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User is not exist",
        },
        { status: 404 },
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpierd = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeExpierd && isCodeValid) {
      user.isVerified = true;
      await user.save();

      return Response.json({
        success: true,
        message: "User is Verified",
      });
    } else if (!isCodeExpierd) {
      return Response.json(
        {
          success: false,
          message: "The verification code is expired please sign up again",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid code",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Verification code error", error);
    return Response.json(
      {
        success: false,
        message: "Verification Error",
      },
      {
        status: 400,
      },
    );
  }
}
