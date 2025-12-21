"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { getChatResponse } from "@/actions/chatAction";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm the MASTMO AI. Ask me anything about the club! ♾️" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    const response = await getChatResponse(messages, userMsg);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: response.message || "Error connecting to AI." }
    ]);
    setIsLoading(false);
  };

  return (
    <>
      {/* 1. BLUR BACKDROP (Only when open) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* 2. TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[90] p-4 bg-[#FFD700] hover:bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* 3. CHAT WINDOW (Thick Border) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[90] w-[90vw] md:w-[350px] h-[500px] bg-black border-2 border-[#FFD700] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-[#FFD700] flex items-center gap-3 text-black">
              <div className="p-2 bg-black/10 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold">MASTMO Assistant</h3>
                <p className="text-xs opacity-80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0a0a0a]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-white/20" : "bg-[#FFD700]/20 text-[#FFD700]"
                  }`}>
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm max-w-[80%] leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-white text-black rounded-tr-none" 
                      : "bg-[#1f1f1f] text-gray-200 border border-white/10 rounded-tl-none"
                  }`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                   <div className="p-2 bg-[#FFD700]/20 text-[#FFD700] rounded-full h-8 w-8 flex items-center justify-center"><Bot size={14}/></div>
                   <div className="bg-[#1f1f1f] p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-[#FFD700]" />
                      <span className="text-xs text-gray-400">Thinking...</span>
                   </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-[#0a0a0a] border-t border-white/10">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 focus-within:border-[#FFD700] transition-colors"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about events..."
                  className="bg-transparent flex-1 text-sm text-white outline-none placeholder:text-gray-500"
                />
                <button 
                    disabled={isLoading}
                    type="submit" 
                    className="p-2 bg-[#FFD700] text-black rounded-full hover:bg-white transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}