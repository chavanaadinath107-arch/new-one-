import React, { useMemo } from 'react';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  BarChart3
} from 'lucide-react';
import { UserState, Stock } from '../types';
import { cn } from '../utils';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface PortfolioTrackerProps {
  userState: UserState;
  stocks: Stock[];
}

export default function PortfolioTracker({ userState, stocks }: PortfolioTrackerProps) {
  const totalValue = useMemo(() => {
    return userState.portfolio.reduce((acc, item) => {
      const stock = stocks.find(s => s.symbol === item.symbol);
      return acc + (item.shares * (stock?.price || item.avgPrice));
    }, 0);
  }, [userState.portfolio, stocks]);

  const chartData = useMemo(() => {
    return userState.portfolio.map(item => {
      const stock = stocks.find(s => s.symbol === item.symbol);
      return {
        name: item.symbol,
        value: item.shares * (stock?.price || item.avgPrice)
      };
    });
  }, [userState.portfolio, stocks]);

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolio Tracker</h2>
          <p className="text-zinc-500">Comprehensive view of your virtual assets and performance.</p>
        </div>
        <div className="bg-zinc-900 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-4">
          <Wallet className="text-emerald-400" size={24} />
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-bold">Total Portfolio Value</div>
            <div className="text-xl font-mono font-bold">₹{totalValue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Asset Allocation Chart */}
        <div className="lg:col-span-1 bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <PieChart size={20} className="text-zinc-400" />
            Asset Allocation
          </h3>
          <div className="h-[300px] w-full">
            {userState.portfolio.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400 text-sm italic">
                No data to display
              </div>
            )}
          </div>
          <div className="space-y-2">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="font-medium text-zinc-600">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-zinc-900">
                  {((item.value / totalValue) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Holdings Table */}
        <div className="lg:col-span-2 bg-white border border-black/5 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-black/5 flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Target size={20} className="text-zinc-400" />
              Current Holdings
            </h3>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{userState.portfolio.length} Assets</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                  <th className="px-8 py-4">Asset</th>
                  <th className="px-8 py-4">Quantity</th>
                  <th className="px-8 py-4">Avg Price</th>
                  <th className="px-8 py-4">Total Value</th>
                  <th className="px-8 py-4">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {userState.portfolio.map((item, i) => {
                  const stock = stocks.find(s => s.symbol === item.symbol);
                  const currentPrice = stock?.price || item.avgPrice;
                  const totalVal = item.shares * currentPrice;
                  const profit = (currentPrice - item.avgPrice) * item.shares;
                  const profitPercent = ((currentPrice - item.avgPrice) / item.avgPrice) * 100;

                  return (
                    <tr key={i} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center font-bold text-zinc-600">
                            {item.symbol[0]}
                          </div>
                          <span className="font-bold text-zinc-900">{item.symbol}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-mono font-medium">{item.shares}</td>
                      <td className="px-8 py-6 font-mono font-medium">₹{item.avgPrice.toLocaleString()}</td>
                      <td className="px-8 py-6 font-mono font-bold">₹{totalVal.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <div className={cn(
                          "flex items-center gap-1 font-bold",
                          profit >= 0 ? "text-emerald-500" : "text-red-500"
                        )}>
                          {profit >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                          <span>{profit >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {userState.portfolio.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-zinc-400 italic">
                      Your portfolio is empty. Start trading in the simulator!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
