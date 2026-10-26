/**
 * menu.js - VR Floating Menu, Node Info Panel & Network Status Bar
 *
 * Implements high-resolution CanvasTexture UI panels:
 * 1. Left-controller wrist menu with interactive UV hit-tested buttons
 * 2. Node/link floating detail Info Panel billboarded to camera
 * 3. Elevated Status Bar strip visible to VR and desktop users
 */

import * as THREE from 'three';
import { sound } from './audio.js';

export class VRMenuManager {
  /**
   * @param {THREE.Scene} scene
   * @param {THREE.Group} leftController
   * @param {Object} callbacks
   */
  constructor(scene, leftController, callbacks = {}) {
    this.scene = scene;
    this.leftController = leftController;
    this.callbacks = callbacks;

    this.hoveredButton = null;
    this.activeFlashButton = null;
    this.visible = true;

    // VR Menu button layout (7 actions)
    this.buttons = [
      { id: 'trace',     label: '⚡ Trace Packet',  yNorm: 0.17, heightNorm: 0.095 },
      { id: 'tour',      label: '🎓 Joinee Tour',   yNorm: 0.28, heightNorm: 0.095 },
      { id: 'templates', label: '📁 Presets / Stack',yNorm: 0.39, heightNorm: 0.095 },
      { id: 'traffic',   label: '🌊 Live Traffic',   yNorm: 0.50, heightNorm: 0.095 },
      { id: 'break',     label: '💥 Break / Repair',yNorm: 0.61, heightNorm: 0.095 },
      { id: 'reset',     label: '🔄 Reset All',     yNorm: 0.72, heightNorm: 0.095 },
      { id: 'labels',    label: '🏷️ Toggle Labels', yNorm: 0.83, heightNorm: 0.095 }
    ];

    this.buildWristMenu();
    this.buildInfoPanel();
    this.buildStatusBar();
  }

  // ==========================================
  // 1. WRIST MENU
  // ==========================================
  buildWristMenu() {
    this.menuCanvas = document.createElement('canvas');
    this.menuCanvas.width = 768;
    this.menuCanvas.height = 860;
    this.menuCtx = this.menuCanvas.getContext('2d');

    this.menuTexture = new THREE.CanvasTexture(this.menuCanvas);
    this.menuTexture.minFilter = THREE.LinearFilter;
    this.menuTexture.generateMipmaps = false;

    const menuGeo = new THREE.PlaneGeometry(0.38, 0.42);
    const menuMat = new THREE.MeshBasicMaterial({
      map: this.menuTexture,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.menuMesh = new THREE.Mesh(menuGeo, menuMat);
    this.menuMesh.name = 'vr-wrist-menu';
    this.menuMesh.userData = { isMenu: true };

    this.menuContainer = new THREE.Group();
    this.menuContainer.name = 'wrist-menu-container';
    this.menuContainer.position.set(0.08, 0.12, -0.06);
    this.menuContainer.rotation.set(-Math.PI / 4, Math.PI / 6, -Math.PI / 12);
    this.menuContainer.add(this.menuMesh);

    if (this.leftController) {
      this.leftController.add(this.menuContainer);
    } else {
      this.scene.add(this.menuContainer);
    }

    this.drawMenu();
  }

  drawMenu() {
    const ctx = this.menuCtx;
    const w = this.menuCanvas.width;
    const h = this.menuCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Menu Card Background
    ctx.fillStyle = 'rgba(11, 15, 26, 0.95)';
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 6;
    this.drawRoundedRect(ctx, 16, 16, w - 32, h - 32, 28, true, true);

    // Title Bar
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NETWORK CONTROLS', w / 2, 60);

    ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 105);
    ctx.lineTo(w - 40, 105);
    ctx.stroke();

    // Render Buttons
    for (const btn of this.buttons) {
      const btnX = 36;
      const btnW = w - 72;
      const btnY = btn.yNorm * h;
      const btnH = btn.heightNorm * h;

      const isHovered = (this.hoveredButton === btn.id);
      const isFlashed = (this.activeFlashButton === btn.id);

      if (isFlashed) {
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#ffffff';
      } else if (isHovered) {
        ctx.fillStyle = 'rgba(0, 243, 255, 0.35)';
        ctx.strokeStyle = '#00f3ff';
      } else {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.88)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      }

      ctx.lineWidth = 4;
      this.drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 14, true, true);

      // Button label
      ctx.fillStyle = isFlashed ? '#000000' : (isHovered ? '#ffffff' : '#e2e8f0');
      ctx.font = 'bold 30px "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(btn.label, w / 2, btnY + btnH / 2);
    }

    this.menuTexture.needsUpdate = true;
  }

  // ==========================================
  // 2. INFO PANEL (Floating Node Details & Deep Specs)
  // ==========================================
  buildInfoPanel() {
    this.infoCanvas = document.createElement('canvas');
    this.infoCanvas.width = 720;
    this.infoCanvas.height = 700;
    this.infoCtx = this.infoCanvas.getContext('2d');

    this.infoTexture = new THREE.CanvasTexture(this.infoCanvas);
    this.infoTexture.minFilter = THREE.LinearFilter;
    this.infoTexture.generateMipmaps = false;

    const infoGeo = new THREE.PlaneGeometry(0.56, 0.54);
    const infoMat = new THREE.MeshBasicMaterial({
      map: this.infoTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: true
    });

    this.infoMesh = new THREE.Mesh(infoGeo, infoMat);
    this.infoMesh.name = 'vr-info-panel';
    this.infoMesh.visible = false;
    this.scene.add(this.infoMesh);
  }

  showNodeInfo(nodeData, connectedLinkCount = 0, worldPosition = null) {
    if (!nodeData) {
      this.infoMesh.visible = false;
      return;
    }

    const ctx = this.infoCtx;
    const w = this.infoCanvas.width;
    const h = this.infoCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Frame
    ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
    ctx.strokeStyle = (nodeData.status === 'down') ? '#ef4444' : '#00f3ff';
    ctx.lineWidth = 6;
    this.drawRoundedRect(ctx, 12, 12, w - 24, h - 24, 22, true, true);

    // Header title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('NODE SPECIFICATIONS', 32, 28);

    // Status Badge
    const isUp = (nodeData.status !== 'down');
    ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    ctx.strokeStyle = isUp ? '#10b981' : '#ef4444';
    ctx.lineWidth = 3;
    this.drawRoundedRect(ctx, w - 165, 24, 130, 42, 10, true, true);

    ctx.fillStyle = isUp ? '#34d399' : '#f87171';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isUp ? '● ONLINE' : '▲ DOWN', w - 100, 34);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(32, 80);
    ctx.lineTo(w - 32, 80);
    ctx.stroke();

    ctx.textAlign = 'left';

    const rows = [
      { label: 'Device Name:', val: nodeData.name, valColor: '#ffffff' },
      { label: 'Hardware Role:', val: (nodeData.type || 'desktop').toUpperCase(), valColor: '#38bdf8' },
      { label: 'Department:', val: nodeData.department || 'IT & Infrastructure', valColor: '#facc15' },
      { label: 'IPv4 Address:', val: nodeData.ip, valColor: '#a5f3fc' },
      { label: 'Subnet Mask:', val: nodeData.mask || nodeData.subnetMask || '255.255.255.0 (/24)', valColor: '#cbd5e1' },
      { label: 'MAC Address:', val: nodeData.mac || '00:1A:2B:3C:4D:5E', valColor: '#93c5fd' },
      { label: 'Default Gateway:', val: nodeData.gateway || '10.0.0.1', valColor: '#f472b6' },
      { label: 'VLAN / Segment:', val: nodeData.vlan || 'VLAN 1 (Default)', valColor: '#a7f3d0' },
      { label: 'Port Interface:', val: nodeData.port || 'GigE 0/1', valColor: '#e2e8f0' },
      { label: 'Interface Speed:', val: nodeData.speed || '1 Gbps Full-Duplex', valColor: '#fed7aa' },
      { label: 'OS / Firmware:', val: nodeData.firmware || 'Embedded Network OS', valColor: '#d8b4fe' },
      { label: 'Active Links:', val: `${connectedLinkCount} connected link(s)`, valColor: '#4ade80' }
    ];

    let startY = 96;
    for (const r of rows) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '22px "Segoe UI", Roboto, sans-serif';
      ctx.fillText(r.label, 32, startY);

      ctx.fillStyle = r.valColor;
      ctx.font = 'bold 22px "Consolas", monospace';
      let valStr = String(r.val);
      if (valStr.length > 28) valStr = valStr.substring(0, 26) + '...';
      ctx.fillText(valStr, 235, startY);

      startY += 48;
    }

    this.infoTexture.needsUpdate = true;

    if (worldPosition) {
      this.infoMesh.position.set(
        worldPosition.x + 0.45,
        worldPosition.y + 0.22,
        worldPosition.z
      );
    }
    this.infoMesh.visible = true;
  }

  showLinkInfo(linkData, worldPosition = null) {
    if (!linkData) {
      this.infoMesh.visible = false;
      return;
    }

    const ctx = this.infoCtx;
    const w = this.infoCanvas.width;
    const h = this.infoCanvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
    const isUp = (linkData.status !== 'down');
    ctx.strokeStyle = isUp ? '#00f3ff' : '#ef4444';
    ctx.lineWidth = 6;
    this.drawRoundedRect(ctx, 12, 12, w - 24, h - 24, 22, true, true);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('LINK SPECIFICATIONS', 32, 28);

    ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    ctx.strokeStyle = isUp ? '#10b981' : '#ef4444';
    ctx.lineWidth = 3;
    this.drawRoundedRect(ctx, w - 165, 24, 130, 42, 10, true, true);

    ctx.fillStyle = isUp ? '#34d399' : '#f87171';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isUp ? '● HEALTHY' : '▲ BROKEN', w - 100, 34);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(32, 80);
    ctx.lineTo(w - 32, 80);
    ctx.stroke();

    ctx.textAlign = 'left';

    const rows = [
      { label: 'Link ID:', val: linkData.id || linkData.linkId, valColor: '#ffffff' },
      { label: 'Endpoint A:', val: linkData.from, valColor: '#38bdf8' },
      { label: 'Endpoint B:', val: linkData.to, valColor: '#38bdf8' },
      { label: 'Bandwidth / Media:', val: linkData.speed || '10 Gbps Fiber Optic', valColor: '#facc15' },
      { label: 'Duplex Mode:', val: 'Full-Duplex (Non-blocking)', valColor: '#a7f3d0' },
      { label: 'Link State:', val: isUp ? 'OPERATIONAL / PASSING' : 'FAULT / PACKET LOSS', valColor: isUp ? '#34d399' : '#f87171' }
    ];

    let startY = 110;
    for (const r of rows) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px "Segoe UI", Roboto, sans-serif';
      ctx.fillText(r.label, 32, startY);

      ctx.fillStyle = r.valColor;
      ctx.font = 'bold 24px "Consolas", monospace';
      ctx.fillText(String(r.val), 250, startY);

      startY += 58;
    }

    this.infoTexture.needsUpdate = true;

    if (worldPosition) {
      this.infoMesh.position.set(worldPosition.x, worldPosition.y + 0.28, worldPosition.z);
    }
    this.infoMesh.visible = true;
  }

  hideInfo() {
    this.infoMesh.visible = false;
  }

  // ==========================================
  // 3. ELEVATED STATUS BAR
  // ==========================================
  buildStatusBar() {
    this.statusCanvas = document.createElement('canvas');
    this.statusCanvas.width = 1500;
    this.statusCanvas.height = 180;
    this.statusCtx = this.statusCanvas.getContext('2d');

    this.statusTexture = new THREE.CanvasTexture(this.statusCanvas);
    this.statusTexture.minFilter = THREE.LinearFilter;
    this.statusTexture.generateMipmaps = false;

    const statusGeo = new THREE.PlaneGeometry(2.4, 0.28);
    const statusMat = new THREE.MeshBasicMaterial({
      map: this.statusTexture,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.statusMesh = new THREE.Mesh(statusGeo, statusMat);
    this.statusMesh.name = 'vr-status-bar';
    this.statusMesh.position.set(0, 2.65, -1.0);
    this.scene.add(this.statusMesh);

    this.setStatus('Ready. Select a node or press Trace Packet.');
  }

  setStatus(message, type = 'info') {
    this.currentStatusText = message;
    this.currentStatusType = type;

    const domStatus = document.getElementById('status-message');
    if (domStatus) {
      domStatus.textContent = message;
      domStatus.className = `status-${type}`;
    }

    const ctx = this.statusCtx;
    const w = this.statusCanvas.width;
    const h = this.statusCanvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(11, 15, 26, 0.94)';
    let borderColor = '#00f3ff';
    let textColor = '#ffffff';

    if (type === 'danger') {
      borderColor = '#ef4444';
      textColor = '#fca5a5';
    } else if (type === 'warning') {
      borderColor = '#facc15';
      textColor = '#fef08a';
    } else if (type === 'success') {
      borderColor = '#10b981';
      textColor = '#6ee7b7';
    }

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 6;
    this.drawRoundedRect(ctx, 10, 10, w - 20, h - 20, 24, true, true);

    ctx.fillStyle = borderColor;
    ctx.beginPath();
    ctx.arc(60, h / 2, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.font = 'bold 40px "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    let displayMsg = message;
    if (displayMsg.length > 74) {
      displayMsg = displayMsg.substring(0, 71) + '...';
    }
    ctx.fillText(displayMsg, 95, h / 2);

    this.statusTexture.needsUpdate = true;
  }

  // ==========================================
  // HIT TESTING & BUTTON INTERACTIONS
  // ==========================================
  hitTestMenu(uv) {
    if (!uv) {
      if (this.hoveredButton !== null) {
        this.hoveredButton = null;
        this.drawMenu();
      }
      return null;
    }

    const canvasYNorm = 1.0 - uv.y;
    let hitId = null;

    if (uv.x >= 0.05 && uv.x <= 0.95) {
      for (const btn of this.buttons) {
        if (canvasYNorm >= btn.yNorm && canvasYNorm <= (btn.yNorm + btn.heightNorm)) {
          hitId = btn.id;
          break;
        }
      }
    }

    if (hitId !== this.hoveredButton) {
      this.hoveredButton = hitId;
      this.drawMenu();
    }

    return hitId;
  }

  pressButton(buttonId) {
    if (!buttonId) return;

    this.activeFlashButton = buttonId;
    this.drawMenu();
    sound.playClick();

    setTimeout(() => {
      this.activeFlashButton = null;
      this.drawMenu();
    }, 180);

    if (this.callbacks[buttonId]) {
      this.callbacks[buttonId]();
    }
  }

  toggleVisibility() {
    this.visible = !this.visible;
    this.menuMesh.visible = this.visible;
    sound.playClick();
    return this.visible;
  }

  update(camera) {
    if (this.infoMesh.visible && camera) {
      this.infoMesh.quaternion.copy(camera.quaternion);
    }
    if (this.statusMesh && camera) {
      this.statusMesh.quaternion.copy(camera.quaternion);
    }
  }

  drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }
}
