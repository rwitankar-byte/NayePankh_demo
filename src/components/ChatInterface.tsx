import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/providers/trpc";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Leaf,
  GraduationCap,
  HeartHandshake,
  CalendarDays,
} from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  message: string;
  createdAt: Date;
}

const suggestedPrompts = [
  { icon: HeartHandshake, label: "How can I volunteer?" },
  { icon: GraduationCap, label: "Tell me about internships" },
  { icon: CalendarDays, label: "Upcoming events" },
  { icon: Leaf, label: "About NayePankh" },
];

export default function ChatInterface({ showWelcome = true }: { showWelcome?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [showWelcomeState, setShowWelcomeState] = useState(showWelcome);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatMutation = trpc.chat.send.useMutation();

  // Initialize session ID from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("nayepankh_session_id");
    if (stored) {
      setSessionId(stored);
      setShowWelcomeState(false);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: Message = {
        id: Date.now(),
        role: "user",
        message: text,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setShowWelcomeState(false);

      try {
        const response = await chatMutation.mutateAsync({
          message: text,
          sessionId: sessionId || undefined,
        });

        if (response.sessionId && !sessionId) {
          setSessionId(response.sessionId);
          localStorage.setItem("nayepankh_session_id", response.sessionId);
        }

        const aiMsg: Message = {
          id: Date.now() + 1,
          role: "assistant",
          message: response.answer,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        const errorMsg: Message = {
          id: Date.now() + 1,
          role: "assistant",
          message:
            "I'm having trouble connecting right now. Please try again in a moment, or you can reach us directly at contact@nayepankh.com or +91-8318500748.",
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    },
    [chatMutation, sessionId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] rounded-3xl border border-[rgba(245,242,235,0.06)] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
      {/* Chat Header */}
      <div className="h-16 glass glass-border flex items-center px-4 gap-3 shrink-0">
        <div className="relative">
          <img
            src="/logo-avatar.jpg"
            alt="NayePankh"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full">
            <span
              className="absolute inset-0 rounded-full bg-green-400"
              style={{ animation: "pulse-dot 2s infinite" }}
            />
          </span>
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-[#f5f2eb]">
            NayePankh Assistant
          </p>
          <p className="text-[11px] text-[#8a8580]">Online now</p>
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#8a8580] hover:text-[#f5f2eb] hover:bg-[rgba(245,242,235,0.06)] transition-all">
          <Phone size={16} />
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#8a8580] hover:text-[#f5f2eb] hover:bg-[rgba(245,242,235,0.06)] transition-all">
          <Video size={16} />
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#8a8580] hover:text-[#f5f2eb] hover:bg-[rgba(245,242,235,0.06)] transition-all">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
        {showWelcomeState && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
            <img
              src="/logo-avatar.jpg"
              alt="NayePankh"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="text-center">
              <h2 className="font-display text-2xl font-semibold text-[#f5f2eb] mb-2">
                Welcome to NayePankh
              </h2>
              <p className="text-sm text-[#8a8580] max-w-sm">
                Your AI guide to volunteering, internships, and community impact.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => handleSend(prompt.label)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(245,242,235,0.1)] text-sm text-[#8a8580] hover:border-[#d4854a] hover:text-[#d4854a] hover:bg-[rgba(212,133,74,0.08)] transition-all"
                >
                  <prompt.icon size={14} />
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[75%]">
                <div
                  className={`px-4 py-3 shadow-message ${
                    msg.role === "user"
                      ? "bg-[#d4854a] text-[#0a0a0a] rounded-2xl rounded-tr-sm"
                      : "bg-[#1c1c1c] text-[#f5f2eb] rounded-2xl rounded-tl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="m-0 text-[15px] leading-relaxed">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-[#d4854a]">{children}</strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="m-0 pl-4 space-y-1">{children}</ul>
                          ),
                          li: ({ children }) => (
                            <li className="text-[15px]">{children}</li>
                          ),
                        }}
                      >
                        {msg.message}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-[15px] leading-relaxed">{msg.message}</p>
                  )}
                </div>
                <p
                  className={`text-[11px] text-[#8a8580] mt-1 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-[#1c1c1c] rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#8a8580]"
                    style={{
                      animation: `typing-dot 1.2s infinite ease-in-out`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="h-20 bg-[#141414] border-t border-[rgba(245,242,235,0.06)] px-4 flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          className="w-10 h-10 rounded-full border border-[rgba(245,242,235,0.06)] flex items-center justify-center text-[#8a8580] hover:text-[#f5f2eb] transition-colors shrink-0"
        >
          <Paperclip size={18} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about volunteering, internships..."
          disabled={chatMutation.isPending}
          className="flex-1 h-12 bg-[#1c1c1c] border border-[rgba(245,242,235,0.06)] rounded-full px-5 text-[#f5f2eb] text-[15px] placeholder:text-[#8a8580]/50 focus:border-[rgba(212,133,74,0.3)] focus:outline-none transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || chatMutation.isPending}
          className="w-11 h-11 rounded-full bg-[#d4854a] text-[#0a0a0a] flex items-center justify-center hover:scale-105 hover:shadow-[0_4px_16px_rgba(212,133,74,0.3)] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shrink-0"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
