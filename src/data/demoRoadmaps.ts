import { CareerPreset, Milestone, RoadmapData } from '../types/roadmap';

export const DEMO_SETUP_INPUT = {
  dreamJob: 'Full Stack Developer at a Climate Tech Startup',
  industry: 'Climate Tech',
  level: 'College Student',
  existingSkills: ['C', 'Basic HTML'],
  hoursPerWeek: 10,
  timeline: '6 months',
  targetCompany: 'Startup'
};

export const INITIAL_DEMO_ROADMAP: RoadmapData = {
  career: 'Full Stack Developer at a Climate Tech Startup',
  industry: 'Climate Tech',
  level: 'College Student',
  timeline: '6 months',
  hoursPerWeek: 10,
  targetCompany: 'Startup',
  totalEstimatedHours: 240,
  estimatedWeeks: 24,
  generatedAt: new Date().toISOString(),
  phases: [
    {
      id: 'phase-1',
      name: 'PHASE 1 · Programming Foundations',
      duration: 'Weeks 1 - 3 (30 hrs)',
      description: 'Strengthen core logic, memory understanding, problem solving, and professional developer tools.',
      nodes: [
        {
          id: 'node-c-fundamentals',
          title: 'C Fundamentals',
          type: 'skill',
          status: 'completed',
          difficulty: 'Beginner',
          estimatedHours: 15,
          description: 'Pointers, memory allocation, arrays, structs, and programmatic execution models.',
          whyItMatters: 'Having C background gives you an intuitive understanding of computer memory that 90% of boot-camp grads lack.',
          whatToLearn: ['Memory layouts & pointers', 'Heap vs Stack allocation', 'Structs and pointer arithmetic', 'Compiling with GCC and debugging'],
          mission: 'Implement a memory-safe dynamic array struct in C with growth reallocation and automated test assertions.',
          githubProof: 'C repository with Makefile, Valgrind memory leak checks, and zero warnings.',
          interviewQuestion: 'What is a segmentation fault and what are the most common causes in low-level programming?',
          interviewAnswer: 'A segfault occurs when a program attempts to access a memory location it is not allowed to read or write, commonly caused by dereferencing null or dangling pointers.'
        },
        {
          id: 'node-problem-solving',
          title: 'Problem Solving & Basic DSA',
          type: 'skill',
          status: 'completed',
          difficulty: 'Beginner',
          estimatedHours: 12,
          description: 'Linear search, binary search, sorting algorithms, and basic algorithmic complexity (Big-O).',
          whyItMatters: 'Writing code that works is step one; understanding algorithmic trade-offs makes your applications fast.',
          whatToLearn: ['Time and Space complexity (O(1), O(n), O(n log n))', 'Arrays & Strings manipulation', 'Two-pointer technique', 'Recursion basics'],
          mission: 'Solve 15 foundational algorithmic problems and document time/space complexity trade-offs for each.',
          githubProof: 'Organized GitHub repo with problem statements, annotated test cases, and Big-O explanations.',
          interviewQuestion: 'Why is binary search O(log n) compared to linear search O(n)?',
          interviewAnswer: 'Binary search halves the search space with every comparison in a sorted array, requiring at most log2(n) comparisons.'
        },
        {
          id: 'node-git-github',
          title: 'Git & GitHub Workflow',
          type: 'skill',
          status: 'active',
          difficulty: 'Beginner',
          estimatedHours: 8,
          description: 'Distributed version control, branch hygiene, pull requests, and open-source contribution patterns.',
          whyItMatters: 'Every startup engineer collaborates through Git; clean commit messages are your engineering signature.',
          whatToLearn: ['Branch naming conventions & checkout', 'Rebase vs Merge workflows', 'Resolving merge conflicts calmly', 'Pull request templates and code reviews'],
          mission: 'Set up an open-source formatted repository with branch protection rules, Markdown documentation, and a PR template.',
          githubProof: 'Repository with at least 5 merged pull requests and a detailed README.md file.',
          interviewQuestion: 'Explain how you would safely recover when a merge conflict arises during a feature branch integration.',
          interviewAnswer: 'Check out the target branch, pull latest origin, switch back to feature branch, run git rebase main, resolve conflict markers in each affected file, test, and continue.'
        }
      ]
    },
    {
      id: 'phase-2',
      name: 'PHASE 2 · Web Foundations',
      duration: 'Weeks 4 - 6 (30 hrs)',
      description: 'Bridge software engineering principles to modern browser execution, DOM APIs, and HTTP communication.',
      nodes: [
        {
          id: 'node-html-css',
          title: 'Semantic HTML5 & Modern CSS',
          type: 'skill',
          status: 'completed',
          difficulty: 'Beginner',
          estimatedHours: 10,
          description: 'Accessible semantic structures, Flexbox, CSS Grid, custom properties, and responsive design.',
          whyItMatters: 'Clean DOM semantics are crucial for accessibility, search engines, and modern browser rendering performance.',
          whatToLearn: ['Semantic tags (<article>, <section>, <nav>)', 'CSS Flexbox & CSS Grid layouts', 'Media queries & mobile-first design', 'ARIA attributes and keyboard navigation'],
          mission: 'Build a responsive, accessible landing page for a solar energy cooperative with zero framework dependencies.',
          githubProof: 'Live deployment on GitHub Pages with 100% Lighthouse accessibility score.',
          interviewQuestion: 'What are the accessibility and SEO benefits of using semantic HTML over generic <div> containers?',
          interviewAnswer: 'Semantic HTML allows screen readers to provide clear navigation land-markers for impaired users and enables search crawlers to understand page structure and hierarchy.'
        },
        {
          id: 'node-javascript-core',
          title: 'Modern JavaScript (ES6+)',
          type: 'skill',
          status: 'active',
          difficulty: 'Intermediate',
          estimatedHours: 20,
          description: 'Closures, prototypes, event loops, promises, async/await, and module systems.',
          whyItMatters: 'JavaScript is the universal language of the web; mastering its asynchronous nature prevents 80% of frontend bugs.',
          whatToLearn: ['Closures & lexical scope', 'Event Loop: Call Stack vs Microtask Queue', 'Async / Await & Promise.all', 'ES modules, destructuring, and spread'],
          mission: 'Build an interactive Carbon Footprint Estimator that parses dynamic user inputs and outputs reactive chart metrics without third-party frameworks.',
          githubProof: 'Public repo with clean vanilla JS modules and zero console errors.',
          interviewQuestion: 'Explain how the JavaScript Event Loop handles Promises versus setTimeout callbacks.',
          interviewAnswer: 'Promises resolve into the Microtask Queue which runs immediately after the current script executes, before the Macrotask Queue (where setTimeout resides) is processed.'
        },
        {
          id: 'node-http-rest',
          title: 'HTTP & REST APIs',
          type: 'skill',
          status: 'active',
          difficulty: 'Intermediate',
          estimatedHours: 10,
          description: 'Stateless communication, request headers, query parameters, status codes, and error handling.',
          whyItMatters: 'Frontend clients and backend servers communicate across HTTP; robust error handling creates resilient apps.',
          whatToLearn: ['HTTP Methods: GET, POST, PUT, PATCH, DELETE', 'Status codes (200, 201, 400, 401, 403, 404, 500)', 'Headers, Content-Type, CORS policies', 'Fetch API with abort controllers'],
          mission: 'Write a resilient API client fetching live climate sensor data with automatic retry backoff on 503 network drops.',
          githubProof: 'Standalone NPM utility or GitHub demo showcasing graceful offline fallbacks and error boundaries.',
          interviewQuestion: 'What is the distinction between PUT and PATCH in a RESTful API?',
          interviewAnswer: 'PUT replaces an entire existing resource with the incoming payload, while PATCH applies partial updates to only the modified fields.'
        }
      ]
    },
    {
      id: 'phase-3',
      name: 'PHASE 3 · Frontend Engineering (React)',
      duration: 'Weeks 7 - 10 (40 hrs)',
      description: 'Master component hierarchy, declarative rendering, custom reactive hooks, and frontend state engines.',
      nodes: [
        {
          id: 'node-react-core',
          title: 'React & Component Architecture',
          type: 'skill',
          status: 'recommended',
          difficulty: 'Intermediate',
          estimatedHours: 22,
          description: 'JSX, component decomposition, unidirectional data flow, props interface typing, and rendering lifecycle.',
          whyItMatters: 'React powers the SaaS industry. Understanding component composition makes large applications maintainable.',
          whatToLearn: ['Component decomposition', 'Props typing with TypeScript', 'Reconciliation & key prop mechanics', 'Component composition patterns'],
          mission: 'Build a modular Renewable Energy Plant Monitor with reusable gauge, telemetry, and toggle cards.',
          githubProof: 'Vercel deployment link with clean modular folder structure and zero prop drilling.',
          interviewQuestion: 'Why should keys in React lists never be set to the array index if the list can be reordered or filtered?',
          interviewAnswer: 'Using indices as keys tricks React into reusing DOM nodes incorrectly when items are added, deleted, or reordered, leading to state inconsistencies and rendering bugs.'
        },
        {
          id: 'node-react-state-hooks',
          title: 'State Management & Custom Hooks',
          type: 'skill',
          status: 'recommended',
          difficulty: 'Intermediate',
          estimatedHours: 18,
          description: 'useState, useEffect, useMemo, useCallback, useRef, custom business hooks, and global state with Zustand.',
          whyItMatters: 'State is where software complexity lives. Writing decoupled custom hooks turns chaotic UI into clean engineering.',
          whatToLearn: ['Custom reusable hooks (e.g. useDebounce, useSensors)', 'useReducer for complex state machines', 'Zustand or Context for application state', 'Optimizing re-renders with memoization'],
          mission: 'Create a custom hook useClimateSensors that handles WebSocket streams, reconnects on failure, and manages live sensor state.',
          githubProof: 'Unit tests for custom hooks using React Testing Library.',
          interviewQuestion: 'Explain the difference between state and props in React.',
          interviewAnswer: 'Props are external immutable inputs passed into a component like arguments to a function, whereas state is internal mutable data maintained by the component that triggers re-renders when updated.'
        }
      ]
    },
    {
      id: 'phase-4',
      name: 'PHASE 4 · Backend & API Architecture',
      duration: 'Weeks 11 - 13 (30 hrs)',
      description: 'Engineer high-throughput server backends, secure authentication layers, and robust RESTful interfaces.',
      nodes: [
        {
          id: 'node-node-express',
          title: 'Node.js & Express REST Backend',
          type: 'skill',
          status: 'locked',
          difficulty: 'Intermediate',
          estimatedHours: 16,
          description: 'Non-blocking I/O event loops, Express routing, custom middleware pipelines, and structured logging.',
          whyItMatters: 'Full-stack mastery requires knowing how servers accept connections, handle heavy payloads, and handle errors.',
          whatToLearn: ['Express routing & nested routers', 'Middleware chaining and global error handlers', 'Environment variable security (dotenv)', 'Zod schema validation on request bodies'],
          mission: 'Build a production-ready Express API server with request validation, rate limiting, and structured JSON logs.',
          githubProof: 'Repository with Postman / Bruno collection and automated supertest integration tests.',
          interviewQuestion: 'How does Node.js achieve high concurrency despite executing on a single main thread?',
          interviewAnswer: 'Node.js utilizes an event loop built on libuv that offloads asynchronous I/O operations (file system, network calls) to the operating system kernel or background worker thread pool.'
        },
        {
          id: 'node-auth-security',
          title: 'Authentication & Security',
          type: 'skill',
          status: 'locked',
          difficulty: 'Intermediate',
          estimatedHours: 14,
          description: 'JSON Web Tokens (JWT), password hashing (bcrypt), cookie security (HttpOnly), and role-based access control.',
          whyItMatters: 'Security cannot be an afterthought in climate tech startups handling enterprise energy audits and proprietary data.',
          whatToLearn: ['Bcrypt salted hashing', 'Access token & Refresh token rotation', 'HttpOnly and SameSite cookie policies', 'Role-based access control (RBAC) middleware'],
          mission: 'Implement an end-to-end authentication system supporting signup, login, session refresh, and admin-only endpoints.',
          githubProof: 'Security audit test verifying tokens cannot be extracted from XSS-vulnerable scripts.',
          interviewQuestion: 'Why should JSON Web Tokens containing sensitive claims be stored in HttpOnly cookies rather than localStorage?',
          interviewAnswer: 'localStorage is vulnerable to Cross-Site Scripting (XSS) attacks where malicious scripts can steal tokens, whereas HttpOnly cookies cannot be read by client JavaScript.'
        }
      ]
    },
    {
      id: 'phase-5',
      name: 'PHASE 5 · Database & Persistence',
      duration: 'Weeks 14 - 16 (30 hrs)',
      description: 'Model real-world relational systems, guarantee transactional consistency, and write high-performance queries.',
      nodes: [
        {
          id: 'node-sql-postgres',
          title: 'SQL & PostgreSQL Foundations',
          type: 'skill',
          status: 'locked',
          difficulty: 'Intermediate',
          estimatedHours: 16,
          description: 'Relational table design, primary/foreign keys, joins, aggregate queries, and normalization.',
          whyItMatters: 'PostgreSQL is the gold standard database for high-integrity production software worldwide.',
          whatToLearn: ['Normalized schema design (1NF, 2NF, 3NF)', 'INNER, LEFT, and FULL OUTER joins', 'Aggregate functions and GROUP BY', 'PostgreSQL constraints and enum types'],
          mission: 'Write a normalized schema modeling solar arrays, power generation readings, and corporate customer subscriptions.',
          githubProof: 'SQL migration scripts with sample data seeds and benchmarked analytical queries.',
          interviewQuestion: 'When would you use an index in a relational database, and what is the trade-off of having too many indexes?',
          interviewAnswer: 'Indexes drastically accelerate SELECT queries with filter or join conditions, but they consume extra disk storage and incur performance overhead during INSERT, UPDATE, and DELETE operations.'
        },
        {
          id: 'node-db-design-orm',
          title: 'Database Design & Modern ORMs',
          type: 'skill',
          status: 'locked',
          difficulty: 'Intermediate',
          estimatedHours: 14,
          description: 'Type-safe database access with Drizzle / Prisma, migration workflows, and indexing strategies.',
          whyItMatters: 'Type-safe ORMs eliminate runtime database syntax errors and keep frontend, backend, and DB types in perfect sync.',
          whatToLearn: ['Schema definition files in TypeScript', 'Automated migrations without data loss', 'Eager vs Lazy loading and N+1 query problem', 'Connection pooling in serverless/container environments'],
          mission: 'Set up an automated migration pipeline using Drizzle ORM connecting to a live cloud PostgreSQL database.',
          githubProof: 'Repository with type-safe queries and zero TypeScript errors when interacting with DB records.',
          interviewQuestion: 'What is the N+1 query problem in ORMs and how do you resolve it?',
          interviewAnswer: 'It occurs when an ORM executes 1 query for a parent list and then N separate queries for each child record; solved using eager loading (JOINs) or batch query fetching.'
        }
      ]
    },
    {
      id: 'phase-6',
      name: 'PHASE 6 · Flagship Real-World Capstone',
      duration: 'Weeks 17 - 19 (30 hrs)',
      description: 'Engineer and deploy a comprehensive, domain-native product that serves real climate data.',
      nodes: [
        {
          id: 'node-climate-dashboard-project',
          title: 'EcoPulse: Climate Intelligence Platform',
          type: 'project',
          status: 'recommended',
          difficulty: 'Advanced',
          estimatedHours: 35,
          description: 'Full-stack application ingesting live environmental satellite data, generating real-time emission analytics, and automated reduction alerts.',
          whyItMatters: 'Hiring managers at climate startups review dozens of candidates with identical to-do apps. A live climate platform stands out instantly.',
          whatToLearn: ['Full-stack monorepo setup', 'Data visualization (Recharts / Chart.js)', 'Background polling / Cron jobs for sensor ingestion', 'Cloud deployment with Docker / Cloud Run / Vercel'],
          mission: 'Build and deploy EcoPulse: Ingest Open-Meteo & NASA API data, persist user alerts in PostgreSQL, and render real-time interactive emissions graphs.',
          githubProof: 'Live deployed URL with SSL certificate, detailed README with architectural diagram, and recorded 60-second video walkthrough.',
          interviewQuestion: 'Walk me through an architectural bottleneck you encountered during this project and how you solved it.',
          interviewAnswer: 'Detail how sensor time-series data caused UI lag, and how you resolved it by aggregating readings into 15-minute buckets on the backend and memoizing chart renders.'
        }
      ]
    },
    {
      id: 'phase-7',
      name: 'PHASE 7 · Career Proof & Visibility',
      duration: 'Weeks 20 - 21 (20 hrs)',
      description: 'Transform your technical accomplishments into recruiter-attracting public proof of competence.',
      nodes: [
        {
          id: 'node-portfolio-proof',
          title: 'GitHub Portfolio & Technical Blog',
          type: 'portfolio',
          status: 'locked',
          difficulty: 'Intermediate',
          estimatedHours: 12,
          description: 'Personal portfolio website, pinned showcase repositories with architecture diagrams, and high-impact technical articles.',
          whyItMatters: 'Recruiters and engineering leads spend under 60 seconds reviewing portfolios. Crisp presentation earns interview calls.',
          whatToLearn: ['Architecture diagramming with Mermaid', 'Technical writing on architectural trade-offs', 'SEO and social share cards for your site', 'Curating pinned repositories with demo GIFs'],
          mission: 'Publish a technical deep-dive article: "How I Built a Real-Time Climate Telemetry Engine with React & PostgreSQL".',
          githubProof: 'Personal portfolio site with live demo links, responsive design, and published technical article.',
          interviewQuestion: 'How do you determine when a project is production-ready?',
          interviewAnswer: 'When it has automated unit and integration tests, error logging with alerts, secure secret management, responsive UI, and verified performance under expected network latencies.'
        },
        {
          id: 'node-linkedin-resume',
          title: 'Resume & LinkedIn Optimization',
          type: 'portfolio',
          status: 'locked',
          difficulty: 'Beginner',
          estimatedHours: 8,
          description: 'Action-oriented bullet points, ATS-optimized formatting, and targeting climate-tech keywords.',
          whyItMatters: 'Clear metrics-driven resume bullets ensure you pass applicant screening filters and capture technical interest.',
          whatToLearn: ['Google XYZ resume bullet formula', 'Highlighting tech stack impact (e.g. latency, features shipped)', 'Targeted LinkedIn profile keywords', 'Engaging with climate tech engineering founders'],
          mission: 'Craft 4 quantifiable bullet points for EcoPulse and configure LinkedIn profile headline for Climate Tech Software Engineering.',
          githubProof: 'Completed single-page PDF resume with verified clickable links.',
          interviewQuestion: 'Tell me about yourself and why you are passionate about software engineering in the climate tech space.',
          interviewAnswer: 'Anchor your college background, your transition from C fundamentals to full-stack architectures, and your commitment to solving decarbonization through measurable software systems.'
        }
      ]
    },
    {
      id: 'phase-8',
      name: 'PHASE 8 · Experience & Industry Outreach',
      duration: 'Weeks 22 - 23 (20 hrs)',
      description: 'Engage with startups, contribute to open-source climate tools, and submit targeted applications.',
      nodes: [
        {
          id: 'node-internship-applications',
          title: 'Startup Outreach & Open Source',
          type: 'experience',
          status: 'locked',
          difficulty: 'Intermediate',
          estimatedHours: 20,
          description: 'Personalized cold outreach to climate tech CTOs, contributing to open-source climate repositories, and tracking application pipelines.',
          whyItMatters: 'Direct, thoughtful outreach to startup engineering leads yields 5x higher response rates than spray-and-pray job boards.',
          whatToLearn: ['High-conversion cold email templates', 'Finding active issues in open-source projects', 'Preparing targeted loom video demos', 'Application pipeline tracking in Notion/Airtable'],
          mission: 'Submit 1 pull request to an open-source environmental data repo and send 10 personalized outreach messages with project demos.',
          githubProof: 'Merged open-source pull request link.',
          interviewQuestion: 'Why do you want to join our specific company over a traditional big tech corporation?',
          interviewAnswer: 'Demonstrate deep alignment with their specific mission, reference a feature they shipped recently, and explain how your full-stack capstone gives you day-one velocity.'
        }
      ]
    },
    {
      id: 'phase-9',
      name: 'PHASE 9 · Technical Interview Mastery',
      duration: 'Weeks 24 (25 hrs)',
      description: 'Master live coding interviews, full-stack system design rounds, and behavioral storytelling.',
      nodes: [
        {
          id: 'node-interview-dsa-system',
          title: 'Full-Stack & System Design Prep',
          type: 'interview',
          status: 'locked',
          difficulty: 'Advanced',
          estimatedHours: 20,
          description: 'Live coding fluency, React internals, backend scaling principles, database indexes, and behavioral STAR rounds.',
          whyItMatters: 'Confidence in technical interviews turns candidate interest into signed offers with high compensation.',
          whatToLearn: ['Core 50 LeetCode patterns', 'React lifecycle and memoization interview questions', 'Designing an API with rate limiting and caching', 'Behavioral answers using the STAR method'],
          mission: 'Complete 3 mock technical interviews covering live coding, React architecture, and system scaling.',
          githubProof: 'Curated repository of interview solutions and concise concept flashcards.',
          interviewQuestion: 'How would you scale a climate sensor ingestion pipeline from 100 sensors to 100,000 sensors transmitting data every second?',
          interviewAnswer: 'Introduce an asynchronous message broker (Kafka/RabbitMQ) to ingest telemetry, decouple write operations from analytical queries, use time-series database partitioning, and cache live aggregations in Redis.'
        },
        {
          id: 'node-target-career-final',
          title: 'Full Stack Developer — Climate Tech',
          type: 'milestone',
          status: 'locked',
          difficulty: 'Expert',
          estimatedHours: 5,
          description: 'Offer received, contract negotiated, and ready to make tangible environmental impact with production software.',
          whyItMatters: 'The ultimate target: your dream career, reverse-engineered and fully realized.',
          whatToLearn: ['Offer evaluation & compensation review', 'First 90 days playbook for engineering impact', 'Continuous professional growth'],
          mission: 'Sign your offer and celebrate launching your career in Climate Tech!',
          githubProof: 'Your verified skill tree and journey completed.',
          interviewQuestion: 'What are your goals for your first 90 days in this role?',
          interviewAnswer: 'Ship a small feature within the first two weeks to master the deployment pipeline, understand system dependencies, and actively document team knowledge.'
        }
      ]
    }
  ]
};

export const POPULAR_CAREER_PRESETS: CareerPreset[] = [
  {
    id: 'fullstack-climate',
    title: 'Full Stack Developer (Climate Tech)',
    industry: 'Climate Tech',
    tagline: 'Engineer platforms driving decarbonization, clean energy, and sustainability telemetry.',
    description: 'Build responsive web apps and scalable backends that process real-world environmental data and carbon accounting metrics.',
    difficulty: 'Intermediate',
    typicalTimeline: '6 months',
    estimatedHours: 240,
    coreSkills: ['React', 'Node.js', 'PostgreSQL', 'REST APIs', 'Data Visualization', 'Docker'],
    entryRoles: ['Junior Full Stack Engineer', 'Frontend Engineer', 'Web Applications Developer'],
    recommendedProjects: ['Climate Sensor Dashboard', 'Carbon Footprint Calculator', 'Clean Energy Grid Tracker']
  },
  {
    id: 'ai-engineer',
    title: 'AI / Machine Learning Engineer',
    industry: 'AI & Data Science',
    tagline: 'Architect LLM systems, agent workflows, and production model inference pipelines.',
    description: 'Bridge software engineering and modern generative models to build intelligent systems with evaluation and safety guardrails.',
    difficulty: 'Advanced',
    typicalTimeline: '8 months',
    estimatedHours: 320,
    coreSkills: ['Python', 'PyTorch', 'Vector Databases', 'LangChain', 'FastAPI', 'Evaluation Frameworks'],
    entryRoles: ['Associate AI Engineer', 'ML Application Developer', 'Data Scientist'],
    recommendedProjects: ['Autonomous Research Agent', 'Enterprise Semantic Search', 'Multimodal Assistant']
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    industry: 'Cybersecurity',
    tagline: 'Protect critical infrastructure, conduct vulnerability assessments, and safeguard data.',
    description: 'Analyze security telemetry, harden systems, investigate incidents, and enforce zero-trust security postures.',
    difficulty: 'Intermediate',
    typicalTimeline: '6 months',
    estimatedHours: 250,
    coreSkills: ['Network Security', 'Linux', 'SIEM Tools', 'Python Scripting', 'Cryptography', 'Threat Modeling'],
    entryRoles: ['SOC Analyst (Tier 1)', 'Information Security Associate', 'Junior Pentester'],
    recommendedProjects: ['Automated Vulnerability Scanner', 'SIEM Telemetry Lab', 'Zero-Trust Auth Gateway']
  },
  {
    id: 'cloud-devops-engineer',
    title: 'Cloud & DevOps Engineer',
    industry: 'Infrastructure & Cloud',
    tagline: 'Automate deployments, scale container fleets, and manage cloud reliability.',
    description: 'Design CI/CD pipelines, orchestrate Kubernetes clusters, and manage infrastructure as code on AWS and Google Cloud.',
    difficulty: 'Advanced',
    typicalTimeline: '7 months',
    estimatedHours: 290,
    coreSkills: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD Actions', 'Linux', 'AWS/GCP'],
    entryRoles: ['Cloud Operations Engineer', 'Junior DevOps Engineer', 'Site Reliability Associate'],
    recommendedProjects: ['Multi-Cloud Kubernetes Fleet', 'Zero-Downtime Blue/Green Pipeline', 'Auto-Scaling Microservices']
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist & Analytics Lead',
    industry: 'Data & Analytics',
    tagline: 'Extract actionable signals, statistical models, and revenue insights from massive datasets.',
    description: 'Clean messy data, build predictive regression and classification models, and communicate strategic insights to leadership.',
    difficulty: 'Intermediate',
    typicalTimeline: '6 months',
    estimatedHours: 260,
    coreSkills: ['SQL', 'Python (Pandas, Scikit-learn)', 'Statistical Modeling', 'Tableau', 'A/B Testing'],
    entryRoles: ['Data Analyst', 'Junior Data Scientist', 'Business Intelligence Developer'],
    recommendedProjects: ['Customer Churn Prediction Model', 'Public Healthcare Data Lakehouse', 'A/B Test Decision Suite']
  },
  {
    id: 'game-developer',
    title: 'Game Developer (Unity / Unreal)',
    industry: 'Gaming & Interactive',
    tagline: 'Craft immersive gameplay mechanics, 3D worlds, and interactive physics simulations.',
    description: 'Program gameplay systems, optimize graphics pipelines, and design responsive player controls for desktop and consoles.',
    difficulty: 'Advanced',
    typicalTimeline: '8 months',
    estimatedHours: 340,
    coreSkills: ['C# / C++', 'Unity / Unreal Engine', 'Linear Algebra', 'Physics Engines', 'Shaders & HLSL'],
    entryRoles: ['Junior Gameplay Programmer', 'Technical Artist', 'Tools Developer'],
    recommendedProjects: ['2D Metroidvania Platformer', '3D Physics Puzzle Sandbox', 'Multiplayer Arena Prototype']
  },
  {
    id: 'product-manager-tech',
    title: 'Technical Product Manager',
    industry: 'Product & SaaS',
    tagline: 'Bridge business strategy, user experience, and technical execution for winning products.',
    description: 'Define product requirements, guide cross-functional sprint teams, analyze customer metrics, and steer feature roadmaps.',
    difficulty: 'Intermediate',
    typicalTimeline: '5 months',
    estimatedHours: 200,
    coreSkills: ['Product Strategy', 'Agile / Scrum', 'SQL for Metrics', 'User Research', 'Wireframing', 'System Architecture Basics'],
    entryRoles: ['Associate Product Manager (APM)', 'Technical Business Analyst', 'Product Specialist'],
    recommendedProjects: ['End-to-End Product PRD & Spec', 'Growth Funnel Teardown & Optimization', 'Feature Launch Playbook']
  }
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    title: 'First Skill Completed',
    description: 'Completed your first fundamental skill node on the career roadmap.',
    xpReward: 100,
    completed: true,
    unlockedAt: '2 days ago',
    iconName: 'Award'
  },
  {
    id: 'm2',
    title: 'First GitHub Project',
    description: 'Verified a public repository proof with clean documentation and code.',
    xpReward: 200,
    completed: true,
    unlockedAt: 'Yesterday',
    iconName: 'Github'
  },
  {
    id: 'm3',
    title: 'First AI Mission',
    description: 'Completed a customized weekend engineering mission with verifiable code.',
    xpReward: 150,
    completed: true,
    unlockedAt: 'Today',
    iconName: 'Zap'
  },
  {
    id: 'm4',
    title: 'First AI Roadmap',
    description: 'Reverse-engineered your dream career into a personalized interactive skill tree.',
    xpReward: 150,
    completed: true,
    unlockedAt: 'Today',
    iconName: 'Map'
  },
  {
    id: 'm5',
    title: 'Dynamic Replanning Activated',
    description: 'Told CareerQuest AI what you already know and optimized your timeline.',
    xpReward: 150,
    completed: false,
    iconName: 'Zap'
  },
  {
    id: 'm6',
    title: 'Portfolio Ready',
    description: 'Curated your top 3 repositories and launched your personal portfolio.',
    xpReward: 250,
    completed: false,
    iconName: 'FolderGit2'
  },
  {
    id: 'm7',
    title: 'Internship Ready',
    description: 'Completed open-source contributions and personalized startup outreach.',
    xpReward: 300,
    completed: false,
    iconName: 'Briefcase'
  },
  {
    id: 'm8',
    title: 'Mock Interview',
    description: 'Answered technical challenges and system design questions with high marks.',
    xpReward: 250,
    completed: false,
    iconName: 'MessageSquare'
  },
  {
    id: 'm9',
    title: 'Flagship Capstone Launched',
    description: 'Built and publicly deployed a domain-native full-stack project.',
    xpReward: 350,
    completed: false,
    iconName: 'Rocket'
  },
  {
    id: 'm10',
    title: 'Dream Job Ready',
    description: 'Completed the entire skill tree and landed your target engineering position.',
    xpReward: 500,
    completed: false,
    iconName: 'Trophy'
  }
];
