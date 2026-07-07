/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Award, Briefcase, ShoppingBag, ArrowRight, CheckCircle2, 
  Sparkles, Compass, HelpCircle, ShieldCheck, Zap, Server, Globe 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onLaunchProduct: (productName: 'unfazed' | 'hustler' | 'stack') => void;
  userSkillsCount: number;
  userBalance: number;
}

export default function LandingPage({ onLaunchProduct, userSkillsCount, userBalance }: LandingPageProps) {
  // Recommendation system state
  const [interestQuizActive, setInterestQuizActive] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ skills: boolean; business: boolean; capital: boolean } | null>(null);
  const [recommendationResult, setRecommendationResult] = useState<'unfazed' | 'hustler' | 'stack' | 'all' | null>(null);
  const [activeSynergyTab, setActiveSynergyTab] = useState<'account' | 'crypto' | 'loop'>('account');

  const handleRunRecommendation = (skills: boolean, business: boolean, capital: boolean) => {
    setQuizAnswers({ skills, business, capital });
    
    // Logic:
    // No skills -> Unfazed (Gamified Education)
    // Has skills, no active products -> Hustler (Contracts/Gigs)
    // Has skills, owns products/business -> Stack (Alibaba Market)
    if (!skills) {
      setRecommendationResult('unfazed');
    } else if (business) {
      setRecommendationResult('stack');
    } else {
      setRecommendationResult('hustler');
    }
  };

  // Automatic smart recommendation based on profile stats if quiz hasn't been taken
  const getAutoRecommend = () => {
    if (userSkillsCount === 0) return { id: 'unfazed', label: 'Continuum Unfazed (Recommended)', desc: 'Start earning XP and learning coding/security skills!' };
    if (userBalance > 200) return { id: 'stack', label: 'Continuum Stack (Recommended)', desc: 'Leverage your balance to establish global African storefronts!' };
    return { id: 'hustler', label: 'Continuum Hustler (Recommended)', desc: 'Bid for high-budget contracts mapping to your verified skills!' };
  };

  const autoRec = getAutoRecommend();

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. HERO & MISSION DECLARATION */}
      <section className="relative overflow-hidden glass-card rounded-[32px] p-8 md:p-16 shadow-xl border-b-4 border-b-indigo-500">
        {/* Animated fluid gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-slate-900/10 to-teal-500/10 opacity-80"></div>
        
        {/* Abstract grids */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}></div>

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/60 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-teal-600 dark:text-teal-300 font-bold">The Billion-Dollar Synergy</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-slate-900 via-slate-800 to-teal-600 dark:from-white dark:via-slate-200 dark:to-teal-300 bg-clip-text text-transparent">
            Learn. Hustle. Build. Trade.
          </h1>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Continuum is a unified startup ecosystem bridging premium interactive skill acquisition, high-integrity freelance contract matching, and local geolocation trade channels across Africa.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setInterestQuizActive(true)}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 dark:bg-teal-400 dark:hover:bg-teal-300 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <Compass className="w-4 h-4" /> Run Dynamic Recommendations
            </button>
            <button
              onClick={() => onLaunchProduct(autoRec.id as any)}
              className="px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-white bg-white/20 dark:bg-slate-800/80 hover:bg-white/30 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg backdrop-blur-md transition-all cursor-pointer"
            >
              Go to {autoRec.label}
            </button>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC RECOMMENDER SYSTEM (INTERACTIVE CONSOLE) */}
      <AnimatePresence>
        {interestQuizActive && (
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-[32px] shadow-lg"
          >
            <div className="flex justify-between items-start border-b border-slate-200/50 dark:border-white/5 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" /> Interactive Get Started Diagnostician
              </h3>
              <button onClick={() => {
                setInterestQuizActive(false);
                setRecommendationResult(null);
              }} className="text-xs text-slate-400 hover:text-slate-600">✕ Close</button>
            </div>

            {!recommendationResult ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Our system evaluates your experience profile to recommend the optimal initial launchpad inside Continuum. Answer these three quick diagnostic indicators:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleRunRecommendation(false, false, false)}
                    className="p-4 rounded-xl text-start space-y-1.5 transition-all cursor-pointer glass-card glass-card-hover"
                  >
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">"I want to learn tech skills"</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Perfect for zero-experience learners wanting to study scales, coding, and crypto.</p>
                  </button>

                  <button
                    onClick={() => handleRunRecommendation(true, false, false)}
                    className="p-4 rounded-xl text-start space-y-1.5 transition-all cursor-pointer glass-card glass-card-hover"
                  >
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">"I have skills & need contract gigs"</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Optimal if you possess coding experience and seek secure Escrow-backed contracts.</p>
                  </button>

                  <button
                    onClick={() => handleRunRecommendation(true, true, true)}
                    className="p-4 rounded-xl text-start space-y-1.5 transition-all cursor-pointer glass-card glass-card-hover"
                  >
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">"I trade materials & wholesale items"</h4>
                    <p className="text-[10px] text-slate-400">Best for manufacturers seeking warehouses, buyer networks, and radius filters.</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-5 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-teal-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Recommended Gateway:{' '}
                  <span className="text-teal-600 dark:text-teal-400">
                    {recommendationResult === 'unfazed' ? 'Continuum Unfazed' : recommendationResult === 'hustler' ? 'Continuum Hustler' : 'Continuum Stack'}
                  </span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {recommendationResult === 'unfazed' && 'Based on your profile, we strongly recommend establishing a core skill set. Gain 1,200 XP inside Web scaling modules to unlock high-ticket jobs.'}
                  {recommendationResult === 'hustler' && 'Your skill profile has been validated! We recommend exploring the Job listings page to apply for active contract roles.'}
                  {recommendationResult === 'stack' && 'Excellent! Establish a storefront in Lagos Port, use Google Maps routing to locate warehouses, and trade with global buyers.'}
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => onLaunchProduct(recommendationResult as any)}
                    className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    Launch Product <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* 3. PLATFORM OVERVIEW (THREE CARDS & INTERACTIVE EXPLAINER) */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Three Unified Pillars of Synergy</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">One account. One secure crypto sync. Infinite market possibilities.</p>
        </div>

        {/* INTERACTIVE SYNERGY EXPLAINER BOARD */}
        <div className="glass-card p-6 rounded-[28px] border border-slate-200/50 dark:border-white/5 space-y-6">
          {/* Tab switches */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/50 dark:bg-slate-950/80 rounded-xl border border-slate-200/50 dark:border-slate-800">
            <button
              onClick={() => setActiveSynergyTab('account')}
              className={`py-2 text-[11px] md:text-xs font-bold rounded-lg transition-all cursor-pointer flex flex-col md:flex-row items-center justify-center gap-1.5 ${
                activeSynergyTab === 'account'
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>1. One Account</span>
            </button>
            <button
              onClick={() => setActiveSynergyTab('crypto')}
              className={`py-2 text-[11px] md:text-xs font-bold rounded-lg transition-all cursor-pointer flex flex-col md:flex-row items-center justify-center gap-1.5 ${
                activeSynergyTab === 'crypto'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>2. One Secure Crypto Sync</span>
            </button>
            <button
              onClick={() => setActiveSynergyTab('loop')}
              className={`py-2 text-[11px] md:text-xs font-bold rounded-lg transition-all cursor-pointer flex flex-col md:flex-row items-center justify-center gap-1.5 ${
                activeSynergyTab === 'loop'
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>3. Infinite Market Possibilities</span>
            </button>
          </div>

          {/* Dynamic Content Panels */}
          <AnimatePresence mode="wait">
            {activeSynergyTab === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                <div className="md:col-span-7 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 font-mono bg-teal-500/10 px-2 py-0.5 rounded">
                    Pillar I: Single Global Identity
                  </span>
                  <h3 className="text-xs md:text-sm font-extrabold text-slate-900 dark:text-white">
                    One account across Unfazed, Hustler, and Stack
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Instead of fragmenting your professional and educational goals across unrelated sites, Continuum pools your progress under a single profile. Your learning achievements in Continuum Unfazed unlock premium contract tiers in Continuum Hustler, and your client ratings reinforce your marketplace reputation on Continuum Stack automatically.
                  </p>
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <div className="p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg text-center border border-slate-200/50 dark:border-slate-800/80">
                      <span className="block text-[8px] uppercase text-slate-400 font-semibold font-mono">Unfazed Role</span>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Technical Student</span>
                    </div>
                    <div className="p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg text-center border border-slate-200/50 dark:border-slate-800/80">
                      <span className="block text-[8px] uppercase text-slate-400 font-semibold font-mono">Hustler Role</span>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Freelancer / Client</span>
                    </div>
                    <div className="p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg text-center border border-slate-200/50 dark:border-slate-800/80">
                      <span className="block text-[8px] uppercase text-slate-400 font-semibold font-mono">Stack Role</span>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Wholesale Merchant</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-5 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-200/50 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center font-bold text-teal-600 text-xs">IN</div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono">Active Profile Switcher</span>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">Unified Identity Hub</h4>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-1.5 rounded border border-slate-200/50 dark:border-slate-800/80">
                      <span>✓ Unfazed XP Credentials</span>
                      <span className="text-teal-500 font-bold">1,200 XP Sync</span>
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-1.5 rounded border border-slate-200/50 dark:border-slate-800/80">
                      <span>✓ Hustler Reputation Rating</span>
                      <span className="text-indigo-500 font-bold">5.0 ⭐ (8 orders)</span>
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-1.5 rounded border border-slate-200/50 dark:border-slate-800/80">
                      <span>✓ Stack Enterprise Store</span>
                      <span className="text-teal-500 font-bold">2 listings active</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSynergyTab === 'crypto' && (
              <motion.div
                key="crypto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                <div className="md:col-span-7 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded">
                    Pillar II: One Secure Crypto Sync
                  </span>
                  <h3 className="text-xs md:text-sm font-extrabold text-slate-900 dark:text-white">
                    One secure stable balance sync across the platform
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Your stable balance is secured by our unified, locally simulated ledger database. When you unlock tasks, execute contracts in Continuum Hustler, or complete multi-item orders in Continuum Stack, the secure balance ledger updates globally across all sub-apps in real time.
                  </p>
                  <ul className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">⚡ Instant balance crossovers</li>
                    <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">🛡️ Fraud-prevention ledger state</li>
                    <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">🔒 Smart Escrow secure contracts</li>
                    <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">📈 Gas-free ledger settlement</li>
                  </ul>
                </div>
                <div className="md:col-span-5 bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 text-white">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                      <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400">CRYPTO LEDGER SYNC ONLINE</span>
                    </div>
                    <span className="text-[8px] font-mono text-slate-500">v1.0.4 stable</span>
                  </div>
                  <div className="space-y-1 text-[10px] font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Ledger Account:</span>
                      <span className="text-white font-bold">Continuum Stable USD</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Network State:</span>
                      <span className="text-teal-400 font-bold">Synchronized</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Synced Balance:</span>
                      <span className="text-white font-bold text-xs">${userBalance.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg text-[9px] text-indigo-300 font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Double-signature cryptographic verification active</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSynergyTab === 'loop' && (
              <motion.div
                key="loop"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                <div className="md:col-span-7 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 font-mono bg-teal-500/10 px-2 py-0.5 rounded">
                    Pillar III: Infinite Market Possibilities
                  </span>
                  <h3 className="text-xs md:text-sm font-extrabold text-slate-900 dark:text-white">
                    Settle & Trade Loop: Build Autonomous Local Wealth
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    This circular economy guarantees self-sustaining opportunities for technical builders and product merchants:
                  </p>
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex gap-2.5 items-start">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] font-bold font-mono">01</span>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Educate & Certify:</strong>
                        <span className="text-slate-500 dark:text-slate-400 ml-1 text-[11px]">Acquire real-world skills inside Unfazed to mint verified credential proofs.</span>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold font-mono">02</span>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Secure Gig Capital:</strong>
                        <span className="text-slate-500 dark:text-slate-400 ml-1 text-[11px]">Bid for smart contracts inside Hustler and secure capital locked safely in Escrows.</span>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] font-bold font-mono">03</span>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Launch Bulk Trade:</strong>
                        <span className="text-slate-500 dark:text-slate-400 ml-1 text-[11px]">Deploy earned capital directly to operate wholesale storefronts, fulfill bulk orders, and trade via interactive map routing on Continuum Stack.</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-5 bg-gradient-to-tr from-teal-500/10 via-indigo-500/10 to-teal-500/5 p-5 rounded-2xl border border-slate-200/50 dark:border-white/5 flex flex-col justify-center items-center text-center space-y-4 h-[220px]">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-teal-500/30 animate-spin" />
                    <Sparkles className="w-6 h-6 text-teal-500" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Active Growth Loop Connected</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] mx-auto">Learn, Earn, Trade, and Accumulate Secure Capital in a Closed Economic Engine.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Continuum Unfazed */}
          <div className="glass-card glass-card-hover rounded-[32px] overflow-hidden shadow-xs flex flex-col justify-between group border-b-4 border-b-blue-500">
            <div>
              <div className="h-44 bg-slate-100/30 dark:bg-slate-900/10 relative overflow-hidden flex items-center justify-center p-6">
                {/* Interactive visual mockup illustration */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-slate-900/10 to-teal-500/5"></div>
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-500 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8" />
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-teal-600 dark:text-teal-400 font-mono">Pillar #01: One Account</span>
                  <span className="text-[10px] bg-teal-500/15 text-teal-600 dark:text-teal-400 font-bold px-2 py-0.5 rounded font-mono">EDU & ACADEMY</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Continuum Unfazed</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The educational foundation. Build real-world skills, earn Duolingo-style XP, climb ranks, and mint credentials that unlock high-value contracts.
                </p>

                <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-1.5">✓ One-Account Synchronized Profile</li>
                  <li className="flex items-center gap-1.5">✓ Interactive Slide-by-slide Lessons</li>
                  <li className="flex items-center gap-1.5">✓ Verified mastery QR-credentials</li>
                </ul>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200/50 dark:border-white/5">
              <button
                onClick={() => onLaunchProduct('unfazed')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.02]"
              >
                Launch Unfazed Academy
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Continuum Hustler */}
          <div className="glass-card glass-card-hover rounded-[32px] overflow-hidden shadow-xs flex flex-col justify-between group border-b-4 border-b-purple-500">
            <div>
              <div className="h-44 bg-slate-100/30 dark:bg-slate-900/10 relative overflow-hidden flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-slate-900/10 to-purple-500/5"></div>
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8" />
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">Pillar #02: Crypto Sync</span>
                  <span className="text-[10px] bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded font-mono">CONTRACTS & GIGS</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Continuum Hustler</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The service exchange. Publish real contract gigs or bid on remote milestones using our secure, unified Escrow crypto payment ledger.
                </p>

                <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-1.5">✓ Safe Simulated Escrow Locks</li>
                  <li className="flex items-center gap-1.5">✓ Smart Skills Compatibility Checker</li>
                  <li className="flex items-center gap-1.5">✓ Real-time stable balance syncs</li>
                </ul>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200/50 dark:border-white/5">
              <button
                onClick={() => onLaunchProduct('hustler')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.02]"
              >
                Launch Hustler Gig-Store
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Continuum Stack */}
          <div className="glass-card glass-card-hover rounded-[32px] overflow-hidden shadow-xs flex flex-col justify-between group border-b-4 border-b-emerald-500">
            <div>
              <div className="h-44 bg-slate-100/30 dark:bg-slate-900/10 relative overflow-hidden flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-slate-900/10 to-indigo-500/5"></div>
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-500 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-teal-600 dark:text-teal-400 font-mono">Pillar #03: Market Possibilities</span>
                  <span className="text-[10px] bg-teal-500/15 text-teal-600 dark:text-teal-400 font-bold px-2 py-0.5 rounded font-mono">WHOLESALE TRADE</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Continuum Stack</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The enterprise marketplace. Operate merchant storefronts, order wholesale agricultural/tech goods, and track nearby stores on our interactive Google Maps radius system.
                </p>

                <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-1.5">✓ Interactive Google Maps radius grid</li>
                  <li className="flex items-center gap-1.5">✓ Cart with Checkout & Escrow deduction</li>
                  <li className="flex items-center gap-1.5">✓ Stable ledger asset fulfillment</li>
                </ul>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200/50 dark:border-white/5">
              <button
                onClick={() => onLaunchProduct('stack')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.02]"
              >
                Launch Stack enterprise
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. PLATFORM INTEGRITY SPECS */}
      <section className="glass-card p-6 md:p-8 rounded-[32px] grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <ShieldCheck className="w-5 h-5 text-teal-500" />
          <h4 className="font-bold text-slate-900 dark:text-white text-xs">End-to-End Encryption</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">All preference settings, DM threads, and ledger keys are ciphered with locally generated key pairs.</p>
        </div>
        <div className="space-y-1.5">
          <Zap className="w-5 h-5 text-indigo-500" />
          <h4 className="font-bold text-slate-900 dark:text-white text-xs">Authority Node Sync</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Your balance and active state syncs dynamically to Express memory buffers for seamless device crossovers.</p>
        </div>
        <div className="space-y-1.5">
          <Globe className="w-5 h-5 text-teal-500" />
          <h4 className="font-bold text-slate-900 dark:text-white text-xs">Unified Ledger</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Payments, deposits, and Escrows hold securely in a single transaction system across Unfazed, Hustler and Stack.</p>
        </div>
      </section>

    </div>
  );
}
