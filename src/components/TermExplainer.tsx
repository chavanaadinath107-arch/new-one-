import React, { useState, useEffect } from 'react';
import { Search, Loader2, BookOpen, ArrowRight, AlertCircle, Mic, MicOff } from 'lucide-react';
import { explainTerm } from '../services/gemini';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

const COMMON_TERMS = [
  "Bull Market", "Bear Market", "Dividends", "P/E Ratio", 
  "Market Cap", "ETF", "Short Selling", "IPO", "Blue Chip"
];

export default function TermExplainer() {
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setExplanation(null);
    setError(null);
    try {
      const result = await explainTerm(term);
      if (result) {
        setExplanation(result);
      } else {
        setError("The AI returned an empty response. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("API key not found") || err.message?.includes("missing")) {
        setError("Gemini API key is missing or invalid. Please check your configuration.");
      } else {
        setError(err.message || "An error occurred while fetching the explanation. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Search Assistant</h2>
        <p className="text-zinc-500">Ask anything about the stock market using text or voice.</p>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-emerald-500 transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="e.g., How do I start investing in India?"
          className="w-full pl-12 pr-28 py-4 bg-white border border-black/5 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            onClick={toggleVoiceInput}
            className={cn(
              "p-2 rounded-xl transition-all",
              isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            )}
            title="Voice Input"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button
            onClick={() => handleSearch(query)}
            disabled={loading}
            className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Search"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {COMMON_TERMS.map((term) => (
          <button
            key={term}
            onClick={() => {
              setQuery(term);
              handleSearch(term);
            }}
            className="px-4 py-2 bg-white border border-black/5 rounded-xl text-sm font-medium text-zinc-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all text-left flex items-center justify-between group"
          >
            {term}
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </button>
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-700"
        >
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}

      {explanation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
          <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-4 uppercase tracking-wider text-xs">
            <BookOpen size={16} />
            <span>AI Explanation</span>
          </div>
          <div className="prose prose-zinc max-w-none prose-headings:font-bold prose-p:leading-relaxed">
            <Markdown>{explanation}</Markdown>
          </div>
        </motion.div>
      )}
    </div>
  );
}
