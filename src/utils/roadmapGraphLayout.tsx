import { Edge, Node } from '@xyflow/react';
import { RoadmapData, RoadmapNode } from '../types/roadmap';

export interface GraphLayoutResult {
  nodes: Node[];
  edges: Edge[];
}

export function buildRoadmapGraph(
  roadmap: RoadmapData,
  selectedNodeId: string | null,
  onSelectNode: (node: RoadmapNode) => void,
  onQuickKnown: (node: RoadmapNode) => void
): GraphLayoutResult {
  const flowNodes: Node[] = [];
  const flowEdges: Edge[] = [];

  const phases = roadmap.phases || [];
  let currentY = 100;
  const X_CENTER = 480;
  const X_GAP = 340;
  const Y_GAP = 200;

  let previousLevelNodeIds: string[] = [];

  // Hierarchy mapping categories as requested in Section 2:
  // CURRENT LEVEL ↓ FOUNDATIONS ↓ TECHNICAL SKILLS ↓ PROJECTS ↓ PORTFOLIO ↓ EXPERIENCE ↓ INTERVIEW ↓ DREAM CAREER
  const getHierarchyTag = (phaseIndex: number, phaseName: string) => {
    const lower = phaseName.toLowerCase();
    if (phaseIndex === 0) return 'FOUNDATIONS';
    if (lower.includes('project') || lower.includes('capstone')) return 'PROJECTS';
    if (lower.includes('portfolio') || lower.includes('proof')) return 'PORTFOLIO';
    if (lower.includes('experience') || lower.includes('internship')) return 'EXPERIENCE';
    if (lower.includes('interview')) return 'INTERVIEW';
    if (phaseIndex === phases.length - 1) return 'DREAM CAREER';
    return 'TECHNICAL SKILLS';
  };

  phases.forEach((phase, phaseIndex) => {
    const nodesInPhase = phase.nodes || [];
    const count = nodesInPhase.length;
    const hierarchyTag = getHierarchyTag(phaseIndex, phase.name);

    // Left sidebar phase indicator node
    const markerId = `phase-marker-${phase.id || phaseIndex + 1}`;
    flowNodes.push({
      id: markerId,
      type: 'phaseMarker',
      position: { x: 20, y: currentY + 10 },
      data: {
        hierarchyTag,
        name: (phase.name || `Phase ${phaseIndex + 1}`).replace(/^PHASE \d+ · /, ''),
        duration: phase.duration || `Phase ${phaseIndex + 1}`
      },
      selectable: false,
      draggable: false
    });

    // Determine horizontal distribution of skills
    const levelNodeIds: string[] = [];

    nodesInPhase.forEach((node, nodeIdx) => {
      let xPos = X_CENTER;
      if (count > 1) {
        const offset = (nodeIdx - (count - 1) / 2) * X_GAP;
        xPos = X_CENTER + offset;
      }

      const safeId = node.id || `node-p${phaseIndex + 1}-n${nodeIdx + 1}`;
      flowNodes.push({
        id: safeId,
        type: 'customRoadmap',
        position: { x: xPos - 150, y: currentY },
        data: {
          node: { ...node, id: safeId },
          isSelected: selectedNodeId === safeId,
          onSelectNode,
          onQuickKnown
        }
      });

      levelNodeIds.push(safeId);
    });

    // Connect from previous level
    if (previousLevelNodeIds.length > 0) {
      if (previousLevelNodeIds.length === 1 && levelNodeIds.length > 1) {
        // One parent branching out to multiple children
        const parentId = previousLevelNodeIds[0];
        levelNodeIds.forEach(childId => {
          const targetNode = nodesInPhase.find(n => n.id === childId);
          flowEdges.push(createEdge(parentId, childId, targetNode?.status));
        });
      } else if (previousLevelNodeIds.length > 1 && levelNodeIds.length === 1) {
        // Multiple parallel branches converging into one (e.g. Frontend+Backend+DB -> Project)
        const childId = levelNodeIds[0];
        const targetNode = nodesInPhase[0];
        previousLevelNodeIds.forEach(parentId => {
          flowEdges.push(createEdge(parentId, childId, targetNode?.status));
        });
      } else if (previousLevelNodeIds.length === levelNodeIds.length) {
        // 1:1 or N:N mapped lanes
        levelNodeIds.forEach((childId, idx) => {
          const parentId = previousLevelNodeIds[idx];
          const targetNode = nodesInPhase.find(n => n.id === childId);
          flowEdges.push(createEdge(parentId, childId, targetNode?.status));
        });
      } else {
        const parentId = previousLevelNodeIds[0];
        levelNodeIds.forEach(childId => {
          const targetNode = nodesInPhase.find(n => n.id === childId);
          flowEdges.push(createEdge(parentId, childId, targetNode?.status));
        });
      }
    }

    previousLevelNodeIds = levelNodeIds;
    currentY += Y_GAP + (count > 1 ? 20 : 0);
  });

  return { nodes: flowNodes, edges: flowEdges };
}

function createEdge(sourceId: string, targetId: string, targetStatus?: string): Edge {
  const isCompleted = targetStatus === 'completed';
  const isActive = targetStatus === 'active';
  const isRecommended = targetStatus === 'recommended';

  let strokeColor = '#334155';
  let strokeWidth = 2;
  let animated = false;

  if (isCompleted) {
    strokeColor = '#10b981';
    strokeWidth = 2.5;
  } else if (isActive) {
    strokeColor = '#06b6d4';
    strokeWidth = 2.5;
    animated = true;
  } else if (isRecommended) {
    strokeColor = '#f59e0b';
    strokeWidth = 2;
    animated = true;
  }

  return {
    id: `e-${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
    type: 'smoothstep',
    animated,
    style: {
      stroke: strokeColor,
      strokeWidth,
      opacity: targetStatus === 'locked' ? 0.45 : 0.95,
      transition: 'stroke 0.4s ease, stroke-width 0.4s ease'
    }
  };
}
