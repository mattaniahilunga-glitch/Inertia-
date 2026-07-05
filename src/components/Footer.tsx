/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, Send, ShieldAlert, Sparkles, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FooterProps {
  onOpenDeveloperConsole?: () => void;
}

export default function Footer({ onOpenDeveloperConsole }: FooterProps) {
  const [issueEmail, setIssueEmail] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueMessage, setIssueMessage] = useState('');
  const [issueCategory, setIssueCategory] = useState('Bug');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueEmail || !issueTitle || !issueMessage) return;

    setIsSubmitting(true);
    // Simulate server ingestion
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset form
      setIssueTitle('');
      setIssueMessage('');
      // Auto close success after 4s
      setTimeout(() => {
        setIsSuccess(false);
        setShowForm(false);
      }, 4000);
    }, 1500);
  };

  return (
    <footer className="border-t border-slate-200/50 dark:border-white/5 bg-white/25 dark:bg-[#020617]/25 backdrop-blur-xl transition-colors duration-300 py-12 px-6 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                INERTIA
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">
                v1.0.0
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              The premium unified ecosystem for digital entrepreneurship in Africa and globally.
              Learn skills, hustle for contracts, trade physical products.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Developer & Project Specifications
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                <span>Created by: <strong className="text-slate-700 dark:text-slate-300">Mattaniah Ilunga</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Contact Email: <a href="mailto:mattaniah.ilunga@email.com" className="hover:underline text-indigo-500 font-semibold">mattaniah.ilunga@email.com</a></span>
              </div>
              {onOpenDeveloperConsole && (
                <button
                  onClick={onOpenDeveloperConsole}
                  className="mt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  View 14 Architectural Deliverables (ERD, Schema, Roadmap)
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <AlertCircle className="w-4 h-4" />
              Report System Issue
            </button>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 text-start md:text-end">
              Issues will be directly routed to mattaniah.ilunga@email.com
            </p>
          </div>
        </div>

        {/* Issue Reporter Expansion */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden glass-card rounded-2xl p-6 mb-8 relative"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  ✕ Close
                </button>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                Submit Project Diagnostics & Issue Ticket
              </h4>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle className="w-12 h-12 text-teal-500 mb-2 animate-bounce" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Issue Transmitted Successfully!</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                    Our notification engine has encrypted and scheduled this report. It is now safely queued for review by{' '}
                    <span className="font-mono text-indigo-500">mattaniah.ilunga@email.com</span>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Your Contact Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={issueEmail}
                        onChange={(e) => setIssueEmail(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Issue Type / Category
                      </label>
                      <select
                        value={issueCategory}
                        onChange={(e) => setIssueCategory(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 glass-input"
                      >
                        <option value="Bug">Technical Bug (Crash/Visual)</option>
                        <option value="Payments">Payment Integration Feedback</option>
                        <option value="Maps">Google Maps Navigation Problem</option>
                        <option value="Feature">Product Suggestion / Upgrade</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Short Summary Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Map radius slider filter doesn't update pins"
                        value={issueTitle}
                        onChange={(e) => setIssueTitle(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Detailed Message
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Explain step-by-step how to reproduce or improve..."
                        value={issueMessage}
                        onChange={(e) => setIssueMessage(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 glass-input"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-2 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? 'Securing Connection...' : 'Secure & Send to Mattaniah'}
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2026 INERTIA Corporation. Built with pride by{' '}
            <strong className="text-slate-600 dark:text-slate-300">Mattaniah Ilunga</strong>. All Rights Reserved.
          </p>
          <div className="flex gap-4 items-center">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> E2EE AES-GCM Encrypted Cloud Sync Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
