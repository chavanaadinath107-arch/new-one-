import React from 'react';
import { 
  TrendingUp, 
  Twitter, 
  Linkedin, 
  Github, 
  Instagram, 
  Phone, 
  Mail, 
  MapPin,
  ArrowRight
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-white rounded-[3rem] p-10 md:p-20 mt-20 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/50 to-transparent" />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand & Socials */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">StockSense AI</h2>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Empowering the next generation of investors with AI-driven insights and risk-free practice.
          </p>
          <div className="flex gap-4">
            {[Twitter, Linkedin, Github, Instagram].map((Icon, idx) => (
              <a 
                key={idx} 
                href="#" 
                className="w-10 h-10 bg-white/5 hover:bg-emerald-500 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Menu */}
        <div className="space-y-6">
          <h4 className="font-bold text-lg">Platform</h4>
          <ul className="space-y-3">
            {[
              { id: 'home', label: 'Home' },
              { id: 'learn', label: 'Learn Terms' },
              { id: 'quiz', label: 'Knowledge Quiz' },
              { id: 'simulator', label: 'Trading Sim' },
              { id: 'chat', label: 'AI Tutor' }
            ].map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => onNavigate(item.id)}
                  className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="space-y-6">
          <h4 className="font-bold text-lg">Company</h4>
          <ul className="space-y-3">
            <li>
              <button 
                onClick={() => onNavigate('careers')}
                className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
              >
                <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                Careers
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-md ml-2">Hiring</span>
              </button>
            </li>
            {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map((item) => (
              <li key={item}>
                <a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="font-bold text-lg">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-zinc-400 text-sm">
              <MapPin size={18} className="text-emerald-500 shrink-0" />
              <span>402, BKC Financial District<br/>Mumbai, Maharashtra 400051</span>
            </li>
            <li className="flex items-center gap-3 text-zinc-400 text-sm">
              <Phone size={18} className="text-emerald-500 shrink-0" />
              <div className="flex flex-col">
                <span>+91 22 1234 5678</span>
                <span>+91 98765 43210</span>
              </div>
            </li>
            <li className="flex items-center gap-3 text-zinc-400 text-sm">
              <Mail size={18} className="text-emerald-500 shrink-0" />
              <span>support@stocksense.ai</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-xs font-medium uppercase tracking-widest">
        <p>&copy; {currentYear} StockSense AI. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Security</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
          <a href="#" className="hover:text-white transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
