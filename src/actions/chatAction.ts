"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import Popup from "@/models/Popup"; 

// 🚨 CHECK: Ensure this is set in Vercel Env Variables
const API_KEY = process.env.GEMINI_API_KEY;

const VGNT_INFO = `
**COLLEGE DETAILS (VIGNAN VGNT):**
- Name: Vignan Institute of Technology and Science (VGNT).
- Location: Deshmukhi, Telangana.
- Mission: Quality education and research.
- Courses: CSE, ECE, EEE, Mech, Civil, AIML, Data Science.
- Contact: info@vignanits.ac.in
`;

export async function getChatResponse(history: { role: "user" | "model"; parts: string }[], newMessage: string) {
  try {
    if (!API_KEY) {
      console.error("❌ GEMINI_API_KEY is missing in Environment Variables!");
      return { success: false, message: "System Error: API Key missing. Contact Admin." };
    }

    if (!newMessage || newMessage.length > 300) {
      return { success: false, message: "Message too long! Keep it short." };
    }

    // 🛡️ SAFETY NET: Try to fetch Popup, but don't crash if DB fails
    let popupContext = "No active events.";
    try {
      await dbConnect();
      const activePopup = await Popup.findOne({ isActive: true }).lean();
      if (activePopup) {
        popupContext = `LIVE EVENT: ${activePopup.title} - ${activePopup.description}`;
      }
    } catch (dbError) {
      console.warn("⚠️ Chatbot DB connection failed (ignoring):", dbError);
      // We continue anyway! The chat must go on.
    }

    const SYSTEM_PROMPT = `
    You are **MASTMO AI**, the assistant for the MASTMO Club at VGNT.
    
    **CONTEXT:**
    - CLUB: Mathematical & Statistical Modeling Club.
    - LIVE UPDATES: ${popupContext}
    - COLLEGE: ${VGNT_INFO}

    **RULES:**
    - Be helpful, clever, and mathematical (♾️).
    - If user asks about tech support, say: "Contact Support Team via Team Page".
    - Short answers (under 3 sentences).
    `;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Ready. I am MASTMO AI." }] },
        ...history.slice(-4).map(msg => ({
            role: msg.role,
            parts: [{ text: msg.parts }]
        }))
      ],
    });

    const result = await chat.sendMessage(newMessage);
    const response = result.response.text();
    
    return { success: true, message: response };

  } catch (error: any) {
    console.error("🔥 AI Critical Error:", error);
    return { success: false, message: "Connection trouble. Please try again! 🤖" };
  }
}