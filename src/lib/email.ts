import { Resend } from 'resend';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  // Check if API Key exists
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is missing.");
    return { success: false, error: "Configuration missing" };
  }

  try {
    const data = await resend.emails.send({
      // ✅ USE THIS EXACT EMAIL FOR TESTING
      // Resend allows sending FROM 'onboarding@resend.dev' to YOUR email instantly.
      // To send to *other* people, you must verify your domain on Resend.com first.
      from: 'MASTMO Team <team@mastmovgnt.in>', 
      to: to, // Ideally, send to your own email for the demo until you verify your domain
      subject: subject,
      html: html,
    });

    if (data.error) {
      console.error("❌ Email Failed:", data.error);
      return { success: false, error: data.error.message };
    }

    console.log("✅ Email sent successfully:", data.data?.id);
    return { success: true, messageId: data.data?.id };

  } catch (error: any) {
    console.error("❌ Email Exception:", error.message);
    return { success: false, error: error.message };
  }
}