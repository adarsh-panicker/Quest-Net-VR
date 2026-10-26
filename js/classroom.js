/**
 * classroom.js - 3D WebXR Virtual Reality Classroom Billboard
 *
 * Renders topic lessons, diagrams, analogies, and interactive 3D controls
 * directly inside the WebXR scene (Meta Quest 2 / immersive-vr) on a floating
 * high-resolution CanvasTexture billboard.
 */

import * as THREE from 'three';
import { CURRICULUM } from './curriculum.js';
import { sound } from './audio.js';

export class ClassroomManager {
  constructor(scene, app) {
    this.scene = scene;
    this.app = app;
    this.topics = CURRICULUM;
    this.currentIndex = 0;
    this.visible = false; // Initially hidden, can be toggled

    this.canvasWidth = 1200;
    this.canvasHeight = 725;

    // Define interactive 2D button hitboxes on the canvas (x, y, w, h)
    this.buttons = [
      { id: 'prev', label: '◄ Prev Topic', x: 40, y: 645, w: 220, h: 55, color: '#334155' },
      { id: 'lab', label: '🚀 Spawn 3D Lab', x: 280, y: 645, w: 320, h: 55, color: '#0284c7' },
      { id: 'next', label: 'Next Topic ►', x: 620, y: 645, w: 220, h: 55, color: '#0d9488' },
      { id: 'toggle', label: '✕ Hide Screen', x: 980, y: 645, w: 180, h: 55, color: '#ef4444' }
    ];

    this.initBillboard();
  }

  initBillboard() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.ctx = this.canvas.getContext('2d');

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    const planeGeo = new THREE.PlaneGeometry(2.4, 1.45);
    const planeMat = new THREE.MeshBasicMaterial({
      map: this.texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.96
    });

    this.billboardMesh = new THREE.Mesh(planeGeo, planeMat);
    this.billboardMesh.name = 'xr-classroom-billboard';
    this.billboardMesh.position.set(0, 1.6, -2.3);

    // Glowing cyberpunk border frame
    const frameGeo = new THREE.BoxGeometry(2.44, 1.49, 0.02);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      emissive: 0x003344,
      roughness: 0.2,
      metalness: 0.8
    });
    this.frameMesh = new THREE.Mesh(frameGeo, frameMat);
    this.frameMesh.position.set(0, 1.6, -2.32);

    this.classroomGroup = new THREE.Group();
    this.classroomGroup.name = 'xr-classroom-group';
    this.classroomGroup.add(this.frameMesh);
    this.classroomGroup.add(this.billboardMesh);

    this.scene.add(this.classroomGroup);
    this.classroomGroup.visible = this.visible;

    this.redrawCanvas();
  }

  toggle() {
    this.visible = !this.visible;
    this.classroomGroup.visible = this.visible;
    if (this.visible) {
      sound.playSelect();
      this.redrawCanvas();
    }
  }

  show() {
    this.visible = true;
    this.classroomGroup.visible = true;
    this.redrawCanvas();
  }

  hide() {
    this.visible = false;
    this.classroomGroup.visible = false;
  }

  setTopicIndex(idx) {
    if (idx >= 0 && idx < this.topics.length) {
      this.currentIndex = idx;
      this.redrawCanvas();
    }
  }

  nextTopic() {
    if (this.currentIndex < this.topics.length - 1) {
      this.currentIndex++;
      this.redrawCanvas();
      sound.playSelect();
    }
  }

  prevTopic() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.redrawCanvas();
      sound.playSelect();
    }
  }

  spawnCurrentLab() {
    const topic = this.topics[this.currentIndex];
    if (topic && topic.labTemplate && this.app) {
      this.app.loadTemplate(topic.labTemplate);
      sound.playSuccess();
      if (this.app.menuManager) {
        this.app.menuManager.setStatus(`VR Classroom: Spawning [${topic.labTemplate.toUpperCase()}] 3D Lab!`, 'success');
      }
    }
  }

  /**
   * Handle raycast intersection from VR controller or mouse pointer.
   * @param {THREE.Intersection} intersection 
   * @returns {boolean} true if hit a button on the billboard
   */
  handlePointerDown(intersection) {
    if (!this.visible || !intersection || intersection.object !== this.billboardMesh) {
      return false;
    }

    const uv = intersection.uv;
    if (!uv) return false;

    // Convert UV (0..1) to canvas pixel coordinates
    const px = uv.x * this.canvasWidth;
    const py = (1 - uv.y) * this.canvasHeight;

    for (const btn of this.buttons) {
      if (px >= btn.x && px <= btn.x + btn.w && py >= btn.y && py <= btn.y + btn.h) {
        this.onButtonClick(btn.id);
        return true;
      }
    }

    return true; // Clicked on billboard body
  }

  onButtonClick(btnId) {
    switch (btnId) {
      case 'prev':
        this.prevTopic();
        break;
      case 'next':
        this.nextTopic();
        break;
      case 'lab':
        this.spawnCurrentLab();
        break;
      case 'toggle':
        this.hide();
        sound.playDelete();
        break;
    }
  }

  redrawCanvas() {
    const ctx = this.ctx;
    const w = this.canvasWidth;
    const h = this.canvasHeight;
    const topic = this.topics[this.currentIndex];
    if (!topic) return;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#0b0f1a');
    bgGrad.addColorStop(1, '#060911');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle Grid pattern
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top Header Banner
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, 80);
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.lineTo(w, 80);
    ctx.stroke();

    // Track Badge
    let trackColor = '#00f3ff';
    if (topic.track.includes('ENCOR')) trackColor = '#f59e0b';
    if (topic.track.includes('ENARSI')) trackColor = '#ef4444';

    ctx.fillStyle = trackColor;
    ctx.font = 'bold 24px "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`VR STUDY CLASSROOM • ${topic.track.toUpperCase()}`, 40, 50);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Topic ${this.currentIndex + 1} of ${this.topics.length} • [${topic.badge}]`, w - 40, 50);
    ctx.textAlign = 'left';

    // Lesson Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Segoe UI", Roboto, sans-serif';
    ctx.fillText(topic.title, 40, 135);

    // Lesson Summary
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px "Segoe UI", Roboto, sans-serif';
    this.wrapText(ctx, topic.summary, 40, 175, w - 80, 28);

    // Left Box: Real-World Analogy
    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    this.roundRect(ctx, 40, 240, 530, 180, 8, true, true);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px "Segoe UI", Roboto, sans-serif';
    ctx.fillText('💡 Real-World Mental Model & Analogy', 60, 275);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '17px "Segoe UI", Roboto, sans-serif';
    this.wrapText(ctx, topic.analogy, 60, 310, 490, 24);

    // Right Box: Lab Scene & Architecture Binding
    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    this.roundRect(ctx, 610, 240, 550, 180, 8, true, true);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`🚀 Interactive 3D Lab Template: [${topic.labTemplate.toUpperCase()}]`, 630, 275);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '17px "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`• Module: ${topic.module}`, 630, 315);
    ctx.fillText(`• 3D Simulation: Multi-Hop dynamic packet tracer`, 630, 345);
    ctx.fillText(`• Hardware Nodes: Enterprise Routers, Switches, Hosts`, 630, 375);
    ctx.fillText(`• Click the "Spawn 3D Lab" button below to load in VR!`, 630, 405);

    // Bottom Box: Exam Trap / Engineering Tip
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    this.roundRect(ctx, 40, 445, 1120, 170, 8, true, true);

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 20px "Segoe UI", Roboto, sans-serif';
    ctx.fillText('🎯 Certification Exam Trap & Architecture Insight', 60, 480);

    ctx.fillStyle = '#fecaca';
    ctx.font = '17px "Segoe UI", Roboto, sans-serif';
    this.wrapText(ctx, topic.examTip, 60, 515, 1070, 25);

    // Action Buttons
    for (const btn of this.buttons) {
      // Glow and background
      ctx.fillStyle = btn.color;
      this.roundRect(ctx, btn.x, btn.y, btn.w, btn.h, 6, true, false);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      this.roundRect(ctx, btn.x, btn.y, btn.w, btn.h, 6, false, true);

      // Button Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 35);
      ctx.textAlign = 'left';
    }

    this.texture.needsUpdate = true;
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return;
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

  roundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }
}
