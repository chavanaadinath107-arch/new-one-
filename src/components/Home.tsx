import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  BookOpen, 
  BrainCircuit, 
  TrendingUp, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  LineChart as LineChartIcon,
  Zap,
  Gem,
  Bell,
  Coins
} from 'lucide-react';
import Footer from './Footer';
import Recommendations from './Recommendations';
import { cn } from '../utils';
import { UserState, Stock } from '../types';

interface HomeProps {
  onNavigate: (tab: string) => void;
  userState: UserState;
  stocks: Stock[];
}

const SLIDES = [
  {
    id: 'learn',
    title: "Master the Language of Money",
    description: "Demystify complex financial jargon with AI-powered explanations that actually make sense.",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100"
  },
  {
    id: 'simulator',
    title: "Risk-Free Trading Practice",
    description: "Test your strategies with ₹10,00,000 in virtual capital. Real market dynamics, zero real risk.",
    icon: TrendingUp,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100"
  },
  {
    id: 'quiz',
    title: "Challenge Your Knowledge",
    description: "Take AI-generated quizzes to reinforce what you've learned and track your progress.",
    icon: BrainCircuit,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100"
  }
];

const CHOICES = [
  { title: "Mutual Funds", icon: Layers, color: "text-orange-500" },
  { title: "Stocks", icon: LineChartIcon, color: "text-blue-500" },
  { title: "Future & Options", icon: Zap, color: "text-purple-500" },
  { title: "Commodities", icon: Gem, color: "text-emerald-500" },
  { title: "IPOs", icon: Bell, color: "text-yellow-500" },
  { title: "Currencies", icon: Coins, color: "text-indigo-500" },
];

export default function Home({ onNavigate, userState, stocks }: HomeProps) {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-zinc-950 text-white p-10 md:p-20 shadow-2xl shadow-emerald-500/10">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/2 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
          
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-emerald-400 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={14} className="animate-spin-slow" />
            <span>The Future of Financial Literacy</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Invest in your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              Knowledge
            </span> first.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-zinc-400 text-lg md:text-2xl leading-relaxed max-w-2xl"
          >
            Master the stock market with AI-driven insights, risk-free simulations, and personalized learning paths.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap gap-5 pt-6"
          >
            <button 
              onClick={() => onNavigate('learn')}
              className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl font-bold transition-all flex items-center gap-3 group shadow-xl shadow-emerald-500/20 active:scale-95"
            >
              Get Started
              <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button 
              onClick={() => onNavigate('simulator')}
              className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all backdrop-blur-md active:scale-95"
            >
              Open Simulator
            </button>
          </motion.div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Recommendations 
            balance={userState.balance} 
            portfolio={userState.portfolio} 
            onNavigate={onNavigate} 
          />
        </div>
        <div className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Market Overview
            </h3>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Live</span>
          </div>
          <div className="space-y-4">
            {stocks.slice(0, 4).map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between group cursor-pointer" onClick={() => onNavigate('simulator')}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    {stock.symbol[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{stock.symbol}</div>
                    <div className="text-[10px] text-zinc-400">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold">₹{stock.price.toLocaleString()}</div>
                  <div className={cn(
                    "text-[10px] font-bold",
                    stock.change >= 0 ? "text-emerald-600" : "text-red-600"
                  )}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onNavigate('simulator')}
            className="w-full py-3 bg-zinc-50 text-zinc-500 rounded-2xl text-xs font-bold hover:bg-zinc-100 transition-all"
          >
            View All Markets
          </button>
        </div>
      </div>

      {/* Explore Features Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Explore Features</h2>
          <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">
            All-in-one Platform
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SLIDES.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onNavigate(feature.id)}
              className={cn(
                "group relative p-10 rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden",
                "bg-white hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2",
                feature.borderColor
              )}
            >
              {/* Background Accent */}
              <div className={cn(
                "absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-20",
                feature.bgColor.replace('bg-', 'bg-')
              )} />

              <div className="relative z-10 space-y-6">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                  feature.bgColor,
                  feature.color
                )}>
                  {React.createElement(feature.icon, { size: 32, strokeWidth: 2 })}
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold leading-tight text-zinc-900 group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-2 text-sm font-bold text-zinc-400 group-hover:text-emerald-600 transition-colors">
                  <span>Explore {feature.id}</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* One Platform. Multiple Choices. Section */}
      <section className="py-12 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">One Platform. Multiple Choices.</h2>
          <p className="text-zinc-500 text-xl">We've got something for everyone</p>
          <div className="pt-4">
            <button 
              onClick={() => onNavigate('simulator')}
              className="px-8 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-all"
            >
              Start investing
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHOICES.map((choice, idx) => (
            <motion.div
              key={choice.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-zinc-50/50 border border-black/5 rounded-3xl p-12 flex flex-col items-center justify-center space-y-8 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer group"
            >
              <div className={cn("transition-transform duration-500 group-hover:scale-110", choice.color)}>
                <choice.icon size={64} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-zinc-800">{choice.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Stats / Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 space-y-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
            <TrendingUp size={24} />
          </div>
          <h4 className="text-xl font-bold text-emerald-900">Real-time Data</h4>
          <p className="text-emerald-700 text-sm leading-relaxed">Experience live market movements with our simulated engine that mimics real-world volatility.</p>
        </div>
        <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 space-y-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
            <MessageSquare size={24} />
          </div>
          <h4 className="text-xl font-bold text-blue-900">AI Assistance</h4>
          <p className="text-blue-700 text-sm leading-relaxed">Never feel lost. Our AI tutor is available 24/7 to explain any concept or answer your questions.</p>
        </div>
        <div className="bg-purple-50 p-8 rounded-[2rem] border border-purple-100 space-y-4">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white">
            <BrainCircuit size={24} />
          </div>
          <h4 className="text-xl font-bold text-purple-900">Gamified Learning</h4>
          <p className="text-purple-700 text-sm leading-relaxed">Learning finance doesn't have to be boring. Earn scores and track your virtual wealth growth.</p>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
