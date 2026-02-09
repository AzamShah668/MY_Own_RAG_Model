"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Github, Chrome, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response: any = await authService.login(email, password);
            setAuth(response.user, response.token);
            router.push("/"); // Redirect to dashboard
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#09090b]">
            {/* Abstract Background Mesh */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-md z-10">
                <div className="glass-dark border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
                            Welcome back
                        </h1>
                        <p className="text-muted-foreground text-sm">Log in to your AXM Enterprises account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Password</label>
                                <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                                />
                            </div>
                        </div>

                        {error && <p className="text-xs text-red-400 text-center animate-shake">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
                            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-xs text-muted-foreground uppercase">Or continue with</span>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <SocialButton icon={<Chrome size={18} />} label="Google" />
                        <SocialButton icon={<Github size={18} />} label="GitHub" />
                    </div>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-primary font-semibold hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

function SocialButton({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium">
            {icon}
            {label}
        </button>
    );
}
