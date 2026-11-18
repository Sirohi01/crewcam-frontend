'use client';

import React from 'react';
import {
  ArrowLeft, Square, Phone, Mail, MapPin, Link2, ExternalLink,
  CheckCircle2, Clock, Check, Info, FileText, Share2, HelpCircle,
  FileQuestion, Bold, Italic, Underline, List, ListOrdered, Code,
  ThumbsUp, Flag, StopCircle, User, Sparkles, X, Loader2, AlertTriangle,
  Briefcase, Award
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

interface Round2Question {
  category: string;
  text: string;
  insight: string;
  difficulty?: string;
  manualOverride?: string;
  [key: string]: any;
}

export function getDifficultyTier(experienceRaw: string | number = ''): {
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  years: number;
  label: string;
  badgeColor: string;
  description: string;
} {
  const years = parseFloat(String(experienceRaw || '').replace(/[^0-9.]/g, '')) || 0;
  if (years < 2) {
    return {
      level: 'Junior',
      years,
      label: 'Junior / Entry (0-2 Yrs)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Foundational difficulty: core mechanics, syntax, practical problem-solving & clean coding'
    };
  }
  if (years >= 2 && years < 6) {
    return {
      level: 'Mid',
      years,
      label: 'Mid-Level (3-5 Yrs)',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Moderate difficulty: real-world feature delivery, optimization, API design & error handling'
    };
  }
  if (years >= 6 && years < 10) {
    return {
      level: 'Senior',
      years,
      label: 'Senior Level (6-9 Yrs)',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'High difficulty: scalable architecture, database tuning, trade-offs, security & concurrency'
    };
  }
  return {
    level: 'Lead',
    years,
    label: 'Lead / Principal (10+ Yrs)',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Expert difficulty: enterprise systems, high availability, tech governance & engineering leadership'
  };
}

export function getRoleSpecificTechnicalQuestions(
  jobRole: string = '',
  experienceRaw: string | number = '',
  skills: string[] = [],
  jdSummary: string = ''
): Round2Question[] {
  const role = jobRole.trim() || 'Software Engineer';
  const lower = role.toLowerCase();
  const diff = getDifficultyTier(experienceRaw);
  const topSkills = skills.filter(Boolean).slice(0, 3).join(', ');
  const skillNote = topSkills ? ` (specifically involving ${topSkills} as outlined in the JD)` : '';

  // 1. Frontend / React / UI / Web
  if (lower.includes('frontend') || lower.includes('react') || lower.includes('ui developer') || lower.includes('web developer')) {
    if (diff.level === 'Junior') {
      return [
        {
          category: 'Core Fundamentals & Syntax',
          difficulty: diff.label,
          text: `As a junior ${role}, explain how the Virtual DOM in React updates the real DOM, and describe the differences between props and state${skillNote}.`,
          insight: `Evaluates foundational understanding of React mechanics, unidirectional data flow, and component lifecycle basics.`
        },
        {
          category: 'Form Handling & State',
          difficulty: diff.label,
          text: `How do you build controlled form inputs in React, validate user input on the fly, and prevent common re-rendering issues?`,
          insight: `Checks practical hands-on capability to build standard interactive UI forms cleanly.`
        },
        {
          category: 'Responsive Styling & Layout',
          difficulty: diff.label,
          text: `Describe how you use Flexbox, CSS Grid, and media queries (e.g. Tailwind or modern CSS) to build a mobile-first responsive layout.`,
          insight: `Assesses basic layout principles, fluid design, and clean cross-device rendering.`
        },
        {
          category: 'Data Fetching & Error Handling',
          difficulty: diff.label,
          text: `How do you fetch data from a REST API using fetch/Axios inside useEffect, and how do you display loading and error states to the user?`,
          insight: `Checks basic asynchronous JavaScript, promise resolution, and user experience awareness.`
        },
        {
          category: 'Code Quality & Debugging',
          difficulty: diff.label,
          text: `Walk through your process of debugging a JavaScript console error or broken UI component in Chrome DevTools.`,
          insight: `Tests troubleshooting mindset, breakpoint debugging, and practical problem resolution.`
        }
      ];
    }
    if (diff.level === 'Mid') {
      return [
        {
          category: 'State Architecture & Reusability',
          difficulty: diff.label,
          text: `As a ${role} with ${diff.years} years of experience, how do you decide when to use local state, Context API, or dedicated state stores (Zustand/Redux Toolkit)${skillNote}?`,
          insight: `Evaluates scalable component hierarchy design, avoiding prop drilling, and state co-location principles.`
        },
        {
          category: 'Performance Profiling & Optimization',
          difficulty: diff.label,
          text: `What techniques and profiling tools do you use to diagnose unnecessary re-renders, optimize heavy lists (virtualization), and optimize bundle sizes?`,
          insight: `Assesses useMemo/useCallback discipline, React Profiler, lazy loading, and code-splitting.`
        },
        {
          category: 'Server State & Cache Management',
          difficulty: diff.label,
          text: `How do you implement optimistic UI updates, background re-validation, and request deduplication using TanStack Query or RTK Query?`,
          insight: `Checks modern data synchronization patterns, client-side caching, and resilient network error recovery.`
        },
        {
          category: 'Component Library & Accessibility',
          difficulty: diff.label,
          text: `How do you design accessible compound components (modals, dropdowns) adhering to WCAG 2.1 AA keyboard navigation and screen-reader standards?`,
          insight: `Evaluates design system contributions, a11y compliance, semantic HTML, and multi-device usability.`
        },
        {
          category: 'Automated Testing & Security',
          difficulty: diff.label,
          text: `What security practices do you enforce to prevent XSS and CSRF attacks on the client side, and how do you approach automated testing with Jest and Playwright/Cypress?`,
          insight: `Tests code quality assurance, defensive coding against web vulnerabilities, and automated test coverage.`
        }
      ];
    }
    if (diff.level === 'Senior') {
      return [
        {
          category: 'Micro-Frontends & Monorepo Architecture',
          difficulty: diff.label,
          text: `As a senior ${role}, how would you architect a large-scale frontend monorepo (Turborepo/Nx) with shared UI packages and independent squad deployment${skillNote}?`,
          insight: `Evaluates modular architecture, Module Federation, dependency management, and build cache optimization.`
        },
        {
          category: 'Core Web Vitals & Rendering Paradigms',
          difficulty: diff.label,
          text: `Deeply analyze your strategy for optimizing Core Web Vitals (LCP, INP, CLS) in Next.js/SSR applications, including streaming SSR and selective hydration.`,
          insight: `Assesses modern server-side rendering mechanics, critical CSS inlining, font optimization, and JavaScript execution budget.`
        },
        {
          category: 'Design Systems at Scale',
          difficulty: diff.label,
          text: `How do you architect a multi-brand, tokenized design system consumed by 5+ engineering teams, ensuring backward compatibility during major version upgrades?`,
          insight: `Checks design token architecture (Figma Tokens/Style Dictionary), semantic versioning, and developer experience governance.`
        },
        {
          category: 'Real-Time Sync & Offline Fault Tolerance',
          difficulty: diff.label,
          text: `How do you design bi-directional WebSocket state sync with client-side indexedDB storage, handling network dropouts, reconnection storms, and conflict resolution?`,
          insight: `Tests distributed client architecture, CRDT/operational transform basics, and high-reliability offline capabilities.`
        },
        {
          category: 'Frontend Security & Governance',
          difficulty: diff.label,
          text: `What CSP (Content Security Policy) headers, token rotation mechanisms, and automated dependency supply-chain security gates (SBOM) do you enforce in CI/CD?`,
          insight: `Evaluates defense-in-depth security governance, third-party script isolation, and engineering standards enforcement.`
        }
      ];
    }
    // Lead / Architect
    return [
      {
        category: 'Enterprise Frontend Strategy',
        difficulty: diff.label,
        text: `As a Principal/Lead ${role}, how do you formulate an enterprise-wide frontend technology roadmap, evaluating build vs buy and multi-year migration strategies without disrupting delivery${skillNote}?`,
        insight: `Assesses technology vision, risk mitigation during legacy modernizations, and alignment with corporate product strategy.`
      },
      {
        category: 'Performance Engineering & Memory Profiling',
        difficulty: diff.label,
        text: `How do you diagnose and eliminate memory leaks in long-lived single-page enterprise applications, utilizing Web Workers and WebAssembly for compute-intensive tasks?`,
        insight: `Evaluates low-level browser engine internals, heap snapshot profiling, garbage collection mechanics, and advanced concurrency.`
      },
      {
        category: 'Cross-Platform Unified Architecture',
        difficulty: diff.label,
        text: `How do you architect unified API contracts (GraphQL federation / gRPC-Web) and code sharing across Web, Mobile (React Native), and desktop apps?`,
        insight: `Checks cross-platform engineering leverage, API contract governance, and reducing engineering redundancy across platforms.`
      },
      {
        category: 'Edge Compute & Global CDN Strategy',
        difficulty: diff.label,
        text: `Describe your global edge computing architecture (Cloudflare Workers / Vercel Edge) for personalization, localized routing, and multi-region failover.`,
        insight: `Tests global infrastructure architecture, zero-cold-start edge execution, and multi-region resilience.`
      },
      {
        category: 'Engineering Culture & Mentorship',
        difficulty: diff.label,
        text: `How do you balance tech debt repayment against product delivery velocity across 50+ engineers, while cultivating technical mentorship and quality standards?`,
        insight: `Evaluates executive technical leadership, organizational impact, engineering talent development, and high-performance culture.`
      }
    ];
  }

  // 2. Backend / Node.js / Java / Python / Database
  if (lower.includes('backend') || lower.includes('node') || lower.includes('java') || lower.includes('python') || lower.includes('api') || lower.includes('database')) {
    if (diff.level === 'Junior') {
      return [
        {
          category: 'API Fundamentals & HTTP Protocol',
          difficulty: diff.label,
          text: `As a junior ${role}, explain RESTful API design principles, standard HTTP status codes (200, 201, 400, 401, 403, 404, 500), and request payload validation${skillNote}.`,
          insight: `Checks basic protocol understanding, REST conventions, and server-side request validation.`
        },
        {
          category: 'Database Basics & CRUD',
          difficulty: diff.label,
          text: `Describe the difference between SQL and NoSQL databases, and write or explain a SQL query using JOIN, WHERE, and GROUP BY.`,
          insight: `Evaluates basic data retrieval, relational modeling fundamentals, and schema querying.`
        },
        {
          category: 'Asynchronous Programming',
          difficulty: diff.label,
          text: `Explain how the Node.js event loop handles non-blocking I/O operations and how Promises and async/await help prevent callback hell.`,
          insight: `Tests fundamental language runtime understanding, asynchronous control flow, and error handling.`
        },
        {
          category: 'Authentication Basics',
          difficulty: diff.label,
          text: `How does JWT authentication work between a client and a backend server, and why should passwords be hashed using algorithms like bcrypt?`,
          insight: `Assesses basic security hygiene, token lifecycle understanding, and password storage best practices.`
        },
        {
          category: 'Error Handling & Logging',
          difficulty: diff.label,
          text: `How do you design centralized error-handling middleware in an API framework so clients receive clear, safe error responses without leaking stack traces?`,
          insight: `Checks practical software craftsmanship and clean error response design.`
        }
      ];
    }
    if (diff.level === 'Mid') {
      return [
        {
          category: 'Database Optimization & Indexing',
          difficulty: diff.label,
          text: `As a ${role} with ${diff.years} years of experience, describe your indexing strategy for high-frequency queries and how you use EXPLAIN plans to eliminate full table scans${skillNote}.`,
          insight: `Evaluates query execution plan analysis, composite B-Tree indexes, and database performance tuning.`
        },
        {
          category: 'Asynchronous Queues & Background Jobs',
          difficulty: diff.label,
          text: `How do you implement background job queues using Redis (e.g. BullMQ or Celery) to handle heavy tasks without blocking user-facing API threads?`,
          insight: `Assesses asynchronous background processing, job retries, dead-letter queues, and concurrency control.`
        },
        {
          category: 'Transactions & Concurrency',
          difficulty: diff.label,
          text: `How do you handle database transactions (ACID), rollbacks, and optimistic vs pessimistic locking to prevent race conditions during concurrent updates?`,
          insight: `Checks data integrity, isolation levels, race-condition mitigation, and deadlock avoidance.`
        },
        {
          category: 'API Security & Authorization',
          difficulty: diff.label,
          text: `How do you implement Role-Based Access Control (RBAC), rate-limiting middleware, and protection against SQL injection and mass-assignment vulnerabilities?`,
          insight: `Evaluates API defense mechanisms, authorization enforcement, and OWASP Top 10 mitigation.`
        },
        {
          category: 'Testing & Containerization',
          difficulty: diff.label,
          text: `Describe how you write automated integration tests with mock database containers and how you optimize production Docker container images for minimal footprint.`,
          insight: `Tests automated test coverage, test isolation, and modern container deployment readiness.`
        }
      ];
    }
    if (diff.level === 'Senior') {
      return [
        {
          category: 'Distributed System Design',
          difficulty: diff.label,
          text: `As a senior ${role}, architect a high-throughput, fault-tolerant backend capable of handling 50,000 requests/sec with sub-50ms p99 latency${skillNote}.`,
          insight: `Evaluates microservices partitioning, load balancing, stateless API design, connection pooling, and horizontal scaling.`
        },
        {
          category: 'Event-Driven Architecture & Kafka',
          difficulty: diff.label,
          text: `How do you design an event-driven system with Kafka/EventBridge, ensuring idempotency, exactly-once processing semantics, and managing dead-letter queues?`,
          insight: `Assesses streaming event processing, consumer group scaling, partition keys, and out-of-order message handling.`
        },
        {
          category: 'Multi-Tier Caching & Invalidation',
          difficulty: diff.label,
          text: `Describe your multi-tier caching architecture (in-memory + Redis cluster + CDN), and how you prevent cache stampede (thundering herd), penetration, and avalanche?`,
          insight: `Tests advanced distributed caching, mutex locks, probabilistic early expiration, and cache invalidation strategies.`
        },
        {
          category: 'Database Sharding & Read/Write Splitting',
          difficulty: diff.label,
          text: `How do you implement database read/write replicas with replication lag handling, and what partitioning/sharding keys do you choose for multi-terabyte datasets?`,
          insight: `Checks database scalability at volume, replication consistency trade-offs, and horizontal partitioning.`
        },
        {
          category: 'Observability & Zero-Downtime Migration',
          difficulty: diff.label,
          text: `How do you execute zero-downtime database schema migrations on a 24/7 live database while maintaining OpenTelemetry distributed tracing across all downstream services?`,
          insight: `Evaluates expand-and-contract migration patterns, distributed tracing, and production resilience under continuous release cycles.`
        }
      ];
    }
    // Lead / Architect
    return [
      {
        category: 'Enterprise Backend Architecture',
        difficulty: diff.label,
        text: `As a Principal/Lead Architect for ${role}, how do you design an active-active multi-region distributed backend ensuring CAP theorem trade-offs and zero-RPO disaster recovery${skillNote}?`,
        insight: `Evaluates enterprise architecture, multi-region replication, global traffic routing, and mission-critical availability.`
      },
      {
        category: 'High-Concurrency Concurrency & Kernel Tuning',
        difficulty: diff.label,
        text: `How do you tune TCP socket buffers, Linux kernel parameters, and async I/O subsystems to maximize throughput on multi-core bare-metal or cloud clusters?`,
        insight: `Assesses deep systems programming, OS networking stack internals, socket reuse, and hardware resource saturation.`
      },
      {
        category: 'Data Governance & Global Compliance',
        difficulty: diff.label,
        text: `How do you architect data residency, end-to-end field-level encryption, and automated audit trails to comply with GDPR, HIPAA, or financial regulations across multi-tenant databases?`,
        insight: `Checks cryptographic architecture, envelope encryption, tenant isolation, and regulatory compliance.`
      },
      {
        category: 'Cost Optimization & FinOps',
        difficulty: diff.label,
        text: `Describe how you reduced cloud compute and database infrastructure spend by 40%+ through serverless, spot instances, query optimization, and resource rightsizing.`,
        insight: `Evaluates cloud financial engineering, architectural efficiency, and aligning technical cost with revenue metrics.`
      },
      {
        category: 'Engineering Standards & Governance',
        difficulty: diff.label,
        text: `How do you establish organization-wide API guidelines, microservice deprecation policies, and technical radar evaluation across 100+ backend engineers?`,
        insight: `Tests architectural governance, technical consensus building, engineering maturity frameworks, and executive leadership.`
      }
    ];
  }

  // 3. Full Stack Developer
  if (lower.includes('full stack') || lower.includes('fullstack') || lower.includes('mern') || lower.includes('mean')) {
    if (diff.level === 'Junior') {
      return [
        {
          category: 'Full-Stack Data Flow',
          difficulty: diff.label,
          text: `As a junior ${role}, walk through the lifecycle of a user creating a record in a React frontend, sending it to a Node/Express backend, and saving it to MongoDB/PostgreSQL${skillNote}.`,
          insight: `Evaluates full-stack connectivity, request-response lifecycle, and basic database persistence.`
        },
        {
          category: 'Environment Variables & Config',
          difficulty: diff.label,
          text: `How do you manage secret keys and database URLs using environment variables (.env) securely without accidentally exposing them in client-side bundles or git?`,
          insight: `Checks basic security hygiene, client vs server build boundaries, and configuration safety.`
        },
        {
          category: 'Form Submission & API Error Display',
          difficulty: diff.label,
          text: `When backend validation fails (e.g. email already exists), how do you format the API error and display clear, user-friendly feedback in the frontend form?`,
          insight: `Assesses full-stack error propagation, status code handling, and user feedback loops.`
        },
        {
          category: 'Basic Database Relations',
          difficulty: diff.label,
          text: `How do you model a one-to-many relationship (e.g. a User having many Posts) in your database and query the data efficiently?`,
          insight: `Checks fundamental data modeling skills and basic relationship querying.`
        },
        {
          category: 'Version Control & Team Workflow',
          difficulty: diff.label,
          text: `Describe your git workflow when collaborating with teammates on a feature branch, handling merge conflicts, and opening a Pull Request.`,
          insight: `Evaluates version control discipline, team collaboration habits, and code review readiness.`
        }
      ];
    }
    if (diff.level === 'Mid') {
      return [
        {
          category: 'API Contract & Schema Validation',
          difficulty: diff.label,
          text: `As a ${role} with ${diff.years} years of experience, how do you enforce end-to-end type safety between backend models and frontend components (e.g. Zod, TypeScript, tRPC)${skillNote}?`,
          insight: `Evaluates full-stack type safety, runtime schema validation, and minimizing frontend-backend drift.`
        },
        {
          category: 'State Sync & Optimistic Mutations',
          difficulty: diff.label,
          text: `How do you implement optimistic UI updates where the user sees immediate changes, with automatic rollback if the backend network call fails?`,
          insight: `Assesses advanced UI state handling, async coordination, and fault-tolerant user experience.`
        },
        {
          category: 'Authentication & Session Security',
          difficulty: diff.label,
          text: `Compare storing JWT tokens in HttpOnly secure cookies versus localStorage, and explain how you handle CSRF protection and silent token refresh.`,
          insight: `Checks full-stack security mechanics, token refresh lifecycle, and defense against web exploits.`
        },
        {
          category: 'Database Query Tuning & Caching',
          difficulty: diff.label,
          text: `How do you identify and resolve N+1 query problems in your full-stack application and implement Redis caching for frequently accessed data?`,
          insight: `Evaluates ORM/ODM query optimization, database indexing, and caching middleware.`
        },
        {
          category: 'CI/CD & Automated Deployment',
          difficulty: diff.label,
          text: `Describe your automated pipeline for building frontend static assets, containerizing backend services with Docker, and running database migrations safely.`,
          insight: `Tests deployment automation, build reproducibility, and DevOps integration.`
        }
      ];
    }
    if (diff.level === 'Senior') {
      return [
        {
          category: 'Modular Full-Stack Architecture',
          difficulty: diff.label,
          text: `As a senior ${role}, how do you architect a high-scale full-stack application utilizing BFF (Backend-For-Frontend) patterns and Next.js / NestJS microservices${skillNote}?`,
          insight: `Evaluates architectural modularity, API gateway design, and separation of client-specific aggregation logic.`
        },
        {
          category: 'Real-Time Bidirectional Sync',
          difficulty: diff.label,
          text: `How do you design a real-time collaborative feature (e.g. live document editing / tracking) with WebSockets, optimistic concurrency, and conflict resolution?`,
          insight: `Assesses distributed state coordination, socket scaling with Redis pub/sub, and eventual consistency.`
        },
        {
          category: 'Zero-Downtime Full-Stack Releases',
          difficulty: diff.label,
          text: `How do you coordinate zero-downtime releases where frontend clients running old cached bundles must communicate seamlessly with a newly migrated backend API?`,
          insight: `Checks backward-compatible API versioning, dual-write migrations, and graceful asset caching policies.`
        },
        {
          category: 'Full-Stack Performance Budgets',
          difficulty: diff.label,
          text: `Walk me through your end-to-end performance audit methodology, from browser network waterfall and DOM rendering down to server middleware latency and SQL execution.`,
          insight: `Evaluates holistic performance diagnosis across the entire client-server continuum.`
        },
        {
          category: 'Security Hardening & Threat Modeling',
          difficulty: diff.label,
          text: `What full-stack security controls do you implement for rate limiting, DDoS mitigation at the edge, tenant data isolation, and encrypted payload transit?`,
          insight: `Tests comprehensive security posture, multi-tenant isolation, and automated vulnerability scanning.`
        }
      ];
    }
    // Lead / Architect
    return [
      {
        category: 'Enterprise Full-Stack Strategy',
        difficulty: diff.label,
        text: `As a Lead/Principal ${role}, how do you align enterprise product roadmaps with scalable engineering platforms, driving developer velocity across multiple cross-functional teams${skillNote}?`,
        insight: `Evaluates technology leadership, developer productivity engineering, and executive architectural governance.`
      },
      {
        category: 'Unified Omnichannel Architecture',
        difficulty: diff.label,
        text: `How do you design a unified backend and data layer supporting web, mobile native, partner third-party APIs, and IoT clients with unified authentication and caching?`,
        insight: `Assesses omnichannel architecture, API gateway federation, and shared core domain models.`
      },
      {
        category: 'Cloud Infrastructure & High Availability',
        difficulty: diff.label,
        text: `Describe your multi-cloud or hybrid deployment strategy ensuring 99.99% uptime, automated disaster failover, and global low-latency CDN routing.`,
        insight: `Checks enterprise infrastructure architecture, global reliability, and business continuity planning.`
      },
      {
        category: 'Tech Debt & Organizational Velocity',
        difficulty: diff.label,
        text: `How do you measure and systematically pay down architectural tech debt in a fast-growing company without stalling the product roadmap?`,
        insight: `Evaluates engineering pragmatism, technical debt prioritization metrics, and stakeholder negotiation.`
      },
      {
        category: 'Engineering Culture & Mentorship',
        difficulty: diff.label,
        text: `How do you build engineering excellence, cultivate internal technical leadership, and maintain high code quality standards across 50+ engineers?`,
        insight: `Tests organizational leadership, talent mentorship, and driving an engineering-first culture.`
      }
    ];
  }

  // 4. HR / Talent Acquisition / Recruiter
  if (lower.includes('hr') || lower.includes('talent') || lower.includes('recruiter') || lower.includes('human resource') || lower.includes('people')) {
    if (diff.level === 'Junior') {
      return [
        {
          category: 'Candidate Sourcing & Screening',
          difficulty: diff.label,
          text: `As an entry-level ${role}, how do you search for and screen resumes on LinkedIn and job portals to find candidates matching basic job criteria${skillNote}?`,
          insight: `Evaluates Boolean search basics, CV parsing, and matching qualifications against job requisitions.`
        },
        {
          category: 'Candidate Experience & Coordination',
          difficulty: diff.label,
          text: `How do you communicate with candidates, schedule interview rounds efficiently across busy hiring managers, and maintain accurate notes in an ATS?`,
          insight: `Checks candidate engagement, scheduling coordination, and attention to detail in tracking.`
        },
        {
          category: 'Onboarding & BGV Documentation',
          difficulty: diff.label,
          text: `Describe the standard pre-boarding and onboarding documentation process, including Background Verification (BGV) checks and joining formalities.`,
          insight: `Assesses knowledge of HR operational checklists, employee dossier creation, and verification steps.`
        },
        {
          category: 'HR Operations & Leave Tracking',
          difficulty: diff.label,
          text: `How do you explain leave policies, attendance guidelines, and statutory holidays to new joiners during their first week?`,
          insight: `Evaluates clear employee communication, policy knowledge, and empathetic guidance.`
        },
        {
          category: 'Employee Query Management',
          difficulty: diff.label,
          text: `How do you handle routine employee questions about payroll dates, tax deductions, or benefits while maintaining confidentiality?`,
          insight: `Tests professionalism, confidentiality adherence, and customer-service mindset for HR.`
        }
      ];
    }
    if (diff.level === 'Mid') {
      return [
        {
          category: 'Recruitment Velocity & Time-to-Hire',
          difficulty: diff.label,
          text: `As a ${role} with ${diff.years} years of experience, what strategies do you implement to reduce time-to-hire and cost-per-hire while maintaining quality of hire${skillNote}?`,
          insight: `Evaluates funnel optimization, sourcing channel ROI, hiring manager alignment, and pipeline velocity.`
        },
        {
          category: 'Compensation Benchmarking & Negotiation',
          difficulty: diff.label,
          text: `How do you benchmark compensation against market standards, structure CTC offers (fixed vs performance bonus vs ESOPs), and handle candidate counter-offers?`,
          insight: `Assesses salary negotiation skills, offer-to-joining conversion ratios, and budget adherence.`
        },
        {
          category: 'Statutory Compliance & Labor Laws',
          difficulty: diff.label,
          text: `Explain your understanding of statutory compliances such as Provident Fund (PF), ESIC, Gratuity, Bonus Act, and POSH guidelines.`,
          insight: `Checks legal and statutory compliance knowledge, audit readiness, and risk prevention.`
        },
        {
          category: 'Employee Relations & Conflict Resolution',
          difficulty: diff.label,
          text: `Describe a situation where you mediated a workplace conflict or employee grievance. How did you investigate the matter objectively and resolve it?`,
          insight: `Tests dispute mediation, emotional intelligence, neutrality, and adherence to company ethics.`
        },
        {
          category: 'Performance Reviews & PIPs',
          difficulty: diff.label,
          text: `How do you partner with department heads to conduct bi-annual appraisals, identify underperformers, and structure constructive Performance Improvement Plans (PIPs)?`,
          insight: `Evaluates performance management execution, constructive feedback framing, and documentation rigor.`
        }
      ];
    }
    if (diff.level === 'Senior') {
      return [
        {
          category: 'Strategic Talent Sourcing & Leadership Hiring',
          difficulty: diff.label,
          text: `As a senior ${role}, how do you execute executive search and hire niche technical leadership within aggressive business timelines${skillNote}?`,
          insight: `Evaluates executive recruitment, headhunting, stakeholder management, and employer branding.`
        },
        {
          category: 'Total Rewards & Compensation Strategy',
          difficulty: diff.label,
          text: `How do you design organization-wide salary bands, variable incentive programs, and equity retention plans that remain competitive without inflating payroll?`,
          insight: `Assesses total rewards design, retention modeling, financial budget alignment, and market parity.`
        },
        {
          category: 'Grievance Investigations & POSH Governance',
          difficulty: diff.label,
          text: `How do you lead formal Internal Committee (IC) investigations under the POSH Act or whistle-blower complaints, ensuring legal compliance and confidentiality?`,
          insight: `Checks formal investigative procedure, evidence handling, legal risk mitigation, and executive reporting.`
        },
        {
          category: 'Performance Frameworks (OKRs / 9-Box)',
          difficulty: diff.label,
          text: `How do you roll out and institutionalize OKR/KPI frameworks across 200+ employees and conduct 9-box talent reviews for succession planning?`,
          insight: `Evaluates strategic performance architecture, talent mapping, and leadership pipeline development.`
        },
        {
          category: 'Change Management & Retention Strategy',
          difficulty: diff.label,
          text: `During major company restructuring or high voluntary attrition periods, what proactive employee engagement and retention interventions do you implement?`,
          insight: `Tests change leadership, sentiment analysis, retention drivers, and building high-trust culture.`
        }
      ];
    }
    // Lead / Director
    return [
      {
        category: 'Workforce Planning & Business P&L Alignment',
        difficulty: diff.label,
        text: `As Head of People/HR for ${role}, how do you design annual manpower planning aligned to company EBITDA targets and revenue milestones${skillNote}?`,
        insight: `Assesses executive workforce strategy, capacity modeling, labor cost forecasting, and C-suite alignment.`
      },
      {
        category: 'EVP & Employer Brand Transformation',
        difficulty: diff.label,
        text: `How do you build a nationally recognized Employer Value Proposition (EVP) that attracts top 1% talent in a hyper-competitive hiring market?`,
        insight: `Evaluates employer branding strategy, talent positioning, cultural storytelling, and campus/industry outreach.`
      },
      {
        category: 'Enterprise Compliance & Multi-Entity Governance',
        difficulty: diff.label,
        text: `How do you manage international labor laws, multi-state statutory audits, and remote employment regulations across global legal entities?`,
        insight: `Checks global HR governance, cross-border employment contracts, and enterprise legal risk mitigation.`
      },
      {
        category: 'Predictive People Analytics & Board Reporting',
        difficulty: diff.label,
        text: `How do you leverage predictive analytics to forecast voluntary attrition, track employee lifetime value (eLTV), and present HR ROI metrics to the Board?`,
        insight: `Tests data-driven people analytics, Board-level communication, and strategic business impact.`
      },
      {
        category: 'Organizational Design & Culture Architecture',
        difficulty: diff.label,
        text: `Describe your methodology for restructuring departmental hierarchies to eliminate communication silos, increase agility, and foster an ownership culture.`,
        insight: `Evaluates organizational development, leadership succession, cultural resilience, and driving enterprise growth.`
      }
    ];
  }

  // 5. Product Designer / UI/UX Designer
  if (lower.includes('design') || lower.includes('ux') || lower.includes('product designer') || lower.includes('visual')) {
    if (diff.level === 'Junior') {
      return [
        {
          category: 'Design Tools & Auto-Layout',
          difficulty: diff.label,
          text: `As a junior ${role}, how do you use Figma auto-layout, components, and variants to create clean, responsive UI screens${skillNote}?`,
          insight: `Evaluates fundamental design software proficiency, component structure, and responsiveness.`
        },
        {
          category: 'User Flow & Wireframing',
          difficulty: diff.label,
          text: `Describe your process of creating low-fidelity wireframes and mapping out the user journey for a simple authentication or checkout flow.`,
          insight: `Checks user flow comprehension, information hierarchy, and intuitive layout structuring.`
        },
        {
          category: 'Visual Design & Accessibility',
          difficulty: diff.label,
          text: `How do you select typography scales and ensure WCAG color contrast ratios so your designs are readable and accessible to all users?`,
          insight: `Assesses basic visual design principles, typography hierarchy, and accessibility awareness.`
        },
        {
          category: 'Developer Handoff',
          difficulty: diff.label,
          text: `How do you prepare your design files for developer handoff, including spacing specs, asset exports, and interaction states (hover, active, disabled)?`,
          insight: `Evaluates engineering empathy, design specification completeness, and cross-team communication.`
        },
        {
          category: 'Feedback & Iteration',
          difficulty: diff.label,
          text: `How do you handle critical design feedback from senior designers or stakeholders and iterate constructively without losing user focus?`,
          insight: `Tests coachability, design rationale presentation, and iterative mindset.`
        }
      ];
    }
    if (diff.level === 'Mid') {
      return [
        {
          category: 'Design Systems & Component Architecture',
          difficulty: diff.label,
          text: `As a ${role} with ${diff.years} years of experience, how do you build and maintain a scalable Figma design system with tokens, variables, and documentation${skillNote}?`,
          insight: `Evaluates design system scalability, token management, and component governance.`
        },
        {
          category: 'User Research & Usability Testing',
          difficulty: diff.label,
          text: `Describe how you plan, recruit, and conduct moderated usability testing sessions, and how you translate user friction into prioritized backlog improvements.`,
          insight: `Checks qualitative research methodology, script writing, insight synthesis, and user-centered design.`
        },
        {
          category: 'Product Thinking & Conversion',
          difficulty: diff.label,
          text: `How do you balance business conversion goals (e.g. signup flow completion) with clean user experience, avoiding dark patterns?`,
          insight: `Assesses product acumen, ethical design, behavioral psychology, and conversion optimization.`
        },
        {
          category: 'Interactive Prototyping',
          difficulty: diff.label,
          text: `How do you build advanced interactive prototypes with conditional logic, variables, and micro-animations to validate complex features before engineering starts?`,
          insight: `Tests advanced prototyping capability, motion design principles, and user validation velocity.`
        },
        {
          category: 'Cross-Functional Collaboration',
          difficulty: diff.label,
          text: `When engineers argue that your proposed interaction is too technically complex to build within the sprint, how do you negotiate a practical compromise?`,
          insight: `Evaluates technical empathy, scope negotiation, collaborative problem solving, and defending core UX.`
        }
      ];
    }
    return [
      {
        category: 'End-to-End Product Architecture',
        difficulty: diff.label,
        text: `As a senior ${role}, walk through how you led the complete redesign of a core product workflow, from quantitative funnel analysis to post-launch telemetry verification${skillNote}.`,
        insight: `Evaluates holistic design leadership, data-informed UX strategy, and demonstrable business impact.`
      },
      {
        category: 'Enterprise Design Token Systems',
        difficulty: diff.label,
        text: `How do you architect multi-platform design tokens supporting web, iOS, and Android dark mode, accessibility themes, and automated sync with GitHub repositories?`,
        insight: `Checks deep design-engineering integration, cross-platform token pipelines, and design ops maturity.`
      },
      {
        category: 'Quantitative UX Metrics & A/B Testing',
        difficulty: diff.label,
        text: `How do you define UX KPIs (SUS, CES, Task Completion Rate) and collaborate with data teams to design statistically sound A/B test experiments?`,
        insight: `Assesses quantitative research rigor, product telemetry analysis, and tying design to revenue retention.`
      },
      {
        category: 'Design Strategy & Innovation',
        difficulty: diff.label,
        text: `How do you introduce AI-native workflows and conversational/predictive interaction paradigms into legacy enterprise interfaces without confusing existing users?`,
        insight: `Tests forward-looking design vision, AI-native UX patterns, and progressive disclosure.`
      },
      {
        category: 'Design Mentorship & Design Ops',
        difficulty: diff.label,
        text: `How do you establish Design Ops frameworks, peer critique rituals, and career growth pathways across a distributed team of designers?`,
        insight: `Evaluates design leadership, operational efficiency, culture building, and team development.`
      }
    ];
  }

  // 6. Generic / Other Roles
  if (diff.level === 'Junior') {
    return [
      {
        category: 'Core Domain Fundamentals',
        difficulty: diff.label,
        text: `As an entry-level ${role}, what are the essential methodologies, tools, and quality controls required to execute your assignments accurately${skillNote}?`,
        insight: `Evaluates core domain knowledge, familiarity with standard industry tools, and foundational execution.`
      },
      {
        category: 'Practical Problem Solving',
        difficulty: diff.label,
        text: `Describe a challenging task you completed as a ${role}. What steps did you take to troubleshoot unexpected issues?`,
        insight: `Assesses systematic problem solving, resourcefulness, and practical application.`
      },
      {
        category: 'Quality & Process Adherence',
        difficulty: diff.label,
        text: `What verification checklists do you follow to ensure your deliverables are compliant with company standards and error-free?`,
        insight: `Checks attention to detail, precision, error prevention, and quality assurance.`
      },
      {
        category: 'Collaboration & Communication',
        difficulty: diff.label,
        text: `How do you communicate project status and coordinate with cross-functional team members to meet tight deadlines?`,
        insight: `Tests clear communication, proactive alignment, and teamwork skills.`
      },
      {
        category: 'Continuous Learning',
        difficulty: diff.label,
        text: `What new skills or industry best practices in ${role} are you currently focusing on to grow your career?`,
        insight: `Evaluates career curiosity, self-motivation, and professional growth mindset.`
      }
    ];
  }
  if (diff.level === 'Mid') {
    return [
      {
        category: 'Workflow Optimization & Process Design',
        difficulty: diff.label,
        text: `As a ${role} with ${diff.years} years of experience, how do you optimize operational processes, eliminate bottlenecks, and ensure consistent output quality${skillNote}?`,
        insight: `Evaluates process improvement, operational rigor, and independent delivery capability.`
      },
      {
        category: 'Complex Troubleshooting & Root Cause Analysis',
        difficulty: diff.label,
        text: `Describe a high-impact crisis or unexpected roadblock you handled as a ${role}. What analytical method did you use to find the root cause?`,
        insight: `Assesses analytical depth, composure under pressure, and structured crisis mitigation.`
      },
      {
        category: 'Stakeholder Alignment & Expectation Management',
        difficulty: diff.label,
        text: `How do you manage conflicting priorities between clients, cross-functional partners, and internal leadership while maintaining delivery schedules?`,
        insight: `Tests negotiation, diplomatic pushback, stakeholder alignment, and trade-off management.`
      },
      {
        category: 'Data-Driven Decision Making',
        difficulty: diff.label,
        text: `How do you leverage data, KPIs, and industry metrics to substantiate recommendations and evaluate the success of your initiatives as a ${role}?`,
        insight: `Checks analytical literacy, evidence-based decision making, and measurable outcomes focus.`
      },
      {
        category: 'Mentorship & Knowledge Sharing',
        difficulty: diff.label,
        text: `How do you document standard operating procedures and mentor junior team members to raise the overall performance bar of your team?`,
        insight: `Evaluates peer leadership, documentation discipline, and team capability building.`
      }
    ];
  }
  // Senior & Lead
  return [
    {
      category: 'Strategic Vision & Execution',
      difficulty: diff.label,
      text: `As a seasoned ${role} with ${diff.years} years of experience, how do you define long-term strategy, operational roadmaps, and align departmental deliverables with corporate P&L goals${skillNote}?`,
      insight: `Assesses strategic leadership, business acumen, and executive operational execution.`
    },
    {
      category: 'High-Stakes Crisis & Risk Management',
      difficulty: diff.label,
      text: `Describe the most complex, high-risk situation you successfully navigated in your career. What framework did you use to evaluate trade-offs and mitigate risk?`,
      insight: `Evaluates executive risk management, decision-making under uncertainty, and leadership resilience.`
    },
    {
      category: 'Industry Innovation & Modernization',
      difficulty: diff.label,
      text: `How do you evaluate and implement emerging technologies, automation, and modern methodologies in ${role} to maintain competitive advantage?`,
      insight: `Tests technology forecasting, change management, and continuous organizational modernization.`
    },
    {
      category: 'Cross-Functional Executive Influence',
      difficulty: diff.label,
      text: `How do you persuade C-suite executives and board-level stakeholders to sponsor major transformation initiatives in your functional area?`,
      insight: `Checks executive communication, business case defense, influence without authority, and strategic storytelling.`
    },
    {
      category: 'Organizational Leadership & Talent Development',
      difficulty: diff.label,
      text: `How do you build, inspire, and retain high-performing teams, while creating succession pipelines for critical leadership roles?`,
      insight: `Evaluates organizational design, cultural leadership, executive coaching, and talent retention.`
    }
  ];
}

const DUMMY_QUESTIONS: Round2Question[] = getRoleSpecificTechnicalQuestions('Software Engineer');

export default function InterviewUI() {
  const user = useAuthStore(state => state.user);
  const [candidate, setCandidate] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<string[]>(() => Array(DUMMY_QUESTIONS.length).fill(''));
  const totalSeconds = 40 * 60;
  
  const [isAiConnected, setIsAiConnected] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);
  const [timeElapsed, setTimeElapsed] = React.useState(0);
  const [activeQuestions, setActiveQuestions] = React.useState<Round2Question[]>(DUMMY_QUESTIONS);

  const [activeTab, setActiveTab] = React.useState('Interview');
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [interviewId, setInterviewId] = React.useState<string | null>(null);
  
  const [notes, setNotes] = React.useState('');
  const [attachments, setAttachments] = React.useState<any[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  const [timeLeft, setTimeLeft] = React.useState(totalSeconds);
  const [warnings, setWarnings] = React.useState(0);
  const [isForceExited, setIsForceExited] = React.useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = React.useState<number[]>([]);

  const toggleFlag = () => {
    setFlaggedQuestions(prev => 
      prev.includes(currentQuestionIndex) 
        ? prev.filter(q => q !== currentQuestionIndex) 
        : [...prev, currentQuestionIndex]
    );
  };

  const handleBulkSave = async () => {
    if (!interviewId) return;
    try {
      setIsSaving(true);
      const dbQuestions = activeQuestions.map((q: any, idx: number) => ({
        question: q.text,
        transcript: answers[idx] || '',
        manualOverride: q.manualOverride || undefined,
        answerAnalysis: {
          verdict: 'no_answer',
          reasoning: q.insight
        }
      }));
      await api.put(`/hiring/interviews/${interviewId}/questions`, { questions: dbQuestions });
    } catch (error) {
      console.error('Failed to bulk save answers', error);
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasStarted && !isCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleEndExam(true); // timeout auto-submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [hasStarted, isCompleted, timeLeft]);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasStarted && !isCompleted && !isForceExited) {
        setWarnings(w => w + 1);
        toast.error('Warning: Tab switching is not allowed during the exam!', { duration: 5000 });
      }
    };

    const handleFullscreenChange = async () => {
      if (!document.fullscreenElement && hasStarted && !isCompleted && !isForceExited) {
        setWarnings(w => w + 1);
        toast.error('Warning: Exiting Fullscreen is not allowed during the exam! Forcing fullscreen...', { duration: 5000 });
        try {
          await document.documentElement.requestFullscreen();
        } catch (err) {
          console.warn("Could not re-request fullscreen:", err);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setIsForceExited(true);
        toast.success('Exam lock bypassed (Secret Shortcut used). You may now exit fullscreen.');
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasStarted, isCompleted, isForceExited]);

  const initInterview = async () => {
    const userId = user?._id || user?.id;
    if (!candidate || !userId) return;
    try {
      setIsConnecting(true);
      
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.warn("Could not request fullscreen:", err);
      }

      // Fetch candidate's interviews
      const { data: interviews } = await api.get(`/hiring/interviews/${candidate._id}`);
      let activeInterview = (interviews || []).find((i: any) => i.roundType === 'Technical' || i.roundType === 'Technical Interview');

      if (!activeInterview) {
        const res = await api.post('/hiring/interviews', {
          candidateId: candidate._id,
          interviewerId: userId,
          roundType: 'Technical Interview',
          scheduledDate: new Date().toISOString(),
        });
        activeInterview = res.data;
      }

      setInterviewId(activeInterview._id);
      setNotes(activeInterview.notes || '');
      setAttachments(activeInterview.attachments || []);

      if (activeInterview.interviewQuestions && activeInterview.interviewQuestions.length > 0) {
        const mappedQuestions = activeInterview.interviewQuestions.map((q: any) => ({
          ...q,
          category: q.category || 'Technical Assessment',
          difficulty: q.difficulty || candidate?.difficultyTier?.label,
          text: q.question,
          insight: q.answerAnalysis?.reasoning || 'Evaluates candidate response.'
        }));
        setActiveQuestions(mappedQuestions);
        setAnswers(mappedQuestions.map((q: any) => q.transcript || ''));
      } else {
        const role = candidate.appliedFor || candidate.jobRole || 'Software Engineer';
        const expRaw = candidate.totalExperience || candidate.experience || '';
        const diffTier = candidate.difficultyTier || getDifficultyTier(expRaw);
        const skills = candidate.skills || [];
        const jdSummary = candidate.jobDescriptionSummary || '';
        let roleQuestions: Round2Question[] = [];

        // 1. Attempt AI Generation
        try {
          const genRes = await api.post(`/ai/hiring/interviews/${activeInterview._id}/generate-questions`);
          const generatedQuestions = genRes.data?.questions || [];
          if (generatedQuestions.length > 0) {
            roleQuestions = generatedQuestions.map((q: any) => {
              if (typeof q === 'string') {
                return {
                  category: 'Technical Assessment',
                  difficulty: diffTier.label,
                  text: q,
                  insight: `Evaluates domain proficiency, real-world experience, and problem solving for ${role}.`
                };
              }
              return {
                category: q.category || 'Technical Assessment',
                difficulty: q.difficulty || diffTier.label,
                text: q.question,
                insight: q.insight || `Evaluates domain proficiency, real-world experience, and problem solving for ${role}.`
              };
            });
          }
        } catch (genErr) {
          console.warn("AI generation not available or failed, generating role-specific questions", genErr);
        }

        // 2. Fallback to specialized role-based technical questions if AI didn't return questions
        if (roleQuestions.length === 0) {
          roleQuestions = getRoleSpecificTechnicalQuestions(role, expRaw, skills, jdSummary);
        }

        const dbQuestions = roleQuestions.map(q => ({
          question: q.text,
          category: q.category,
          difficulty: q.difficulty || diffTier.label,
          answerAnalysis: { verdict: 'no_answer', reasoning: q.insight }
        }));

        await api.put(`/hiring/interviews/${activeInterview._id}/questions`, { questions: dbQuestions }).catch(() => {});

        setActiveQuestions(roleQuestions);
        setAnswers(Array(roleQuestions.length).fill(''));
      }

      if (activeInterview.status === 'Completed') {
        setIsCompleted(true);
        setActiveTab('AI Questions');
        setIsAiConnected(false);
        setIsConnecting(false);
        setHasStarted(true);
      } else {
        setIsOffline(false);
        setIsAiConnected(true);
        setIsConnecting(false);
        setHasStarted(true);
        toast.success('Interview Session Started!');
      }
    } catch (error) {
      console.error('Failed to init interview:', error);
      const role = candidate?.appliedFor || candidate?.jobRole || 'Software Engineer';
      const expRaw = candidate?.totalExperience || candidate?.experience || '';
      const skills = candidate?.skills || [];
      const jdSummary = candidate?.jobDescriptionSummary || '';
      const roleQuestions = getRoleSpecificTechnicalQuestions(role, expRaw, skills, jdSummary);
      setIsOffline(false);
      setIsAiConnected(true);
      setIsConnecting(false);
      setHasStarted(true);
      setActiveQuestions(roleQuestions);
      setAnswers(Array(roleQuestions.length).fill(''));
      toast.success('Interview Session Started!');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndExam = async (isAutoSubmit = false) => {
    try {
      await handleBulkSave(); // Bulk save all answers before closing
      
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
      }

      if (interviewId) {
        toast.loading('Analyzing responses with AI...', { id: 'ai-eval' });
        try {
          const evalRes = await api.post(`/ai/hiring/interviews/${interviewId}/evaluate-text`);
          if (evalRes.data && evalRes.data.questions) {
             const mapped = evalRes.data.questions.map((q: any) => ({
                ...q,
                category: 'Technical',
                text: q.question,
                insight: q.answerAnalysis?.reasoning || 'Evaluates candidate response.'
             }));
             setActiveQuestions(mapped);
          }
          await api.put(`/hiring/interviews/${interviewId}/feedback`, { status: 'Completed', rating: 0, feedback: 'Completed via AI Round 2' });
          toast.success('Interview Completed!', { id: 'ai-eval' });
        } catch (err) {
          console.error(err);
          toast.error('AI evaluation failed, using fallback.', { id: 'ai-eval' });
          await api.put(`/hiring/interviews/${interviewId}/feedback`, { status: 'Completed', rating: 0, feedback: 'Completed via AI Round 2' });
        }
      }
      setIsCompleted(true);
      setActiveTab('AI Questions');
      setIsAiConnected(false);
      setHasStarted(false);
      
      let completedRounds = JSON.parse(localStorage.getItem('ai_completed_rounds') || '[]');
      if (!completedRounds.includes(2)) completedRounds.push(2);
      localStorage.setItem('ai_completed_rounds', JSON.stringify(completedRounds));

      if (isAutoSubmit) {
        toast.success('Time is up! Exam auto-submitted.', { duration: 5000 });
      } else {
        toast.success('Interview Completed!');
      }
    } catch (e) {
      toast.error('Failed to end interview');
    }
  };

  const [isSaving, setIsSaving] = React.useState(false);
  
  const handleSaveAnswer = async () => {
    if (!interviewId) return;
    const currentAns = answers[currentQuestionIndex];
    if (!currentAns) return;

    try {
      setIsSaving(true);
      const dbQuestions = activeQuestions.map((q: any, idx: number) => ({
        question: q.text,
        transcript: answers[idx] || '',
        manualOverride: q.manualOverride,
        answerAnalysis: idx === currentQuestionIndex ? {
          verdict: 'no_answer',
          reasoning: q.insight
        } : (q.answerAnalysis || {
          verdict: 'no_answer',
          reasoning: q.insight
        })
      }));

      await api.put(`/hiring/interviews/${interviewId}/questions`, { questions: dbQuestions });
      toast.success('Answer auto-saved');
    } catch (error) {
      toast.error('Failed to save answer');
    } finally {
      setIsSaving(false);
    }
  };

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const answeredCount = answers.filter(a => a.trim().length > 0).length;

  const params = useParams() as { id: string };
  const candidateId = params?.id;
  const router = useRouter();

  React.useEffect(() => {
    if (candidateId) {
      const fetchCandidate = async () => {
        try {
          let cId = candidateId;
          if (!/^[0-9a-fA-F]{24}$/.test(candidateId)) {
            const res = await api.get(`/hiring/candidates?limit=1000`);
            const candidates = res.data?.data || res.data || [];
            const match = candidates.find((c: any) => {
              const nameSlug = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              return nameSlug === candidateId;
            });
            if (match) cId = match._id;
            else throw new Error("Candidate not found");
          }
          
          const res = await api.get(`/hiring/candidates/${cId}`);
          const data = res.data;
          const appDetails = data.applicationDetails || {};
          
          const rawExp = appDetails.totalExperience || data.experience || '';
          const diffTier = getDifficultyTier(rawExp);
          const candidateSkills = Array.isArray(data.skills) ? data.skills : (appDetails.skills || data.manpowerRequestId?.technicalSkills || []);
          const jdSummary = data.manpowerRequestId?.jobDescriptionSummary || '';

          setCandidate({
            _id: data._id,
            fullName: data.firstName + (data.lastName ? ' ' + data.lastName : ''),
            email: data.email || '',
            mobile: data.phone || '',
            currentLocation: appDetails.currentLocation || '',
            linkedin: appDetails.linkedin || '',
            appliedFor: data.jobRole || appDetails.appliedFor || '',
            department: data.departmentId?.name || data.departmentId || '',
            employmentType: appDetails.employmentType || 'Full Time',
            totalExperience: rawExp,
            difficultyTier: diffTier,
            expectedCTC: appDetails.expectedCTC || '',
            noticePeriod: appDetails.noticePeriod || '',
            resumeUrl: data.resumeUrl,
            profileImageUrl: data.profileImageUrl,
            skills: candidateSkills,
            jobDescriptionSummary: jdSummary,
            createdAt: data.createdAt
          });

          // Pre-populate questions for this specific candidate role
          const candidateRole = data.jobRole || appDetails.appliedFor || 'Software Engineer';
          const roleQuestions = getRoleSpecificTechnicalQuestions(candidateRole, rawExp, candidateSkills, jdSummary);
          setActiveQuestions(roleQuestions);
          setAnswers(Array(roleQuestions.length).fill(''));

          // Check if interview is already created/completed
          try {
            const intRes = await api.get(`/hiring/interviews/${cId}`);
            const activeInterview = (intRes.data || []).find((i: any) => i.roundType === 'Technical' || i.roundType === 'Technical Interview');
            if (activeInterview) {
              setInterviewId(activeInterview._id);
              setNotes(activeInterview.notes || '');
              setAttachments(activeInterview.attachments || []);
              
              if (activeInterview.interviewQuestions?.length > 0) {
                const mappedQuestions = activeInterview.interviewQuestions.map((q: any) => ({
                  ...q,
                  category: q.category || 'Technical Assessment',
                  difficulty: q.difficulty || diffTier.label,
                  text: q.question,
                  insight: q.answerAnalysis?.reasoning || 'Evaluates candidate response.'
                }));
                setActiveQuestions(mappedQuestions);
                setAnswers(mappedQuestions.map((q: any) => q.transcript || ''));
                if (activeInterview.status === 'Completed') {
                  setIsCompleted(true);
                  setActiveTab('AI Questions');
                  setHasStarted(true);
                }
              }
            }
          } catch (e) {
            console.error("Failed to load interview status", e);
          }
        } catch (err) {
          console.error(err);
          toast.error('Failed to load candidate details');
        }
      };
      fetchCandidate();
    }
  }, [candidateId]);

  if (!candidate) return <div className="p-8 text-center text-zinc-500 font-medium">Loading candidate details...</div>;
  const immersiveClasses = hasStarted && !isCompleted ? "fixed inset-0 z-[100] bg-zinc-50 overflow-y-auto w-full h-full" : "w-full";

  return (
    <div className={immersiveClasses}>
    <div className="w-full px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">

      {/* Header & Steps */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4  pb-2">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Interview – Round 2</h1>
          <p className="text-[11px] text-zinc-500 mt-0.5">Technical Interview – AI Powered</p>
        </div>

        {/* Steps */}
        <div className="flex-1 max-w-[550px] xl:max-w-[600px] w-full flex items-center justify-center relative mx-auto">
          <div className="absolute left-[30px] right-[30px] top-[11px] h-[2px] bg-zinc-200 -z-0"></div>
          <div className="flex w-full justify-between z-10">
            {[
              { num: 1, label: 'Upload CV', status: 'completed' },
              { num: 2, label: 'Review & Edit', status: 'completed' },
              { num: 3, label: 'Submit Application', status: 'completed' },
              { num: 4, label: 'AI Screening', status: 'completed' },
              { num: 5, label: 'HOD Review', status: 'completed' },
              { num: 6, label: 'Interview', status: 'active' },
              { num: 7, label: 'Offer', status: 'pending' },
              { num: 8, label: 'Onboarding', status: 'pending' },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-1 px-1 bg-slate-50 lg:bg-transparent">
                <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors
                    ${step.status === 'completed' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                    step.status === 'active' ? 'border-indigo-600 bg-indigo-600 text-white shadow-[0_0_0_3px_rgba(79,70,229,0.15)]' :
                      'border-zinc-200 text-zinc-400 bg-white'}`}>
                  {step.status === 'completed' ? <Check className="w-3 h-3" strokeWidth={3} /> : step.num}
                </div>
                <span className={`text-[8.5px] lg:text-[9px] whitespace-nowrap font-bold ${step.status === 'active' ? 'text-indigo-900' : step.status === 'completed' ? 'text-indigo-600' : 'text-zinc-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 shrink-0 w-full lg:w-[280px] xl:w-[340px]">
          <button onClick={() => router.push(`/dashboard/hiring/candidates/new/create/interview-process/${candidateId}`)} className="flex items-center justify-center h-8 px-3 rounded-md text-[11px] font-semibold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
            <ArrowLeft className="w-3 h-3 mr-1" /> Back to Process
          </button>
          {!isCompleted && hasStarted && (
            <button onClick={() => handleEndExam(false)} className="flex items-center justify-center h-8 px-4 rounded-md text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors">
              End Exam & Next Round <StopCircle className="w-3 h-3 ml-1" />
            </button>
          )}
          {isCompleted && (
            (() => {
              const scorePercent = Math.round(activeQuestions.reduce((acc: number, q: any) => {
                const effectiveVerdict = q.manualOverride || q.answerAnalysis?.verdict;
                if (effectiveVerdict === 'strong') return acc + 100;
                if (effectiveVerdict === 'adequate') return acc + 75;
                if (effectiveVerdict === 'weak') return acc + 35;
                return acc;
              }, 0) / Math.max(activeQuestions.length, 1));
              const isPassing = scorePercent >= 60;
              
              if (!isPassing) return null;
              
              return (
                <button onClick={() => {
                  try {
                    const storedMap = JSON.parse(localStorage.getItem('ai_completed_rounds_map') || '{}');
                    storedMap[candidateId] = Math.max(storedMap[candidateId] || 0, 2);
                    localStorage.setItem('ai_completed_rounds_map', JSON.stringify(storedMap));
                  } catch (e) {}
                  router.push(`/dashboard/hiring/candidates/new/create/round-3/${candidateId}`);
                }} className="flex items-center justify-center h-8 px-4 rounded-md text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors">
                  Proceed to Next Round &rarr;
                </button>
              );
            })()
          )}
        </div>
      </div>
      <div className="h-[1px] bg-zinc-200 w-full mb-2 shrink-0"></div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="xl:col-span-2 p-4 bg-white rounded-xl border border-zinc-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-start gap-5 w-full">
            {candidate.profileImageUrl ? (
              <img 
                src={candidate.profileImageUrl} 
                alt="Candidate" 
                className="h-20 w-20 rounded-lg object-cover border border-zinc-200 shadow-sm shrink-0" 
                onError={(e) => {
                  if (e.currentTarget.src !== "https://randomuser.me/api/portraits/men/32.jpg") {
                    e.currentTarget.src = "https://randomuser.me/api/portraits/men/32.jpg";
                  }
                }}
              />
            ) : (
              <div className="h-20 w-20 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
                <span className="text-2xl font-bold text-indigo-300">{candidate.fullName?.charAt(0) || 'C'}</span>
              </div>
            )}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {/* Col 1 */}
              <div className="flex flex-col gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-bold text-zinc-900">{candidate.fullName}</h2>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Round 2 In Progress</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium">{candidate.appliedFor}</p>
                </div>
                <div className="flex flex-col gap-1.5 text-[10px] text-zinc-600 mt-1">
                  <span className="flex items-center gap-1.5"><Phone size={12} className="text-zinc-400" /> {candidate.mobile}</span>
                  <span className="flex items-center gap-1.5"><Mail size={12} className="text-zinc-400" /> {candidate.email}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-zinc-400" /> {candidate.currentLocation}</span>
                  <span className="flex items-center gap-1.5 hover:underline cursor-pointer" onClick={() => window.open(candidate.linkedin, '_blank')}><Link2 size={12} className="text-zinc-400" /> {candidate.linkedin}</span>
                </div>
              </div>

              {/* Col 2 */}
              <div className="flex flex-col gap-3 border-l border-zinc-200 pl-4">
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium mb-0.5">Applied For</p>
                  <p className="text-[11px] font-bold text-zinc-900">{candidate.appliedFor}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium mb-0.5">Department</p>
                  <p className="text-[11px] font-bold text-zinc-900">{candidate.department}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium mb-0.5">Experience & Calibrated Level</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-[11px] font-bold text-zinc-900">{candidate.totalExperience || '0'} Years</p>
                    {candidate.difficultyTier && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${candidate.difficultyTier.badgeColor}`}>
                        {candidate.difficultyTier.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Col 3 */}
              <div className="flex flex-col justify-between border-l border-zinc-200 pl-4">
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium mb-0.5">Current Round</p>
                  <p className="text-[11px] font-bold text-zinc-900">Round 2 – Technical Interview</p>
                </div>
                <div className="mt-3">
                  <p className="text-[10px] text-zinc-500 font-medium mb-1">Interviewer</p>
                  <div className="flex items-center gap-2">
                    {user?.profilePictureUrl ? (
                      <img 
                        src={user.profilePictureUrl} 
                        alt={user?.firstName} 
                        className="h-7 w-7 rounded-full object-cover border border-zinc-200" 
                        onError={(e) => {
                          if (e.currentTarget.src !== "https://randomuser.me/api/portraits/women/44.jpg") {
                            e.currentTarget.src = "https://randomuser.me/api/portraits/women/44.jpg";
                          }
                        }}
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-indigo-600">{user?.firstName?.charAt(0) || 'I'}</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-zinc-900">{user?.firstName || 'Current'} {user?.lastName || 'User'}</span>
                      <span className="text-[9px] text-zinc-500">{(user as any)?.jobTitle || 'Interviewer'}</span>
                    </div>
                  </div>
                </div>
                <button className="mt-3 w-fit text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded hover:bg-indigo-100 transition-colors">
                  View Candidate Profile →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Application Summary Card */}
        <div className="py-4 flex flex-col justify-center border border-zinc-100 shadow-sm p-4 rounded-lg bg-white">
          <h3 className="text-[13px] font-bold text-zinc-900 mb-4">Application Summary</h3>
          <div className="flex flex-col gap-3 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 flex items-center gap-1.5"><FileText size={12} className="text-indigo-600" /> Application ID</span>
              <span className="font-bold text-zinc-900">APP-{candidate._id?.slice(-6).toUpperCase() || '100124'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 flex items-center gap-1.5"><Clock size={12} className="text-indigo-600" /> Applied On</span>
              <span className="font-bold text-zinc-900">{candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 flex items-center gap-1.5"><HelpCircle size={12} className="text-indigo-600" /> Current Stage</span>
              <span className="font-bold text-zinc-900">Interview - Round 2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-zinc-200 px-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {['Interview', 'AI Questions', 'Notes', 'Attachments', 'Score'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-[12px] font-bold border-b-2 transition-colors ${
              activeTab === tab
                ? 'text-indigo-700 border-indigo-700'
                : 'text-zinc-500 border-transparent hover:text-zinc-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Interview' && (
        <>
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mt-2">

        {/* Left Column (Progress) */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-full">
          <div className="p-5 rounded-xl border border-zinc-100 bg-white shadow-sm flex flex-col h-full">
            <h3 className="text-[12px] font-bold text-zinc-900 mb-1">Round Progress</h3>
            <p className="text-[10px] text-zinc-500 font-medium mb-6">Round 2 of 5<br />Technical Interview</p>

            <div className="flex items-center justify-center mb-6 relative w-28 h-28 mx-auto">
              <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="transparent" strokeWidth="8" className="text-zinc-100 stroke-current" />
                <circle cx="50" cy="50" r="46" fill="transparent" strokeWidth="8"
                  className={`${timeLeft < 300 ? 'text-rose-500' : 'text-emerald-600'} stroke-current transition-all duration-1000 ease-linear`}
                  strokeDasharray={2 * Math.PI * 46}
                  strokeDashoffset={2 * Math.PI * 46 * (1 - timeLeft / totalSeconds)}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-2 flex flex-col items-center justify-center bg-white shadow-[0_0_15px_rgba(0,0,0,0.03)] rounded-full z-10">
                <span className="text-[9px] text-zinc-500 font-medium mb-0.5">Time Left</span>
                <span className={`text-2xl font-bold ${timeLeft < 300 ? 'text-rose-500' : 'text-emerald-600'} leading-none mb-1`}>{formatTime(timeLeft)}</span>
                <span className="text-[9px] text-zinc-400">of 40:00</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-zinc-100 pt-4 text-[11px]">
              <div className="flex items-center justify-between"><span className="text-zinc-500">Total Questions</span><span className="font-bold">{activeQuestions.length}</span></div>
              <div className="flex items-center justify-between"><span className="text-zinc-500">Answered</span><span className="font-bold">{answeredCount}</span></div>
              <div className="flex items-center justify-between"><span className="text-zinc-500">Remaining</span><span className="font-bold">{activeQuestions.length - answeredCount}</span></div>
              <div className="flex items-center justify-between"><span className="text-zinc-500">Flagged</span><span className="font-bold text-rose-600">{flaggedQuestions.length}</span></div>
            </div>

            <div className="mt-6 bg-indigo-50/50 rounded-lg p-3 border border-indigo-100">
              <p className="text-[10px] text-indigo-700 font-medium leading-relaxed">
                All questions are AI-generated based on the role, your profile, and previous answers.
              </p>
            </div>
          </div>


        </div>

        {/* Center Column (Question Area) */}
        <div className="lg:col-span-6 flex flex-col gap-4 h-full relative">
          {!hasStarted && !isCompleted && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-xl">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-zinc-200 text-center max-w-sm mx-4">
                <FileQuestion size={40} className="text-indigo-600 mx-auto mb-4" />
                <h3 className="text-[15px] font-bold text-zinc-900 mb-2">Ready to begin?</h3>
                <p className="text-[12px] text-zinc-500 leading-relaxed">Click the "Start Test" button in the sidebar to begin your technical interview. The timer will start immediately.</p>
              </div>
            </div>
          )}
          <div className="p-5 rounded-xl border border-zinc-100 bg-white shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[15px] font-bold text-zinc-900">Question {currentQuestionIndex + 1} of {activeQuestions.length}</h2>
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">{currentQuestion.category}</span>
                {currentQuestion.difficulty && (
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {currentQuestion.difficulty}
                  </span>
                )}
              </div>
              <button onClick={toggleFlag} className={`flex items-center gap-1.5 text-[10px] font-semibold border px-2 py-1 rounded transition-colors shadow-sm ${
                flaggedQuestions.includes(currentQuestionIndex) 
                ? 'text-white bg-rose-600 border-rose-600 hover:bg-rose-700'
                : 'text-rose-600 bg-white border-rose-200 hover:bg-rose-50'
              }`}>
                <Flag size={12} className={flaggedQuestions.includes(currentQuestionIndex) ? "fill-current" : ""} /> 
                {flaggedQuestions.includes(currentQuestionIndex) ? "Flagged" : "Flag Question"}
              </button>
            </div>

            <p className="text-[13px] font-bold text-zinc-900 mb-4 leading-relaxed">
              {currentQuestion.text}
            </p>

            <div className="bg-[#f5f3ff] border border-indigo-100 rounded-lg p-3 mb-4 flex items-start gap-2">
              <Sparkles size={14} className="text-indigo-600 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-indigo-900">AI Insight</span>
                <p className="text-[11px] text-indigo-700 mt-1 leading-relaxed">{currentQuestion.insight}</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col border border-zinc-200 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-shadow">
              <div className="flex items-center gap-2 border-b border-zinc-200 p-2 bg-zinc-50">
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Bold size={13} /></button>
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Italic size={13} /></button>
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Underline size={13} /></button>
                <div className="w-px h-4 bg-zinc-300 mx-1" />
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><List size={13} /></button>
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><ListOrdered size={13} /></button>
                <div className="w-px h-4 bg-zinc-300 mx-1" />
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Link2 size={13} /></button>
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Code size={13} /></button>
                <button
                  type="button"
                  onClick={() => {
                    const newAnswers = [...answers];
                    newAnswers[currentQuestionIndex] = "This is an automatically generated correct answer for testing purposes. It demonstrates a deep understanding of the topic and provides structured points to ensure the candidate meets all requirements and exhibits strong problem-solving skills in this scenario.";
                    setAnswers(newAnswers);
                  }}
                  className="ml-auto px-2 py-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded hover:bg-indigo-100 transition-colors"
                >
                  Auto Fill Answer
                </button>
              </div>
              <textarea
                className="flex-1 w-full resize-none p-3 text-[12px] text-zinc-800 outline-none min-h-[150px]"
                placeholder="Type your answer here..."
                value={answers[currentQuestionIndex]}
                onBlur={handleSaveAnswer}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[currentQuestionIndex] = e.target.value;
                  setAnswers(newAnswers);
                }}
              ></textarea>
              <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 border-t border-zinc-100">
                <span className="text-[10px] text-zinc-500">Minimum 50 words</span>
                <span className="text-[10px] text-zinc-500 font-medium">{answers[currentQuestionIndex].split(/\s+/).filter(Boolean).length} / 2500</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-600 mt-3 mb-4">
              <CheckCircle2 size={13} />
              <span className="text-[10px] font-medium">
                {isSaving ? 'Saving...' : 'Your answer is auto-saved'}
              </span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <button 
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 bg-white border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-50 shadow-sm transition-colors disabled:opacity-50">
                <ArrowLeft size={13} /> Previous Question
              </button>
              {currentQuestionIndex === activeQuestions.length - 1 ? (
                <button 
                  onClick={() => handleEndExam(false)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-emerald-600 px-6 py-2 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors">
                  Submit Interview <CheckCircle2 size={13} />
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(activeQuestions.length - 1, prev + 1))}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-indigo-700 px-6 py-2 rounded-lg hover:bg-indigo-800 shadow-sm transition-colors disabled:opacity-50">
                  Next Question <ArrowLeft size={13} className="rotate-180" />
                </button>
              )}
            </div>
          </div>


        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <div className="bg-[#f8f7ff] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-indigo-600" />
              <h3 className="text-[12px] font-bold text-indigo-900">AI Interview Assistant</h3>
              <span className="text-[8px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">BETA</span>
            </div>
            {!hasStarted && !isCompleted && (
              <div className="mb-4">
                <button 
                  onClick={initInterview}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold py-2 rounded-lg shadow-sm transition-colors disabled:opacity-70"
                >
                  {isConnecting ? <><Loader2 size={13} className="animate-spin" /> Connecting...</> : 'Start Test'}
                </button>
              </div>
            )}
            {isAiConnected && isOffline && (
              <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-medium p-2 rounded-lg flex items-center gap-1.5">
                <AlertTriangle size={12} className="shrink-0" />
                <span>Operating in Offline Mode. Using fallback questions.</span>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {[
                "Questions are generated in real-time based on your role & experience.",
                "Answers are analyzed for technical accuracy, depth & clarity.",
                "Use diagrams or code snippets wherever applicable.",
                "Stay concise, structured and solution-focused."
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="mt-0.5 p-1 bg-indigo-100/50 rounded flex items-center justify-center shrink-0">
                    {i === 0 ? <HelpCircle size={10} className="text-indigo-600" /> :
                      i === 1 ? <FileQuestion size={10} className="text-indigo-600" /> :
                        i === 2 ? <Code size={10} className="text-indigo-600" /> :
                          <CheckCircle2 size={10} className="text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-indigo-900/80 leading-relaxed font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-100 bg-white shadow-sm flex flex-col">
            <h3 className="text-[12px] font-bold text-zinc-900 mb-4">Interview Rounds Overview</h3>
            <div className="relative pl-3 flex flex-col gap-5">
              <div className="absolute left-[17px] top-2 bottom-2 w-px bg-zinc-200 z-0"></div>

              <div className="relative z-10 flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5"><Check size={10} strokeWidth={3} /></div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-zinc-900">Round 1</span>
                  <span className="text-[9px] text-zinc-500">AI Screening Interview</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Completed</span>
                  <span className="text-[9px] text-zinc-500 font-medium">30 Min</span>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-3 bg-[#f8f7ff] p-3 -mx-3 rounded-lg">
                <div className="h-5 w-5 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shrink-0 mt-0.5"><div className="h-2 w-2 rounded-full bg-indigo-600" /></div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-indigo-700">Round 2</span>
                  <span className="text-[9px] font-semibold text-indigo-700">Technical Interview</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">In Progress</span>
                  <span className="text-[9px] text-indigo-500 font-medium">40 Min</span>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-3 opacity-60">
                <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">3</div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-zinc-800">Round 3</span>
                  <span className="text-[9px] text-zinc-500">Managerial Interview</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold text-zinc-500">Pending</span>
                  <span className="text-[9px] text-zinc-500 font-medium">30 Min</span>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-3 opacity-60">
                <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">4</div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-zinc-800">Round 4</span>
                  <span className="text-[9px] text-zinc-500">Written Assessment</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold text-zinc-500">Pending</span>
                  <span className="text-[9px] text-zinc-500 font-medium">45 Min</span>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-3 opacity-60">
                <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">5</div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-zinc-800">Round 5</span>
                  <span className="text-[9px] text-zinc-500">HR Interview</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold text-zinc-500">Pending</span>
                  <span className="text-[9px] text-zinc-500 font-medium">25 Min</span>
                </div>
              </div>
            </div>
          </div>


        </div>

      </div>

      {/* Bottom Grid: 3 columns with gaps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 ">

        {/* Your Previous Answer */}
        <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
          {currentQuestionIndex > 0 ? (
            <>
              <h3 className="text-[11px] font-bold text-zinc-900 mb-4">Your Previous Answer (Q{currentQuestionIndex})</h3>
              <div className="flex items-start gap-2 mb-3">
                <div className="h-5 w-5 bg-[#f0f9f4] text-emerald-600 rounded flex items-center justify-center shrink-0 font-bold text-[9px] border border-emerald-100">Q.{currentQuestionIndex}</div>
                <p className="text-[10px] font-bold text-zinc-900 mt-0.5 leading-relaxed">{activeQuestions[currentQuestionIndex - 1]?.text}</p>
              </div>
              <div className="bg-[#f4fbf7] rounded p-3 text-[10px] text-zinc-700 border border-emerald-50 mt-3 line-clamp-3 leading-relaxed">
                {answers[currentQuestionIndex - 1] || "No answer provided."}
                <div className="text-right w-full mt-3">
                  <button onClick={() => setIsModalOpen(true)} className="text-[9px] font-bold text-indigo-700 hover:underline">View Full Answer</button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-[11px] text-zinc-500 font-medium">No previous answer available.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
          <h3 className="text-[12px] font-bold text-zinc-900 mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: HelpCircle, label: 'Request Clarification', desc: 'Ask for more details about the question' },
              { icon: FileText, label: 'Add Interview Note', desc: 'Make a note about candidate\'s response' },
              { icon: Share2, label: 'Share Feedback', desc: 'Share feedback with the interview panel' },
              { icon: Code, label: 'Add Code Snippet / Attachment', desc: 'Upload diagram, code, or file' },
            ].map((action, i) => (
              <button key={i} className="flex items-start gap-3 text-left group">
                <div className="p-1.5 bg-[#f8f7ff] group-hover:bg-indigo-50 text-indigo-600 rounded mt-0.5 border border-indigo-50">
                  <action.icon size={13} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-zinc-800 group-hover:text-indigo-700">{action.label}</span>
                  <span className="text-[9px] text-zinc-500">{action.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interview Guidelines */}
        <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
          <h3 className="text-[12px] font-bold text-zinc-900 mb-4">Interview Guidelines</h3>
          <ul className="flex flex-col gap-3 text-[10px] text-zinc-600">
            <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> Ensure a quiet environment.</li>
            <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> Use headphones for better experience.</li>
            <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> Do not refresh or close the browser.</li>
            <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> AI will evaluate your responses in real-time.</li>
            <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> You can use notepad for rough work.</li>
          </ul>
          <button className="text-[10px] font-bold text-indigo-700 hover:underline mt-5 flex items-center gap-1">
            Need Help? View Guidelines <ExternalLink size={10} />
          </button>
        </div>
      </div>
      </>
      )}

      {activeTab === 'AI Questions' && (
        <div className="mt-4 p-5 rounded-xl border border-zinc-100 bg-white shadow-sm">
          <h3 className="text-[14px] font-bold text-zinc-900 mb-4">AI Interview Questions & Answers</h3>
          <div className="flex flex-col gap-6">
            {activeQuestions.length === 0 ? (
              <p className="text-[12px] text-zinc-500">No questions available yet.</p>
            ) : (
              activeQuestions.map((q: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-2 border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2">
                    <span className="h-5 w-5 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center shrink-0 font-bold text-[9px] border border-indigo-100 mt-0.5">
                      Q.{idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-indigo-600 mb-0.5">{q.category}</span>
                      <p className="text-[12px] font-bold text-zinc-900 leading-relaxed">{q.text || q.question}</p>
                    </div>
                  </div>
                  <div className="ml-7 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                    <p className="text-[11px] text-zinc-700 whitespace-pre-wrap leading-relaxed mb-3">
                      {answers[idx] ? answers[idx] : <span className="italic text-zinc-400">No answer provided.</span>}
                    </p>
                    <div className="bg-white border border-zinc-200 rounded p-3 flex flex-col gap-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-800">Final Verdict</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          (q.manualOverride || q.answerAnalysis?.verdict) === 'strong' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          (q.manualOverride || q.answerAnalysis?.verdict) === 'adequate' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          (q.manualOverride || q.answerAnalysis?.verdict) === 'weak' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-zinc-100 text-zinc-600 border border-zinc-200'
                        }`}>
                          {(q.manualOverride || q.answerAnalysis?.verdict)?.toUpperCase() || 'NO_ANSWER'}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-600 leading-relaxed">
                        {q.answerAnalysis?.reasoning || 'No analysis available.'}
                      </p>
                      
                      <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-[9px] text-zinc-500">Need to override AI score?</span>
                        <select 
                          className="text-[9px] border border-zinc-200 rounded px-2 py-1 bg-zinc-50 focus:outline-none"
                          value={q.manualOverride || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = [...activeQuestions];
                            updated[idx] = { ...updated[idx], manualOverride: val };
                            setActiveQuestions(updated);
                            if (interviewId) {
                                api.put(`/hiring/interviews/${interviewId}/questions`, { questions: updated }).catch(err => console.error(err));
                            }
                          }}
                        >
                          <option value="">Select Manual Rating</option>
                          <option value="strong">Strongly Meets</option>
                          <option value="adequate">Meets Requirements</option>
                          <option value="weak">Below Requirements</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isCompleted && (
              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => setActiveTab('Score')}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[12px] rounded-lg shadow-sm"
                >
                  View Final Score &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Notes' && (
        <div className="mt-4 p-5 rounded-xl border border-zinc-100 bg-white shadow-sm flex flex-col gap-4">
          <h3 className="text-[14px] font-bold text-zinc-900">Interview Notes</h3>
          <p className="text-[11px] text-zinc-500">Add private notes about the candidate's performance. These will not be visible to the candidate.</p>
          <textarea
            className="w-full h-32 p-3 text-[12px] border border-zinc-200 rounded-lg focus:outline-none focus:border-indigo-500"
            placeholder="Type your notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={async () => {
                if (!interviewId) return;
                try {
                  await api.put(`/hiring/interviews/${interviewId}/feedback`, { notes });
                  toast.success('Notes saved successfully');
                } catch (e) {
                  toast.error('Failed to save notes');
                }
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-md shadow-sm"
            >
              Save Notes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Attachments' && (
        <div className="mt-4 p-5 rounded-xl border border-zinc-100 bg-white shadow-sm flex flex-col gap-4">
          <h3 className="text-[14px] font-bold text-zinc-900">Attachments</h3>
          <p className="text-[11px] text-zinc-500">Upload code snippets, portfolios, or take-home assignment files.</p>
          <div className="flex items-center gap-3">
            <input 
              type="file"
              id="attachment-upload"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !interviewId) return;
                try {
                  setIsUploading(true);
                  const formData = new FormData();
                  formData.append('file', file);
                  const res = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  const newAtt = { name: file.name, url: res.data.url || res.data.secure_url || res.data };
                  const updated = [...attachments, newAtt];
                  setAttachments(updated);
                  await api.put(`/hiring/interviews/${interviewId}/feedback`, { attachments: updated });
                  toast.success('Attachment uploaded successfully');
                } catch (err) {
                  console.error(err);
                  toast.error('Failed to upload attachment');
                } finally {
                  setIsUploading(false);
                  e.target.value = '';
                }
              }}
            />
            <label htmlFor="attachment-upload" className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] rounded-md border border-zinc-300 cursor-pointer">
              {isUploading ? 'Uploading...' : 'Upload File'}
            </label>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {attachments.length === 0 ? (
               <p className="text-[11px] text-zinc-500 italic">No attachments added yet.</p>
            ) : (
               attachments.map((att, i) => (
                 <div key={i} className="flex items-center justify-between p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                   <div className="flex items-center gap-2">
                     <FileText size={14} className="text-zinc-500" />
                     <a href={att.url} target="_blank" rel="noreferrer" className="text-[12px] font-bold text-indigo-600 hover:underline">{att.name}</a>
                   </div>
                 </div>
               ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'Score' && (
        <div className="mt-4 p-8 rounded-xl border border-zinc-200 bg-white shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
          <Sparkles className="text-indigo-600 w-12 h-12 mb-4 bg-indigo-50 p-2 rounded-full" />
          <h3 className="text-[18px] font-bold text-zinc-900 mb-2">Round 2 Test Score</h3>
          <p className="text-[12px] text-zinc-500 max-w-md mb-6">
            The candidate's score is calculated based on the AI Evaluation verdicts and any manual overrides applied.
          </p>
          {(() => {
            const scorePercent = Math.round(activeQuestions.reduce((acc: number, q: any) => {
              const effectiveVerdict = q.manualOverride || q.answerAnalysis?.verdict;
              if (effectiveVerdict === 'strong') return acc + 100;
              if (effectiveVerdict === 'adequate') return acc + 75;
              if (effectiveVerdict === 'weak') return acc + 35;
              return acc;
            }, 0) / Math.max(activeQuestions.length, 1));
            const isPassing = scorePercent >= 60;
            return (
              <>
                <div className={`flex items-center justify-center w-32 h-32 rounded-full border-[8px] font-bold text-3xl mb-4 shadow-sm ${isPassing ? 'border-emerald-500 text-emerald-600' : 'border-rose-500 text-rose-600'}`}>
                  {scorePercent}%
                </div>
                <div className={`px-4 py-1 rounded-full font-bold text-[12px] mb-8 ${isPassing ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {isPassing ? 'PASSED' : 'FAILED'}
                </div>
                {isPassing ? (
                  <button 
                    onClick={() => {
                      toast.success('Candidate scheduled for Next Round!');
                      try {
                        const storedMap = JSON.parse(localStorage.getItem('ai_completed_rounds_map') || '{}');
                        storedMap[candidateId] = Math.max(storedMap[candidateId] || 0, 2);
                        localStorage.setItem('ai_completed_rounds_map', JSON.stringify(storedMap));
                      } catch (e) {}
                      router.push(`/dashboard/hiring/candidates/new/create/round-3/${candidateId}`);
                    }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] rounded-lg shadow-md transition-colors"
                  >
                    Schedule Next Round &rarr;
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      toast.success('Candidate Rejected.');
                      router.push('/dashboard/hiring/candidates');
                    }}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[13px] rounded-lg shadow-md transition-colors"
                  >
                    Reject Candidate
                  </button>
                )}
              </>
            );
          })()}
        </div>
      )}

      {isModalOpen && currentQuestionIndex > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 p-4">
              <h3 className="text-[14px] font-bold text-zinc-900">Your Previous Answer</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-md p-1.5 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-6 w-6 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center shrink-0 font-bold text-[10px] border border-indigo-100">
                  Q.{currentQuestionIndex}
                </div>
                <p className="text-[13px] font-bold text-zinc-900 mt-0.5 leading-relaxed">
                  {activeQuestions[currentQuestionIndex - 1]?.text}
                </p>
              </div>
              <div className="bg-zinc-50 rounded-lg p-4 text-[12px] text-zinc-700 border border-zinc-200 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                {answers[currentQuestionIndex - 1] || "No answer provided."}
              </div>
            </div>
            <div className="border-t border-zinc-100 p-4 flex justify-end">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg shadow-sm transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
}

