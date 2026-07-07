/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, Job, Product, SocialPost, ChatChannel, Transaction, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-101',
  email: 'mattaniah.ilunga@email.com',
  username: 'mattaniah_ilunga',
  bio: 'Full-stack software architect & fintech builder scaling digital infrastructure solutions in Sub-Saharan Africa.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  xp: 1250,
  level: 1,
  rank: 'Bronze',
  dailyStreak: 3,
  lastActive: new Date().toISOString(),
  balance: 450.00,
  skills: ['TypeScript', 'React', 'Tailwind CSS', 'Node.js', 'Express', 'Cryptography'],
  role: 'Freelancer',
  twoFactorEnabled: false,
  preferences: {
    darkMode: true,
    reducedMotion: false,
    highContrast: false,
    language: 'en'
  }
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'unfazed-prog-101',
    title: 'Modern Web Architecture & Scaling',
    category: 'Programming',
    instructor: 'Adisa Kojo',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.9,
    xpReward: 1200,
    lessonsCount: 3,
    progressPercent: 0,
    description: 'Learn to build, deploy, and scale high-throughput React & Node apps capable of handling millions of requests with optimal caching.',
    benefits: ['Understand server-side rendering', 'Master Express middleware optimization', 'Implement secure JWT-based systems'],
    lessons: [
      {
        id: 'unfazed-prog-101-l1',
        title: 'Building Scalable Full-Stack Pipelines',
        category: 'Programming',
        duration: '15 mins',
        rewardXp: 400,
        completed: false,
        content: 'To construct high-performance apps, your application server must balance synchronous workloads asynchronously. By offloading tasks onto message queues and utilizing lightweight, non-blocking single-threaded runtimes like Node.js, we can maintain exceptional throughput. Learn the fundamentals of event-loop scheduling, non-blocking operations, and route optimization.',
        interactiveType: 'playground',
        playgroundCode: `// Scale this fast HTTP route by returning a 200 OK!
import express from 'express';
const app = express();

app.get('/api/health', (req, res) => {
  // TODO: Send JSON payload { status: 'scalable' }
  res.json({ status: 'scalable' });
});
`,
        playgroundTask: 'Complete the JSON output status code to scale and boot our applet!'
      },
      {
        id: 'unfazed-prog-101-l2',
        title: 'API Authentication & Integrity Quiz',
        category: 'Programming',
        duration: '10 mins',
        rewardXp: 400,
        completed: false,
        content: 'Understand why JWT (JSON Web Tokens) are useful for stateless auth, yet why token revocation lists are required for true security in case of token hijacking.',
        interactiveType: 'quiz',
        quiz: {
          question: 'Which of the following is a key advantage of stateless JWT Authentication over stateful Session cookies?',
          options: [
            'JWTs are naturally self-contained, meaning the database does not need to be queried on every single API request',
            'JWTs automatically rotate their secret encryption keys every 5 seconds on the user browser',
            'JWTs cannot be viewed by browser extensions or dev tools',
            'JWTs completely eliminate the threat of Cross-Site Scripting (XSS)'
          ],
          correctAnswer: 0,
          explanation: 'Because JWTs are self-contained and signed cryptographic payloads, the backend can trust the claims without querying the DB every time. However, revoking them early requires custom blacklist storage.'
        }
      },
      {
        id: 'unfazed-prog-101-l3',
        title: 'Matching Full-Stack Terms',
        category: 'Programming',
        duration: '12 mins',
        rewardXp: 400,
        completed: false,
        content: 'Let\'s test your foundational knowledge by matching backend technologies to their core architectural purposes!',
        interactiveType: 'drag-drop',
        matchPairs: [
          { left: 'Vite', right: 'Fast Frontend Build Tool' },
          { left: 'Redis', right: 'In-Memory Key-Value Caching' },
          { left: 'Express', right: 'Robust Node.js Router' },
          { left: 'PostgreSQL', right: 'Relational ACID Storage' }
        ]
      }
    ]
  },
  {
    id: 'unfazed-sec-201',
    title: 'Offensive Cybersecurity & E2EE Audits',
    category: 'Cybersecurity',
    instructor: 'Eshe Diallo',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 4.8,
    xpReward: 1500,
    lessonsCount: 2,
    progressPercent: 0,
    description: 'Master the elements of digital defense: End-to-End Encryption, SQL injection countermeasures, XSS prevention, and automated pen-testing.',
    benefits: ['Configure RSA/AES hybrid key pairs', 'Defend against CORS breaches', 'Audit backend request payloads'],
    lessons: [
      {
        id: 'unfazed-sec-201-l1',
        title: 'Cryptographic Architecture Quiz',
        category: 'Cybersecurity',
        duration: '15 mins',
        rewardXp: 500,
        completed: false,
        content: 'Before we build an end-to-end encrypted messaging pipeline, we must grasp how asymmetric (public-private) and symmetric (shared AES key) cryptosystems are combined.',
        interactiveType: 'quiz',
        quiz: {
          question: 'How does high-speed End-to-End Cryptography (E2EE) prevent heavy servers from slowing down while keeping messages secure?',
          options: [
            'By using RSA to encrypt the actual 10GB file attachments directly',
            'By encrypting the payload with a symmetric key (AES), then encrypting that AES key using the recipient\'s public key (RSA)',
            'By sending raw passwords to the database to be hashed again by the client',
            'By disabling HTTPS certificates to reduce handshake overhead'
          ],
          correctAnswer: 1,
          explanation: 'This hybrid encryption model is standard: fast AES handles the payload bulk, while RSA safely transfers the AES session keys between entities.'
        }
      },
      {
        id: 'unfazed-sec-201-l2',
        title: 'Penetration Testing Sandbox',
        category: 'Cybersecurity',
        duration: '20 mins',
        rewardXp: 1000,
        completed: false,
        content: 'Learn how SQL injection occurs when input text is concatenated directly into raw query strings instead of utilizing parameterized query fields.',
        interactiveType: 'playground',
        playgroundCode: `// Secure this SQL query to prevent Injection
function queryUser(userId: string) {
  // Bad: "SELECT * FROM users WHERE id = '" + userId + "'"
  // Good: Use parameterized parameters
  const sql = "SELECT * FROM users WHERE id = $1";
  return { sql, parameters: [userId] };
}
`,
        playgroundTask: 'Analyze the query function and ensure parameters are safely bound.'
      }
    ]
  },
  {
    id: 'unfazed-design-301',
    title: 'Elite UI/UX & Design Language Systems',
    category: 'UI/UX',
    instructor: 'Kidus Tsegaye',
    instructorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    rating: 5.0,
    xpReward: 1000,
    lessonsCount: 1,
    progressPercent: 0,
    description: 'Unveil the secrets of high-converting SaaS interfaces: fluid responsive design, Apple-like spacing margins, and accessible typography.',
    benefits: ['Understand fluid fluid layouts', 'Design responsive bento grids', 'Ensure WCAG accessible color contrasts'],
    lessons: [
      {
        id: 'unfazed-design-301-l1',
        title: 'SaaS Layout Vocabulary Match',
        category: 'UI/UX',
        duration: '10 mins',
        rewardXp: 1000,
        completed: false,
        content: 'Match the design terminology to its functional impact on SaaS users.',
        interactiveType: 'drag-drop',
        matchPairs: [
          { left: 'Negative Space', right: 'Reduces cognitive clutter' },
          { left: 'Bento Grid', right: 'Organizes diverse data cards' },
          { left: 'Micro-Interactions', right: 'Provides tactile hover feedback' },
          { left: 'Elegance', right: 'Sticks to a custom off-white/charcoal palette' }
        ]
      }
    ]
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-001',
    title: 'E-Commerce Frontend React Architect',
    company: 'Sahara Crafts Ltd',
    budget: 2400,
    clientName: 'Nesta Amari',
    location: 'Nairobi, Kenya (Hybrid)',
    status: 'Open',
    type: 'Contract',
    category: 'Web Development',
    skillsRequired: ['React', 'TypeScript', 'TailwindCSS'],
    description: 'We need an experienced developer to redesign our high-converting checkout flow. Integrate responsive maps filtering and custom local payments. Must have completed Web Architecture and scaling modules inside Continuum Unfazed.',
    postedAt: '2026-07-02T10:00:00Z',
    matchedScore: 92
  },
  {
    id: 'job-002',
    title: 'Asymmetric Cryptography API Architect',
    company: 'SecuVault Africa',
    budget: 4500,
    clientName: 'Yemi Adebayo',
    location: 'Lagos, Nigeria (Remote)',
    status: 'Open',
    type: 'Full-time',
    category: 'Cybersecurity',
    skillsRequired: ['Node.js', 'Express', 'Cryptography'],
    description: 'Looking for a senior security specialist to construct an end-to-end encrypted messaging channel and cloud storage vault backups. Skills verified inside Unfazed cybersecurity roadmap are a strong advantage.',
    postedAt: '2026-07-03T14:30:00Z',
    matchedScore: 85
  },
  {
    id: 'job-003',
    title: 'Product Catalog Brand Illustrator',
    company: 'Ankara Creative House',
    budget: 850,
    clientName: 'Fatoumata Dia',
    location: 'Dakar, Senegal (Remote)',
    status: 'In Progress',
    type: 'Gig work',
    category: 'Graphic Design',
    skillsRequired: ['UI/UX', 'Graphic Design'],
    description: 'We need a set of vector illustrations representing our high-quality African fabrics. These illustrations will be displayed on local product stores inside Continuum Stack. Interactive visual feedback required.',
    postedAt: '2026-07-03T18:00:00Z',
    matchedScore: 78
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'stack-prod-001',
    title: 'Organic Kenya AA Coffee Beans',
    storeName: 'Nyeri Highlands Farm',
    price: 18.5,
    currency: 'USD',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    lat: -1.2921, // Nairobi Area
    lng: 36.8219,
    type: 'Seller',
    category: 'Agriculture',
    stock: 120,
    locationName: 'Nairobi, Kenya',
    description: 'Premium organic whole coffee beans with chocolatey undertones, harvested by multi-generational family farms in high-altitude volcanic soil.'
  },
  {
    id: 'stack-prod-002',
    title: 'Handwoven Ankara Print Fabrics',
    storeName: 'Lagos Textile Emporium',
    price: 45.0,
    currency: 'USD',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400',
    lat: 6.5244, // Lagos Area
    lng: 3.3792,
    type: 'Seller',
    category: 'Apparel',
    stock: 85,
    locationName: 'Lagos, Nigeria',
    description: 'Exquisite, authentic hand-waxed Ankara cotton panels featuring traditional Yoruba symbols and incredibly resilient vibrant colors.'
  },
  {
    id: 'stack-prod-003',
    title: 'Handcrafted Ebony Wood Statues',
    storeName: 'Kamba Woodcarvers Guild',
    price: 130.0,
    currency: 'USD',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=400',
    lat: -1.3100, // Near Nairobi
    lng: 36.8500,
    type: 'Seller',
    category: 'Art & Crafts',
    stock: 15,
    locationName: 'Mombasa Road, Kenya',
    description: 'Polished ebony hardwood sculptures carefully carved by local masters, representing traditional East African dynamic heritage.'
  },
  {
    id: 'stack-warehouse-001',
    title: 'Continuum Stack Fulfillment Center - West',
    storeName: 'Continuum Logistics Group',
    price: 0,
    currency: 'USD',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
    lat: 6.4500, // Lagos
    lng: 3.4000,
    type: 'Warehouse',
    category: 'Logistics',
    stock: 10000,
    locationName: 'Lagos Port, Nigeria',
    description: 'State-of-the-art secure regional distribution warehouse. Features temperature-controlled storage and automated tracking.'
  },
  {
    id: 'stack-buyer-001',
    title: 'Sourcing Agency: Johannesburg Curios',
    storeName: 'Mahlangu Distributors',
    price: 0,
    currency: 'USD',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400',
    lat: -26.2041, // Johannesburg
    lng: 28.0473,
    type: 'Buyer',
    category: 'Retail',
    stock: 0,
    locationName: 'Johannesburg, South Africa',
    description: 'Wholesale buying agency looking to purchase organic coffee, dried fruits, and high-quality handcrafted furniture.'
  }
];

export const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    author: 'Kofi Mensah',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    content: 'Just launched my first product store on Continuum Stack! 🎉 Sourcing handwoven baskets directly from our cooperative in Kumasi. The integrated Google Maps nearby search makes local pickups incredibly seamless. Thanks to the Web Scaling lessons on Continuum Unfazed, I successfully built my inventory API!',
    timestamp: '2026-07-03T20:15:00Z',
    likes: 42,
    hasLiked: false,
    comments: [
      {
        id: 'comm-1',
        author: 'Fatima Alao',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        content: 'Incredible work, Kofi! Let\'s coordinate a delivery through the Lagos fulfillment center!',
        timestamp: '2026-07-03T21:00:00Z'
      }
    ],
    reactions: { '👍': 14, '🔥': 8, '🚀': 5 }
  },
  {
    id: 'post-2',
    author: 'Eshe Diallo',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    content: 'Security Alert: For everyone building smart contracts and payment apps inside Continuum Hustler, make sure to parameterize all external database inputs! E2EE key pairs should be stored in browser SessionStorage and never printed inside telemetry console logs.',
    timestamp: '2026-07-04T01:30:00Z',
    likes: 29,
    hasLiked: false,
    comments: [],
    reactions: { '💡': 12, '🛡️': 9, '👍': 4 }
  }
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'chan-general',
    name: 'Continuum Tech Community',
    type: 'community',
    lastMessageAt: '2026-07-04T03:00:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1',
        senderId: 'sys-bot',
        senderName: 'Continuum Bot',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        content: 'Welcome to the unified Continuum community channel! Learn, Hustle, Build, and Trade secure here.',
        timestamp: '2026-07-04T01:00:00Z',
        encrypted: false,
        read: true
      },
      {
        id: 'msg-2',
        senderId: 'kidus-ux',
        senderName: 'Kidus Tsegaye',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        content: 'I\'ve uploaded the vector wireframes and deployment schematics in the Developer Console tab. Feel free to review the ER diagrams!',
        timestamp: '2026-07-04T02:45:00Z',
        encrypted: false,
        read: true
      }
    ]
  },
  {
    id: 'chan-adis-direct',
    name: 'Adisa Kojo (Encrypted)',
    type: 'direct',
    lastMessageAt: '2026-07-04T03:20:00Z',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-3',
        senderId: 'adis-instructor',
        senderName: 'Adisa Kojo',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        content: 'U2FsdGVkX195M07uYmZ6dHNhZkdMZXpSZnN1cGVsZUNyYXB0bzE=', // encrypted mockup string
        timestamp: '2026-07-04T03:15:00Z',
        encrypted: true,
        read: false
      }
    ]
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    type: 'deposit',
    amount: 1500,
    currency: 'USD',
    status: 'Completed',
    description: 'Bank Card deposit - Visa ***4231',
    timestamp: '2026-07-01T09:00:00Z'
  },
  {
    id: 'tx-002',
    type: 'escrow_lock',
    amount: 850,
    currency: 'USD',
    status: 'Completed',
    description: 'Escrow lock - Product Catalog Brand Illustrator (Job #job-003)',
    timestamp: '2026-07-03T18:10:00Z'
  },
  {
    id: 'tx-003',
    type: 'purchase',
    amount: 37,
    currency: 'USD',
    status: 'Completed',
    description: 'Purchase: Organic Kenya AA Coffee (Nyeri Highlands)',
    timestamp: '2026-07-04T02:10:00Z'
  }
];
