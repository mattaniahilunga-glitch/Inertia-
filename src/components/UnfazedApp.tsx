/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Course, Lesson, UserProfile } from '../types';
import { INITIAL_COURSES } from '../data/mockData';
import { 
  BookOpen, Award, Flame, Trophy, Play, CheckCircle2, ArrowRight, 
  Terminal, HelpCircle, Code, ListFilter, Sparkles, RefreshCw, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UnfazedAppProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export default function UnfazedApp({ user, onUpdateUser }: UnfazedAppProps) {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'catalog' | 'leaderboard' | 'certificates'>('catalog');

  // Interactive Lesson execution states
  const [codeAnswer, setCodeAnswer] = useState('');
  const [selectedQuizOpt, setSelectedQuizOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [matchSelections, setMatchSelections] = useState<{ [left: string]: string }>({});
  const [dragSelection, setDragSelection] = useState<string | null>(null);
  
  // Playground simulation result
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [playgroundSuccess, setPlaygroundSuccess] = useState(false);

  // Completed Course Cert display
  const [activeCertCourse, setActiveCertCourse] = useState<Course | null>(null);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const activeLesson = selectedCourse?.lessons[activeLessonIdx];

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveLessonIdx(0);
    setCodeAnswer('');
    setSelectedQuizOpt(null);
    setQuizSubmitted(false);
    setMatchSelections({});
    setSandboxLogs([]);
    setPlaygroundSuccess(false);
  };

  const handleRunSandbox = () => {
    setIsCompiling(true);
    setSandboxLogs(['[NodeJS Runtime Engine v20.0] Booting Sandbox...', 'Compiling TypeScript types...']);
    
    setTimeout(() => {
      // Very basic validation - checking if the answer sends response
      const cleanCode = codeAnswer.replace(/\s/g, '');
      const isCorrect = cleanCode.includes("status:'scalable'") || cleanCode.includes('status:"scalable"');
      
      if (isCorrect) {
        setSandboxLogs(prev => [
          ...prev,
          'INFO: Route setup found: app.get("/api/health")',
          'SUCCESS: res.json({ status: "scalable" }) successfully processed!',
          'Test Cases: 1 Passed, 0 Failed',
          'Sandbox fully scaled and verified!'
        ]);
        setPlaygroundSuccess(true);
      } else {
        setSandboxLogs(prev => [
          ...prev,
          'ERROR: Expected JSON payload containing key "status" with value "scalable"',
          'Test Cases: 0 Passed, 1 Failed',
          'Compilation failed.'
        ]);
        setPlaygroundSuccess(false);
      }
      setIsCompiling(false);
    }, 1200);
  };

  const handleQuizSubmit = (quiz: any) => {
    if (selectedQuizOpt === null) return;
    setQuizSubmitted(true);
    const correct = selectedQuizOpt === quiz.correctAnswer;
    setQuizCorrect(correct);
  };

  const handleMatchPair = (leftTerm: string, rightTerm: string) => {
    setMatchSelections({
      ...matchSelections,
      [leftTerm]: rightTerm
    });
  };

  const handleCompleteLesson = () => {
    if (!selectedCourse || !activeLesson) return;

    // Award XP
    const newXp = user.xp + activeLesson.rewardXp;
    let newLevel = user.level;
    let newRank = user.rank;

    // Basic rank thresholds
    if (newXp >= 2000) {
      newRank = 'Silver';
      newLevel = 2;
    }
    if (newXp >= 4000) {
      newRank = 'Gold';
      newLevel = 3;
    }

    onUpdateUser({
      ...user,
      xp: newXp,
      level: newLevel,
      rank: newRank,
      dailyStreak: user.dailyStreak + 1
    });

    // Mark lesson completed in local course list
    setCourses(prev => prev.map(c => {
      if (c.id === selectedCourse.id) {
        const updatedLessons = c.lessons.map(l => l.id === activeLesson.id ? { ...l, completed: true } : l);
        const completedCount = updatedLessons.filter(l => l.completed).length;
        const progress = Math.round((completedCount / c.lessonsCount) * 100);
        return {
          ...c,
          lessons: updatedLessons,
          progressPercent: progress
        };
      }
      return c;
    }));

    // Next lesson or cert logic
    if (activeLessonIdx + 1 < selectedCourse.lessons.length) {
      setActiveLessonIdx(activeLessonIdx + 1);
      // Reset states
      setCodeAnswer('');
      setSelectedQuizOpt(null);
      setQuizSubmitted(false);
      setMatchSelections({});
      setSandboxLogs([]);
      setPlaygroundSuccess(false);
    } else {
      // Course fully complete! Show Cert!
      setActiveCertCourse(selectedCourse);
      setActiveTab('certificates');
      setSelectedCourseId(null);
    }
  };

  return (
    <div className="glass-card rounded-[32px] p-6 transition-all duration-300">
      
      {/* Academy Header / Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-teal-500 w-5 h-5" />
            Inertia Unfazed: Gamified Skillshare Academy
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build secure verified skills, gain XP levels, pass coding sandbox puzzles, and generate downloadable certificates.
          </p>
        </div>

        {/* Stats Widget */}
        <div className="flex gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-xs font-bold font-mono">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            🔥 STREAK: {user.dailyStreak} Days
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono">
            <Trophy className="w-4 h-4 text-amber-500" />
            🏆 XP: {user.xp}
          </div>
        </div>
      </div>

      {/* Course Sub Tabs */}
      {!selectedCourseId && (
        <div className="flex gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'catalog', label: 'E-Learning Catalog', icon: BookOpen },
            { id: 'leaderboard', label: 'Global Hustlers Leaderboard', icon: Trophy },
            { id: 'certificates', label: 'My Verified Certificates', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 pb-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400 font-bold' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Catalog View */}
      {!selectedCourseId ? (
        <div>
          {activeTab === 'catalog' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="glass-card glass-card-hover rounded-[24px] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                        {course.category}
                      </span>
                      <span className="text-xs text-amber-500 font-bold font-mono">★ {course.rating}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{course.title}</h3>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">{course.description}</p>

                    <div className="space-y-1 text-[11px] text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <strong>Instructor:</strong> {course.instructor}
                      </div>
                      <div className="flex items-center gap-1">
                        <strong>XP Reward:</strong> {course.xpReward} XP
                      </div>
                      <div className="flex items-center gap-1">
                        <strong>Lessons:</strong> {course.lessonsCount} Modules
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Progress Bar */}
                    {course.progressPercent > 0 && (
                      <div className="mb-3 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                          <span>Progress</span>
                          <span>{course.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500" style={{ width: `${course.progressPercent}%` }} />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleSelectCourse(course.id)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-850 dark:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {course.progressPercent === 100 ? 'Review Modules' : course.progressPercent > 0 ? 'Resume Lessons' : 'Start Education'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 max-w-xl mx-auto space-y-4">
              <h3 className="font-bold text-slate-950 dark:text-white text-sm border-b pb-2 mb-4">
                Weekly Global Hustlers Ranking
              </h3>
              {[
                { rank: 1, name: 'Eshe Diallo', xp: 4800, badge: '👑 Diamond', color: 'text-amber-500' },
                { rank: 2, name: 'Adisa Kojo', xp: 4200, badge: '🏆 Diamond', color: 'text-slate-400' },
                { rank: 3, name: 'Kidus Tsegaye', xp: 3500, badge: '⭐ Platinum', color: 'text-orange-500' },
                { rank: 4, name: `${user.username} (You)`, xp: user.xp, badge: `${user.rank} Rank`, color: 'text-indigo-500 font-bold' }
              ].map((hustler, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-900 text-xs">
                  <div className="flex gap-3 items-center">
                    <span className="font-mono text-slate-400">#{hustler.rank}</span>
                    <span className={hustler.color}>{hustler.name}</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="text-[10px] text-slate-400">{hustler.badge}</span>
                    <span className="font-mono font-bold text-teal-600">{hustler.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="max-w-3xl mx-auto">
              {activeCertCourse ? (
                <div className="glass-card p-8 rounded-[32px] border-4 border-double border-teal-500/40 text-center relative shadow-lg space-y-6">
                  {/* Watermark badge */}
                  <div className="absolute top-4 right-4 text-[10px] uppercase font-mono font-bold bg-teal-500/10 text-teal-600 px-2.5 py-1 rounded">
                    Security Validated
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-widest font-mono text-teal-500 font-bold">Inertia Academy Verification Certificate</span>
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
                      CERTIFICATE OF VERIFIED MASTERY
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Granted under authoritative cryptographic ledger sync</p>
                  </div>

                  <div className="py-6">
                    <span className="text-xs text-slate-400 italic">This is proudly presented to:</span>
                    <h3 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{user.username}</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-3 leading-relaxed">
                      For successfully completing all specialized modules, micro-quizzes, and live code sandbox compiler assessments for:
                    </p>
                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-2">"{activeCertCourse.title}"</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-900 text-xs">
                    <div>
                      <span className="text-slate-400">Lead Instructor</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{activeCertCourse.instructor}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Verification ID</span>
                      <p className="font-mono font-bold text-teal-500 mt-0.5">INT-CERT-{activeCertCourse.id.toUpperCase()}-2026</p>
                    </div>
                    <div>
                      <span className="text-slate-400">QR Code Secure Block</span>
                      <div className="flex justify-center mt-1">
                        {/* Mock QR mini illustration */}
                        <div className="w-10 h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 p-1 flex flex-wrap gap-0.5">
                          {[1,0,1,1,0,0,1,0,1,1,1,0,0,1,0,1].map((p, i) => (
                            <div key={i} className={`w-1.5 h-1.5 ${p ? 'bg-slate-900' : 'bg-white'}`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 text-center">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="px-4 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg transition-all cursor-pointer"
                    >
                      Print Certificate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 italic glass-card p-8 rounded-[24px]">
                  No verified certificates yet. Complete all lessons inside a course catalog to earn your certified mastery badge.
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ACTIVE INTERACTIVE LESSON ARENA */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left index of modules */}
          <div className="lg:col-span-1 space-y-4">
            <button
              onClick={() => setSelectedCourseId(null)}
              className="text-xs text-indigo-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              ← Back to Catalog
            </button>
            
            <div className="glass-card p-4 rounded-[24px] space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">{selectedCourse.title}</h4>
              <p className="text-[10px] text-slate-400">Modules Roadmap progress:</p>
              
              <div className="space-y-1.5 pt-2">
                {selectedCourse.lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonIdx(idx);
                      // Reset states
                      setCodeAnswer('');
                      setSelectedQuizOpt(null);
                      setQuizSubmitted(false);
                      setMatchSelections({});
                      setSandboxLogs([]);
                      setPlaygroundSuccess(false);
                    }}
                    className={`w-full text-start p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between border ${
                      activeLessonIdx === idx
                        ? 'bg-teal-500/10 border-teal-500 text-teal-600 dark:text-teal-400'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <span>{idx + 1}. {lesson.title}</span>
                    {lesson.completed && <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core Interactive Arena Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-[24px] p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-900">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Module {activeLessonIdx + 1} of {selectedCourse.lessonsCount}
                </span>
                <span className="text-xs font-bold text-amber-500 font-mono">
                  ★ Earn {activeLesson.rewardXp} XP
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-950 dark:text-white text-sm mb-2">{activeLesson.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{activeLesson.content}</p>
              </div>

              {/* DYNAMIC COMPONENT BASED ON INTERACTIVE TYPE */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-900">
                
                {/* 1. CODE PLAYGROUND SANDBOX */}
                {activeLesson.interactiveType === 'playground' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-900 text-slate-300 p-2 rounded-t-lg border-b border-slate-800 font-mono text-[10px]">
                      <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> TypeScript Arena Editor</span>
                      <span>Task: {activeLesson.playgroundTask}</span>
                    </div>
                    <textarea
                      rows={8}
                      value={codeAnswer || activeLesson.playgroundCode}
                      onChange={(e) => setCodeAnswer(e.target.value)}
                      className="w-full font-mono text-xs p-4 bg-slate-950 text-emerald-400 focus:outline-none rounded-b-lg border-x border-b border-slate-800"
                    />

                    {/* Output sandbox logs */}
                    {sandboxLogs.length > 0 && (
                      <div className="bg-slate-950 text-slate-300 p-3 rounded-lg border border-slate-800 font-mono text-[10px] space-y-1">
                        {sandboxLogs.map((log, lIdx) => (
                          <div key={lIdx} className={log.includes('SUCCESS') ? 'text-teal-400' : log.includes('ERROR') ? 'text-rose-500' : ''}>
                            {log}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={handleRunSandbox}
                        disabled={isCompiling}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isCompiling ? 'animate-spin' : ''}`} />
                        {isCompiling ? 'Compiling Route...' : 'Run Code & Test'}
                      </button>

                      <button
                        onClick={handleCompleteLesson}
                        disabled={!playgroundSuccess}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        Complete Module
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. FLASH QUIZ */}
                {activeLesson.interactiveType === 'quiz' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-2">
                      <HelpCircle className="w-4 h-4 text-indigo-500 inline mr-1" />
                      {activeLesson.quiz.question}
                    </h4>
                    
                    <div className="space-y-2">
                      {activeLesson.quiz.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedQuizOpt(oIdx)}
                          className={`w-full text-start p-3 rounded-lg text-xs border transition-all cursor-pointer ${
                            quizSubmitted
                              ? oIdx === activeLesson.quiz.correctAnswer
                                ? 'bg-teal-500/10 border-teal-500 text-teal-600'
                                : selectedQuizOpt === oIdx
                                  ? 'bg-rose-500/10 border-rose-500 text-rose-600'
                                  : 'border-slate-100 text-slate-400'
                              : selectedQuizOpt === oIdx
                                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600'
                                : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {quizSubmitted && (
                      <div className={`p-3 rounded-lg border text-xs leading-relaxed ${quizCorrect ? 'bg-teal-500/10 border-teal-500 text-teal-700' : 'bg-rose-500/10 border-rose-500 text-rose-700'}`}>
                        <strong>{quizCorrect ? 'Correct Option!' : 'Incorrect Choice.'}</strong> {activeLesson.quiz.explanation}
                      </div>
                    )}

                    <div className="flex justify-end gap-3">
                      {!quizSubmitted ? (
                        <button
                          onClick={() => handleQuizSubmit(activeLesson.quiz)}
                          disabled={selectedQuizOpt === null}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg disabled:opacity-50 cursor-pointer"
                        >
                          Submit Quiz
                        </button>
                      ) : (
                        <button
                          onClick={handleCompleteLesson}
                          className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          Complete Module
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. TERM MATCH BOARD (DRAG & DROP CHALLENGE) */}
                {activeLesson.interactiveType === 'drag-drop' && (
                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-400">Match the technologies on the left to their appropriate SaaS descriptions on the right!</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Left terms */}
                      <div className="space-y-2">
                        {activeLesson.matchPairs.map((pair, idx) => (
                          <div
                            key={idx}
                            onClick={() => setDragSelection(pair.left)}
                            className={`p-3 border rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              dragSelection === pair.left
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600'
                                : matchSelections[pair.left]
                                  ? 'border-teal-500 bg-teal-500/10 text-teal-600'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {pair.left} {matchSelections[pair.left] && '✓'}
                          </div>
                        ))}
                      </div>

                      {/* Right descriptions */}
                      <div className="space-y-2">
                        {activeLesson.matchPairs.map((pair, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (dragSelection) {
                                handleMatchPair(dragSelection, pair.right);
                                setDragSelection(null);
                              }
                            }}
                            className="p-3 border border-dashed border-slate-200 dark:border-slate-850 rounded-lg text-xs cursor-pointer hover:bg-slate-50 flex items-center justify-between text-slate-600 dark:text-slate-400"
                          >
                            <span>{pair.right}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleCompleteLesson}
                        disabled={Object.keys(matchSelections).length < activeLesson.matchPairs.length}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        Complete Module
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
