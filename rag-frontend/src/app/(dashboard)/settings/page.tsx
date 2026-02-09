"use client";

import { User, Settings, Shield, Bell, Zap, Save, Globe } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function SettingsPage() {
    const { user } = useAuthStore();

    return (
        <div className="p-8 md:p-12 lg:p-16 max-w-4xl mx-auto space-y-12">
            <header className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight text-white">Settings</h2>
                <p className="text-muted-foreground">Manage your AXM Enterprises account and application preferences.</p>
            </header>

            <div className="grid gap-8">
                {/* Profile Section */}
                <section className="glass-dark border border-white/5 rounded-3xl p-8 space-y-8">
                    <div className="flex items-center gap-3 text-sm font-bold text-primary uppercase tracking-wider">
                        <User size={16} />
                        Account Profile
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1.5 px-1">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Full Name</label>
                            <input
                                type="text"
                                defaultValue={user?.name || ""}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-primary/50 transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-1.5 px-1">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Email Address</label>
                            <input
                                type="email"
                                disabled
                                defaultValue={user?.email || ""}
                                className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 px-4 outline-none opacity-50 text-sm cursor-not-allowed"
                            />
                        </div>
                    </div>
                </section>

                {/* Intelligence Config */}
                <section className="glass-dark border border-white/5 rounded-3xl p-8 space-y-8">
                    <div className="flex items-center gap-3 text-sm font-bold text-blue-400 uppercase tracking-wider">
                        <Zap size={16} />
                        Intelligence Core
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <div>
                                <p className="text-sm font-bold">Fast Inference (Groq)</p>
                                <p className="text-xs text-muted-foreground">Always use LPU acceleration for sub-second responses.</p>
                            </div>
                            <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                            </div>
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="flex items-center justify-between px-1">
                            <div>
                                <p className="text-sm font-bold">Semantic Search Highlighting</p>
                                <p className="text-xs text-muted-foreground">Show retrieved context snippets in chat bubbles.</p>
                            </div>
                            <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Action Bar */}
                <div className="flex justify-end pt-4">
                    <button className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
