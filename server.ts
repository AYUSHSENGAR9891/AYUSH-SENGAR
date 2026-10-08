import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// AI Studio Cloud Run setup: Nginx listens on 8080 and reverse-proxies to localhost:3000.
// If PORT is 8080 (Cloud Run external port), the Node server MUST listen on port 3000.
const port = process.env.APP_PORT || (process.env.PORT && process.env.PORT !== '8080' ? process.env.PORT : 3000);

app.use(express.json());

// Initialize Gemini client helper according to @google/genai guidelines
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with provided key, using fallback generator', err);
    return null;
  }
}

// Timeout utility that cleans up timer handle properly
async function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMessage)), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

// Safe JSON parser handling optional markdown fences and partial text
function safeParseJson(text: string): any {
  if (!text) return null;
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
    }
    throw e;
  }
}

// Fast multi-model Gemini caller with rapid fallback
async function callGemini(prompt: string, jsonMode = false, systemInstruction?: string): Promise<string | null> {
  const ai = getAiClient();
  if (!ai) return null;

  // Prefer fast gemini-3.1-flash-lite first, fallback to gemini-3.8-flash
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  for (const model of models) {
    try {
      const config: any = {};
      if (jsonMode) config.responseMimeType = 'application/json';
      if (systemInstruction) config.systemInstruction = systemInstruction;

      const call = ai.models.generateContent({
        model,
        contents: prompt,
        config
      });

      const response: any = await withTimeout(call, 12000, `Model ${model} timeout`);
      const text = response.text?.trim();
      if (text) return text;
    } catch (err: any) {
      console.warn(`Gemini call with ${model} failed: ${err?.message || err}`);
    }
  }
  return null;
}

// Fallback dynamic generator for when API key is missing or model fails
function generateFallbackRoadmap(input: any) {
  const { dreamJob = 'Full Stack Developer at a Climate Tech Startup', industry = 'Climate Tech', level = 'College Student', existingSkills = [], hoursPerWeek = 10, timeline = '6 months', targetCompany = 'Startup' } = input;

  const jobLower = (dreamJob || '').toLowerCase();
  const indLower = (industry || '').toLowerCase();
  const knownSet = new Set((existingSkills || []).map((s: string) => s.toLowerCase().trim()));
  const numHours = Number(hoursPerWeek) || 10;

  // Helper to mark status
  const getStatus = (skillName: string, defaultStatus: 'active' | 'recommended' | 'locked' = 'active') => {
    if (knownSet.has(skillName.toLowerCase())) return 'completed';
    return defaultStatus;
  };

  // 1. AI Engineer at a Fintech Company (Test 2)
  if (jobLower.includes('ai') || jobLower.includes('machine learning') || indLower.includes('fintech') || indLower.includes('finance')) {
    const totalHours = 260;
    const estWeeks = Math.ceil(totalHours / numHours);
    return {
      careerGoal: dreamJob,
      summary: `Tailored pathway targeting algorithmic risk systems, neural transformers, and low-latency fraud detection pipelines in ${industry}.`,
      whyThisRoadmap: `Because your goal is ${dreamJob} in ${industry}, this roadmap prioritizes mathematical foundations, deep learning transformers, and real-time inference systems.${knownSet.has('python') ? ' Your existing Python proficiency allows you to skip syntax basics and accelerate into PyTorch and Vector DBs.' : ''}`,
      estimatedDuration: timeline,
      totalEstimatedHours: totalHours,
      estimatedWeeks: estWeeks,
      alternativeRoutes: [
        {
          id: 'route-traditional',
          title: 'Route A: Math & Theory → Research Projects → Internship',
          description: 'Focus heavily on statistical proofs, loss functions, and research papers before building enterprise models.',
          estimatedDuration: `${Math.ceil(estWeeks * 1.1)} weeks`,
          focus: 'Research & Model Architecture',
          stages: ['Vector Calculus & Linear Algebra', 'PyTorch from Scratch', 'Transformer Attention Papers', 'MLOps & Deployment']
        },
        {
          id: 'route-applied',
          title: 'Route B: Applied LLM Systems → Vector Search → FinTech Startup',
          description: 'Fast-track engineering by building production RAG pipelines and anomaly detection agents.',
          estimatedDuration: `${estWeeks} weeks`,
          focus: 'Applied Systems & APIs',
          stages: ['FastAPI & Data Pipelines', 'LangChain & Vector DBs', 'Fraud Anomaly Telemetry', 'Production Capstone']
        },
        {
          id: 'route-certs',
          title: 'Route C: Cloud AI Certification → Flagship Capstone → Junior Engineer',
          description: 'Complement code portfolio with recognized cloud AI certifications (AWS ML Specialty or GCP Cloud ML).',
          estimatedDuration: `${Math.ceil(estWeeks * 0.95)} weeks`,
          focus: 'Enterprise Cloud Infrastructure',
          stages: ['Cloud ML Pipelines', 'Docker & Kubernetes for AI', 'FinTech Telemetry Project', 'Interview Prep']
        }
      ],
      projects: [
        {
          id: 'proj-fin-1',
          title: 'FinSentinel: Real-Time Fraud & Anomaly Engine',
          goal: 'Ingest 5,000 transactions/sec, compute graph embeddings, and detect fraudulent spikes.',
          difficulty: 'Advanced',
          estimatedHours: 45,
          skillsPracticed: ['PyTorch', 'Vector Search', 'FastAPI', 'Kafka Streaming'],
          expectedOutput: 'Production Dockerized microservice with sub-25ms inference latency.',
          githubProof: 'GitHub repository with benchmark test harness and architecture diagram.'
        }
      ],
      entryRoles: ['Associate AI Engineer', 'Quantitative ML Analyst', 'Data Science Developer'],
      certifications: ['AWS Certified Machine Learning - Specialty', 'Google Cloud Professional ML Engineer'],
      interviewTopics: ['Attention mechanisms', 'Quantization (INT8/FP8)', 'Loss functions & Backpropagation', 'Handling extreme data imbalance'],
      phases: [
        {
          id: 'phase-ai-1',
          name: 'PHASE 1 · Mathematical Foundations & Systems Python',
          duration: `Weeks 1 - ${Math.max(3, Math.ceil(35 / numHours))}`,
          description: 'Vector spaces, matrix operations, calculus gradients, and high-performance NumPy computation.',
          nodes: [
            {
              id: 'node-ai-python-math',
              title: 'Python for Systems & Linear Algebra',
              type: 'skill',
              status: knownSet.has('python') ? 'known' : 'active',
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
              id: 'node-ai-stats-risk',
              title: 'Statistical Modeling & Credit Risk Metrics',
              type: 'skill',
              status: 'active',
              difficulty: 'Intermediate',
              estimatedHours: 15,
              description: 'Probability distributions, ROC-AUC metrics, XGBoost for imbalanced financial risk data.',
              whyItMatters: 'Financial institutions evaluate models on precision and false-positive cost matrices.',
              whatToLearn: ['Cross-validation techniques', 'XGBoost gradient boosting', 'Precision-recall tradeoffs in fraud detection', 'Feature importance & SHAP values'],
              mission: 'Train an XGBoost credit risk evaluation model handling imbalanced class distributions with precision threshold tuning.',
              githubProof: 'Jupyter notebook with EDA charts, validation curves, and confusion matrix.',
              interviewQuestion: 'How do you handle severe class imbalance when training fraud classification models?',
              interviewAnswer: 'Use SMOTE oversampling, Focal Loss or weighted cross-entropy, and tune decision thresholds targeting recall/precision rather than overall accuracy.'
            }
          ]
        },
        {
          id: 'phase-ai-2',
          name: 'PHASE 2 · Deep Learning Transformers & Vector Databases',
          duration: `Weeks ${Math.ceil(35 / numHours) + 1} - ${Math.ceil(95 / numHours)}`,
          description: 'Neural network architectures, PyTorch autograd, transformer attention, and vector similarity search.',
          nodes: [
            {
              id: 'node-ai-pytorch-transformers',
              title: 'PyTorch & Transformer Architectures',
              type: 'skill',
              status: 'recommended',
              difficulty: 'Intermediate',
              estimatedHours: 35,
              description: 'Multi-head self-attention, positional encodings, GPU memory optimization, and PyTorch nn.Module.',
              whyItMatters: 'Transformers are the universal backbone of modern LLMs and sequential anomaly models.',
              whatToLearn: ['Scaled dot-product attention', 'PyTorch nn.Module & DataLoader', 'Mixed precision training (FP16/BF16)', 'HuggingFace Transformers API'],
              mission: 'Implement a miniature transformer encoder from scratch in PyTorch classifying financial transaction sentiment.',
              githubProof: 'PyTorch codebase with automated loss training curves and weights checkpointing.',
              interviewQuestion: 'Explain the computational complexity of self-attention with respect to sequence length N.',
              interviewAnswer: 'Standard attention computes pairwise similarity between all tokens, resulting in O(N^2) quadratic time and memory complexity.'
            },
            {
              id: 'node-ai-vector-db-rag',
              title: 'Vector Databases & RAG Retrieval',
              type: 'skill',
              status: 'recommended',
              difficulty: 'Intermediate',
              estimatedHours: 25,
              description: 'Chunking, dense embeddings, hybrid keyword+semantic search, re-ranking, and context window assembly.',
              whyItMatters: 'Enterprise AI apps require grounding LLMs on proprietary regulatory and transaction databases.',
              whatToLearn: ['HNSW vector indexing', 'Cosine vs Dot product similarity', 'Re-ranking algorithms', 'Metadata filtering in Pinecone/Milvus'],
              mission: 'Build an enterprise financial compliance retrieval engine searching 10,000 regulatory documents in sub-100ms.',
              githubProof: 'Deployed FastAPI microservice querying local ChromaDB/Pinecone with evaluation metrics.',
              interviewQuestion: 'What are the main causes of hallucination in Retrieval-Augmented Generation systems and how do you mitigate them?',
              interviewAnswer: 'Poor chunk boundaries, retrieval of irrelevant context, or conflicting prompt instructions; solved using re-ranking and citation enforcement.'
            }
          ]
        },
        {
          id: 'phase-ai-3',
          name: 'PHASE 3 · Flagship Real-World Capstone',
          duration: `Weeks ${Math.ceil(95 / numHours) + 1} - ${Math.ceil(160 / numHours)}`,
          description: 'Deploy an autonomous high-throughput fraud detection engine with telemetry.',
          nodes: [
            {
              id: 'node-ai-capstone-project',
              title: 'FinSentinel: Real-Time Fraud & Anomaly Engine',
              type: 'project',
              status: 'locked',
              difficulty: 'Advanced',
              estimatedHours: 45,
              description: 'Streaming financial transaction telemetry, computing real-time graph embeddings, and serving sub-20ms inference alerts.',
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
          id: 'phase-ai-4',
          name: 'PHASE 4 · Portfolio & Technical Interview Mastery',
          duration: `Weeks ${Math.ceil(160 / numHours) + 1} - ${estWeeks}`,
          description: 'Curate your model weights, write technical architecture teardowns, and ace ML system design.',
          nodes: [
            {
              id: 'node-ai-portfolio-showcase',
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
            },
            {
              id: 'node-ai-system-design',
              title: 'ML System Design & Algorithmic Screening',
              type: 'interview',
              status: 'locked',
              difficulty: 'Advanced',
              estimatedHours: 25,
              description: 'Designing recommendation feeds, vector database sharding, latency vs throughput trade-offs, and live coding.',
              whyItMatters: 'ML system design rounds distinguish junior scripters from high-compensation ML engineers.',
              whatToLearn: ['Designing recommendation feeds', 'Vector database sharding', 'Offline training vs Online inference', 'STAR behavioral responses'],
              mission: 'Complete 3 mock ML system design sessions (e.g. Design YouTube Recommender, Design FinTech Fraud Detector).',
              githubProof: 'Curated repository of system design diagrams and solved ML algorithmic challenges.',
              interviewQuestion: 'Design an end-to-end vector search architecture that supports 100 million embeddings with sub-50ms query time.',
              interviewAnswer: 'Use approximate nearest neighbors (HNSW or ScaNN), shard embeddings by semantic clusters across distributed worker nodes, and cache hot embeddings in RAM.'
            },
            {
              id: 'node-ai-target-offer',
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

  // 2. Game Developer (Test 3)
  if (jobLower.includes('game') || indLower.includes('game') || indLower.includes('gaming')) {
    const totalHours = 250;
    const estWeeks = Math.ceil(totalHours / numHours);
    return {
      careerGoal: dreamJob,
      summary: `Specialized game programming pathway mastering C++, Unity/Unreal Engine, 3D vector physics, and custom shader pipelines.`,
      whyThisRoadmap: `Because your goal is ${dreamJob} in ${industry}, this roadmap prioritizes low-level memory performance, spatial math (vectors/quaternions), game loop mechanics, and playable prototypes.${knownSet.has('c') ? ' Your foundational C knowledge lets you skip basic pointer concepts and jump straight into C++ game engine architecture.' : ''}`,
      estimatedDuration: timeline,
      totalEstimatedHours: totalHours,
      estimatedWeeks: estWeeks,
      alternativeRoutes: [
        {
          id: 'route-indie',
          title: 'Route A: Indie Shipped Games → itch.io / Steam → Junior Studio Role',
          description: 'Focus on shipping complete, highly polished smaller game prototypes that demonstrate full gameplay loops.',
          estimatedDuration: `${estWeeks} weeks`,
          focus: 'Playable Prototypes & Polish',
          stages: ['Engine Fundamentals', '2D/3D Player Controllers', 'Game Jams & itch.io release', 'Studio Outreach']
        },
        {
          id: 'route-engine',
          title: 'Route B: C++ Custom Engine & Graphics → AAA Studio Technical Track',
          description: 'Focus deeply on custom OpenGL/Vulkan rendering, spatial algorithms, and shader programming for AAA teams.',
          estimatedDuration: `${Math.ceil(estWeeks * 1.2)} weeks`,
          focus: 'Low-Level Graphics & Architecture',
          stages: ['C++ Advanced Memory', 'HLSL Shaders & Rasterization', 'Custom Physics Simulation', 'Technical Demo Reel']
        }
      ],
      projects: [
        {
          id: 'proj-game-1',
          title: 'ChronoShift: 3D Physics Action Roguelike',
          goal: 'Build and ship an action game prototype with procedural levels, enemy AI behavior trees, and custom shaders.',
          difficulty: 'Advanced',
          estimatedHours: 45,
          skillsPracticed: ['C++', 'Physics Simulation', 'HLSL Shaders', 'Behavior Trees'],
          expectedOutput: 'Playable WebGL/itch.io build with gamepad support and 60 FPS performance.',
          githubProof: 'Public repository with clean gameplay architecture and playable download link.'
        }
      ],
      entryRoles: ['Junior Gameplay Programmer', 'Technical Artist', 'Tools Developer'],
      certifications: ['Unity Certified Professional Programmer', 'Unreal Engine Authorized Developer'],
      interviewTopics: ['Quaternions vs Euler angles', 'Fixed vs Variable update delta times', 'Spatial partitioning (Quadtrees/Octrees)', 'Data-Oriented Design (DOD)'],
      phases: [
        {
          id: 'phase-game-1',
          name: 'PHASE 1 · Foundations: C++ & 3D Mathematical Concepts',
          duration: `Weeks 1 - ${Math.max(3, Math.ceil(35 / numHours))}`,
          description: 'Memory allocation, pointers, vectors, quaternions, and linear algebra transformations.',
          nodes: [
            {
              id: 'node-game-cpp-math',
              title: 'C++ Systems & 3D Vector Math',
              type: 'skill',
              status: knownSet.has('c') ? 'known' : 'active',
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
              id: 'node-game-loops-fsm',
              title: 'Game Loops & State Machines',
              type: 'skill',
              status: 'active',
              difficulty: 'Intermediate',
              estimatedHours: 15,
              description: 'Fixed update timesteps, component patterns, input buffering, and character state machines.',
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
          id: 'phase-game-2',
          name: 'PHASE 2 · Game Engine Architecture & Custom Shaders',
          duration: `Weeks ${Math.ceil(35 / numHours) + 1} - ${Math.ceil(95 / numHours)}`,
          description: 'Unity/Unreal engine architecture, lighting models, collision algorithms, and HLSL shaders.',
          nodes: [
            {
              id: 'node-game-engine-shaders',
              title: 'Engine Architecture & HLSL Shaders',
              type: 'skill',
              status: 'recommended',
              difficulty: 'Intermediate',
              estimatedHours: 35,
              description: 'Render pipelines, vertex and fragment shaders, post-processing, and profiling draw calls.',
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
          id: 'phase-game-3',
          name: 'PHASE 3 · Flagship Game Capstone',
          duration: `Weeks ${Math.ceil(95 / numHours) + 1} - ${Math.ceil(160 / numHours)}`,
          description: 'Engineer and publish a complete 3D playable game prototype on itch.io.',
          nodes: [
            {
              id: 'node-game-capstone-project',
              title: 'ChronoShift: 3D Physics Action Roguelike',
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
          id: 'phase-game-4',
          name: 'PHASE 4 · Gameplay Demo Reel & Studio Offer',
          duration: `Weeks ${Math.ceil(160 / numHours) + 1} - ${estWeeks}`,
          description: 'Produce your technical gameplay demo reel, tackle studio live coding, and sign your offer.',
          nodes: [
            {
              id: 'node-game-portfolio-reel',
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
            },
            {
              id: 'node-game-target-offer',
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

  // 3. Cybersecurity Analyst (Test 4)
  if (jobLower.includes('cyber') || jobLower.includes('security') || indLower.includes('cybersecurity')) {
    const totalHours = 240;
    const estWeeks = Math.ceil(totalHours / numHours);
    return {
      careerGoal: dreamJob,
      summary: `Hands-on defensive cybersecurity pathway covering packet inspection, Linux forensics, SIEM detection rules, and incident triage.`,
      whyThisRoadmap: `Because your goal is ${dreamJob} in ${industry}, this roadmap prioritizes TCP/IP network flows, Linux kernel auditing, log analysis with Splunk/Wazuh, and adversary emulation labs.${level === 'Beginner' ? ' We establish core operating system and packet fundamentals before advancing to intrusion analysis.' : ''}`,
      estimatedDuration: timeline,
      totalEstimatedHours: totalHours,
      estimatedWeeks: estWeeks,
      alternativeRoutes: [
        {
          id: 'route-soc',
          title: 'Route A: Hands-on SOC Lab → Blue Team Certifications → Tier 1 Analyst',
          description: 'Focus heavily on SIEM telemetry, packet captures, and Security+ certification for rapid SOC hiring.',
          estimatedDuration: `${estWeeks} weeks`,
          focus: 'SOC Triage & Log Analysis',
          stages: ['Packet Analysis (Wireshark)', 'Linux/Windows Auditing', 'SIEM Rule Engineering', 'CompTIA Security+ Prep']
        },
        {
          id: 'route-pentest',
          title: 'Route B: Offensive Security Labs → TryHackMe / HTB → Security Consultant',
          description: 'Learn attack methodology to better anticipate adversary persistence and lateral movement.',
          estimatedDuration: `${Math.ceil(estWeeks * 1.15)} weeks`,
          focus: 'Adversary Emulation & Pentesting',
          stages: ['Network Exploitation', 'Web Vulnerability Assessment', 'Active Directory Attacks', 'Report Writing']
        }
      ],
      projects: [
        {
          id: 'proj-sec-1',
          title: 'SentinelNet: Zero-Trust Telemetry & Defense Lab',
          goal: 'Deploy a virtualized SIEM lab ingesting telemetry, trigger simulated adversary attacks, and automate defense alerts.',
          difficulty: 'Advanced',
          estimatedHours: 45,
          skillsPracticed: ['Wireshark', 'Wazuh SIEM', 'Sigma Rules', 'Atomic Red Team'],
          expectedOutput: 'Documented threat simulation environment with automated detection rules.',
          githubProof: 'Public repository with network topology diagram, Sigma rule definitions, and PCAP analysis.'
        }
      ],
      entryRoles: ['SOC Analyst (Tier 1)', 'Information Security Associate', 'Junior Threat Intelligence Analyst'],
      certifications: ['CompTIA Security+', 'BTL1 (Blue Team Level 1)', 'Certified SOC Analyst (CSA)'],
      interviewTopics: ['NIST Incident Response phases', 'Common network ports & protocols', 'Sysmon Event IDs for process creation', 'Phishing email header triage'],
      phases: [
        {
          id: 'phase-sec-1',
          name: 'PHASE 1 · Foundations: Network Architecture & Linux Systems',
          duration: `Weeks 1 - ${Math.max(3, Math.ceil(35 / numHours))}`,
          description: 'TCP/IP protocol stack, packet inspection with Wireshark, Linux permissions, and bash scripting.',
          nodes: [
            {
              id: 'node-sec-network-foundations',
              title: 'TCP/IP Protocols & Packet Analysis',
              type: 'skill',
              status: 'active',
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
              id: 'node-sec-linux-security',
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
          id: 'phase-sec-2',
          name: 'PHASE 2 · Threat Detection & SIEM Engineering',
          duration: `Weeks ${Math.ceil(35 / numHours) + 1} - ${Math.ceil(95 / numHours)}`,
          description: 'Splunk/Wazuh SIEM log ingestion, MITRE ATT&CK mapping, Sigma detection rules, and cryptography.',
          nodes: [
            {
              id: 'node-sec-siem-detection',
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
          id: 'phase-sec-3',
          name: 'PHASE 3 · Flagship Security Lab Capstone',
          duration: `Weeks ${Math.ceil(95 / numHours) + 1} - ${Math.ceil(160 / numHours)}`,
          description: 'Deploy an enterprise-grade threat simulation and automated defense lab.',
          nodes: [
            {
              id: 'node-sec-capstone-project',
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
          id: 'phase-sec-4',
          name: 'PHASE 4 · SOC Screening & Target Offer',
          duration: `Weeks ${Math.ceil(160 / numHours) + 1} - ${estWeeks}`,
          description: 'Master technical incident response screening scenarios, behavioral rounds, and land your SOC Analyst role.',
          nodes: [
            {
              id: 'node-sec-interview-prep',
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
              id: 'node-sec-target-offer',
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

  // 4. Cloud & DevOps Architect
  if (jobLower.includes('cloud') || jobLower.includes('devops') || jobLower.includes('sre') || jobLower.includes('platform') || jobLower.includes('infrastructure')) {
    const totalHours = 240;
    const estWeeks = Math.ceil(totalHours / numHours);
    return {
      careerGoal: dreamJob,
      summary: `Enterprise cloud architecture and infrastructure engineering pathway covering Linux, Docker, Kubernetes, Terraform, and CI/CD pipelines in ${industry}.`,
      whyThisRoadmap: `Because your goal is ${dreamJob} in ${industry}, this roadmap focuses on high availability, cloud reliability, container orchestration, and Infrastructure as Code.${knownSet.has('docker') || knownSet.has('git') ? ' Your existing background accelerates your transition into Kubernetes and automated delivery.' : ''}`,
      estimatedDuration: timeline,
      totalEstimatedHours: totalHours,
      estimatedWeeks: estWeeks,
      alternativeRoutes: [
        {
          id: 'route-cloud-aws',
          title: 'Route A: AWS Solutions Architect → Kubernetes → Enterprise SRE',
          description: 'Focus heavily on AWS multi-region infrastructure, VPC peering, and EKS deployments.',
          estimatedDuration: `${estWeeks} weeks`,
          focus: 'AWS & Kubernetes',
          stages: ['Linux & Networking', 'Docker & Kubernetes', 'Terraform & CI/CD', 'AWS Solutions Architect']
        },
        {
          id: 'route-cloud-platform',
          title: 'Route B: Platform Engineering → Internal Developer Portals → Modern DevOps',
          description: 'Focus on developer productivity, GitOps with ArgoCD, and automated canary deployments.',
          estimatedDuration: `${Math.ceil(estWeeks * 1.1)} weeks`,
          focus: 'GitOps & Developer Platforms',
          stages: ['Dockerized Microservices', 'ArgoCD & Helm', 'Prometheus & Grafana', 'Platform Capstone']
        }
      ],
      projects: [
        {
          id: 'proj-cloud-1',
          title: 'CloudOps: Multi-Region Kubernetes Delivery Pipeline',
          goal: 'Automate zero-downtime canary deployments with Terraform IaC, ArgoCD, and Prometheus monitoring.',
          difficulty: 'Advanced',
          estimatedHours: 45,
          skillsPracticed: ['Docker', 'Kubernetes', 'Terraform', 'Prometheus'],
          expectedOutput: 'Production-ready GitOps repository with live canary metric dashboards.',
          githubProof: 'Public repository with Terraform modules, Helm charts, and architecture diagrams.'
        }
      ],
      entryRoles: ['Junior Cloud Engineer', 'DevOps Associate', 'Site Reliability Engineer I'],
      certifications: ['AWS Certified Solutions Architect - Associate', 'Certified Kubernetes Administrator (CKA)'],
      interviewTopics: ['Kubernetes Pod lifecycle & Ingress controllers', 'Terraform state management & locking', 'Blue-Green vs Canary deployments', 'Troubleshooting high CPU and memory leaks'],
      phases: [
        {
          id: 'phase-cloud-1',
          name: 'PHASE 1 · Foundations: Linux Systems & Containerization',
          duration: `Weeks 1 - ${Math.max(3, Math.ceil(35 / numHours))}`,
          description: 'Linux kernel tuning, networking fundamentals, Bash automation, and Docker containerization.',
          nodes: [
            {
              id: 'node-cloud-linux-docker',
              title: 'Linux Systems & Docker Containerization',
              type: 'skill',
              status: knownSet.has('docker') ? 'completed' : 'active',
              difficulty: 'Beginner',
              estimatedHours: 20,
              description: 'Linux system administration, network namespaces, multi-stage Docker builds, and container security.',
              whyItMatters: 'Containers are the atomic unit of modern cloud infrastructure. Efficient images reduce build times and attack surfaces.',
              whatToLearn: ['Multi-stage Dockerfile patterns', 'Cgroups & namespaces', 'Network inspection (netstat, iptables)', 'Rootless container security'],
              mission: 'Containerize a multi-service web application using multi-stage builds reducing image size by 75%.',
              githubProof: 'GitHub repository with optimized Dockerfiles and automated vulnerability scan actions.',
              interviewQuestion: 'What is the purpose of multi-stage Docker builds?',
              interviewAnswer: 'Multi-stage builds separate build dependencies from the runtime image, resulting in drastically smaller, more secure production containers.'
            },
            {
              id: 'node-cloud-gitops-ci',
              title: 'CI/CD Pipelines & GitHub Actions',
              type: 'skill',
              status: knownSet.has('git') ? 'completed' : 'active',
              difficulty: 'Intermediate',
              estimatedHours: 15,
              description: 'Automated test runners, artifact caching, container registry pushes, and deployment webhooks.',
              whyItMatters: 'Every modern engineering organization requires continuous integration to deploy code with confidence.',
              whatToLearn: ['GitHub Actions workflow syntax', 'Artifact caching strategies', 'Security secret management', 'Semantic versioning automation'],
              mission: 'Build an automated CI/CD pipeline that runs test suites, builds Docker images, and pushes tagged images on merge.',
              githubProof: 'Public repository with working GitHub Actions workflow and automated status badges.',
              interviewQuestion: 'How do you prevent secrets from leaking in CI/CD pipeline logs?',
              interviewAnswer: 'Use secret masking, ephemeral short-lived tokens via OIDC, and never echo raw environment variables.'
            }
          ]
        },
        {
          id: 'phase-cloud-2',
          name: 'PHASE 2 · Kubernetes Orchestration & Infrastructure as Code',
          duration: `Weeks ${Math.ceil(35 / numHours) + 1} - ${Math.ceil(95 / numHours)}`,
          description: 'Kubernetes cluster architecture, Helm package management, and Terraform cloud provisioning.',
          nodes: [
            {
              id: 'node-cloud-k8s-terraform',
              title: 'Kubernetes & Terraform (IaC)',
              type: 'skill',
              status: 'recommended',
              difficulty: 'Intermediate',
              estimatedHours: 35,
              description: 'Deployments, Services, ConfigMaps, Secrets, Ingress, and provisioning cloud resources declaratively.',
              whyItMatters: 'Kubernetes is the industry standard for managing containerized workloads at global scale.',
              whatToLearn: ['Kubernetes Deployment vs StatefulSet', 'Ingress controllers & TLS certificates', 'Terraform HCL syntax & state backend', 'Helm chart templating'],
              mission: 'Deploy a resilient 3-tier microservice cluster on local Minikube/Kind using custom Helm charts.',
              githubProof: 'Repository containing validated Helm charts and Terraform provisioning scripts.',
              interviewQuestion: 'Explain the difference between a Kubernetes ClusterIP, NodePort, and LoadBalancer service.',
              interviewAnswer: 'ClusterIP exposes the service internally, NodePort exposes a static port on each node IP, and LoadBalancer provisions an external cloud load balancer.'
            }
          ]
        },
        {
          id: 'phase-cloud-3',
          name: 'PHASE 3 · Flagship Cloud Infrastructure Capstone',
          duration: `Weeks ${Math.ceil(95 / numHours) + 1} - ${Math.ceil(160 / numHours)}`,
          description: 'Deploy an automated GitOps delivery pipeline with Prometheus observability.',
          nodes: [
            {
              id: 'node-cloud-capstone',
              title: 'CloudOps: Multi-Region Kubernetes Delivery Pipeline',
              type: 'project',
              status: 'locked',
              difficulty: 'Advanced',
              estimatedHours: 45,
              description: 'Production infrastructure with automated GitOps deployments (ArgoCD), Prometheus metrics, and automated alerts.',
              whyItMatters: 'Proves to engineering leadership that you can design and run resilient cloud systems with zero downtime.',
              whatToLearn: ['GitOps with ArgoCD', 'Prometheus metrics & Grafana dashboards', 'Horizontal Pod Autoscaler (HPA)', 'Disaster recovery failover'],
              mission: 'Deploy CloudOps: Execute a simulated cluster failure and prove automated pod rescheduling and metric alert notification.',
              githubProof: 'Complete GitHub repository with architecture diagram, Terraform files, Helm charts, and live dashboard screenshots.',
              interviewQuestion: 'How would you architect an infrastructure failover strategy across two cloud regions?',
              interviewAnswer: 'Use DNS-based global traffic management (e.g. Route53 latency routing with health checks) to direct traffic between active-active regional clusters.'
            }
          ]
        },
        {
          id: 'phase-cloud-4',
          name: 'PHASE 4 · Systems Interviews & Offer',
          duration: `Weeks ${Math.ceil(160 / numHours) + 1} - ${estWeeks}`,
          description: 'Master cloud systems design, live troubleshooting scenarios, and secure your Cloud / DevOps offer.',
          nodes: [
            {
              id: 'node-cloud-interview',
              title: 'Cloud Systems Design & Troubleshooting Screening',
              type: 'interview',
              status: 'locked',
              difficulty: 'Advanced',
              estimatedHours: 20,
              description: 'Designing high-availability web tiers, database replication, network security groups, and live incident triage.',
              whyItMatters: 'Senior engineering directors evaluate candidates on their calm, methodical approach to system outages.',
              whatToLearn: ['Cloud architectural design patterns', 'Post-mortem incident reviews', 'Cost optimization in cloud billing'],
              mission: 'Complete 3 simulated outage post-mortems and design a 99.99% available e-commerce architecture.',
              githubProof: 'Curated repository of cloud architecture diagrams and incident triage guides.',
              interviewQuestion: 'A production Kubernetes pod is stuck in CrashLoopBackOff. How do you triage it?',
              interviewAnswer: 'Check pod events with kubectl describe pod, inspect previous container logs with kubectl logs --previous, verify readiness/liveness probe health, and check memory limits for OOMKilled status.'
            },
            {
              id: 'node-cloud-offer',
              title: `Offer Received: ${dreamJob}`,
              type: 'milestone',
              status: 'locked',
              difficulty: 'Expert',
              estimatedHours: 5,
              description: `Hired as a Cloud & DevOps Engineer building resilient digital infrastructure.`,
              whyItMatters: 'Your ambition achieved: orchestrating world-class cloud platforms.',
              whatToLearn: ['Production change management', 'On-call rotation best practices', 'Team SLO and SLA definitions'],
              mission: 'Sign your contract and keep production running smoothly!',
              githubProof: 'Your verified skill tree and completed cloud pathway.',
              interviewQuestion: 'How do you balance release speed with infrastructure stability?',
              interviewAnswer: 'Through automated test gates, progressive canary rollouts, strict SLO monitoring, and fast automated rollback mechanisms.'
            }
          ]
        }
      ]
    };
  }

  // 5. Mobile App Developer (iOS / Android / React Native)
  if (jobLower.includes('mobile') || jobLower.includes('ios') || jobLower.includes('android') || jobLower.includes('swift') || jobLower.includes('flutter') || jobLower.includes('react native')) {
    const totalHours = 230;
    const estWeeks = Math.ceil(totalHours / numHours);
    return {
      careerGoal: dreamJob,
      summary: `Cross-platform and native mobile engineering pathway mastering responsive gestures, offline-first local storage, and app store deployment.`,
      whyThisRoadmap: `Because your goal is ${dreamJob} in ${industry}, this roadmap emphasizes device hardware APIs, touch responsiveness, local caching, and smooth 60 FPS animations.`,
      estimatedDuration: timeline,
      totalEstimatedHours: totalHours,
      estimatedWeeks: estWeeks,
      alternativeRoutes: [
        {
          id: 'route-mobile-cross',
          title: 'Route A: React Native / Flutter → Cross-Platform Apps → Fast Startup Shipping',
          description: 'Ship simultaneously to iOS and Android with single codebase velocity.',
          estimatedDuration: `${estWeeks} weeks`,
          focus: 'Cross-Platform React Native/Flutter',
          stages: ['Mobile UI & Navigation', 'Offline SQLite Sync', 'Native Modules & Camera', 'App Store Publishing']
        }
      ],
      projects: [
        {
          id: 'proj-mobile-1',
          title: 'PocketPulse: Offline-First Mobile Companion',
          goal: 'Build and publish a polished mobile application with gestures, biometric login, and SQLite sync.',
          difficulty: 'Advanced',
          estimatedHours: 40,
          skillsPracticed: ['Mobile UI', 'Offline Sync', 'Biometrics', 'Push Notifications'],
          expectedOutput: 'Installed APK / TestFlight preview with 60 FPS animations.',
          githubProof: 'Public repository with clean mobile architecture and demo video.'
        }
      ],
      entryRoles: ['Junior Mobile Developer', 'iOS Developer I', 'React Native Engineer'],
      certifications: ['Meta Android Developer Professional', 'Apple Developer Certified Associate'],
      interviewTopics: ['Mobile app lifecycle (background vs foreground)', 'Memory management & image caching', 'Offline data sync & conflict resolution', 'Push notification payloads'],
      phases: [
        {
          id: 'phase-mobile-1',
          name: 'PHASE 1 · Foundations: Mobile Architecture & UI Paradigms',
          duration: `Weeks 1 - ${Math.max(3, Math.ceil(35 / numHours))}`,
          description: 'Mobile component lifecycles, navigation stacks, gesture handling, and responsive layouts.',
          nodes: [
            {
              id: 'node-mobile-foundations',
              title: 'Mobile UI Components & Navigation Stacks',
              type: 'skill',
              status: 'active',
              difficulty: 'Beginner',
              estimatedHours: 20,
              description: 'Navigation hierarchies, gesture detectors, responsive flexbox layout, and platform styling.',
              whyItMatters: 'Mobile users have zero patience for sluggish navigation or clunky layouts.',
              whatToLearn: ['Stack & Tab Navigation', 'Touch gesture recognizers', 'Safe Area insets', 'Component lifecycle hooks'],
              mission: 'Build a multi-screen mobile interface with tab navigation and interactive gesture animations.',
              githubProof: 'Public GitHub repository with screen captures and responsive mobile layout code.',
              interviewQuestion: 'How do you handle safe area insets across devices with notches and dynamic islands?',
              interviewAnswer: 'Use Safe Area view wrappers and platform-specific insets to ensure content never overlaps status bars or home indicators.'
            }
          ]
        },
        {
          id: 'phase-mobile-2',
          name: 'PHASE 2 · Offline Sync & Device Hardware APIs',
          duration: `Weeks ${Math.ceil(35 / numHours) + 1} - ${Math.ceil(95 / numHours)}`,
          description: 'Local SQLite/WatermelonDB storage, background sync, biometrics, and push notifications.',
          nodes: [
            {
              id: 'node-mobile-offline-apis',
              title: 'Offline Storage & Native Hardware APIs',
              type: 'skill',
              status: 'recommended',
              difficulty: 'Intermediate',
              estimatedHours: 35,
              description: 'Local SQLite caching, biometrics (FaceID), camera capture, and background sync queues.',
              whyItMatters: 'Top mobile applications function seamlessly even with intermittent or zero network connectivity.',
              whatToLearn: ['Local database schemas (SQLite/Realm)', 'Optimistic UI updates', 'Camera & geolocation access', 'Biometric authentication'],
              mission: 'Implement an offline-first data manager that queues changes locally and synchronizes upon network reconnect.',
              githubProof: 'Tested mobile repository with offline sync unit tests.',
              interviewQuestion: 'How do you resolve data conflicts when synchronizing offline changes with a remote server?',
              interviewAnswer: 'Using vector clocks, last-write-wins strategies with server timestamps, or field-level CRDTs based on business requirements.'
            }
          ]
        },
        {
          id: 'phase-mobile-3',
          name: 'PHASE 3 · Flagship Shipped Mobile Capstone',
          duration: `Weeks ${Math.ceil(95 / numHours) + 1} - ${Math.ceil(160 / numHours)}`,
          description: 'Engineer and deploy PocketPulse with interactive charts and push notifications.',
          nodes: [
            {
              id: 'node-mobile-capstone',
              title: 'PocketPulse: Offline-First Mobile Companion',
              type: 'project',
              status: 'locked',
              difficulty: 'Advanced',
              estimatedHours: 40,
              description: 'Complete shipped mobile app with biometric auth, smooth list virtualization, and push alerts.',
              whyItMatters: 'Having an installed app on your phone to demonstrate in an interview is the strongest possible proof.',
              whatToLearn: ['Virtual list optimization (FlatList/Recycler)', 'Push notification handlers', 'App Store and Google Play publishing'],
              mission: 'Build and deploy PocketPulse with working biometric lock, offline caching, and responsive charts.',
              githubProof: 'GitHub repo with video demo walkthrough and release APK / TestFlight link.',
              interviewQuestion: 'How do you avoid jank and maintain 60 FPS when scrolling lists of thousands of complex items?',
              interviewAnswer: 'Virtualize list items, memoize render callbacks, offload expensive calculations off the JS thread, and use optimized image caches.'
            }
          ]
        },
        {
          id: 'phase-mobile-4',
          name: 'PHASE 4 · Mobile Portfolio & Studio Offer',
          duration: `Weeks ${Math.ceil(160 / numHours) + 1} - ${estWeeks}`,
          description: 'Showcase your mobile demo reel, pass mobile architecture screens, and land your offer.',
          nodes: [
            {
              id: 'node-mobile-target-offer',
              title: `Offer Received: ${dreamJob}`,
              type: 'milestone',
              status: 'locked',
              difficulty: 'Expert',
              estimatedHours: 5,
              description: `Hired as a Mobile Engineer building beloved daily apps.`,
              whyItMatters: 'Your roadmap reverse engineered into real shipped software in users\' pockets.',
              whatToLearn: ['Mobile crash analytics (Sentry/Crashlytics)', 'App Store review guidelines', 'Continuous delivery for mobile'],
              mission: 'Sign your offer and deploy apps to millions of devices!',
              githubProof: 'Your verified skill roadmap and live mobile portfolio.',
              interviewQuestion: 'How do you debug an intermittent crash occurring only in production on specific device models?',
              interviewAnswer: 'Analyze symbolicated crash stack traces via Crashlytics, inspect device memory metrics, check OS version regressions, and reproduce on emulation matrices.'
            }
          ]
        }
      ]
    };
  }

  // 6. Full Stack Developer (Climate Tech or General)
  const totalHours = 240;
  const estWeeks = Math.ceil(totalHours / numHours);
  return {
    careerGoal: dreamJob,
    summary: `Structured full-stack software engineering journey engineering responsive client apps, RESTful backends, and databases for ${industry}.`,
    whyThisRoadmap: `Because your goal is ${dreamJob} in ${industry}, this roadmap prioritizes web standards, component architecture, server API routing, and cloud database persistence.${knownSet.has('c') || knownSet.has('html') ? ' Your existing background in ' + Array.from(knownSet).join(', ').toUpperCase() + ' allows you to skip basic syntax and accelerate into modern JavaScript, React, and Full-Stack APIs.' : ''}`,
    estimatedDuration: timeline,
    totalEstimatedHours: totalHours,
    estimatedWeeks: estWeeks,
    alternativeRoutes: [
      {
        id: 'route-fullstack-startup',
        title: 'Route A: Frontend First → Backend APIs → Startup Generalist',
        description: 'Master React and client UX, then build full-stack Express backends to deliver end-to-end features rapidly.',
        estimatedDuration: `${estWeeks} weeks`,
        focus: 'High Shipping Velocity',
        stages: ['Modern JavaScript & React', 'Node.js & Express REST', 'PostgreSQL Schemas', 'Full-Stack Capstone']
      },
      {
        id: 'route-fullstack-enterprise',
        title: 'Route B: Backend Systems & Distributed DBs → Enterprise MNC Track',
        description: 'Focus heavily on system scalability, database indexing, and Docker microservices before frontend styling.',
        estimatedDuration: `${Math.ceil(estWeeks * 1.1)} weeks`,
        focus: 'System Architecture & Scale',
        stages: ['Backend Architecture', 'PostgreSQL Query Optimization', 'Docker & CI/CD Pipelines', 'System Design Interview Prep']
      }
    ],
    projects: [
      {
        id: 'proj-climate-1',
        title: 'EcoPulse: Climate Intelligence Platform',
        goal: 'Full-stack platform ingesting live environmental satellite data, generating real-time emission analytics, and automated alerts.',
        difficulty: 'Advanced',
        estimatedHours: 45,
        skillsPracticed: ['React', 'Node.js', 'PostgreSQL', 'Data Visualization'],
        expectedOutput: 'Deployed production web application with interactive charts and user authentication.',
        githubProof: 'Public GitHub repo with architecture diagrams and high automated test coverage.'
      }
    ],
    entryRoles: ['Junior Full Stack Developer', 'Frontend Applications Engineer', 'Software Engineer I'],
    certifications: ['AWS Certified Developer - Associate', 'Meta Front-End Developer Professional'],
    interviewTopics: ['React Virtual DOM & custom hooks', 'Event Loop: microtasks vs macrotasks', 'Relational database indexing trade-offs', 'Designing idempotent REST APIs'],
    phases: [
      {
        id: 'phase-fs-1',
        name: 'PHASE 1 · Web Foundations & Modern Logic',
        duration: `Weeks 1 - ${Math.max(3, Math.ceil(35 / numHours))}`,
        description: 'Semantic HTML5, CSS Flexbox/Grid, and modern asynchronous JavaScript (ES6+).',
        nodes: [
          {
            id: 'node-fs-html-css',
            title: 'Semantic HTML5 & Modern CSS Layouts',
            type: 'skill',
            status: knownSet.has('html') ? 'known' : 'completed',
            difficulty: 'Beginner',
            estimatedHours: 10,
            description: 'Semantic markup, Flexbox, CSS Grid, mobile-first responsiveness, and accessibility standards.',
            whyItMatters: 'Clean DOM semantics are mandatory for accessibility, SEO, and fast browser rendering.',
            whatToLearn: ['Semantic tags (<main>, <section>, <nav>)', 'CSS Grid & Flexbox layouts', 'Media queries', 'ARIA accessibility attributes'],
            mission: 'Build a responsive accessible landing page for an environmental cooperative with zero CSS frameworks.',
            githubProof: 'Deployed GitHub Pages link with 100% Lighthouse accessibility score.',
            interviewQuestion: 'What are the accessibility benefits of semantic HTML tags compared to generic <div> containers?',
            interviewAnswer: 'Screen readers can navigate by landmark tags, and search engine crawlers understand content structure and hierarchy.'
          },
          {
            id: 'node-fs-javascript',
            title: 'Modern JavaScript (ES6+) & Async Flow',
            type: 'skill',
            status: 'active',
            difficulty: 'Intermediate',
            estimatedHours: 25,
            description: 'Closures, promises, async/await, event loops, array methods, and modular code architecture.',
            whyItMatters: 'JavaScript is the runtime engine of the web. Mastering asynchronous execution prevents 90% of UI bugs.',
            whatToLearn: ['Event Loop & Microtask Queue', 'Async / Await & Promise.all', 'ES Modules & Destructuring', 'Fetch API with abort controllers'],
            mission: 'Build an interactive Carbon Emissions Estimator parsing dynamic user inputs and updating reactive metrics.',
            githubProof: 'Repository with clean vanilla JS modules and zero console errors.',
            interviewQuestion: 'Explain the difference between the Call Stack and the Microtask Queue in JavaScript.',
            interviewAnswer: 'The Call Stack executes synchronous code, while resolved Promises queue into the Microtask Queue which runs before the next macrotask (like setTimeout).'
          }
        ]
      },
      {
        id: 'phase-fs-2',
        name: 'PHASE 2 · Frontend Engineering (React)',
        duration: `Weeks ${Math.ceil(35 / numHours) + 1} - ${Math.ceil(85 / numHours)}`,
        description: 'Declarative component architecture, custom hooks, and state management.',
        nodes: [
          {
            id: 'node-fs-react',
            title: 'React & Component Architecture',
            type: 'skill',
            status: 'recommended',
            difficulty: 'Intermediate',
            estimatedHours: 30,
            description: 'Component decomposition, unidirectional data flow, custom hooks, and reactive state management.',
            whyItMatters: 'React is the global SaaS standard for building high-concurrency dashboards and web applications.',
            whatToLearn: ['Custom React Hooks', 'Zustand / Context state management', 'Component memoization (useMemo/useCallback)', 'Accessible design systems'],
            mission: 'Build a Climate Weather Dashboard featuring interactive solar/wind graphs and responsive layout.',
            githubProof: 'Deployed Vercel/Netlify app link with lighthouse score above 90.',
            interviewQuestion: 'Explain the difference between state and props in React.',
            interviewAnswer: 'Props are read-only configuration inputs passed from parent to child, whereas state is mutable private data managed internally by the component that triggers re-renders on change.'
          }
        ]
      },
      {
        id: 'phase-fs-3',
        name: 'PHASE 3 · Backend Systems & Databases',
        duration: `Weeks ${Math.ceil(85 / numHours) + 1} - ${Math.ceil(145 / numHours)}`,
        description: 'Node.js REST servers, authentication, and PostgreSQL relational schemas.',
        nodes: [
          {
            id: 'node-fs-backend-node',
            title: 'Node.js & Express REST Backend',
            type: 'skill',
            status: 'locked',
            difficulty: 'Intermediate',
            estimatedHours: 28,
            description: 'Express routing, middleware chains, token validation, and error boundaries.',
            whyItMatters: 'Understanding server runtime dynamics turns you from a surface coder into a full-stack engineer.',
            whatToLearn: ['Express middleware design', 'JWT authentication & cookies', 'Request validation (Zod)', 'Server logging & rate limits'],
            mission: 'Build an authenticated API service with login, registration, and role-protected CRUD resources.',
            githubProof: 'API repo with Postman/Bruno documentation collection and comprehensive test fixtures.',
            interviewQuestion: 'How do you safeguard API routes against unauthorized access and replay attacks?',
            interviewAnswer: 'Using signed short-lived JWTs, secure HttpOnly cookies, CSRF tokens, and verifying claims on every protected middleware execution.'
          },
          {
            id: 'node-fs-database-sql',
            title: 'PostgreSQL & Database Modeling',
            type: 'skill',
            status: 'locked',
            difficulty: 'Intermediate',
            estimatedHours: 24,
            description: 'Relational schemas, foreign keys, indexing, transactions, and ORMs (Drizzle / Prisma).',
            whyItMatters: 'Data integrity is the heartbeat of production software. Bad schemas cost companies millions.',
            whatToLearn: ['1-to-many & Many-to-many schemas', 'B-Tree indexes & EXPLAIN ANALYZE', 'ACID transactions', 'Database migrations'],
            mission: 'Model an emissions tracking database handling sensor time-series data and enterprise user teams.',
            githubProof: 'Migration files with seed data and SQL benchmark queries demonstrating index performance.',
            interviewQuestion: 'When would you use an index in a relational database, and what is its trade-off?',
            interviewAnswer: 'Indexes drastically speed up SELECT queries with WHERE/JOIN conditions, but increase disk storage and slow down INSERT/UPDATE/DELETE writes.'
          }
        ]
      },
      {
        id: 'phase-fs-4',
        name: 'PHASE 4 · Flagship Real-World Project',
        duration: `Weeks ${Math.ceil(145 / numHours) + 1} - ${Math.ceil(195 / numHours)}`,
        description: 'Engineer and deploy EcoPulse: Climate Intelligence Platform with live telemetry.',
        nodes: [
          {
            id: 'node-fs-capstone-project',
            title: 'EcoPulse: Climate Intelligence Platform',
            type: 'project',
            status: 'locked',
            difficulty: 'Advanced',
            estimatedHours: 45,
            description: 'Full-stack platform ingesting open environmental satellite data, generating real-time emission analytics, and automated reduction alerts.',
            whyItMatters: 'Hiring managers ignore generic to-do apps. A domain-specific capstone immediately proves you can solve industry problems.',
            whatToLearn: ['Full-stack monorepo setup', 'Data visualization (Recharts)', 'WebSockets or real-time polling', 'Cloud deployment (Render / Railway / Cloud Run)'],
            mission: 'Complete all 4 project epics: Database schema, backend API, responsive UI, and public production deployment with SSL.',
            githubProof: 'Public GitHub repo with architecture diagrams, high code coverage, and live demo badge.',
            interviewQuestion: 'Walk me through an architectural bottleneck you encountered during this project and how you solved it.',
            interviewAnswer: 'Detail how you resolved slow query times with indexing, or eliminated re-rendering bottlenecks on high-frequency live dashboard charts.'
          }
        ]
      },
      {
        id: 'phase-fs-5',
        name: 'PHASE 5 · Technical Interview Mastery & Offer',
        duration: `Weeks ${Math.ceil(195 / numHours) + 1} - ${estWeeks}`,
        description: 'System design, live coding, and behavioral interview preparation.',
        nodes: [
          {
            id: 'node-fs-interview-prep',
            title: 'System Design & DSA Calibration',
            type: 'interview',
            status: 'locked',
            difficulty: 'Advanced',
            estimatedHours: 35,
            description: 'Data structures & algorithms (Arrays, Hashmaps, Graphs), caching strategies, and STAR method behavioral prep.',
            whyItMatters: 'Overcoming technical screening hurdles is what turns candidate interest into written job offers.',
            whatToLearn: ['Core 75 LeetCode patterns', 'Database scaling & caching (Redis)', 'Load balancers & horizontal scale', 'STAR behavioral storytelling'],
            mission: 'Complete 3 full mock interviews with technical peers or AI coach and score above 85% on coding clarity.',
            githubProof: 'Well-documented repository of solved algorithmic challenges with space/time complexity notes.',
            interviewQuestion: 'Design a scalable notification service that handles 100,000 requests per minute during peak events.',
            interviewAnswer: 'Decouple ingestion via an asynchronous message queue (RabbitMQ/Kafka) feeding dedicated worker pools with rate-limited push providers and idempotent delivery keys.'
          },
          {
            id: 'node-fs-target-offer',
            title: `Offer Received: ${dreamJob}`,
            type: 'milestone',
            status: 'locked',
            difficulty: 'Expert',
            estimatedHours: 10,
            description: `Final negotiation, offer selection, and day-one readiness at a top-tier ${targetCompany}.`,
            whyItMatters: 'The culmination of reverse engineering your dream career into structured daily mastery.',
            whatToLearn: ['Offer evaluation & equity basics', 'Onboarding mindset', 'Setting 30-60-90 day performance goals'],
            mission: 'Sign your offer letter and launch your career in ' + industry + '!',
            githubProof: 'Your thriving software career and impact!',
            interviewQuestion: 'Where do you see your technical impact growing over the next 18 months?',
            interviewAnswer: 'Aiming to lead high-throughput microservices, mentor junior hires, and architect reliable resilient platforms.'
          }
        ]
      }
    ]
  };
}

// API endpoint to generate roadmap with Gemini and structured JSON output
app.post('/api/generate-roadmap', async (req, res) => {
  const { dreamJob, industry, level, existingSkills, hoursPerWeek, timeline, targetCompany } = req.body;
  const ai = getAiClient();

  if (ai) {
    try {
      const prompt = `You are CareerQuest AI. Reverse engineer this career ambition into a highly customized, production-grade learning roadmap:
Dream Job: ${dreamJob}
Industry: ${industry}
Current Level: ${level}
Existing Skills: ${(existingSkills || []).join(', ')}
Hours per week: ${hoursPerWeek}
Target Timeline: ${timeline}
Target Company Type: ${targetCompany}

Personalization Rules:
1. If the user already has existing skills (e.g. ${(existingSkills || []).join(', ')}), mark them as "completed" or "known". Do not force them to relearn basics; explain this in "whyThisRoadmap".
2. If current level is "Complete Beginner", start from fundamentals. If "Intermediate" or "Advanced", skip basics and focus on specialization and system design.
3. If timeline is "3 months", mark non-essential skills as "optional". If "6 months" or "1 year", include deep projects, portfolio, and interview preparation.
4. Calculate realistic durations based on learning hours / weekly hours.
5. Tailor projects, weekend missions, and interview questions specifically to "${industry}" and "${dreamJob}".
6. To ensure high response quality and fast delivery, structure the roadmap into 4 to 5 focused sequential phases with 1 to 2 key nodes per phase (total 6 to 8 focused nodes).

Return STRICT valid JSON without markdown fences matching this schema:
{
  "careerGoal": "${dreamJob}",
  "summary": "string",
  "whyThisRoadmap": "string (explains personalization based on existing skills and target)",
  "estimatedDuration": "${timeline}",
  "totalEstimatedHours": number,
  "estimatedWeeks": number,
  "alternativeRoutes": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "estimatedDuration": "string",
      "focus": "string",
      "stages": ["string", "string"]
    }
  ],
  "projects": [
    {
      "id": "string",
      "title": "string",
      "goal": "string",
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "estimatedHours": number,
      "skillsPracticed": ["string"],
      "expectedOutput": "string",
      "githubProof": "string"
    }
  ],
  "entryRoles": ["string"],
  "certifications": ["string"],
  "interviewTopics": ["string"],
  "phases": [
    {
      "id": "string",
      "name": "string",
      "duration": "string",
      "description": "string",
      "nodes": [
        {
          "id": "string",
          "title": "string",
          "type": "skill" | "project" | "portfolio" | "experience" | "interview" | "milestone",
          "status": "locked" | "active" | "completed" | "known" | "recommended" | "optional",
          "difficulty": "Beginner" | "Intermediate" | "Advanced" | "Expert",
          "estimatedHours": number,
          "category": "string",
          "prerequisites": ["string"],
          "whyItMatters": "string",
          "whatToLearn": ["string"],
          "mission": "string",
          "project": "string",
          "githubProof": "string",
          "interviewQuestion": "string",
          "interviewAnswer": "string"
        }
      ]
    }
  ]
}`;

      const responseText = await callGemini(prompt, true);
      const parsed = safeParseJson(responseText || '');

      if (parsed && Array.isArray(parsed.phases) && parsed.phases.length > 0) {
        // Sanitize phases and nodes to ensure strict UI integrity
        const sanitizedPhases = parsed.phases.map((phase: any, pIdx: number) => {
          const phaseId = phase.id || `phase-${pIdx + 1}`;
          const rawNodes = Array.isArray(phase.nodes) ? phase.nodes : [];
          const sanitizedNodes = rawNodes.map((node: any, nIdx: number) => ({
            id: node.id || `node-${phaseId}-${nIdx + 1}`,
            title: node.title || `Skill ${nIdx + 1}`,
            type: ['skill', 'project', 'portfolio', 'experience', 'interview', 'milestone'].includes(node.type) ? node.type : 'skill',
            status: ['locked', 'active', 'completed', 'known', 'recommended', 'optional'].includes(node.status) 
              ? node.status 
              : (pIdx === 0 && nIdx === 0 ? 'active' : 'recommended'),
            difficulty: ['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(node.difficulty) ? node.difficulty : 'Intermediate',
            estimatedHours: Number(node.estimatedHours) || 15,
            description: node.description || `Master core fundamentals of ${node.title || 'this technical competency'}.`,
            whyItMatters: node.whyItMatters || `Essential industry competency for ${dreamJob}.`,
            whatToLearn: Array.isArray(node.whatToLearn) && node.whatToLearn.length > 0 ? node.whatToLearn : ['Core concepts', 'Practical implementation', 'Industry best practices'],
            mission: node.mission || `Build and ship an end-to-end component demonstrating ${node.title || 'skill'}.`,
            githubProof: node.githubProof || 'Public GitHub repo with documentation and working tests.',
            interviewQuestion: node.interviewQuestion || `Explain the architectural trade-offs of ${node.title || 'this technique'}.`,
            interviewAnswer: node.interviewAnswer || `Evaluate performance, scalability constraints, and clean modular boundaries.`
          }));

          return {
            id: phaseId,
            name: phase.name || `PHASE ${pIdx + 1} · Core Specialization`,
            duration: phase.duration || `Weeks ${pIdx * 4 + 1} - ${(pIdx + 1) * 4}`,
            description: phase.description || 'Targeted skill acceleration and project delivery.',
            nodes: sanitizedNodes
          };
        });

        // Ensure at least one active node exists in phase 1
        if (sanitizedPhases[0]?.nodes?.length > 0 && !sanitizedPhases.some((p: any) => p.nodes.some((n: any) => n.status === 'active'))) {
          sanitizedPhases[0].nodes[0].status = 'active';
        }

        return res.json({
          ...parsed,
          career: parsed.careerGoal || dreamJob,
          industry,
          level,
          timeline,
          hoursPerWeek: Number(hoursPerWeek) || 10,
          targetCompany,
          phases: sanitizedPhases,
          generatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Gemini API roadmap generation error or timeout, using dynamic fallback:', err);
    }
  }

  // Graceful fallback tailored to input
  const fallback = generateFallbackRoadmap(req.body);
  return res.json({
    ...fallback,
    career: fallback.careerGoal || dreamJob,
    industry,
    level,
    timeline,
    hoursPerWeek: Number(hoursPerWeek) || 10,
    targetCompany,
    generatedAt: new Date().toISOString()
  });
});

// API endpoint for Daily Check-in AI Insight & Micro-Quest
app.post('/api/daily-checkin/insight', async (req, res) => {
  const { mood, moodLabel, goal, career, industry, level, currentSkill } = req.body || {};

  try {
    const prompt = `You are CareerQuest AI Career Coach. A student pursuing "${career || 'Software Engineer'}" in "${industry || 'Technology'}" at "${level || 'Student'}" level submitted their Daily Check-in:
- Mindset: ${mood || '🚀'} ${moodLabel || 'Focused'}
- Today's Goal: "${goal || 'Master active skill node'}"
- Active Focus Skill: "${currentSkill || 'Technical Fundamentals'}"

Generate an inspiring, highly specific daily tactical insight and 20-minute micro-quest.
Return strict JSON without markdown formatting:
{
  "insight": "string (1-2 sentences of encouraging, tactical coaching advice directly addressing their mood and goal)",
  "actionItem": "string (A concrete, punchy 20-minute micro-challenge they can ship today)",
  "recommendedResource": "string (A specific architectural principle, documentation pattern, or practice habit)",
  "suggestedGoals": [
    "string (4 fresh, specific goal ideas tailored to this role and mood)"
  ],
  "bonusXp": 15
}`;

    const text = await callGemini(prompt, true);
    const parsed = safeParseJson(text || '{}');
    if (parsed && (parsed.insight || parsed.actionItem)) {
      return res.json({
        insight: parsed.insight || `Harness your ${moodLabel || 'focused'} mindset today to build tangible momentum toward ${career || 'your dream career'}.`,
        actionItem: parsed.actionItem || `Spend 20 focused minutes committing clean, well-tested code for "${goal}".`,
        recommendedResource: parsed.recommendedResource || 'Maintain clean Git commits and write meaningful commit summaries.',
        suggestedGoals: Array.isArray(parsed.suggestedGoals) && parsed.suggestedGoals.length > 0
          ? parsed.suggestedGoals
          : [
              `Ship a working test suite for ${currentSkill || 'active node'}`,
              'Refactor a complex function into modular subroutines',
              'Practice 1 system trade-off interview explanation',
              'Review and document system API contract'
            ],
        bonusXp: 15
      });
    }
  } catch (err) {
    console.warn('Gemini daily check-in insight error:', err);
  }

  // Dynamic resilient fallback
  const moodKey = (moodLabel || '').toLowerCase();
  let fallbackInsight = `Your daily commitment compounds exponentially toward ${career || 'your dream role'}.`;
  let fallbackAction = `Carve out 20 uninterrupted minutes to turn "${goal || 'today\'s goal'}" into working code.`;

  if (moodKey.includes('curious')) {
    fallbackInsight = `Curiosity is the engine of top 1% engineers. Dive deep into the underlying mechanics of your tools today.`;
    fallbackAction = `Read the official GitHub source or documentation for 1 library method you use frequently.`;
  } else if (moodKey.includes('energized')) {
    fallbackInsight = `High momentum day! Channel this burst of energy into crushing the hardest architectural obstacle first.`;
    fallbackAction = `Tackle your most complex unit test or API integration right away while energy is at peak.`;
  } else if (moodKey.includes('steady')) {
    fallbackInsight = `Consistency beats sporadic intensity every single time. 1 hour of quiet focus today secures your weekly goal.`;
    fallbackAction = `Complete one focused 25-minute Pomodoro session with zero notifications.`;
  } else if (moodKey.includes('taking steps') || moodKey.includes('pacing')) {
    fallbackInsight = `Pacing yourself is wise engineering. Break your goal into tiny, frictionless milestones.`;
    fallbackAction = `Write out the skeleton or interface types for your feature before writing any implementation.`;
  }

  return res.json({
    insight: fallbackInsight,
    actionItem: fallbackAction,
    recommendedResource: 'Write code with clear function contracts and single-responsibility boundaries.',
    suggestedGoals: [
      `Master the core mechanics of ${currentSkill || 'your current skill'}`,
      'Push 1 cleanly documented commit to GitHub',
      'Explain 1 technical concept out loud without looking at notes',
      'Log 45 minutes of deep focus learning'
    ],
    bonusXp: 15
  });
});

// API endpoint for fetching fresh AI Goal Ideas
app.post('/api/daily-checkin/goals', async (req, res) => {
  const { mood, career, industry } = req.body || {};

  try {
    const prompt = `Generate 4 punchy, specific daily goals for a tech learner targeting "${career || 'Software Engineer'}" in "${industry || 'Tech'}" who feels "${mood || 'focused'}".
Return strict JSON array of 4 short strings without markdown:
["string", "string", "string", "string"]`;

    const text = await callGemini(prompt, true);
    const parsed = safeParseJson(text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return res.json({ goals: parsed.slice(0, 4) });
    }
  } catch (err) {
    console.warn('Gemini goal generation error:', err);
  }

  return res.json({
    goals: [
      `Build 1 standalone micro-component for ${career || 'portfolio'}`,
      'Write comprehensive unit tests for core business logic',
      'Benchmark API latency or profile memory consumption',
      'Draft a 1-page architecture design doc for a weekend project'
    ]
  });
});

// API endpoint for AI Career Coach chat
app.post('/api/chat-coach', async (req, res) => {
  const { message, roadmapContext } = req.body;

  try {
    const systemInstruction = `You are the CareerQuest AI Coach — an elite, encouraging tech career mentor.
You have full access to the student's active roadmap:
Target Career: ${roadmapContext?.career || 'Software Engineer'}
Industry: ${roadmapContext?.industry || 'Technology'}
Current Level: ${roadmapContext?.level || 'College Student'}
Weekly Commitment: ${roadmapContext?.hoursPerWeek || 10} hrs/week
Completed/Known Skills: ${(roadmapContext?.completedSkills || []).join(', ')}
Remaining Next Skills: ${(roadmapContext?.remainingSkills || []).join(', ')}
If the user asks "What should I learn next?", recommend their immediate next unlocked skill.
If they ask "Am I ready for an internship?", evaluate their completed project evidence.
If they ask "What project should I build?", recommend a domain-specific project with concrete deliverables.
Keep advice concise, direct, practical, and devoid of generic fluff.`;

    const aiReply = await callGemini(`User Question: ${message}`, false, systemInstruction);
    if (aiReply) {
      return res.json({ reply: aiReply.trim() });
    }
  } catch (err) {
    console.warn('Gemini chat error, using local expert coach response:', err);
  }

  // Intelligent local coach response grounded in roadmap context
  const msgLower = (message || '').toLowerCase();
  let reply = '';

  if (msgLower.includes('next') || msgLower.includes('prioritize')) {
    const nextSkill = roadmapContext?.remainingSkills?.[0] || 'your next active node';
    reply = `Looking at your roadmap dependencies for **${roadmapContext?.career || 'this role'}**, your highest-leverage move right now is:
1. **Focus on ${nextSkill}**: Complete its what-to-learn fundamentals before moving downstream.
2. **Execute the weekend mission**: Push verified code to GitHub with a clean README.
3. At your pace of **${roadmapContext?.hoursPerWeek || 10} hrs/week**, you will conquer this node in about 1-2 weeks!`;
  } else if (msgLower.includes('project') || msgLower.includes('build')) {
    reply = `For ${roadmapContext?.industry || 'your target industry'}, avoid generic to-do lists. Build a **Domain-Specific Telemetry Platform**:
- Ingest real data via public REST or WebSocket APIs.
- Store user preferences or alerts in PostgreSQL with type-safe queries.
- Implement token authentication and responsive visual charts.
- Recruiters will immediately see you understand real data pipelines and user authentication!`;
  } else if (msgLower.includes('internship') || msgLower.includes('ready')) {
    reply = `To assess your readiness for an internship in **${roadmapContext?.career || 'this role'}**:
1. **GitHub Proof**: You need at least 2 non-trivial repositories with live deployment links, clean commit histories, and setup instructions.
2. **Technical Fluency**: Ability to articulate architectural trade-offs (e.g. why you picked SQL vs NoSQL, or how async promises work under the hood).
3. **Collaboration Readiness**: One merged PR into an open repository demonstrates you can navigate a shared team codebase.`;
  } else if (msgLower.includes('resume')) {
    reply = `For your resume targeting **${roadmapContext?.career || 'this role'}**:
- **Lead with Projects**: Put your flagship project at the top under your education.
- **Use the Formula**: "Built [X] using [Tech Stack] resulting in [Metric/Impact]."
- **Include Live URLs**: Every project must have a live Vercel/Render link and a clean GitHub repo.
- **Remove Obvious Filler**: Drop basic school assignments and highlight production tooling like Git, Docker, or CI/CD.`;
  } else {
    reply = `Great question regarding your journey to **${roadmapContext?.career || 'your dream role'}**!
With your commitment of **${roadmapContext?.hoursPerWeek || 10} hours/week**, consistency will compound rapidly.
Prioritize completing the active nodes on your skill tree and verifying each with a tangible GitHub commit or working demo. What specific roadblock are you encountering right now?`;
  }

  return res.json({ reply });
});

// API endpoint to generate new mission for a skill
app.post('/api/generate-mission', async (req, res) => {
  const { skillTitle, career, industry, level } = req.body;

  try {
    const prompt = `Generate a fresh, highly practical weekend mission for the skill "${skillTitle}" tailored for someone pursuing "${career}" in "${industry}" at "${level || 'student'}" level.
Return strict JSON without backticks:
{
  "mission": "string (1-2 sentence mission brief)",
  "goal": "string (what is accomplished)",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "estimatedHours": number,
  "skillsPracticed": ["string", "string"],
  "deliverable": "string",
  "githubProof": "string",
  "interviewQuestion": "string",
  "interviewAnswer": "string"
}`;

    const text = await callGemini(prompt, true);
    const parsed = safeParseJson(text || '{}');
    if (parsed && parsed.mission) {
      return res.json(parsed);
    }
  } catch (err) {
    console.warn('Gemini mission generation error:', err);
  }

  // Fallback dynamic mission
  const mission = {
    mission: `Architect a standalone mini-service demonstrating ${skillTitle} for real-world ${industry || 'modern software'} operations.`,
    goal: `Demonstrate production-grade application of ${skillTitle} with error handling and live deployment.`,
    difficulty: 'Intermediate',
    estimatedHours: 6,
    skillsPracticed: [skillTitle, 'Unit Testing', 'Clean Architecture', 'Documentation'],
    deliverable: 'A working repository with automated tests and a live interactive demo.',
    githubProof: 'GitHub repository with 100% test pass rate and architecture diagram in README.md',
    interviewQuestion: `How would you architect a production feature utilizing ${skillTitle} to maximize performance under high load?`,
    interviewAnswer: `By decoupling synchronous bottlenecks, implementing intelligent caching at the boundaries, and maintaining strict schema validation.`
  };

  return res.json(mission);
});

// Serve frontend in production or integrate Vite in development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`CareerQuest AI server running on port ${port}`);
  });
}

startServer();
