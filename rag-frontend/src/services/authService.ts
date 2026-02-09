import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export const authService = {
    login: async (email: string, password: string) => {
        // In a real scenario, this calls POST /login
        // For now, we simulate a successful response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    user: { id: '1', name: 'Azam Rizwan', email, avatar: '' },
                    token: 'simulated-jwt-token',
                });
            }, 1000);
        });
    },

    register: async (name: string, email: string, password: string) => {
        // Calls POST /register
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    user: { id: '1', name, email, avatar: '' },
                    token: 'simulated-jwt-token',
                });
            }, 1000);
        });
    },
};
