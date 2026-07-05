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
    if (userSkillsCount === 0) return { id: 'unfazed', label: 'Inertia Unfazed (Recommended)', desc: 'Start earning XP and learning coding/security skills!' };
    if (userBalance > 200) return { id: 'stack', label: 'Inertia Stack (Recommended)', desc: 'Leverage your balance to establish global African storefronts!' };
    return { id: 'hustler', label: 'Inertia Hustler (Recommended)', desc: 'Bid for high-budget contracts mapping to your verified skills!' };
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
            Inertia is a unified startup ecosystem bridging premium interactive skill acquisition, high-integrity freelance contract matching, and local geolocation trade channels across Africa.
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
                  Our system evaluates your experience profile to recommend the optimal initial launchpad inside Inertia. Answer these three quick diagnostic indicators:
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
                    {recommendationResult === 'unfazed' ? 'Inertia Unfazed' : recommendationResult === 'hustler' ? 'Inertia Hustler' : 'Inertia Stack'}
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

      {/* 3. PLATFORM OVERVIEW (THREE CARDS) */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Three Unified Pillars of Synergy</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">One account. One secure crypto sync. Infinite market possibilities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Inertia Unfazed */}
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
                  <span className="text-[9px] uppercase font-bold tracking-widest text-teal-600 dark:text-teal-400 font-mono">Pillar #01</span>
                  <span className="text-[10px] bg-teal-500/15 text-teal-600 dark:text-teal-400 font-bold px-2 py-0.5 rounded font-mono">EDU & ACADEMY</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Inertia Unfazed</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Earn XP climbing ranks via interactive, slide-by-slide programming, cybersecurity, and UI/UX roadmaps. Validate lessons with live sandboxes.
                </p>

                <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-1.5">✓ Duolingo-style XP Streaks</li>
                  <li className="flex items-center gap-1.5">✓ Node compiler sandboxes</li>
                  <li className="flex items-center gap-1.5">✓ Secured mastery QR-certs</li>
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

          {/* Card 2: Inertia Hustler */}
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
                  <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">Pillar #02</span>
                  <span className="text-[10px] bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded font-mono">CONTRACTS & GIGS</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Inertia Hustler</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Toggle between client and freelancer roles to publish contracts or secure remote gigs. Runs on smart skill compliance metrics automatically.
                </p>

                <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-1.5">✓ AI Skill compatibility scores</li>
                  <li className="flex items-center gap-1.5">✓ Secure Escrow ledger lock</li>
                  <li className="flex items-center gap-1.5">✓ Signed invoices frameworks</li>
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

          {/* Card 3: Inertia Stack */}
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
                  <span className="text-[9px] uppercase font-bold tracking-widest text-teal-600 dark:text-teal-400 font-mono">Pillar #03</span>
                  <span className="text-[10px] bg-teal-500/15 text-teal-600 dark:text-teal-400 font-bold px-2 py-0.5 rounded font-mono">African TRADE</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Inertia Stack</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Alibaba-inspired wholesale trade platform. Track nearby buyers, sellers, or regional warehouses inside our interactive Google Maps radius grid.
                </p>

                <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-1.5">✓ Interactive Google Maps Canvas</li>
                  <li className="flex items-center gap-1.5">✓ Radius distance computations</li>
                  <li className="flex items-center gap-1.5">✓ Multi-currency agricultural catalog</li>
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
