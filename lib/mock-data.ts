export const mockUser = {
  id: "u1",
  name: "Ahmed Al-Sayed",
  email: "ahmed@example.com",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  bio: "Frontend Developer looking to learn Backend architecture.",
  location: "Dubai, UAE"
};

export const categories = [
  "Development", "Design", "Marketing", "Language", "Music", "Business"
];

export const mockSkills = [
  {
    id: "s1",
    title: "React & Next.js Basics",
    description: "I can teach you how to build modern web applications using React and Next.js.",
    category: "Development",
    level: "Intermediate",
    user: {
      name: "Ahmed Al-Sayed",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    }
  },
  {
    id: "s2",
    title: "Conversational Spanish",
    description: "Native Spanish speaker offering conversational practice 2 hours a week.",
    category: "Language",
    level: "Advanced",
    user: {
      name: "Maria Garcia",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026702d"
    }
  },
  {
    id: "s3",
    title: "UI/UX Design for Beginners",
    description: "Learn the basics of Figma and how to create clean user interfaces.",
    category: "Design",
    level: "Beginner",
    user: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026703d"
    }
  },
  {
    id: "s4",
    title: "Digital Marketing Strategy",
    description: "Learn how to setup Facebook and Google ads effectively.",
    category: "Marketing",
    level: "Expert",
    user: {
      name: "David Smith",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026701d"
    }
  },
  {
    id: "s5",
    title: "French Conversation Practice",
    description: "Practice everyday French with a native speaker and improve your speaking confidence.",
    category: "Language",
    level: "Intermediate",
    user: {
      name: "Emma Dubois",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d"
    }
  },
  {
    id: "s6",
    title: "Guitar for Beginners",
    description: "Learn chords, strumming patterns, and simple songs to start playing guitar quickly.",
    category: "Music",
    level: "Beginner",
    user: {
      name: "Noah Patel",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d"
    }
  },
  {
    id: "s7",
    title: "Productivity with Notion",
    description: "Create workspaces, databases, and automation in Notion for personal and team productivity.",
    category: "Business",
    level: "Intermediate",
    user: {
      name: "Ana Silva",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026707d"
    }
  },
  {
    id: "s8",
    title: "Social Media Copywriting",
    description: "Write engaging posts and ads tailored for Instagram, LinkedIn, and TikTok audiences.",
    category: "Marketing",
    level: "Intermediate",
    user: {
      name: "Lena Johnson",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026708d"
    }
  }
];

export const mockMatches = [
  {
    id: "m1",
    matchedUser: {
      name: "Maria Garcia",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026702d"
    },
    theirSkill: "Conversational Spanish",
    yourSkill: "React & Next.js Basics",
    status: "Pending"
  }
];

export const mockMessages = [
  {
    id: "msg1",
    senderId: "u2",
    text: "Hi Ahmed! I would love to learn Next.js. I can teach you Spanish in exchange.",
    timestamp: "10:00 AM"
  },
  {
    id: "msg2",
    senderId: "u1",
    text: "Hey Maria! That sounds perfect. When are you free for a 30-min intro call?",
    timestamp: "10:05 AM"
  }
];
