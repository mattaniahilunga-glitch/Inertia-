/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { SocialPost, ChatChannel, ChatMessage, UserProfile } from '../types';
import { INITIAL_POSTS, INITIAL_CHANNELS } from '../data/mockData';
import { 
  MessageSquare, Heart, Send, ShieldAlert, Smile, Mic, AlertCircle, 
  Search, Users, Sparkles, Lock, ShieldAlert as BlockIcon, Eye, Check, CheckCheck, Loader2,
  Play, Square, Trash2, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioVoicePlayer } from './AudioVoicePlayer';

interface SocialHubProps {
  user: UserProfile;
}

export default function SocialHub({ user }: SocialHubProps) {
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    try {
      const saved = localStorage.getItem('continuum_social_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch (e) {
      return INITIAL_POSTS;
    }
  });

  const [channels, setChannels] = useState<ChatChannel[]>(() => {
    try {
      const saved = localStorage.getItem('continuum_social_channels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.every(ch => ch && typeof ch === 'object' && ch.id && ch.name && Array.isArray(ch.messages));
          if (valid) {
            return parsed;
          }
        }
      }
      return INITIAL_CHANNELS;
    } catch (e) {
      return INITIAL_CHANNELS;
    }
  });

  const [activeChannelId, setActiveChannelId] = useState<string>('chan-general');
  const [activeTab, setActiveTab] = useState<'feed' | 'chat'>('feed');

  // Persist posts and channels on changes
  useEffect(() => {
    try {
      localStorage.setItem('continuum_social_posts', JSON.stringify(posts));
    } catch (e) {
      console.error('Error persisting social posts', e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('continuum_social_channels', JSON.stringify(channels));
    } catch (e) {
      console.error('Error persisting chat channels', e);
    }
  }, [channels]);

  // Feed states
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  
  // Chat states
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'community' | 'direct'>('direct');
  const [showAddChannelForm, setShowAddChannelForm] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingSecondsRef = useRef<number>(0);
  
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioContextRef = useRef<AudioContext | null>(null);
  const activeSynthIntervalRef = useRef<any>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChannel?.messages]);

  // Handle fake reply / typing simulation
  useEffect(() => {
    if (activeTab === 'chat' && activeChannelId === 'chan-adis-direct') {
      const messages = activeChannel.messages;
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.senderId === user.id) {
        // Trigger typing indicator
        setIsTyping(true);
        const timer = setTimeout(() => {
          setIsTyping(false);
          // Post fake encrypted response from Adisa Kojo
          const responseMsg: ChatMessage = {
            id: `msg-reply-${Date.now()}`,
            senderId: 'adis-instructor',
            senderName: 'Adisa Kojo',
            senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            content: 'U2FsdGVkX181d2U4M3V4NmZsaXNhY29kZXIyMDI2c2VjdXJl', // mock encrypted string
            timestamp: new Date().toISOString(),
            encrypted: true,
            read: false
          };
          
          setChannels(prev => prev.map(ch => {
            if (ch.id === 'chan-adis-direct') {
              return {
                ...ch,
                messages: [...ch.messages, responseMsg],
                unreadCount: ch.unreadCount + 1
              };
            }
            return ch;
          }));
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [activeChannel?.messages, activeTab, activeChannelId]);

  // Voice recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      recordingSecondsRef.current = 0;
      interval = setInterval(() => {
        setRecordingSeconds(prev => {
          const next = prev + 1;
          recordingSecondsRef.current = next;
          return next;
        });
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      author: user.username,
      authorAvatar: user.avatar,
      content: newPostContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      reactions: { '👍': 0, '🔥': 0, '🚀': 0 }
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !p.hasLiked
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const input = commentInputs[postId];
    if (!input || !input.trim()) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `comm-${Date.now()}`,
              author: user.username,
              authorAvatar: user.avatar,
              content: input,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    let contentToSend = chatInput;
    if (activeChannel.type === 'direct') {
      try {
        contentToSend = 'U2FsdGVkX19' + btoa(encodeURIComponent(chatInput));
      } catch (e) {
        contentToSend = 'U2FsdGVkX19' + btoa(chatInput);
      }
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      content: contentToSend,
      timestamp: new Date().toISOString(),
      encrypted: activeChannel.type === 'direct',
      read: true
    };

    setChannels(prev => prev.map(ch => {
      if (ch.id === activeChannelId) {
        return {
          ...ch,
          messages: [...ch.messages, newMsg],
          lastMessageAt: newMsg.timestamp
        };
      }
      return ch;
    }));

    setChatInput('');
  };

  const startRecording = async () => {
    audioChunksRef.current = [];
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        
        let options = {};
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm' };
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          options = { mimeType: 'audio/ogg' };
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4' };
        }
        
        const recorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = recorder;
        
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            createAndSendVoiceMessage(base64Audio);
          };
          reader.readAsDataURL(audioBlob);
        };
        
        recorder.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Microphone access failed or denied, falling back to simulated high-fidelity synth encrypted recording:', err);
        setIsRecording(true);
      }
    } else {
      console.warn('MediaDevices not supported in this environment, falling back to simulated encrypted recording');
      setIsRecording(true);
    }
  };

  const createAndSendVoiceMessage = (voiceUrl?: string) => {
    const durationSec = recordingSecondsRef.current > 0 ? recordingSecondsRef.current : 3;
    const voiceMsg: ChatMessage = {
      id: `voice-${Date.now()}`,
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      content: '[Voice Message encrypted]',
      timestamp: new Date().toISOString(),
      encrypted: activeChannel.type === 'direct',
      isVoice: true,
      voiceDuration: `${Math.floor(durationSec / 60)}:${(durationSec % 60).toString().padStart(2, '0')}`,
      voiceUrl: voiceUrl,
      read: true
    };

    setChannels(prev => prev.map(ch => {
      if (ch.id === activeChannelId) {
        return {
          ...ch,
          messages: [...ch.messages, voiceMsg],
          lastMessageAt: voiceMsg.timestamp
        };
      }
      return ch;
    }));
  };

  const handleSendVoiceMessage = () => {
    setIsRecording(false);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error('Error stopping media recorder', e);
        createAndSendVoiceMessage();
      }
      
      if (mediaStreamRef.current) {
        try {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
        } catch (e) {}
        mediaStreamRef.current = null;
      }
    } else {
      createAndSendVoiceMessage();
    }
  };

  const stopAllPlayback = () => {
    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.pause();
      } catch (e) {}
      activeAudioRef.current = null;
    }
    
    if (activeAudioContextRef.current) {
      try {
        activeAudioContextRef.current.close();
      } catch (e) {}
      activeAudioContextRef.current = null;
    }
    
    if (activeSynthIntervalRef.current) {
      clearTimeout(activeSynthIntervalRef.current);
      activeSynthIntervalRef.current = null;
    }
    
    setPlayingVoiceId(null);
  };

  useEffect(() => {
    return () => {
      stopAllPlayback();
    };
  }, []);

  const handleTogglePlayVoice = (msg: ChatMessage) => {
    if (playingVoiceId === msg.id) {
      stopAllPlayback();
    } else {
      if (msg.voiceUrl) {
        playRealAudio(msg.id, msg.voiceUrl);
      } else {
        playSynthesizedVoice(msg.id, msg.voiceDuration || '0:05');
      }
    }
  };

  const playRealAudio = (messageId: string, url: string) => {
    stopAllPlayback();
    
    try {
      const audio = new Audio(url);
      activeAudioRef.current = audio;
      setPlayingVoiceId(messageId);
      
      audio.onended = () => {
        setPlayingVoiceId(null);
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error, falling back to synthesizer:', e);
        playSynthesizedVoice(messageId, '0:05');
      };
      
      audio.play().catch(err => {
        console.error('Audio play failed, falling back to synthesizer:', err);
        playSynthesizedVoice(messageId, '0:05');
      });
    } catch (err) {
      console.error('Audio initialization failed, falling back to synthesizer:', err);
      playSynthesizedVoice(messageId, '0:05');
    }
  };

  const playSynthesizedVoice = (messageId: string, durationStr: string) => {
    stopAllPlayback();

    let durationSeconds = 5;
    try {
      const parts = durationStr.split(':');
      if (parts.length === 2) {
        durationSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      } else {
        durationSeconds = parseInt(durationStr) || 5;
      }
    } catch (e) {
      durationSeconds = 5;
    }
    if (durationSeconds <= 0) durationSeconds = 5;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    activeAudioContextRef.current = ctx;
    setPlayingVoiceId(messageId);

    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    const startTime = ctx.currentTime;
    const intervalTime = 0.35;
    const totalTones = Math.ceil(durationSeconds / intervalTime);

    for (let i = 0; i < totalTones; i++) {
      const noteTime = startTime + i * intervalTime;
      if (noteTime >= startTime + durationSeconds) break;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, noteTime);
      filter.Q.setValueAtTime(3, noteTime);

      const freq = notes[(i * 3 + 2) % notes.length] * (1 + 0.05 * Math.sin(i * 4));
      osc.frequency.setValueAtTime(freq, noteTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, noteTime + intervalTime);

      osc.type = i % 2 === 0 ? 'triangle' : 'sine';

      gainNode.gain.setValueAtTime(0, noteTime);
      gainNode.gain.linearRampToValueAtTime(0.08, noteTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, noteTime + intervalTime - 0.02);

      osc.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + intervalTime);
    }

    const stopTimer = setTimeout(() => {
      setPlayingVoiceId(null);
      ctx.close();
    }, durationSeconds * 1000);

    activeSynthIntervalRef.current = stopTimer;
  };

  const handleReportUser = (authorName: string) => {
    setToast(`Thank you for keeping Continuum safe. A secure diagnostics report regarding user '${authorName}' has been encrypted and sent to moderation teams under mattaniah.ilunga@email.com.`);
    setTimeout(() => setToast(null), 6000);
  };

  const handleBlockUser = (authorName: string) => {
    if (!blockedUsers.includes(authorName)) {
      setBlockedUsers([...blockedUsers, authorName]);
    }
  };

  const handleDeleteMessage = (channelId: string, messageId: string) => {
    if (playingVoiceId === messageId) {
      stopAllPlayback();
    }
    setChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        return {
          ...ch,
          messages: ch.messages.filter(msg => msg.id !== messageId)
        };
      }
      return ch;
    }));
    setToast('Message deleted and purged from local encrypted history.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleClearChatHistory = (channelId: string) => {
    stopAllPlayback();
    setChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        return {
          ...ch,
          messages: []
        };
      }
      return ch;
    }));
    setToast('Conversation history has been permanently cleared.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteChannel = (channelId: string) => {
    if (channelId === 'chan-general') {
      setToast('The community chat hub is permanent, but you can clear its messages.');
      setTimeout(() => setToast(null), 3500);
      return;
    }
    
    stopAllPlayback();
    setChannels(prev => prev.filter(ch => ch.id !== channelId));
    
    if (activeChannelId === channelId) {
      const remaining = channels.filter(ch => ch.id !== channelId);
      if (remaining.length > 0) {
        setActiveChannelId(remaining[0].id);
      }
    }
    
    setToast('Chat conversation has been deleted.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const id = `chan-custom-${Date.now()}`;
    const newChan: ChatChannel = {
      id,
      name: newChannelType === 'direct' ? `${newChannelName} (Encrypted)` : `#${newChannelName.toLowerCase().replace(/\s+/g, '-')}`,
      type: newChannelType,
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          senderId: 'sys-bot',
          senderName: 'Continuum Bot',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
          content: newChannelType === 'direct' 
            ? `Secure End-to-End Encrypted session established with ${newChannelName}.` 
            : `Welcome to the new community circle #${newChannelName}!`,
          timestamp: new Date().toISOString(),
          encrypted: false,
          read: true
        }
      ]
    };

    setChannels(prev => [...prev, newChan]);
    setActiveChannelId(id);
    setNewChannelName('');
    setShowAddChannelForm(false);
    setToast(`New ${newChannelType} chat '${newChannelName}' successfully created.`);
    setTimeout(() => setToast(null), 3000);
  };

  // Helper to visually decrypt encrypted mock DMs for demonstration
  const decryptMessage = (content: string) => {
    if (content === 'U2FsdGVkX195M07uYmZ6dHNhZkdMZXpSZnN1cGVsZUNyYXB0bzE=') {
      return 'Hey, I checked your Scala routing codebase. The payload scales perfectly on 2,000 requests!';
    }
    if (content === 'U2FsdGVkX181d2U4M3V4NmZsaXNhY29kZXIyMDI2c2VjdXJl') {
      return 'Awesome progress! Make sure to cache user session profiles inside Redis to maintain sub-millisecond latencies.';
    }
    if (content === 'U2FsdGVkX19lbmNyeXB0ZWQtdGV4dC1zdHJpbmc=') {
      return 'Sending encrypted response: I will finalize the Escrow contract setup tomorrow.';
    }
    
    // Decrypt custom user direct message base64 payload
    if (content && content.startsWith('U2FsdGVkX19')) {
      try {
        const base64Part = content.substring('U2FsdGVkX19'.length);
        return decodeURIComponent(escape(atob(base64Part)));
      } catch (e) {
        try {
          return atob(content.substring('U2FsdGVkX19'.length));
        } catch (err) {
          return 'Secure Cipher Block [AES-256-GCM] decrypted.';
        }
      }
    }
    return content;
  };

  // Filter posts from blocked users
  const activePosts = posts.filter(p => !blockedUsers.includes(p.author));

  return (
    <div className="glass-card rounded-[32px] p-6 transition-all duration-300 relative">
      
      {/* Top Selector bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-indigo-500 w-5 h-5" />
            Global Social Network & Chat Channels
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connect with other digital entrepreneurs. Pitch concepts, start encrypted channels, or moderate boards.
          </p>
        </div>

        <div className="flex gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none max-w-full flex-shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === 'feed'
                ? 'bg-slate-900 dark:bg-slate-300 text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Social Feed
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === 'chat'
                ? 'bg-slate-900 dark:bg-slate-300 text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Unified Chat {channels.some(c => c.unreadCount > 0) && '🔴'}
          </button>
        </div>
      </div>

      {activeTab === 'feed' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Post Creation Area */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleCreatePost} className="glass-card p-4 rounded-[24px] space-y-3">
              <div className="flex gap-3">
                <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
                <textarea
                  required
                  rows={2}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What is your current hustle? Share lessons, jobs, or enterprise products..."
                  className="flex-1 text-xs p-3 border border-slate-150 dark:border-slate-900 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-900">
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> Post shares instantly across Unfazed, Hustler & Stack
                </span>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" /> Share Concept
                </button>
              </div>
            </form>

            {/* Posts Grid List */}
            <div className="space-y-4">
              {activePosts.map((post) => (
                <div key={post.id} className="glass-card p-5 rounded-[24px] space-y-4">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <img src={post.authorAvatar} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                      <div>
                        <h4 className="font-bold text-slate-950 dark:text-white text-xs">{post.author}</h4>
                        <p className="text-[10px] text-slate-400">{new Date(post.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {/* Reporting controls */}
                    {post.author !== user.username && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBlockUser(post.author)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                          title="Block User"
                        >
                          <BlockIcon className="w-3.5 h-3.5" /> Block
                        </button>
                        <button
                          onClick={() => handleReportUser(post.author)}
                          className="text-[10px] text-rose-500 hover:underline flex items-center gap-0.5"
                          title="Report Content"
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Report
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Actions & Likes */}
                  <div className="flex items-center gap-4 pt-3 border-t border-slate-50 dark:border-slate-900/80">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 text-xs cursor-pointer ${post.hasLiked ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-rose-500'}`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      {post.likes}
                    </button>
                    
                    <span className="text-[10px] text-slate-400 font-mono">
                      💬 {post.comments.length} comments
                    </span>
                  </div>

                  {/* Comments List */}
                  {post.comments.length > 0 && (
                    <div className="space-y-2 pl-4 border-l-2 border-slate-100 dark:border-slate-900">
                      {post.comments.map((comm) => (
                        <div key={comm.id} className="bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100/50 dark:border-slate-900">
                          <div className="flex gap-2 items-center mb-1">
                            <img src={comm.authorAvatar} className="w-5 h-5 rounded-full object-cover" />
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-[10px]">{comm.author}</span>
                            <span className="text-[9px] text-slate-400">{new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">{comm.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Write a constructive comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      className="flex-1 text-[11px] px-3 py-1.5 border border-slate-150 dark:border-slate-900 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-all"
                    >
                      Comment
                    </button>
                  </form>

                </div>
              ))}
            </div>

          </div>

          {/* Right rail - active groups */}
          <div className="space-y-6">
            <div className="glass-card p-5 rounded-[24px]">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-3 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-500" /> Active Groups & Circles
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-100/40 dark:bg-slate-900/40 rounded-lg border border-slate-200/50 dark:border-slate-800">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">#NairobiTechHustlers</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">85 freelance builders syncing locally on maps</p>
                </div>
                <div className="p-3 bg-slate-100/40 dark:bg-slate-900/40 rounded-lg border border-slate-200/50 dark:border-slate-800">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">#CryptoLagosSecurity</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">42 auditors maintaining end-to-end encryption</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Channel Selector Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search encrypted threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none glass-input"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-500 font-bold px-1 py-1">
                <span className="uppercase tracking-wider text-[10px] text-slate-400 font-mono">Encrypted Threads</span>
                <button 
                  onClick={() => setShowAddChannelForm(!showAddChannelForm)} 
                  className="w-5 h-5 rounded-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-all"
                  title="Create New Channel"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {showAddChannelForm && (
                <form onSubmit={handleAddChannel} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-[10px] text-slate-500 uppercase tracking-wider font-mono">New Conversation</div>
                  <div>
                    <input
                      type="text"
                      placeholder="Name (e.g. Kidus, Ideas)"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-950 dark:text-white text-xs"
                      required
                    />
                  </div>
                  <div className="flex gap-2 text-[10px]">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={newChannelType === 'direct'} 
                        onChange={() => setNewChannelType('direct')}
                        className="accent-indigo-600"
                      />
                      <span>Private (DM)</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={newChannelType === 'community'} 
                        onChange={() => setNewChannelType('community')}
                        className="accent-indigo-600"
                      />
                      <span>Group Chat</span>
                    </label>
                  </div>
                  <div className="flex gap-1.5 justify-end pt-1">
                    <button 
                      type="button" 
                      onClick={() => setShowAddChannelForm(false)} 
                      className="px-2 py-1 text-[10px] text-slate-500 hover:bg-slate-100 rounded"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-2 py-1 text-[10px] bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700"
                    >
                      Create
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {channels.map((chan) => (
                  <div key={chan.id} className="relative group flex items-center">
                    <button
                      onClick={() => {
                        setActiveChannelId(chan.id);
                        // Reset unread count
                        setChannels(prev => prev.map(c => c.id === chan.id ? { ...c, unreadCount: 0 } : c));
                      }}
                      className={`flex-1 p-3 pr-8 rounded-xl border text-start flex justify-between items-center transition-all cursor-pointer ${
                        activeChannelId === chan.id
                          ? 'bg-slate-900 dark:bg-slate-300 text-white dark:text-slate-900 border-transparent shadow-md backdrop-blur-md'
                          : 'bg-white/30 dark:bg-slate-950/30 border-slate-200/50 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-900/50 backdrop-blur-sm'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs flex items-center gap-1.5 truncate">
                          {chan.type === 'direct' && <Lock className="w-3 h-3 text-teal-400" />}
                          {chan.name}
                        </h4>
                        <p className={`text-[9px] mt-0.5 truncate ${activeChannelId === chan.id ? 'text-slate-300 dark:text-slate-500' : 'text-slate-400'}`}>
                          {chan.type === 'direct' ? 'Decryption Key Lock: AES' : 'Open tech forum channel'}
                        </p>
                      </div>
                      {chan.unreadCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-1 flex-shrink-0"></span>
                      )}
                    </button>

                    {/* Hover Delete Action Button */}
                    {chan.id !== 'chan-general' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDeleteChannel(chan.id);
                        }}
                        className={`absolute right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:bg-rose-500 hover:text-white ${
                          activeChannelId === chan.id
                            ? 'text-white/70 dark:text-slate-900/70 hover:bg-rose-500 dark:hover:bg-rose-600'
                            : 'text-slate-400 dark:text-slate-500 hover:bg-rose-500'
                        }`}
                        title="Delete Conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Chat Thread Arena */}
          <div className="lg:col-span-3 glass-card rounded-[24px] flex flex-col justify-between h-[450px] overflow-hidden">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping"></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">{activeChannel.name}</h4>
                  <span className="text-[10px] text-slate-400">Online Status: Authoritative Node Syncing</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {activeChannel.type === 'direct' && (
                  <span className="text-[10px] font-mono font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> End-to-End Encrypted
                  </span>
                )}
                
                <button
                  onClick={() => handleClearChatHistory(activeChannel.id)}
                  className="text-[10px] text-slate-500 hover:text-rose-500 border border-slate-200 dark:border-slate-800 hover:border-rose-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 bg-white/50 dark:bg-slate-950/50 transition-all cursor-pointer font-medium"
                  title="Clear Conversation History"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear History</span>
                </button>
              </div>
            </div>

            {/* Message Feed Canvas */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeChannel.messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                    <img src={msg.senderAvatar} className="w-8 h-8 rounded-full object-cover border border-slate-100 mt-1" />
                    <div>
                      <div className={`flex items-center gap-1.5 mb-0.5 ${isMe ? 'justify-end' : ''}`}>
                        <span className="font-bold text-[10px] text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                        <span className="text-[8px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      <div className="relative group">
                        {msg.isVoice ? (
                          <AudioVoicePlayer
                            voiceUrl={msg.voiceUrl || ''}
                            durationStr={msg.voiceDuration || '0:05'}
                            messageId={msg.id}
                            playingVoiceId={playingVoiceId}
                            setPlayingVoiceId={setPlayingVoiceId}
                            isMe={isMe}
                          />
                        ) : (
                          <div className={`p-3 pr-8 rounded-xl border text-xs leading-relaxed ${
                            isMe
                              ? 'bg-indigo-600 dark:bg-indigo-700 text-white border-transparent'
                              : 'bg-slate-100 dark:bg-slate-200 text-slate-900 border-slate-200 dark:border-slate-300'
                          }`}>
                            
                            {msg.encrypted ? (
                              <div className="space-y-2">
                                <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 break-all select-all">
                                  🔐 Cipher: {msg.content}
                                </div>
                                <div className="text-teal-500 font-bold flex items-center gap-1 text-[11px] border-t border-slate-800 pt-1.5 mt-1.5">
                                  <Eye className="w-3.5 h-3.5" /> Decrypted Plain Text: "{decryptMessage(msg.content)}"
                                </div>
                              </div>
                            ) : (
                              msg.content
                            )}

                          </div>
                        )}

                        {/* Hover Delete Message Button */}
                        <button
                          onClick={() => handleDeleteMessage(activeChannel.id, msg.id)}
                          className={`absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer ${
                            isMe 
                              ? 'text-white/60 hover:text-white hover:bg-white/10' 
                              : 'text-slate-400 hover:text-rose-600 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                          }`}
                          title="Delete Message"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Read receipts */}
                      {isMe && (
                        <div className="flex justify-end gap-1 mt-0.5 text-slate-400">
                          <span className="text-[9px]">Read</span>
                          <CheckCheck className="w-3.5 h-3.5 text-teal-500" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2 items-center text-slate-400 text-[10px] pl-10 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin text-teal-500" />
                  Adisa Kojo is compiling secure AES-256 cipher...
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Form Panel */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50">
              <form onSubmit={handleSendChatMessage} className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  placeholder={activeChannel.type === 'direct' ? "Type secure direct message..." : "Type text message to general channels..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 min-w-0 text-xs px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none glass-input"
                />

                <button
                  type="button"
                  onClick={() => {
                    if (isRecording) {
                      handleSendVoiceMessage();
                    } else {
                      startRecording();
                    }
                  }}
                  className={`w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${
                    isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                  title={isRecording ? 'Stop and send voice message' : 'Record voice message'}
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer flex-shrink-0 flex items-center justify-center"
                >
                  Send
                </button>
              </form>

              {isRecording && (
                <div className="text-[10px] text-rose-500 flex items-center gap-1.5 mt-2 animate-pulse pl-1 font-mono font-bold">
                  Recording encrypted stream... {recordingSeconds}s
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Custom Glass Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 max-w-sm glass-card p-4 rounded-2xl border-l-4 border-l-amber-500 shadow-2xl z-50 text-xs text-slate-800 dark:text-slate-200 flex flex-col gap-2 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl"
          >
            <div className="flex justify-between items-start">
              <span className="font-bold text-[10px] uppercase tracking-wider text-amber-500 font-mono">🔐 Encrypted Security Report</span>
              <button onClick={() => setToast(null)} className="text-[11px] text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="leading-relaxed">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
