/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { UserProfile, Transaction, NotificationItem } from './types';
import { INITIAL_USER, INITIAL_TRANSACTIONS } from './data/mockData';
import { 
  Bell, Wallet, Compass, Award, Briefcase, ShoppingBag, 
  Users, Layers, User, ShieldCheck, Sun, Moon, Sparkles, Clock, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Subcomponents
import LandingPage from './components/LandingPage';
import UnfazedApp from './components/UnfazedApp';
import HustlerApp from './components/HustlerApp';
import StackApp from './components/StackApp';
import SocialHub from './components/SocialHub';
import UserAccount from './components/UserAccount';
import Footer from './components/Footer';
import GetStarted from './components/GetStarted';

export default function App() {
  // Shared Core States
  const [user, setUser] = useState<UserProfile>(() => {
    const cachedUser = localStorage.getItem('continuum-active-user');
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('continuum-session-active') === 'true';
  });

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<'home' | 'unfazed' | 'hustler' | 'stack' | 'social' | 'account'>('home');
  
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Notification center
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Adisa Kojo replied to message',
      content: 'I verified your Scala routes. It scale perfectly on 2,000 reqs!',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'chat'
    },
    {
      id: 'notif-2',
      title: 'Escrow Lock Active',
      content: 'Successfully holding $1,200 for contract Milestone #1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      type: 'escrow'
    }
  ]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // System time clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // Apply dark class on theme toggles
  useEffect(() => {
    const savedTheme = localStorage.getItem('continuum-theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('continuum-theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('continuum-theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('continuum-session-active');
    localStorage.removeItem('continuum-active-user');
    setIsLoggedIn(false);
    setActiveTab('home');
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('continuum-active-user', JSON.stringify(updatedUser));
    
    // Also update in registered list so edits persist!
    const registeredUsersJson = localStorage.getItem('continuum-registered-users');
    if (registeredUsersJson) {
      try {
        const usersMap = JSON.parse(registeredUsersJson);
        usersMap[updatedUser.email.toLowerCase()] = updatedUser;
        localStorage.setItem('continuum-registered-users', JSON.stringify(usersMap));
      } catch (e) {
        console.error('Error updating persisted user map', e);
      }
    }
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleMarkNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isLoggedIn) {
    return <GetStarted onLogin={handleLogin} darkMode={darkMode} />;
  }

  return (
    <div className="min-h-screen bg-[#F2F6F3] dark:bg-[#050B07] text-[#0F1F15] dark:text-[#ECFDF5] transition-colors duration-400 flex flex-col justify-between font-sans selection:bg-emerald-500/20 selection:text-emerald-950 relative overflow-hidden">
      
      {/* Mesh Gradient Background Blobs - Serene Sage Mist & High-Glow Jade Emerald */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/15 dark:bg-emerald-900/5 rounded-full blur-[120px] pointer-events-none mesh-blob z-0"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-teal-200/15 dark:bg-teal-900/5 rounded-full blur-[150px] pointer-events-none mesh-blob z-0"></div>
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-100/10 dark:bg-emerald-950/5 rounded-full blur-[140px] pointer-events-none mesh-blob z-0"></div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <div>
          {/* CORE APPLICATION NAVIGATION HEADER */}
          <header className="sticky top-0 z-40 glass-navbar transition-colors">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
              
              {/* Logo Brand */}
              <button 
                onClick={() => setActiveTab('home')}
                className="flex items-center gap-2 cursor-pointer group text-start focus:outline-none flex-shrink-0"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 font-extrabold text-base tracking-tighter group-hover:scale-105 transition-transform">
                  C
                </div>
                <div>
                  <h1 className="text-base font-black tracking-tight text-slate-950 dark:text-white leading-none">CONTINUUM</h1>
                  <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 font-bold hidden sm:inline">Start. Learn. Trade</span>
                </div>
              </button>

            {/* Center Tab Navigation */}
            <nav className="hidden lg:flex items-center gap-1 text-xs">
              {[
                { id: 'home', label: 'Ecosystem Base', icon: Compass },
                { id: 'unfazed', label: 'Unfazed Academy', icon: Award },
                { id: 'hustler', label: 'Hustler Gigs', icon: Briefcase },
                { id: 'stack', label: 'Stack Market', icon: ShoppingBag },
                { id: 'social', label: 'Social Hub', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 shadow-xs font-black backdrop-blur-md' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Side Widgets (Theme, Balance, Profile, Notif) */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-8.5 h-8.5 rounded-lg border border-slate-200/50 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-white/10 cursor-pointer transition-colors"
                title={darkMode ? 'Light Theme' : 'Dark Theme'}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Secure Wallet balance indicator */}
              <div 
                onClick={() => setActiveTab('account')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 dark:border-teal-400/20 backdrop-blur-md text-teal-600 dark:text-teal-400 text-xs font-bold font-mono cursor-pointer"
                title="Unified Wallet Balance"
              >
                <Wallet className="w-3.5 h-3.5" />
                ${user.balance.toFixed(2)}
              </div>

              {/* Notification Center */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifDropdown(!showNotifDropdown);
                    if (!showNotifDropdown) handleMarkNotifsRead();
                  }}
                  className="w-8.5 h-8.5 rounded-lg border border-slate-200/50 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-white/10 cursor-pointer transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  )}
                </button>

                {/* Dropdown list */}
                <AnimatePresence>
                  {showNotifDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="fixed top-16 left-4 right-4 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-72 bg-white/90 dark:bg-slate-950/90 border border-slate-200/50 dark:border-white/10 backdrop-blur-xl rounded-xl p-4 shadow-xl z-50 space-y-3"
                    >
                      <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-white/5 pb-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">Encrypted Notifications</h4>
                        <span className="text-[9px] font-mono text-slate-400 uppercase">AES-256 decrypted</span>
                      </div>
                      
                      <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-2 bg-slate-100/50 dark:bg-white/5 rounded border border-slate-200/30 dark:border-white/5">
                            <span className="font-bold text-[10px] text-teal-600 dark:text-teal-400 block">{n.title}</span>
                            <p className="text-[10px] text-slate-500 mt-0.5">{n.content}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Avatar Action */}
              <button
                onClick={() => setActiveTab('account')}
                className="w-8.5 h-8.5 rounded-lg border border-slate-200/50 dark:border-white/10 overflow-hidden flex items-center justify-center cursor-pointer hover:border-teal-500/50 transition-colors"
                title="My Unified Account profile"
              >
                <img src={user.avatar} className="w-full h-full object-cover" />
              </button>

              {/* Disconnect Node Button */}
              <button
                onClick={handleLogout}
                className="w-8.5 h-8.5 rounded-lg border border-slate-200/50 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 cursor-pointer transition-colors"
                title="Disconnect Node (Logout)"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* Mobile bottom nav drawer helper */}
          <div className="lg:hidden bg-white/30 dark:bg-slate-950/30 backdrop-blur-md border-b border-slate-200/40 dark:border-white/5 overflow-x-auto whitespace-nowrap py-2 px-4 flex gap-1 scrollbar-none text-[11px] font-bold">
            {[
              { id: 'home', label: 'Home', icon: Compass },
              { id: 'unfazed', label: 'Unfazed', icon: Award },
              { id: 'hustler', label: 'Hustler', icon: Briefcase },
              { id: 'stack', label: 'Stack', icon: ShoppingBag },
              { id: 'social', label: 'Social', icon: Users }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1 ${
                    isActive 
                      ? 'bg-slate-900/10 dark:bg-white/10 text-slate-950 dark:text-white border border-slate-300 dark:border-white/10 shadow-xs font-black' 
                      : 'text-slate-500'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* CORE APPLICATION WORKSPACE CANVAS CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'home' && (
                <LandingPage 
                  onLaunchProduct={(p) => setActiveTab(p as any)} 
                  userSkillsCount={user.skills.length}
                  userBalance={user.balance}
                />
              )}
              {activeTab === 'unfazed' && (
                <UnfazedApp 
                  user={user} 
                  onUpdateUser={handleUpdateUser} 
                />
              )}
              {activeTab === 'hustler' && (
                <HustlerApp 
                  user={user} 
                  onUpdateUser={handleUpdateUser} 
                  transactions={transactions} 
                  onAddTransaction={handleAddTransaction} 
                />
              )}
              {activeTab === 'stack' && (
                <StackApp 
                  user={user} 
                  onUpdateUser={handleUpdateUser} 
                  onAddTransaction={handleAddTransaction}
                />
              )}
              {activeTab === 'social' && (
                <SocialHub 
                  user={user} 
                />
              )}
              {activeTab === 'account' && (
                <UserAccount 
                  user={user} 
                  onUpdateUser={handleUpdateUser} 
                  transactions={transactions} 
                  onAddTransaction={handleAddTransaction} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* CORE ATTTRIBUTION FOOTER */}
      <Footer />

    </div>
  </div>
  );
}
