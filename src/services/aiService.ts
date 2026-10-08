import { CareerSetupInput, RoadmapData } from '../types/roadmap';
import { INITIAL_DEMO_ROADMAP } from '../data/demoRoadmaps';

export async function requestRoadmapGeneration(input: CareerSetupInput): Promise<RoadmapData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    const res = await fetch('/api/generate-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.phases && data.phases.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Network request to generate roadmap failed, generating client-side customized roadmap', err);
  }

  // Client-side customized generator tailored to input
  return generateClientCustomizedRoadmap(input);
}

export async function requestCoachResponse(
  message: string,
  roadmapContext: { career: string; industry: string; level: string; hoursPerWeek: number }
): Promise<string> {
  try {
    const res = await fetch('/api/chat-coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, roadmapContext })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
    }
  } catch (err) {
    console.warn('Coach request network error, using smart local coach', err);
  }

  const msg = message.toLowerCase();

  // Section 10 6 specific suggested questions handling:
  if (msg.includes('next') || msg.includes('prioritize')) {
    return `Looking at your roadmap for **${roadmapContext.career}**, your next critical move is:
1. **Focus on the active technical node**: Do not jump ahead to advanced distributed concepts until you have built a tangible weekend project for your active skill.
2. **Commit daily**: With your commitment of **${roadmapContext.hoursPerWeek} hrs/week**, schedule two 2-hour blocks mid-week and one 4-hour build session on Saturday.
3. Once completed, click **"Mark Complete"** to unlock the next milestone!`;
  }

  if (msg.includes('project') || msg.includes('build')) {
    return `For ${roadmapContext.industry}, hiring managers look for domain-specific execution! Avoid generic To-Do lists.
Build a **Domain-Native Production Telemetry Platform**:
- Ingest real data via public REST or WebSocket APIs.
- Store user preferences or alerts in PostgreSQL with type-safe queries.
- Implement token authentication and responsive chart UI.
This immediately proves to technical leads that you understand end-to-end data pipelines!`;
  }

  if (msg.includes('internship') || msg.includes('ready')) {
    return `To assess your readiness for an internship targeting **${roadmapContext.career}**:
1. **GitHub Proof**: You need at least 2 non-trivial repositories with live deployment links, clean commit histories, and setup instructions.
2. **Technical Fluency**: Ability to articulate architectural trade-offs (e.g. why you picked SQL vs NoSQL, or how async promises work under the hood).
3. **Open-Source Contribution**: One merged PR into an open repository demonstrates you can navigate a shared team codebase.`;
  }

  if (msg.includes('resume')) {
    return `To make your resume stand out for **${roadmapContext.career}**:
- **Lead with Projects**: Put your flagship project at the top under your education.
- **Use the Google XYZ Formula**: "Built [X] using [Tech Stack] resulting in [Metric/Impact]."
- **Include Live URLs**: Every project must have a live Vercel/Render link and a clean GitHub repo.
- **Remove Obvious Filler**: Drop basic school assignments and highlight production tooling like Git, Docker, or CI/CD.`;
  }

  if (msg.includes('explain')) {
    return `When explaining core technical concepts for **${roadmapContext.career}**, technical interviewers look for:
1. **The Core Purpose**: What problem does this skill solve that older tools couldn't?
2. **The Mental Model**: How does data flow through the system?
3. **The Trade-offs**: When would you NOT use this tool?
Practice answering using the STAR method (Situation, Task, Action, Result) to demonstrate mature engineering mindset!`;
  }

  if (msg.includes('weekend') || msg.includes('project')) {
    return `Here is your high-impact Weekend Mission for **${roadmapContext.career}**:
- **Mission**: Build and deploy a micro-service or interactive dashboard solving a concrete data challenge in ${roadmapContext.industry}.
- **Deliverable**: A public GitHub repo with unit tests and a live deployment link.
- **Time Target**: 5-6 hours of focused execution.
Push your code by Sunday evening, add a clean README, and post a 30-second screen capture to LinkedIn!`;
  }

  if (msg.includes('interview')) {
    return `To prepare for interviews targeting **${roadmapContext.career}**:
1. **Core Data Structures & Async Logic**: Review the interview question and answer attached to your current roadmap nodes.
2. **System Design & Trade-offs**: Be ready to explain why you chose SQL vs NoSQL, or how you solved latency/rendering bottlenecks in your capstone project.
3. **STAR Method for Projects**: Structure your stories: Situation, Task, Action, and Measurable Result. Recruiters hire candidates who can articulate why their code was written that way!`;
  }

  if (msg.includes('missing') || msg.includes('dream role')) {
    return `Looking at the gap between your current level and **${roadmapContext.career}**:
1. **Production Deployment Proof**: Many students only write code locally on localhost. Deploy your flagship project to the cloud (Vercel, Render, or Cloud Run) with continuous CI/CD.
2. **Relational Database Modeling**: Ensure you can write optimized SQL queries, configure indexes, and handle transactions.
3. **Observability & Error Handling**: Adding structured error boundaries and automated tests immediately separates junior applicants from top 5% candidates.`;
  }

  return `Great question regarding your journey to **${roadmapContext.career}**!
With your commitment of **${roadmapContext.hoursPerWeek} hours/week**, consistency will compound rapidly.
Prioritize completing the active nodes on your skill tree and verifying each with a tangible GitHub commit or working demo. What specific milestone are you tackling today?`;
}

export async function requestNewMission(skillTitle: string, career: string, industry: string) {
  try {
    const res = await fetch('/api/generate-mission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillTitle, career, industry })
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Mission generation network error, using tailored fallback', err);
  }

  return {
    mission: `Architect a standalone mini-service demonstrating ${skillTitle} for real-world ${industry} telemetry.`,
    goal: `Build, test, and document a production-ready component featuring error boundaries and test assertions.`,
    difficulty: 'Intermediate',
    estimatedHours: 5,
    skillsPracticed: [skillTitle, 'Unit Testing', 'TypeScript Typing', 'Performance Tuning'],
    deliverable: 'A clean GitHub repository with automated test scripts and a live deployment preview.',
    githubProof: 'GitHub repository with 100% test pass rate and architecture diagram in README.md',
    interviewQuestion: `How would you architect a production feature utilizing ${skillTitle} to maximize performance under high load?`,
    interviewAnswer: `By decoupling synchronous bottlenecks, implementing intelligent caching at the boundaries, and maintaining strict schema validation.`
  };
}

// Section 17 Multi-Career Generator Engine
export function generateClientCustomizedRoadmap(input: CareerSetupInput): RoadmapData {
  const dreamJob = input.dreamJob || 'Software Engineer';
  const dreamLower = dreamJob.toLowerCase();
  const industryLower = (input.industry || '').toLowerCase();
  const hoursPerWeek = Number(input.hoursPerWeek) || 10;
  const known = new Set(input.existingSkills.map(s => s.toLowerCase().trim()));

  // 1. Climate Tech / Full Stack Developer
  if (dreamLower.includes('climate') || (dreamLower.includes('full stack') && industryLower.includes('climate'))) {
    return {
      ...INITIAL_DEMO_ROADMAP,
      career: dreamJob,
      industry: input.industry || 'Climate Tech',
      level: input.level || 'College Student',
      hoursPerWeek,
      timeline: input.timeline || '6 months',
      targetCompany: input.targetCompany || 'Startup',
      estimatedWeeks: Math.ceil(INITIAL_DEMO_ROADMAP.totalEstimatedHours / hoursPerWeek)
    };
  }

  // 2. AI Engineer (FinTech / Machine Learning)
  if (dreamLower.includes('ai') || dreamLower.includes('machine learning') || industryLower.includes('ai')) {
    return {
      career: dreamJob,
      industry: input.industry || 'AI & FinTech',
      level: input.level || 'College Student',
      timeline: input.timeline || '6 months',
      hoursPerWeek,
      targetCompany: input.targetCompany || 'Product Company',
      totalEstimatedHours: 260,
      estimatedWeeks: Math.ceil(260 / hoursPerWeek),
      generatedAt: new Date().toISOString(),
      phases: [
        {
          id: 'ai-phase-1',
          name: 'PHASE 1 · Foundations: Python & Math for Machine Learning',
          duration: `Weeks 1 - ${Math.max(3, Math.ceil(35 / hoursPerWeek))}`,
          description: 'Linear algebra, vector spaces, calculus gradients, and high-performance NumPy/Pandas computation.',
          nodes: [
            {
              id: 'ai-python-math',
              title: 'Python for Systems & Linear Algebra',
              type: 'skill',
              status: known.has('python') ? 'completed' : 'active',
              difficulty: 'Beginner',
              estimatedHours: 20,
              description: 'Matrix transformations, vector dot products, eigen-decompositions, and vectorized NumPy arrays.',
              whyItMatters: 'Deep learning weights and embeddings are high-dimensional vectors; mathematical intuition prevents blind tuning.',
              whatToLearn: ['NumPy broadcasting & vectorization', 'Matrix multiplication algorithms', 'Gradients & partial derivatives', 'Memory-efficient array buffers'],
              mission: 'Build an automated tensor calculation module in NumPy with manual backprop gradients and PyTest tests.',
              githubProof: 'GitHub repository with benchmarked matrix operations and 100% test coverage.',
              interviewQuestion: 'Why is vectorization in NumPy significantly faster than iterative Python for-loops?',
              interviewAnswer: 'NumPy arrays are stored contiguously in C memory and execute across SIMD processor instructions, avoiding Python object overhead.'
            },
            {
              id: 'ai-git-scikit',
              title: 'Statistical Modeling & Scikit-Learn',
              type: 'skill',
              status: 'active',
              difficulty: 'Intermediate',
              estimatedHours: 15,
              description: 'Regression, classification, cross-validation, feature normalization, and ROC-AUC metrics.',
              whyItMatters: 'Classical statistical models serve as essential baselines before deploying multi-million parameter neural nets.',
              whatToLearn: ['k-fold cross-validation', 'Gradient boosting (XGBoost)', 'Precision, Recall, F1 scores', 'Handling unbalanced financial data'],
              mission: 'Train an XGBoost credit risk evaluation model handling imbalanced class distributions with precision threshold tuning.',
              githubProof: 'Jupyter notebook with EDA charts, validation curves, and confusion matrix.',
              interviewQuestion: 'How do you prevent overfitting in tree-based gradient boosted models?',
              interviewAnswer: 'By constraining tree depth, tuning learning rates (shrinkage), applying L1/L2 regularization, and using early stopping.'
            }
          ]
        },
        {
          id: 'ai-phase-2',
          name: 'PHASE 2 · Deep Learning & LLM Systems',
          duration: `Weeks ${Math.ceil(35 / hoursPerWeek) + 1} - ${Math.ceil(95 / hoursPerWeek)}`,
          description: 'Neural network architectures, PyTorch tensors, transformer attention, and vector embeddings.',
          nodes: [
            {
              id: 'ai-pytorch-transformers',
              title: 'PyTorch & Transformer Architectures',
              type: 'skill',
              status: 'recommended',
              difficulty: 'Intermediate',
              estimatedHours: 35,
              description: 'Multi-head self-attention, positional encodings, loss functions, GPU memory optimization, and PyTorch autograd.',
              whyItMatters: 'Transformers are the backbone of modern LLMs, multimodal models, and autonomous agents.',
              whatToLearn: ['Scaled dot-product attention', 'PyTorch nn.Module & DataLoader', 'Mixed precision training (FP16/BF16)', 'HuggingFace Transformers API'],
              mission: 'Implement a miniature transformer encoder from scratch in PyTorch classifying financial transaction sentiment.',
              githubProof: 'PyTorch codebase with automated loss training curves and weights checkpointing.',
              interviewQuestion: 'Explain the computational complexity of self-attention with respect to sequence length N.',
              interviewAnswer: 'Standard attention computes pairwise similarity between all tokens, resulting in O(N^2) quadratic time and memory complexity.'
            },
            {
              id: 'ai-rag-vector-db',
              title: 'RAG & Vector Databases (Milvus/Pinecone)',
              type: 'skill',
              status: 'recommended',
              difficulty: 'Intermediate',
              estimatedHours: 25,
              description: 'Chunking strategies, dense embeddings, hybrid keyword+semantic search, re-ranking, and context window assembly.',
              whyItMatters: 'Enterprise AI apps require grounding LLMs on proprietary databases without hallucinations.',
              whatToLearn: ['Hierarchical chunking', 'Cosine vs Dot product similarity', 'HNSW indexing mechanics', 'Cohere/BGE cross-encoder re-ranking'],
              mission: 'Build an enterprise financial compliance retrieval engine searching 10,000 regulatory documents in sub-100ms.',
              githubProof: 'Deployed FastAPI microservice querying local ChromaDB/Pinecone with evaluation metrics.',
              interviewQuestion: 'What are the main causes of hallucination in Retrieval-Augmented Generation systems and how do you mitigate them?',
              interviewAnswer: 'Poor chunk boundaries, retrieval of irrelevant context, or conflicting prompt instructions; solved using re-ranking and citation enforcement.'
            }
          ]
        },
        {
          id: 'ai-phase-3',
          name: 'PHASE 3 · Flagship Real-World Project',
          duration: `Weeks ${Math.ceil(95 / hoursPerWeek) + 1} - ${Math.ceil(160 / hoursPerWeek)}`,
          description: 'Deploy an autonomous multi-agent financial intelligence and anomaly detection engine.',
          nodes: [
            {
              id: 'ai-capstone-project',
              title: 'FinSentinel: Real-Time Fraud & Anomaly Engine',
              type: 'project',
              status: 'locked',
              difficulty: 'Advanced',
              estimatedHours: 45,
              description: 'Production AI pipeline streaming live financial transaction logs, computing real-time graph embeddings, and detecting fraudulent spikes.',
              whyItMatters: 'Proves to top-tier fintech teams that you can deploy high-throughput, low-latency AI inference systems.',
              whatToLearn: ['Async streaming inference', 'Kafka/Redis queue ingestion', 'Model monitoring & drift detection', 'FastAPI with Docker deployment'],
              mission: 'Deploy FinSentinel: Process simulated 5,000 transactions/sec, flag anomalous clusters, and serve interactive visual triage alerts.',
              githubProof: 'Dockerized microservices repo with Prometheus metrics, test suite, and architecture diagram.',
              interviewQuestion: 'How would you architect model inference to ensure sub-20ms latency under high concurrent traffic?',
              interviewAnswer: 'Batch inference dynamically, quantize models to INT8/FP8 using TensorRT-LLM or ONNX Runtime, and cache identical queries.'
            }
          ]
        },
        {
          id: 'ai-phase-4',
          name: 'PHASE 4 · Portfolio & Production Visibility',
          duration: `Weeks ${Math.ceil(160 / hoursPerWeek) + 1} - ${Math.ceil(195 / hoursPerWeek)}`,
          description: 'Curate your machine learning portfolio, write technical architecture teardowns, and optimize presence.',
          nodes: [
            {
              id: 'ai-portfolio-showcase',
              title: 'ML Engineering Portfolio & Open-Source PRs',
              type: 'portfolio',
              status: 'locked',
              difficulty: 'Intermediate',
              estimatedHours: 15,
              description: 'Showcasing your custom transformer models, benchmark datasets, and contributing to open-source ML libraries.',
              whyItMatters: 'Demonstrable code on HuggingFace and GitHub establishes undeniable technical credibility.',
              whatToLearn: ['HuggingFace Model Hub cards', 'Benchmarking scripts (Latency vs Accuracy)', 'Open-source issue triage', 'Case study write-ups'],
              mission: 'Publish a technical breakdown: "Evaluating Embedding Drift in Financial Transaction Streams" with live interactive demo.',
              githubProof: 'Pinned showcase repositories with verified reproducible environment containers.',
              interviewQuestion: 'How do you measure whether a fine-tuned model is truly improving over a base model with good prompting?',
              interviewAnswer: 'Using a curated gold evaluation test split, automated LLM-as-judge scoring, and task-specific metrics like Exact Match or ROUGE.'
            }
          ]
        },
        {
          id: 'ai-phase-5',
          name: 'PHASE 5 · Technical Interview Mastery & Offer',
          duration: `Weeks ${Math.ceil(195 / hoursPerWeek) + 1} - ${Math.ceil(260 / hoursPerWeek)}`,
          description: 'Ace live machine learning coding rounds, system design for ML, and secure your offer.',
          nodes: [
            {
              id: 'ai-interview-prep',
              title: 'ML System Design & Coding Mastery',
              type: 'interview',
              status: 'locked',
              difficulty: 'Advanced',
              estimatedHours: 25,
              description: 'Designing large-scale recommendation systems, vector search scaling, loss function derivations, and live coding.',
              whyItMatters: 'ML system design rounds distinguish junior scripters from high-compensation ML engineers.',
              whatToLearn: ['Designing recommendation feeds', 'Vector database sharding', 'Offline training vs Online inference', 'STAR behavioral responses'],
              mission: 'Complete 3 mock ML system design sessions (e.g. Design YouTube Recommender, Design FinTech Fraud Detector).',
              githubProof: 'Curated repository of system design diagrams and solved ML algorithmic challenges.',
              interviewQuestion: 'Design an end-to-end vector search architecture that supports 100 million embeddings with sub-50ms query time.',
              interviewAnswer: 'Use approximate nearest neighbors (HNSW or ScaNN), shard embeddings by semantic clusters across distributed worker nodes, and cache hot embeddings in RAM.'
            },
            {
              id: 'ai-target-offer',
              title: `Offer Received: ${dreamJob}`,
              type: 'milestone',
              status: 'locked',
              difficulty: 'Expert',
              estimatedHours: 5,
              description: `Signed employment contract at an elite fintech firm or AI lab.`,
              whyItMatters: 'Your dream career as an AI Engineer, reverse-engineered and conquered.',
              whatToLearn: ['Offer evaluation & equity negotiation', 'First 90 days impact strategy', 'Continuous research tracking'],
              mission: 'Sign your offer and deploy models shaping the future of finance!',
              githubProof: 'Your verified skill tree and completed journey.',
              interviewQuestion: 'How will you stay updated with rapid model release cycles without losing engineering velocity?',
              interviewAnswer: 'Focus on enduring fundamentals (data quality, clean evaluation, low-latency infrastructure) rather than chasing every ephemeral model release.'
            }
          ]
        }
      ]
    };
  }

  // 3. Game Developer (Unity / Unreal / Physics)
  if (dreamLower.includes('game') || industryLower.includes('game') || industryLower.includes('gaming')) {
    return {
      career: dreamJob,
      industry: 'Gaming & Interactive',
      level: input.level || 'College Student',
      timeline: input.timeline || '6 months',
      hoursPerWeek,
      targetCompany: input.targetCompany || 'Game Studio',
      totalEstimatedHours: 250,
      estimatedWeeks: Math.ceil(250 / hoursPerWeek),
      generatedAt: new Date().toISOString(),
      phases: [
        {
          id: 'game-phase-1',
          name: 'PHASE 1 · Foundations: C++ & Mathematics for Games',
          duration: `Weeks 1 - ${Math.max(3, Math.ceil(35 / hoursPerWeek))}`,
          description: 'Memory management, pointers, vectors, quaternions, and linear algebra transformations.',
          nodes: [
            {
              id: 'game-cpp-math',
              title: 'C++ Systems & 3D Math Fundamentals',
              type: 'skill',
              status: known.has('c++') || known.has('c') ? 'completed' : 'active',
              difficulty: 'Beginner',
              estimatedHours: 20,
              description: 'Pointers, RAII, vector math, dot/cross products, coordinate spaces, and quaternions for rotation.',
              whyItMatters: 'Every game engine relies on low-level memory performance and linear algebra to render frames at 60+ FPS.',
              whatToLearn: ['RAII & Smart Pointers', 'Vector dot & cross products', 'Euler angles vs Quaternions', 'Spatial transformation matrices'],
              mission: 'Build a 3D software camera controller in C++ with quaternion rotations and collision raycasting.',
              githubProof: 'Repository with clean C++ classes and unit-tested mathematical transformation library.',
              interviewQuestion: 'What is gimbal lock and why do 3D game engines use quaternions instead of Euler angles?',
              interviewAnswer: 'Gimbal lock is the loss of one degree of freedom when two axes align; quaternions represent 3D orientation smoothly without singularities.'
            },
            {
              id: 'game-git-architecture',
              title: 'Game Loops & State Machines',
              type: 'skill',
              status: 'active',
              difficulty: 'Intermediate',
              estimatedHours: 15,
              description: 'Fixed update timesteps, component patterns, input buffering, and hierarchical state machines.',
              whyItMatters: 'Tight, responsive player controls separate engaging games from sluggish prototypes.',
              whatToLearn: ['Fixed vs Variable timesteps', 'Finite State Machines for character controllers', 'Entity-Component-System (ECS) basics', 'Input buffering'],
              mission: 'Build a modular character state machine supporting wall-slides, coyote time, and buffered jump inputs.',
              githubProof: 'Working interactive demo executable with responsive player controller.',
              interviewQuestion: 'Why should physics simulation updates be executed in a fixed timestep rather than variable frame delta time?',
              interviewAnswer: 'Variable delta times cause non-deterministic physics calculations, leading to clipping through geometry and inconsistent velocities across different hardware frame rates.'
            }
          ]
        },
        {
          id: 'game-phase-2',
          name: 'PHASE 2 · Engine Mastery & Shaders',
          duration: `Weeks ${Math.ceil(35 / hoursPerWeek) + 1} - ${Math.ceil(95 / hoursPerWeek)}`,
          description: 'Unity/Unreal workflows, physics engines, lighting pipelines, and HLSL shader programming.',
          nodes: [
            {
              id: 'game-engine-systems',
              title: 'Engine Architecture & HLSL Shaders',
              type: 'skill',
              status: 'recommended',
              difficulty: 'Intermediate',
              estimatedHours: 35,
              description: 'Render pipelines (URP/Lumen), vertex and fragment shaders, post-processing, and profiling draw calls.',
              whyItMatters: 'Studios value gameplay programmers who understand how the GPU rasterizes scenes and how to eliminate draw-call bottlenecks.',
              whatToLearn: ['Vertex & fragment shaders in HLSL', 'Occlusion culling & LODs', 'Material graphs and PBR textures', 'Profiling with RenderDoc'],
              mission: 'Write a custom interactive water shader featuring caustic reflections and vertex wave displacement.',
              githubProof: 'Shader code repository with interactive WebGL preview and 60 FPS performance benchmark.',
              interviewQuestion: 'What causes draw call bottlenecks on the GPU and how do you batch them?',
              interviewAnswer: 'Draw calls require CPU-to-GPU state changes; mitigated using static batching, GPU instancing, and texture atlasing.'
            }
          ]
        },
        {
          id: 'game-phase-3',
          name: 'PHASE 3 · Flagship Game Capstone',
          duration: `Weeks ${Math.ceil(95 / hoursPerWeek) + 1} - ${Math.ceil(160 / hoursPerWeek)}`,
          description: 'Engineer and publish a complete, polished 3D playable game prototype on itch.io.',
          nodes: [
            {
              id: 'game-capstone-project',
              title: 'ChronoShift: 3D Physics Roguelike Prototype',
              type: 'project',
              status: 'locked',
              difficulty: 'Advanced',
              estimatedHours: 45,
              description: 'A complete playable 3D action roguelike featuring procedural dungeon generation, enemy AI behavior trees, audio mixers, and save states.',
              whyItMatters: 'Game studio hiring managers only consider applicants who have shipped polished, complete gameplay loops.',
              whatToLearn: ['Behavior trees for enemy AI', 'Procedural level generation (BSP trees)', 'Audio spatialization and dynamic mixers', 'Profiling CPU/GPU frame times'],
              mission: 'Publish ChronoShift on itch.io: 15 minutes of polished gameplay, zero game-breaking bugs, and gamepad support.',
              githubProof: 'Public GitHub repo, itch.io playable link, and 60-second trailer walkthrough.',
              interviewQuestion: 'How would you architect enemy AI pathfinding when dozens of agents navigate dynamic destructible terrain?',
              interviewAnswer: 'Use hierarchical A* pathfinding on a dynamic navmesh, or flow-field algorithms where agents share a single distance potential map.'
            }
          ]
        },
        {
          id: 'game-phase-4',
          name: 'PHASE 4 · Portfolio & Studio Showcase',
          duration: `Weeks ${Math.ceil(160 / hoursPerWeek) + 1} - ${Math.ceil(195 / hoursPerWeek)}`,
          description: 'Curate your gameplay demo reel, highlight mechanics, and prepare for studio engineering screens.',
          nodes: [
            {
              id: 'game-portfolio-reel',
              title: 'Technical Gameplay Reel & Case Studies',
              type: 'portfolio',
              status: 'locked',
              difficulty: 'Intermediate',
              estimatedHours: 15,
              description: '2-minute video demo reel showcasing your custom shaders, player controllers, and architecture diagrams.',
              whyItMatters: 'Studio technical directors watch demo reels before reading resumes. Crisp mechanics capture immediate attention.',
              whatToLearn: ['Creating a high-impact demo reel', 'Annotating gameplay code breakdowns', 'Showcasing debug views and FPS metrics'],
              mission: 'Produce a 90-second Technical Gameplay Reel with split-screen debug views demonstrating code logic.',
              githubProof: 'Personal portfolio website hosting playable WebGL builds and video reels.',
              interviewQuestion: 'How do you optimize garbage collection spikes in managed game engine runtimes?',
              interviewAnswer: 'Implement object pooling for projectiles/particles, avoid LINQ and foreach allocations in hot loops, and pre-allocate collections.'
            }
          ]
        },
        {
          id: 'game-phase-5',
          name: 'PHASE 5 · Studio Interview Mastery & Offer',
          duration: `Weeks ${Math.ceil(195 / hoursPerWeek) + 1} - ${Math.ceil(250 / hoursPerWeek)}`,
          description: 'Live C++ coding, gameplay problem solving, behavioral interview rounds, and securing an offer.',
          nodes: [
            {
              id: 'game-interview-prep',
              title: 'C++ Systems & Gameplay Interview Prep',
              type: 'interview',
              status: 'locked',
              difficulty: 'Advanced',
              estimatedHours: 20,
              description: 'Live coding challenges in memory allocation, spatial partitioning (quadtrees/octrees), and gameplay logic.',
              whyItMatters: 'Passes studio technical whiteboard exams and lands your first game programming role.',
              whatToLearn: ['Spatial data structures (BVH/Quadtrees)', 'Cache-friendly data layouts', 'Multi-threading basics for game engines'],
              mission: 'Complete 3 simulated studio programming assessments and implement an octree spatial partitioner under timed conditions.',
              githubProof: 'Clean C++ repository with spatial data structures and benchmark tests.',
              interviewQuestion: 'Explain how Data-Oriented Design (DOD) improves cache locality compared to traditional deep Object-Oriented inheritance.',
              interviewAnswer: 'DOD stores arrays of components contiguously (SoA vs AoS), meaning CPU cache lines load only relevant transform or velocity data without cache misses.'
            },
            {
              id: 'game-target-offer',
              title: `Offer Received: ${dreamJob}`,
              type: 'milestone',
              status: 'locked',
              difficulty: 'Expert',
              estimatedHours: 5,
              description: `Hired at a respected game studio as a Gameplay Programmer.`,
              whyItMatters: 'Your passion for interactive worlds, realized through structured engineering mastery.',
              whatToLearn: ['Studio pipeline onboarding', 'Collaborating with artists and level designers', 'Sprint velocity in game production'],
              mission: 'Sign your contract and launch your career crafting games players love!',
              githubProof: 'Your verified skill roadmap and portfolio complete.',
              interviewQuestion: 'How do you navigate disagreements between creative design intent and technical engine constraints?',
              interviewAnswer: 'Build rapid interactive prototypes to test feel, offer pragmatic technical compromises, and focus on delivering the core emotional player experience.'
            }
          ]
        }
      ]
    };
  }

  // 4. Cybersecurity Analyst / Engineer
  if (dreamLower.includes('cyber') || dreamLower.includes('security') || industryLower.includes('cybersecurity')) {
    return {
      career: dreamJob,
      industry: 'Cybersecurity',
      level: input.level || 'College Student',
      timeline: input.timeline || '6 months',
      hoursPerWeek,
      targetCompany: input.targetCompany || 'Enterprise / MNC',
      totalEstimatedHours: 240,
      estimatedWeeks: Math.ceil(240 / hoursPerWeek),
      generatedAt: new Date().toISOString(),
      phases: [
        {
          id: 'sec-phase-1',
          name: 'PHASE 1 · Foundations: Linux & Network Architecture',
          duration: `Weeks 1 - ${Math.max(3, Math.ceil(35 / hoursPerWeek))}`,
          description: 'TCP/IP protocol stack, packet inspection with Wireshark, Linux permissions, and bash scripting.',
          nodes: [
            {
              id: 'sec-network-foundations',
              title: 'TCP/IP Protocols & Packet Analysis',
              type: 'skill',
              status: known.has('git') ? 'completed' : 'active',
              difficulty: 'Beginner',
              estimatedHours: 20,
              description: 'OSI 7-layer model, TCP 3-way handshakes, DNS, ARP poisoning, and Wireshark PCAP analysis.',
              whyItMatters: 'All cyber threats traverse networks; packet inspection is the fundamental skill of defense analysts.',
              whatToLearn: ['TCP/UDP headers & flags', 'Wireshark filters & PCAP carving', 'DNS tunneling detection', 'Subnetting & routing tables'],
              mission: 'Analyze a captured PCAP file, reconstruct an unencrypted credentials leak, and draft an incident triage summary.',
              githubProof: 'Documented triage lab write-up with packet screenshots and IOC hashes.',
              interviewQuestion: 'What are the indicators of a SYN Flood DDoS attack when inspecting network packet captures?',
              interviewAnswer: 'A high volume of TCP SYN packets with randomized spoofed source IPs that never complete the 3-way handshake with an ACK.'
            },
            {
              id: 'sec-linux-security',
              title: 'Linux Systems & Bash Forensics',
              type: 'skill',
              status: 'active',
              difficulty: 'Beginner',
              estimatedHours: 15,
              description: 'Linux file permissions (SUID/SGID), process monitoring (ps/top/lsof), cron job auditing, and shell scripting.',
              whyItMatters: 'Over 90% of cloud servers run Linux; forensic analysts must detect persistence mechanisms quickly.',
              whatToLearn: ['Linux log analysis (/var/log/auth.log)', 'Auditd configurations', 'Detecting SUID privilege escalations', 'Automated Bash triage scripts'],
              mission: 'Write a Bash automated triage script that inspects listening ports, checks unauthorized sudo users, and flags world-writable files.',
              githubProof: 'Clean, open-source Bash security audit utility on GitHub.',
              interviewQuestion: 'How does an attacker establish persistence on a compromised Linux host?',
              interviewAnswer: 'Via crontab entries, systemd service backdoors, modifying .bashrc profiles, or installing unauthorized SSH public keys.'
            }
          ]
        },
        {
          id: 'sec-phase-2',
          name: 'PHASE 2 · Threat Detection & SIEM Engineering',
          duration: `Weeks ${Math.ceil(35 / hoursPerWeek) + 1} - ${Math.ceil(95 / hoursPerWeek)}`,
          description: 'Splunk/Wazuh SIEM log ingestion, MITRE ATT&CK mapping, Sigma detection rules, and cryptography.',
          nodes: [
            {
              id: 'sec-siem-detection',
              title: 'SIEM Log Ingestion & Sigma Rules',
              type: 'skill',
              status: 'recommended',
              difficulty: 'Intermediate',
              estimatedHours: 35,
              description: 'Configuring Wazuh/Splunk agents, parsing Windows Event Logs (Sysmon), and authoring detection rules.',
              whyItMatters: 'Security operations centers (SOC) live inside SIEM platforms. Writing custom detection rules is core engineering work.',
              whatToLearn: ['Sysmon Event IDs (1, 3, 10, 11)', 'Writing Sigma detection rules', 'MITRE ATT&CK framework mapping', 'KQL and SPL query syntax'],
              mission: 'Set up a local Wazuh SIEM lab ingesting telemetry and author a Sigma rule detecting Mimikatz LSASS credential dumping.',
              githubProof: 'Documented lab environment setup and verified Sigma detection rules.',
              interviewQuestion: 'What Windows Event ID represents process creation in Sysmon and why is it crucial for SOC analysis?',
              interviewAnswer: 'Sysmon Event ID 1 captures detailed process creation including parent process ID, image path, command-line arguments, and hashes.'
            }
          ]
        },
        {
          id: 'sec-phase-3',
          name: 'PHASE 3 · Flagship Security Lab Capstone',
          duration: `Weeks ${Math.ceil(95 / hoursPerWeek) + 1} - ${Math.ceil(160 / hoursPerWeek)}`,
          description: 'Engineer and deploy an enterprise-grade threat simulation and automated defense lab.',
          nodes: [
            {
              id: 'sec-capstone-project',
              title: 'SentinelNet: Zero-Trust Telemetry & Defense Lab',
              type: 'project',
              status: 'locked',
              difficulty: 'Advanced',
              estimatedHours: 45,
              description: 'A fully virtualized active threat detection lab running Kali attack emulations against hardened Windows/Linux endpoints with automated alerts.',
              whyItMatters: 'Demonstrates to security managers that you understand real-world adversary behavior and defensive engineering.',
              whatToLearn: ['Atomic Red Team adversary simulation', 'Suricata IDS network rule tuning', 'Automated SOAR playbook responses', 'Threat hunting methodologies'],
              mission: 'Deploy SentinelNet in virtualized containers: Execute 5 Atomic Red Team attacks and demonstrate automated alert triggers.',
              githubProof: 'Comprehensive GitHub documentation with network topology diagram, configuration files, and incident report.',
              interviewQuestion: 'Walk me through how you would investigate an alert indicating potential ransomware execution on an endpoint.',
              interviewAnswer: 'Isolate the host immediately from the network, capture volatile memory, examine Sysmon Event 11 for file modifications, identify the parent process, and review perimeter logs.'
            }
          ]
        },
        {
          id: 'sec-phase-4',
          name: 'PHASE 4 · Portfolio & Industry Visibility',
          duration: `Weeks ${Math.ceil(160 / hoursPerWeek) + 1} - ${Math.ceil(195 / hoursPerWeek)}`,
          description: 'Publish technical threat write-ups, earn foundational certifications, and network with security professionals.',
          nodes: [
            {
              id: 'sec-portfolio-proof',
              title: 'Threat Intel Blog & Blue Team Portfolio',
              type: 'portfolio',
              status: 'locked',
              difficulty: 'Intermediate',
              estimatedHours: 15,
              description: 'Publishing incident teardowns, TryHackMe/HackTheBox write-ups, and open-source detection scripts.',
              whyItMatters: 'Security hiring leads look for clear technical writing and evidence of hands-on lab rigor.',
              whatToLearn: ['Technical vulnerability disclosure write-ups', 'Documenting IoCs (Indicators of Compromise)', 'Threat modeling (STRIDE)'],
              mission: 'Publish a forensic deep dive: "Anatomy of an Attack: Detecting Living-off-the-Land Binaries (LOLBins)".',
              githubProof: 'Clean GitHub portfolio with published security articles and verified room badges.',
              interviewQuestion: 'Explain the difference between a vulnerability assessment and a penetration test.',
              interviewAnswer: 'A vulnerability assessment identifies and catalogs known flaws, whereas a penetration test actively exploits them to test real-world defensive resilience.'
            }
          ]
        },
        {
          id: 'sec-phase-5',
          name: 'PHASE 5 · Security Screening Mastery & Offer',
          duration: `Weeks ${Math.ceil(195 / hoursPerWeek) + 1} - ${Math.ceil(240 / hoursPerWeek)}`,
          description: 'Master technical incident response screening scenarios, behavioral rounds, and land your SOC / Security Analyst role.',
          nodes: [
            {
              id: 'sec-interview-prep',
              title: 'SOC & Incident Response Interview Mastery',
              type: 'interview',
              status: 'locked',
              difficulty: 'Advanced',
              estimatedHours: 20,
              description: 'Simulated triage scenarios, port identification, cryptographic algorithms (AES vs RSA), and incident lifecycle.',
              whyItMatters: 'Confidence during rapid-fire triage scenarios secures written offers with high compensation.',
              whatToLearn: ['NIST Incident Response Lifecycle (PICERL)', 'Phishing email header triage', 'Cross-Site Scripting (XSS) and SQL Injection defense'],
              mission: 'Complete 3 mock incident triage interviews with peer security analysts scoring above 90% on methodology.',
              githubProof: 'Curated repository of flashcards, triage decision trees, and sample incident reports.',
              interviewQuestion: 'What are the 6 phases of the NIST Incident Response Framework?',
              interviewAnswer: 'Preparation, Detection & Analysis, Containment, Eradication, Recovery, and Post-Incident Activity (Lessons Learned).'
            },
            {
              id: 'sec-target-offer',
              title: `Offer Received: ${dreamJob}`,
              type: 'milestone',
              status: 'locked',
              difficulty: 'Expert',
              estimatedHours: 5,
              description: `Hired as a Cybersecurity Analyst protecting critical infrastructure and enterprise data.`,
              whyItMatters: 'Your mission accomplished: entering the cyber defense vanguard.',
              whatToLearn: ['SOC shift handover protocols', 'Continuous threat landscape monitoring', 'Security clearance basics'],
              mission: 'Sign your offer and safeguard digital systems!',
              githubProof: 'Your verified skill tree and completed cybersecurity journey.',
              interviewQuestion: 'How do you prioritize multiple critical security alerts occurring simultaneously across different servers?',
              interviewAnswer: 'Triage by asset criticality (e.g. domain controller vs workstation), potential business impact, and evidence of active lateral movement.'
            }
          ]
        }
      ]
    };
  }

  // 5. Default General Software / Cloud Path
  return {
    career: dreamJob,
    industry: input.industry || 'Technology',
    level: input.level || 'College Student',
    timeline: input.timeline || '6 months',
    hoursPerWeek,
    targetCompany: input.targetCompany || 'Startup',
    totalEstimatedHours: 230,
    estimatedWeeks: Math.ceil(230 / hoursPerWeek),
    generatedAt: new Date().toISOString(),
    phases: [
      {
        id: 'gen-phase-1',
        name: 'PHASE 1 · Foundations & Tooling',
        duration: `Weeks 1 - ${Math.max(3, Math.ceil(35 / hoursPerWeek))}`,
        description: 'Core logic, data structures, Git workflows, and developer tooling.',
        nodes: [
          {
            id: 'gen-foundations',
            title: 'Modern Programming & Algorithmic Logic',
            type: 'skill',
            status: known.size > 0 ? 'completed' : 'active',
            difficulty: 'Beginner',
            estimatedHours: 20,
            description: 'Algorithmic reasoning, control flow, functions, collections, and clean code principles.',
            whyItMatters: 'Foundational syntax fluency prevents basic roadblocks when building advanced systems.',
            whatToLearn: ['Data structures', 'Complexity analysis (Big-O)', 'Clean code conventions', 'Unit testing'],
            mission: `Build a clean CLI tool that analyzes and sorts data metrics for ${input.industry || 'software'}.`,
            githubProof: 'Clean repo with modular functions, tests, and documentation.',
            interviewQuestion: 'Explain the difference between synchronous execution and asynchronous event handling.',
            interviewAnswer: 'Synchronous execution blocks until each operation finishes, while asynchronous event handling allows tasks to run in the background.'
          },
          {
            id: 'gen-git-flow',
            title: 'Git Version Control & Branch Hygiene',
            type: 'skill',
            status: known.has('git') ? 'completed' : 'active',
            difficulty: 'Beginner',
            estimatedHours: 10,
            description: 'Feature branching, pull requests, resolving merge conflicts, and code reviews.',
            whyItMatters: 'Professional teams evaluate candidates on their ability to collaborate without breaking main branches.',
            whatToLearn: ['Branch naming conventions', 'Rebase vs Merge', 'Conventional commit messages', 'PR reviews'],
            mission: 'Initialize an open GitHub repo with branch protections and a pull request template.',
            githubProof: 'Repository with branch commit history and merged PRs.',
            interviewQuestion: 'What is the functional difference between git merge and git rebase?',
            interviewAnswer: 'Merge preserves exact history with a dedicated merge commit, while rebase rewrites project history by creating brand new commits.'
          }
        ]
      },
      {
        id: 'gen-phase-2',
        name: 'PHASE 2 · Domain Specialization & Systems',
        duration: `Weeks ${Math.ceil(35 / hoursPerWeek) + 1} - ${Math.ceil(95 / hoursPerWeek)}`,
        description: `Core stack and architectures for ${dreamJob}.`,
        nodes: [
          {
            id: 'gen-core-specialization',
            title: `${dreamJob.split(' ')[0]} Core Architecture`,
            type: 'skill',
            status: 'recommended',
            difficulty: 'Intermediate',
            estimatedHours: 35,
            description: `Core architecture, modern framework design, and industry standard tooling for ${dreamJob}.`,
            whyItMatters: 'The central building block employers test during technical screening assessments.',
            whatToLearn: ['Component & service boundaries', 'Data flow and state', 'Network caching & latency optimization', 'Error handling patterns'],
            mission: `Build an interactive application tailored for ${input.industry || 'enterprise'} domain metrics.`,
            githubProof: 'Deployed application URL with responsive styling and zero console warnings.',
            interviewQuestion: 'How do you handle asynchronous state synchronization in a high-concurrency client/server setup?',
            interviewAnswer: 'Using optimistic UI updates, robust query caching with invalidation keys, and idempotent server mutations.'
          }
        ]
      },
      {
        id: 'gen-phase-3',
        name: 'PHASE 3 · Flagship Capstone Project',
        duration: `Weeks ${Math.ceil(95 / hoursPerWeek) + 1} - ${Math.ceil(160 / hoursPerWeek)}`,
        description: `Ship a production-grade application for ${input.industry || 'the industry'}.`,
        nodes: [
          {
            id: 'gen-capstone',
            title: `${dreamJob} Production Capstone`,
            type: 'project',
            status: 'locked',
            difficulty: 'Advanced',
            estimatedHours: 40,
            description: `A full-stack, production-grade application engineered for ${dreamJob} portfolio standards.`,
            whyItMatters: 'Proves to hiring managers that you can take an idea from blank canvas to production deployment.',
            whatToLearn: ['Production architecture', 'Cloud deployment & CI/CD', 'Real-time telemetry/visualization', 'Automated testing'],
            mission: `Deploy a production-ready application solving a key challenge in ${input.industry || 'software'} with live users.`,
            githubProof: 'Public repo with architecture diagrams, 85%+ test coverage, and live deployed demo.',
            interviewQuestion: 'What was the hardest architectural decision you made on this project and what was the trade-off?',
            interviewAnswer: 'Discuss schema normalization vs query speed, or choosing between client-side versus server-side rendering for optimal UX.'
          }
        ]
      },
      {
        id: 'gen-phase-4',
        name: 'PHASE 4 · Portfolio & Visibility',
        duration: `Weeks ${Math.ceil(160 / hoursPerWeek) + 1} - ${Math.ceil(195 / hoursPerWeek)}`,
        description: 'Package your engineering outputs into recruiter-ready proof of competence.',
        nodes: [
          {
            id: 'gen-portfolio',
            title: 'Technical Portfolio Showcase',
            type: 'portfolio',
            status: 'locked',
            difficulty: 'Intermediate',
            estimatedHours: 15,
            description: 'Live interactive demos, technical case studies, and polished developer portfolio.',
            whyItMatters: 'Engineers are judged on verifiable code artifacts and clear technical communication.',
            whatToLearn: ['Technical case studies', 'Mermaid architecture diagrams', 'SEO & social preview cards', 'Interactive project previews'],
            mission: 'Launch personal portfolio showcasing your flagship capstone and technical blog breakdown.',
            githubProof: 'Clean portfolio website with 100% Lighthouse audit.',
            interviewQuestion: 'How do you prioritize features when balancing engineering perfection against delivery deadlines?',
            interviewAnswer: 'Identify core customer value paths, ship minimal reliable implementations with automated tests, and iterate based on metrics.'
          }
        ]
      },
      {
        id: 'gen-phase-5',
        name: 'PHASE 5 · Interview Mastery & Offer',
        duration: `Weeks ${Math.ceil(195 / hoursPerWeek) + 1} - ${Math.ceil(230 / hoursPerWeek)}`,
        description: 'Ace technical screenings and land your employment offer.',
        nodes: [
          {
            id: 'gen-interview',
            title: 'System Design & Algorithmic Rounds',
            type: 'interview',
            status: 'locked',
            difficulty: 'Advanced',
            estimatedHours: 25,
            description: 'Live coding rounds, system scalability concepts, and STAR behavioral answers.',
            whyItMatters: 'Converts recruiter excitement into signed written employment offers.',
            whatToLearn: ['Scalability & caching', 'Data structures problem patterns', 'STAR storytelling', 'Negotiation basics'],
            mission: 'Complete 3 simulated technical interviews and score above 85% in technical communication.',
            githubProof: 'Repository of solved algorithmic problems and architectural notes.',
            interviewQuestion: 'How would you scale an API service facing sudden 10x traffic spikes?',
            interviewAnswer: 'Scale horizontally behind a load balancer, offload expensive background tasks to message queues, and cache hot read queries in Redis.'
          },
          {
            id: 'gen-target-offer',
            title: `${dreamJob} — Hired`,
            type: 'milestone',
            status: 'locked',
            difficulty: 'Expert',
            estimatedHours: 5,
            description: `Signed offer at a high-caliber company in ${input.industry || 'the tech industry'}.`,
            whyItMatters: 'Your career quest achieved through reverse engineering and deliberate practice.',
            whatToLearn: ['First 90-day onboarding strategy', 'Setting engineering performance goals', 'Mentorship and continuous growth'],
            mission: 'Sign your offer and launch your career journey!',
            githubProof: 'Your verified skill roadmap completed.',
            interviewQuestion: 'Where do you see yourself contributing most in your first 6 months?',
            interviewAnswer: 'By absorbing the codebase quickly, eliminating developer frictions, and shipping high-reliability features.'
          }
        ]
      }
    ]
  };
}

export interface DailyInsightRequest {
  mood: string;
  moodLabel: string;
  goal: string;
  career?: string;
  industry?: string;
  level?: string;
  currentSkill?: string;
}

export interface DailyInsightResponse {
  insight: string;
  actionItem: string;
  recommendedResource: string;
  suggestedGoals?: string[];
  bonusXp?: number;
}

export async function fetchDailyCheckInInsight(
  payload: DailyInsightRequest
): Promise<DailyInsightResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch('/api/daily-checkin/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && (data.insight || data.actionItem)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Daily check-in API fetch timed out or network error, using local generator', err);
  }

  // Graceful fallback
  const isCurious = payload.moodLabel?.toLowerCase().includes('curious');
  const isEnergized = payload.moodLabel?.toLowerCase().includes('energized');
  const isSteady = payload.moodLabel?.toLowerCase().includes('steady');

  return {
    insight: isCurious
      ? `Curiosity is the mark of great engineers. Dig into the 'why' behind today's architecture choices.`
      : isEnergized
      ? `High momentum day! Channel your energy into tackling the most challenging technical concept first.`
      : isSteady
      ? `Consistent daily practice builds compound mastery. Keep this steady cadence going!`
      : `Pacing yourself prevents burnout. Focus on delivering one clean, functional milestone today.`,
    actionItem: `Carve out 20 focused minutes to commit code and verify tests for "${payload.goal}".`,
    recommendedResource: 'Review the official API docs and maintain single-responsibility modules.',
    suggestedGoals: [
      `Master the core mechanics of ${payload.currentSkill || 'your active skill'}`,
      'Push 1 clean commit with unit tests to GitHub',
      'Explain 1 system architectural trade-off out loud',
      'Log 45 minutes of deep focus learning'
    ],
    bonusXp: 15
  };
}

export async function fetchDailyGoalIdeas(payload: {
  mood: string;
  career?: string;
  industry?: string;
}): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('/api/daily-checkin/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.goals) && data.goals.length > 0) {
        return data.goals;
      }
    }
  } catch (err) {
    console.warn('Daily goal ideas fetch error, using local fallback', err);
  }

  return [
    `Build 1 standalone micro-component for ${payload.career || 'your portfolio'}`,
    'Write comprehensive unit tests for core business logic',
    'Benchmark API latency or review memory constraints',
    'Draft a 1-page architecture design doc for your weekend mission'
  ];
}

