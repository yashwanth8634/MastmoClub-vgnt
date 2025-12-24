import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string, bcc?: string[]) {
  // Check Config
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is missing.");
    return { success: false, error: "Configuration missing" };
  }

  // 1. Single Email (Normal)
  if (!bcc || bcc.length === 0) {
    try {
      const data = await resend.emails.send({
        from: 'MASTMO Team <team@mastmovgnt.in>',
        to: to,
        subject: subject,
        html: html,
      });
      return { success: true, id: data.data?.id };
    } catch (error: any) {
      console.error("❌ Email Failed:", error.message);
      return { success: false, error: error.message };
    }
  }

  // 2. Batch Sending (For Announcements)
  // Resend allows max 50 recipients per call. We use 45 to be safe.
  const BATCH_SIZE = 45;
  
  console.log(`🚀 Starting Batch Email to ${bcc.length} recipients...`);

  for (let i = 0; i < bcc.length; i += BATCH_SIZE) {
    const batch = bcc.slice(i, i + BATCH_SIZE);
    
    try {
      await resend.emails.send({
        from: 'MASTMO Team <team@mastmovgnt.in>',
        to: 'mastmovgnt@gmail.com', // Main 'To' is the club (recipients see this)
        bcc: batch,               // Hidden recipients
        subject: subject,
        html: html,
      });
      
      console.log(`✅ Batch ${i / BATCH_SIZE + 1} sent to ${batch.length} members.`);
      
      // Tiny delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
    } catch (error: any) {
      console.error(`❌ Batch ${i / BATCH_SIZE + 1} Failed:`, error.message);
    }
  }

  return { success: true, message: "Batch process completed" };
}