/**
 * network_builder.js - Interactive Guided Network Construction, Testing & Real Map Blueprint Studio
 *
 * Implements:
 * 1. 7-Step Guided Network Construction Wizard (Perimeter -> Core -> Servers -> Endpoints -> Cabling -> Test -> PDF)
 * 2. Custom Device Placement & Cable Interconnection Studio
 * 3. Comprehensive Network Diagnostics & Ping Testing Engine (Live 3D packet traces, latency & health audit)
 * 4. Interactive 2D Real Architectural Map Preview (Canvas rendering & PNG download)
 * 5. One-Click Real Map & Inventory PDF Blueprint Exporter
 */

import { sound } from './audio.js';
import { exportNetworkToPDF, auditNetworkHealth } from './exportPdf.js';
import { generateSchematicMap, renderSchematicMapToCanvas, downloadSchematicMapImage } from './schematic_map.js';

export const GUIDED_STEPS = [
  {
    step: 1,
    title: '🌐 Step 1: Perimeter & Edge Security Defense',
    subtitle: 'Establish the external WAN border and deploy next-gen threat defense.',
    tagline: 'Why this comes first:',
    explanation: 'Every enterprise network connects to the public Internet or upstream WAN service provider. Before connecting internal business assets, a perimeter firewall and VPN concentrator must be deployed to inspect inbound traffic, filter DDoS/SYN attacks, enforce NAT boundaries, and establish secure encrypted IPsec tunnels for remote branches.',
    recommended: [
      { name: 'Internet ISP Gateway', type: 'internet', dept: 'DMZ & Perimeter', ip: '203.0.113.1', vlan: 'WAN', desc: 'Upstream Tier-1 Internet Service Provider gateway router.' },
      { name: 'Next-Gen Perimeter Firewall', type: 'firewall', dept: 'DMZ & Perimeter', ip: '10.0.0.1', vlan: 'DMZ', desc: 'Stateful firewall with Deep Packet Inspection, IPS, and anti-malware filtering.' },
      { name: 'IPsec VPN Concentrator', type: 'vpn', dept: 'DMZ & Perimeter', ip: '10.0.0.2', vlan: 'DMZ', desc: 'Terminates remote worker AnyConnect SSL & site-to-site IPsec tunnels.' }
    ]
  },
  {
    step: 2,
    title: '🔄 Step 2: Core & Distribution Switching Backbone',
    subtitle: 'Create the high-speed campus backbone and inter-VLAN routing matrix.',
    tagline: 'Why this comes second:',
    explanation: 'The Core and Distribution layers aggregate traffic from all campus buildings and department subnets. Layer-3 Multilayer Switches perform hardware-accelerated routing between VLANs at wire speed, run Spanning Tree (STP) to eliminate switching loops, and aggregate redundant uplinks with LACP EtherChannel.',
    recommended: [
      { name: 'Core Layer-3 Switch', type: 'switch', dept: 'IT & Infrastructure', ip: '10.0.1.1', vlan: 'VLAN 1', desc: 'Catalyst 9500 40G/100G backbone switch handling inter-VLAN routing.' },
      { name: 'Distribution Router (WAN)', type: 'router', dept: 'IT & Infrastructure', ip: '10.0.1.254', vlan: 'VLAN 1', desc: 'BGP/OSPF edge router routing traffic between campus and WAN/Cloud.' }
    ]
  },
  {
    step: 3,
    title: '🏢 Step 3: Department Servers & Data Center Services',
    subtitle: 'Deploy centralized compute workloads, hypervisors and core network services.',
    tagline: 'Why this comes third:',
    explanation: 'Business applications, databases, and network directory services must be placed in a controlled, firewalled Data Center subnet (VLAN 10/20). Direct end-user access is restricted through ACL rules, while redundant 10G SFP+ fiber optic uplinks ensure high throughput for ERP, CRM, and file storage.',
    recommended: [
      { name: 'Enterprise Web Application Server', type: 'server', dept: 'Data Center', ip: '10.0.10.10', vlan: 'VLAN 10', desc: 'Nginx / Apache web tier hosting internal corporate portal.' },
      { name: 'Database Cluster (Primary SQL)', type: 'database', dept: 'Data Center', ip: '10.0.10.20', vlan: 'VLAN 10', desc: 'PostgreSQL / Oracle transaction database with encrypted storage.' },
      { name: 'Bare-Metal Type-1 Hypervisor (ESXi)', type: 'hypervisor', dept: 'Data Center', ip: '10.0.10.30', vlan: 'VLAN 10', desc: 'VMware ESXi host running multi-tenant virtual machines and containers.' },
      { name: 'Core DNS / DHCP Server', type: 'server', dept: 'IT & Infrastructure', ip: '10.0.1.5', vlan: 'VLAN 1', desc: 'Authoritative internal DNS resolver and dynamic IPv4 scope server.' }
    ]
  },
  {
    step: 4,
    title: '💻 Step 4: End-User Workstations & Peripherals',
    subtitle: 'Distribute client endpoints across segmented department subnets.',
    tagline: 'Why this comes fourth:',
    explanation: 'Staff desktops, executive laptops, network laser printers, VoIP phones, and Wi-Fi access points must be organized into logical department VLANs (Finance, Engineering, Sales, HR). Segmentation ensures that a malware infection or broadcast flood in one department cannot leak into accounting or engineering assets.',
    recommended: [
      { name: 'Finance Desktop Workstation', type: 'desktop', dept: 'Finance & Accounting', ip: '10.0.30.101', vlan: 'VLAN 30', desc: 'Workstation running ERP client and financial spreadsheet suites.' },
      { name: 'Engineering Dev Workstation', type: 'desktop', dept: 'Engineering & Dev', ip: '10.0.40.101', vlan: 'VLAN 40', desc: 'High-performance workstation compiling code and querying databases.' },
      { name: 'Executive Staff Laptop', type: 'laptop', dept: 'Executive Suite', ip: '10.0.99.105', vlan: 'VLAN 99', desc: 'Mobile executive laptop connecting via encrypted Wi-Fi 6 WPA3-Enterprise.' },
      { name: 'Finance Department Laser Printer', type: 'printer', dept: 'Finance & Accounting', ip: '10.0.30.202', vlan: 'VLAN 30', desc: 'High-speed network laser printer listening on RAW port 9100 / IPP.' },
      { name: 'Wi-Fi 6 Access Point (Catalyst 9120)', type: 'wap', dept: 'Sales & Marketing', ip: '10.0.60.5', vlan: 'VLAN 60', desc: 'Ceiling mounted 802.11ax dual-band AP providing campus mobility.' },
      { name: 'VoIP Executive Desk Phone', type: 'phone', dept: 'Engineering & Dev', ip: '10.0.40.210', vlan: 'VLAN 40', desc: 'Cisco 8845 IP Phone running SIP protocol with dedicated voice QoS.' }
    ]
  },
  {
    step: 5,
    title: '🔗 Step 5: Physical Cabling & Link Interconnections',
    subtitle: 'Connect nodes with Cat6 copper, 10G optical fiber, and 802.1Q trunks.',
    tagline: 'Why this comes fifth:',
    explanation: 'Now connect the physical and logical links! Access endpoints connect to switches using molded Cat6 UTP copper cables (up to 100 meters at 1 Gbps). High-speed links between switches and servers use LC Single-Mode / Multi-Mode Optical Fiber SFP+ (10G/40G). Backbone switch-to-switch links carry multiple VLAN tags using 802.1Q Trunks.',
    recommended: []
  },
  {
    step: 6,
    title: '🧪 Step 6: Test Everything & Run Health Diagnostics',
    subtitle: 'Audit IP conflict sanity, verify default gateways, and trace live ping packets.',
    tagline: 'Why this comes sixth:',
    explanation: 'Before placing a network into production, network engineers execute ping sweeps, traceroute hops, and subnet audits. This verifies that workstations can reach their default gateway, queries resolve through DNS, packets traverse firewalls correctly, and no duplicate IP addresses exist.',
    recommended: []
  },
  {
    step: 7,
    title: '🗺️ Step 7: Real Map & PDF Blueprint Download',
    subtitle: 'Review the publication-grade 2D architectural blueprint map and download as PDF.',
    tagline: 'Why this concludes the build:',
    explanation: 'Your network is designed, wired, and verified! Review the live 2D architectural schematic map showing all device nodes, IP tags, cable media types, and department boundaries. Export the complete 4-page executive blueprint PDF including Bill of Materials (BOM), Interconnection Schedule, and Test Diagnostic Audit Report.',
    recommended: []
  }
];

export class NetworkBuilderManager {
  constructor({ graph, nodeVisuals, simulation, renderer, scene, camera, menuManager, applyTopologyCallback }) {
    this.graph = graph;
    this.nodeVisuals = nodeVisuals;
    this.simulation = simulation;
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.menuManager = menuManager;
    this.applyTopology = applyTopologyCallback;

    this.currentStepIdx = 0;
    this.activeTab = 'guide'; // 'guide' | 'devices' | 'cabling' | 'testing' | 'blueprint' | 'export'
    this.modal = null;
    this.pingLogHistory = [];

    this.initUI();
  }

  initUI() {
    this.modal = document.getElementById('network-builder-modal');
    if (!this.modal) return;

    // Tab buttons
    const tabBtns = this.modal.querySelectorAll('.builder-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
        sound.playClick();
      });
    });

    // Step Navigation buttons
    document.getElementById('btn-builder-prev-step')?.addEventListener('click', () => {
      if (this.currentStepIdx > 0) {
        this.currentStepIdx--;
        this.renderCurrentStep();
        sound.playClick();
      }
    });

    document.getElementById('btn-builder-next-step')?.addEventListener('click', () => {
      if (this.currentStepIdx < GUIDED_STEPS.length - 1) {
        this.currentStepIdx++;
        this.renderCurrentStep();
        sound.playClick();
      }
    });

    // Close button
    document.getElementById('btn-close-builder')?.addEventListener('click', () => {
      this.close();
      sound.playClick();
    });

    // Blank canvas button
    document.getElementById('btn-builder-blank-canvas')?.addEventListener('click', () => {
      if (confirm('Start from a clean blank canvas? This will wipe the current workspace so you can build your network step-by-step from scratch.')) {
        this.startBlankCanvas();
      }
    });

    // Starter template selector
    document.getElementById('select-starter-template')?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val) {
        this.loadStarterTemplate(val);
        e.target.value = '';
      }
    });

    // Quick Custom Device Add Button (inside Devices tab)
    document.getElementById('btn-builder-create-device')?.addEventListener('click', () => {
      this.handleCustomDeviceAdd();
    });

    // Cable Connect Button (inside Cabling tab)
    document.getElementById('btn-builder-connect-cables')?.addEventListener('click', () => {
      this.handleCableConnect();
    });

    // Auto-Connect Orphans Button
    document.getElementById('btn-builder-auto-wire')?.addEventListener('click', () => {
      this.autoConnectOrphans();
    });

    // Run Ping Test Button (inside Testing tab)
    document.getElementById('btn-builder-run-ping')?.addEventListener('click', () => {
      this.handleRunPing();
    });

    // Run Full Health Audit Button
    document.getElementById('btn-builder-run-audit')?.addEventListener('click', () => {
      this.renderHealthAudit();
      sound.playSuccess();
    });

    // Real Map Refresh Button
    document.getElementById('btn-refresh-real-map')?.addEventListener('click', () => {
      this.refreshRealMapPreview();
      sound.playClick();
    });

    // Real Map Download PNG Button
    document.getElementById('btn-download-map-png')?.addEventListener('click', () => {
      downloadSchematicMapImage(this.graph, 'enterprise-network-blueprint.png', {
        title: document.getElementById('pdf-project-title')?.value || 'ENTERPRISE NETWORK ARCHITECTURE BLUEPRINT',
        author: document.getElementById('pdf-project-author')?.value || 'Network Engineer'
      });
      sound.playSuccess();
    });

    // Download PDF Button
    document.getElementById('btn-builder-download-pdf')?.addEventListener('click', () => {
      this.handlePDFDownload();
    });

    // Device Type preview listener in Device tab
    const typeSelect = document.getElementById('builder-device-type');
    typeSelect?.addEventListener('change', () => this.updateDeviceFormPreview());
  }

  open(initialTab = 'guide') {
    if (!this.modal) return;
    this.modal.classList.remove('hidden');
    this.switchTab(initialTab);
    this.populateDeviceDropdowns();
    this.renderCurrentStep();
    sound.playSelect();
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
  }

  switchTab(tab) {
    this.activeTab = tab;
    // Update tab pills
    this.modal.querySelectorAll('.builder-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Show corresponding panel
    this.modal.querySelectorAll('.builder-tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `builder-panel-${tab}`);
    });

    this.populateDeviceDropdowns();

    if (tab === 'testing') {
      this.renderHealthAudit();
    } else if (tab === 'blueprint') {
      this.refreshRealMapPreview();
    } else if (tab === 'cabling') {
      this.renderCablingList();
    }
  }

  /**
   * Render the active guided step card
   */
  renderCurrentStep() {
    const stepData = GUIDED_STEPS[this.currentStepIdx];
    if (!stepData) return;

    // Update Step Indicators (1 to 7)
    const stepBubbles = document.getElementById('builder-step-bubbles');
    if (stepBubbles) {
      stepBubbles.innerHTML = GUIDED_STEPS.map((s, idx) => `
        <button class="step-bubble ${idx === this.currentStepIdx ? 'active' : idx < this.currentStepIdx ? 'completed' : ''}" data-step="${idx}" title="${s.title}">
          ${idx < this.currentStepIdx ? '✓' : idx + 1}
        </button>
      `).join('');

      stepBubbles.querySelectorAll('.step-bubble').forEach(btn => {
        btn.addEventListener('click', () => {
          this.currentStepIdx = parseInt(btn.dataset.step, 10);
          this.renderCurrentStep();
          sound.playClick();
        });
      });
    }

    // Step Header & Theory
    const titleEl = document.getElementById('builder-step-title');
    const subEl = document.getElementById('builder-step-sub');
    const theoryEl = document.getElementById('builder-step-theory');
    const cardsEl = document.getElementById('builder-step-cards');

    if (titleEl) titleEl.textContent = stepData.title;
    if (subEl) subEl.textContent = stepData.subtitle;
    if (theoryEl) {
      theoryEl.innerHTML = `
        <div class="theory-callout">
          <strong>💡 ${stepData.tagline}</strong>
          <p>${stepData.explanation}</p>
        </div>
      `;
    }

    // Step Action Cards / Recommendations
    if (cardsEl) {
      if (stepData.recommended.length > 0) {
        cardsEl.innerHTML = stepData.recommended.map((item, idx) => {
          // Check if device with this name or type exists
          const existing = Array.from(this.graph.nodes.values()).find(n => n.name === item.name || (n.type === item.type && n.department === item.dept));
          const isAdded = !!existing;

          return `
            <div class="step-rec-card ${isAdded ? 'added' : ''}">
              <div class="rec-card-header">
                <span class="rec-badge">${item.vlan}</span>
                <span class="rec-status">${isAdded ? '✅ Configured' : 'Recommended'}</span>
              </div>
              <strong class="rec-title">${item.name}</strong>
              <div class="rec-ip"><code>${item.ip}</code> • <span>${item.dept}</span></div>
              <p class="rec-desc">${item.desc}</p>
              <button class="btn-rec-action ${isAdded ? 'btn-already-added' : 'btn-primary-action'}" data-idx="${idx}">
                ${isAdded ? '✓ Added in Network' : '+ Add to Network in 3D'}
              </button>
            </div>
          `;
        }).join('');

        cardsEl.querySelectorAll('.btn-rec-action').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx, 10);
            const rec = stepData.recommended[idx];
            if (rec) {
              this.deployRecommendedDevice(rec);
            }
          });
        });
      } else if (stepData.step === 5) {
        // Cabling Step
        cardsEl.innerHTML = `
          <div class="step-interactive-box">
            <h4>Physical Cabling & Uplink Interconnections</h4>
            <p>Connect your devices together using appropriate physical media.</p>
            <div class="builder-quick-actions" style="margin-top: 14px; display:flex; gap:10px; flex-wrap:wrap;">
              <button id="btn-quick-to-cabling" class="btn-secondary btn-primary-action">🔗 Open Cable Connector Tool</button>
              <button id="btn-quick-auto-wire" class="btn-secondary">✨ Auto-Connect All Unlinked Devices</button>
            </div>
          </div>
        `;
        document.getElementById('btn-quick-to-cabling')?.addEventListener('click', () => this.switchTab('cabling'));
        document.getElementById('btn-quick-auto-wire')?.addEventListener('click', () => this.autoConnectOrphans());
      } else if (stepData.step === 6) {
        // Testing Step
        cardsEl.innerHTML = `
          <div class="step-interactive-box">
            <h4>Live Network Verification & Packet Tracer</h4>
            <p>Run automated IP conflict checks, verify gateway reachability, and trace live ping packets across the 3D topology.</p>
            <div class="builder-quick-actions" style="margin-top: 14px; display:flex; gap:10px; flex-wrap:wrap;">
              <button id="btn-quick-to-testing" class="btn-secondary btn-primary-action">⚡ Open Testing & Ping Suite</button>
            </div>
          </div>
        `;
        document.getElementById('btn-quick-to-testing')?.addEventListener('click', () => this.switchTab('testing'));
      } else if (stepData.step === 7) {
        // Real Map & PDF Download Step
        cardsEl.innerHTML = `
          <div class="step-interactive-box">
            <h4>Real Architectural Map & Blueprint PDF</h4>
            <p>Your network is complete! Inspect the 2D architectural blueprint map and download the comprehensive 4-page PDF engineering report.</p>
            <div class="builder-quick-actions" style="margin-top: 14px; display:flex; gap:10px; flex-wrap:wrap;">
              <button id="btn-quick-to-map" class="btn-secondary btn-primary-action">🗺️ View 2D Real Map</button>
              <button id="btn-quick-download-pdf" class="btn-secondary">📄 Download Blueprint PDF</button>
            </div>
          </div>
        `;
        document.getElementById('btn-quick-to-map')?.addEventListener('click', () => this.switchTab('blueprint'));
        document.getElementById('btn-quick-download-pdf')?.addEventListener('click', () => this.handlePDFDownload());
      }
    }

    // Step navigation buttons state
    const prevBtn = document.getElementById('btn-builder-prev-step');
    const nextBtn = document.getElementById('btn-builder-next-step');
    if (prevBtn) prevBtn.disabled = (this.currentStepIdx === 0);
    if (nextBtn) {
      nextBtn.textContent = (this.currentStepIdx === GUIDED_STEPS.length - 1) ? 'Done Building ✓' : 'Next Step ▶';
    }
  }

  /**
   * 1-Click deploy recommended hardware into 3D scene & graph
   */
  deployRecommendedDevice(rec) {
    const id = 'dev_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 3);

    // Compute nice spatial coordinates in 3D based on department & role
    const tier = (rec.type === 'internet' || rec.type === 'cloud') ? 0
      : (rec.type === 'firewall' || rec.type === 'vpn') ? 1
      : (rec.type === 'switch' || rec.type === 'router') ? 2
      : 3;

    const posY = 1.0 + (3 - tier) * 0.45;
    const posX = (Math.random() - 0.5) * 2.8;
    const posZ = -1.0;

    const nodeData = {
      id,
      name: rec.name,
      type: rec.type,
      department: rec.dept,
      subnet: rec.vlan || rec.dept,
      ip: rec.ip,
      gateway: (rec.type === 'router' || rec.type === 'firewall') ? rec.ip : '10.0.0.1',
      vlan: rec.vlan || 'VLAN 1',
      position: [Number(posX.toFixed(2)), Number(posY.toFixed(2)), posZ]
    };

    this.graph.addNode(nodeData);
    this.nodeVisuals.addSingleNode(nodeData);

    // Auto-uplink to logical neighbor if applicable
    if (rec.type === 'firewall') {
      const internet = Array.from(this.graph.nodes.values()).find(n => n.type === 'internet');
      if (internet) this.connectNodesDirect(internet.id, id, 'Fiber Optic SFP+ (10G)');
    } else if (rec.type === 'switch') {
      const firewall = Array.from(this.graph.nodes.values()).find(n => n.type === 'firewall');
      if (firewall) this.connectNodesDirect(firewall.id, id, '802.1Q Trunk (40G)');
    } else if (rec.type === 'server' || rec.type === 'database' || rec.type === 'hypervisor') {
      const coreSw = Array.from(this.graph.nodes.values()).find(n => n.type === 'switch');
      if (coreSw) this.connectNodesDirect(coreSw.id, id, 'Fiber Optic SFP+ (10G)');
    }

    sound.playSuccess();
    this.menuManager.setStatus(`Added [${rec.name}] (${rec.ip}) to network!`, 'success');
    this.renderCurrentStep();
    this.populateDeviceDropdowns();
  }

  /**
   * Directly add link between two nodes
   */
  connectNodesDirect(fromId, toId, mediaType = 'Cat6 Copper UTP (1G)') {
    if (!fromId || !toId || fromId === toId) return;
    const linkId = `link-${fromId}-${toId}`;

    // Avoid duplicate links
    const exists = this.graph.links.some(l => (l.from === fromId && l.to === toId) || (l.from === toId && l.to === fromId));
    if (exists) return;

    const linkData = {
      id: linkId,
      from: fromId,
      to: toId,
      media: mediaType,
      speed: mediaType.includes('10G') ? '10 Gbps' : mediaType.includes('40G') ? '40 Gbps' : '1 Gbps',
      status: 'up'
    };

    this.graph.addLink(fromId, toId, linkId, linkData);
    this.nodeVisuals.addSingleLink(linkData);
  }

  /**
   * Handle Custom Device Add from form
   */
  handleCustomDeviceAdd() {
    const nameInput = document.getElementById('builder-custom-name');
    const typeSelect = document.getElementById('builder-device-type');
    const deptSelect = document.getElementById('builder-device-dept');
    const ipInput = document.getElementById('builder-custom-ip');
    const vlanInput = document.getElementById('builder-custom-vlan');

    const name = nameInput?.value.trim() || 'Custom Network Device';
    const type = typeSelect?.value || 'desktop';
    const department = deptSelect?.value || 'IT & Infrastructure';
    const ip = ipInput?.value.trim() || `10.0.${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 250) + 1}`;
    const vlan = vlanInput?.value.trim() || 'VLAN 10';
    const id = 'dev_' + Date.now().toString(36);

    const nodePos = [
      Number(((Math.random() - 0.5) * 3.2).toFixed(2)),
      Number((1.1 + Math.random() * 0.9).toFixed(2)),
      -1.0
    ];

    const nodeData = {
      id,
      name,
      type,
      department,
      subnet: department,
      ip,
      vlan,
      gateway: ip.split('.').slice(0, 3).join('.') + '.1',
      position: nodePos
    };

    this.graph.addNode(nodeData);
    this.nodeVisuals.addSingleNode(nodeData);

    this.menuManager.setStatus(`Added [${name}] (${type.toUpperCase()}) at ${ip}! Hold Shift+Drag in 3D to reposition.`, 'success');
    sound.playSuccess();

    if (nameInput) nameInput.value = '';
    this.populateDeviceDropdowns();
    this.renderCurrentStep();
  }

  /**
   * Handle Cable Connect from dropdowns
   */
  handleCableConnect() {
    const srcSelect = document.getElementById('cable-src-select');
    const dstSelect = document.getElementById('cable-dst-select');
    const mediaSelect = document.getElementById('cable-media-select');

    const srcId = srcSelect?.value;
    const dstId = dstSelect?.value;
    const media = mediaSelect?.value || 'Cat6 Copper UTP (1G)';

    if (!srcId || !dstId) {
      alert('Please select both Source and Destination devices to connect.');
      return;
    }
    if (srcId === dstId) {
      alert('Source and Destination cannot be the same device.');
      return;
    }

    const srcNode = this.graph.nodes.get(srcId);
    const dstNode = this.graph.nodes.get(dstId);

    this.connectNodesDirect(srcId, dstId, media);
    this.menuManager.setStatus(`Connected [${srcNode?.name}] ↔ [${dstNode?.name}] via ${media}!`, 'success');
    sound.playSuccess();

    this.renderCablingList();
    this.renderCurrentStep();
  }

  /**
   * Auto-Connect all orphan / unlinked endpoints to nearest switch
   */
  autoConnectOrphans() {
    const nodes = Array.from(this.graph.nodes.values());
    const switches = nodes.filter(n => n.type === 'switch' || n.type === 'router');

    if (switches.length === 0) {
      alert('No Core Switch or Router found in your network! Please add a Core Switch first (Step 2).');
      return;
    }

    const coreSwitch = switches[0];
    let connectedCount = 0;

    nodes.forEach(n => {
      if (n.id === coreSwitch.id) return;
      const hasLink = this.graph.links.some(l => l.from === n.id || l.to === n.id);
      if (!hasLink) {
        const media = (n.type === 'server' || n.type === 'hypervisor' || n.type === 'database')
          ? 'Fiber Optic SFP+ (10G)'
          : (n.type === 'wap' || n.type === 'laptop')
          ? 'Wireless 5GHz Wi-Fi 6'
          : 'Cat6 Copper UTP (1G)';

        this.connectNodesDirect(coreSwitch.id, n.id, media);
        connectedCount++;
      }
    });

    if (connectedCount > 0) {
      this.menuManager.setStatus(`✨ Auto-Wired ${connectedCount} unconnected endpoint(s) to [${coreSwitch.name}]!`, 'success');
      sound.playSuccess();
      this.renderCablingList();
      this.renderCurrentStep();
    } else {
      this.menuManager.setStatus('All devices are already fully connected!', 'info');
      sound.playClick();
    }
  }

  /**
   * Run Interactive Ping Test
   */
  handleRunPing() {
    const srcSelect = document.getElementById('ping-src-select');
    const dstSelect = document.getElementById('ping-dst-select');
    const protoSelect = document.getElementById('ping-proto-select');

    const srcId = srcSelect?.value;
    const dstId = dstSelect?.value;
    const proto = protoSelect?.value || 'icmp';

    if (!srcId || !dstId) {
      alert('Please select both Source and Destination devices.');
      return;
    }
    if (srcId === dstId) {
      alert('Source and Destination cannot be the same device.');
      return;
    }

    const srcNode = this.graph.nodes.get(srcId);
    const dstNode = this.graph.nodes.get(dstId);
    const path = this.graph.shortestPath(srcId, dstId);

    const termEl = document.getElementById('ping-terminal-output');
    if (!termEl) return;

    if (!path || path.length < 2) {
      termEl.innerHTML = `
        <div class="terminal-line err">PING ${dstNode?.ip || 'target'}: Destination Host Unreachable.</div>
        <div class="terminal-line muted">No valid physical cabling route exists between [${srcNode?.name}] and [${dstNode?.name}].</div>
        <div class="terminal-line info">💡 Hint: Go to Step 5 (Cabling) or use "Auto-Wire All Unconnected Devices".</div>
      `;
      sound.playError();
      return;
    }

    // Trigger live 3D packet simulation
    if (this.simulation && this.simulation.runDirectTrace) {
      this.simulation.runDirectTrace(srcId, dstId, proto === 'icmp' ? 'http' : proto);
    }

    const hopNames = path.map(id => this.graph.nodes.get(id)?.name || id).join(' ➔ ');
    const rtt = (path.length * 1.2 + Math.random() * 0.8).toFixed(1);

    const logEntry = {
      src: srcNode?.name || srcId,
      dst: dstNode?.name || dstId,
      proto: proto.toUpperCase(),
      rtt: `${rtt} ms`,
      status: 'SUCCESS (5/5)'
    };
    this.pingLogHistory.unshift(logEntry);

    termEl.innerHTML = `
      <div class="terminal-line success">Type escape sequence to abort.</div>
      <div class="terminal-line">Sending 5, 100-byte ICMP Echos to ${dstNode?.ip}, timeout is 2 seconds:</div>
      <div class="terminal-line bold" style="color: #10b981;">!!!!!</div>
      <div class="terminal-line">Success rate is 100 percent (5/5), round-trip min/avg/max = ${(rtt * 0.8).toFixed(1)}/${rtt}/${(rtt * 1.3).toFixed(1)} ms</div>
      <div class="terminal-line muted">Hop Route: ${hopNames}</div>
      <div class="terminal-line info">Status: 200 OK • Transmission media validated.</div>
    `;

    sound.playSuccess();
    this.renderPingHistory();
  }

  /**
   * Render Automated Health & Sanity Audit
   */
  renderHealthAudit() {
    const diagnostics = auditNetworkHealth(this.graph);

    const scoreNum = document.getElementById('audit-score-num');
    const scoreGrade = document.getElementById('audit-score-grade');
    const checkListEl = document.getElementById('audit-checks-list');

    if (scoreNum) scoreNum.textContent = `${diagnostics.score}%`;
    if (scoreGrade) scoreGrade.textContent = diagnostics.grade;

    if (checkListEl) {
      checkListEl.innerHTML = diagnostics.checks.map(c => `
        <div class="audit-check-card ${c.status.toLowerCase()}">
          <div class="audit-check-header">
            <span class="badge-${c.status.toLowerCase()}">${c.status}</span>
            <strong>${c.name}</strong>
          </div>
          <div class="audit-check-desc">${c.detail}</div>
        </div>
      `).join('');
    }
  }

  /**
   * Render Cabling links table
   */
  renderCablingList() {
    const listEl = document.getElementById('cabling-links-table-body');
    if (!listEl) return;

    const links = this.graph.links || [];
    if (links.length === 0) {
      listEl.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:18px; color:#94a3b8;">No cables connected yet. Select Source and Destination above to connect!</td></tr>`;
      return;
    }

    listEl.innerHTML = links.map((l, idx) => {
      const src = this.graph.nodes.get(l.from);
      const dst = this.graph.nodes.get(l.to);
      return `
        <tr>
          <td><code>${l.id}</code></td>
          <td><strong>${src?.name || l.from}</strong> <span class="muted">(${src?.ip || 'N/A'})</span></td>
          <td><strong>${dst?.name || l.to}</strong> <span class="muted">(${dst?.ip || 'N/A'})</span></td>
          <td><span class="media-badge">${l.media || 'Cat6 Copper UTP'}</span></td>
          <td><button class="btn-delete-link" data-id="${l.id}" title="Remove link">🗑️</button></td>
        </tr>
      `;
    }).join('');

    listEl.querySelectorAll('.btn-delete-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        this.graph.removeLink(id);
        this.nodeVisuals.removeSingleLink(id);
        sound.playClick();
        this.renderCablingList();
        this.renderCurrentStep();
      });
    });
  }

  /**
   * Render Ping history log
   */
  renderPingHistory() {
    const tableBody = document.getElementById('ping-history-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = this.pingLogHistory.slice(0, 5).map(p => `
      <tr>
        <td>${p.src}</td>
        <td>${p.dst}</td>
        <td><code>${p.proto}</code></td>
        <td>${p.rtt}</td>
        <td><span style="color:#10b981; font-weight:bold;">${p.status}</span></td>
      </tr>
    `).join('');
  }

  /**
   * Refresh Real 2D Architectural Schematic Map in preview tab
   */
  refreshRealMapPreview() {
    const container = document.getElementById('real-map-canvas-container');
    if (!container) return;

    container.innerHTML = '';
    const canvas = generateSchematicMap(this.graph, {
      title: document.getElementById('pdf-project-title')?.value || 'ENTERPRISE NETWORK ARCHITECTURE & TOPOLOGY BLUEPRINT',
      author: document.getElementById('pdf-project-author')?.value || 'Network Engineer',
      width: 1600,
      height: 980
    });
    canvas.className = 'real-schematic-canvas';
    container.appendChild(canvas);
  }

  /**
   * Download the Real Map & Blueprint PDF
   */
  handlePDFDownload() {
    const title = document.getElementById('pdf-project-title')?.value.trim() || 'ENTERPRISE NETWORK ARCHITECTURE BLUEPRINT';
    const author = document.getElementById('pdf-project-author')?.value.trim() || 'Network Engineer';

    this.menuManager.setStatus('Generating high-resolution 4-Page Network Blueprint PDF report...', 'warning');

    const ok = exportNetworkToPDF({
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      graph: this.graph,
      diagnosticResults: auditNetworkHealth(this.graph),
      title,
      author
    });

    if (ok) {
      this.menuManager.setStatus('Network Blueprint PDF downloaded successfully!', 'success');
    }
  }

  /**
   * Populate Source and Destination dropdowns across all tabs
   */
  populateDeviceDropdowns() {
    const nodes = Array.from(this.graph.nodes.values());
    const optionsHtml = nodes.map(n => `<option value="${n.id}">${n.name} (${n.ip} - ${n.type.toUpperCase()})</option>`).join('');

    const cableSrc = document.getElementById('cable-src-select');
    const cableDst = document.getElementById('cable-dst-select');
    const pingSrc = document.getElementById('ping-src-select');
    const pingDst = document.getElementById('ping-dst-select');

    if (cableSrc) cableSrc.innerHTML = optionsHtml;
    if (cableDst) cableDst.innerHTML = optionsHtml;
    if (pingSrc) pingSrc.innerHTML = optionsHtml;
    if (pingDst) pingDst.innerHTML = optionsHtml;

    if (cableDst && nodes.length > 1) cableDst.selectedIndex = 1;
    if (pingDst && nodes.length > 1) pingDst.selectedIndex = Math.min(2, nodes.length - 1);
  }

  /**
   * Update thumbnail preview in Custom Device Add tab
   */
  updateDeviceFormPreview() {
    const typeSelect = document.getElementById('builder-device-type');
    const canvas = document.getElementById('builder-form-icon-preview');
    if (!typeSelect || !canvas) return;

    const type = typeSelect.value || 'desktop';
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.nodeVisuals.drawDeviceThumbnail(ctx, type, 4, 4, 72, 72);
  }

  /**
   * Wipe canvas and start blank
   */
  startBlankCanvas() {
    // Start with a single root Internet Gateway so the user has the base WAN edge
    const blankData = {
      nodes: [
        {
          id: 'inet_wan',
          name: 'Internet ISP Gateway (WAN)',
          type: 'internet',
          department: 'DMZ & Perimeter',
          ip: '203.0.113.1',
          gateway: '203.0.113.254',
          vlan: 'WAN',
          position: [0, 2.2, -1.0]
        }
      ],
      links: []
    };

    if (this.applyTopology) {
      this.applyTopology(blankData);
    }

    this.currentStepIdx = 0;
    this.switchTab('guide');
    this.renderCurrentStep();
    this.populateDeviceDropdowns();
    this.menuManager.setStatus('Started with clean Blank Canvas! Follow Step 1 to deploy Perimeter Defense.', 'info');
    sound.playSelect();
  }

  /**
   * Load curated starter templates
   */
  loadStarterTemplate(templateName) {
    let tData = null;

    if (templateName === 'small_office') {
      tData = {
        nodes: [
          { id: 'inet', name: 'Internet WAN Gateway', type: 'internet', department: 'DMZ & Perimeter', ip: '203.0.113.1', vlan: 'WAN', position: [0, 2.3, -1.0] },
          { id: 'fw', name: 'Office Next-Gen Firewall', type: 'firewall', department: 'DMZ & Perimeter', ip: '192.168.1.1', vlan: 'DMZ', position: [0, 1.8, -1.0] },
          { id: 'core_sw', name: 'Branch Gigabit Switch', type: 'switch', department: 'IT & Infrastructure', ip: '192.168.1.2', vlan: 'VLAN 1', position: [0, 1.3, -1.0] },
          { id: 'srv_nas', name: 'Office File & Backup Server', type: 'server', department: 'Data Center', ip: '192.168.1.50', vlan: 'VLAN 10', position: [-1.2, 0.8, -1.0] },
          { id: 'pc_admin', name: 'Admin Workstation', type: 'desktop', department: 'Finance & Accounting', ip: '192.168.1.101', vlan: 'VLAN 1', position: [-0.4, 0.7, -1.0] },
          { id: 'pc_sales', name: 'Sales Laptop', type: 'laptop', department: 'Sales & Marketing', ip: '192.168.1.102', vlan: 'VLAN 1', position: [0.4, 0.7, -1.0] },
          { id: 'prn_office', name: 'Office Laser Printer', type: 'printer', department: 'Finance & Accounting', ip: '192.168.1.200', vlan: 'VLAN 1', position: [1.2, 0.8, -1.0] }
        ],
        links: [
          { id: 'l1', from: 'inet', to: 'fw', media: 'Fiber Optic SFP+ (10G)', speed: '10 Gbps', status: 'up' },
          { id: 'l2', from: 'fw', to: 'core_sw', media: '802.1Q Trunk (40G)', speed: '40 Gbps', status: 'up' },
          { id: 'l3', from: 'core_sw', to: 'srv_nas', media: 'Cat6 Copper UTP (1G)', speed: '1 Gbps', status: 'up' },
          { id: 'l4', from: 'core_sw', to: 'pc_admin', media: 'Cat6 Copper UTP (1G)', speed: '1 Gbps', status: 'up' },
          { id: 'l5', from: 'core_sw', to: 'pc_sales', media: 'Wireless 5GHz Wi-Fi 6', speed: '1 Gbps', status: 'up' },
          { id: 'l6', from: 'core_sw', to: 'prn_office', media: 'Cat6 Copper UTP (1G)', speed: '1 Gbps', status: 'up' }
        ]
      };
    } else if (templateName === 'enterprise_campus') {
      tData = {
        nodes: [
          { id: 'inet', name: 'Tier-1 ISP Internet Gateway', type: 'internet', department: 'DMZ & Perimeter', ip: '203.0.113.1', vlan: 'WAN', position: [0, 2.4, -1.0] },
          { id: 'fw_pri', name: 'NGFW Primary Firewall', type: 'firewall', department: 'DMZ & Perimeter', ip: '10.0.0.1', vlan: 'DMZ', position: [-0.6, 1.9, -1.0] },
          { id: 'vpn_gw', name: 'IPsec VPN Concentrator', type: 'vpn', department: 'DMZ & Perimeter', ip: '10.0.0.2', vlan: 'DMZ', position: [0.6, 1.9, -1.0] },
          { id: 'core_sw1', name: 'Core L3 Switch 01', type: 'switch', department: 'IT & Infrastructure', ip: '10.0.1.1', vlan: 'VLAN 1', position: [-0.6, 1.4, -1.0] },
          { id: 'core_sw2', name: 'Core L3 Switch 02', type: 'switch', department: 'IT & Infrastructure', ip: '10.0.1.2', vlan: 'VLAN 1', position: [0.6, 1.4, -1.0] },
          { id: 'srv_web', name: 'Corporate Web Server', type: 'server', department: 'Data Center', ip: '10.0.10.10', vlan: 'VLAN 10', position: [-1.4, 0.8, -1.0] },
          { id: 'srv_db', name: 'Database Cluster (Primary SQL)', type: 'database', department: 'Data Center', ip: '10.0.10.20', vlan: 'VLAN 10', position: [-0.7, 0.8, -1.0] },
          { id: 'pc_eng', name: 'Engineering Dev PC', type: 'desktop', department: 'Engineering & Dev', ip: '10.0.40.101', vlan: 'VLAN 40', position: [0.0, 0.8, -1.0] },
          { id: 'pc_fin', name: 'Finance Accounting PC', type: 'desktop', department: 'Finance & Accounting', ip: '10.0.30.101', vlan: 'VLAN 30', position: [0.7, 0.8, -1.0] },
          { id: 'prn_fin', name: 'Finance Color Laser Printer', type: 'printer', department: 'Finance & Accounting', ip: '10.0.30.202', vlan: 'VLAN 30', position: [1.4, 0.8, -1.0] }
        ],
        links: [
          { id: 'l1', from: 'inet', to: 'fw_pri', media: 'Fiber Optic SFP+ (10G)', speed: '10 Gbps', status: 'up' },
          { id: 'l2', from: 'inet', to: 'vpn_gw', media: 'Fiber Optic SFP+ (10G)', speed: '10 Gbps', status: 'up' },
          { id: 'l3', from: 'fw_pri', to: 'core_sw1', media: '802.1Q Trunk (40G)', speed: '40 Gbps', status: 'up' },
          { id: 'l4', from: 'vpn_gw', to: 'core_sw2', media: '802.1Q Trunk (40G)', speed: '40 Gbps', status: 'up' },
          { id: 'l5', from: 'core_sw1', to: 'core_sw2', media: '802.1Q Trunk (40G)', speed: '40 Gbps', status: 'up' },
          { id: 'l6', from: 'core_sw1', to: 'srv_web', media: 'Fiber Optic SFP+ (10G)', speed: '10 Gbps', status: 'up' },
          { id: 'l7', from: 'core_sw1', to: 'srv_db', media: 'Fiber Optic SFP+ (10G)', speed: '10 Gbps', status: 'up' },
          { id: 'l8', from: 'core_sw2', to: 'pc_eng', media: 'Cat6 Copper UTP (1G)', speed: '1 Gbps', status: 'up' },
          { id: 'l9', from: 'core_sw2', to: 'pc_fin', media: 'Cat6 Copper UTP (1G)', speed: '1 Gbps', status: 'up' },
          { id: 'l10', from: 'core_sw2', to: 'prn_fin', media: 'Cat6 Copper UTP (1G)', speed: '1 Gbps', status: 'up' }
        ]
      };
    }

    if (tData && this.applyTopology) {
      this.applyTopology(tData);
      this.currentStepIdx = 0;
      this.renderCurrentStep();
      this.populateDeviceDropdowns();
      this.menuManager.setStatus(`Loaded [${templateName.replace('_', ' ').toUpperCase()}] starter template!`, 'success');
      sound.playSuccess();
    }
  }
}
