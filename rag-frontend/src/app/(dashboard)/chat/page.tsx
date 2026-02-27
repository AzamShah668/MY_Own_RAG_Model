"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, Quote, Trash2 } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatPage() {
    const { messages, addMessage, clearMessages, addInteraction } = useChatStore();
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user' as const,
            content: input,
            timestamp: new Date().toLocaleTimeString()
        };

        addMessage(userMessage);
        setInput("");
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:8001/ask", {
                question: input,
                top_k: 3
            });

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant' as const,
                content: response.data.answer,
                context: response.data.context,
                timestamp: new Date().toLocaleTimeString()
            };

            addMessage(aiMessage);

            // Track interaction for history
            addInteraction({
                id: Date.now().toString(),
                title: `Q: ${input.slice(0, 40)}...`,
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
                type: 'Chat',
                status: 'Completed'
            });

        } catch (error) {
            addMessage({
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please check if the backend is online.",
                timestamp: new Date().toLocaleTimeString()
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col relative">
            <header className="p-6 border-b border-white/5 flex justify-between items-center glass-dark sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner text-lg font-bold">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold">AXM Assistant</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Llama 3.1 • Groq</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={clearMessages}
                    className="p-2.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
                    title="Clear Conversation"
                >
                    <Trash2 size={18} />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide pb-32">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto opacity-50">
                        <Sparkles className="text-primary" size={48} />
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Semantic Chat Workspace</h3>
                            <p className="text-sm text-muted-foreground">Ask anything about your documents. History is now persisted automatically.</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={cn(
                            "flex w-full gap-4 max-w-4xl mx-auto items-start",
                            msg.role === 'assistant' ? "flex-row" : "flex-row-reverse"
                        )}>
                            <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg mt-1",
                                msg.role === 'assistant' ? "bg-primary text-white" : "bg-white/10 text-white"
                            )}>
                                {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                            </div>
                            <div className={cn("space-y-4 flex-1", msg.role === 'user' && "text-right")}>
                                <div className={cn(
                                    "p-5 rounded-[2rem] text-[14px] leading-relaxed shadow-xl inline-block text-left max-w-[85%]",
                                    msg.role === 'assistant'
                                        ? "glass-dark border border-white/5 text-foreground markdown-container"
                                        : "bg-primary text-white font-medium"
                                )}>
                                    {msg.role === 'assistant' ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        msg.content
                                    )}
                                </div>

                                {msg.context && msg.context.length > 0 && (
                                    <div className="space-y-2 pl-4 border-l-2 border-primary/20 text-left">
                                        <p className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1.5 tracking-widest">
                                            <Quote size={8} className="text-primary" />
                                            Evidence Basis
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {msg.context.map((ctx, idx) => (
                                                <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-2xl text-[11px] text-muted-foreground leading-normal italic">
                                                    "{ctx.slice(0, 150)}..."
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex w-full gap-4 max-w-4xl mx-auto">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 animate-pulse">
                            <Bot size={18} className="text-white" />
                        </div>
                        <div className="glass-dark border border-white/5 p-5 rounded-3xl flex items-center gap-3">
                            <Loader2 className="animate-spin text-primary" size={16} />
                            <span className="text-sm text-muted-foreground animate-pulse font-medium">Synthesizing response...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-6 md:p-10 bg-gradient-to-t from-background via-background/90 to-transparent fixed bottom-0 left-64 right-0 z-10">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Query your knowledge base..."
                        className="w-full bg-white/5 glass-dark border border-white/10 rounded-[2rem] py-5 pl-7 pr-16 outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all shadow-2xl"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2.5 top-2.5 bottom-2.5 w-14 bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
