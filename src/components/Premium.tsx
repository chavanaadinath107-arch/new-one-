import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  LineChart, 
  Newspaper, 
  Activity, 
  BrainCircuit, 
  History, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { predictStockPrice, analyzeSentiment, calculatePortfolioRisk } from '../services/gemini';
import { UserState, Stock } from '../types';
import { cn } from '../utils';

interface PremiumProps {
  userState: UserState;
  stocks: Stock[];
}

export default function Premium({ userState, stocks }: PremiumProps) {
  const [activeFeature, setActiveFeature] = useState<'prediction' | 'sentiment' | 'risk' | 'backtest'>('prediction');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handlePredict = async (symbol: string) => {
    setLoading(true);
    setResult(null);
    try {
      const stock = stocks.find(s => s.symbol === symbol);
      if (!stock) throw new Error("Stock not found");
      const data = await predictStockPrice(symbol, stock.history);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSentiment = async () => {
    setLoading(true);
    setResult(null);
    try {
      const news = [
        "RBI keeps repo rate unchanged, market reacts positively",
        "Global tech stocks face sell-off amid inflation fears",
        "Reliance announces major expansion in green energy",
        "HDFC Bank reports 20% growth in quarterly profit",
        "Oil prices surge as geopolitical tensions rise"
      ];
      const data = await analyzeSentiment(news);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRisk = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await calculatePortfolioRisk(userState.portfolio);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={32} />
            Premium Analytics
          </h2>
          <p className="text-zinc-500">Advanced AI-driven tools for professional-grade insights.</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-2xl">
          {[
            { id: 'prediction', label: 'ML Prediction', icon: BrainCircuit },
            { id: 'sentiment', label: 'News Sentiment', icon: Newspaper },
            { id: 'risk', label: 'Risk Calculator', icon: Activity },
            { id: 'backtest', label: 'Backtesting', icon: History },
          ].map((feature) => (
            <button
              key={feature.id}
              onClick={() => {
                setActiveFeature(feature.id as any);
                setResult(null);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                activeFeature === feature.id 
                  ? "bg-white text-emerald-600 shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <feature.icon size={16} />
              <span className="hidden sm:inline">{feature.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feature Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            {activeFeature === 'prediction' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Machine Learning Prediction</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Our AI models analyze historical price patterns and technical indicators to predict future price movements.
                </p>
                <div className="space-y-3">
                  {['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'].map(symbol => (
                    <button
                      key={symbol}
                      onClick={() => handlePredict(symbol)}
                      disabled={loading}
                      className="w-full flex items-center justify-between p-4 bg-zinc-50 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all group"
                    >
                      <span className="font-bold">{symbol}</span>
                      <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFeature === 'sentiment' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">News Sentiment Analysis</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Analyze real-time market news to gauge the overall sentiment and potential market direction.
                </p>
                <button
                  onClick={handleSentiment}
                  disabled={loading}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  Analyze Market Sentiment
                </button>
              </div>
            )}

            {activeFeature === 'risk' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Portfolio Risk Calculator</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Calculate advanced risk metrics like Beta, Volatility, and VaR for your current virtual portfolio.
                </p>
                <button
                  onClick={handleRisk}
                  disabled={loading || userState.portfolio.length === 0}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Activity size={20} />}
                  Calculate Risk Metrics
                </button>
                {userState.portfolio.length === 0 && (
                  <p className="text-xs text-center text-red-500 font-medium">Your portfolio is empty.</p>
                )}
              </div>
            )}

            {activeFeature === 'backtest' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Backtesting Strategy</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Test your trading strategies against historical data to see how they would have performed.
                </p>
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                    Strategy: "Buy when RSI &lt; 30, Sell when RSI &gt; 70"
                  </p>
                </div>
                <button
                  disabled
                  className="w-full py-4 bg-zinc-200 text-zinc-400 rounded-2xl font-bold cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] bg-white border border-black/5 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4"
              >
                <Loader2 className="animate-spin text-emerald-500" size={48} />
                <p className="text-zinc-500 font-medium">AI is processing your request...</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm space-y-8"
              >
                {activeFeature === 'prediction' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-2xl font-bold">Prediction Results</h4>
                      <div className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
                        result.trend === 'Bullish' ? "bg-emerald-100 text-emerald-700" : 
                        result.trend === 'Bearish' ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-700"
                      )}>
                        {result.trend} Trend
                      </div>
                    </div>
                    <div className="p-6 bg-zinc-50 rounded-3xl">
                      <p className="text-zinc-600 leading-relaxed">{result.reasoning}</p>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {result.predictions.map((price: number, i: number) => (
                        <div key={i} className="text-center space-y-1">
                          <div className="text-[10px] text-zinc-400 font-bold uppercase">T+{i+1}</div>
                          <div className="text-lg font-mono font-bold">₹{price.toFixed(0)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeFeature === 'sentiment' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-2xl font-bold">Sentiment Analysis</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-500">Market Score:</span>
                        <span className={cn(
                          "text-2xl font-mono font-bold",
                          result.overallScore > 60 ? "text-emerald-500" : 
                          result.overallScore < 40 ? "text-red-500" : "text-zinc-500"
                        )}>
                          {result.overallScore}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {result.headlines.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                          <span className="text-sm font-medium text-zinc-700">{item.text}</span>
                          <span className={cn(
                            "text-[10px] font-bold uppercase px-2 py-1 rounded-lg",
                            item.sentiment === 'Positive' ? "bg-emerald-100 text-emerald-700" :
                            item.sentiment === 'Negative' ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-500"
                          )}>
                            {item.sentiment}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeFeature === 'risk' && (
                  <div className="space-y-6">
                    <h4 className="text-2xl font-bold">Portfolio Risk Profile</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-zinc-50 rounded-3xl text-center space-y-2">
                        <div className="text-xs text-zinc-400 font-bold uppercase">Beta</div>
                        <div className="text-3xl font-mono font-bold">{result.beta}</div>
                        <div className="text-[10px] text-zinc-500">Market Sensitivity</div>
                      </div>
                      <div className="p-6 bg-zinc-50 rounded-3xl text-center space-y-2">
                        <div className="text-xs text-zinc-400 font-bold uppercase">Volatility</div>
                        <div className="text-xl font-mono font-bold">{result.volatility}</div>
                        <div className="text-[10px] text-zinc-500">Standard Deviation</div>
                      </div>
                      <div className="p-6 bg-zinc-50 rounded-3xl text-center space-y-2">
                        <div className="text-xs text-zinc-400 font-bold uppercase">VaR</div>
                        <div className="text-xl font-mono font-bold">{result.var}</div>
                        <div className="text-[10px] text-zinc-500">Value at Risk</div>
                      </div>
                    </div>
                    <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex gap-4">
                      <AlertTriangle className="text-emerald-600 shrink-0" size={24} />
                      <p className="text-emerald-800 text-sm leading-relaxed">{result.summary}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] bg-zinc-50 border border-dashed border-zinc-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-300">
                  <Activity size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-zinc-400">Ready for Analysis</h4>
                  <p className="text-sm text-zinc-400 max-w-xs">
                    Select a stock or trigger an analysis from the left panel to see AI-powered results.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
