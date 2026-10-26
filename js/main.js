/**
 * main.js - Core Application Setup, Render Loop & WebXR Session Management
 *
 * Implements:
 * 1. WebGLRenderer with high-performance WebXR settings (setFoveation 1, pixelRatio 1 in VR)
 * 2. Scene setup: dark background, fog, hemisphere + directional lights, circular floor grid
 * 3. VR camera Dolly system with smooth locomotion & snap turn integration
 * 4. Desktop OrbitControls fallback with automatic XR session toggle
 * 5. Startup "How To Use" tutorial billboard panel
 * 6. Interactive Network Builder: Add Server, Desktop, Laptop, Printer, Firewall with automatic generic thumbnails & Dept tagging
 * 7. Enterprise Architecture Template selector (Corporate Edge, 3-Tier Web, SD-WAN, Blank)
 * 8. Interactive Guided Onboarding Tour for new joinees
 * 9. Multi-protocol packet selection (ICMP, HTTP, DNS, SQL) & Ambient NOC Traffic
 * 10. Cyber Security Attack & Defense Simulator (DDoS SYN Flood vs WAF Shield)
 * 11. Wireshark-Lite Real-time Packet Sniffer Drawer
 * 12. Multiple 3D Auto-Layouts (Hierarchical, Concentric Radial, Force-Directed Physics)
 * 13. Interactive IPv4 CIDR Subnet Calculator
 * 14. Cinematic Camera Presentation Mode for demos
 * 15. Client-Side PDF Generation of Layout & Device Inventory
 * 16. Web Audio sound effects and real-time performance telemetry
 */

import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Graph, NETWORK_TEMPLATES, DEPARTMENTS, runGraphSelfTest } from './graph.js';
import { NodeVisualManager } from './nodes.js';
import { VRMenuManager } from './menu.js';
import { SimulationManager } from './simulation.js';
import { InteractionManager } from './interaction.js';
import { JoineeTourManager } from './tour.js';
import { SecurityManager } from './security.js';
import { TopologyLayoutManager } from './layout.js';
import { calculateSubnet } from './subnet.js';
import { exportNetworkToPDF } from './exportPdf.js';
import { CCNAAcademyManager } from './ccna.js';
import { ExplainerManager } from './explainer.js';
import { StudyAcademyManager } from './study_academy.js';
import { ClassroomManager } from './classroom.js';
import { sound } from './audio.js';
import {
  validateTopology,
  exportTopologyJSON,
  loadSampleTopology,
  saveTopologyToStorage,
  loadTopologyFromStorage
} from './topology.js';

class App {
  constructor() {
    this.clock = new THREE.Clock();
    this.fpsCounter = { frames: 0, lastTime: performance.now(), fps: 60 };
    this.currentTemplateIndex = 0;
    this.templateKeys = Object.keys(NETWORK_TEMPLATES);

    // Presentation mode
    this.cinematicMode = false;
    this.cinematicAngle = 0;

    this.initScene();
    this.initNetwork();
    this.initVR();
    this.initInteraction();
    this.initTour();
    this.initSecurityAndLayout();
    this.initTutorialPanel();
    this.classroomManager = new ClassroomManager(this.scene, this);
    this.interaction.setClassroomManager(this.classroomManager);
    this.initDesktopUI();
    this.ccnaManager = new CCNAAcademyManager();
    this.studyAcademyManager = new StudyAcademyManager(this);

    runGraphSelfTest();

    this.renderer.setAnimationLoop((time, frame) => this.render(time, frame));
  }

  // ==========================================
  // 1. SCENE, CAMERA, LIGHTS & FLOOR
  // ==========================================
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0f1a);
    this.scene.fog = new THREE.Fog(0x0b0f1a, 8, 28);

    this.camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 1.6, 2.2);

    this.dolly = new THREE.Group();
    this.dolly.name = 'xr-dolly';
    this.dolly.position.set(0, 0, 0);
    this.dolly.add(this.camera);
    this.scene.add(this.dolly);

    const hemiLight = new THREE.HemisphereLight(0x94a3b8, 0x0f172a, 1.3);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(4, 10, 6);
    this.scene.add(dirLight);

    const floorGeo = new THREE.CircleGeometry(10, 36);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshBasicMaterial({ color: 0x070a12 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = 0;
    this.scene.add(floorMesh);

    const grid = new THREE.GridHelper(18, 36, 0x1e293b, 0x0f172a);
    grid.position.y = 0.002;
    this.scene.add(grid);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1.5, -1.0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.update();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  // ==========================================
  // 2. NETWORK GRAPH, VISUALS & SIMULATION
  // ==========================================
  initNetwork() {
    this.graph = new Graph();
    this.nodeVisuals = new NodeVisualManager(this.scene);

    this.menuManager = new VRMenuManager(this.scene, null, {
      trace: () => this.simulation.startTraceMode(),
      tour: () => this.tourManager?.startTour(),
      templates: () => this.cycleTemplate(),
      traffic: () => this.simulation.toggleAmbientTraffic(),
      break: () => this.simulation.breakSelected(this.interaction.selectedTarget),
      reset: () => this.simulation.resetAll(),
      labels: () => this.nodeVisuals.toggleLabels()
    });

    this.simulation = new SimulationManager(
      this.scene,
      this.graph,
      this.nodeVisuals,
      this.menuManager,
      (intensity, dur) => {
        if (this.interaction && this.interaction.controllers[0]) {
          this.interaction.triggerHaptic(this.interaction.controllers[0], intensity, dur);
        }
      }
    );

    const saved = loadTopologyFromStorage();
    if (saved) {
      this.applyTopologyData(saved);
      this.menuManager.setStatus('Restored previous network topology from browser cache.');
    } else {
      this.loadTemplate('corporate');
    }
  }

  // ==========================================
  // 3. SECURITY & 3D LAYOUT MANAGERS
  // ==========================================
  initSecurityAndLayout() {
    this.securityManager = new SecurityManager(
      this.scene,
      this.graph,
      this.nodeVisuals,
      this.menuManager
    );
    this.simulation.setSecurityManager(this.securityManager);

    this.layoutManager = new TopologyLayoutManager(
      this.graph,
      this.nodeVisuals
    );

    this.explainerManager = new ExplainerManager(
      this.graph,
      this.simulation,
      this.menuManager
    );
    this.simulation.setExplainerManager(this.explainerManager);
  }

  // ==========================================
  // 4. TEMPLATES & BUILT-IN STACKS
  // ==========================================
  cycleTemplate() {
    this.currentTemplateIndex = (this.currentTemplateIndex + 1) % this.templateKeys.length;
    const key = this.templateKeys[this.currentTemplateIndex];
    this.loadTemplate(key);
  }

  loadTemplate(key) {
    const template = NETWORK_TEMPLATES[key] || NETWORK_TEMPLATES.corporate;
    this.applyTopologyData(template.data);
    this.menuManager.setStatus(`Loaded Stack: [${template.title}].`, 'success');
    this.explainerManager?.onTopologyChanged(key);
    sound.playSuccess();
  }

  applyTopologyData(rawData) {
    const result = validateTopology(rawData);
    if (!result.valid) {
      const errMsg = result.errors.join('; ');
      console.error('Topology validation failed:', errMsg);
      this.menuManager.setStatus(`Topology Error: ${result.errors[0]}`, 'danger');
      alert(`Invalid Topology:\n\n${errMsg}`);
      return false;
    }

    this.simulation.stopTrace();
    if (this.securityManager) this.securityManager.stopAttack();
    this.graph.clear();

    for (const node of result.data.nodes) {
      this.graph.addNode(node);
    }
    for (const link of result.data.links) {
      this.graph.addLink(link.from, link.to, link.id, link);
    }

    this.nodeVisuals.build(this.graph);
    saveTopologyToStorage(result.data);

    if (this.interaction) {
      this.interaction.deselect();
    }

    return true;
  }

  // ==========================================
  // 5. WEBXR SESSION & VR BUTTON
  // ==========================================
  initVR() {
    const vrBtn = VRButton.createButton(this.renderer);
    vrBtn.className = 'vr-button';
    document.body.appendChild(vrBtn);

    this.renderer.xr.addEventListener('sessionstart', () => {
      this.renderer.setPixelRatio(1);
      if (this.renderer.xr.setFoveation) {
        this.renderer.xr.setFoveation(1.0);
      }
      this.dolly.position.set(0, 0, 0);
      this.dolly.rotation.set(0, 0, 0);
      this.controls.enabled = false;

      const desktopUI = document.getElementById('desktop-ui');
      if (desktopUI) desktopUI.style.display = 'none';

      if (this.interaction && this.interaction.controllers[0]) {
        const leftCtrl = this.interaction.controllers[0];
        if (this.menuManager.menuContainer.parent !== leftCtrl) {
          leftCtrl.add(this.menuManager.menuContainer);
        }
      }
    });

    this.renderer.xr.addEventListener('sessionend', () => {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.controls.enabled = true;
      const desktopUI = document.getElementById('desktop-ui');
      if (desktopUI) desktopUI.style.display = 'flex';
    });
  }

  // ==========================================
  // 6. INTERACTION & ONBOARDING TOUR
  // ==========================================
  initInteraction() {
    this.interaction = new InteractionManager({
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      dolly: this.dolly,
      nodeVisuals: this.nodeVisuals,
      menuManager: this.menuManager,
      simulation: this.simulation,
      graph: this.graph,
      domElement: this.renderer.domElement
    });

    if (this.interaction.controllers[0]) {
      this.interaction.controllers[0].add(this.menuManager.menuContainer);
    }
  }

  initTour() {
    this.tourManager = new JoineeTourManager(
      this.scene,
      this.nodeVisuals,
      this.menuManager,
      this.camera
    );
    this.interaction.setTourManager(this.tourManager);
  }

  // ==========================================
  // 7. STARTUP TUTORIAL PANEL
  // ==========================================
  initTutorialPanel() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(11, 15, 26, 0.95)';
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 6;
    this.menuManager.drawRoundedRect(ctx, 16, 16, 992, 608, 30, true, true);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VR NETWORK TOPOLOGY EXPLORER', 512, 75);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, 115);
    ctx.lineTo(964, 115);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '28px "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#94a3b8';

    const lines = [
      { k: 'Trigger (Index):', v: 'Select node/link, or tap menu buttons', c: '#38bdf8' },
      { k: 'Grip (Squeeze):',  v: 'Grab and physically move any node in 3D', c: '#38bdf8' },
      { k: 'Left Stick:',      v: 'Smooth locomotion (head-relative 2 m/s)', c: '#34d399' },
      { k: 'Right Stick:',     v: 'Comfort snap-turn (30° per flick)', c: '#34d399' },
      { k: 'Cyber Defense:',   v: '🚨 DDoS Attack Simulator | 🛡️ WAF Shield Mitigation', c: '#f43f5e' },
      { k: 'Tools & Hub:',     v: '🔍 Wireshark Sniffer | 🧮 CIDR Calculator | 📄 PDF Export', c: '#a78bfa' }
    ];

    let y = 165;
    for (const item of lines) {
      ctx.fillStyle = item.c;
      ctx.font = 'bold 28px "Segoe UI", sans-serif';
      ctx.fillText(item.k, 70, y);

      ctx.fillStyle = '#ffffff';
      ctx.font = '28px "Segoe UI", Roboto, sans-serif';
      ctx.fillText(item.v, 320, y);
      y += 56;
    }

    ctx.fillStyle = 'rgba(0, 243, 255, 0.2)';
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 4;
    this.menuManager.drawRoundedRect(ctx, 220, 520, 584, 70, 18, true, true);

    ctx.fillStyle = '#00f3ff';
    ctx.font = 'bold 30px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CLICK OR PULL TRIGGER TO DISMISS', 512, 564);

    const texture = new THREE.CanvasTexture(canvas);
    const planeGeo = new THREE.PlaneGeometry(0.88, 0.55);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.tutorialPanel = new THREE.Mesh(planeGeo, planeMat);
    this.tutorialPanel.name = 'tutorial-panel';
    this.tutorialPanel.position.set(0, 1.55, 0.3);
    this.scene.add(this.tutorialPanel);

    this.interaction.setTutorialPanel(this.tutorialPanel);
  }

  // ==========================================
  // 8. DESKTOP UI, TOOLS & CYBER SECURITY
  // ==========================================
  initDesktopUI() {
    // Toolbar buttons
    document.getElementById('btn-trace')?.addEventListener('click', () => {
      this.simulation.startTraceMode();
    });
    document.getElementById('btn-break')?.addEventListener('click', () => {
      this.simulation.breakSelected(this.interaction.selectedTarget);
    });
    document.getElementById('btn-reset')?.addEventListener('click', () => {
      this.simulation.resetAll();
      if (this.securityManager) this.securityManager.stopAttack();
    });
    document.getElementById('btn-labels')?.addEventListener('click', () => {
      this.nodeVisuals.toggleLabels();
    });

    // Cyber Security: DDoS Simulator & WAF Shield
    document.getElementById('btn-ddos')?.addEventListener('click', () => {
      this.securityManager.launchDDoSAttack(this.interaction.selectedTarget?.userData?.nodeId);
    });
    document.getElementById('btn-mitigate')?.addEventListener('click', () => {
      this.securityManager.toggleMitigation();
    });

    // Wireshark Packet Sniffer Drawer
    const wiresharkDrawer = document.getElementById('wireshark-drawer');
    document.getElementById('btn-toggle-wireshark')?.addEventListener('click', () => {
      wiresharkDrawer.classList.toggle('hidden');
      sound.playClick();
    });
    document.getElementById('btn-clear-sniffer')?.addEventListener('click', () => {
      const tbody = document.getElementById('wireshark-table-body');
      if (tbody) tbody.innerHTML = '';
      this.securityManager.packetLog = [];
    });

    // 3D Layout Algorithm Switcher
    const layoutSelect = document.getElementById('layout-select');
    layoutSelect?.addEventListener('change', (e) => {
      const mode = e.target.value;
      if (mode === 'radial') {
        this.layoutManager.applyRadialLayout();
        this.menuManager.setStatus('Applied Concentric Radial Ring 3D Layout.', 'success');
      } else if (mode === 'force') {
        this.layoutManager.applyForceDirectedLayout();
        this.menuManager.setStatus('Applied Force-Directed Spring Physics Layout.', 'success');
      } else {
        this.layoutManager.applyLayeredLayout();
        this.menuManager.setStatus('Applied Left-to-Right Hierarchical Flow Layout.', 'success');
      }
    });

    // CIDR Subnet Calculator Modal
    const subnetModal = document.getElementById('subnet-calculator-modal');
    document.getElementById('btn-subnet-calc')?.addEventListener('click', () => {
      subnetModal.classList.toggle('hidden');
      sound.playClick();
    });
    document.getElementById('btn-close-subnet')?.addEventListener('click', () => {
      subnetModal.classList.add('hidden');
    });

    const runSubnetCalc = () => {
      const input = document.getElementById('cidr-input-field')?.value;
      const res = calculateSubnet(input);
      const out = document.getElementById('subnet-calc-results');
      if (!out) return;

      if (res.valid) {
        out.innerHTML = `
          <div class="calc-row"><span>CIDR Subnet:</span><strong>${res.cidr}</strong></div>
          <div class="calc-row"><span>Subnet Mask:</span><strong>${res.subnetMask}</strong></div>
          <div class="calc-row"><span>Wildcard Mask:</span><strong>${res.wildcardMask}</strong></div>
          <div class="calc-row"><span>Network Address:</span><strong>${res.networkAddress}</strong></div>
          <div class="calc-row"><span>Broadcast Address:</span><strong>${res.broadcastAddress}</strong></div>
          <div class="calc-row"><span>Usable Host Range:</span><strong>${res.usableHostRange}</strong></div>
          <div class="calc-row"><span>Usable Hosts:</span><strong style="color: #38bdf8;">${res.usableHosts} devices</strong></div>
          <div class="calc-row"><span>IP Class / Scope:</span><strong>${res.ipClass}</strong></div>
        `;
        sound.playSuccess();
      } else {
        out.innerHTML = `<div class="calc-error">❌ ${res.error}</div>`;
      }
    };

    document.getElementById('btn-do-calc')?.addEventListener('click', runSubnetCalc);
    document.getElementById('cidr-input-field')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runSubnetCalc();
    });

    // Cinematic Presentation Camera Orbit Mode
    const cinematicBtn = document.getElementById('btn-cinematic-cam');
    cinematicBtn?.addEventListener('click', () => {
      this.cinematicMode = !this.cinematicMode;
      cinematicBtn.classList.toggle('active', this.cinematicMode);
      if (this.cinematicMode) {
        this.menuManager.setStatus('🎥 Cinematic Presentation Mode active: smooth camera orbit running.', 'info');
        sound.playClick();
      } else {
        this.menuManager.setStatus('Cinematic Presentation Mode stopped.', 'info');
      }
    });

    // PDF Export Button
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
      this.menuManager.setStatus('Generating high-resolution Network Topology PDF report...', 'warning');
      setTimeout(() => {
        const ok = exportNetworkToPDF({
          renderer: this.renderer,
          scene: this.scene,
          camera: this.camera,
          graph: this.graph
        });
        if (ok) {
          this.menuManager.setStatus('PDF Report downloaded successfully!', 'success');
        }
      }, 100);
    });

    // Department Filter Dropdown
    document.getElementById('dept-filter-select')?.addEventListener('change', (e) => {
      const dept = e.target.value;
      this.nodeVisuals.filterByDepartment(dept);
      if (dept) {
        this.menuManager.setStatus(`Filtered view to: [${dept}] department.`, 'info');
      } else {
        this.menuManager.setStatus('Showing all departments.', 'info');
      }
    });

    // Tour triggers
    document.getElementById('btn-tour')?.addEventListener('click', () => {
      this.tourManager.startTour();
    });
    document.getElementById('btn-tour-next')?.addEventListener('click', () => {
      this.tourManager.nextStep();
    });
    document.getElementById('btn-tour-prev')?.addEventListener('click', () => {
      this.tourManager.prevStep();
    });
    document.getElementById('btn-tour-close')?.addEventListener('click', () => {
      this.tourManager.endTour();
    });

    // Ambient Traffic
    const trafficBtn = document.getElementById('btn-traffic');
    trafficBtn?.addEventListener('click', () => {
      const active = this.simulation.toggleAmbientTraffic();
      trafficBtn.classList.toggle('active', active);
    });

    // Sound Toggle
    const soundBtn = document.getElementById('btn-sound');
    soundBtn?.addEventListener('click', () => {
      const muted = sound.toggleMute();
      soundBtn.textContent = muted ? '🔇 Sound: Off' : '🔊 Sound: On';
    });

    // Protocol Selector
    document.querySelectorAll('.proto-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const proto = e.currentTarget.getAttribute('data-proto');
        document.querySelectorAll('.proto-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.simulation.setProtocol(proto);
      });
    });

    // Template Dropdown
    const templateSelect = document.getElementById('template-select');
    templateSelect?.addEventListener('change', (e) => {
      this.loadTemplate(e.target.value);
    });

    // Modal: Add Device (Server, Desktop, Laptop, Printer, Firewall)
    const addNodeModal = document.getElementById('add-node-modal');
    const updateModalPreview = () => {
      const type = document.getElementById('node-type-input')?.value || 'server';
      const dept = document.getElementById('node-dept-input')?.value || 'IT & Infrastructure';
      const canvas = document.getElementById('node-icon-preview');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.nodeVisuals.drawDeviceThumbnail(ctx, type, 4, 4, 72, 72);
      }
      const typeText = document.getElementById('preview-type-name');
      const deptText = document.getElementById('preview-dept-name');
      if (typeText) typeText.textContent = type.toUpperCase();
      if (deptText) deptText.textContent = dept;
    };

    document.getElementById('btn-add-node')?.addEventListener('click', () => {
      addNodeModal.classList.toggle('hidden');
      updateModalPreview();
      sound.playClick();
    });
    document.getElementById('node-type-input')?.addEventListener('change', updateModalPreview);
    document.getElementById('node-dept-input')?.addEventListener('change', updateModalPreview);

    document.getElementById('btn-modal-cancel')?.addEventListener('click', () => {
      addNodeModal.classList.add('hidden');
    });

    document.getElementById('btn-modal-create')?.addEventListener('click', () => {
      const nameInput = document.getElementById('node-name-input');
      const typeInput = document.getElementById('node-type-input');
      const deptInput = document.getElementById('node-dept-input');
      const ipInput = document.getElementById('node-ip-input');

      const name = nameInput.value.trim() || 'New Device';
      const type = typeInput.value || 'desktop';
      const department = deptInput.value || 'IT & Infrastructure';
      const ip = ipInput.value.trim() || `10.0.${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 250) + 1}`;
      const id = 'dev_' + Date.now().toString(36);

      const nodePos = [
        Number(((Math.random() - 0.5) * 3.2).toFixed(2)),
        Number((1.1 + Math.random() * 0.9).toFixed(2)),
        -1.0
      ];

      const nodeData = { id, name, type, department, subnet: department, ip, position: nodePos };
      this.graph.addNode(nodeData);
      const group = this.nodeVisuals.addSingleNode(nodeData);
      if (group) {
        this.interaction.selectTarget(group);
      }

      this.menuManager.setStatus(`Added [${name}] (${type.toUpperCase()} - ${department}) at ${ip}! Hold Shift+Drag to move.`, 'success');
      addNodeModal.classList.add('hidden');
      sound.playSuccess();
    });

    // Builder: Connect Tool
    const connectBtn = document.getElementById('btn-connect');
    connectBtn?.addEventListener('click', () => {
      const active = this.interaction.toggleConnectMode();
      connectBtn.classList.toggle('active', active);
    });

    // Builder: Delete Tool
    document.getElementById('btn-delete')?.addEventListener('click', () => {
      this.interaction.deleteSelected();
    });

    // JSON Drawer
    const jsonDrawer = document.getElementById('json-drawer');
    document.getElementById('btn-toggle-json')?.addEventListener('click', () => {
      jsonDrawer.classList.toggle('hidden');
    });

    document.getElementById('btn-load-json')?.addEventListener('click', () => {
      const textarea = document.getElementById('json-input');
      try {
        const parsed = JSON.parse(textarea.value);
        if (this.applyTopologyData(parsed)) {
          this.menuManager.setStatus('Custom topology loaded successfully.', 'success');
        }
      } catch (err) {
        alert('Invalid JSON syntax: ' + err.message);
      }
    });

    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      const exported = exportTopologyJSON(this.graph, this.nodeVisuals);
      const textarea = document.getElementById('json-input');
      if (textarea) textarea.value = exported;

      navigator.clipboard.writeText(exported).then(() => {
        this.menuManager.setStatus('Topology JSON copied to clipboard!', 'success');
      }).catch(() => {
        this.menuManager.setStatus('Exported JSON generated in textarea.', 'info');
      });
    });

    document.getElementById('btn-restore-last')?.addEventListener('click', () => {
      const saved = loadTopologyFromStorage();
      if (saved) {
        this.applyTopologyData(saved);
        this.menuManager.setStatus('Restored last saved topology from storage.', 'success');
      } else {
        alert('No previously saved topology found in browser storage.');
      }
    });

    document.getElementById('file-upload')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (this.applyTopologyData(parsed)) {
            const textarea = document.getElementById('json-input');
            if (textarea) textarea.value = JSON.stringify(parsed, null, 2);
            this.menuManager.setStatus(`Loaded "${file.name}" successfully!`, 'success');
          }
        } catch (err) {
          alert('Error parsing uploaded JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    const perfOverlay = document.getElementById('perf-overlay');
    const btnToggleVR = document.getElementById('btn-toggle-vr-billboard');
    if (btnToggleVR) {
      btnToggleVR.addEventListener('click', () => {
        this.classroomManager?.toggle();
        if (this.classroomManager?.visible) {
          this.menuManager?.setStatus('VR Classroom Screen Visible in 3D Space! Look around.', 'success');
        } else {
          this.menuManager?.setStatus('VR Classroom Screen Hidden.', 'info');
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'f' || e.key === 'F') {
        if (perfOverlay) {
          perfOverlay.classList.toggle('hidden');
        }
      } else if (e.key === 's' || e.key === 'S') {
        this.studyAcademyManager?.openAcademy();
      } else if (e.key === 'v' || e.key === 'V') {
        this.classroomManager?.toggle();
      }
    });
  }

  // ==========================================
  // 9. MAIN RENDER LOOP & TELEMETRY
  // ==========================================
  render(time, frame) {
    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    this.nodeVisuals.update(delta, elapsed);
    this.simulation.update(delta, elapsed);
    if (this.securityManager) {
      this.securityManager.update(delta);
    }
    this.interaction.update(delta);
    this.menuManager.update(this.camera);

    if (this.tourManager) {
      this.tourManager.update();
    }

    // Cinematic Camera Orbit
    if (this.cinematicMode && !this.renderer.xr.isPresenting) {
      this.cinematicAngle += delta * 0.18;
      const radius = 3.2;
      this.camera.position.x = Math.sin(this.cinematicAngle) * radius;
      this.camera.position.z = Math.cos(this.cinematicAngle) * radius;
      this.camera.position.y = 1.6 + Math.sin(this.cinematicAngle * 0.5) * 0.3;
      this.camera.lookAt(0, 1.5, -1.0);
    } else if (!this.renderer.xr.isPresenting && !this.interaction.isDesktopDragging) {
      this.controls.update();
    }

    if (this.tutorialPanel && this.tutorialPanel.visible) {
      this.tutorialPanel.quaternion.copy(this.camera.quaternion);
    }

    this.renderer.render(this.scene, this.camera);
    this.updatePerformanceTelemetry();
  }

  updatePerformanceTelemetry() {
    this.fpsCounter.frames++;
    const now = performance.now();
    if (now - this.fpsCounter.lastTime >= 500) {
      this.fpsCounter.fps = Math.round((this.fpsCounter.frames * 1000) / (now - this.fpsCounter.lastTime));
      this.fpsCounter.frames = 0;
      this.fpsCounter.lastTime = now;

      const fpsEl = document.getElementById('perf-fps');
      const triEl = document.getElementById('perf-triangles');
      const callEl = document.getElementById('perf-calls');

      if (fpsEl) fpsEl.textContent = `${this.fpsCounter.fps} FPS`;
      if (triEl) triEl.textContent = `${this.renderer.info.render.triangles} Triangles`;
      if (callEl) callEl.textContent = `${this.renderer.info.render.calls} Calls`;
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
