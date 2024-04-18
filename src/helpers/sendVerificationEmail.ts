import { resend } from "@/lib/resend";
import VerificationEmail from "@/../Emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string
) : Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message  | Verification Code',
            react: VerificationEmail({username , verifyCode}),
          });
        return {success : true , message : "Verification Email send Successfully"}
    } catch (emailError) {
        console.log("Error Sending Verification Email" , email);
        return {success : false , message : "Failed to send verification Email"}
    }
}