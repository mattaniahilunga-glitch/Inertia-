/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Database, Network, GitPullRequest, Code, Eye, Layers, Compass, Key, Users, Cpu, Calendar, Target, Award, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export default function DeliverablesTab() {
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'schema' | 'api' | 'journeys' | 'roadmap'>('architecture');

  const tabs = [
    { id: 'architecture', label: 'System & Deployment Architecture', icon: Network },
    { id: 'schema', label: 'Database Schema & ERD', icon: Database },
    { id: 'api', label: 'API Specs & Folder Structure', icon: GitPullRequest },
    { id: 'journeys', label: 'User Journeys & Wireframes', icon: Compass },
    { id: 'roadmap', label: 'Roadmap, Sprint Plan & Libraries', icon: Calendar },
  ];

  return (
    <div className="glass-card rounded-[32px] p-6 transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="text-teal-500 w-5 h-5" />
          Technical & Architecture Deliverables Console
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Explore the production-ready system schematics, database specifications, development roadmaps, and UI wires created for INERTIA.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
        {activeSubTab === 'architecture' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Network className="w-4 h-4 text-teal-500" />
                1. System Architecture
              </h3>
              <div className="glass-card p-4 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre">
{`+------------------------------------------------------------------------------------------------------------------------+
|                                                  SYSTEM DEPLOYMENT ARCHITECTURE                                        |
+------------------------------------------------------------------------------------------------------------------------+

[Client Layers]
  Web SPA (React 19 + TypeScript + Vite + TailwindCSS 4 + Framer Motion)
     │   ▲
     │   │ (Encrypted HTTPS Calls with AES-GCM payloads / WS secure transport)
     ▼   │
[Ingress & API Gateway Router]
  Nginx reverse-proxy & SSL Termination (Port 3000 mapping internally to 3000)
     │   ▲
     ▼   │
[Application Server Layer]
  Express Framework + TSX Runtime (Express v4 API Gateway)
     ├── Authentication Guard Module (JWT verification + RSA 2FA validation)
     ├── Gemini Intelligent Recommender (Using Server-Side @google/genai Node SDK)
     ├── Real-time Chat Controller (WebSockets Event Authoritative Handlers)
     └── Google Maps API Endpoint Router (Radius Calculation / Geolocation clustering logic)
     │   ▲
     ▼   │
[Data Cache & Store Layer]
     ├── In-Memory Store (Redis Caching for online statuses & high-volume leaderboards)
     └── Core Persistent Database (PostgreSQL - highly indexed relational architecture)
`}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-indigo-500" />
                10. Deployment Architecture (CI/CD Pipeline)
              </h3>
              <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                A fully automated Github Actions pipeline builds the production Docker image, pushes it to Google Artifact Registry, and deploys to serverless Google Cloud Run.
              </p>
              <div className="glass-card p-4 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre">
{`GitHub Commit -> Run Unit Audits & ESLint -> Run 'esbuild server.ts' Compilation ->
Build Multi-Stage Dockerfile -> Push to Artifact Registry -> Deploy to Serverless Cloud Run (Port 3000)
`}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'schema' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-teal-500" />
                2. Database Schema (Normalized SQL)
              </h3>
              <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                Normalized PostgreSQL structure ensuring integrity constraints and rapid spatial indices for Google Maps tracking.
              </p>
              <div className="glass-card p-4 rounded-xl font-mono text-[11px] overflow-y-auto max-h-80">
{`-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(50) NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  rank VARCHAR(20) DEFAULT 'Bronze',
  daily_streak INTEGER DEFAULT 0,
  balance NUMERIC(15, 2) DEFAULT 0.00,
  role VARCHAR(20) DEFAULT 'Freelancer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Profiles Table (Encrypted Settings)
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  avatar VARCHAR(255),
  skills TEXT[],
  two_factor_secret VARCHAR(100),
  encrypted_key_pair TEXT, -- End-to-End Encryption key
  preferences JSONB DEFAULT '{"darkMode": true, "reducedMotion": false}'
);

-- Courses & Lessons (Inertia Unfazed)
CREATE TABLE courses (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  xp_reward INTEGER DEFAULT 500,
  rating NUMERIC(3,2) DEFAULT 5.00
);

CREATE TABLE lessons (
  id VARCHAR(50) PRIMARY KEY,
  course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  interactive_type VARCHAR(30) NOT NULL
);

-- Jobs (Inertia Hustler)
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  budget NUMERIC(10,2) NOT NULL,
  location VARCHAR(100),
  status VARCHAR(20) DEFAULT 'Open',
  type VARCHAR(20) DEFAULT 'Remote',
  skills_required VARCHAR(50)[]
);

-- Products & Warehouses (Inertia Stack + Google Maps)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  type VARCHAR(15) NOT NULL, -- 'Seller', 'Buyer', 'Warehouse'
  location_name VARCHAR(100) NOT NULL
);

CREATE INDEX idx_products_spatial ON products (lat, lng);
`}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-purple-500" />
                9. Entity-Relationship (ER) Diagram Schema
              </h3>
              <div className="glass-card p-4 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre">
{`   [USERS] 1 ------ 1 [PROFILES]
      |
      +-- 1 ------ * [JOBS] (Postings)
      |
      +-- 1 ------ * [TRANSACTIONS] (Payment Ledger)
      |
      +-- 1 ------ * [CHAT_MESSAGES] (E2E Encrypted)
      |
      +-- 1 ------ * [PRODUCTS] (Inventory Ownership)
`}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'api' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <GitPullRequest className="w-4 h-4 text-teal-500" />
                3. API Architecture Specifications
              </h3>
              <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                Our secure API gateway handles request throttling, JWT checks, and proxies server-side Gemini computations safely.
              </p>
              <div className="glass-card p-4 rounded-xl font-mono text-[11px] overflow-y-auto max-h-60">
{`POST /api/auth/register    - Registers user & generates default E2EE pair
POST /api/auth/login       - Validates credentials & yields JWT (secure cookie)
POST /api/auth/2fa/verify  - Checks TOTP security token payloads

GET  /api/unfazed/courses  - Retrieves course catalog and streak logs
POST /api/unfazed/verify   - Validates code playground compiling state

GET  /api/hustler/jobs     - Searches job listings with optional skill-matching query
POST /api/hustler/match    - Calculates semantic match score using Gemini AI

GET  /api/stack/products   - Google Maps lookup within specified radius filter
POST /api/stack/purchase   - Invokes escrow hold for buyers/sellers

POST /api/sync/preferences - Encrypts and syncs dark mode settings to cloud db
`}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-indigo-500" />
                4. Folder Structure (Full-Stack Monorepo)
              </h3>
              <div className="glass-card p-4 rounded-xl font-mono text-[11px] overflow-y-auto max-h-60">
{`inertia-platform/
├── server.ts              # Express API Server & WebSockets Endpoint
├── package.json           # Unified Dependencies (Express + Vite + React 19)
├── tsconfig.json          # TypeScript configurations
├── vite.config.ts         # Vite bundler configurations (HMR disabled for CPU conservation)
├── src/
│   ├── main.tsx           # React bootstrap entry point
│   ├── App.tsx            # Main App shell (Router state & Unified Auth store)
│   ├── types.ts           # Global strongly typed interfaces
│   ├── index.css          # TailwindCSS 4 import
│   ├── data/
│   │   └── mockData.ts    # Rich, high-fidelity datasets
│   └── components/
│       ├── LandingPage.tsx  # Interactive Startup Landing Page
│       ├── UnfazedApp.tsx   # Gamified Duolingo Education Platform
│       ├── HustlerApp.tsx   # Work Freelance Escrow Marketplace
│       ├── StackApp.tsx     # African Enterprise & Geolocation Map Store
│       ├── SocialHub.tsx    # Facebook-messenger chat system with local E2EE
│       ├── UserAccount.tsx  # Wallet, Profile, 2FA, & Secure Cryptography
│       └── Footer.tsx       # Creator info (Mattaniah Ilunga) and Issue report form
`}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'journeys' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-teal-500" />
                7. User Journeys
              </h3>
              <div className="glass-card p-4 rounded-xl text-[11px] space-y-4">
                <div>
                  <span className="font-bold text-teal-600 dark:text-teal-400">Path A: The Skill Hustler Accelerator</span>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    1. A learner joins the platform with zero coding skills. The recommendation system recommends <strong>Inertia Unfazed</strong>.<br />
                    2. Learner completes interactive lessons, gains 1,200 XP, climbs up to Silver Rank, and unlocks a verified <strong>Completion Certificate</strong> with a QR code.<br />
                    3. They switch to <strong>Inertia Hustler</strong>, where their newly verified skills are mapped to remote job contracts automatically.<br />
                    4. They secure a $2,400 contract with Sahara Crafts, submit work, and the client releases secure escrow payouts straight to their wallet.
                  </p>
                </div>
                <div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Path B: Local Sourcing & Logistics</span>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    1. A business owner registers a textile store in Lagos Port on <strong>Inertia Stack</strong>.<br />
                    2. Nearby wholesale buyers filter by a 20km radius using the <strong>Google Maps interface</strong>.<br />
                    3. They purchase Ankara print fabric, tracking shipping paths from the nearby regional fulfillment center warehouse in real-time.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-purple-500" />
                5 & 6. Wireframes & UI Component Hierarchy
              </h3>
              <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                Visual mockup showing our bento-grid modular hierarchy.
              </p>
              <div className="glass-card p-4 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre">
{`[App Shell Header: Universal Wallet & Preference controls]
-------------------------------------------------------------------------
[Landing Hero] -> Displays interactive recommend machine
├── [Unfazed Course Grid] -> [Course Details] -> [Lesson Sidebar + Interactive Arena]
│                                               ├── Playgrounds & Sandbox Run Action
│                                               └── Drag & Drop match panels
├── [Hustler Job Board] -> [Contract Card] -> [Interactive AI Skills Assessor]
└── [Stack Map Canvas] -> [Google Maps Container with radius slider & listing cluster]
`}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'roadmap' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-teal-500" />
                11 & 12. Development Roadmap & Sprint Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-2">Sprint 1-2: Foundation & Secure Sync</h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <li>Database modeling & JWT authentication cookies configuration</li>
                    <li>End-to-end local key pair storage for chats & dark preference setups</li>
                    <li>Google Maps platform API integration & location radius calculations</li>
                  </ul>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-2">Sprint 3-4: Products Synergy & AI Features</h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <li>Interactive code compilers & matching boards inside Unfazed</li>
                    <li>Gemini-powered semantic skill-matching scores inside Hustler</li>
                    <li>Logistics warehouse routing and automated escrow lock/releases</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-indigo-500" />
                  13. Feature Roadmap
                </h3>
                <div className="glass-card p-4 rounded-xl text-[11px] space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Phase 1 (Q1)</span>
                    <span className="text-teal-600 dark:text-teal-400 font-mono">Completed</span>
                  </div>
                  <p className="text-slate-400">E ecosystem wireframes, core routing frameworks, database specs and responsive designs.</p>
                  <div className="flex justify-between mt-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Phase 2 (Q2-Q3)</span>
                    <span className="text-amber-500 font-mono">In Progress</span>
                  </div>
                  <p className="text-slate-400">Escrow smart automation, live video chat setups, real African regional mobile money integrations.</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  14. Recommended Production Libraries
                </h3>
                <div className="glass-card p-4 rounded-xl text-[11px] space-y-1.5 text-slate-500 dark:text-slate-400">
                  <div className="flex gap-2"><strong>@google/genai:</strong> Modernized server-side AI interface</div>
                  <div className="flex gap-2"><strong>lucide-react:</strong> Premium, high-contrast crisp vector iconography</div>
                  <div className="flex gap-2"><strong>motion/react:</strong> Sophisticated animation frames and responsive drawer slides</div>
                  <div className="flex gap-2"><strong>d3 / recharts:</strong> Rich learning heatmaps and financial analytics metrics</div>
                  <div className="flex gap-2"><strong>express:</strong> Robust router and web sockets handling</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
