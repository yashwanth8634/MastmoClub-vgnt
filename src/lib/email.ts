import { Resend } from 'resend';
import { logger } from "@/lib/logger";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string, bcc?: string[]) {
  // Check Config
  if (!process.env.RESEND_API_KEY) {
    logger.error("RESEND_API_KEY is missing.");
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown email error";
      logger.error("Email delivery failed", error, { to, subject });
      return { success: false, error: errorMessage };
    }
  }

  // 2. Batch Sending (For Announcements)
  // Resend allows max 50 recipients per call. We use 45 to be safe.
  const BATCH_SIZE = 45;
  
  logger.info("Starting batch email send", { recipientCount: bcc.length, subject });

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
      
      logger.info("Batch email sent", {
        batchNumber: i / BATCH_SIZE + 1,
        recipientCount: batch.length,
      });
      
      // Tiny delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
    } catch (error: unknown) {
      logger.error("Batch email failed", error, {
        batchNumber: i / BATCH_SIZE + 1,
        recipientCount: batch.length,
      });
    }
  }

  return { success: true, message: "Batch process completed" };
}
