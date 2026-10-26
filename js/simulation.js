/**
 * simulation.js - Packet Tracer, Multi-Protocol Flows, Ambient NOC Traffic & Failure Ripples
 *
 * Implements:
 * 1. Multi-protocol packet simulation (ICMP Ping, HTTP Request/Response, DNS, SQL)
 * 2. Bi-directional packet round-trips for request-response protocols
 * 3. Continuous Ambient Traffic mode (NOC simulation)
 * 4. Dynamic rerouting when links fail during active traces
 * 5. Failure simulation: spark burst, expanding ripple ring, and timed cascade
 * 6. Native Web Audio sound synchronization
 */

import * as THREE from 'three';
import { sound } from './audio.js';

export const PROTOCOLS = {
  icmp: { name: 'ICMP Ping', color: 0x38bdf8, speed: 2.8, roundTrip: true },
  tcp:  { name: 'TCP 3-Way Handshake', color: 0x10b981, speed: 2.5, roundTrip: true, isTcp: true },
  udp:  { name: 'UDP Datagram Stream', color: 0xf97316, speed: 3.8, roundTrip: false, isUdp: true },
  http: { name: 'HTTP Web',  color: 0x06b6d4, speed: 2.2, roundTrip: true },
  dns:  { name: 'DNS Query', color: 0xfacc15, speed: 3.0, roundTrip: true },
  sql:  { name: 'SQL Query', color: 0xa855f7, speed: 2.0, roundTrip: true }
};

const _v1 = new THREE.Vector3();

export class SimulationManager {
  /**
   * @param {THREE.Scene} scene
   * @param {import('./graph.js').Graph} graph
   * @param {import('./nodes.js').NodeVisualManager} nodeVisuals
   * @param {import('./menu.js').VRMenuManager} menuManager
   * @param {Function} [hapticsCallback]
   */
  constructor(scene, graph, nodeVisuals, menuManager, hapticsCallback = null) {
    this.scene = scene;
    this.graph = graph;
    this.nodeVisuals = nodeVisuals;
    this.menuManager = menuManager;
    this.triggerHaptics = hapticsCallback || (() => {});
    this.securityManager = null;
    this.explainerManager = null;

    // Packet Trace State
    this.traceState = 'idle'; // 'idle' | 'await_source' | 'await_dest' | 'tracing'
    this.traceSource = null;
    this.traceDest = null;
    this.currentPath = null;
    this.pathHopPoints = [];
    this.selectedProtocol = 'icmp';
    this.isReturning = false;

    // Packet Animation Loop
    this.packetTimer = 0;
    this.packetLoopInterval = 1.8;
    this.currentHopIndex = 0;
    this.hopProgress = 0;

    // Primary Packet Mesh
    this.packetGroup = new THREE.Group();
    this.packetGroup.name = 'packet-group';
    this.scene.add(this.packetGroup);

    const packetGeo = new THREE.SphereGeometry(0.048, 16, 16);
    this.packetMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0
    });
    this.packetMesh = new THREE.Mesh(packetGeo, this.packetMat);
    this.packetGroup.add(this.packetMesh);

    // Trail meshes (pooled smaller spheres)
    this.trailMeshes = [];
    for (let i = 0; i < 4; i++) {
      const trailMat = new THREE.MeshBasicMaterial({
        color: 0x00f3ff,
        transparent: true,
        opacity: 0
      });
      const trail = new THREE.Mesh(
        new THREE.SphereGeometry(0.032 - i * 0.006, 10, 10),
        trailMat
      );
      this.trailMeshes.push(trail);
      this.packetGroup.add(trail);
    }
    this.trailHistory = [];

    // Ambient Traffic Pool (for live NOC visualization)
    this.ambientTrafficEnabled = false;
    this.ambientTimer = 0;
    this.ambientPackets = [];
    this.initAmbientPacketPool();

    // Spark Particles Pool (for break event)
    this.sparkGroup = new THREE.Group();
    this.sparkGroup.name = 'spark-group';
    this.scene.add(this.sparkGroup);

    const sparkCount = 36;
    this.sparkGeometry = new THREE.BufferGeometry();
    this.sparkPositions = new Float32Array(sparkCount * 3);
    this.sparkVelocities = [];
    for (let i = 0; i < sparkCount; i++) {
      this.sparkVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 2.5,
          (Math.random() - 0.2) * 2.5,
          (Math.random() - 0.5) * 2.5
        )
      );
    }
    this.sparkGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.sparkPositions, 3)
    );

    this.sparkMaterial = new THREE.PointsMaterial({
      color: 0xff3b30,
      size: 0.045,
      transparent: true,
      opacity: 0
    });
    this.sparkPoints = new THREE.Points(this.sparkGeometry, this.sparkMaterial);
    this.sparkGroup.add(this.sparkPoints);
    this.sparksActive = false;
    this.sparksTime = 0;

    // Expanding Ripple Ring Mesh
    const ringGeo = new THREE.RingGeometry(0.08, 0.16, 32);
    ringGeo.rotateX(-Math.PI / 2);
    this.rippleRingMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    this.rippleRing = new THREE.Mesh(ringGeo, this.rippleRingMat);
    this.rippleRing.visible = false;
    this.scene.add(this.rippleRing);
    this.rippleActive = false;
    this.rippleTime = 0;

    this.rippleTimeouts = [];
  }

  setSecurityManager(securityManager) {
    this.securityManager = securityManager;
  }

  // ==========================================
  // AMBIENT NOC TRAFFIC SIMULATION
  // ==========================================
  initAmbientPacketPool() {
    this.ambientGroup = new THREE.Group();
    this.ambientGroup.name = 'ambient-traffic-group';
    this.scene.add(this.ambientGroup);

    for (let i = 0; i < 6; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), mat);
      this.ambientGroup.add(mesh);
      this.ambientPackets.push({
        mesh,
        mat,
        active: false,
        path: [],
        hopIndex: 0,
        progress: 0,
        speed: 1.8 + Math.random() * 0.8
      });
    }
  }

  setSecurityManager(sec) {
    this.securityManager = sec;
  }

  setExplainerManager(explainer) {
    this.explainerManager = explainer;
  }

  toggleAmbientTraffic() {
    this.ambientTrafficEnabled = !this.ambientTrafficEnabled;
    if (!this.ambientTrafficEnabled) {
      for (const p of this.ambientPackets) {
        p.active = false;
        p.mat.opacity = 0;
      }
      this.menuManager.setStatus('Ambient NOC traffic paused.', 'info');
    } else {
      this.menuManager.setStatus('🌊 Ambient NOC traffic active: live background flows simulated.', 'success');
      sound.playSuccess();
    }
    return this.ambientTrafficEnabled;
  }

  spawnAmbientPacket() {
    const nodes = Array.from(this.graph.nodes.keys());
    if (nodes.length < 2) return;

    // Pick random source and destination
    const src = nodes[Math.floor(Math.random() * nodes.length)];
    const dst = nodes[Math.floor(Math.random() * nodes.length)];
    if (src === dst) return;

    const path = this.graph.shortestPath(src, dst);
    if (!path || path.length < 2) return;

    const freePacket = this.ambientPackets.find(p => !p.active);
    if (!freePacket) return;

    freePacket.path = path.map(id => this.nodeVisuals.nodeMeshes.get(id)?.position.clone()).filter(Boolean);
    if (freePacket.path.length < 2) return;

    freePacket.active = true;
    freePacket.hopIndex = 0;
    freePacket.progress = 0;
    freePacket.mat.opacity = 0.75;
    freePacket.mat.color.setHex([0x38bdf8, 0x10b981, 0xa855f7][Math.floor(Math.random() * 3)]);
  }

  // ==========================================
  // PACKET TRACE FLOW & PROTOCOLS
  // ==========================================
  setProtocol(protocolKey) {
    if (PROTOCOLS[protocolKey]) {
      this.selectedProtocol = protocolKey;
      const proto = PROTOCOLS[protocolKey];
      this.packetMat.color.setHex(proto.color);
      this.menuManager.setStatus(`Protocol set to: [${proto.name}].`, 'info');
      sound.playClick();
    }
  }

  startTraceMode() {
    if (this.traceState === 'tracing' || this.traceState === 'await_source' || this.traceState === 'await_dest') {
      this.stopTrace();
      this.menuManager.setStatus('Trace mode cancelled.', 'info');
      sound.playClick();
      return;
    }

    this.traceState = 'await_source';
    this.traceSource = null;
    this.traceDest = null;
    this.currentPath = null;
    this.isReturning = false;
    const protoName = PROTOCOLS[this.selectedProtocol]?.name || 'Packet';
    this.menuManager.setStatus(`Trace ${protoName}: Select SOURCE node.`, 'warning');
    sound.playSelect();
    this.triggerHaptics(0.4, 80);
  }

  handleTraceNodeSelect(nodeId) {
    if (this.traceState === 'await_source') {
      this.traceSource = nodeId;
      const sourceNode = this.graph.nodes.get(nodeId);
      this.traceState = 'await_dest';
      this.menuManager.setStatus(`Source: [${sourceNode?.name || nodeId}]. Now select DESTINATION node.`, 'warning');
      sound.playSelect();
      this.triggerHaptics(0.6, 100);
      return true;
    }

    if (this.traceState === 'await_dest') {
      if (nodeId === this.traceSource) {
        this.menuManager.setStatus('Destination cannot be same as source. Select a different node.', 'warning');
        return true;
      }

      this.traceDest = nodeId;
      this.traceState = 'tracing';
      this.calculateAndRunTrace();
      this.triggerHaptics(0.8, 150);
      return true;
    }

    return false;
  }

  calculateAndRunTrace(isReroute = false) {
    if (!this.traceSource || !this.traceDest) return;

    const path = this.graph.shortestPath(this.traceSource, this.traceDest);
    this.currentPath = path;

    if (!path || path.length < 2) {
      this.packetMesh.material.opacity = 0;
      for (const t of this.trailMeshes) t.material.opacity = 0;

      const srcName = this.graph.nodes.get(this.traceSource)?.name || this.traceSource;
      const dstName = this.graph.nodes.get(this.traceDest)?.name || this.traceDest;
      this.menuManager.setStatus(`NO ROUTE: ${srcName} cannot reach ${dstName} (Destination Unreachable)`, 'danger');
      sound.playAlarm();

      this.nodeVisuals.setNodeVisualStatus(this.traceSource, 'down');
      setTimeout(() => {
        const srcNode = this.graph.nodes.get(this.traceSource);
        if (srcNode && srcNode.status === 'up') {
          this.nodeVisuals.setNodeVisualStatus(this.traceSource, 'up');
        }
      }, 700);

      this.triggerHaptics(1.0, 300);
      return;
    }

    this.pathHopPoints = [];
    const pathNames = [];
    for (const id of path) {
      const nodeMesh = this.nodeVisuals.nodeMeshes.get(id);
      const nodeData = this.graph.nodes.get(id);
      if (nodeMesh) {
        this.pathHopPoints.push(nodeMesh.position.clone());
      }
      pathNames.push(nodeData?.name || id);
    }

    const proto = PROTOCOLS[this.selectedProtocol] || PROTOCOLS.icmp;
    this.packetMat.color.setHex(proto.color);

    const pathString = pathNames.join(' → ');
    const prefix = isReroute ? '⚡ REROUTED VIA: ' : `✔ [${proto.name}] ROUTE: `;
    this.menuManager.setStatus(`${prefix}${pathString}`, 'success');
    sound.playSuccess();

    this.currentHopIndex = 0;
    this.hopProgress = 0;
    this.packetTimer = 0;
    this.isReturning = false;
    this.packetMesh.material.opacity = 1.0;
    for (const t of this.trailMeshes) t.material.opacity = 0.7;
    this.trailHistory = [];
  }

  stopTrace() {
    this.traceState = 'idle';
    this.traceSource = null;
    this.traceDest = null;
    this.currentPath = null;
    this.pathHopPoints = [];
    this.packetMesh.material.opacity = 0;
    for (const t of this.trailMeshes) t.material.opacity = 0;
  }

  // ==========================================
  // FAILURE SIMULATION & RIPPLE
  // ==========================================
  breakSelected(selectedTarget) {
    if (!selectedTarget) {
      this.menuManager.setStatus('Select a node or link first, then press Break Selected.', 'warning');
      return;
    }

    if (selectedTarget.userData.isNode) {
      this.toggleNodeBreak(selectedTarget.userData.nodeId, selectedTarget);
    } else if (selectedTarget.userData.isLink) {
      this.toggleLinkBreak(selectedTarget.userData.linkId, selectedTarget);
    }
  }

  toggleNodeBreak(nodeId, nodeGroup) {
    const node = this.graph.nodes.get(nodeId);
    if (!node) return;

    const willBreak = (node.status === 'up');
    const newStatus = willBreak ? 'down' : 'up';
    this.graph.setNodeStatus(nodeId, newStatus);
    this.nodeVisuals.setNodeVisualStatus(nodeId, newStatus);

    nodeGroup.getWorldPosition(_v1);

    if (willBreak) {
      for (const link of this.graph.links) {
        if (link.from === nodeId || link.to === nodeId) {
          this.graph.setLinkStatus(link.id, 'down');
          this.nodeVisuals.setLinkVisualStatus(link.id, 'down');
        }
      }

      this.triggerSparks(_v1);
      sound.playSpark();
      this.triggerHaptics(1.0, 350);
      this.triggerRipple(_v1, 0xef4444);
      this.runFailureRipple(nodeId, node.name, true);
    } else {
      for (const link of this.graph.links) {
        if (link.from === nodeId || link.to === nodeId) {
          const otherId = (link.from === nodeId) ? link.to : link.from;
          const otherNode = this.graph.nodes.get(otherId);
          if (otherNode && otherNode.status === 'up') {
            this.graph.setLinkStatus(link.id, 'up');
            this.nodeVisuals.setLinkVisualStatus(link.id, 'up');
          }
        }
      }

      this.triggerRipple(_v1, 0x10b981);
      sound.playSuccess();
      this.triggerHaptics(0.6, 120);
      this.runFailureRipple(nodeId, node.name, false);
    }

    if (this.traceState === 'tracing') {
      this.calculateAndRunTrace(true);
    }
  }

  toggleLinkBreak(linkId, linkGroup) {
    const link = this.graph.links.find(l => l.id === linkId);
    if (!link) return;

    const willBreak = (link.status === 'up');
    const newStatus = willBreak ? 'down' : 'up';
    this.graph.setLinkStatus(linkId, newStatus);
    this.nodeVisuals.setLinkVisualStatus(linkId, newStatus);

    linkGroup.getWorldPosition(_v1);

    if (willBreak) {
      this.triggerSparks(_v1);
      sound.playSpark();
      this.triggerRipple(_v1, 0xef4444);
      this.triggerHaptics(0.9, 250);
      this.runFailureRipple(link.from, `Link ${link.from}-${link.to}`, true);
    } else {
      this.triggerRipple(_v1, 0x10b981);
      sound.playSuccess();
      this.triggerHaptics(0.5, 100);
      this.runFailureRipple(link.from, `Link ${link.from}-${link.to}`, false);
    }

    if (this.traceState === 'tracing') {
      this.calculateAndRunTrace(true);
    }
  }

  runFailureRipple(originId, sourceName, isFailure) {
    for (const t of this.rippleTimeouts) clearTimeout(t);
    this.rippleTimeouts = [];

    let internetId = 'inet';
    for (const [id, node] of this.graph.nodes.entries()) {
      if (node.type === 'internet') {
        internetId = id;
        break;
      }
    }

    const reachable = this.graph.getReachableFrom(internetId);
    const distances = this.computeHopDistances(originId);

    const disconnectedNodes = [];
    for (const [id, node] of this.graph.nodes.entries()) {
      if (!reachable.has(id) && id !== internetId) {
        disconnectedNodes.push({
          id,
          name: node.name,
          distance: distances.get(id) ?? 99
        });
      }
    }

    disconnectedNodes.sort((a, b) => a.distance - b.distance);

    if (isFailure) {
      if (disconnectedNodes.length > 0) {
        sound.playAlarm();
        this.menuManager.setStatus(
          `FAILURE: ${sourceName} DOWN. Cascading impact: ${disconnectedNodes.length} nodes lost Internet.`,
          'danger'
        );

        disconnectedNodes.forEach((item, idx) => {
          const delay = (item.distance || (idx + 1)) * 250;
          const tid = setTimeout(() => {
            this.nodeVisuals.setNodeVisualStatus(item.id, 'down');
            sound.playSpark();
            this.triggerHaptics(0.3, 40);
          }, delay);
          this.rippleTimeouts.push(tid);
        });
      } else {
        this.menuManager.setStatus(
          `NOTICE: ${sourceName} DOWN, but redundant paths maintained 100% connectivity!`,
          'warning'
        );
      }
    } else {
      this.menuManager.setStatus(
        `RECOVERY: ${sourceName} restored. Network connectivity healthy.`,
        'success'
      );

      for (const [id, node] of this.graph.nodes.entries()) {
        if (reachable.has(id) && node.status === 'up') {
          const dist = distances.get(id) ?? 1;
          const tid = setTimeout(() => {
            this.nodeVisuals.setNodeVisualStatus(id, 'up');
          }, dist * 200);
          this.rippleTimeouts.push(tid);
        }
      }
    }
  }

  computeHopDistances(startId) {
    const dist = new Map();
    dist.set(startId, 0);
    const queue = [startId];

    while (queue.length > 0) {
      const curr = queue.shift();
      const d = dist.get(curr);
      for (const link of this.graph.links) {
        let neighbor = null;
        if (link.from === curr) neighbor = link.to;
        else if (link.to === curr) neighbor = link.from;

        if (neighbor && !dist.has(neighbor)) {
          dist.set(neighbor, d + 1);
          queue.push(neighbor);
        }
      }
    }
    return dist;
  }

  triggerSparks(position) {
    this.sparkGroup.position.copy(position);
    for (let i = 0; i < this.sparkVelocities.length; i++) {
      this.sparkPositions[i * 3 + 0] = 0;
      this.sparkPositions[i * 3 + 1] = 0;
      this.sparkPositions[i * 3 + 2] = 0;
      this.sparkVelocities[i].set(
        (Math.random() - 0.5) * 2.8,
        (Math.random() - 0.1) * 2.5,
        (Math.random() - 0.5) * 2.8
      );
    }
    this.sparkGeometry.attributes.position.needsUpdate = true;
    this.sparkMaterial.opacity = 1.0;
    this.sparksTime = 0;
    this.sparksActive = true;
  }

  triggerRipple(position, colorHex) {
    this.rippleRing.position.copy(position);
    this.rippleRing.position.y -= 0.1;
    this.rippleRing.scale.set(1, 1, 1);
    this.rippleRingMat.color.setHex(colorHex);
    this.rippleRingMat.opacity = 0.9;
    this.rippleRing.visible = true;
    this.rippleTime = 0;
    this.rippleActive = true;
  }

  resetAll() {
    for (const t of this.rippleTimeouts) clearTimeout(t);
    this.rippleTimeouts = [];

    this.stopTrace();
    this.graph.reset();

    for (const [id, node] of this.graph.nodes.entries()) {
      this.nodeVisuals.setNodeVisualStatus(id, 'up');
    }
    for (const link of this.graph.links) {
      this.nodeVisuals.setLinkVisualStatus(link.id, 'up');
    }

    this.sparksActive = false;
    this.sparkMaterial.opacity = 0;
    this.rippleActive = false;
    this.rippleRing.visible = false;

    this.menuManager.setStatus('Network reset. All links and nodes operational.', 'success');
    sound.playSuccess();
    this.triggerHaptics(0.5, 100);
  }

  // ==========================================
  // PER-FRAME UPDATE LOOP
  // ==========================================
  update(delta, elapsed) {
    // 1. Trace packet animation
    if (this.traceState === 'tracing' && this.pathHopPoints.length >= 2) {
      this.updatePacketAnimation(delta);
    }

    // 2. Ambient traffic animation
    if (this.ambientTrafficEnabled) {
      this.ambientTimer += delta;
      if (this.ambientTimer >= 0.8) {
        this.ambientTimer = 0;
        this.spawnAmbientPacket();
      }
      this.updateAmbientPackets(delta);
    }

    // 3. Sparks animation
    if (this.sparksActive) {
      this.sparksTime += delta;
      if (this.sparksTime >= 0.6) {
        this.sparksActive = false;
        this.sparkMaterial.opacity = 0;
      } else {
        const factor = 1.0 - (this.sparksTime / 0.6);
        this.sparkMaterial.opacity = factor;
        const count = this.sparkVelocities.length;
        for (let i = 0; i < count; i++) {
          this.sparkPositions[i * 3 + 0] += this.sparkVelocities[i].x * delta;
          this.sparkPositions[i * 3 + 1] += (this.sparkVelocities[i].y - 2.0 * this.sparksTime) * delta;
          this.sparkPositions[i * 3 + 2] += this.sparkVelocities[i].z * delta;
        }
        this.sparkGeometry.attributes.position.needsUpdate = true;
      }
    }

    // 4. Expanding ripple ring
    if (this.rippleActive) {
      this.rippleTime += delta;
      if (this.rippleTime >= 1.2) {
        this.rippleActive = false;
        this.rippleRing.visible = false;
      } else {
        const progress = this.rippleTime / 1.2;
        const scale = 1.0 + progress * 24.0;
        this.rippleRing.scale.set(scale, scale, 1);
        this.rippleRingMat.opacity = (1.0 - progress) * 0.85;
      }
    }
  }

  updatePacketAnimation(delta) {
    const totalHops = this.pathHopPoints.length - 1;
    if (totalHops < 1) return;

    const proto = PROTOCOLS[this.selectedProtocol] || PROTOCOLS.icmp;
    const speed = proto.speed;

    if (this.currentHopIndex < totalHops) {
      // Determine points based on forward or return trip
      const pA = this.isReturning
        ? this.pathHopPoints[totalHops - this.currentHopIndex]
        : this.pathHopPoints[this.currentHopIndex];
      const pB = this.isReturning
        ? this.pathHopPoints[totalHops - this.currentHopIndex - 1]
        : this.pathHopPoints[this.currentHopIndex + 1];

      const hopDist = pA.distanceTo(pB);
      this.hopProgress += (delta * speed) / Math.max(hopDist, 0.1);

      if (this.hopProgress >= 1.0) {
        this.currentHopIndex++;
        this.hopProgress = 0;
        sound.playHop();

        // Node arrival pulse
        const targetIdx = this.isReturning
          ? (totalHops - this.currentHopIndex)
          : this.currentHopIndex;
        const reachedId = this.currentPath[targetIdx];
        const reachedMesh = this.nodeVisuals.nodeMeshes.get(reachedId);
        if (reachedMesh && reachedMesh.userData.material) {
          const origEmissive = reachedMesh.userData.material.emissive.getHex();
          reachedMesh.userData.material.emissive.setHex(proto.color);
          setTimeout(() => {
            if (reachedMesh.userData.material) {
              reachedMesh.userData.material.emissive.setHex(origEmissive);
            }
          }, 180);
        }

        // Live Real-Time Hop Narration for Beginners
        if (this.explainerManager) {
          const prevIdx = this.isReturning
            ? (totalHops - this.currentHopIndex + 1)
            : (this.currentHopIndex - 1);
          const prevNodeId = this.currentPath[prevIdx];
          const prevNode = this.graph.nodes.get(prevNodeId);
          const reachedNode = this.graph.nodes.get(reachedId);
          const link = this.graph.findLink(prevNodeId, reachedId);
          this.explainerManager.narrateHop({
            sourceNode: this.graph.nodes.get(this.traceSource),
            destNode: this.graph.nodes.get(this.traceDest),
            currentNode: prevNode,
            nextNode: reachedNode,
            hopIndex: this.currentHopIndex,
            totalHops: totalHops,
            protocol: proto.name,
            link: link,
            isReturning: this.isReturning
          });
        }

        // Wireshark Sniffer log
        if (this.securityManager) {
          const srcNode = this.graph.nodes.get(this.traceSource);
          const dstNode = this.graph.nodes.get(this.traceDest);
          let protoTag = (proto.name || 'TCP').toUpperCase();
          let infoText = `Hop ${this.currentHopIndex}/${totalHops} via [${reachedId}] -> in transit`;

          if (proto.isTcp) {
            protoTag = 'TCP';
            infoText = this.isReturning
              ? `[SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0 (Step 2: Server SYN-ACK Handshake Reply via ${reachedId})`
              : (this.currentHopIndex === 1
                  ? `[SYN] Seq=0 Win=65535 Len=0 MSS=1460 (Step 1: Client SYN Initiator via ${reachedId})`
                  : `[ACK, PSH] Seq=1 Ack=1 Win=65535 Len=1460 (Step 3: Established Data Transfer via ${reachedId})`);
          } else if (proto.isUdp) {
            protoTag = 'UDP';
            infoText = `SrcPort: 5353 → DstPort: 53 Len: 64B (Connectionless Datagram Stream via ${reachedId}, No Handshake)`;
          }

          this.securityManager.logPacket({
            sourceIp: this.isReturning ? (dstNode?.ip || '10.0.0.1') : (srcNode?.ip || '10.0.0.1'),
            destIp: this.isReturning ? (srcNode?.ip || '10.0.0.1') : (dstNode?.ip || '10.0.0.1'),
            protocol: protoTag,
            length: this.isReturning ? '1024 B' : (proto.isUdp ? '64 B' : '128 B'),
            info: infoText
          });
        }
      } else {
        this.packetMesh.position.lerpVectors(pA, pB, this.hopProgress);

        this.trailHistory.unshift(this.packetMesh.position.clone());
        if (this.trailHistory.length > 20) this.trailHistory.pop();

        for (let i = 0; i < this.trailMeshes.length; i++) {
          const trailMesh = this.trailMeshes[i];
          const histIdx = (i + 1) * 3;
          if (this.trailHistory[histIdx]) {
            trailMesh.position.copy(this.trailHistory[histIdx]);
            trailMesh.material.opacity = (1 - (i + 1) / (this.trailMeshes.length + 1)) * 0.7;
          }
        }
      }
    } else {
      // Completed one direction
      if (proto.roundTrip && !this.isReturning) {
        // Start return trip (e.g. response payload back to client)
        this.isReturning = true;
        this.currentHopIndex = 0;
        this.hopProgress = 0;
        sound.playSuccess();
        this.trailHistory = [];
      } else {
        // Finished full cycle
        this.packetMesh.material.opacity = 0;
        for (const t of this.trailMeshes) t.material.opacity = 0;
        this.packetTimer += delta;

        if (this.packetTimer >= this.packetLoopInterval) {
          this.packetTimer = 0;
          this.currentHopIndex = 0;
          this.hopProgress = 0;
          this.isReturning = false;
          this.packetMesh.material.opacity = 1.0;
          this.trailHistory = [];
        }
      }
    }
  }

  updateAmbientPackets(delta) {
    for (const p of this.ambientPackets) {
      if (!p.active || p.path.length < 2) continue;

      const totalHops = p.path.length - 1;
      if (p.hopIndex < totalHops) {
        const pA = p.path[p.hopIndex];
        const pB = p.path[p.hopIndex + 1];
        const dist = pA.distanceTo(pB);
        p.progress += (delta * p.speed) / Math.max(dist, 0.1);

        if (p.progress >= 1.0) {
          p.hopIndex++;
          p.progress = 0;
        } else {
          p.mesh.position.lerpVectors(pA, pB, p.progress);
        }
      } else {
        p.active = false;
        p.mat.opacity = 0;
      }
    }
  }

  dispose() {
    for (const t of this.rippleTimeouts) clearTimeout(t);
    this.sparkGeometry.dispose();
    this.sparkMaterial.dispose();
    this.rippleRingMat.dispose();
    this.packetMesh.geometry.dispose();
    this.packetMesh.material.dispose();
  }
}
