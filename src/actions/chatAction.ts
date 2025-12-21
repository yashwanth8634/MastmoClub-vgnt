"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import Popup from "@/models/Popup"; // Ensure this path matches your Popup model

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 🏫 COLLEGE KNOWLEDGE BASE (Extracted from vignanits.ac.in)
const VGNT_INFO = `
**COLLEGE DETAILS (VIGNAN VGNT):**
- **Name:** Vignan Institute of Technology and Science (VGNT/VITS).
- **Location:** Deshmukhi, Pochampally (M), Yadadri-Bhuvanagiri Dist, Telangana (Near Ramoji Film City).
- **Chairman:** Dr. L. Rathaiah.
- **CEO:** Mr. Shravan Boyapati.
- **Principal:** Dr. G. Durga Sukumar (Check official site for updates).
- **Established:** 1999.
- **Mission:** To provide quality education and research opportunities.
- **Courses:** CSE, ECE, EEE, Mech, Civil, EIE, AIML, Data Science, IT.
- **Contact:** 9866399776 | info@vignanits.ac.in
- **Website:** https://vignanits.ac.in/
`;

export async function getChatResponse(history: { role: "user" | "model"; parts: string }[], newMessage: string) {
  try {
    // 1. RATE LIMIT & SECURITY CHECK
    if (!newMessage || newMessage.length > 300) {
      return { success: false, message: "Message too long! Please keep it short." };
    }

    // 2. REAL-TIME WEBSITE ANALYSIS (Fetch Active Popup)
    await dbConnect();
    const activePopup = await Popup.findOne({ isActive: true }).lean();
    
    let popupContext = "No active events right now.";
    if (activePopup) {
        popupContext = `
        **CURRENT WEBSITE POPUP (LATEST EVENT):**
        - **Event Name:** ${activePopup.title}
        - **Description:** ${activePopup.description}
        - **Status:** LIVE on the website now.
        `;
    }

    // 3. CONSTRUCT THE SUPER-BRAIN PROMPT
    const SYSTEM_PROMPT = `
    You are **MASTMO AI**, the official assistant for the MASTMO Club at VGNT College.

    **YOUR KNOWLEDGE BASE:**
    1. **CLUB INFO:**
       - Name: Mathematical & Statistical Modeling Club (MASTMO).
       - Goal: Making math fun through modeling and events.
       - Team: Refer users to the "Team Page" to see the President and Leads.

    2. **LIVE WEBSITE CONTENT (Real-time):**
       ${popupContext}
       (If the user asks "What is happening now?" or "Latest updates?", tell them about this event!)

    3. ${VGNT_INFO}

    **STRICT RULES:**
    - **Tone:** Friendly, clever, mathematical (use ♾️, 🚀).
    - **Scope:** Answer questions about MASTMO, Math, Coding, and VGNT College.
    - **Unknowns:** If asked about something strictly personal or political, say "I only know about MASTMO and VGNT!"
    - **Support:** For technical issues, tell them to "Contact the Support Team via the Team Page".

    **Formatting:** Keep answers short (under 3 sentences).
    `;

    // 4. CALL GOOGLE GEMINI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood! I know about MASTMO, the current Popup event, and VGNT." }] },
        ...history.slice(-4).map(msg => ({ // Keep only last 4 messages for speed
            role: msg.role,
            parts: [{ text: msg.parts }]
        }))
      ],
    });

    const result = await chat.sendMessage(newMessage);
    const response = result.response.text();
    
    return { success: true, message: response };

  } catch (error: any) {
    console.error("AI Error:", error);
    if (error.message?.includes("429")) {
        return { success: false, message: "Too many requests! My brain needs a break. 🤯" };
    }
    return { success: false, message: "Connection error. Please try again! 🤖" };
  }
}