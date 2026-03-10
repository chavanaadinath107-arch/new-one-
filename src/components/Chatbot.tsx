import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, User, Bot, Sparkles } from 'lucide-react';
import { getChatResponse } from '../services/gemini';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your AI Stock Tutor. Ask me anything about the stock market, from 'What is a stock?' to 'How do I read a balance sheet?'" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.concat({ role: 'user', text: userMsg }).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await getChatResponse(history);
      if (response) {
        setMessages(prev => [...prev, { role: 'model', text: response }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I couldn't process that. The AI returned an empty response." }]);
      }
    } catch (error: any) {
      console.error(error);
      let errorMsg = "An error occurred. Please try again.";
      if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("API key not found")) {
        errorMsg = "Invalid API Key. Please check your Gemini API key configuration.";
      }
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white border border-black/5 rounded-3xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-black/5 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="font-bold">AI Stock Tutor</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-500 font-medium">Online & Ready to Help</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles size={12} />
          <span>Powered by Gemini</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-zinc-900 text-white" : "bg-emerald-100 text-emerald-600"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-zinc-900 text-white rounded-tr-none" 
                : "bg-zinc-100 text-zinc-800 rounded-tl-none"
            )}>
              <div className="prose prose-sm prose-zinc max-w-none dark:prose-invert">
                <Markdown>{msg.text}</Markdown>
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-zinc-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-50 border-t border-black/5">
        <div className="relative flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-white border border-black/5 rounded-2xl px-5 py-3.5 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-sm"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-zinc-400 mt-3 font-medium uppercase tracking-wider">
          Educational purposes only • Not financial advice
        </p>
      </div>
    </div>
  );
}
