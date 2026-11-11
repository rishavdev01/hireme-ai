"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_QUESTIONS = [
  "What are your technical skills?",
  "Tell me about your projects",
  "What is your education?",
  "Do you know Python?",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I am Rishav's AI profile assistant. Ask me about his education, skills, projects, or certifications.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const data = await res.json();
      const answer = typeof data === "string" ? data : data.reply ?? data.answer ?? JSON.stringify(data);

      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Unable to reach the assistant right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[88vh] flex flex-col bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <header className="p-5 border-b border-gray-800">
          <h1 className="text-xl font-semibold">Rishav Dev — AI Profile Assistant</h1>
          <p className="text-sm text-gray-400">Ask about skills, education, projects, and certifications</p>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-wrap ${
                m.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-800"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && <div className="bg-gray-800 p-3 rounded-2xl max-w-[80%] text-gray-400">Typing...</div>}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full px-3 py-1.5"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-gray-800 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about Rishav..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-3 rounded-xl font-medium"
          >
            Send
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center pb-3 px-4">
          Answers are generated from Rishav's resume and may not be complete.
        </p>
      </div>
    </main>
  );
}