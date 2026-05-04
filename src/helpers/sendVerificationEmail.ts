import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmailTemplates";
import { ApiResponse } from "@/types/ApiResponse";
import { string } from "zod";



export async function sendVerficationEmail (
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try {
        const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Mystry message | Verification code',
      react: VerificationEmail({
        username,
        otp:verifyCode,
      }),
    });

    return {
        success: true,
        message: "Verification is successfully sent to given email"
    }

    } catch (emailerror) {
        console.error("Error Sending Verification email", emailerror);
        return {success: false , message: 'Failed to send verification email'}
    }
}