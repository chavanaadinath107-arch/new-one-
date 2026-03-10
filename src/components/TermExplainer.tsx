import React, { useState, useEffect } from 'react';
import { Search, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { explainTerm } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';

const COMMON_TERMS = [
  "Bull Market", "Bear Market", "Dividends", "P/E Ratio", 
  "Market Cap", "ETF", "Short Selling", "IPO", "Blue Chip"
];

export default function TermExplainer() {
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setExplanation(null);
    try {
      const result = await explainTerm(term);
      setExplanation(result || "Sorry, I couldn't find an explanation for that.");
    } catch (error) {
      console.error(error);
      setExplanation("An error occurred while fetching the explanation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Learn Stock Terms</h2>
        <p className="text-zinc-500">Ask AI to explain any stock market concept in simple terms.</p>
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
          placeholder="e.g., What is a dividend?"
          className="w-full pl-12 pr-4 py-4 bg-white border border-black/5 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg"
        />
        <button
          onClick={() => handleSearch(query)}
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Explain"}
        </button>
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
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
}
