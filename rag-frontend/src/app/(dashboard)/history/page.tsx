"use client";

import { MessageSquare, Upload, Search, Calendar, Filter, ArrowRight, Trash2 } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
    const { interactions, _hasHydrated } = useChatStore();
    const router = useRouter();

    if (!_hasHydrated) return null;

    return (
        <div className="p-8 md:p-12 lg:p-16 max-w-5xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold tracking-tight text-white">Intelligence History</h2>
                    <p className="text-muted-foreground">Review your past intelligence queries and document ingestion logs.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-3 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="Search registry..."
                            className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/50 transition-all text-sm w-64"
                        />
                    </div>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors text-muted-foreground">
                        <Filter size={20} />
                    </button>
                </div>
            </header>

            <section className="space-y-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                    <Calendar size={14} />
                    Activity Log
                </div>

                <div className="space-y-3">
                    {interactions.length === 0 ? (
                        <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
                            <History size={48} className="mx-auto mb-4" />
                            <p className="text-lg font-bold uppercase">No records found</p>
                            <p className="text-xs">Start chatting or uploading to build your history.</p>
                        </div>
                    ) : (
                        interactions.map((item) => (
                            <HistoryItem
                                key={item.id}
                                title={item.title}
                                time={item.time}
                                type={item.type}
                                date={item.date}
                                status={item.status}
                                onAction={() => item.type === 'Chat' ? router.push('/chat') : router.push('/upload')}
                            />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

function HistoryItem({ title, time, type, date, status, onAction }: {
    title: string, time: string, type: 'Upload' | 'Chat', date: string, status: string, onAction: () => void
}) {
    return (
        <div className="glass-dark p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group flex items-center justify-between cursor-default">
            <div className="flex items-center gap-6">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl",
                    type === 'Upload' ? "bg-blue-500/10 text-blue-500" : "bg-primary/10 text-primary"
                )}>
                    {type === 'Upload' ? <Upload size={24} /> : <MessageSquare size={24} />}
                </div>
                <div>
                    <p className="font-bold text-white text-[15px] group-hover:text-primary transition-colors line-clamp-1">{title}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground font-bold uppercase tracking-wide">
                        <span className="text-white/40">{date}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-white/40">{time}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className={cn(
                            type === 'Upload' ? "text-blue-400" : "text-primary"
                        )}>{status}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onAction}
                    className="bg-white/5 hover:bg-primary hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 group/btn shadow-xl"
                >
                    {type === 'Chat' ? "Open Chat" : "Upload More"}
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button className="p-2.5 text-white/10 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}

import { History } from "lucide-react";
