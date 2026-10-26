/**
 * schematic_map.js - 2D High-Resolution Architectural Network Topology Blueprint Renderer
 *
 * Generates an executive, publication-grade 2D network diagram:
 * - Hierarchical tier zoning (Internet WAN -> Firewall/Edge -> Core/L3 -> Access/VLAN -> Endpoints)
 * - Department clustering with glowing boundary containers
 * - Hardware device cards with custom thumbnails, role badges, IP chips & VLAN tags
 * - Color-coded physical cabling lines (Cat6 Copper, Fiber Optic, 802.1Q Trunk, Wireless)
 * - Renders to offscreen high-DPI canvas for direct UI preview, PNG download & jsPDF embedding
 */

import { NODE_TYPES } from './graph.js';
import { drawPhotorealisticHardwarePhoto } from './hardware_textures.js';

// Color palette for hardware roles & cable media
const ROLE_COLORS = {
  internet:     { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)',  badge: '#0284c7', label: 'WAN GATEWAY' },
  cloud:        { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)',  badge: '#0284c7', label: 'CLOUD SAAS' },
  cloud_vpc:    { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)',  badge: '#0284c7', label: 'CLOUD VPC' },
  firewall:     { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.14)',   badge: '#dc2626', label: 'FIREWALL' },
  vpn:          { border: '#f97316', bg: 'rgba(249, 115, 22, 0.14)',  badge: '#ea580c', label: 'VPN CONC' },
  router:       { border: '#0284c7', bg: 'rgba(2, 132, 199, 0.14)',   badge: '#0369a1', label: 'ROUTER' },
  switch:       { border: '#10b981', bg: 'rgba(16, 185, 129, 0.14)',  badge: '#059669', label: 'SWITCH' },
  server:       { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.14)',  badge: '#7c3aed', label: 'SERVER' },
  hypervisor:   { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.14)',  badge: '#6d28d9', label: 'HYPERVISOR' },
  vm:           { border: '#c084fc', bg: 'rgba(192, 132, 252, 0.14)', badge: '#9333ea', label: 'GUEST VM' },
  container:    { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.14)',   badge: '#0891b2', label: 'CONTAINER' },
  database:     { border: '#ec4899', bg: 'rgba(236, 72, 153, 0.14)',  badge: '#db2777', label: 'DATABASE' },
  loadbalancer: { border: '#eab308', bg: 'rgba(234, 179, 8, 0.14)',   badge: '#ca8a04', label: 'LOAD BAL' },
  desktop:      { border: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.12)',  badge: '#0284c7', label: 'DESKTOP' },
  pc:           { border: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.12)',  badge: '#0284c7', label: 'DESKTOP' },
  laptop:       { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)',   badge: '#0891b2', label: 'LAPTOP' },
  printer:      { border: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', badge: '#64748b', label: 'PRINTER' },
  wap:          { border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)',   badge: '#e11d48', label: 'WI-FI 6 AP' },
  phone:        { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)',  badge: '#d97706', label: 'VOIP PHONE' },
  iot:          { border: '#84cc16', bg: 'rgba(132, 204, 22, 0.12)',  badge: '#65a30d', label: 'IOT SENSOR' }
};

const DEPT_THEMES = {
  'DMZ & Perimeter':        { color: '#ef4444', label: '🛡️ DMZ & Security Perimeter', vlan: 'VLAN 10' },
  'Data Center':            { color: '#a855f7', label: '🖥️ Data Center & Core Services', vlan: 'VLAN 20' },
  'IT & Infrastructure':    { color: '#0284c7', label: '⚙️ IT Operations & Core Network', vlan: 'VLAN 1' },
  'Engineering & Dev':      { color: '#10b981', label: '⚡ Engineering & Development', vlan: 'VLAN 40' },
  'Finance & Accounting':   { color: '#f59e0b', label: '💰 Finance & Accounting', vlan: 'VLAN 30' },
  'Human Resources (HR)':   { color: '#ec4899', label: '👥 Human Resources', vlan: 'VLAN 50' },
  'Sales & Marketing':      { color: '#06b6d4', label: '📈 Sales & Marketing', vlan: 'VLAN 60' },
  'Operations & OT':        { color: '#84cc16', label: '🏭 Operations & OT Logistics', vlan: 'VLAN 70' },
  'Executive Suite':        { color: '#eab308', label: '👑 Executive Boardroom', vlan: 'VLAN 99' }
};

/**
 * Render the full 2D schematic map to an offscreen high-res canvas
 * @param {Object} graph - Graph instance with .nodes and .links
 * @param {Object} options - Custom canvas configuration
 * @returns {HTMLCanvasElement}
 */
export function generateSchematicMap(graph, options = {}) {
  const width = options.width || 1800;
  const height = options.height || 1100;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  renderSchematicMapToCanvas(canvas, graph, options);
  return canvas;
}

/**
 * Render schematic map onto an existing canvas
 */
export function renderSchematicMapToCanvas(canvas, graph, options = {}) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // 1. Draw Blueprint Background
  drawBlueprintBackground(ctx, w, h);

  const rawNodes = Array.from(graph.nodes.values());
  const links = graph.links || [];

  if (rawNodes.length === 0) {
    drawEmptyState(ctx, w, h);
    return;
  }

  // 2. Assign Hierarchical Architectural Tiers
  // Tier 0: Internet / Cloud / WAN (Top)
  // Tier 1: Firewall / VPN
  // Tier 2: Core Routers / Distribution L3 Switches
  // Tier 3: Access Switches / WAPs
  // Tier 4: Servers & Endpoints (Desktops, Laptops, Printers, Phones, VMs)
  const nodeLayoutMap = calculateNodeLayout(rawNodes, w, h);

  // 3. Draw Department Bounding Halo Zones (if multiple nodes in dept)
  drawDepartmentZones(ctx, rawNodes, nodeLayoutMap);

  // 4. Draw Connection Links / Cables with Port Markers
  drawSchematicLinks(ctx, links, nodeLayoutMap);

  // 5. Draw Hardware Device Cards with Icons, IP Chips & Status
  drawDeviceCards(ctx, rawNodes, nodeLayoutMap);

  // 6. Draw Executive Header Banner & Diagnostics Metadata
  drawHeaderBanner(ctx, w, rawNodes.length, links.length, options);

  // 7. Draw Bottom Media Legend
  drawBottomLegend(ctx, w, h);
}

/**
 * Blueprint tech background with subtle coordinate grid
 */
function drawBlueprintBackground(ctx, w, h) {
  // Deep blueprint gradient
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#0d1527');
  bgGrad.addColorStop(1, '#070b13');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Corner tech crosshairs
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
  ctx.lineWidth = 2;
  const chSize = 16;
  const corners = [[30, 30], [w - 30, 30], [30, h - 30], [w - 30, h - 30]];
  for (const [cx, cy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx - chSize, cy); ctx.lineTo(cx + chSize, cy);
    ctx.moveTo(cx, cy - chSize); ctx.lineTo(cx, cy + chSize);
    ctx.stroke();
  }
}

/**
 * Empty Canvas state
 */
function drawEmptyState(ctx, w, h) {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Canvas is Blank — No Network Devices Found', w / 2, h / 2 - 20);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px -apple-system, sans-serif';
  ctx.fillText('Click "+ Add Device" or launch the Step-by-Step Guided Network Builder to start.', w / 2, h / 2 + 15);
}

/**
 * Determine architectural Tier index for a device
 */
function getDeviceTier(type) {
  const t = (type || 'desktop').toLowerCase();
  if (['internet', 'cloud', 'cloud_vpc'].includes(t)) return 0;
  if (['firewall', 'vpn'].includes(t)) return 1;
  if (['router', 'loadbalancer'].includes(t)) return 2;
  if (['switch', 'wap'].includes(t)) return 3;
  // All endpoints: servers, hypervisors, vms, desktops, laptops, printers, phones, iot
  return 4;
}

/**
 * Calculate positions for each node across 5 architectural tiers
 */
function calculateNodeLayout(nodes, w, h) {
  const layout = new Map();

  // Group nodes by tier
  const tiers = [[], [], [], [], []];
  nodes.forEach(node => {
    const tier = getDeviceTier(node.type);
    tiers[tier].push(node);
  });

  // Sort endpoints by department to keep department devices grouped together
  tiers[4].sort((a, b) => (a.department || '').localeCompare(b.department || ''));

  // Define tier Y coordinates
  const topMargin = 110;
  const bottomMargin = 90;
  const availableH = h - topMargin - bottomMargin;
  const tierY = [
    topMargin + availableH * 0.08,  // Tier 0: WAN / Internet
    topMargin + availableH * 0.25,  // Tier 1: Firewall
    topMargin + availableH * 0.44,  // Tier 2: Core Routers
    topMargin + availableH * 0.64,  // Tier 3: Switches / WAPs
    topMargin + availableH * 0.88   // Tier 4: Endpoints / Servers
  ];

  // Card dimensions
  const cardW = 190;
  const cardH = 72;

  tiers.forEach((tierNodes, tierIdx) => {
    const count = tierNodes.length;
    if (count === 0) return;

    const y = tierY[tierIdx];
    const sideMargin = 90;
    const availableW = w - sideMargin * 2;

    if (count === 1) {
      layout.set(tierNodes[0].id, {
        x: w / 2,
        y: y,
        w: cardW,
        h: cardH,
        node: tierNodes[0]
      });
    } else {
      const step = availableW / (count + 1);
      tierNodes.forEach((node, idx) => {
        layout.set(node.id, {
          x: sideMargin + step * (idx + 1),
          y: y,
          w: cardW,
          h: cardH,
          node: node
        });
      });
    }
  });

  return layout;
}

/**
 * Draw department boundary boxes around department endpoints
 */
function drawDepartmentZones(ctx, nodes, layout) {
  // Collect positions per department for endpoints
  const deptBounds = {};
  nodes.forEach(n => {
    const tier = getDeviceTier(n.type);
    if (tier !== 4) return; // Only group endpoints

    const dept = n.department || 'IT & Infrastructure';
    const pos = layout.get(n.id);
    if (!pos) return;

    if (!deptBounds[dept]) {
      deptBounds[dept] = { minX: pos.x - pos.w / 2, maxX: pos.x + pos.w / 2, minY: pos.y - pos.h / 2, maxY: pos.y + pos.h / 2 };
    } else {
      deptBounds[dept].minX = Math.min(deptBounds[dept].minX, pos.x - pos.w / 2);
      deptBounds[dept].maxX = Math.max(deptBounds[dept].maxX, pos.x + pos.w / 2);
      deptBounds[dept].minY = Math.min(deptBounds[dept].minY, pos.y - pos.h / 2);
      deptBounds[dept].maxY = Math.max(deptBounds[dept].maxY, pos.y + pos.h / 2);
    }
  });

  // Draw translucent department containers
  for (const [dept, b] of Object.entries(deptBounds)) {
    const theme = DEPT_THEMES[dept] || { color: '#0ea5e9', label: dept, vlan: 'VLAN' };
    const pad = 14;
    const bx = b.minX - pad;
    const by = b.minY - pad - 18;
    const bw = (b.maxX - b.minX) + pad * 2;
    const bh = (b.maxY - b.minY) + pad * 2 + 18;

    ctx.save();
    // Translucent background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.strokeStyle = theme.color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);

    drawRoundedRect(ctx, bx, by, bw, bh, 8, true, true);
    ctx.setLineDash([]);

    // Department Header Pill
    ctx.fillStyle = theme.color;
    ctx.font = 'bold 11px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${theme.label} [${theme.vlan}]`, bx + 10, by + 13);
    ctx.restore();
  }
}

/**
 * Draw connection cables with media styles & port indicators
 */
function drawSchematicLinks(ctx, links, layout) {
  links.forEach(link => {
    const p1 = layout.get(link.from);
    const p2 = layout.get(link.to);
    if (!p1 || !p2) return;

    const x1 = p1.x;
    const y1 = p1.y + p1.h / 2;
    const x2 = p2.x;
    const y2 = p2.y - p2.h / 2;

    const mediaType = (link.media || link.type || 'cat6').toLowerCase();
    const isFiber = mediaType.includes('fiber') || mediaType.includes('sfp');
    const isTrunk = mediaType.includes('trunk');
    const isWireless = mediaType.includes('wireless') || mediaType.includes('wifi');

    ctx.save();
    ctx.beginPath();

    // Curved Bezier route for clean visual appeal
    const midY = (y1 + y2) / 2;
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(x1, midY, x2, midY, x2, y2);

    if (isFiber) {
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 8;
    } else if (isTrunk) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([8, 4]);
    } else if (isWireless) {
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
    } else {
      // Standard Cat6 UTP
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
    }

    ctx.stroke();
    ctx.restore();

    // Port interface dots
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x1, y1, 3.5, 0, Math.PI * 2);
    ctx.arc(x2, y2, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * Draw hardware device cards
 */
function drawDeviceCards(ctx, nodes, layout) {
  nodes.forEach(node => {
    const pos = layout.get(node.id);
    if (!pos) return;

    const theme = ROLE_COLORS[node.type] || ROLE_COLORS.desktop;
    const x = pos.x - pos.w / 2;
    const y = pos.y - pos.h / 2;

    ctx.save();

    // Card drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    // Card background
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1.8;
    drawRoundedRect(ctx, x, y, pos.w, pos.h, 8, true, true);
    ctx.restore();

    // Device Real Equipment Photo on left
    drawPhotorealisticHardwarePhoto(ctx, node.type, x + 6, y + 6, 46, 40);

    // Device Full Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11.5px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    let name = node.name || node.id;
    if (name.length > 17) name = name.substring(0, 16) + '…';
    ctx.fillText(name, x + 58, y + 22);

    // Hardware Role Badge
    ctx.fillStyle = theme.badge;
    ctx.fillRect(x + 58, y + 27, 62, 13);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(theme.label, x + 89, y + 36.5);

    // IPv4 Address Badge
    ctx.fillStyle = '#00f3ff';
    ctx.font = '10px Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(node.ip || '10.0.0.1', x + 58, y + 54);

    // Status LED
    const isUp = node.status !== 'down';
    ctx.fillStyle = isUp ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(x + pos.w - 12, y + 14, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Small VLAN tag on bottom right
    ctx.fillStyle = '#94a3b8';
    ctx.font = '8.5px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(node.vlan || 'V1', x + pos.w - 8, y + 62);
  });
}

/**
 * Draw crisp vector device icon
 */
function drawVectorIcon(ctx, type, bx, by, bw, bh, theme) {
  ctx.save();
  ctx.fillStyle = theme.bg;
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 1.2;
  drawRoundedRect(ctx, bx, by, bw, bh, 6, true, true);

  const cx = bx + bw / 2;
  const cy = by + bh / 2;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const t = (type || 'desktop').toLowerCase();
  switch (t) {
    case 'firewall':
      // Brick / shield
      ctx.fillStyle = theme.border;
      drawRoundedRect(ctx, cx - 10, cy - 9, 20, 18, 3, true, false);
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
      ctx.moveTo(cx, cy - 9); ctx.lineTo(cx, cy);
      ctx.stroke();
      break;

    case 'router':
      // Circle with 4 routing arrows
      ctx.strokeStyle = theme.border;
      ctx.beginPath();
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy); ctx.lineTo(cx + 6, cy);
      ctx.moveTo(cx, cy - 6); ctx.lineTo(cx, cy + 6);
      ctx.stroke();
      break;

    case 'switch':
      // Rectangle with bidirectional horizontal arrows
      ctx.fillStyle = theme.border;
      drawRoundedRect(ctx, cx - 12, cy - 7, 24, 14, 3, true, false);
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy - 2); ctx.lineTo(cx + 8, cy - 2);
      ctx.moveTo(cx + 8, cy + 2); ctx.lineTo(cx - 8, cy + 2);
      ctx.stroke();
      break;

    case 'server':
    case 'hypervisor':
      // Server rack blade
      ctx.fillStyle = theme.border;
      drawRoundedRect(ctx, cx - 11, cy - 10, 22, 20, 3, true, false);
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(cx - 6, cy - 4, 1.8, 0, Math.PI * 2);
      ctx.arc(cx - 6, cy + 4, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx - 2, cy - 4); ctx.lineTo(cx + 7, cy - 4);
      ctx.moveTo(cx - 2, cy + 4); ctx.lineTo(cx + 7, cy + 4);
      ctx.stroke();
      break;

    case 'printer':
      // Printer
      ctx.fillStyle = '#e2e8f0';
      drawRoundedRect(ctx, cx - 10, cy - 4, 20, 12, 2, true, false);
      ctx.fillStyle = theme.border;
      drawRoundedRect(ctx, cx - 6, cy - 10, 12, 6, 1, true, false);
      break;

    case 'internet':
    case 'cloud':
    case 'cloud_vpc':
      // Cloud
      ctx.fillStyle = theme.border;
      ctx.beginPath();
      ctx.arc(cx - 4, cy, 6, 0, Math.PI * 2);
      ctx.arc(cx + 4, cy, 5, 0, Math.PI * 2);
      ctx.arc(cx, cy - 4, 6, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'wap':
      // Wi-Fi Waves
      ctx.strokeStyle = theme.border;
      ctx.beginPath();
      ctx.arc(cx, cy + 4, 10, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy + 4, 6, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy + 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;

    default:
      // Desktop PC monitor
      ctx.fillStyle = theme.border;
      drawRoundedRect(ctx, cx - 10, cy - 9, 20, 13, 2, true, false);
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx, cy + 4); ctx.lineTo(cx, cy + 8);
      ctx.moveTo(cx - 6, cy + 8); ctx.lineTo(cx + 6, cy + 8);
      ctx.stroke();
      break;
  }
  ctx.restore();
}

/**
 * Top Header Banner with title, metrics and health score
 */
function drawHeaderBanner(ctx, w, nodeCount, linkCount, options) {
  ctx.save();
  // Header container
  ctx.fillStyle = 'rgba(11, 15, 26, 0.92)';
  ctx.fillRect(0, 0, w, 68);
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 68); ctx.lineTo(w, 68);
  ctx.stroke();

  // Blueprint Title
  ctx.fillStyle = '#00f3ff';
  ctx.font = 'bold 20px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  const projectTitle = options.title || 'ENTERPRISE NETWORK ARCHITECTURE SCHEMATIC & TOPOLOGY BLUEPRINT';
  ctx.fillText(projectTitle, 35, 34);

  // Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11.5px -apple-system, sans-serif';
  const now = new Date().toLocaleString();
  ctx.fillText(`Generated: ${now}  |  VR Network Topology Explorer  |  Architect: ${options.author || 'Network Engineer'}`, 35, 52);

  // Quick Stat Chips on Top Right
  const stats = [
    { label: 'NODES', val: nodeCount, color: '#38bdf8' },
    { label: 'LINKS', val: linkCount, color: '#10b981' },
    { label: 'HEALTH', val: options.healthScore || '100% PASS', color: '#00f3ff' }
  ];

  let statX = w - 40;
  stats.reverse().forEach(s => {
    ctx.textAlign = 'right';
    ctx.fillStyle = s.color;
    ctx.font = 'bold 15px -apple-system, sans-serif';
    ctx.fillText(String(s.val), statX, 35);
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 9px -apple-system, sans-serif';
    ctx.fillText(s.label, statX, 48);
    statX -= 95;
  });

  ctx.restore();
}

/**
 * Bottom Cable Media & Role Legend
 */
function drawBottomLegend(ctx, w, h) {
  ctx.save();
  const ly = h - 45;

  ctx.fillStyle = 'rgba(11, 15, 26, 0.9)';
  ctx.fillRect(0, ly, w, 45);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, ly); ctx.lineTo(w, ly);
  ctx.stroke();

  ctx.font = '10px -apple-system, sans-serif';
  ctx.textAlign = 'left';

  // Cable legend
  let lx = 35;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('PHYSICAL CABLING MEDIA:', lx, ly + 26);
  lx += 150;

  const cables = [
    { label: 'Cat6 Copper UTP (1 Gbps)', color: '#10b981', dash: [] },
    { label: 'Fiber Optic SFP+ (10 Gbps)', color: '#00f3ff', dash: [] },
    { label: '802.1Q VLAN Trunk (40 Gbps)', color: '#f59e0b', dash: [6, 4] },
    { label: 'Wireless 5GHz Wi-Fi 6', color: '#ec4899', dash: [3, 3] }
  ];

  cables.forEach(c => {
    ctx.strokeStyle = c.color;
    ctx.lineWidth = 2.5;
    ctx.setLineDash(c.dash);
    ctx.beginPath();
    ctx.moveTo(lx, ly + 23);
    ctx.lineTo(lx + 24, ly + 23);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(c.label, lx + 30, ly + 26);
    lx += 190;
  });

  ctx.restore();
}

/**
 * Helper to draw a rounded rectangle
 */
function drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
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

/**
 * Direct image downloader for the real map
 */
export function downloadSchematicMapImage(graph, filename = 'real-network-architecture-map.png', options = {}) {
  const canvas = generateSchematicMap(graph, options);
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
