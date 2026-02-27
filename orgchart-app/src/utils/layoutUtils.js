import dagre from "dagre";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 90;

// Convert org members to ReactFlow nodes + edges with dagre layout
export function buildOrgFlowData(members) {
  if (!members || members.length === 0) return { nodes: [], edges: [] };

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "TB",
    nodesep: 60,
    ranksep: 100,
    marginx: 40,
    marginy: 40,
  });

  // Add nodes
  for (const m of members) {
    g.setNode(m.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  // Add edges
  for (const m of members) {
    if (m.supervisorId && members.find((x) => x.id === m.supervisorId)) {
      g.setEdge(m.supervisorId, m.id);
    }
  }

  dagre.layout(g);

  const nodes = members.map((m) => {
    const pos = g.node(m.id);
    return {
      id: m.id,
      type: "orgNode",
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
      data: {
        ...m,
        label: m.name,
      },
    };
  });

  const edges = members
    .filter((m) => m.supervisorId && members.find((x) => x.id === m.supervisorId))
    .map((m) => ({
      id: `e-${m.supervisorId}-${m.id}`,
      source: m.supervisorId,
      target: m.id,
      type: "smoothstep",
      style: {
        stroke: m.isVacant ? "#999" : "#5B6770",
        strokeWidth: 2,
        strokeDasharray: m.isVacant ? "5 5" : "none",
      },
      animated: false,
    }));

  return { nodes, edges };
}

// Get color for node based on hierarchy level
export function getNodeColor(member) {
  if (member.color) return member.color;
  if (!member.supervisorId) return "#1B3A5C"; // Top level
  return "#4A90B8"; // Default
}

// Get text color for a background
export function getTextColor(bgColor) {
  if (!bgColor) return "#1B3A5C";
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1B3A5C" : "#FFFFFF";
}

// Build a tree structure from flat members array
export function buildTree(members) {
  const map = {};
  const roots = [];

  for (const m of members) {
    map[m.id] = { ...m, children: [] };
  }

  for (const m of members) {
    if (m.supervisorId && map[m.supervisorId]) {
      map[m.supervisorId].children.push(map[m.id]);
    } else if (!m.supervisorId) {
      roots.push(map[m.id]);
    }
  }

  return roots;
}

// Check if moving would create a circular reference
export function wouldCreateCycle(members, memberId, newSupervisorId) {
  if (memberId === newSupervisorId) return true;
  let current = newSupervisorId;
  const visited = new Set();
  while (current) {
    if (current === memberId) return true;
    if (visited.has(current)) return false;
    visited.add(current);
    const member = members.find((m) => m.id === current);
    current = member?.supervisorId;
  }
  return false;
}
