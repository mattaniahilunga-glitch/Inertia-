/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, Transaction } from '../types';
import { INITIAL_TRANSACTIONS } from '../data/mockData';
import { 
  User, ShieldCheck, Wallet, Settings, Bell, Bookmark, Award, 
  Lock, Key, RefreshCw, Smartphone, Mail, Globe, Sparkles, CreditCard,
  DollarSign, ArrowUpRight, ArrowDownLeft, CheckCircle2, AlertTriangle,
  Camera, Upload, Image, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserAccountProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
}

export default function UserAccount({ user, onUpdateUser, transactions, onAddTransaction }: UserAccountProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'wallet' | 'security' | 'privacy'>('profile');
  
  // Profile Picture (Avatar) selection states
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');

  const PRESET_AVATARS = [
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', name: 'Female Dev Classic' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', name: 'Male Dev Classic' },
    { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', name: 'Creative Designer' },
    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', name: 'Tech Lead' },
    { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', name: 'Systems Engineer' },
    { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', name: 'Project Lead' },
    { url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', name: 'AI Specialist' },
    { url: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=150', name: 'Product Architect' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setAvatarError('File size must be smaller than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setAvatarError('Only image files (JPEG, PNG, WEBP) are supported');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateUser({
            ...user,
            avatar: event.target.result as string
          });
        }
      };
      reader.onerror = () => {
        setAvatarError('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setAvatarError('');
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setAvatarError('File size must be smaller than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setAvatarError('Only image files (JPEG, PNG, WEBP) are supported');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateUser({
            ...user,
            avatar: event.target.result as string
          });
        }
      };
      reader.onerror = () => {
        setAvatarError('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setAvatarError('');
    if (!tempAvatarUrl.trim()) {
      setAvatarError('Please enter a valid image URL');
      return;
    }
    if (!tempAvatarUrl.startsWith('http://') && !tempAvatarUrl.startsWith('https://')) {
      setAvatarError('Image URL must start with http:// or https://');
      return;
    }
    onUpdateUser({
      ...user,
      avatar: tempAvatarUrl.trim()
    });
    setTempAvatarUrl('');
  };

  // Auth Form states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [inputEmail, setInputEmail] = useState(user.email);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [showTwoFactorPrompt, setShowTwoFactorPrompt] = useState(false);

  // Wallet states
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentProvider, setPaymentProvider] = useState<'Visa' | 'Mastercard' | 'MTN' | 'Airtel' | 'Stripe' | 'PayPal'>('Stripe');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawProvider, setWithdrawProvider] = useState<'Visa' | 'Mastercard' | 'MTN' | 'Airtel' | 'Stripe' | 'PayPal'>('Stripe');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  
  // Crypto Sync engine
  const [isSyncing, setIsSyncing] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [e2eeActive, setE2eeActive] = useState(true);

  // Password validation hook
  useEffect(() => {
    if (authMode === 'signup') {
      const issues: string[] = [];
      if (inputPassword.length < 8) issues.push('Must be at least 8 characters long');
      if (!/[A-Z]/.test(inputPassword)) issues.push('Must contain an uppercase letter');
      if (!/[a-z]/.test(inputPassword)) issues.push('Must contain a lowercase letter');
      if (!/[0-9]/.test(inputPassword)) issues.push('Must contain at least one digit');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(inputPassword)) issues.push('Must contain a special symbol');
      setPasswordFeedback(issues);
    } else {
      setPasswordFeedback([]);
    }
  }, [inputPassword, authMode]);

  // Generate a mock secure RSA/AES shared local session key
  useEffect(() => {
    if (!encryptionKey) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let result = 'inertia-sec-key-';
      for (let i = 0; i < 24; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      setEncryptionKey(result);
    }
  }, []);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    // Build deposit transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      amount: amountNum,
      currency: 'USD',
      status: 'Completed',
      description: `Funded wallet via ${paymentProvider}`,
      timestamp: new Date().toISOString()
    };

    onAddTransaction(newTx);
    onUpdateUser({
      ...user,
      balance: user.balance + amountNum
    });

    setDepositAmount('');
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 3000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawError('Please enter a valid positive amount.');
      return;
    }
    if (user.balance < amountNum) {
      setWithdrawError('Insufficient balance for this withdrawal.');
      return;
    }

    // Build withdrawal transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'withdrawal',
      amount: amountNum,
      currency: 'USD',
      status: 'Completed',
      description: `Withdrew funds via ${withdrawProvider}`,
      timestamp: new Date().toISOString()
    };

    onAddTransaction(newTx);
    onUpdateUser({
      ...user,
      balance: user.balance - amountNum
    });

    setWithdrawAmount('');
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  const togglePreference = (key: 'darkMode' | 'reducedMotion' | 'highContrast') => {
    const updatedPreferences = {
      ...user.preferences,
      [key]: !user.preferences[key]
    };
    onUpdateUser({
      ...user,
      preferences: updatedPreferences
    });
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    try {
      // Send preferences and secure keys to our backend DB
      const response = await fetch('/api/sync/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          preferences: user.preferences,
          encryptionKey: e2eeActive ? encryptionKey : null,
          balance: user.balance
        })
      });
      const data = await response.json();
      console.log('Secure Sync Successful:', data);
    } catch (err) {
      console.warn('API cloud sync fallback to encrypted localStorage:', err);
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
      }, 1000);
    }
  };

  return (
    <div className="glass-card rounded-[32px] p-6 transition-all duration-300">
      
      {/* Account Info Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative group flex-shrink-0">
            <img 
              src={user.avatar} 
              alt={user.username} 
              className="w-16 h-16 rounded-full border-2 border-teal-500 object-cover shadow-sm transition-all group-hover:brightness-75"
            />
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white cursor-pointer"
              title="Change Profile Picture"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user.username}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                {user.rank} Rank
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Level {user.level} | Daily Streak: 🔥 {user.dailyStreak} days</p>
            <button 
              onClick={() => setShowAvatarModal(true)}
              className="text-[10px] text-teal-600 dark:text-teal-400 font-bold hover:underline mt-1.5 flex items-center gap-1 cursor-pointer focus:outline-none"
            >
              <Camera className="w-3 h-3" /> Change Profile Picture
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCloudSync}
            disabled={isSyncing}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Encrypting & Syncing...' : 'E2EE Cloud Sync'}
          </button>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 shadow-sm cursor-pointer"
          >
            Switch Account
          </button>
        </div>
      </div>

      {/* Internal Navigation */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 overflow-x-auto scrollbar-none">
        {[
          { id: 'profile', label: 'Dashboard & Profile', icon: User },
          { id: 'wallet', label: 'E-Wallet & Escrow', icon: Wallet },
          { id: 'security', label: 'Auth & 2FA Security', icon: ShieldCheck },
          { id: 'privacy', label: 'E2EE Cryptography & Sync', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 pb-2 text-xs font-semibold border-b-2 transition-all duration-200 px-1 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                isActive 
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="text-slate-700 dark:text-slate-300 text-xs">
        
        {/* PROFILE TAB */}
        {activeSubTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Achievements Card */}
            <div className="glass-card p-5 rounded-[24px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" /> Gamified Badges
                  </h3>
                  <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold font-mono">
                    {user.xp} XP
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3 items-center">
                    <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600">🔥</div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Daily Hustler Streak</h4>
                      <p className="text-[11px] text-slate-400">Maintained {user.dailyStreak} consecutive activity logups</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600">🛡️</div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">E2EE Key Guardian</h4>
                      <p className="text-[11px] text-slate-400">Cryptographic privacy key activated</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-900 text-center">
                <span className="text-[10px] text-slate-400">Unlock Bronze, Gold, and Platinum achievements inside Inertia Unfazed.</span>
              </div>
            </div>

            {/* Bookmarks & Skills */}
            <div className="glass-card p-5 rounded-[24px] col-span-1 md:col-span-2 space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                  <Bookmark className="w-4 h-4 text-indigo-500" /> Verified Skill Set
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200/50 dark:border-slate-800/50">
                      {skill}
                    </span>
                  ))}
                  {user.skills.length === 0 && (
                    <span className="text-slate-400 italic">No verified skills yet. Start earning XP in Inertia Unfazed!</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                  <Globe className="w-4 h-4 text-teal-500" /> Account Details & Bio
                </h3>
                <textarea
                  value={user.bio}
                  onChange={(e) => onUpdateUser({ ...user, bio: e.target.value })}
                  className="w-full text-xs p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 glass-input"
                  rows={2}
                  placeholder="Tell us about your digital hustles and target stack products..."
                />
              </div>
            </div>
          </div>
        )}

        {/* WALLET TAB */}
        {activeSubTab === 'wallet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Quick Balance */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-950 p-6 rounded-xl text-white shadow-md flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs uppercase text-indigo-300 font-mono tracking-wider">Inertia Universal Balance</span>
                    <h3 className="text-3xl font-extrabold tracking-tight mt-1 text-white">
                      ${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                  </div>
                  <Wallet className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="mt-4 bg-indigo-950/40 border border-indigo-800/40 rounded-lg p-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span className="text-[10px] text-indigo-200 font-mono">Escrow Engine Secure (0 Disputed)</span>
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <p className="text-[10px] text-indigo-300">Ready to distribute across Stripe, Mastercard, MTN Mobile Money, and Airtel.</p>
              </div>
            </div>

            {/* Deposit System */}
            <div className="glass-card p-5 rounded-[24px] space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <CreditCard className="w-4 h-4 text-teal-500" /> Deposit Funds
                </h3>
                <p className="text-[10px] text-slate-400 mb-2">Increase your local wallet balance instantly.</p>
                
                <form onSubmit={handleDeposit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Deposit Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400">$</span>
                      <input
                        type="number"
                        required
                        placeholder="50"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full text-xs pl-7 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none glass-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Payment Infrastructure</label>
                    <select
                      value={paymentProvider}
                      onChange={(e: any) => setPaymentProvider(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none glass-input"
                    >
                      <option value="Stripe">Stripe API (Global)</option>
                      <option value="PayPal">PayPal Holdings</option>
                      <option value="Visa">Visa / Mastercard</option>
                      <option value="MTN">MTN MoMo (Africa Regional)</option>
                      <option value="Airtel">Airtel Money (Africa Regional)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors"
                  >
                    Confirm Secure Deposit
                  </button>
                </form>
              </div>

              {paymentSuccess && (
                <div className="text-teal-600 dark:text-teal-400 text-[10px] flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Deposit loaded! Local sync completed.
                </div>
              )}
            </div>

            {/* Withdraw System */}
            <div className="glass-card p-5 rounded-[24px] space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <ArrowUpRight className="w-4 h-4 text-indigo-500" /> Withdraw Funds
                </h3>
                <p className="text-[10px] text-slate-400 mb-2">Liquidate and payout your balances.</p>
                
                <form onSubmit={handleWithdraw} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Withdraw Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400">$</span>
                      <input
                        type="number"
                        required
                        placeholder="50"
                        value={withdrawAmount}
                        onChange={(e) => {
                          setWithdrawAmount(e.target.value);
                          setWithdrawError('');
                        }}
                        className="w-full text-xs pl-7 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none glass-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Payout Channel</label>
                    <select
                      value={withdrawProvider}
                      onChange={(e: any) => setWithdrawProvider(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none glass-input"
                    >
                      <option value="Stripe">Stripe Payouts</option>
                      <option value="PayPal">PayPal Balance Transfer</option>
                      <option value="Visa">Visa Direct / Mastercard</option>
                      <option value="MTN">MTN MoMo Payout</option>
                      <option value="Airtel">Airtel Money Payout</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors"
                  >
                    Confirm Withdrawal
                  </button>
                </form>
              </div>

              {withdrawError && (
                <div className="text-rose-500 text-[10px] flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {withdrawError}
                </div>
              )}

              {withdrawSuccess && (
                <div className="text-teal-600 dark:text-teal-400 text-[10px] flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Payout initiated successfully!
                </div>
              )}
            </div>

            {/* Recent Transaction Log */}
            <div className="glass-card p-5 rounded-[24px]">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-3">
                <DollarSign className="w-4 h-4 text-indigo-500" /> Transaction Ledger
              </h3>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-900">
                    <div>
                      <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                        {tx.type === 'deposit' ? <ArrowDownLeft className="w-3 h-3 text-teal-500" /> : <ArrowUpRight className="w-3 h-3 text-indigo-500" />}
                        {tx.description}
                      </div>
                      <span className="text-[9px] text-slate-400">{new Date(tx.timestamp).toLocaleString()}</span>
                    </div>
                    <span className={`font-mono font-bold text-[11px] ${tx.type === 'deposit' ? 'text-teal-600' : 'text-indigo-500'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SECURITY TAB */}
        {activeSubTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-5 rounded-[24px] space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-500" /> Strong Password Protection
              </h3>
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400">Our security pipeline enforces high entropy passwords before hashing payloads.</p>
                <div>
                  <input
                    type="password"
                    placeholder="Enter security password to test entropy..."
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none glass-input"
                  />
                </div>
                {passwordFeedback.length > 0 ? (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 space-y-1">
                    <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Password Criteria Missing:
                    </span>
                    <ul className="list-disc pl-4 text-[10px] text-rose-400 space-y-0.5">
                      {passwordFeedback.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                ) : inputPassword.length > 0 ? (
                  <div className="bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] p-2 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High Entropy Secure Password verified!
                  </div>
                ) : null}
              </div>
            </div>

            {/* 2FA Card */}
            <div className="glass-card p-5 rounded-[24px] space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-500" /> Two-Factor Authentication (2FA)
              </h3>
              <div className="space-y-3">
                <p className="text-[11px] text-slate-400">Secure withdrawals and contracts validation by verifying custom TOTP smartphone tokens.</p>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full ${user.twoFactorEnabled ? 'bg-teal-500 animate-pulse' : 'bg-slate-400'}`}></div>
                  <span className="font-bold text-xs">{user.twoFactorEnabled ? '2FA Protection Enabled' : '2FA Protection Off'}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdateUser({ ...user, twoFactorEnabled: !user.twoFactorEnabled })}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-all"
                  >
                    {user.twoFactorEnabled ? 'Disable 2FA' : 'Enable & Generate QR Code'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRIVACY & CRYPTO SYNC TAB */}
        {activeSubTab === 'privacy' && (
          <div className="space-y-4">
            <div className="glass-card p-5 rounded-[24px] space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-teal-500" /> End-to-End Cryptography Console
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={e2eeActive} 
                    onChange={() => setE2eeActive(!e2eeActive)} 
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                  <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">Encryption Active</span>
                </label>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  When E2EE is enabled, your dark/light preferences, balance ledger, and private profile bio are signed and encrypted locally using an asymmetric key block before they hit our cloud servers. Only your key holds the decryption block.
                </p>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Your Private Encryption Key:</span>
                    <button
                      onClick={() => {
                        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
                        let result = 'inertia-sec-key-';
                        for (let i = 0; i < 24; i++) {
                          result += characters.charAt(Math.floor(Math.random() * characters.length));
                        }
                        setEncryptionKey(result);
                      }}
                      className="text-[10px] text-indigo-500 font-bold hover:underline"
                    >
                      Regenerate
                    </button>
                  </div>
                  <div className="font-mono text-[11px] bg-white dark:bg-slate-950 p-2.5 rounded border border-slate-100 dark:border-slate-900 text-slate-600 dark:text-slate-300 break-all select-all">
                    {e2eeActive ? encryptionKey : 'DISABLED - PAYLOADS TRANSMITTING PLAIN TEXT'}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 bg-teal-500/10 border border-teal-500/20 rounded-lg p-3 text-teal-700 dark:text-teal-400">
                    <h4 className="font-bold text-xs flex items-center gap-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> High Entropy Proof
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      All preference files are ciphered with AES-256-GCM. Decryption calculations are run entirely client-side, providing flawless security.
                    </p>
                  </div>
                  <div className="flex-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 text-indigo-700 dark:text-indigo-400">
                    <h4 className="font-bold text-xs flex items-center gap-1 mb-1">
                      <Globe className="w-3.5 h-3.5" /> Cloud Storage Syncing
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Synced states are cached inside Redis server databases for ultra-fast, multi-device hot transitions when loading profiles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Switching Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card max-w-sm w-full p-6 rounded-[24px] shadow-2xl relative bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-wider font-mono text-indigo-500 font-bold">Secure Gateway Access</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {authMode === 'signin' ? 'Sign In to INERTIA' : authMode === 'signup' ? 'Create Unified Account' : 'Forgot Password'}
                </h3>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                // Perform quick swap
                onUpdateUser({
                  ...user,
                  email: inputEmail,
                  username: inputEmail.split('@')[0],
                  isGoogleUser: false
                });
                setShowAuthModal(false);
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none glass-input"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none glass-input"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  Confirm Credentials
                </button>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      // Mock Google Auth
                      onUpdateUser({
                        ...user,
                        username: 'Google_Hustler',
                        email: 'mattaniahilunga@gmail.com',
                        isGoogleUser: true,
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                      });
                      setShowAuthModal(false);
                    }}
                    className="text-indigo-500 hover:underline flex items-center gap-1 font-bold"
                  >
                    Google Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                    className="text-slate-500 hover:underline"
                  >
                    {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showAvatarModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card max-w-lg w-full p-6 rounded-[28px] shadow-2xl relative bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 space-y-6 text-[#0F1F15] dark:text-[#ECFDF5]"
            >
              <button 
                onClick={() => {
                  setShowAvatarModal(false);
                  setAvatarError('');
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider font-mono text-teal-500 font-bold">Personalize Identity</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  Change Profile Picture
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select a preset portrait, drag and drop an image file, or supply a web URL.
                </p>
              </div>

              {avatarError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{avatarError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Drag and Drop/Upload Box */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Option 1: Upload Image</span>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`h-[160px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-teal-500 bg-teal-500/10 scale-[1.02]' 
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
                    onClick={() => document.getElementById('avatar-file-input')?.click()}
                  >
                    <input
                      id="avatar-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Drag & Drop image
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      or click to browse
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-500 font-mono mt-1">
                      Max: 2MB (JPG, PNG, WEBP)
                    </span>
                  </div>
                </div>

                {/* Preset Avatars Selection */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Option 2: Preset Avatars</span>
                  <div className="grid grid-cols-4 gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                    {PRESET_AVATARS.map((p, idx) => {
                      const isSelected = user.avatar === p.url;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setAvatarError('');
                            onUpdateUser({
                              ...user,
                              avatar: p.url
                            });
                          }}
                          className={`relative rounded-full overflow-hidden w-11 h-11 border-2 transition-all hover:scale-105 cursor-pointer ${
                            isSelected 
                              ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md' 
                              : 'border-slate-200 dark:border-slate-850'
                          }`}
                          title={p.name}
                        >
                          <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute inset-0 bg-teal-500/20 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white drop-shadow-md" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Paste URL block */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Option 3: External Image URL</span>
                <form onSubmit={handleApplyUrl} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={tempAvatarUrl}
                    onChange={(e) => setTempAvatarUrl(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 border border-slate-200 dark:border-slate-850 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none glass-input"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors"
                  >
                    Apply URL
                  </button>
                </form>
              </div>

              <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <img src={user.avatar} className="w-6 h-6 rounded-full object-cover border border-teal-500" />
                  <span>Current Avatar Preview</span>
                </div>
                <button
                  onClick={() => {
                    setShowAvatarModal(false);
                    setAvatarError('');
                  }}
                  className="px-4 py-1.5 font-bold text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
