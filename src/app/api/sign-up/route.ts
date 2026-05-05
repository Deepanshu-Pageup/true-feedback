import dbConnect from "@/lib/dbConnection";
import UserModel, { User } from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerficationEmail } from "@/helpers/sendVerificationEmail";
import { messageSchema } from "@/schemas/messageSchema";
import { success } from "zod";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();

// find the user which already have username and verified email
    const exisitingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (exisitingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    }

// find user having a email 
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifiedCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
        if(existingUserByEmail.isVerified) {
            return Response.json({
                success: false,
                message: "User already exist with this email"
            })
        }else {
            const hashedPassword = await bcrypt.hash(password , 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifiedCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserByEmail.save()
        }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifiedCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
    }

    // send verifcation email

    const emailResponse = await sendVerficationEmail(
      email,
      username,
      verifiedCode,
    );

    if (!emailResponse.success) {
      return (
        Response.json({
          success: false,
          message: emailResponse.message,
        }),
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully please verify Your Email",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      },
    );
  }
}
