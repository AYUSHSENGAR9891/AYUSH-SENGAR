export type NodeStatus = 'locked' | 'active' | 'completed' | 'known' | 'recommended' | 'optional';

export type NodeType = 'skill' | 'project' | 'portfolio' | 'experience' | 'interview' | 'milestone';

export type NodeDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface RoadmapNode {
  id: string;
  title: string;
  type: NodeType;
  status: NodeStatus;
  difficulty: NodeDifficulty;
  estimatedHours: number;
  description: string;
  whyItMatters: string;
  whatToLearn: string[];
  mission: string;
  githubProof: string;
  interviewQuestion: string;
  interviewAnswer: string;
  category?: string;
  importance?: string;
  prerequisites?: string[];
  dependencies?: string[];
  topics?: string[];
  project?: string;
  completedAt?: string;
  isKnownSkill?: boolean;
}

export interface RoadmapPhase {
  id: string;
  name: string;
  duration: string;
  description: string;
  estimatedWeeks?: number;
  nodes: RoadmapNode[];
}

export interface AlternativeRoute {
  id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  focus: string;
  stages: string[];
}

export interface DetailedProject {
  id: string;
  title: string;
  goal: string;
  difficulty: NodeDifficulty;
  estimatedHours: number;
  skillsPracticed: string[];
  expectedOutput: string;
  githubProof: string;
}

export interface RoadmapData {
  career: string;
  industry: string;
  level: string;
  timeline: string;
  hoursPerWeek: number;
  targetCompany: string;
  totalEstimatedHours: number;
  estimatedWeeks: number;
  generatedAt: string;
  summary?: string;
  whyThisRoadmap?: string;
  alternativeRoutes?: AlternativeRoute[];
  projects?: DetailedProject[];
  entryRoles?: string[];
  certifications?: string[];
  interviewTopics?: string[];
  phases: RoadmapPhase[];
}

export interface CareerSetupInput {
  dreamJob: string;
  industry: string;
  level: string;
  existingSkills: string[];
  hoursPerWeek: number;
  timeline: string;
  targetCompany: string;
}

export interface UserProfile {
  name: string;
  role: string;
  levelTitle: string;
  levelNumber: number;
  currentXp: number;
  nextLevelXp: number;
  studentMode: boolean;
  streakDays: number;
}

export interface DailyCheckIn {
  date: string;
  mood: string;
  moodLabel: string;
  goal: string;
  xpEarned: number;
  completedAt: string;
  aiInsight?: string;
  actionItem?: string;
  recommendedResource?: string;
  bonusXpClaimed?: boolean;
}

export interface DailyProgressTrend {
  date: string;
  dayLabel: string;
  formattedDate: string;
  mood: string;
  moodLabel: string;
  moodScore: number;
  goalsAchieved: number;
  dailyGoalText: string;
  xpEarned: number;
  completedAt?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  unlockedAt?: string;
  iconName: string;
}

export interface CareerPreset {
  id: string;
  title: string;
  industry: string;
  tagline: string;
  description: string;
  difficulty: string;
  typicalTimeline: string;
  coreSkills: string[];
  entryRoles: string[];
  recommendedProjects: string[];
  estimatedHours: number;
  matchScore?: number;
}
