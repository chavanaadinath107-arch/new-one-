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
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HomeProps {
  onNavigate: (tab: string) => void;
}

const SLIDES = [
  {
    id: 'learn',
    title: "Master the Language of Money",
    description: "Demystify complex financial jargon with AI-powered explanations that actually make sense.",
    icon: BookOpen,
    color: "bg-blue-500",
    image: "https://picsum.photos/seed/finance/800/400"
  },
  {
    id: 'simulator',
    title: "Risk-Free Trading Practice",
    description: "Test your strategies with ₹10,00,000 in virtual capital. Real market dynamics, zero real risk.",
    icon: TrendingUp,
    color: "bg-emerald-500",
    image: "https://picsum.photos/seed/trading/800/400"
  },
  {
    id: 'quiz',
    title: "Challenge Your Knowledge",
    description: "Take AI-generated quizzes to reinforce what you've learned and track your progress.",
    icon: BrainCircuit,
    color: "bg-purple-500",
    image: "https://picsum.photos/seed/quiz/800/400"
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

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 text-white p-8 md:p-16">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/50 to-transparent" />
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.1" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={14} />
            <span>AI-Powered Learning</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]"
          >
            Invest in your <span className="text-emerald-400">Knowledge</span> first.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl leading-relaxed"
          >
            StockSense AI is your personal gateway to the financial world. Learn, practice, and master the stock market with the help of advanced AI.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button 
              onClick={() => onNavigate('learn')}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all flex items-center gap-2 group shadow-lg shadow-emerald-500/20"
            >
              Start Learning
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onNavigate('simulator')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all backdrop-blur-sm"
            >
              Try Simulator
            </button>
          </motion.div>
        </div>
      </section>

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
              className="group bg-white border border-black/5 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all flex flex-col"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute top-4 left-4 w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  {React.createElement(feature.icon, { size: 24 })}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col space-y-4">
                <h3 className="text-2xl font-bold leading-tight group-hover:text-emerald-600 transition-colors">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed flex-1">{feature.description}</p>
                <button 
                  onClick={() => onNavigate(feature.id)}
                  className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline group/btn"
                >
                  Go to {feature.id.charAt(0).toUpperCase() + feature.id.slice(1)}
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
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
