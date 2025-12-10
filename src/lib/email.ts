import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport"; // ✅ Import types

// Define the transporter options explicitly as SMTPTransport.Options
const transportOptions: SMTPTransport.Options = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  // Custom settings for production stability
  logger: true,
  debug: true,
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000,    // 5 seconds
  socketTimeout: 10000,     // 10 seconds
  // Force IPv4 to avoid IPv6 issues on Vercel/AWS
  tls: {
    rejectUnauthorized: true,
  },
};

// Create the transporter using the typed options
const transporter = nodemailer.createTransport(transportOptions);

export async function sendEmail(to: string, subject: string, html: string) {
  // 1. Verify Credentials exist
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("⚠️ Gmail credentials missing. Email skipped.");
    return { success: false, message: "Credentials missing" };
  }

  try {
    // 2. Verify connection (Optional but good for debugging)
    await transporter.verify();

    // 3. Send Mail
    const info = await transporter.sendMail({
      from: `"MASTMO Club" <${process.env.GMAIL_USER}>`, 
      to: to,
      subject: subject,
      html: html,
    });

    console.log("✅ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error: any) {
    console.error("❌ Email Failed:", error.message);
    return { success: false, error: error.message };
  }
}