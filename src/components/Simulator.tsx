import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  PieChart, 
  History,
  ShoppingCart,
  IndianRupee,
  Info,
  Sparkles,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Stock, PortfolioItem, UserState } from '../types';
import { cn } from '../utils';
import { analyzePortfolio } from '../services/gemini';
import Markdown from 'react-markdown';

interface SimulatorProps {
  userState: UserState;
  onTrade: (symbol: string, shares: number, price: number, type: 'buy' | 'sell') => void;
  stocks: Stock[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
}

export default function Simulator({ userState, onTrade, stocks, setStocks }: SimulatorProps) {
  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE');
  const [tradeAmount, setTradeAmount] = useState<number>(1);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar' | 'candle'>('candle');
  const [timeframe, setTimeframe] = useState('1M');
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const handleAnalyzePortfolio = async () => {
    if (userState.portfolio.length === 0) return;
    setAnalyzing(true);
    setShowAnalysisModal(true);
    try {
      const result = await analyzePortfolio(userState.portfolio, userState.balance);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      setAnalysis("Failed to analyze portfolio. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const selectedStock = useMemo(() => 
    stocks.find(s => s.symbol === selectedSymbol) || stocks[0], 
    [stocks, selectedSymbol]
  );

  const portfolioItem = useMemo(() => 
    userState.portfolio.find(p => p.symbol === selectedSymbol),
    [userState.portfolio, selectedSymbol]
  );

  const handleTrade = () => {
    if (tradeAmount <= 0) return;
    onTrade(selectedSymbol, tradeAmount, selectedStock.price, tradeType);
    setTradeAmount(1);
  };

  const totalPortfolioValue = useMemo(() => {
    return userState.portfolio.reduce((total, item) => {
      const stock = stocks.find(s => s.symbol === item.symbol);
      return total + (stock ? stock.price * item.shares : 0);
    }, 0);
  }, [userState.portfolio, stocks]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Market & Chart */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                {selectedStock.symbol[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedStock.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-mono text-sm">{selectedStock.symbol}</span>
                  <span className={cn(
                    "flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full",
                    selectedStock.change >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  )}>
                    {selectedStock.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(selectedStock.changePercent)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <div className="text-3xl font-mono font-bold">₹{selectedStock.price.toLocaleString()}</div>
                <div className={cn(
                  "text-sm font-medium",
                  selectedStock.change >= 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} Today
                </div>
              </div>
              <div className="flex bg-zinc-100 p-1 rounded-xl">
                {(['area', 'line', 'bar', 'candle'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                      chartType === type ? "bg-white text-emerald-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'candle' ? (
                <BarChart data={selectedStock.history}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    minTickGap={30}
                  />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-zinc-900 p-3 rounded-xl border border-white/10 text-white text-[10px] space-y-1">
                            <div className="font-bold border-b border-white/10 pb-1 mb-1">{data.time}</div>
                            <div className="flex justify-between gap-4"><span>O:</span> <span className="font-mono">{data.open}</span></div>
                            <div className="flex justify-between gap-4"><span>H:</span> <span className="font-mono text-emerald-400">{data.high}</span></div>
                            <div className="flex justify-between gap-4"><span>L:</span> <span className="font-mono text-red-400">{data.low}</span></div>
                            <div className="flex justify-between gap-4"><span>C:</span> <span className="font-mono">{data.close}</span></div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Correct approach for Candlestick in Recharts: Bar with data as [low, high] and another for [open, close] */}
                  <Bar
                    dataKey={(d) => [d.low, d.high]}
                    shape={(props: any) => {
                      const { x, y, width, height, payload } = props;
                      const isUp = payload.close >= payload.open;
                      const color = isUp ? "#10b981" : "#ef4444";
                      const wickX = x + width / 2;
                      return <line x1={wickX} y1={y} x2={wickX} y2={y + height} stroke={color} strokeWidth={1.5} />;
                    }}
                  />
                  <Bar
                    dataKey={(d) => [Math.min(d.open, d.close), Math.max(d.open, d.close)]}
                    shape={(props: any) => {
                      const { x, y, width, height, payload } = props;
                      const isUp = payload.close >= payload.open;
                      const color = isUp ? "#10b981" : "#ef4444";
                      // Bodies are slightly wider than wicks
                      return <rect x={x + width * 0.15} y={y} width={width * 0.7} height={Math.max(1, height)} fill={color} />;
                    }}
                  />
                </BarChart>
              ) : chartType === 'area' ? (
                <AreaChart data={selectedStock.history}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedStock.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={selectedStock.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    minTickGap={30}
                  />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={selectedStock.change >= 0 ? "#10b981" : "#ef4444"} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    animationDuration={1000}
                  />
                </AreaChart>
              ) : chartType === 'line' ? (
                <LineChart data={selectedStock.history}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    minTickGap={30}
                  />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={selectedStock.change >= 0 ? "#10b981" : "#ef4444"} 
                    strokeWidth={3}
                    dot={false}
                    animationDuration={1000}
                  />
                </LineChart>
              ) : (
                <BarChart data={selectedStock.history}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    minTickGap={30}
                  />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar 
                    dataKey="price" 
                    fill={selectedStock.change >= 0 ? "#10b981" : "#ef4444"} 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
            
            {/* Floating Zoom Icon */}
            <div className="absolute bottom-4 right-4 w-10 h-10 bg-white border border-black/5 rounded-full shadow-lg flex items-center justify-center text-zinc-400 cursor-pointer hover:text-zinc-900 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </div>

          {/* Timeframe Selectors */}
          <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-6">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 no-scrollbar">
              {['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'All'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                    timeframe === tf 
                      ? "bg-zinc-900 text-white shadow-md" 
                      : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
            <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
              <TrendingUp size={20} />
            </button>
          </div>

          {/* Sub-Tabs */}
          <div className="mt-8 flex items-center gap-8 border-b border-black/5">
            {['Overview', 'Technicals', 'News', 'Events'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={cn(
                  "pb-4 text-sm font-bold transition-all relative",
                  activeSubTab === tab 
                    ? "text-zinc-900" 
                    : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                {tab}
                {activeSubTab === tab && (
                  <motion.div 
                    layoutId="activeSubTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-black/5 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Market Watch
            </h3>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Real-time Updates</span>
          </div>
          <div className="divide-y divide-black/5">
            {stocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => setSelectedSymbol(stock.symbol)}
                className={cn(
                  "w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors",
                  selectedSymbol === stock.symbol ? "bg-emerald-50/50" : ""
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center font-bold text-zinc-600">
                    {stock.symbol[0]}
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{stock.symbol}</div>
                    <div className="text-xs text-zinc-500">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold">₹{stock.price}</div>
                  <div className={cn(
                    "text-xs font-bold",
                    stock.change >= 0 ? "text-emerald-600" : "text-red-600"
                  )}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Trading & Portfolio */}
      <div className="space-y-6">
        <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
          <div className="flex p-1 bg-zinc-100 rounded-2xl mb-6">
            <button
              onClick={() => setTradeType('buy')}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                tradeType === 'buy' ? "bg-white text-emerald-600 shadow-sm" : "text-zinc-500"
              )}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType('sell')}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                tradeType === 'sell' ? "bg-white text-red-600 shadow-sm" : "text-zinc-500"
              )}
            >
              Sell
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Shares to {tradeType}</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-zinc-50 border border-black/5 rounded-2xl px-4 py-4 font-mono text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">SHARES</div>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 rounded-2xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Market Price</span>
                <span className="font-mono font-bold">₹{selectedStock.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Estimated Total</span>
                <span className="font-mono font-bold">₹{(tradeAmount * selectedStock.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              onClick={handleTrade}
              disabled={
                (tradeType === 'buy' && userState.balance < tradeAmount * selectedStock.price) ||
                (tradeType === 'sell' && (!portfolioItem || portfolioItem.shares < tradeAmount)) ||
                tradeAmount <= 0
              }
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none",
                tradeType === 'buy' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
              )}
            >
              Confirm {tradeType === 'buy' ? 'Purchase' : 'Sale'}
            </button>

            {tradeType === 'buy' && userState.balance < tradeAmount * selectedStock.price && (
              <p className="text-center text-xs text-red-500 font-medium">Insufficient virtual balance</p>
            )}
            {tradeType === 'sell' && (!portfolioItem || portfolioItem.shares < tradeAmount) && (
              <p className="text-center text-xs text-red-500 font-medium">Insufficient shares in portfolio</p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-6 text-white shadow-xl shadow-zinc-900/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <PieChart size={18} className="text-emerald-400" />
              Your Portfolio
            </h3>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Performance</div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-1">Total Assets</div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-mono font-bold">
                  ₹{(userState.balance + totalPortfolioValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <button
                  onClick={handleAnalyzePortfolio}
                  disabled={userState.portfolio.length === 0 || analyzing}
                  className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-all flex items-center gap-2 text-xs font-bold"
                >
                  <Sparkles size={14} className={analyzing ? "animate-spin" : ""} />
                  AI Analyze
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {userState.portfolio.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                  <p className="text-zinc-500 text-sm">Your portfolio is empty.<br/>Start trading to see it grow!</p>
                </div>
              ) : (
                userState.portfolio.map((item) => {
                  const stock = stocks.find(s => s.symbol === item.symbol);
                  if (!stock) return null;
                  const value = stock.price * item.shares;
                  const profit = (stock.price - item.avgPrice) * item.shares;
                  const profitPercent = ((stock.price - item.avgPrice) / item.avgPrice) * 100;

                  return (
                    <div key={item.symbol} className="bg-zinc-800/50 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <div className="font-bold">{item.symbol}</div>
                        <div className="text-xs text-zinc-500">{item.shares} Shares @ ₹{item.avgPrice}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold">₹{value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <div className={cn(
                          "text-xs font-bold",
                          profit >= 0 ? "text-emerald-400" : "text-red-400"
                        )}>
                          {profit >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shrink-0">
              <Info size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-emerald-900 text-sm">Learning Tip</h4>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Diversification means spreading your money across different stocks to reduce risk. Try not to put all your virtual money into just one company!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Modal */}
      <AnimatePresence>
        {showAnalysisModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAnalysisModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-black/5 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">AI Portfolio Analysis</h3>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Powered by Gemini AI</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAnalysisModal(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                {analyzing ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="animate-spin text-emerald-500" size={48} />
                    <p className="text-zinc-500 font-medium">Gemini is analyzing your market positions...</p>
                  </div>
                ) : (
                  <div className="prose prose-zinc max-w-none prose-headings:font-bold prose-p:leading-relaxed">
                    <Markdown>{analysis}</Markdown>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-black/5 bg-zinc-50 flex justify-end">
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
                >
                  Close Analysis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
