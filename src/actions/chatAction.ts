"use server";

import Groq from "groq-sdk";
import dbConnect from "@/lib/db";
import Popup from "@/models/Popup";
import * as cheerio from "cheerio";
import { headers } from "next/headers";
import { logger } from "@/lib/logger";

// ============================================================================
// CONFIGURATION & TYPES
// ============================================================================

const API_KEY = process.env.GROQ_API_KEY;
const WEBSITE_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CONTENT_LENGTH = 2500; // Reduced for token efficiency
const SCRAPE_TIMEOUT = 4000; // 4s timeout
const MAX_HISTORY = 6;
const MAX_MESSAGE_LENGTH = 500;

interface CacheEntry {
  data: string;
  timestamp: number;
}

interface PageConfig {
  keywords: string[];
  path: string;
}

// ============================================================================
// SMART CACHE WITH AUTO-CLEANUP
// ============================================================================

class SmartCache {
  private cache = new Map<string, CacheEntry>();

  private cleanExpired() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }

  get(key: string): string | null {
    this.cleanExpired();
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key: string, data: string): void {
    this.cleanExpired();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

const contentCache = new SmartCache();

// ============================================================================
// RATE LIMITER
// ============================================================================

class RateLimiter {
  private requests = new Map<string, number[]>();
  private readonly maxRequests = 20; // 20 requests per minute
  private readonly windowMs = 60 * 1000; // 1 minute

  canMakeRequest(identifier: string = "global"): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, times] of this.requests.entries()) {
      const recent = times.filter(time => now - time < this.windowMs);
      if (recent.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recent);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

// ============================================================================
// STATIC CONTENT (Token-optimized)
// ============================================================================

const VGNT_INFO = `VGNT: Vignan Institute of Technology, Deshmukhi, Telangana. Courses: CSE, ECE, EEE, AIML, Data Science.`;

const CONTACT_INFO = `Contact: mastmo.vgnt@gmail.com | Instagram: @mastmo_vgnt`;

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

// ============================================================================
// PAGE ROUTING CONFIG
// ============================================================================

const PAGE_CONFIGS: PageConfig[] = [
  {
    keywords: ["team", "president", "coordinator", "member", "lead", "who is", "faculty"],
    path: "/team"
  },
  {
    keywords: ["event", "workshop", "competition", "hackathon", "when", "upcoming"],
    path: "/events"
  },
  {
    keywords: ["about", "mission", "vision", "what is", "history"],
    path: "/"
  },
  {
    keywords: ["join", "register", "membership", "become member", "enrollment"],
    path: "/join"
  },
  {
    keywords: ["resource", "learn", "material", "course", "tutorial"],
    path: "/resources"
  }
];

// ============================================================================
// CONTENT EXTRACTION & DEDUPLICATION
// ============================================================================

function extractContent($: cheerio.CheerioAPI): string {
  const seen = new Set<string>();
  const content: string[] = [];

  // Remove noise
  $("script, style, nav, header, footer, noscript, svg, img").remove();

  // Extract structured content
  $("h1, h2, h3, h4").each((_, elem) => {
    const heading = $(elem).text().trim();
    if (!heading || seen.has(heading)) return;
    
    const nextContent = $(elem).nextUntil("h1, h2, h3, h4").text().trim();
    if (nextContent && nextContent.length > 15) {
      const combined = `${heading}: ${nextContent}`.substring(0, 300);
      if (!seen.has(combined)) {
        content.push(combined);
        seen.add(combined);
      }
    }
  });

  // Extract paragraphs and list items
  $("p, li, td").each((_, elem) => {
    const text = $(elem).text().trim();
    if (text.length > 25 && text.length < 200 && !seen.has(text)) {
      content.push(text);
      seen.add(text);
    }
  });

  return content.slice(0, 15).join(" | "); // Limit to 15 items
}

// ============================================================================
// PARALLEL WEB SCRAPING WITH RETRY
// ============================================================================

async function fetchPageWithRetry(url: string, retries = 2): Promise<string> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        next: { revalidate: 300 },
        headers: { "User-Agent": "MASTMO-Bot/1.0" },
        signal: AbortSignal.timeout(SCRAPE_TIMEOUT)
      });
      
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
    }
  }
  throw new Error("Max retries reached");
}

async function scrapeWebsiteContent(query: string): Promise<string> {
  try {
    const queryLower = query.toLowerCase();
    const relevantPages = new Set<string>();

    // Smart page selection
    for (const config of PAGE_CONFIGS) {
      if (config.keywords.some(kw => queryLower.includes(kw))) {
        relevantPages.add(config.path);
      }
    }

    // Default fallback
    if (relevantPages.size === 0) {
      relevantPages.add("/");
      relevantPages.add("/team");
    }

    // Check cache first
    const cacheKey = Array.from(relevantPages).sort().join(",");
    const cached = contentCache.get(cacheKey);
    if (cached) {
      logger.debug("Chatbot content cache hit", { cacheKey });
      return cached;
    }

    // Parallel scraping
    const scrapePromises = Array.from(relevantPages).map(async (page) => {
      try {
        const html = await fetchPageWithRetry(`${WEBSITE_BASE_URL}${page}`);
        const $ = cheerio.load(html);
        const content = extractContent($);
        
        if (content.length > 50) {
          return `[${page.toUpperCase()}] ${content}`;
        }
        return "";
      } catch {
        logger.warn("Failed to scrape page for chatbot", { page });
        return "";
      }
    });

    const results = await Promise.all(scrapePromises);
    const combined = results.filter(Boolean).join(" | ").substring(0, MAX_CONTENT_LENGTH);

    // Cache result
    if (combined.length > 50) {
      contentCache.set(cacheKey, combined);
    }

    return combined;
  } catch (error: unknown) {
    logger.error("Website scraping failed", error);
    return "";
  }
}

// ============================================================================
// QUERY ANALYSIS
// ============================================================================

function needsWebSearch(query: string): boolean {
  const indicators = [
    "who", "what", "when", "where", "list", "show",
    "tell me about", "president", "team", "event", "member"
  ];
  const queryLower = query.toLowerCase();
  return indicators.some(kw => queryLower.includes(kw));
}

// ============================================================================
// POPUP CACHE (Reduce DB calls)
// ============================================================================

let popupCache: { data: string; timestamp: number } | null = null;
const POPUP_CACHE_TTL = 2 * 60 * 1000; // 2 minutes

async function getActivePopup(): Promise<string> {
  try {
    // Check cache
    if (popupCache && Date.now() - popupCache.timestamp < POPUP_CACHE_TTL) {
      return popupCache.data;
    }

    await dbConnect();
    const activePopup = await Popup.findOne({ isActive: true })
      .select("title description")
      .lean()
      .maxTimeMS(3000);
    
    const result = activePopup
      ? `🔥 LIVE: ${activePopup.title} - ${activePopup.description}`
      : "";

    popupCache = { data: result, timestamp: Date.now() };
    return result;
  } catch (error: unknown) {
    logger.warn("Popup fetch failed for chatbot", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return "";
  }
}

// ============================================================================
// MAIN CHAT FUNCTION
// ============================================================================

export async function getChatResponse(
  history: { role: "user" | "assistant"; content: string }[],
  newMessage: string,
  userId?: string
) {
  const startTime = Date.now();

  try {
    // Validation
    if (!API_KEY) {
      logger.error("GROQ_API_KEY missing");
      return { success: false, message: "System error. Contact admin." };
    }

    if (!newMessage?.trim() || newMessage.length > MAX_MESSAGE_LENGTH) {
      return { success: false, message: "Message must be 1-500 characters." };
    }

    // Rate limiting
    const identifier = userId || await getClientIp();
    if (!rateLimiter.canMakeRequest(identifier)) {
      return { 
        success: false, 
        message: "Too many requests. Please wait a moment! ⏳" 
      };
    }

    // Parallel data fetching
    const [popupContext, websiteContent] = await Promise.all([
      getActivePopup(),
      needsWebSearch(newMessage) ? scrapeWebsiteContent(newMessage) : Promise.resolve("")
    ]);

    // Compact system prompt
    const SYSTEM_PROMPT = `You are MASTMO AI 🤖 for the Mathematical & Statistical Modeling Club at VGNT.

CONTEXT:
- Club: MASTMO at ${VGNT_INFO}
${popupContext ? `- Event: ${popupContext}` : ""}
${websiteContent ? `- Data: ${websiteContent}` : ""}
- Contact: ${CONTACT_INFO}

RULES:
1. Be friendly, concise, helpful. Use math emojis sparingly (∞, π, ∑).
2. Answer from website data when available. Format team lists clearly.
3. For unknown info: "Contact us: Instagram @mastmo_vgnt or mastmo.vgnt@gmail.com"
4. Keep responses <4 sentences for simple queries.
5. Dont Add diagrams DONT GENERATE IMAGES
6. Never fabricate information.
7.This Website was created by Techinical Head K.Yashwanth Reddy Of bearing roll no 24891A0593
8.Dont Add any extra information that is not in the website
`.trim();


    const groq = new Groq({ apiKey: API_KEY });

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...history.slice(-MAX_HISTORY).map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      { role: "user" as const, content: newMessage }
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 350,
      temperature: 0.7,
      top_p: 0.9,
    });

    const aiMessage = response.choices[0]?.message?.content ||
      "Sorry, I couldn't process that. Try again! 🤖";

    const duration = Date.now() - startTime;
    logger.info("Chat response generated", { durationMs: duration });

    return { success: true, message: aiMessage };

  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Chat response failed", error, { durationMs: duration });

    // Specific error handling
    if (message.includes("401")) {
      return { success: false, message: "API authentication failed. Contact admin." };
    }
    if (message.includes("429")) {
      return { success: false, message: "System overloaded. Please wait 30s and retry." };
    }
    if (message.includes("timeout")) {
      return { success: false, message: "Request timeout. Try again!" };
    }
    if (message.includes("network")) {
      return { success: false, message: "Network error. Check your connection." };
    }

    return {
      success: false,
      message: "Something went wrong. Contact @mastmo_vgnt on Instagram! 📱"
    };
  }
}
