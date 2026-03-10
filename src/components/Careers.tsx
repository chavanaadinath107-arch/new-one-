import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';

const JOBS = [
  {
    title: "AI Curriculum Designer",
    department: "Education",
    location: "Remote",
    type: "Full-time",
    description: "Help us shape how the next generation learns about finance using generative AI."
  },
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Mumbai, India",
    type: "Full-time",
    description: "Build scalable real-time trading simulations and integrate advanced LLM features."
  },
  {
    title: "Financial Content Strategist",
    department: "Marketing",
    location: "Remote",
    type: "Contract",
    description: "Create engaging content that simplifies complex market trends for beginners."
  }
];

export default function Careers() {
  return (
    <div className="space-y-16 pb-20">
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest"
        >
          <Sparkles size={14} />
          <span>Join the Revolution</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Build the future of <span className="text-emerald-500">Financial Literacy</span></h1>
        <p className="text-zinc-500 text-lg md:text-xl leading-relaxed">
          We're on a mission to make the stock market accessible to everyone. We're looking for passionate individuals to help us build the world's best AI-powered learning platform.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-black/5 space-y-6">
          <h2 className="text-3xl font-bold">Why StockSense?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg">Flexible Work</h4>
                <p className="text-zinc-500 text-sm">We value results over hours. Work from anywhere in the world.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Briefcase size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg">Growth Mindset</h4>
                <p className="text-zinc-500 text-sm">Generous learning budget and mentorship from industry experts.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative rounded-[2.5rem] overflow-hidden group">
          <img 
            src="https://picsum.photos/seed/office/800/600" 
            alt="Our Office" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <p className="text-white font-medium italic">"The best place I've ever worked. The impact we have on users is incredible." — Sarah, Lead Engineer</p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Open Positions</h2>
          <span className="px-4 py-1 bg-zinc-100 rounded-full text-sm font-bold text-zinc-500">{JOBS.length} Roles</span>
        </div>

        <div className="grid gap-4">
          {JOBS.map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-black/5 p-8 rounded-3xl hover:border-emerald-500 transition-all group cursor-pointer shadow-sm hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold group-hover:text-emerald-600 transition-colors">{job.title}</h3>
                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-md">{job.department}</span>
                  </div>
                  <p className="text-zinc-500 text-sm max-w-xl">{job.description}</p>
                  <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {job.type}
                    </div>
                  </div>
                </div>
                <button className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-500 transition-all self-start md:self-center">
                  Apply Now
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
