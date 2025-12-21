"use server";

import Groq from "groq-sdk";
import dbConnect from "@/lib/db";
import Popup from "@/models/Popup";
import * as cheerio from "cheerio";

// 🚨 CHECK: Ensure this is set in .env.local
const API_KEY = process.env.GROQ_API_KEY;
const WEBSITE_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const VGNT_INFO = `
**COLLEGE DETAILS (VIGNAN VGNT):**
- Name: Vignan Institute of Technology and Science (VGNT).
- Location: Deshmukhi, Telangana.
- Mission: Quality education and research.
- Courses: CSE, ECE, EEE, Mech, Civil, AIML, Data Science.
- Contact: info@vignanits.ac.in
`;

const CONTACT_INFO = `
**CONTACT MASTMO:**
- Email: mastmo.vgnt@gmail.com
- Instagram: @mastmo_vgnt (https://www.instagram.com/mastmo_vgnt/)
- For urgent queries, DM us on Instagram!
`;

// Cache for website content (5 minute TTL)
const contentCache = new Map<string, { data: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Enhanced web scraping with caching
async function scrapeWebsiteContent(query: string): Promise<string> {
  try {
    const queryLower = query.toLowerCase();
    const pages: string[] = [];
    
    // Smart page routing with better keyword detection
    const pageKeywords = {
      team: ["team", "president", "coordinator", "member", "tech head", "lead", "who is", "faculty", "advisor"],
      events: ["event", "workshop", "competition", "hackathon", "webinar", "seminar", "when", "upcoming"],
      about: ["about", "club", "mission", "vision", "what is mastmo", "history", "founded"],
      join: ["join", "register", "membership", "sign up", "become member", "how to join", "enrollment"],
      resources: ["resource", "learn", "material", "course", "book", "tutorial", "guide", "study"]
    };

    // Check which pages are relevant
    Object.entries(pageKeywords).forEach(([page, keywords]) => {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        pages.push(`/${page === 'about' ? '' : page}`);
      }
    });

    // Default pages if no match
    if (pages.length === 0) {
      pages.push("/", "/team", "/events");
    }

    let scrapedContent = "";

    for (const page of pages) {
      try {
        // Check cache first
        const cached = contentCache.get(page);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          scrapedContent += cached.data;
          continue;
        }

        const response = await fetch(`${WEBSITE_BASE_URL}${page}`, {
          cache: "no-store",
          headers: { "User-Agent": "MASTMO-Bot/1.0" },
          signal: AbortSignal.timeout(5000) // 5s timeout
        });
        
        if (response.ok) {
          const html = await response.text();
          const $ = cheerio.load(html);
          
          // Remove unnecessary elements
          $("script, style, nav, header, footer, noscript").remove();
          
          // Extract structured content
          const pageContent: string[] = [];
          
          // Get headings and their content
          $("h1, h2, h3").each((_, elem) => {
            const heading = $(elem).text().trim();
            const content = $(elem).nextUntil("h1, h2, h3").text().trim();
            if (heading && content) {
              pageContent.push(`${heading}: ${content}`);
            }
          });
          
          // Get all paragraph content
          $("p, li").each((_, elem) => {
            const text = $(elem).text().trim();
            if (text.length > 20) {
              pageContent.push(text);
            }
          });
          
          const pageText = pageContent.join(" | ").substring(0, 3000);
          
          if (pageText.length > 50) {
            const formattedContent = `\n\n[INFO FROM ${page.toUpperCase()}]:\n${pageText}`;
            scrapedContent += formattedContent;
            
            // Cache the result
            contentCache.set(page, {
              data: formattedContent,
              timestamp: Date.now()
            });
          }
        }
      } catch (pageError) {
        console.warn(`⚠️ Could not fetch ${page}:`, pageError);
      }
    }

    return scrapedContent || "";
  } catch (error) {
    console.error("🔥 Web scraping error:", error);
    return "";
  }
}

// Detect if query needs web search
function needsWebSearch(query: string): boolean {
  const webSearchKeywords = [
    "who", "what", "when", "where", "how", "tell me about", 
    "list", "show", "find", "search", "president", "team",
    "event", "workshop", "upcoming", "member", "coordinator"
  ];
  
  const queryLower = query.toLowerCase();
  return webSearchKeywords.some(keyword => queryLower.includes(keyword));
}

export async function getChatResponse(
  history: { role: "user" | "assistant"; content: string }[],
  newMessage: string
) {
  try {
    if (!API_KEY) {
      console.error("❌ GROQ_API_KEY is missing in Environment Variables!");
      return { success: false, message: "System Error: API Key missing. Contact Admin." };
    }

    if (!newMessage || newMessage.length > 500) {
      return { success: false, message: "Message too long! Keep it under 500 characters." };
    }

    // 🛡️ Fetch active popup events
    let popupContext = "No active events right now.";
    try {
      await dbConnect();
      const activePopup = await Popup.findOne({ isActive: true }).lean();
      if (activePopup) {
        popupContext = `🔥 LIVE EVENT: ${activePopup.title} - ${activePopup.description}`;
      }
    } catch (dbError) {
      console.warn("⚠️ DB connection failed:", dbError);
    }

    // 🔍 Smart web scraping only when needed
    let websiteContent = "";
    if (needsWebSearch(newMessage)) {
      websiteContent = await scrapeWebsiteContent(newMessage);
    }

    const SYSTEM_PROMPT = `
You are **MASTMO AI** 🤖, the intelligent assistant for the MASTMO Club at VGNT.

**CONTEXT:**
- CLUB: Mathematical & Statistical Modeling Club at Vignan Institute of Technology and Science.
- CURRENT UPDATES: ${popupContext}
- COLLEGE INFO: ${VGNT_INFO}
${websiteContent ? `- WEBSITE DATA: ${websiteContent}` : ""}

**CONTACT INFO:**
${CONTACT_INFO}

**PERSONALITY & RULES:**
1. Be friendly, helpful, and slightly geeky with mathematical flair (use ∞, π, ∑ emojis sparingly).
2. When asked about team members, events, or club info: Use the website data above to give accurate answers.
3. Format team member lists clearly with names and roles.
4. For technical questions (math, coding, ML), give brief helpful answers and suggest resources.
5. If you don't have specific information, say: "I don't have that info yet! For the latest details, contact us on Instagram @mastmo_vgnt or email mastmo.vgnt@gmail.com 📧"
6. Keep responses under 4 sentences for simple queries, longer for detailed questions (team lists, event details).
7. If asked for tech support or website issues, say: "Please contact our Tech Team via the Team Page or Instagram @mastmo_vgnt"
8. Be encouraging about joining the club and attending events!
9. Never make up information - if unsure, direct them to contact channels.
10. Use line breaks for better readability in longer responses.

**EXAMPLE RESPONSES:**
- "Who is the president?" → Extract from website data and list clearly
- "Tell me about events" → List upcoming events from website
- "How do I join?" → Direct to /join page and explain process
- "Explain linear algebra" → Give brief answer + suggest resources
    `.trim();

    const groq = new Groq({
      apiKey: API_KEY,
    });

    // Keep last 6 messages for better context
    const formattedHistory = history.slice(-6).map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...formattedHistory,
      { role: "user" as const, content: newMessage },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      max_tokens: 400, // Increased for detailed answers
      temperature: 0.8, // Slightly more creative
      top_p: 0.9,
    });

    const aiMessage =
      response.choices[0]?.message?.content ||
      "Sorry, I couldn't process that. Please try again! 🤖";

    return { success: true, message: aiMessage };
    
  } catch (error: any) {
    console.error("🔥 AI Critical Error:", error);

    if (error.message?.includes("401")) {
      return { success: false, message: "API Key error. Please contact admin." };
    } else if (error.message?.includes("429")) {
      return { success: false, message: "Too many requests. Please wait a moment and try again." };
    } else if (error.message?.includes("timeout")) {
      return { success: false, message: "Request timed out. Please try again!" };
    }

    return {
      success: false,
      message: "Oops! Something went wrong. Try again or contact us on Instagram @mastmo_vgnt 📱",
    };
  }
}