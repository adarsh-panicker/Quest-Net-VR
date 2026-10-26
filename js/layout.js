/**
 * layout.js - 3D Automatic Topology Layout Algorithms
 *
 * Implements:
 * 1. Hierarchical Layered Flow (Left-to-Right by BFS Depth)
 * 2. Concentric Radial Ring Layout (Core in center, rings of switches & endpoints)
 * 3. Force-Directed Physics Layout (Coulomb Repulsion + Hooke's Link Springs)
 */

import * as THREE from 'three';
import { sound } from './audio.js';

export class TopologyLayoutManager {
  /**
   * @param {import('./graph.js').Graph} graph
   * @param {import('./nodes.js').NodeVisualManager} nodeVisuals
   */
  constructor(graph, nodeVisuals) {
    this.graph = graph;
    this.nodeVisuals = nodeVisuals;
  }

  /**
   * Apply Radial Concentric Rings Layout
   */
  applyRadialLayout() {
    const nodes = Array.from(this.graph.nodes.values());
    if (nodes.length === 0) return;

    // Identify center root node (Core router, firewall, or internet)
    let centerNode = nodes.find(n => n.type === 'router') ||
                     nodes.find(n => n.type === 'internet') ||
                     nodes[0];

    // Compute BFS distance from center
    const distMap = new Map();
    distMap.set(centerNode.id, 0);
    const queue = [centerNode.id];

    while (queue.length > 0) {
      const curr = queue.shift();
      const d = distMap.get(curr);
      for (const link of this.graph.links) {
        let nbr = null;
        if (link.from === curr) nbr = link.to;
        else if (link.to === curr) nbr = link.from;

        if (nbr && !distMap.has(nbr)) {
          distMap.set(nbr, d + 1);
          queue.push(nbr);
        }
      }
    }

    // Group by ring radius
    const rings = new Map();
    for (const node of nodes) {
      const d = distMap.get(node.id) || 1;
      if (!rings.has(d)) rings.set(d, []);
      rings.get(d).push(node);
    }

    // Place center
    this.setNodePosition(centerNode.id, 0, 1.5, -1.0);

    // Place concentric rings
    rings.forEach((nodesInRing, ringIndex) => {
      if (ringIndex === 0) return;
      const radius = 1.1 + (ringIndex - 1) * 1.1; // 1.1m, 2.2m, 3.3m
      const count = nodesInRing.length;
      const angleStep = (Math.PI * 2) / count;

      nodesInRing.forEach((node, idx) => {
        const angle = idx * angleStep;
        const x = Math.cos(angle) * radius;
        const y = 1.5 + Math.sin(angle) * (radius * 0.45);
        const z = -1.0 + Math.sin(angle) * 0.3;
        this.setNodePosition(node.id, Number(x.toFixed(2)), Number(y.toFixed(2)), Number(z.toFixed(2)));
      });
    });

    this.nodeVisuals.updateAllLinks();
    sound.playSuccess();
  }

  /**
   * Apply Force-Directed Physics Simulation (30-step relaxation)
   */
  applyForceDirectedLayout() {
    const nodes = Array.from(this.graph.nodes.values());
    if (nodes.length < 2) return;

    const positions = new Map();
    const velocities = new Map();

    nodes.forEach(n => {
      positions.set(n.id, new THREE.Vector3(n.position.x, n.position.y, n.position.z));
      velocities.set(n.id, new THREE.Vector3(0, 0, 0));
    });

    const kRepel = 1.2;
    const kSpring = 1.8;
    const restLength = 1.2;
    const damping = 0.85;

    for (let step = 0; step < 40; step++) {
      // 1. Coulomb repulsion between all pairs
      for (let i = 0; i < nodes.length; i++) {
        const idA = nodes[i].id;
        const posA = positions.get(idA);
        for (let j = i + 1; j < nodes.length; j++) {
          const idB = nodes[j].id;
          const posB = positions.get(idB);

          const delta = new THREE.Vector3().subVectors(posA, posB);
          const dist = Math.max(delta.length(), 0.1);
          const force = (kRepel / (dist * dist));
          delta.normalize().multiplyScalar(force);

          velocities.get(idA).add(delta);
          velocities.get(idB).sub(delta);
        }
      }

      // 2. Hooke's spring attraction along links
      for (const link of this.graph.links) {
        const posA = positions.get(link.from);
        const posB = positions.get(link.to);
        if (!posA || !posB) continue;

        const delta = new THREE.Vector3().subVectors(posB, posA);
        const dist = delta.length();
        const displacement = dist - restLength;
        const force = displacement * kSpring;
        delta.normalize().multiplyScalar(force);

        velocities.get(link.from).add(delta);
        velocities.get(link.to).sub(delta);
      }

      // 3. Integrate positions
      nodes.forEach(n => {
        const vel = velocities.get(n.id);
        vel.multiplyScalar(damping);
        const pos = positions.get(n.id);
        pos.addScaledVector(vel, 0.05);

        // Clamp to comfortable VR bounding box
        pos.x = THREE.MathUtils.clamp(pos.x, -3.2, 3.2);
        pos.y = THREE.MathUtils.clamp(pos.y, 0.8, 2.3);
        pos.z = THREE.MathUtils.clamp(pos.z, -1.8, -0.6);
      });
    }

    // Apply calculated positions
    nodes.forEach(n => {
      const pos = positions.get(n.id);
      this.setNodePosition(n.id, Number(pos.x.toFixed(2)), Number(pos.y.toFixed(2)), Number(pos.z.toFixed(2)));
    });

    this.nodeVisuals.updateAllLinks();
    sound.playSuccess();
  }

  /**
   * Apply Left-to-Right Layered Flow Layout (Default)
   */
  applyLayeredLayout() {
    const nodes = Array.from(this.graph.nodes.values());
    if (nodes.length === 0) return;

    let root = nodes.find(n => n.type === 'internet') || nodes[0];
    const rootId = root.id;

    const depthMap = new Map();
    depthMap.set(rootId, 0);
    const queue = [rootId];

    while (queue.length > 0) {
      const curr = queue.shift();
      const d = depthMap.get(curr);
      for (const link of this.graph.links) {
        let nbr = null;
        if (link.from === curr) nbr = link.to;
        else if (link.to === curr) nbr = link.from;

        if (nbr && !depthMap.has(nbr)) {
          depthMap.set(nbr, d + 1);
          queue.push(nbr);
        }
      }
    }

    const layers = new Map();
    for (const n of nodes) {
      const d = depthMap.get(n.id) || 0;
      if (!layers.has(d)) layers.set(d, []);
      layers.get(d).push(n);
    }

    const totalLayers = Math.max(layers.size, 1);
    const xSpan = 5.2;

    layers.forEach((nodesInLayer, layerIndex) => {
      const layerX = -2.7 + (layerIndex / Math.max(totalLayers - 1, 1)) * xSpan;
      const count = nodesInLayer.length;
      const ySpacing = 0.52;
      const startY = 1.5 + ((count - 1) * ySpacing) / 2;

      nodesInLayer.forEach((node, nodeIndex) => {
        const y = startY - nodeIndex * ySpacing;
        this.setNodePosition(node.id, Number(layerX.toFixed(2)), Number(y.toFixed(2)), -1.0);
      });
    });

    this.nodeVisuals.updateAllLinks();
    sound.playSuccess();
  }

  setNodePosition(nodeId, x, y, z) {
    const node = this.graph.nodes.get(nodeId);
    if (node) {
      node.position = { x, y, z };
    }
    const mesh = this.nodeVisuals.nodeMeshes.get(nodeId);
    if (mesh) {
      mesh.position.set(x, y, z);
      mesh.userData.basePosition.set(x, y, z);
    }
  }
}
