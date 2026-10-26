/**
 * tour.js - Interactive Guided Training Tour for New Joinees
 *
 * Implements a step-by-step interactive 3D onboarding tour explaining
 * enterprise networking principles (Perimeter security, Layer 3 routing,
 * Layer 2 switching, Spanning Tree redundancy, and Client-Server architecture).
 */

import * as THREE from 'three';
import { sound } from './audio.js';

export const TOUR_STEPS = [
  {
    step: 1,
    title: '1. The Perimeter & Security Edge',
    highlightIds: ['inet', 'fw1'],
    content: 'Welcome to the network! All outside traffic enters from the Global Internet (198.51.100.1). The Edge Firewall inspects incoming packets, performs NAT (Network Address Translation), and blocks malicious probes before traffic touches internal servers.',
    concept: 'Key Concept: Ingress filtering, stateful packet inspection & edge DMZ.'
  },
  {
    step: 2,
    title: '2. Layer 3 Core Routing',
    highlightIds: ['r_core'],
    content: 'The Core Router acts as the central brain and default gateway (10.0.0.1). It reads IP destination headers and decides which subnet path offers the fastest hop, routing traffic between data center servers and office workstations.',
    concept: 'Key Concept: Layer 3 forwarding, routing tables & inter-VLAN gateways.'
  },
  {
    step: 3,
    title: '3. Layer 2 Switching & VLANs',
    highlightIds: ['sw1', 'sw2'],
    content: 'Distribution Switches forward frames at wire speed using MAC addresses. Switch 1 isolates the Data Center Server farm (VLAN 10), while Switch 2 manages Office Workstations (VLAN 20), isolating broadcast storms.',
    concept: 'Key Concept: Collision domain separation, MAC tables & VLAN tagging.'
  },
  {
    step: 4,
    title: '4. High Availability & STP Redundancy',
    highlightIds: ['sw1', 'sw2', 'r_core'],
    content: 'Notice the diagonal backup link between Switch 2 and Switch 1! Enterprise networks avoid single points of failure. If the direct link to the Core Router fails, Spanning Tree allows traffic to seamlessly reroute across Switch 1.',
    concept: 'Key Concept: High availability (HA), Spanning Tree Protocol (STP) & zero-downtime failover.'
  },
  {
    step: 5,
    title: '5. Servers, Workstations & Clients',
    highlightIds: ['srv1', 'srv2', 'pc1', 'pc2'],
    content: 'Endpoints live on the edges. Servers run enterprise databases and web services. Workstations initiate connections using DNS and TCP handshakes to securely query application data.',
    concept: 'Key Concept: Client-Server architecture, ephemeral ports & payload delivery.'
  },
  {
    step: 6,
    title: '6. Hands-On Challenge for New Joinees!',
    highlightIds: ['pc1', 'inet'],
    content: 'Now test what you learned! Click "Trace Packet" and select Workstation 1 -> Internet. While packets are flowing, select the Core Router link and click "Break Selected" to witness live automated failover in action!',
    concept: 'Mission: Observe dynamic rerouting and cascading ripple recovery!'
  }
];

export class JoineeTourManager {
  /**
   * @param {THREE.Scene} scene
   * @param {import('./nodes.js').NodeVisualManager} nodeVisuals
   * @param {import('./menu.js').VRMenuManager} menuManager
   * @param {THREE.Camera} camera
   */
  constructor(scene, nodeVisuals, menuManager, camera) {
    this.scene = scene;
    this.nodeVisuals = nodeVisuals;
    this.menuManager = menuManager;
    this.camera = camera;

    this.active = false;
    this.currentStepIndex = 0;

    this.buildTourBillboard();
  }

  buildTourBillboard() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1100;
    this.canvas.height = 680;
    this.ctx = this.canvas.getContext('2d');

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;

    const geo = new THREE.PlaneGeometry(1.1, 0.68);
    const mat = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: true
    });

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.name = 'joinee-tour-billboard';
    this.mesh.position.set(0, 1.55, 0.45);
    this.mesh.visible = false;
    this.scene.add(this.mesh);
  }

  startTour() {
    this.active = true;
    this.currentStepIndex = 0;
    this.mesh.visible = true;
    this.renderCurrentStep();
    sound.playSuccess();
    this.menuManager.setStatus('🎓 New Joinee Training Tour started. Step through each concept.', 'warning');

    // Also update desktop tour overlay if present
    this.updateDesktopOverlay();
  }

  nextStep() {
    if (this.currentStepIndex < TOUR_STEPS.length - 1) {
      this.currentStepIndex++;
      this.renderCurrentStep();
      sound.playHop();
      this.updateDesktopOverlay();
    } else {
      this.endTour();
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.renderCurrentStep();
      sound.playClick();
      this.updateDesktopOverlay();
    }
  }

  endTour() {
    this.active = false;
    this.mesh.visible = false;
    this.clearHighlights();
    this.menuManager.setStatus('🎓 Training tour completed! Feel free to build and explore.', 'success');
    sound.playSuccess();

    const deskOverlay = document.getElementById('tour-desktop-card');
    if (deskOverlay) deskOverlay.classList.add('hidden');
  }

  renderCurrentStep() {
    const step = TOUR_STEPS[this.currentStepIndex];
    if (!step) return;

    // Highlight target nodes
    this.clearHighlights();
    for (const id of step.highlightIds) {
      const nodeMesh = this.nodeVisuals.nodeMeshes.get(id);
      if (nodeMesh && nodeMesh.userData.halo) {
        nodeMesh.userData.halo.material.opacity = 1.0;
        nodeMesh.userData.material.emissive.setHex(0x00f3ff);
      }
    }

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Dark cyber card background
    ctx.fillStyle = 'rgba(11, 15, 26, 0.96)';
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 6;
    this.menuManager.drawRoundedRect(ctx, 16, 16, w - 32, h - 32, 28, true, true);

    // Tour Header Badge
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 3;
    this.menuManager.drawRoundedRect(ctx, 40, 36, 320, 46, 12, true, true);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`NEW JOINEE ONBOARDING (${this.currentStepIndex + 1}/${TOUR_STEPS.length})`, 200, 68);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(step.title, 40, 135);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 155);
    ctx.lineTo(w - 40, 155);
    ctx.stroke();

    // Body Text with auto word wrapping
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '28px "Segoe UI", Roboto, sans-serif';
    this.wrapText(ctx, step.content, 40, 205, w - 80, 42);

    // Key Concept Box
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    this.menuManager.drawRoundedRect(ctx, 40, 450, w - 80, 80, 16, true, true);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 24px "Segoe UI", Roboto, sans-serif';
    ctx.fillText(step.concept, 60, 498);

    // Navigation Hint
    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `[ Step ${this.currentStepIndex + 1} of ${TOUR_STEPS.length} ] • Click Next on screen or Wrist Menu to proceed`,
      w / 2,
      590
    );

    this.texture.needsUpdate = true;
  }

  clearHighlights() {
    for (const nodeMesh of this.nodeVisuals.nodeMeshes.values()) {
      if (!nodeMesh.userData.isSelected) {
        nodeMesh.userData.halo.material.opacity = 0;
        nodeMesh.userData.material.emissive.setHex(0x111122);
      }
    }
  }

  updateDesktopOverlay() {
    const deskOverlay = document.getElementById('tour-desktop-card');
    const titleEl = document.getElementById('tour-step-title');
    const contentEl = document.getElementById('tour-step-content');
    const conceptEl = document.getElementById('tour-step-concept');
    const progressEl = document.getElementById('tour-step-progress');

    if (!deskOverlay) return;

    if (this.active) {
      deskOverlay.classList.remove('hidden');
      const step = TOUR_STEPS[this.currentStepIndex];
      if (titleEl) titleEl.textContent = step.title;
      if (contentEl) contentEl.textContent = step.content;
      if (conceptEl) conceptEl.textContent = step.concept;
      if (progressEl) progressEl.textContent = `Step ${this.currentStepIndex + 1} of ${TOUR_STEPS.length}`;
    } else {
      deskOverlay.classList.add('hidden');
    }
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  update() {
    if (this.mesh.visible && this.camera) {
      this.mesh.quaternion.copy(this.camera.quaternion);
    }
  }
}
