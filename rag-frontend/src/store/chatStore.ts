import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    context?: string[];
    timestamp: string;
}

interface Interaction {
    id: string;
    title: string;
    time: string;
    date: string;
    type: 'Chat' | 'Upload';
    status: string;
}

interface UploadJob {
    id: string;
    filename: string;
    status: 'idle' | 'uploading' | 'indexing' | 'success' | 'error';
    jobStatus?: string;
}

interface ChatState {
    messages: Message[];
    interactions: Interaction[];
    currentJob: UploadJob | null;
    addMessage: (message: Message) => void;
    addInteraction: (interaction: Interaction) => void;
    setCurrentJob: (job: UploadJob | null) => void;
    updateJobStatus: (status: string) => void;
    clearMessages: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            messages: [],
            interactions: [],
            currentJob: null,
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            addMessage: (message) => set((state) => ({
                messages: [...state.messages, message]
            })),
            addInteraction: (interaction) => set((state) => ({
                interactions: [interaction, ...state.interactions].slice(0, 50)
            })),
            setCurrentJob: (job) => set({ currentJob: job }),
            updateJobStatus: (status) => set((state) => ({
                currentJob: state.currentJob ? { ...state.currentJob, jobStatus: status } : null
            })),
            clearMessages: () => set({ messages: [] }),
        }),
        {
            name: 'verventech-chat-storage-v2',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);
