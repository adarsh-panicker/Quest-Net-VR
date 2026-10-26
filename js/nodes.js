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
import { getHardwareFaceplateTexture, drawPhotorealisticHardwarePhoto } from './hardware_textures.js';

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
    let material = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.35,
      metalness: 0.2,
      emissive: 0x111122
    });

    let mainMesh;

    if (type === 'switch') {
      mainMesh = new THREE.Group();
      // 1U Rack-mount chassis
      const swGeom = new THREE.BoxGeometry(0.54, 0.13, 0.28);
      const sideMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.7 });
      const faceMat = new THREE.MeshStandardMaterial({
        map: getHardwareFaceplateTexture('switch'),
        roughness: 0.35,
        metalness: 0.2,
        emissive: 0x111122
      });
      // BoxGeometry faces: [+x, -x, +y, -y, +z (front), -z (rear)]
      const swBox = new THREE.Mesh(swGeom, [sideMat, sideMat, sideMat, sideMat, faceMat, sideMat]);
      mainMesh.add(swBox);

      // Metallic rack ear brackets on left and right
      const earGeom = new THREE.BoxGeometry(0.02, 0.13, 0.05);
      const earMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
      const leftEar = new THREE.Mesh(earGeom, earMat);
      leftEar.position.set(-0.28, 0, 0.115);
      const rightEar = new THREE.Mesh(earGeom, earMat);
      rightEar.position.set(0.28, 0, 0.115);
      mainMesh.add(leftEar);
      mainMesh.add(rightEar);
      material = faceMat;
    } else if (type === 'router') {
      mainMesh = new THREE.Group();
      // Modular WAN router chassis
      const rGeom = new THREE.BoxGeometry(0.50, 0.17, 0.30);
      const rSideMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.6 });
      const rFaceMat = new THREE.MeshStandardMaterial({
        map: getHardwareFaceplateTexture('router'),
        roughness: 0.35,
        metalness: 0.2,
        emissive: 0x111122
      });
      const rBox = new THREE.Mesh(rGeom, [rSideMat, rSideMat, rSideMat, rSideMat, rFaceMat, rSideMat]);
      mainMesh.add(rBox);

      const earGeom = new THREE.BoxGeometry(0.02, 0.17, 0.05);
      const earMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
      const leftEar = new THREE.Mesh(earGeom, earMat);
      leftEar.position.set(-0.26, 0, 0.125);
      const rightEar = new THREE.Mesh(earGeom, earMat);
      rightEar.position.set(0.26, 0, 0.125);
      mainMesh.add(leftEar);
      mainMesh.add(rightEar);
      material = rFaceMat;
    } else if (type === 'server' || type === 'hypervisor') {
      mainMesh = new THREE.Group();
      // 2U Rack server chassis
      const sGeom = new THREE.BoxGeometry(0.36, 0.54, 0.32);
      const sSideMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6, metalness: 0.7 });
      const sFaceMat = new THREE.MeshStandardMaterial({
        map: getHardwareFaceplateTexture(type),
        roughness: 0.35,
        metalness: 0.2,
        emissive: 0x111122
      });
      const sBox = new THREE.Mesh(sGeom, [sSideMat, sSideMat, sSideMat, sSideMat, sFaceMat, sSideMat]);
      mainMesh.add(sBox);
      material = sFaceMat;
    } else if (type === 'firewall' || type === 'vpn') {
      mainMesh = new THREE.Group();
      // Security appliance chassis
      const fwGeom = new THREE.BoxGeometry(0.44, 0.24, 0.30);
      const fwSideMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.6, metalness: 0.6 });
      const fwFaceMat = new THREE.MeshStandardMaterial({
        map: getHardwareFaceplateTexture(type),
        roughness: 0.35,
        metalness: 0.2,
        emissive: 0x220505
      });
      const fwBox = new THREE.Mesh(fwGeom, [fwSideMat, fwSideMat, fwSideMat, fwSideMat, fwFaceMat, fwSideMat]);
      mainMesh.add(fwBox);
      material = fwFaceMat;
    } else if (type === 'database') {
      mainMesh = new THREE.Group();
      // 3U Enterprise SAN storage array
      const dbGeom = new THREE.BoxGeometry(0.46, 0.38, 0.32);
      const dbSideMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6, metalness: 0.7 });
      const dbFaceMat = new THREE.MeshStandardMaterial({
        map: getHardwareFaceplateTexture('database'),
        roughness: 0.35,
        metalness: 0.2,
        emissive: 0x111122
      });
      const dbBox = new THREE.Mesh(dbGeom, [dbSideMat, dbSideMat, dbSideMat, dbSideMat, dbFaceMat, dbSideMat]);
      mainMesh.add(dbBox);
      material = dbFaceMat;
    } else if (type === 'desktop' || type === 'pc') {
      mainMesh = new THREE.Group();
      // Thin-bezel LCD Monitor with OS Desktop & CLI Terminal
      const screenGeom = new THREE.BoxGeometry(0.38, 0.26, 0.02);
      const monitorSideMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.5, metalness: 0.8 });
      const screenFaceMat = new THREE.MeshStandardMaterial({
        map: getHardwareFaceplateTexture('desktop'),
        roughness: 0.2,
        metalness: 0.1,
        emissive: 0x111122
      });
      const monitor = new THREE.Mesh(screenGeom, [monitorSideMat, monitorSideMat, monitorSideMat, monitorSideMat, screenFaceMat, monitorSideMat]);
      monitor.position.set(-0.06, 0.14, 0);

      // Aluminum monitor stand
      const standMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
      const standNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 12), standMat);
      standNeck.position.set(-0.06, 0.04, -0.02);
      const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.16), standMat);
      standBase.position.set(-0.06, -0.03, 0);

      // Mini Desktop Tower Chassis beside monitor
      const towerGeom = new THREE.BoxGeometry(0.12, 0.28, 0.24);
      const towerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
      const tower = new THREE.Mesh(towerGeom, towerMat);
      tower.position.set(0.20, 0.11, 0);

      mainMesh.add(monitor);
      mainMesh.add(standNeck);
      mainMesh.add(standBase);
      mainMesh.add(tower);
      material = screenFaceMat;
    } else if (type === 'laptop') {
      mainMesh = new THREE.Group();
      // Anodized aluminum unibody keyboard deck
      const lapBaseGeom = new THREE.BoxGeometry(0.32, 0.02, 0.22);
      const lapMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 });
      const lapBase = new THREE.Mesh(lapBaseGeom, lapMat);

      // Tilted high-res display
      const lapScreenGeom = new THREE.BoxGeometry(0.32, 0.22, 0.015);
      const lapScreenFace = new THREE.MeshStandardMaterial({
        map: getHardwareFaceplateTexture('laptop'),
        roughness: 0.2,
        metalness: 0.1,
        emissive: 0x111122
      });
      const lapScreen = new THREE.Mesh(lapScreenGeom, [lapMat, lapMat, lapMat, lapMat, lapScreenFace, lapMat]);
      lapScreen.position.set(0, 0.11, -0.09);
      lapScreen.rotation.x = -0.32;

      mainMesh.add(lapBase);
      mainMesh.add(lapScreen);
      material = lapScreenFace;
    } else if (type === 'printer') {
      mainMesh = new THREE.Group();
      const pGeom = new THREE.BoxGeometry(0.36, 0.24, 0.30);
      const pSideMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
      const pFaceMat = new THREE.MeshStandardMaterial({
        map: getHardwareFaceplateTexture('printer'),
        roughness: 0.3,
        metalness: 0.1,
        emissive: 0x111122
      });
      const printerBox = new THREE.Mesh(pGeom, [pSideMat, pSideMat, pSideMat, pSideMat, pFaceMat, pSideMat]);

      const paperTray = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.015, 0.16),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 })
      );
      paperTray.position.set(0, 0.13, -0.06);
      paperTray.rotation.x = -0.4;

      mainMesh.add(printerBox);
      mainMesh.add(paperTray);
      material = pFaceMat;
    } else if (type === 'wap') {
      mainMesh = new THREE.Group();
      // Ceiling AP disc
      const domeGeom = new THREE.CylinderGeometry(0.24, 0.26, 0.06, 24);
      const domeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const domeFace = new THREE.MeshStandardMaterial({
        map: getHardwareFaceplateTexture('wap'),
        roughness: 0.2,
        emissive: 0x002222
      });
      const dome = new THREE.Mesh(domeGeom, [domeMat, domeFace, domeMat]);
      dome.rotation.x = Math.PI / 2;
      mainMesh.add(dome);
      material = domeFace;
    } else if (type === 'phone') {
      mainMesh = new THREE.Group();
      const phoneGeom = new THREE.BoxGeometry(0.26, 0.18, 0.14);
      const phoneSideMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
      const phoneFace = new THREE.MeshStandardMaterial({
        map: getHardwareFaceplateTexture('phone'),
        roughness: 0.3,
        emissive: 0x111122
      });
      const phoneBody = new THREE.Mesh(phoneGeom, [phoneSideMat, phoneSideMat, phoneSideMat, phoneSideMat, phoneFace, phoneSideMat]);
      phoneBody.rotation.x = -0.35;

      const handset = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.05, 0.26),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })
      );
      handset.position.set(-0.11, 0.05, 0);
      handset.rotation.x = -0.35;

      mainMesh.add(phoneBody);
      mainMesh.add(handset);
      material = phoneFace;
    } else if (type === 'internet' || type === 'cloud' || type === 'cloud_vpc') {
      mainMesh = new THREE.Group();
      const globeGeom = new THREE.SphereGeometry(0.24, 24, 24);
      const globeMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x00f3ff,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.4
      });
      const globe = new THREE.Mesh(globeGeom, globeMat);

      // Orbital glowing data ring
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true });
      const orbRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.012, 8, 32), ringMat);
      orbRing.rotation.x = Math.PI / 3;

      mainMesh.add(globe);
      mainMesh.add(orbRing);
      material = globeMat;
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
      material = outerMat;
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
    canvas.width = 680;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    // Rounded card background
    const x = 16, y = 16, w = 648, h = 268, r = 24;
    ctx.fillStyle = 'rgba(11, 15, 26, 0.96)';
    const deptColor = DEPARTMENT_COLORS[department] || '#00f3ff';
    ctx.strokeStyle = deptColor;
    ctx.lineWidth = 6;
    this.drawRoundedRect(ctx, x, y, w, h, r, true, true);

    // Draw Real Photorealistic Equipment Photo in top-left
    drawPhotorealisticHardwarePhoto(ctx, type, 32, 32, 136, 92);

    // Device Full Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    let displayName = name;
    if (displayName.length > 22) {
      displayName = displayName.substring(0, 20) + '...';
    }
    ctx.fillText(displayName, 186, 42);

    // IPv4 Address
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 30px "Consolas", monospace';
    ctx.fillText(ip, 186, 88);

    // Separator line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(32, 145);
    ctx.lineTo(w, 145);
    ctx.stroke();

    // Department Badge
    ctx.fillStyle = deptColor;
    ctx.globalAlpha = 0.2;
    this.drawRoundedRect(ctx, 32, 170, 380, 48, 10, true, false);
    ctx.globalAlpha = 1.0;

    ctx.strokeStyle = deptColor;
    ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, 32, 170, 380, 48, 10, false, true);

    ctx.fillStyle = deptColor;
    ctx.font = 'bold 22px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🏢 ${department.toUpperCase()}`, 222, 194);

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
    sprite.scale.set(0.60, 0.26, 1.0);
    sprite.userData.canvas = canvas;
    sprite.userData.texture = texture;

    return sprite;
  }

  /**
   * Draw high-res photorealistic hardware equipment photo on 2D canvas
   */
  drawDeviceThumbnail(ctx, type, bx, by, bw, bh) {
    drawPhotorealisticHardwarePhoto(ctx, type, bx, by, bw, bh);
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
