/**
 * security.js - Cyber Security Attack & Defense Simulator & Wireshark-Lite Packet Sniffer
 *
 * Implements:
 * 1. SYN Flood / DDoS attack simulation with visual packet flooding and target overload
 * 2. WAF / DDoS Mitigation with packet deflection shield particle effects
 * 3. Real-time Wireshark-style Packet Sniffer event stream (TCP, UDP, ICMP, DNS, HTTP, TLS)
 * 4. Audio-synced alarms and mitigation chimes
 */

import * as THREE from 'three';
import { sound } from './audio.js';

export class SecurityManager {
  /**
   * @param {THREE.Scene} scene
   * @param {import('./graph.js').Graph} graph
   * @param {import('./nodes.js').NodeVisualManager} nodeVisuals
   * @param {import('./menu.js').VRMenuManager} menuManager
   */
  constructor(scene, graph, nodeVisuals, menuManager) {
    this.scene = scene;
    this.graph = graph;
    this.nodeVisuals = nodeVisuals;
    this.menuManager = menuManager;

    // DDoS State
    this.attackActive = false;
    this.mitigationActive = false;
    this.attackTargetId = null;
    this.attackPath = [];
    this.attackTimer = 0;
    this.overloadLevel = 0; // 0 to 100%

    // Pooled DDoS Attack Packets
    this.attackPool = [];
    this.attackGroup = new THREE.Group();
    this.attackGroup.name = 'ddos-attack-group';
    this.scene.add(this.attackGroup);

    for (let i = 0; i < 24; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xff3b30,
        transparent: true,
        opacity: 0
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), mat);
      this.attackGroup.add(mesh);
      this.attackPool.push({
        mesh,
        mat,
        active: false,
        hopIndex: 0,
        progress: 0,
        speed: 3.5 + Math.random() * 2.0
      });
    }

    // Packet Sniffer (Wireshark-lite) log buffer
    this.packetLog = [];
    this.maxLogEntries = 100;
  }

  /**
   * Launch DDoS / SYN Flood Attack on target node (default: first server found)
   * @param {string} [targetId]
   */
  launchDDoSAttack(targetId = null) {
    if (this.attackActive) {
      this.stopAttack();
      return;
    }

    // Find internet node
    let internetId = 'inet';
    for (const [id, node] of this.graph.nodes.entries()) {
      if (node.type === 'internet' || node.type === 'cloud') {
        internetId = id;
        break;
      }
    }

    // Find target server
    if (!targetId) {
      for (const [id, node] of this.graph.nodes.entries()) {
        if (node.type === 'server' || node.type === 'database' || node.type === 'loadbalancer') {
          targetId = id;
          break;
        }
      }
    }
    if (!targetId) targetId = Array.from(this.graph.nodes.keys())[0];

    const path = this.graph.shortestPath(internetId, targetId);
    if (!path || path.length < 2) {
      this.menuManager.setStatus('DDoS Failed: No route from Internet to target server.', 'danger');
      return;
    }

    this.attackActive = true;
    this.mitigationActive = false;
    this.attackTargetId = targetId;
    this.attackPath = path.map(id => this.nodeVisuals.nodeMeshes.get(id)?.position.clone()).filter(Boolean);
    this.overloadLevel = 0;

    const targetNode = this.graph.nodes.get(targetId);
    this.menuManager.setStatus(`🚨 CYBER ATTACK: SYN Flood DDoS targeting [${targetNode?.name}]!`, 'danger');
    sound.playAlarm();

    // Log Wireshark alerts
    this.logPacket({
      sourceIp: '198.51.100.244',
      destIp: targetNode?.ip || '10.0.10.11',
      protocol: 'TCP SYN',
      length: '64 B',
      info: `[SYN FLOOD] High-rate SYN packet blast to port 443 (Seq=0)`
    });

    const attackBtn = document.getElementById('btn-ddos');
    if (attackBtn) attackBtn.classList.add('active');
  }

  /**
   * Toggle WAF / DDoS Mitigation Defense
   */
  toggleMitigation() {
    this.mitigationActive = !this.mitigationActive;
    if (this.mitigationActive) {
      this.menuManager.setStatus('🛡️ WAF MITIGATION ACTIVE: Rate-limiting & dropping malicious botnet traffic at Edge Firewall.', 'success');
      sound.playSuccess();
      for (const p of this.attackPool) {
        p.mat.color.setHex(0x10b981); // Green mitigated packets
      }
      this.logPacket({
        sourceIp: '192.168.1.1 (WAF)',
        destIp: '198.51.100.0/24',
        protocol: 'TCP RST',
        length: '54 B',
        info: `[WAF SHIELD] Dropping 25,000 req/sec from untrusted geo-IPs`
      });
    } else {
      this.menuManager.setStatus('WAF Mitigation disabled.', 'warning');
      for (const p of this.attackPool) {
        p.mat.color.setHex(0xff3b30);
      }
    }

    const mitBtn = document.getElementById('btn-mitigate');
    if (mitBtn) mitBtn.classList.toggle('active', this.mitigationActive);
    return this.mitigationActive;
  }

  stopAttack() {
    this.attackActive = false;
    this.mitigationActive = false;
    for (const p of this.attackPool) {
      p.active = false;
      p.mat.opacity = 0;
    }

    if (this.attackTargetId) {
      const targetNode = this.graph.nodes.get(this.attackTargetId);
      if (targetNode && targetNode.status === 'up') {
        this.nodeVisuals.setNodeVisualStatus(this.attackTargetId, 'up');
      }
    }
    this.attackTargetId = null;
    this.overloadLevel = 0;

    this.menuManager.setStatus('DDoS attack stopped. Network traffic returned to normal.', 'info');
    const attackBtn = document.getElementById('btn-ddos');
    const mitBtn = document.getElementById('btn-mitigate');
    if (attackBtn) attackBtn.classList.remove('active');
    if (mitBtn) mitBtn.classList.remove('active');
  }

  spawnAttackPacket() {
    if (!this.attackPath || this.attackPath.length < 2) return;

    const freePacket = this.attackPool.find(p => !p.active);
    if (!freePacket) return;

    freePacket.active = true;
    freePacket.hopIndex = 0;
    freePacket.progress = 0;
    freePacket.mat.opacity = 0.9;
    freePacket.mat.color.setHex(this.mitigationActive ? 0x10b981 : 0xff3b30);
  }

  update(delta) {
    if (!this.attackActive) return;

    this.attackTimer += delta;
    if (this.attackTimer >= 0.1) {
      this.attackTimer = 0;
      this.spawnAttackPacket();
    }

    const totalHops = this.attackPath.length - 1;

    for (const p of this.attackPool) {
      if (!p.active) continue;

      // If mitigation active, packets get deflected/dropped at hop 1 (Firewall)
      const maxHops = this.mitigationActive ? 1 : totalHops;

      if (p.hopIndex < maxHops) {
        const pA = this.attackPath[p.hopIndex];
        const pB = this.attackPath[p.hopIndex + 1];
        const dist = pA.distanceTo(pB);
        p.progress += (delta * p.speed) / Math.max(dist, 0.1);

        if (p.progress >= 1.0) {
          p.hopIndex++;
          p.progress = 0;
          if (this.mitigationActive && p.hopIndex >= 1) {
            // Dropped at firewall!
            p.active = false;
            p.mat.opacity = 0;
          }
        } else {
          p.mesh.position.lerpVectors(pA, pB, p.progress);
        }
      } else {
        p.active = false;
        p.mat.opacity = 0;

        // Packet reached target: increase overload
        if (!this.mitigationActive && this.attackTargetId) {
          this.overloadLevel = Math.min(this.overloadLevel + 1.2, 100);
          if (this.overloadLevel >= 80) {
            // Target overheats and drops!
            this.nodeVisuals.setNodeVisualStatus(this.attackTargetId, 'down');
            this.menuManager.setStatus(`🔥 CRITICAL: Server crashed under DDoS overload (100% CPU / Queue Full)! Click 'WAF Shield' to mitigate.`, 'danger');
          }
        }
      }
    }

    // If mitigated, target recovers
    if (this.mitigationActive && this.overloadLevel > 0) {
      this.overloadLevel = Math.max(this.overloadLevel - delta * 25, 0);
      if (this.overloadLevel < 50 && this.attackTargetId) {
        this.nodeVisuals.setNodeVisualStatus(this.attackTargetId, 'up');
      }
    }
  }

  // ==========================================
  // WIRESHARK PACKET SNIFFER
  // ==========================================
  /**
   * Log a packet event to the circular buffer and update UI
   */
  logPacket({ sourceIp, destIp, protocol, length, info }) {
    const time = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100);
    const entry = {
      no: this.packetLog.length + 1,
      time,
      sourceIp: sourceIp || '10.0.0.1',
      destIp: destIp || '198.51.100.1',
      protocol: protocol || 'TCP',
      length: length || '128 B',
      info: info || 'Standard packet payload transfer'
    };

    this.packetLog.unshift(entry);
    if (this.packetLog.length > this.maxLogEntries) {
      this.packetLog.pop();
    }

    // Mirror to Wireshark DOM table if drawer is open
    this.updateWiresharkDOM(entry);
  }

  updateWiresharkDOM(newEntry) {
    const tbody = document.getElementById('wireshark-table-body');
    if (!tbody) return;

    const tr = document.createElement('tr');
    tr.className = `proto-row-${newEntry.protocol.toLowerCase().replace(/[^a-z]/g, '')}`;
    tr.innerHTML = `
      <td>${newEntry.no}</td>
      <td>${newEntry.time}</td>
      <td><code>${newEntry.sourceIp}</code></td>
      <td><code>${newEntry.destIp}</code></td>
      <td><span class="badge-proto">${newEntry.protocol}</span></td>
      <td>${newEntry.length}</td>
      <td>${newEntry.info}</td>
    `;

    tbody.insertBefore(tr, tbody.firstChild);
    while (tbody.children.length > 50) {
      tbody.removeChild(tbody.lastChild);
    }
  }
}
