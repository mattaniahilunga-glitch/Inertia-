/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  bio: string;
  avatar: string;
  xp: number;
  level: number;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  dailyStreak: number;
  lastActive: string;
  balance: number; // For payments/wallet
  skills: string[];
  role: 'Client' | 'Freelancer' | 'Worker' | 'Agency';
  isGoogleUser?: boolean;
  twoFactorEnabled?: boolean;
  preferences: {
    darkMode: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
    language: string;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  duration: string;
  rewardXp: number;
  completed: boolean;
  content: string;
  interactiveType: 'playground' | 'quiz' | 'drag-drop' | 'memory';
  playgroundCode?: string;
  playgroundTask?: string;
  quiz?: QuizQuestion;
  matchPairs?: { left: string; right: string }[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  instructorAvatar: string;
  rating: number;
  xpReward: number;
  lessonsCount: number;
  progressPercent: number;
  description: string;
  benefits: string[];
  lessons: Lesson[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  budget: number;
  clientName: string;
  location: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Disputed';
  type: 'Remote' | 'Physical' | 'Contract' | 'Part-time' | 'Full-time' | 'Gig work';
  category: string;
  skillsRequired: string[];
  description: string;
  postedAt: string;
  matchedScore?: number;
}

export interface Product {
  id: string;
  title: string;
  storeName: string;
  price: number;
  currency: string;
  rating: number;
  image: string;
  lat: number;
  lng: number;
  type: 'Seller' | 'Buyer' | 'Warehouse';
  description: string;
  stock: number;
  category: string;
  locationName: string;
}

export interface PostComment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface SocialPost {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
  comments: PostComment[];
  reactions: { [emoji: string]: number };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  encrypted: boolean;
  isVoice?: boolean;
  voiceDuration?: string;
  read: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'community';
  messages: ChatMessage[];
  lastMessageAt: string;
  unreadCount: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'escrow_lock' | 'escrow_release' | 'payout' | 'purchase';
  amount: number;
  currency: string;
  status: 'Pending' | 'Completed' | 'Refunded';
  description: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: string;
}
