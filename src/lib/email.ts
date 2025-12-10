import nodemailer from "nodemailer";
import logger from "./logger";

// Create a Gmail transporter using nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify transporter on startup (non-blocking)
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  transporter.verify().then(() => {
    logger.info("Gmail SMTP connection verified successfully");
  }).catch((error) => {
    logger.error("Gmail SMTP connection verification failed", { error: error.message });
  });
}

export async function sendEmail(to: string, subject: string, html: string) {
  // Verify that Gmail credentials are configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    logger.warn("Gmail credentials not configured. Email functionality will be disabled.");
    return { success: false, message: "Email service not configured" };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      html: html,
    });

    logger.info("Email sent successfully via Gmail", { to, subject, messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    logger.error("Email sending failed", { error: error.message, to, subject });
    return { success: false, error: error.message };
  }
}
