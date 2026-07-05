/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Job, Transaction, UserProfile } from '../types';
import { INITIAL_JOBS } from '../data/mockData';
import { 
  Briefcase, Plus, UserCheck, Calendar, ShieldAlert, Sparkles, 
  MapPin, CheckCircle2, DollarSign, RefreshCw, FileText, Send 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HustlerAppProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
}

export default function HustlerApp({ user, onUpdateUser, transactions, onAddTransaction }: HustlerAppProps) {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [activeTab, setActiveTab] = useState<'listings' | 'post' | 'escrow' | 'contracts'>('listings');
  const [role, setRole] = useState<'Client' | 'Freelancer' | 'Worker' | 'Agency'>(user.role);

  // Job creation state
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobBudget, setNewJobBudget] = useState('');
  const [newJobType, setNewJobType] = useState<'Remote' | 'Physical' | 'Contract' | 'Part-time' | 'Full-time' | 'Gig work'>('Remote');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobSkills, setNewJobSkills] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('');

  // Application states
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [matchingLoaderId, setMatchingLoaderId] = useState<string | null>(null);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = parseFloat(newJobBudget);
    if (!newJobTitle || isNaN(budgetNum)) return;

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: newJobTitle,
      company: role === 'Agency' ? 'Unified Agency Member' : `${user.username} Projects`,
      budget: budgetNum,
      clientName: user.username,
      location: newJobLocation || 'Remote',
      status: 'Open',
      type: newJobType,
      category: 'Web Development',
      skillsRequired: newJobSkills.split(',').map(s => s.trim()),
      description: newJobDesc,
      postedAt: new Date().toISOString()
    };

    setJobs([newJob, ...jobs]);
    
    // Auto lock escrow
    const newTx: Transaction = {
      id: `tx-escrow-${Date.now()}`,
      type: 'escrow_lock',
      amount: budgetNum,
      currency: 'USD',
      status: 'Completed',
      description: `Escrow hold for newly posted job: "${newJobTitle}"`,
      timestamp: new Date().toISOString()
    };
    onAddTransaction(newTx);

    // Subtract from balance
    onUpdateUser({
      ...user,
      balance: Math.max(0, user.balance - budgetNum)
    });

    // Reset forms
    setNewJobTitle('');
    setNewJobBudget('');
    setNewJobDesc('');
    setNewJobSkills('');
    setNewJobLocation('');
    setActiveTab('listings');
  };

  const calculateAICompatibility = (job: Job) => {
    // Basic scoring based on overlaps in skills
    const matchCount = job.skillsRequired.filter(s => user.skills.includes(s)).length;
    if (job.skillsRequired.length === 0) return 100;
    return Math.min(100, Math.round((matchCount / job.skillsRequired.length) * 100));
  };

  const handleApplyJob = (jobId: string) => {
    setMatchingLoaderId(jobId);
    
    // Simulate smart AI match pipeline
    setTimeout(() => {
      setAppliedJobIds([...appliedJobIds, jobId]);
      setMatchingLoaderId(null);
    }, 1500);
  };

  return (
    <div className="glass-card rounded-[32px] p-6 transition-all duration-300">
      
      {/* Marketplace Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="text-indigo-500 w-5 h-5" />
            Inertia Hustler: Global Gigs & Escrow Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse remote contracts, physical installations, or bid for full-time work with automated skill compatibility evaluations.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 px-1.5">Switch role:</span>
          {['Client', 'Freelancer', 'Worker', 'Agency'].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r as any);
                onUpdateUser({ ...user, role: r as any });
              }}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                role === r
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Internal Navigation tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 overflow-x-auto">
        {[
          { id: 'listings', label: 'Explore Contracts', icon: Briefcase },
          { id: 'post', label: 'Post a New Job (Escrow Lock)', icon: Plus },
          { id: 'escrow', label: 'Escrow Holdings Ledger', icon: DollarSign },
          { id: 'contracts', label: 'Invoices & Agreements', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 pb-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                isActive 
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
        
        {/* LISTINGS PANEL */}
        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Jobs list */}
            <div className="space-y-4 md:col-span-2">
              {jobs.map((job) => {
                const compatibility = calculateAICompatibility(job);
                const hasApplied = appliedJobIds.includes(job.id);
                const isLoading = matchingLoaderId === job.id;

                return (
                  <div key={job.id} className="glass-card glass-card-hover p-5 rounded-[24px] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                          {job.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{job.title}</h3>
                      <p className="text-xs text-slate-400 max-w-2xl">{job.description}</p>

                      <div className="flex flex-wrap gap-1">
                        {job.skillsRequired.map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-900 text-[10px] text-slate-500 border border-slate-100 dark:border-slate-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-900 shrink-0">
                      <div>
                        <span className="text-[10px] text-slate-400 block text-start md:text-end">Client Budget</span>
                        <span className="text-base font-extrabold text-slate-900 dark:text-white">${job.budget}</span>
                      </div>

                      {/* Smart match indicator */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400">AI Compatibility:</span>
                        <span className={`text-[11px] font-bold font-mono ${compatibility >= 75 ? 'text-teal-500' : compatibility >= 40 ? 'text-amber-500' : 'text-slate-400'}`}>
                          {compatibility}%
                        </span>
                      </div>

                      <button
                        disabled={hasApplied || isLoading}
                        onClick={() => handleApplyJob(job.id)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 w-full md:w-auto justify-center ${
                          hasApplied 
                            ? 'bg-slate-100 text-slate-400 dark:bg-slate-900 border border-transparent' 
                            : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white'
                        }`}
                      >
                        {isLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : hasApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                            Applied
                          </>
                        ) : (
                          'Submit Proposal'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* POST JOB TAB */}
        {activeTab === 'post' && (
          <div className="max-w-2xl mx-auto glass-card p-6 rounded-[24px] space-y-4">
            <h3 className="font-bold text-slate-950 dark:text-white text-sm border-b pb-2 border-slate-200/50 dark:border-white/5 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-500" /> Post New Contract Posting (Escrow Secured)
            </h3>
            
            <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contract Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Redesign checkout gateway flow"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Escrow Budget ($ USD)</label>
                <input
                  type="number"
                  required
                  placeholder="1500"
                  value={newJobBudget}
                  onChange={(e) => setNewJobBudget(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Employment Type</label>
                <select
                  value={newJobType}
                  onChange={(e: any) => setNewJobType(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                >
                  <option value="Remote">Remote (Global)</option>
                  <option value="Physical">Physical (Local Coordinates)</option>
                  <option value="Contract">Contract (Short/Long term)</option>
                  <option value="Part-time">Part-time Gigs</option>
                  <option value="Gig work">Micro tasks / Tasks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location Coordinates / City</label>
                <input
                  type="text"
                  placeholder="e.g. Nairobi, Kenya or Remote"
                  value={newJobLocation}
                  onChange={(e) => setNewJobLocation(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Skills Required (Comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React, TypeScript, Cryptography"
                  value={newJobSkills}
                  onChange={(e) => setNewJobSkills(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Contract Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise targets, milestone timelines, and delivery expectations..."
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                />
              </div>

              <div className="md:col-span-2 flex justify-between items-center pt-2 border-t">
                <span className="text-[10px] text-slate-400 font-mono">
                  🔒 Posting triggers a mandatory budget lock into our Escrow Contract ledger.
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Lock Escrow & Post
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ESCROW LEDGER TAB */}
        {activeTab === 'escrow' && (
          <div className="space-y-4">
            <div className="glass-card p-5 rounded-[24px]">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-3 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-teal-500" /> Active Escrow Ledger Locks
              </h3>
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                Inertia Hustler runs on a zero-trust escrow lock scheme. Clients lock full contract values upon creating roles, which are safely compiled and dispatched to workers only upon mutual cryptographic signoff.
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {transactions.filter(t => t.type.includes('escrow')).map((tx) => (
                  <div key={tx.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/40 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{tx.description}</div>
                      <span className="text-[9px] text-slate-400 font-mono">Receipt ID: {tx.id.toUpperCase()} | Secure Hold</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-amber-500">${tx.amount} locked</span>
                      <span className="block text-[9px] text-slate-400">Locked: {new Date(tx.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {transactions.filter(t => t.type.includes('escrow')).length === 0 && (
                  <p className="text-slate-400 italic text-center py-4">No active escrow holds yet. Post a job contract to trigger ledger locks!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CONTRACTS TAB */}
        {activeTab === 'contracts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-5 rounded-[24px] space-y-3">
              <h3 className="font-bold text-slate-950 dark:text-white text-xs">Contract Sign-off Framework</h3>
              <p className="text-[11px] text-slate-400">All agreements are parsed, signed client-side with RSA certificates, and cached inside persistent ledger backends.</p>
              
              <div className="p-3 bg-slate-100/40 dark:bg-slate-900/40 rounded-lg space-y-1.5 border border-slate-200">
                <span className="font-bold text-[10px] text-slate-500 font-mono">SECURE INVOICE AGREEMENT #INT-INV-2026-04</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">Sahara Crafts Redesign Integration Milestone 1</p>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Amount: $2,400.00</span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold">Client Cryptographically Signed</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
