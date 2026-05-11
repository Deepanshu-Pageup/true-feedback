import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmailTemplates";
import { ApiResponse } from "@/types/ApiResponse";



export async function sendVerficationEmail (
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Mystry message | Verification code',
      react: VerificationEmail({
        username,
        otp:verifyCode,
      }),
    });

    if (error) {
      console.error("Resend email API error:", error);
      return {
        success: false,
        message: error.message || "Failed to send verification email",
      };
    }

    return {
        success: true,
        message: "Verification is successfully sent to given email"
    }

    } catch (emailerror) {
        console.error("Error Sending Verification email", emailerror);
        return {success: false , message: 'Failed to send verification email'}
    }
}
