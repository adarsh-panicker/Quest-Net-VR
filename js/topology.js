/**
 * topology.js - JSON Topology Schema Validator, Importer, Exporter & Auto-Layout
 *
 * Implements:
 * 1. Strict JSON validation (unique node IDs, valid node types, link endpoint existence)
 * 2. BFS auto-layout fallback if 3D coordinates are omitted
 * 3. Export of current network topology with user-modified 3D positions
 * 4. LocalStorage persistence & restore
 * 5. Sample topology loader
 */

import { NODE_TYPES } from './graph.js';

export const LOCAL_STORAGE_KEY = 'vr_network_topology_saved';

/**
 * Validates a topology object against schema
 * @param {Object} data
 * @returns {{ valid: boolean, errors: string[], data: Object|null }}
 */
export function validateTopology(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Input is not a valid JSON object'], data: null };
  }

  if (!Array.isArray(data.nodes) || data.nodes.length === 0) {
    errors.push('Topology must contain a "nodes" array with at least one node');
    return { valid: false, errors, data: null };
  }

  const nodeIds = new Set();
  const validatedNodes = [];

  for (let i = 0; i < data.nodes.length; i++) {
    const n = data.nodes[i];
    if (!n || typeof n !== 'object') {
      errors.push(`Node at index ${i} is not a valid object`);
      continue;
    }
    if (!n.id || typeof n.id !== 'string') {
      errors.push(`Node at index ${i} is missing a string "id"`);
      continue;
    }
    if (nodeIds.has(n.id)) {
      errors.push(`Duplicate node id "${n.id}" found`);
      continue;
    }
    nodeIds.add(n.id);

    const type = (n.type && NODE_TYPES.includes(n.type.toLowerCase()))
      ? n.type.toLowerCase()
      : 'pc';

    let pos = n.position;
    if (Array.isArray(pos) && pos.length >= 3) {
      pos = [Number(pos[0]) || 0, Number(pos[1]) || 1.5, Number(pos[2]) || -1.0];
    } else {
      pos = null; // Will trigger auto-layout
    }

    validatedNodes.push({
      id: String(n.id),
      name: n.name || n.id,
      type: type,
      ip: n.ip || '10.0.0.1',
      department: n.department || 'IT & Infrastructure',
      subnet: n.subnet || n.department || 'Default Subnet',
      vlan: n.vlan,
      port: n.port,
      speed: n.speed,
      firmware: n.firmware,
      mac: n.mac,
      gateway: n.gateway,
      position: pos
    });
  }

  const validatedLinks = [];
  if (Array.isArray(data.links)) {
    for (let i = 0; i < data.links.length; i++) {
      const l = data.links[i];
      if (!l || !l.from || !l.to) {
        errors.push(`Link at index ${i} missing "from" or "to"`);
        continue;
      }
      if (!nodeIds.has(l.from)) {
        errors.push(`Link ${l.id || i}: endpoint "from" node "${l.from}" does not exist`);
        continue;
      }
      if (!nodeIds.has(l.to)) {
        errors.push(`Link ${l.id || i}: endpoint "to" node "${l.to}" does not exist`);
        continue;
      }

      validatedLinks.push({
        id: l.id || `link-${l.from}-${l.to}`,
        from: String(l.from),
        to: String(l.to),
        cable: l.cable || 'cat6',
        speed: l.speed || '10 Gbps Fiber',
        distance: l.distance || '25m'
      });
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors, data: null };
  }

  // Auto-layout any nodes missing 3D coordinates
  autoLayoutMissingPositions(validatedNodes, validatedLinks);

  return {
    valid: true,
    errors: [],
    data: {
      name: data.name || 'Custom Network Topology',
      nodes: validatedNodes,
      links: validatedLinks
    }
  };
}

/**
 * Automatically layout nodes that do not have explicitly defined positions
 * Uses BFS depth layers starting from 'internet' or first node
 * @param {Array} nodes
 * @param {Array} links
 */
export function autoLayoutMissingPositions(nodes, links) {
  const needsLayout = nodes.some(n => n.position === null);
  if (!needsLayout) return;

  // Root node: internet or first node
  let root = nodes.find(n => n.type === 'internet') || nodes[0];
  const rootId = root.id;

  // Build adjacency
  const adj = new Map();
  for (const n of nodes) adj.set(n.id, []);
  for (const l of links) {
    if (adj.has(l.from)) adj.get(l.from).push(l.to);
    if (adj.has(l.to)) adj.get(l.to).push(l.from);
  }

  // BFS depth map
  const depthMap = new Map();
  depthMap.set(rootId, 0);
  const queue = [rootId];

  while (queue.length > 0) {
    const curr = queue.shift();
    const d = depthMap.get(curr);
    for (const nbr of adj.get(curr) || []) {
      if (!depthMap.has(nbr)) {
        depthMap.set(nbr, d + 1);
        queue.push(nbr);
      }
    }
  }

  // Assign depths for any disconnected nodes
  let maxDepth = 0;
  for (const d of depthMap.values()) {
    if (d > maxDepth) maxDepth = d;
  }
  for (const n of nodes) {
    if (!depthMap.has(n.id)) {
      maxDepth++;
      depthMap.set(n.id, maxDepth);
    }
  }

  // Group nodes by depth
  const layers = new Map();
  for (const n of nodes) {
    const d = depthMap.get(n.id) || 0;
    if (!layers.has(d)) layers.set(d, []);
    layers.get(d).push(n);
  }

  // Lay out along X (-2.6 to +2.6) and Y (1.2 to 2.0)
  const totalLayers = Math.max(layers.size, 1);
  const xSpan = 5.2;

  layers.forEach((nodesInLayer, layerIndex) => {
    const layerX = -2.6 + (layerIndex / Math.max(totalLayers - 1, 1)) * xSpan;
    const count = nodesInLayer.length;
    const ySpacing = 0.55;
    const startY = 1.5 + ((count - 1) * ySpacing) / 2;

    nodesInLayer.forEach((node, nodeIndex) => {
      if (node.position === null) {
        node.position = [
          Number(layerX.toFixed(2)),
          Number((startY - nodeIndex * ySpacing).toFixed(2)),
          -1.0
        ];
      }
    });
  });
}

/**
 * Export current graph and 3D positions to JSON
 * @param {import('./graph.js').Graph} graph
 * @param {import('./nodes.js').NodeVisualManager} nodeVisuals
 * @returns {string} JSON string
 */
export function exportTopologyJSON(graph, nodeVisuals) {
  const exportData = {
    name: 'Exported VR Network Topology',
    nodes: [],
    links: []
  };

  for (const [id, node] of graph.nodes.entries()) {
    const visual = nodeVisuals?.nodeMeshes.get(id);
    let pos = [node.position.x, node.position.y, node.position.z];
    if (visual && visual.userData.basePosition) {
      const bp = visual.userData.basePosition;
      pos = [
        Number(bp.x.toFixed(2)),
        Number(bp.y.toFixed(2)),
        Number(bp.z.toFixed(2))
      ];
    }

    exportData.nodes.push({
      id: node.id,
      name: node.name,
      type: node.type,
      ip: node.ip,
      department: node.department || 'IT & Infrastructure',
      subnet: node.subnet || 'Default Subnet',
      position: pos
    });
  }

  for (const link of graph.links) {
    exportData.links.push({
      id: link.id,
      from: link.from,
      to: link.to
    });
  }

  return JSON.stringify(exportData, null, 2);
}

/**
 * Load default sample topology
 * @returns {Promise<Object>}
 */
export async function loadSampleTopology() {
  try {
    const resp = await fetch('data/sample.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    return json;
  } catch (err) {
    console.warn('Failed to fetch data/sample.json, falling back to embedded default:', err);
    return getFallbackTopology();
  }
}

/**
 * Save topology to localStorage
 * @param {Object} topologyData
 */
export function saveTopologyToStorage(topologyData) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(topologyData));
    return true;
  } catch (e) {
    console.warn('localStorage save failed:', e);
    return false;
  }
}

/**
 * Retrieve saved topology from localStorage
 * @returns {Object|null}
 */
export function loadTopologyFromStorage() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    console.warn('localStorage read failed:', e);
    return null;
  }
}

/**
 * Fallback topology embedded in code if fetch fails
 */
function getFallbackTopology() {
  return {
    name: "Corporate Edge Network (Fallback)",
    nodes: [
      { id: "inet", name: "Global Internet", type: "internet", ip: "198.51.100.1", position: [-2.8, 1.5, -1.0] },
      { id: "fw1", name: "Edge Firewall", type: "firewall", ip: "192.168.1.1", position: [-1.7, 1.5, -1.0] },
      { id: "r_core", name: "Core Router", type: "router", ip: "10.0.0.1", position: [-0.6, 1.5, -1.0] },
      { id: "sw1", name: "DC Switch 1", type: "switch", ip: "10.0.10.1", position: [0.8, 1.9, -1.0] },
      { id: "sw2", name: "Access Switch 2", type: "switch", ip: "10.0.20.1", position: [0.8, 1.1, -1.0] },
      { id: "srv1", name: "App Server 1", type: "server", ip: "10.0.10.11", position: [2.3, 2.15, -1.0] },
      { id: "srv2", name: "DB Server 2", type: "server", ip: "10.0.10.12", position: [2.3, 1.65, -1.0] },
      { id: "pc1", name: "Workstation 1", type: "pc", ip: "10.0.20.101", position: [2.3, 1.25, -1.0] },
      { id: "pc2", name: "Workstation 2", type: "pc", ip: "10.0.20.102", position: [2.3, 0.75, -1.0] }
    ],
    links: [
      { id: "link-inet-fw1", from: "inet", to: "fw1" },
      { id: "link-fw1-rcore", from: "fw1", to: "r_core" },
      { id: "link-rcore-sw1", from: "r_core", to: "sw1" },
      { id: "link-rcore-sw2", from: "r_core", to: "sw2" },
      { id: "link-sw1-srv1", from: "sw1", to: "srv1" },
      { id: "link-sw1-srv2", from: "sw1", to: "srv2" },
      { id: "link-sw2-pc1", from: "sw2", to: "pc1" },
      { id: "link-sw2-pc2", from: "sw2", to: "pc2" },
      { id: "link-sw2-sw1", from: "sw2", to: "sw1" }
    ]
  };
}
