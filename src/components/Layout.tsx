import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon,
  BookOpen, 
  BrainCircuit, 
  TrendingUp, 
  MessageSquare, 
  Menu, 
  X,
  ChevronRight,
  Wallet,
  PieChart,
  Eye,
  EyeOff,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  balance: number;
}

export default function Layout({ children, activeTab, setActiveTab, balance }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'learn', label: 'Learn Terms', icon: BookOpen },
    { id: 'quiz', label: 'Knowledge Quiz', icon: BrainCircuit },
    { id: 'simulator', label: 'Trading Sim', icon: TrendingUp },
    { id: 'chat', label: 'AI Tutor', icon: MessageSquare },
    { id: 'careers', label: 'Careers', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans">
      {/* Top Navigation Bar (Desktop & Mobile) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                <TrendingUp size={18} />
              </div>
              <span className="font-bold text-lg hidden sm:inline-block">StockSense AI</span>
            </div>

            {/* Desktop Nav Items */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2",
                    activeTab === item.id 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                  )}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Balance Display with Hide/Unhide */}
            <div className="flex items-center gap-3 bg-zinc-900 text-white px-4 py-2 rounded-2xl shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold leading-none mb-0.5">Balance</span>
                <span className="font-mono font-medium text-sm">
                  {showBalance 
                    ? `₹${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "••••••••"
                  }
                </span>
              </div>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                title={showBalance ? "Hide Balance" : "Show Balance"}
              >
                {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-72 bg-white z-50 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-black/5">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-zinc-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200",
                      activeTab === item.id 
                        ? "bg-emerald-50 text-emerald-700 font-bold shadow-sm" 
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                    )}
                  >
                    <item.icon size={20} />
                    <span className="text-lg">{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="p-6 border-t border-black/5 bg-zinc-50">
                <p className="text-xs text-zinc-400 font-medium text-center uppercase tracking-widest">StockSense AI v1.0</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-64px)]">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
