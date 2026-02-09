"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare, Upload, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";

export default function DashboardPage() {
  const { interactions, _hasHydrated } = useChatStore();

  if (!_hasHydrated) return null;

  const recentItems = interactions.slice(0, 3);

  return (
    <div className="p-8 md:p-12 lg:p-16">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4">
            <Sparkles size={16} className="fill-primary" />
            AXM Enterprises Systems Ready
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">Good afternoon, Azam</h2>
          <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed">
            Your intelligence workspace is optimized. Sub-second inference and recursive vector memory are operational.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <QuickActionCard
            icon={<MessageSquare className="text-primary" size={36} />}
            title="Smarter Analytics"
            description="Engage with your high-value documents using the Groq LPU engine for instant tactical insights."
            href="/chat"
            badge="Llama 3.1"
            color="primary"
          />
          <QuickActionCard
            icon={<Zap className="text-blue-400" size={36} />}
            title="Accelerated Ingestion"
            description="Drop complex PDFs and PPTX files into your semantic vault. Every slide and page is indexed."
            href="/upload"
            badge="Recursive Engine"
            color="blue"
          />
        </div>

        <section className="space-y-8 pt-4">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-2xl font-black text-white tracking-tight">Recent Intelligence</h3>
            <Link href="/history" className="text-sm text-primary hover:underline font-bold uppercase tracking-widest">View Archives</Link>
          </div>

          <div className="grid gap-4">
            {recentItems.length === 0 ? (
              <div className="p-12 text-center glass-dark border border-white/5 rounded-[2rem] opacity-40 italic text-sm">
                No recent activity detected. Ingest a document to get started.
              </div>
            ) : (
              recentItems.map((item) => (
                <ActivityItem
                  key={item.id}
                  title={item.title}
                  time={item.time}
                  type={item.type}
                  status={item.status}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, description, href, badge, color }: { icon: React.ReactNode, title: string, description: string, href: string, badge?: string, color: 'primary' | 'blue' }) {
  return (
    <Link href={href} className="group">
      <div className="glass-dark p-12 rounded-[3.5rem] border border-white/5 hover:border-primary/40 transition-all duration-700 relative overflow-hidden h-full flex flex-col">
        <div className={cn(
          "absolute top-0 right-0 w-48 h-48 blur-[100px] transition-all duration-700 pointer-events-none",
          color === 'primary' ? "bg-primary/10 group-hover:bg-primary/20" : "bg-blue-500/10 group-hover:bg-blue-500/20"
        )} />

        <div className="flex justify-between items-start mb-8">
          <div className="p-5 bg-white/5 rounded-3xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-2xl">
            {icon}
          </div>
          {badge && (
            <span className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border",
              color === 'primary' ? "bg-primary/10 text-primary border-primary/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            )}>
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-3xl font-black mb-4 text-white group-hover:translate-x-1 transition-transform">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-base mb-10 flex-1 font-medium italic">"{description}"</p>

        <div className="flex items-center gap-3 text-sm font-black text-primary uppercase tracking-widest group/link">
          Open Workspace
          <ArrowRight className="group-hover/link:translate-x-3 transition-transform duration-500" size={18} />
        </div>
      </div>
    </Link>
  );
}

function ActivityItem({ title, time, type, status }: { title: string, time: string, type: 'Upload' | 'Chat', status: string }) {
  return (
    <div className="flex items-center justify-between p-6 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-all group cursor-pointer shadow-lg hover:shadow-primary/5">
      <div className="flex items-center gap-6">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-105",
          type === 'Upload' ? "bg-blue-500/10 text-blue-500" : "bg-primary/10 text-primary"
        )}>
          {type === 'Upload' ? <Upload size={24} /> : <MessageSquare size={24} />}
        </div>
        <div>
          <p className="font-bold text-lg text-white group-hover:text-primary transition-colors">{title}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">{time}</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-400/80">{status}</span>
          </div>
        </div>
      </div>
      <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
        <ArrowRight size={22} className="text-primary" />
      </div>
    </div>
  );
}
