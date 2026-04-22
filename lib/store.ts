import { create } from "zustand";
import { mockUser, mockSkills, mockMatches, mockMessages } from "./mock-data";

interface Match {
  id: string;
  matchedUser: {
    name: string;
    avatar: string;
  };
  theirSkill: string;
  yourSkill: string;
  status: string;
}

interface AppState {
  user: typeof mockUser | null;
  skills: typeof mockSkills;
  matches: typeof mockMatches;
  messages: typeof mockMessages;
  login: () => void;
  logout: () => void;
  sendMessage: (text: string, senderId: string) => void;
  updateAvatar: (avatarUrl: string) => void;
  requestSkillSwap: (skillTitle: string, skillOwnerName: string, skillOwnerAvatar?: string) => void;
  addSkill: (skill: Omit<typeof mockSkills[0], 'id' | 'user'>) => void;
  editSkill: (skillId: string, updates: Partial<Omit<typeof mockSkills[0], 'id' | 'user'>>) => void;
  deleteSkill: (skillId: string) => void;
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
  })),
  updateAvatar: (avatarUrl) => set((state) => ({
    user: state.user ? { ...state.user, avatar: avatarUrl } : null
  })),
  requestSkillSwap: (skillTitle, skillOwnerName, skillOwnerAvatar) => set((state) => {
    if (!state.user) return { ...state };

    // Check if match already exists
    const existingMatch = state.matches.find(
      m => m.matchedUser.name === skillOwnerName
    );

    let updatedMatches = state.matches;
    if (!existingMatch) {
      const newMatch: Match = {
        id: `m-${Date.now()}`,
        matchedUser: {
          name: skillOwnerName,
          avatar: skillOwnerAvatar ?? ""
        },
        theirSkill: skillTitle,
        yourSkill: "Your Skills",
        status: "Pending"
      };
      updatedMatches = [...state.matches, newMatch];
    }

    // Send initial message from the other user (simulating their response)
    const initialMessage = {
      id: `msg-${Date.now()}`,
      senderId: `u-${skillOwnerName.replace(/\s+/g, '-')}`,
      text: `Hi ${state.user.name}! I saw your interest in learning ${skillTitle}. I'd love to help! What skill would you like to teach me in exchange?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    return {
      matches: updatedMatches,
      messages: [...state.messages, initialMessage]
    };
  }),
  addSkill: (skillData) => set((state) => {
    if (!state.user) return { ...state };

    const newSkill = {
      id: `s-${Date.now()}`,
      ...skillData,
      user: {
        name: state.user.name,
        avatar: state.user.avatar
      }
    };

    return {
      skills: [...state.skills, newSkill]
    };
  }),
  editSkill: (skillId, updates) => set((state) => ({
    skills: state.skills.map(skill =>
      skill.id === skillId ? { ...skill, ...updates } : skill
    )
  })),
  deleteSkill: (skillId) => set((state) => ({
    skills: state.skills.filter(skill => skill.id !== skillId)
  }))
}));
