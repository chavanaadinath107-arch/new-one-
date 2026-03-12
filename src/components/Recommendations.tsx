import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, BookOpen, Loader2, RefreshCw } from 'lucide-react';
import { getRecommendations } from '../services/gemini';
import { cn } from '../utils';

interface RecommendationsProps {
  balance: number;
  portfolio: any[];
  onNavigate: (tab: string) => void;
}

export default function Recommendations({ balance, portfolio, onNavigate }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<{ stocks: any[], topics: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecommendations(balance, portfolio);
      setRecommendations(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load AI recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="text-zinc-500 font-medium">Curating personalized recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
        <p className="text-red-500 font-medium">{error}</p>
        <button 
          onClick={fetchRecommendations}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Recommendations</h2>
            <p className="text-sm text-zinc-500">Tailored for your current portfolio and balance</p>
          </div>
        </div>
        <button 
          onClick={fetchRecommendations}
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-emerald-500"
          title="Refresh Recommendations"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Stocks */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700">
            <TrendingUp size={20} />
            Stocks to Watch
          </h3>
          <div className="grid gap-4">
            {recommendations?.stocks.map((stock, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-black/5 p-6 rounded-3xl hover:border-emerald-500 transition-all group cursor-pointer shadow-sm"
                onClick={() => onNavigate('simulator')}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                      {stock.symbol[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">{stock.name}</h4>
                      <span className="text-xs font-mono text-zinc-400">{stock.symbol}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">{stock.reason}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommended Topics */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-blue-700">
            <BookOpen size={20} />
            Learning Path
          </h3>
          <div className="grid gap-4">
            {recommendations?.topics.map((topic, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-black/5 p-6 rounded-3xl hover:border-blue-500 transition-all group cursor-pointer shadow-sm"
                onClick={() => onNavigate('learn')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <h4 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{topic.title}</h4>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">{topic.reason}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
