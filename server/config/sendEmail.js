import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.RESEND_API) {
    console.error("❌ ERROR: Provide RESEND_API inside the .env file");
    process.exit(1); // Stop execution if API key is missing
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const response = await resend.emails.send({
            from: 'Grocery <onboarding@resend.dev>',
            to: sendTo,
            subject,
            html,
        });

        if (response.error) {
            console.error("❌ Email Sending Error:", response.error);
            return null;
        }

        console.log("✅ Email sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Unexpected Error Sending Email:", error);
        return null;
    }
};

export default sendEmail;
