import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello! I am your AI agriculture assistant. Ask me anything about farming, crops, or diseases." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Add to history if it's the first message of a "session" (simplified)
    if (messages.length === 1) {
      setHistory(prev => [{ title: input, date: new Date().toLocaleDateString() }, ...prev]);
    }

    try {
      let cropResult = null;
      let diseaseResult = null;

      try {
        const cr = localStorage.getItem("agro_last_crop_result");
        if (cr) cropResult = JSON.parse(cr);
      } catch (e) {
        console.error("Failed to read cached crop result", e);
      }

      try {
        const dr = localStorage.getItem("agro_last_disease_result");
        if (dr) diseaseResult = JSON.parse(dr);
      } catch (e) {
        console.error("Failed to read cached disease result", e);
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: input,
          crop_result: cropResult,
          disease_result: diseaseResult,
        }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      console.error("Error chatting:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteHistory = (idx) => {
    setHistory(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="relative flex h-[calc(100vh-64px)] bg-gradient-to-br from-primary to-green-900 overflow-hidden">
      {/* subtle background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
      {/* Sidebar */}
      <div className="w-64 bg-white/70 backdrop-blur-sm border-r border-green-200 text-gray-900 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4">
          <button 
            onClick={() => setMessages([{ role: "system", content: "Hello! I am your AI agriculture assistant. Ask me anything about farming, crops, or diseases." }])}
            className="w-full flex items-center gap-2 px-4 py-3 border-2 border-emerald-500 rounded-lg bg-white hover:bg-green-50 transition text-gray-900 text-sm shadow-sm"
          >
            <span>+</span> New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-2">
          <div className="text-xs font-semibold text-gray-600 px-2 mb-2 mt-2">Recent</div>
          {history.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-green-100 transition text-sm"
            >
              <button className="flex-1 text-left truncate text-gray-900">
                {item.title}
              </button>
              <button
                onClick={() => deleteHistory(i)}
                aria-label="Delete"
                className="ml-2 p-1 text-red-500 hover:text-red-600"
              >
                🗑️
              </button>
            </motion.div>
          ))}
          {history.length === 0 && (
            <div className="text-xs text-gray-600 px-3">No recent history</div>
          )}
        </div>

        <div className="p-4 border-t border-white/30 bg-gradient-to-br from-primary to-green-900 text-black">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white border border-white/60 rounded-full flex items-center justify-center text-black font-bold">U</div>
            <div className="text-sm font-medium text-black">User</div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-transparent relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role !== "user" && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">
                    🤖
                  </div>
                )}
                <div 
                  className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                    m.role === "user" 
                      ? "bg-gradient-to-br from-primary to-green-900 text-white rounded-br-none" 
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0 mt-1">
                    👤
                  </div>
                )}
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0">🤖</div>
                <div className="bg-white px-5 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 bg-transparent border-t border-white/20">
          <div className="max-w-3xl mx-auto relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about crops, diseases, or farming tips..."
              className="w-full pl-4 pr-14 py-4 bg-white border-2 border-emerald-500 rounded-2xl focus:ring-2 focus:ring-emerald-600 text-gray-900 transition shadow-md resize-none"
            />
            <button 
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-br from-primary to-green-900 text-white hover:opacity-90 transition disabled:opacity-50 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        
        </div>
      </div>
    </div>
  );
}