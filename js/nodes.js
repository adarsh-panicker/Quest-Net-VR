/**
 * nodes.js - 3D Node Meshes, Dynamic Links & High-Contrast Text Labels
 *
 * Implements low-poly node geometries (Servers, Desktops, Laptops, Printers,
 * Firewalls, Routers, Switches, DBs, Load Balancers), dynamic cylinder links,
 * idle bobbing, and canvas labels featuring generic device thumbnails, full names,
 * IP addresses, and Department color-coding.
 */

import * as THREE from 'three';
import { sound } from './audio.js';
import { DEPARTMENT_COLORS } from './graph.js';

// Color palette
export const NODE_COLORS = {
  internet:     0x38bdf8, // Sky Blue
  firewall:     0xf97316, // Orange
  router:       0x3b82f6, // Royal Blue
  switch:       0x10b981, // Emerald Green
  server:       0x8b5cf6, // Violet / Purple
  desktop:      0x94a3b8, // Slate / Grey
  pc:           0x94a3b8,
  laptop:       0x0ea5e9, // Electric Blue
  printer:      0xe2e8f0, // White / Pearl
  loadbalancer: 0x06b6d4, // Cyan / Teal
  database:     0xf59e0b, // Amber / Gold
  cloud:        0x60a5fa, // Light Blue
  wap:          0x06b6d4, // Cyan Wi-Fi AP
  phone:        0x10b981, // Emerald Green VoIP Phone
  iot:          0xf59e0b, // Amber Industrial PLC/Sensor
  hypervisor:   0xa855f7, // Deep Purple / Bare-Metal Hypervisor
  vm:           0x38bdf8, // Cyan / Translucent Virtual Machine
  container:    0x0284c7, // Ocean Blue / Docker Container
  vpn:          0xec4899, // Pink / Magenta IPsec Gateway
  cloud_vpc:    0xf59e0b  // Amber / Cloud VPC
};

export const CABLE_COLORS = {
  cat6:       0x2563eb, // Royal Blue (Cat6 Copper UTP)
  smf:        0xeab308, // Bright Yellow (Single-Mode Fiber OS2)
  mmf:        0x06b6d4, // Aqua / Cyan (Multi-Mode Fiber OM4)
  dac:        0x1e293b, // Dark Slate / Black (Twinax DAC)
  vpn_tunnel: 0x8b5cf6, // Violet Hologram (Encrypted IPsec Tunnel)
  coax:       0x64748b  // Grey (Coaxial 10Base5/10Base2)
};

export const STATUS_COLORS = {
  up: 0x00f3ff,       // Cyan
  down: 0xef4444,     // Crimson Red
  selected: 0xfacc15, // Golden Yellow
  packet: 0x38bdf8    // Glow Blue
};

const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();

export class NodeVisualManager {
  constructor(scene) {
    this.scene = scene;

    /** @type {Map<string, THREE.Group>} */
    this.nodeMeshes = new Map();

    /** @type {Map<string, THREE.Group>} */
    this.linkMeshes = new Map();

    this.nodesGroup = new THREE.Group();
    this.nodesGroup.name = 'nodes-root';

    this.linksGroup = new THREE.Group();
    this.linksGroup.name = 'links-root';

    this.scene.add(this.linksGroup);
    this.scene.add(this.nodesGroup);

    this.labelsVisible = true;

    // Shared geometries
    this.geometries = {
      internet: new THREE.IcosahedronGeometry(0.24, 1),
      firewall: new THREE.BoxGeometry(0.36, 0.36, 0.36),
      router: new THREE.CylinderGeometry(0.24, 0.24, 0.22, 16),
      switch: new THREE.BoxGeometry(0.48, 0.14, 0.28),
      server: new THREE.BoxGeometry(0.24, 0.52, 0.28),
      pcBase: new THREE.BoxGeometry(0.28, 0.03, 0.22),
      pcScreen: new THREE.BoxGeometry(0.32, 0.22, 0.04),
      laptopBase: new THREE.BoxGeometry(0.30, 0.024, 0.22),
      laptopScreen: new THREE.BoxGeometry(0.30, 0.20, 0.024),
      printerBody: new THREE.BoxGeometry(0.32, 0.20, 0.28),
      printerTray: new THREE.BoxGeometry(0.18, 0.015, 0.14),
      loadbalancer: new THREE.CylinderGeometry(0.26, 0.26, 0.24, 8),
      database: new THREE.CylinderGeometry(0.22, 0.22, 0.42, 16),
      cloud: new THREE.DodecahedronGeometry(0.26, 1),
      wapDome: new THREE.CylinderGeometry(0.22, 0.26, 0.06, 20),
      wapRing: new THREE.TorusGeometry(0.14, 0.012, 8, 24),
      phoneBase: new THREE.BoxGeometry(0.26, 0.06, 0.22),
      phoneHandset: new THREE.BoxGeometry(0.07, 0.05, 0.24),
      phoneScreen: new THREE.BoxGeometry(0.12, 0.08, 0.02),
      iotBody: new THREE.BoxGeometry(0.22, 0.34, 0.18),
      iotAntenna: new THREE.CylinderGeometry(0.008, 0.008, 0.18, 8),
      hypervisorChassis: new THREE.BoxGeometry(0.26, 0.54, 0.32),
      vmOuter: new THREE.BoxGeometry(0.24, 0.24, 0.24),
      vmCore: new THREE.BoxGeometry(0.12, 0.12, 0.12),
      containerPod: new THREE.BoxGeometry(0.26, 0.22, 0.22),
      vpnLock: new THREE.CylinderGeometry(0.20, 0.20, 0.18, 8),
      vpnArch: new THREE.TorusGeometry(0.09, 0.02, 8, 16, Math.PI),
      cloudVpc: new THREE.OctahedronGeometry(0.24, 0),
      vpnTunnelCylinder: new THREE.CylinderGeometry(0.045, 0.045, 1, 12),
      linkCylinder: new THREE.CylinderGeometry(0.014, 0.014, 1, 8),
      linkHitBox: new THREE.CylinderGeometry(0.08, 0.08, 1, 6)
    };
    this.geometries.linkCylinder.translate(0, 0.5, 0);
    this.geometries.linkHitBox.translate(0, 0.5, 0);
    this.geometries.vpnTunnelCylinder.translate(0, 0.5, 0);

    this.materials = {
      linkUp: new THREE.MeshLambertMaterial({
        color: STATUS_COLORS.up,
        emissive: 0x004455
      }),
      linkDown: new THREE.MeshLambertMaterial({
        color: STATUS_COLORS.down,
        emissive: 0x550000,
        transparent: true,
        opacity: 0.75
      }),
      linkHit: new THREE.MeshBasicMaterial({
        visible: false
      })
    };
  }

  build(graph) {
    this.clear();

    for (const [id, nodeData] of graph.nodes.entries()) {
      const nodeGroup = this.createNodeMesh(nodeData);
      this.nodeMeshes.set(id, nodeGroup);
      this.nodesGroup.add(nodeGroup);
    }

    for (const link of graph.links) {
      const linkGroup = this.createLinkMesh(link);
      if (linkGroup) {
        this.linkMeshes.set(link.id, linkGroup);
        this.linksGroup.add(linkGroup);
      }
    }

    this.updateAllLinks();
  }

  addSingleNode(nodeData) {
    if (this.nodeMeshes.has(nodeData.id)) return;
    const nodeGroup = this.createNodeMesh(nodeData);
    this.nodeMeshes.set(nodeData.id, nodeGroup);
    this.nodesGroup.add(nodeGroup);
    sound.playHop();
    return nodeGroup;
  }

  removeSingleNode(nodeId) {
    const nodeGroup = this.nodeMeshes.get(nodeId);
    if (!nodeGroup) return;

    const toRemove = [];
    for (const [lId, lGroup] of this.linkMeshes.entries()) {
      if (lGroup.userData.from === nodeId || lGroup.userData.to === nodeId) {
        toRemove.push(lId);
      }
    }
    for (const lId of toRemove) {
      this.removeSingleLink(lId);
    }

    if (nodeGroup.userData.labelSprite) {
      nodeGroup.userData.labelSprite.material.map.dispose();
      nodeGroup.userData.labelSprite.material.dispose();
    }
    if (nodeGroup.userData.material) {
      nodeGroup.userData.material.dispose();
    }
    if (nodeGroup.userData.halo) {
      nodeGroup.userData.halo.geometry.dispose();
      nodeGroup.userData.halo.material.dispose();
    }

    this.nodesGroup.remove(nodeGroup);
    this.nodeMeshes.delete(nodeId);
    sound.playSpark();
  }

  addSingleLink(linkData) {
    if (this.linkMeshes.has(linkData.id)) return;
    const linkGroup = this.createLinkMesh(linkData);
    if (linkGroup) {
      this.linkMeshes.set(linkData.id, linkGroup);
      this.linksGroup.add(linkGroup);
      this.updateLink(linkData.id);
      sound.playClick();
    }
  }

  removeSingleLink(linkId) {
    const linkGroup = this.linkMeshes.get(linkId);
    if (!linkGroup) return;

    if (linkGroup.userData.material) {
      linkGroup.userData.material.dispose();
    }
    this.linksGroup.remove(linkGroup);
    this.linkMeshes.delete(linkId);
  }

  createNodeMesh(nodeData) {
    const group = new THREE.Group();
    group.name = `node-${nodeData.id}`;
    group.userData = {
      isNode: true,
      nodeId: nodeData.id,
      department: nodeData.department || 'IT & Infrastructure',
      basePosition: new THREE.Vector3(
        nodeData.position.x,
        nodeData.position.y,
        nodeData.position.z
      ),
      bobPhase: Math.random() * Math.PI * 2,
      isSelected: false,
      isBroken: nodeData.status === 'down'
    };

    group.position.copy(group.userData.basePosition);

    let type = nodeData.type ? String(nodeData.type).toLowerCase() : 'desktop';
    if (type === 'pc') type = 'desktop';

    const baseColor = NODE_COLORS[type] || NODE_COLORS.desktop;
    const material = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.35,
      metalness: 0.2,
      emissive: 0x111122
    });

    let mainMesh;
    if (type === 'desktop') {
      mainMesh = new THREE.Group();
      const baseMesh = new THREE.Mesh(this.geometries.pcBase, material);
      const screenMesh = new THREE.Mesh(this.geometries.pcScreen, material);
      screenMesh.position.set(0, 0.12, -0.04);
      mainMesh.add(baseMesh);
      mainMesh.add(screenMesh);
    } else if (type === 'laptop') {
      mainMesh = new THREE.Group();
      const baseMesh = new THREE.Mesh(this.geometries.laptopBase, material);
      const screenMesh = new THREE.Mesh(this.geometries.laptopScreen, material);
      screenMesh.position.set(0, 0.10, -0.08);
      screenMesh.rotation.x = -0.35; // Tilted screen
      mainMesh.add(baseMesh);
      mainMesh.add(screenMesh);
    } else if (type === 'printer') {
      mainMesh = new THREE.Group();
      const body = new THREE.Mesh(this.geometries.printerBody, material);
      const tray = new THREE.Mesh(
        this.geometries.printerTray,
        new THREE.MeshLambertMaterial({ color: 0x38bdf8 })
      );
      tray.position.set(0, 0.11, -0.04);
      tray.rotation.x = -0.4;
      mainMesh.add(body);
      mainMesh.add(tray);
    } else if (type === 'wap') {
      mainMesh = new THREE.Group();
      const dome = new THREE.Mesh(this.geometries.wapDome, material);
      const ring = new THREE.Mesh(
        this.geometries.wapRing,
        new THREE.MeshBasicMaterial({ color: 0x00f3ff })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.035;
      mainMesh.add(dome);
      mainMesh.add(ring);
    } else if (type === 'phone') {
      mainMesh = new THREE.Group();
      const baseMesh = new THREE.Mesh(this.geometries.phoneBase, material);
      const handset = new THREE.Mesh(
        this.geometries.phoneHandset,
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
      );
      handset.position.set(-0.08, 0.04, 0);
      const screenMesh = new THREE.Mesh(
        this.geometries.phoneScreen,
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      screenMesh.position.set(0.04, 0.045, -0.04);
      screenMesh.rotation.x = -0.3;
      mainMesh.add(baseMesh);
      mainMesh.add(handset);
      mainMesh.add(screenMesh);
    } else if (type === 'iot') {
      mainMesh = new THREE.Group();
      const body = new THREE.Mesh(this.geometries.iotBody, material);
      const antenna = new THREE.Mesh(
        this.geometries.iotAntenna,
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 })
      );
      antenna.position.set(0.08, 0.22, 0);
      mainMesh.add(body);
      mainMesh.add(antenna);
    } else if (type === 'hypervisor') {
      mainMesh = new THREE.Group();
      const chassis = new THREE.Mesh(this.geometries.hypervisorChassis, material);
      const visorScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.18, 0.36),
        new THREE.MeshBasicMaterial({ color: 0x00f3ff, side: THREE.DoubleSide })
      );
      visorScreen.position.set(0, 0, 0.165);
      mainMesh.add(chassis);
      mainMesh.add(visorScreen);
    } else if (type === 'vm') {
      mainMesh = new THREE.Group();
      const outerMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
        roughness: 0.2,
        metalness: 0.8
      });
      const outerBox = new THREE.Mesh(this.geometries.vmOuter, outerMat);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
      const innerCore = new THREE.Mesh(this.geometries.vmCore, coreMat);
      mainMesh.add(outerBox);
      mainMesh.add(innerCore);
    } else if (type === 'container') {
      mainMesh = new THREE.Group();
      const pod = new THREE.Mesh(this.geometries.containerPod, material);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.02, 0.23), stripeMat);
      stripe1.position.y = 0.05;
      const stripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.02, 0.23), stripeMat);
      stripe2.position.y = -0.05;
      mainMesh.add(pod);
      mainMesh.add(stripe1);
      mainMesh.add(stripe2);
    } else if (type === 'vpn') {
      mainMesh = new THREE.Group();
      const lockBody = new THREE.Mesh(this.geometries.vpnLock, material);
      const lockArch = new THREE.Mesh(
        this.geometries.vpnArch,
        new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 })
      );
      lockArch.position.set(0, 0.12, 0);
      mainMesh.add(lockBody);
      mainMesh.add(lockArch);
    } else if (type === 'cloud_vpc') {
      mainMesh = new THREE.Group();
      const vpcCore = new THREE.Mesh(this.geometries.cloudVpc, material);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.015, 8, 24), ringMat);
      ring.rotation.x = Math.PI / 3;
      mainMesh.add(vpcCore);
      mainMesh.add(ring);
    } else {
      const geom = this.geometries[type] || this.geometries.pcBase;
      mainMesh = new THREE.Mesh(geom, material);
    }

    mainMesh.userData = { parentGroup: group };
    mainMesh.traverse((child) => {
      child.userData.parentGroup = group;
    });
    group.add(mainMesh);
    group.userData.mainMesh = mainMesh;
    group.userData.material = material;
    group.userData.baseColor = baseColor;

    // Outer glow ring
    const haloGeom = new THREE.RingGeometry(0.32, 0.36, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: STATUS_COLORS.selected,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = -0.22;
    group.add(halo);
    group.userData.halo = halo;

    // High-resolution Canvas Text Label Sprite with Device Thumbnail & Dept Badge
    const labelSprite = this.createLabelSprite(nodeData.name, nodeData.ip, type, nodeData.department);
    labelSprite.position.set(0, 0.44, 0);
    labelSprite.visible = this.labelsVisible;
    group.add(labelSprite);
    group.userData.labelSprite = labelSprite;

    return group;
  }

  /**
   * Create crisp, high-contrast canvas text sprite with generic device thumbnail icon
   * @param {string} name
   * @param {string} ip
   * @param {string} type
   * @param {string} department
   */
  createLabelSprite(name, ip, type, department = 'IT & Infrastructure') {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    // Rounded card background
    const x = 16, y = 16, w = 608, h = 268, r = 24;
    ctx.fillStyle = 'rgba(11, 15, 26, 0.94)';
    const deptColor = DEPARTMENT_COLORS[department] || '#00f3ff';
    ctx.strokeStyle = deptColor;
    ctx.lineWidth = 6;
    this.drawRoundedRect(ctx, x, y, w, h, r, true, true);

    // Draw Generic Device Thumbnail Icon in top-left
    this.drawDeviceThumbnail(ctx, type, 36, 36, 84, 84);

    // Device Full Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    let displayName = name;
    if (displayName.length > 24) {
      displayName = displayName.substring(0, 22) + '...';
    }
    ctx.fillText(displayName, 140, 42);

    // IPv4 Address
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 30px "Consolas", monospace';
    ctx.fillText(ip, 140, 88);

    // Separator line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(36, 145);
    ctx.lineTo(w, 145);
    ctx.stroke();

    // Department Badge
    ctx.fillStyle = deptColor;
    ctx.globalAlpha = 0.2;
    this.drawRoundedRect(ctx, 36, 170, 360, 48, 10, true, false);
    ctx.globalAlpha = 1.0;

    ctx.strokeStyle = deptColor;
    ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, 36, 170, 360, 48, 10, false, true);

    ctx.fillStyle = deptColor;
    ctx.font = 'bold 22px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🏢 ${department.toUpperCase()}`, 216, 194);

    // Device Role Tag on right
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`ROLE: ${type.toUpperCase()}`, w - 16, 194);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.56, 0.26, 1.0);
    sprite.userData.canvas = canvas;
    sprite.userData.texture = texture;

    return sprite;
  }

  /**
   * Draw high-res generic device vector thumbnail on 2D canvas
   */
  drawDeviceThumbnail(ctx, type, bx, by, bw, bh) {
    ctx.save();

    // Icon background tile
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 3;
    this.drawRoundedRect(ctx, bx, by, bw, bh, 14, true, true);

    const cx = bx + bw / 2;
    const cy = by + bh / 2;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (type) {
      case 'server':
        // Rack server chassis with blades and LED lights
        ctx.fillStyle = '#a855f7';
        this.drawRoundedRect(ctx, cx - 24, cy - 22, 48, 44, 4, true, true);
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(cx - 15, cy - 10, 3, 0, Math.PI * 2);
        ctx.arc(cx - 15, cy + 2, 3, 0, Math.PI * 2);
        ctx.arc(cx - 15, cy + 14, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy - 10); ctx.lineTo(cx + 18, cy - 10);
        ctx.moveTo(cx - 6, cy + 2);  ctx.lineTo(cx + 18, cy + 2);
        ctx.moveTo(cx - 6, cy + 14); ctx.lineTo(cx + 18, cy + 14);
        ctx.stroke();
        break;

      case 'desktop':
      case 'pc':
        // Monitor + Stand
        ctx.fillStyle = '#38bdf8';
        this.drawRoundedRect(ctx, cx - 22, cy - 20, 44, 28, 4, true, true);
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(cx, cy + 8); ctx.lineTo(cx, cy + 16);
        ctx.moveTo(cx - 12, cy + 16); ctx.lineTo(cx + 12, cy + 16);
        ctx.stroke();
        break;

      case 'laptop':
        // Clamshell laptop
        ctx.strokeStyle = '#0ea5e9';
        ctx.fillStyle = 'rgba(14, 165, 233, 0.4)';
        this.drawRoundedRect(ctx, cx - 20, cy - 18, 40, 24, 3, true, true);
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(cx - 26, cy + 12); ctx.lineTo(cx + 26, cy + 12);
        ctx.stroke();
        break;

      case 'printer':
        // Network printer with paper entering top and tray
        ctx.fillStyle = '#e2e8f0';
        this.drawRoundedRect(ctx, cx - 20, cy - 10, 40, 24, 4, true, true);
        // Top sheet
        ctx.fillStyle = '#38bdf8';
        this.drawRoundedRect(ctx, cx - 12, cy - 22, 24, 12, 2, true, false);
        // Output slot
        ctx.fillStyle = '#0f172a';
        this.drawRoundedRect(ctx, cx - 14, cy, 28, 5, 2, true, false);
        break;

      case 'firewall':
        // Brick wall / Shield
        ctx.fillStyle = '#f97316';
        this.drawRoundedRect(ctx, cx - 22, cy - 20, 44, 40, 6, true, true);
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(cx - 22, cy - 7); ctx.lineTo(cx + 22, cy - 7);
        ctx.moveTo(cx - 22, cy + 7); ctx.lineTo(cx + 22, cy + 7);
        ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy - 7);
        ctx.moveTo(cx - 11, cy - 7); ctx.lineTo(cx - 11, cy + 7);
        ctx.moveTo(cx + 11, cy - 7); ctx.lineTo(cx + 11, cy + 7);
        ctx.stroke();
        break;

      case 'router':
        // Circular router with 4 cross arrows
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
        ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10);
        ctx.stroke();
        break;

      case 'switch':
        // Wide rack switch with parallel arrows
        ctx.fillStyle = '#10b981';
        this.drawRoundedRect(ctx, cx - 24, cy - 12, 48, 24, 4, true, true);
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(cx - 16, cy - 4); ctx.lineTo(cx + 16, cy - 4);
        ctx.moveTo(cx + 16, cy + 4); ctx.lineTo(cx - 16, cy + 4);
        ctx.stroke();
        break;

      case 'database':
        // Cylindrical stacked disks
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#ffffff';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.ellipse(cx, cy - 14 + i * 14, 20, 7, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        break;

      case 'wap':
        // Wi-Fi 6 Access Point with broadcast radio waves
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(cx, cy + 10, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        for (let r = 18; r <= 32; r += 7) {
          ctx.beginPath();
          ctx.arc(cx, cy + 10, r, Math.PI * 1.25, Math.PI * 1.75);
          ctx.stroke();
        }
        break;

      case 'phone':
        // VoIP IP Phone
        ctx.fillStyle = '#10b981';
        this.drawRoundedRect(ctx, cx - 22, cy - 16, 44, 34, 4, true, true);
        ctx.fillStyle = '#0f172a';
        this.drawRoundedRect(ctx, cx - 5, cy - 12, 22, 14, 2, true, false);
        ctx.fillStyle = '#ffffff';
        this.drawRoundedRect(ctx, cx - 18, cy - 19, 9, 40, 3, true, false);
        ctx.fillStyle = '#94a3b8';
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            ctx.fillRect(cx - 2 + c * 7, cy + 5 + r * 4, 3, 2);
          }
        }
        break;

      case 'iot':
        // Industrial PLC & IoT Microchip
        ctx.fillStyle = '#f59e0b';
        this.drawRoundedRect(ctx, cx - 20, cy - 20, 40, 40, 5, true, true);
        ctx.fillStyle = '#0f172a';
        this.drawRoundedRect(ctx, cx - 11, cy - 11, 22, 22, 3, true, false);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 16, cy - 7, 5, 3);
        ctx.fillRect(cx - 16, cy + 4, 5, 3);
        ctx.fillRect(cx + 11, cy - 7, 5, 3);
        ctx.fillRect(cx + 11, cy + 4, 5, 3);
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'hypervisor':
        // Bare-Metal ESXi Hypervisor with nested VM grid
        ctx.fillStyle = '#a855f7';
        this.drawRoundedRect(ctx, cx - 24, cy - 22, 48, 44, 4, true, true);
        // Nested VM tiles
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 18, cy - 14, 15, 12);
        ctx.fillRect(cx + 3, cy - 14, 15, 12);
        ctx.fillRect(cx - 18, cy + 2, 15, 12);
        ctx.fillRect(cx + 3, cy + 2, 15, 12);
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(cx - 15, cy - 11, 4, 4);
        ctx.fillRect(cx + 6, cy - 11, 4, 4);
        ctx.fillRect(cx - 15, cy + 5, 4, 4);
        ctx.fillRect(cx + 6, cy + 5, 4, 4);
        break;

      case 'vm':
        // Virtual Machine Translucent Cube
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        this.drawRoundedRect(ctx, cx - 18, cy - 18, 36, 36, 4, true, true);
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 2.5;
        this.drawRoundedRect(ctx, cx - 18, cy - 18, 36, 36, 4, false, true);
        // Inner Core
        ctx.fillStyle = '#38bdf8';
        this.drawRoundedRect(ctx, cx - 8, cy - 8, 16, 16, 2, true, false);
        break;

      case 'container':
        // Docker Container Shipping Pod
        ctx.fillStyle = '#0284c7';
        this.drawRoundedRect(ctx, cx - 22, cy - 16, 44, 32, 3, true, true);
        ctx.fillStyle = '#38bdf8';
        // Vertical ribs
        for (let i = -14; i <= 14; i += 7) {
          ctx.fillRect(cx + i - 1, cy - 12, 2, 24);
        }
        break;

      case 'vpn':
        // IPsec Padlock & Shield
        ctx.fillStyle = '#ec4899';
        this.drawRoundedRect(ctx, cx - 18, cy - 8, 36, 28, 4, true, true);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(cx, cy - 8, 10, Math.PI, 0, false);
        ctx.stroke();
        // Keyhole
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(cx, cy + 3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - 1.5, cy + 4, 3, 6);
        break;

      case 'cloud_vpc':
        // Cloud VPC Diamond / Node
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 20);
        ctx.lineTo(cx + 20, cy);
        ctx.lineTo(cx, cy + 20);
        ctx.lineTo(cx - 20, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('VPC', cx, cy);
        break;

      default:
        // Cloud / Internet
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx - 10, cy + 2, 12, 0, Math.PI * 2);
        ctx.arc(cx + 8, cy - 2, 14, 0, Math.PI * 2);
        ctx.arc(cx + 12, cy + 6, 10, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  createLinkMesh(linkData) {
    const fromNode = this.nodeMeshes.get(linkData.from);
    const toNode = this.nodeMeshes.get(linkData.to);
    if (!fromNode || !toNode) return null;

    const group = new THREE.Group();
    group.name = `link-${linkData.id}`;
    const cableType = linkData.cable || 'cat6';
    group.userData = {
      isLink: true,
      linkId: linkData.id,
      from: linkData.from,
      to: linkData.to,
      cable: cableType,
      speed: linkData.speed || '10 Gbps Fiber',
      status: linkData.status || 'up',
      isSelected: false
    };

    let baseCableColor = CABLE_COLORS[cableType] || STATUS_COLORS.up;
    const linkMat = (linkData.status === 'down')
      ? this.materials.linkDown.clone()
      : new THREE.MeshLambertMaterial({
          color: baseCableColor,
          emissive: (cableType === 'vpn_tunnel') ? 0x2e1065 : 0x002233
        });

    const cylinder = new THREE.Mesh(this.geometries.linkCylinder, linkMat);
    cylinder.userData = { parentGroup: group };
    group.add(cylinder);
    group.userData.cylinder = cylinder;
    group.userData.material = linkMat;
    group.userData.baseColor = baseCableColor;

    // If VPN Tunnel, add outer translucent glowing cryptographic shield
    if (cableType === 'vpn_tunnel') {
      const vpnMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.35,
        wireframe: false
      });
      const vpnMesh = new THREE.Mesh(this.geometries.vpnTunnelCylinder, vpnMat);
      vpnMesh.userData = { parentGroup: group };
      group.add(vpnMesh);
      group.userData.vpnMesh = vpnMesh;
    }

    const hitMesh = new THREE.Mesh(this.geometries.linkHitBox, this.materials.linkHit);
    hitMesh.userData = { parentGroup: group };
    group.add(hitMesh);
    group.userData.hitMesh = hitMesh;

    return group;
  }

  updateLink(linkId) {
    const linkGroup = this.linkMeshes.get(linkId);
    if (!linkGroup) return;

    const fromNode = this.nodeMeshes.get(linkGroup.userData.from);
    const toNode = this.nodeMeshes.get(linkGroup.userData.to);
    if (!fromNode || !toNode) return;

    fromNode.getWorldPosition(_vA);
    toNode.getWorldPosition(_vB);

    const distance = _vA.distanceTo(_vB);
    if (distance < 0.001) return;

    linkGroup.position.copy(_vA);

    _dir.subVectors(_vB, _vA).normalize();
    _quat.setFromUnitVectors(_up, _dir);
    linkGroup.quaternion.copy(_quat);

    linkGroup.userData.cylinder.scale.set(1, distance, 1);
    linkGroup.userData.hitMesh.scale.set(1, distance, 1);
    if (linkGroup.userData.vpnMesh) {
      linkGroup.userData.vpnMesh.scale.set(1, distance, 1);
    }
  }

  updateAllLinks() {
    for (const linkId of this.linkMeshes.keys()) {
      this.updateLink(linkId);
    }
  }

  updateLinksForNode(nodeId) {
    for (const [linkId, linkGroup] of this.linkMeshes.entries()) {
      if (linkGroup.userData.from === nodeId || linkGroup.userData.to === nodeId) {
        this.updateLink(linkId);
      }
    }
  }

  setSelected(target) {
    for (const nodeGroup of this.nodeMeshes.values()) {
      nodeGroup.userData.isSelected = false;
      nodeGroup.userData.halo.material.opacity = 0;
      if (nodeGroup.userData.isBroken) {
        nodeGroup.userData.material.emissive.setHex(0x550000);
      } else {
        nodeGroup.userData.material.emissive.setHex(0x111122);
      }
    }

    for (const linkGroup of this.linkMeshes.values()) {
      linkGroup.userData.isSelected = false;
      const isDown = linkGroup.userData.status === 'down';
      const baseCol = linkGroup.userData.baseColor || STATUS_COLORS.up;
      linkGroup.userData.material.color.setHex(isDown ? STATUS_COLORS.down : baseCol);
      linkGroup.userData.material.emissive.setHex(isDown ? 0x550000 : 0x004455);
    }

    if (!target) return;

    if (target.userData.isNode) {
      target.userData.isSelected = true;
      target.userData.halo.material.opacity = 0.95;
      target.userData.material.emissive.setHex(STATUS_COLORS.selected);
      sound.playSelect();
    } else if (target.userData.isLink) {
      target.userData.isSelected = true;
      target.userData.material.emissive.setHex(STATUS_COLORS.selected);
      sound.playSelect();
    }
  }

  /**
   * Filter / highlight nodes by department (or show all)
   * @param {string|null} department
   */
  filterByDepartment(department) {
    for (const nodeGroup of this.nodeMeshes.values()) {
      const match = !department || (nodeGroup.userData.department === department);
      const mat = nodeGroup.userData.material;
      if (mat) {
        if (match) {
          mat.opacity = 1.0;
          mat.transparent = false;
        } else {
          mat.opacity = 0.25;
          mat.transparent = true;
        }
      }
      if (nodeGroup.userData.labelSprite) {
        nodeGroup.userData.labelSprite.visible = match && this.labelsVisible;
      }
    }
    sound.playClick();
  }

  setNodeVisualStatus(nodeId, status) {
    const nodeGroup = this.nodeMeshes.get(nodeId);
    if (!nodeGroup) return;

    nodeGroup.userData.isBroken = (status === 'down');
    if (status === 'down') {
      nodeGroup.userData.material.color.setHex(STATUS_COLORS.down);
      nodeGroup.userData.material.emissive.setHex(0x660000);
    } else {
      nodeGroup.userData.material.color.setHex(nodeGroup.userData.baseColor);
      nodeGroup.userData.material.emissive.setHex(
        nodeGroup.userData.isSelected ? STATUS_COLORS.selected : 0x111122
      );
    }
  }

  setLinkVisualStatus(linkId, status) {
    const linkGroup = this.linkMeshes.get(linkId);
    if (!linkGroup) return;

    linkGroup.userData.status = status;
    if (status === 'down') {
      linkGroup.userData.material.color.setHex(STATUS_COLORS.down);
      linkGroup.userData.material.emissive.setHex(0x660000);
      linkGroup.userData.material.opacity = 0.7;
    } else {
      const baseCol = linkGroup.userData.baseColor || STATUS_COLORS.up;
      linkGroup.userData.material.color.setHex(baseCol);
      linkGroup.userData.material.emissive.setHex(0x004455);
      linkGroup.userData.material.opacity = 1.0;
    }
  }

  toggleLabels() {
    this.labelsVisible = !this.labelsVisible;
    for (const nodeGroup of this.nodeMeshes.values()) {
      if (nodeGroup.userData.labelSprite) {
        nodeGroup.userData.labelSprite.visible = this.labelsVisible;
      }
    }
    sound.playClick();
    return this.labelsVisible;
  }

  update(delta, elapsed) {
    for (const nodeGroup of this.nodeMeshes.values()) {
      if (nodeGroup.userData.isGrabbed) continue;

      const basePos = nodeGroup.userData.basePosition;
      const phase = nodeGroup.userData.bobPhase;
      const bobOffset = Math.sin(elapsed * 2.2 + phase) * 0.025;
      nodeGroup.position.y = basePos.y + bobOffset;

      this.updateLinksForNode(nodeGroup.userData.nodeId);
    }

    for (const linkGroup of this.linkMeshes.values()) {
      if (linkGroup.userData.status === 'down') {
        const flicker = 0.4 + Math.sin(elapsed * 12 + Number(linkGroup.id)) * 0.25;
        linkGroup.userData.material.opacity = THREE.MathUtils.clamp(flicker, 0.2, 0.85);
      }
    }
  }

  clear() {
    for (const nodeGroup of this.nodeMeshes.values()) {
      if (nodeGroup.userData.labelSprite) {
        nodeGroup.userData.labelSprite.material.map.dispose();
        nodeGroup.userData.labelSprite.material.dispose();
      }
      if (nodeGroup.userData.material) {
        nodeGroup.userData.material.dispose();
      }
      if (nodeGroup.userData.halo) {
        nodeGroup.userData.halo.geometry.dispose();
        nodeGroup.userData.halo.material.dispose();
      }
      this.nodesGroup.remove(nodeGroup);
    }
    this.nodeMeshes.clear();

    for (const linkGroup of this.linkMeshes.values()) {
      if (linkGroup.userData.material) {
        linkGroup.userData.material.dispose();
      }
      this.linksGroup.remove(linkGroup);
    }
    this.linkMeshes.clear();
  }

  dispose() {
    this.clear();
    for (const geom of Object.values(this.geometries)) {
      geom.dispose();
    }
    for (const mat of Object.values(this.materials)) {
      mat.dispose();
    }
    this.scene.remove(this.nodesGroup);
    this.scene.remove(this.linksGroup);
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
