/**
 * hardware_textures.js - High-Definition Photorealistic Hardware Textures & Faceplates
 *
 * Implements real physical equipment textures for 3D Three.js meshes & 2D label sprites:
 * 1. Cisco Catalyst 9300 24-Port Switch (RJ45 ports, SFP+ 10G cages, status LEDs)
 * 2. Cisco ISR 4331 Modular WAN Router (Routed GE ports, NIM expansion slots, Console)
 * 3. Enterprise 2U Rack Server (Hot-swap SAS/NVMe drive caddies, power LED, grilles)
 * 4. Next-Gen Enterprise Threat Defense Firewall (Color-coded security zone ports, shield)
 * 5. Enterprise SAN Storage Array / Database (12-bay disk array with activity lights)
 * 6. High-res Workstation / Laptop screens (OS wallpaper, CLI terminal, network graph)
 * 7. Enterprise Multifunction Laser Printer (LCD touchscreen, tray)
 * 8. Cisco Catalyst 9120AX Wi-Fi 6 Access Point (Tri-color glowing LED ring)
 * 9. Cisco IP Phone 8845 (Tilted color LCD, extension display, keypad)
 */

import * as THREE from 'three';

const textureCache = new Map();

/**
 * Get or create high-resolution CanvasTexture for 3D hardware faceplates
 */
export function getHardwareFaceplateTexture(type) {
  const key = `faceplate_${type}`;
  if (textureCache.has(key)) {
    return textureCache.get(key);
  }

  const canvas = document.createElement('canvas');
  const t = (type || 'desktop').toLowerCase();

  switch (t) {
    case 'switch':
      canvas.width = 512;
      canvas.height = 128;
      renderSwitchFaceplate(canvas.getContext('2d'), 512, 128);
      break;

    case 'router':
      canvas.width = 512;
      canvas.height = 160;
      renderRouterFaceplate(canvas.getContext('2d'), 512, 160);
      break;

    case 'server':
    case 'hypervisor':
      canvas.width = 512;
      canvas.height = 320;
      renderServerFaceplate(canvas.getContext('2d'), 512, 320, t === 'hypervisor');
      break;

    case 'firewall':
    case 'vpn':
      canvas.width = 512;
      canvas.height = 160;
      renderFirewallFaceplate(canvas.getContext('2d'), 512, 160, t === 'vpn');
      break;

    case 'database':
      canvas.width = 512;
      canvas.height = 240;
      renderDatabaseFaceplate(canvas.getContext('2d'), 512, 240);
      break;

    case 'desktop':
    case 'pc':
      canvas.width = 512;
      canvas.height = 320;
      renderDesktopScreen(canvas.getContext('2d'), 512, 320);
      break;

    case 'laptop':
      canvas.width = 512;
      canvas.height = 320;
      renderLaptopScreen(canvas.getContext('2d'), 512, 320);
      break;

    case 'printer':
      canvas.width = 512;
      canvas.height = 300;
      renderPrinterFaceplate(canvas.getContext('2d'), 512, 300);
      break;

    case 'phone':
      canvas.width = 320;
      canvas.height = 320;
      renderPhoneFaceplate(canvas.getContext('2d'), 320, 320);
      break;

    case 'wap':
      canvas.width = 256;
      canvas.height = 256;
      renderWapFaceplate(canvas.getContext('2d'), 256, 256);
      break;

    default:
      canvas.width = 256;
      canvas.height = 256;
      renderGenericFaceplate(canvas.getContext('2d'), 256, 256, t);
      break;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  textureCache.set(key, texture);
  return texture;
}

/**
 * 1. Cisco Catalyst 9300 24-Port Gigabit PoE+ Switch Faceplate
 */
function renderSwitchFaceplate(ctx, w, h) {
  // Chassis dark metallic background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Top metallic bezel strip
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, 16);
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 16, w, 2);

  // Left Branding & Status LEDs
  ctx.fillStyle = '#00f3ff';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('CISCO', 18, 40);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('Catalyst 9300 Series', 18, 56);

  // Status LEDs
  const ledLabels = ['SYST', 'STAT', 'SPEED', 'PoE'];
  ledLabels.forEach((lbl, idx) => {
    const lx = 18 + idx * 24;
    // LED
    ctx.fillStyle = idx === 3 ? '#f59e0b' : '#10b981';
    ctx.beginPath();
    ctx.arc(lx + 4, 76, 3, 0, Math.PI * 2);
    ctx.fill();
    // Label
    ctx.fillStyle = '#64748b';
    ctx.font = '7px sans-serif';
    ctx.fillText(lbl, lx, 92);
  });

  // Console Port (RJ-45 with light blue boot)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(118, 42, 18, 18);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(121, 46, 12, 12);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '7px sans-serif';
  ctx.fillText('CONSOLE', 110, 72);

  // 24 Staggered RJ-45 Gigabit Ports
  const startX = 158;
  const portW = 11;
  const portH = 14;
  const gapX = 3.5;

  for (let pair = 0; pair < 12; pair++) {
    const px = startX + pair * (portW * 2 + gapX);

    // Top port (Odd: 1, 3, 5...)
    drawRj45Port(ctx, px, 36, portW, portH, true);
    // Bottom port (Even: 2, 4, 6...)
    drawRj45Port(ctx, px + portW + 1, 46, portW, portH, false);

    // Link activity LEDs
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(px + portW / 2, 28, 1.8, 0, Math.PI * 2);
    ctx.arc(px + portW * 1.5 + 1, 68, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Right Side: 4x 10G SFP+ Optical Uplink Cages
  const sfpStartX = startX + 12 * (portW * 2 + gapX) + 14;
  for (let sfp = 0; sfp < 4; sfp++) {
    const sx = sfpStartX + sfp * 18;
    ctx.fillStyle = '#334155';
    ctx.fillRect(sx, 36, 14, 26);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx, 36, 14, 26);

    // Optical latch bail
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(sx + 2, 44, 10, 4);

    // LED
    ctx.fillStyle = '#00f3ff';
    ctx.beginPath();
    ctx.arc(sx + 7, 26, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 8px sans-serif';
  ctx.fillText('10G SFP+ UPLINKS', sfpStartX - 4, 76);

  // Rack ear screws on edges
  drawRackEarScrew(ctx, 6, 20);
  drawRackEarScrew(ctx, 6, h - 20);
  drawRackEarScrew(ctx, w - 10, 20);
  drawRackEarScrew(ctx, w - 10, h - 20);
}

/**
 * 2. Cisco ISR 4331 Modular WAN Router Faceplate
 */
function renderRouterFaceplate(ctx, w, h) {
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, w, h);

  // Top/bottom chassis lip
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(0, 0, w, 18);
  ctx.fillRect(0, h - 18, w, 18);

  // Branding
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText('CISCO ISR 4331', 24, 44);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '9px monospace';
  ctx.fillText('Integrated Services Modular WAN Router', 24, 60);

  // Status Matrix LEDs
  ['PWR', 'STAT', 'FAN', 'TEMP'].forEach((lbl, idx) => {
    const lx = 24 + idx * 30;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(lx + 5, 84, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#64748b';
    ctx.font = '7.5px sans-serif';
    ctx.fillText(lbl, lx, 100);
  });

  // Routed Interfaces (GE 0/0/0, GE 0/0/1, SFP Combo)
  const portBoxX = 165;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(portBoxX, 36, 130, 80);
  ctx.strokeStyle = '#475569';
  ctx.strokeRect(portBoxX, 36, 130, 80);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 8.5px sans-serif';
  ctx.fillText('ROUTED GE0/0/0  GE0/0/1', portBoxX + 12, 52);

  // Two metallic RJ45 routed ports
  drawRj45Port(ctx, portBoxX + 18, 62, 18, 22, true);
  drawRj45Port(ctx, portBoxX + 48, 62, 18, 22, true);

  // SFP Combo cage
  ctx.fillStyle = '#475569';
  ctx.fillRect(portBoxX + 82, 60, 22, 26);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(portBoxX + 86, 68, 14, 5);

  // Dual Modular NIM Slots on the right
  const nimX = 315;
  for (let slot = 0; slot < 2; slot++) {
    const sy = 34 + slot * 48;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(nimX, sy, 175, 40);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(nimX, sy, 175, 40);

    // Slot thumbscrews
    drawKnurledScrew(ctx, nimX + 6, sy + 20);
    drawKnurledScrew(ctx, nimX + 168, sy + 20);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 8px monospace';
    ctx.fillText(`NIM SLOT ${slot} (EXPANSION WAN/VOICE)`, nimX + 22, sy + 24);
  }

  // Rack screws
  drawRackEarScrew(ctx, 8, 25);
  drawRackEarScrew(ctx, 8, h - 25);
  drawRackEarScrew(ctx, w - 12, 25);
  drawRackEarScrew(ctx, w - 12, h - 25);
}

/**
 * 3. Enterprise 2U Rack Server (Dell PowerEdge / Cisco UCS Blade) Faceplate
 */
function renderServerFaceplate(ctx, w, h, isHypervisor = false) {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Top Bezel with Titanium brushed finish
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, 32);
  ctx.strokeStyle = '#475569';
  ctx.strokeRect(0, 0, w, 32);

  // Server Branding & Blue UID Light
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(28, 16, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px -apple-system, sans-serif';
  ctx.fillText(isHypervisor ? 'VMWARE ESXi BARE-METAL HYPERVISOR' : 'ENTERPRISE 2U SERVER CHASSIS', 44, 20);

  // Power Button
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(w - 28, 16, 6, 0, Math.PI * 2);
  ctx.fill();

  // 8 Hot-Swap 2.5" SAS / NVMe Drive Caddies
  const driveStartY = 46;
  const driveH = 115;
  const driveW = 54;
  const gap = 8;
  const startX = 14;

  for (let bay = 0; bay < 8; bay++) {
    const dx = startX + bay * (driveW + gap);
    if (dx + driveW > w - 10) break;

    // Drive caddy container
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(dx, driveStartY, driveW, driveH);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(dx, driveStartY, driveW, driveH);

    // Release latch handle
    ctx.fillStyle = '#334155';
    ctx.fillRect(dx + 4, driveStartY + driveH - 26, driveW - 8, 20);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(dx + 12, driveStartY + driveH - 20, driveW - 24, 8);

    // Ventilation slots
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    for (let slot = 0; slot < 6; slot++) {
      ctx.beginPath();
      ctx.moveTo(dx + 8, driveStartY + 14 + slot * 10);
      ctx.lineTo(dx + driveW - 8, driveStartY + 14 + slot * 10);
      ctx.stroke();
    }

    // Drive Activity LED (Blinking Green / Amber)
    ctx.fillStyle = bay % 3 === 0 ? '#10b981' : '#38bdf8';
    ctx.beginPath();
    ctx.arc(dx + 10, driveStartY + 8, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Drive ID
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 7px monospace';
    ctx.fillText(`BAY ${bay}`, dx + 18, driveStartY + 10);
  }

  // Lower Section: Honeycomb Air Intake Grille & Diagnostic Display
  const lowerY = 175;
  ctx.fillStyle = '#111827';
  ctx.fillRect(14, lowerY, w - 28, 125);
  ctx.strokeStyle = '#334155';
  ctx.strokeRect(14, lowerY, w - 28, 125);

  // Diagnostic LCD Screen
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(28, lowerY + 18, 190, 88);
  ctx.strokeStyle = '#38bdf8';
  ctx.strokeRect(28, lowerY + 18, 190, 88);

  ctx.fillStyle = '#00f3ff';
  ctx.font = 'bold 11px monospace';
  ctx.fillText(isHypervisor ? 'ESXi 8.0 HYPERVISOR' : 'XEON GOLD 64-CORE', 38, lowerY + 42);
  ctx.fillStyle = '#ffffff';
  ctx.font = '9px monospace';
  ctx.fillText('RAM: 512GB ECC DDR5', 38, lowerY + 60);
  ctx.fillText('vNICs: 4x 25G SFP28', 38, lowerY + 76);
  ctx.fillStyle = '#10b981';
  ctx.fillText('HEALTH: ALL SYSTEMS OK', 38, lowerY + 92);

  // Right Honeycomb ventilation grille pattern
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let hx = 240; hx < w - 28; hx += 16) {
    for (let hy = lowerY + 12; hy < lowerY + 115; hy += 14) {
      ctx.beginPath();
      ctx.arc(hx, hy, 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

/**
 * 4. Next-Gen Threat Defense Firewall Faceplate
 */
function renderFirewallFaceplate(ctx, w, h, isVpn = false) {
  // Fire red / crimson chassis
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(0, 0, w, h);

  // Top Red Security Header
  ctx.fillStyle = isVpn ? '#ea580c' : '#dc2626';
  ctx.fillRect(0, 0, w, 28);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText(isVpn ? '🔒 ENTERPRISE IPSEC VPN CONCENTRATOR' : '🛡️ NEXT-GEN THREAT DEFENSE FIREWALL', 24, 19);

  // Threat Shield Logo
  drawSecurityShieldIcon(ctx, 30, 52, 28);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px -apple-system, sans-serif';
  ctx.fillText(isVpn ? 'IPsec / SSL Tunnel Engine' : 'Stateful Packet Inspection (SPI)', 68, 62);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '8.5px monospace';
  ctx.fillText('Zero-Trust Network Access & IPS Active', 68, 76);

  // Color-Coded Security Zone Ports
  const zones = [
    { label: 'WAN / UNTRUST', color: '#ef4444', count: 2 },
    { label: 'DMZ SERVERS', color: '#f59e0b', count: 2 },
    { label: 'INTERNAL LAN', color: '#10b981', count: 4 },
    { label: 'HA SYNC', color: '#0284c7', count: 1 }
  ];

  let portX = 230;
  zones.forEach(z => {
    ctx.fillStyle = '#1e293b';
    const zw = z.count * 24 + 10;
    ctx.fillRect(portX, 42, zw, 95);
    ctx.strokeStyle = z.color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(portX, 42, zw, 95);

    ctx.fillStyle = z.color;
    ctx.font = 'bold 7px sans-serif';
    ctx.fillText(z.label, portX + 4, 56);

    for (let p = 0; p < z.count; p++) {
      drawRj45Port(ctx, portX + 6 + p * 24, 70, 16, 20, true);
      // Link LED
      ctx.fillStyle = z.color;
      ctx.beginPath();
      ctx.arc(portX + 14 + p * 24, 102, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    portX += zw + 8;
  });
}

/**
 * 5. Enterprise SAN Storage Array / Database Faceplate
 */
function renderDatabaseFaceplate(ctx, w, h) {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Top banner
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, 28);
  ctx.fillStyle = '#ec4899';
  ctx.font = 'bold 12px -apple-system, sans-serif';
  ctx.fillText('🗄️ ENTERPRISE SAN STORAGE & SQL CLUSTER', 20, 19);

  // 12 Storage Drive Trays in a 3 x 4 Grid
  const bayW = 105;
  const bayH = 50;
  const startX = 20;
  const startY = 40;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const bx = startX + col * (bayW + 14);
      const by = startY + row * (bayH + 12);
      if (bx + bayW > w) break;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bx, by, bayW, bayH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(bx, by, bayW, bayH);

      // Drive handle
      ctx.fillStyle = '#475569';
      ctx.fillRect(bx + 4, by + 12, bayW - 8, 22);

      // Flashing IO LED
      ctx.fillStyle = (row + col) % 2 === 0 ? '#10b981' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(bx + 12, by + 8, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 8px monospace';
      ctx.fillText(`DRIVE ${row * 4 + col + 1}: NVMe 7.6TB`, bx + 22, by + 10);
    }
  }
}

/**
 * 6. Workstation Monitor Screen
 */
function renderDesktopScreen(ctx, w, h) {
  // Bezel
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, w, h);

  // Screen background (Deep tech wallpaper)
  const grad = ctx.createLinearGradient(12, 12, w - 24, h - 24);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#0284c7');
  ctx.fillStyle = grad;
  ctx.fillRect(12, 12, w - 24, h - 24);

  // Window 1: Terminal with live ping
  ctx.fillStyle = '#020617';
  ctx.fillRect(24, 24, 260, 160);
  ctx.strokeStyle = '#38bdf8';
  ctx.strokeRect(24, 24, 260, 160);

  // Terminal title bar
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(24, 24, 260, 20);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('bash - admin@workstation:~', 32, 38);

  ctx.fillStyle = '#10b981';
  ctx.font = '9px monospace';
  ctx.fillText('$ ping 10.0.1.1 -c 4', 32, 60);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('64 bytes from 10.0.1.1: icmp_seq=1 ttl=64 time=1.2ms', 32, 78);
  ctx.fillText('64 bytes from 10.0.1.1: icmp_seq=2 ttl=64 time=1.0ms', 32, 94);
  ctx.fillText('64 bytes from 10.0.1.1: icmp_seq=3 ttl=64 time=1.1ms', 32, 110);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('--- 10.0.1.1 ping statistics --- 0% packet loss', 32, 134);

  // Window 2: Network throughput chart
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(300, 24, 185, 160);
  ctx.strokeStyle = '#00f3ff';
  ctx.strokeRect(300, 24, 185, 160);

  ctx.fillStyle = '#00f3ff';
  ctx.font = 'bold 9.5px sans-serif';
  ctx.fillText('LIVE NETWORK TRAFFIC (1 Gbps)', 310, 42);

  // Sine graph
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(310, 120);
  for (let x = 310; x < 475; x += 10) {
    const y = 120 + Math.sin((x - 310) * 0.1) * 35;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Taskbar at bottom of screen
  ctx.fillStyle = '#0b0f1a';
  ctx.fillRect(12, h - 36, w - 24, 24);
  ctx.fillStyle = '#00f3ff';
  ctx.fillRect(20, h - 32, 16, 16); // Start icon
}

/**
 * 7. Laptop Screen
 */
function renderLaptopScreen(ctx, w, h) {
  renderDesktopScreen(ctx, w, h);
}

/**
 * 8. Network Office Laser Printer
 */
function renderPrinterFaceplate(ctx, w, h) {
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, w, h);

  // Top scanner lid line
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(0, 0, w, 28);

  // Color Touchscreen Display
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(30, 48, 180, 110);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 48, 180, 110);

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('● READY TO PRINT', 42, 75);

  ctx.fillStyle = '#ffffff';
  ctx.font = '10px monospace';
  ctx.fillText('IP: 10.0.30.202', 42, 98);
  ctx.fillText('Toner: 98% Cyan / 95% Blk', 42, 118);
  ctx.fillText('Port: 9100 RAW / IPP', 42, 138);

  // Paper Tray Output Slot
  ctx.fillStyle = '#334155';
  ctx.fillRect(240, 60, 240, 28);
  // White paper exiting
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(260, 64, 200, 20);

  // Lower Paper Drawer 1 & 2
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(30, 190, w - 60, 45);
  ctx.strokeStyle = '#94a3b8';
  ctx.strokeRect(30, 190, w - 60, 45);

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 9px sans-serif';
  ctx.fillText('TRAY 1 (LETTER / A4) - 500 SHEETS', 50, 218);
}

/**
 * 9. Cisco VoIP Desk Phone Screen & Keypad
 */
function renderPhoneFaceplate(ctx, w, h) {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, h);

  // Screen
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(20, 20, w - 40, 100);
  ctx.strokeStyle = '#38bdf8';
  ctx.strokeRect(20, 20, w - 40, 100);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('CISCO IP PHONE 8845', 30, 44);
  ctx.fillStyle = '#00f3ff';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('EXT: 4010 [ENGINEERING]', 30, 66);
  ctx.fillStyle = '#10b981';
  ctx.fillText('● SIP REGISTERED', 30, 88);

  // Keypad
  const keyStartX = 40;
  const keyStartY = 140;
  const btnW = 45;
  const btnH = 26;
  const gap = 12;

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  keys.forEach((k, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const kx = keyStartX + col * (btnW + gap);
    const ky = keyStartY + row * (btnH + gap);

    ctx.fillStyle = '#334155';
    ctx.fillRect(kx, ky, btnW, btnH);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(k, kx + btnW / 2, ky + 18);
    ctx.textAlign = 'left';
  });
}

/**
 * 10. Wi-Fi 6 Access Point
 */
function renderWapFaceplate(ctx, w, h) {
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;

  // Cisco Center ring
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.stroke();

  // Status Glowing LED ring
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Wi-Fi 6', cx, cy - 2);
  ctx.font = '9px monospace';
  ctx.fillText('802.11ax', cx, cy + 14);
}

/**
 * Generic Fallback Faceplate
 */
function renderGenericFaceplate(ctx, w, h, type) {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#00f3ff';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(type.toUpperCase(), w / 2, h / 2);
}

// ==========================================
// DRAWING UTILITIES
// ==========================================

function drawRj45Port(ctx, x, y, w, h, pinsTop = true) {
  // Metallic shielded outer jack
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  // Black socket cavity
  ctx.fillStyle = '#020617';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  // 8 Gold contact pins
  ctx.fillStyle = '#f59e0b';
  const pinCount = 8;
  const pinW = 0.8;
  const pinGap = (w - 6) / pinCount;
  const pinY = pinsTop ? y + 3 : y + h - 5;

  for (let i = 0; i < pinCount; i++) {
    ctx.fillRect(x + 3 + i * pinGap, pinY, pinW, 2.5);
  }
}

function drawRackEarScrew(ctx, x, y) {
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(x - 2.5, y); ctx.lineTo(x + 2.5, y);
  ctx.moveTo(x, y - 2.5); ctx.lineTo(x, y + 2.5);
  ctx.stroke();
}

function drawKnurledScrew(ctx, x, y) {
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawSecurityShieldIcon(ctx, x, y, size) {
  ctx.save();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y);
  ctx.quadraticCurveTo(x + size, y + size * 0.7, x + size / 2, y + size);
  ctx.quadraticCurveTo(x, y + size * 0.7, x, y);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw ultra-sharp photorealistic hardware photo into any 2D canvas (used for 3D label sprite & UI)
 */
export function drawPhotorealisticHardwarePhoto(ctx, type, x, y, w, h) {
  ctx.save();
  // Drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;

  // Background equipment frame
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  const pad = 4;
  const innerX = x + pad;
  const innerY = y + pad;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const t = (type || 'desktop').toLowerCase();
  switch (t) {
    case 'switch':
      renderSwitchFaceplate(ctx, innerW, innerH);
      break;
    case 'router':
      renderRouterFaceplate(ctx, innerW, innerH);
      break;
    case 'server':
    case 'hypervisor':
      renderServerFaceplate(ctx, innerW, innerH, t === 'hypervisor');
      break;
    case 'firewall':
    case 'vpn':
      renderFirewallFaceplate(ctx, innerW, innerH, t === 'vpn');
      break;
    case 'database':
      renderDatabaseFaceplate(ctx, innerW, innerH);
      break;
    case 'desktop':
    case 'pc':
      renderDesktopScreen(ctx, innerW, innerH);
      break;
    case 'laptop':
      renderLaptopScreen(ctx, innerW, innerH);
      break;
    case 'printer':
      renderPrinterFaceplate(ctx, innerW, innerH);
      break;
    case 'phone':
      renderPhoneFaceplate(ctx, innerW, innerH);
      break;
    case 'wap':
      renderWapFaceplate(ctx, innerW, innerH);
      break;
    default:
      renderGenericFaceplate(ctx, innerW, innerH, t);
      break;
  }
}
