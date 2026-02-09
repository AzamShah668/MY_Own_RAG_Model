"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";

export default function RegisterPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response: any = await authService.register(name, email, password);
            setAuth(response.user, response.token);
            router.push("/");
        } catch (err) {
            setError("Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#09090b]">
            {/* Abstract Background Mesh */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-md z-10">
                <div className="glass-dark border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
                            Get started today
                        </h1>
                        <p className="text-muted-foreground text-sm">Create your AXM Enterprises account</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <FormInput
                            label="Full Name"
                            icon={<User size={18} />}
                            type="text"
                            placeholder="Azam Rizwan"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <FormInput
                            label="Email Address"
                            icon={<Mail size={18} />}
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <FormInput
                            label="Password"
                            icon={<Lock size={18} />}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 mt-2">
                            <ShieldCheck size={16} className="text-green-500" />
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Security: Enterprise-grade encryption enabled</span>
                        </div>

                        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group mt-6"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-semibold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

function FormInput({ label, icon, type, placeholder, value, onChange }: {
    label: string,
    icon: React.ReactNode,
    type: string,
    placeholder: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors">
                    {icon}
                </div>
                <input
                    type={type}
                    required
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                />
            </div>
        </div>
    );
}
