import { create } from "zustand";
import { mockUser, mockSkills, mockMatches, mockMessages } from "./mock-data";

interface AppState {
  user: typeof mockUser | null;
  skills: typeof mockSkills;
  matches: typeof mockMatches;
  messages: typeof mockMessages;
  login: () => void;
  logout: () => void;
  sendMessage: (text: string, senderId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: mockUser, // Simulated logged in
  skills: mockSkills,
  matches: mockMatches,
  messages: mockMessages,
  login: () => set({ user: mockUser }),
  logout: () => set({ user: null }),
  sendMessage: (text, senderId) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: `msg-${Date.now()}`,
        senderId,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  }))
}));
