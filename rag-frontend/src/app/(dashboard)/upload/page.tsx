"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";

export default function UploadPage() {
    const router = useRouter();
    const { currentJob, setCurrentJob, updateJobStatus, addInteraction, _hasHydrated } = useChatStore();
    const [file, setFile] = useState<File | null>(null);
    const [localErrorMessage, setLocalErrorMessage] = useState("");

    // Hydration check to prevent Next.js mismatch
    if (!_hasHydrated) return null;

    // Job Polling Logic
    useEffect(() => {
        let timer: any;
        if (currentJob?.id && currentJob.status === 'indexing') {
            timer = setInterval(async () => {
                try {
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
                    const res = await axios.get(`${baseUrl}/job/${currentJob.id}`);
                    updateJobStatus(res.data.status);

                    if (res.data.status === 'completed') {
                        setCurrentJob({ ...currentJob, status: 'success' });
                        addInteraction({
                            id: Date.now().toString(),
                            title: currentJob.filename,
                            time: new Date().toLocaleTimeString(),
                            date: new Date().toLocaleDateString(),
                            type: 'Upload',
                            status: 'Indexed'
                        });
                    } else if (res.data.status === 'error') {
                        setCurrentJob({ ...currentJob, status: 'error' });
                        setLocalErrorMessage(res.data.error || "Background processing failed");
                    }
                } catch (e: any) {
                    console.error("Polling error", e);
                    // If job is not found (pod restart), stop polling and show error
                    if (e.response?.status === 404) {
                        setCurrentJob({ ...currentJob, status: 'error' });
                        setLocalErrorMessage("Processing state lost (Server Restarted). Please re-upload.");
                    }
                }
            }, 1500);
        }
        return () => clearInterval(timer);
    }, [currentJob, setCurrentJob, updateJobStatus, addInteraction]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setLocalErrorMessage("");
            // Don't reset currentJob automatically if one is in progress
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
        },
        multiple: false,
        disabled: currentJob?.status === 'uploading' || currentJob?.status === 'indexing'
    });

    const handleUpload = async () => {
        if (!file) return;

        setCurrentJob({ id: '', filename: file.name, status: 'uploading' });
        const formData = new FormData();
        formData.append("file", file);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
            const response = await axios.post(`${baseUrl}/upload_pdf`, formData);
            if (response.data.job_id) {
                setCurrentJob({
                    id: response.data.job_id,
                    filename: file.name,
                    status: 'indexing',
                    jobStatus: 'queued'
                });
            } else {
                throw new Error("Backend did not return a Job ID");
            }
        } catch (e: any) {
            setCurrentJob(null);
            setLocalErrorMessage(e.response?.data?.detail || e.message || "Upload failed");
        }
    };

    const resetJob = () => {
        setCurrentJob(null);
        setFile(null);
        setLocalErrorMessage("");
    };

    return (
        <div className="p-8 md:p-12 lg:p-16 max-w-4xl mx-auto space-y-12">
            <header className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight">Knowledge Ingestion</h2>
                <p className="text-muted-foreground">Persistent background pipeline for your documents.</p>
            </header>

            <div className="space-y-8">
                {/* Status UI logic based on currentJob */}
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-2 border-dashed rounded-[3rem] p-16 flex flex-col items-center justify-center transition-all min-h-[350px]",
                        isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-white/10 hover:border-white/20 bg-white/5",
                        currentJob?.status === 'success' && "border-green-500/50 bg-green-500/5",
                        (currentJob?.status === 'uploading' || currentJob?.status === 'indexing') && "cursor-not-allowed opacity-80"
                    )}
                >
                    <input {...getInputProps()} />

                    <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-8 shadow-xl">
                        <Upload size={40} />
                    </div>

                    <div className="text-center space-y-3">
                        <p className="text-2xl font-bold text-white">
                            {file ? file.name : currentJob ? currentJob.filename : "Select Intelligence Source"}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">
                            {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "PDF and PPTX supported"}
                        </p>
                    </div>
                </div>

                {/* Processing Panel */}
                {(file || (currentJob && currentJob.status !== 'idle')) && (
                    <div className="glass-dark p-8 rounded-[2rem] border border-white/5 animate-in slide-in-from-bottom-6 min-h-[140px] flex flex-col justify-center">
                        {currentJob?.status === 'success' ? (
                            <div className="flex flex-col items-center text-center space-y-4">
                                <CheckCircle2 className="text-green-500" size={32} />
                                <h3 className="text-xl font-bold text-white">Ingestion Complete</h3>
                                <div className="flex gap-4">
                                    <button onClick={resetJob} className="text-xs font-bold px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                        New Upload
                                    </button>
                                    <button onClick={() => router.push('/chat')} className="text-xs font-bold px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all">
                                        Enter Chat
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-primary/10 rounded-2xl">
                                        <FileText className="text-primary" size={28} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="font-bold text-white">{file?.name || currentJob?.filename}</p>
                                        <div className="flex items-center gap-2">
                                            <Loader2 className={cn("text-primary h-3.5 w-3.5", (currentJob?.status === 'uploading' || currentJob?.status === 'indexing') && "animate-spin")} />
                                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                                                {currentJob?.status === 'uploading' ? "Uploading..." : currentJob?.status === 'indexing' ? `Stage: ${currentJob.jobStatus || 'Indexing'}` : "Ready to Ingest"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {(currentJob?.status === 'uploading' || currentJob?.status === 'indexing') && (
                                        <button
                                            onClick={resetJob}
                                            className="text-[10px] font-bold text-red-400/60 hover:text-red-400 underline mr-2"
                                        >
                                            Force Reset
                                        </button>
                                    )}
                                    {!currentJob?.status && (
                                        <button onClick={() => setFile(null)} className="p-3 text-muted-foreground hover:bg-white/5 rounded-xl transition-colors">
                                            <X size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={handleUpload}
                                        disabled={!!currentJob?.status}
                                        className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-4 rounded-2xl disabled:opacity-50 transition-all flex items-center gap-3"
                                    >
                                        {currentJob?.status ? "Processing..." : "Activate Pipeline"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Error Banner */}
                {(localErrorMessage || currentJob?.status === 'error') && (
                    <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-between text-red-500 animate-in shake">
                        <div className="flex items-center gap-4">
                            <AlertCircle size={24} />
                            <p className="font-bold">{localErrorMessage || "Processing error occurred."}</p>
                        </div>
                        <button onClick={resetJob} className="text-xs font-bold underline">Dismiss</button>
                    </div>
                )}
            </div>
        </div>
    );
}
