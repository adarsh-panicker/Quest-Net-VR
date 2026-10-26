/**
 * interaction.js - VR Controller Tracking, Raycasting, Locomotion, Grabbing & Desktop Fallback
 *
 * Implements:
 * 1. WebXR dual controller setup with XRControllerModelFactory models and ray lasers
 * 2. Raycasting against nodes, links, and VR menu panels with cyan hover highlight
 * 3. Haptic actuator pulses on hover, selection, and failure triggers
 * 4. Grip-based node dragging with real-time dynamic link updates
 * 5. Head-relative smooth locomotion (Left Stick, 2 m/s) & 30° snap-turning (Right Stick)
 * 6. Desktop mouse raycasting, click-to-select, Shift-drag node movement & interactive builder
 */

import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { sound } from './audio.js';

const _rayOrigin = new THREE.Vector3();
const _rayDir = new THREE.Vector3();
const _camForward = new THREE.Vector3();
const _camRight = new THREE.Vector3();
const _grabOffset = new THREE.Vector3();
const _planeIntersect = new THREE.Vector3();
const _dragPlane = new THREE.Plane();
const _mouseRaycaster = new THREE.Raycaster();

export class InteractionManager {
  /**
   * @param {Object} params
   * @param {THREE.WebGLRenderer} params.renderer
   * @param {THREE.Scene} params.scene
   * @param {THREE.Camera} params.camera
   * @param {THREE.Group} params.dolly
   * @param {import('./nodes.js').NodeVisualManager} params.nodeVisuals
   * @param {import('./menu.js').VRMenuManager} params.menuManager
   * @param {import('./simulation.js').SimulationManager} params.simulation
   * @param {import('./graph.js').Graph} params.graph
   * @param {HTMLElement} params.domElement
   */
  constructor({ renderer, scene, camera, dolly, nodeVisuals, menuManager, simulation, graph, domElement }) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.dolly = dolly;
    this.nodeVisuals = nodeVisuals;
    this.menuManager = menuManager;
    this.simulation = simulation;
    this.graph = graph;
    this.domElement = domElement;

    this.selectedTarget = null;
    this.hoveredObject = null;

    // Interactive Connect Tool State (Connect Node A -> Node B)
    this.connectMode = false;
    this.connectSourceId = null;

    // Grab state for VR
    this.grabbedNode = null;
    this.grabbingController = null;
    this.grabInitialDist = 0;

    // Locomotion & Snap Turn state
    this.canSnapTurn = true;
    this.snapTurnCooldownTimer = 0;
    this.moveSpeed = 2.0;
    this.stickDeadzone = 0.15;

    // Button states
    this.prevYButtonState = false;

    // Desktop interaction state
    this.mouse = new THREE.Vector2();
    this.isDesktopDragging = false;
    this.desktopDragNode = null;
    this.isShiftDown = false;

    // References to panels
    this.tutorialPanel = null;
    this.tourManager = null;

    this.initVRControllers();
    this.initDesktopEvents();
  }

  setTutorialPanel(panel) {
    this.tutorialPanel = panel;
  }

  setClassroomManager(classroom) {
    this.classroomManager = classroom;
  }

  // ==========================================
  // BUILDER: CONNECT MODE
  // ==========================================
  toggleConnectMode() {
    this.connectMode = !this.connectMode;
    this.connectSourceId = null;
    if (this.connectMode) {
      this.menuManager.setStatus('Connect Mode: Click or Trigger FIRST node to connect.', 'warning');
      sound.playClick();
    } else {
      this.menuManager.setStatus('Connect Mode cancelled.', 'info');
    }
    return this.connectMode;
  }

  deleteSelected() {
    if (!this.selectedTarget) {
      this.menuManager.setStatus('Select a node or link first, then press Delete.', 'warning');
      return;
    }

    if (this.selectedTarget.userData.isNode) {
      const id = this.selectedTarget.userData.nodeId;
      const name = this.graph.nodes.get(id)?.name || id;
      this.graph.removeNode(id);
      this.nodeVisuals.removeSingleNode(id);
      this.deselect();
      this.menuManager.setStatus(`Deleted Node [${name}] and its links.`, 'info');
    } else if (this.selectedTarget.userData.isLink) {
      const id = this.selectedTarget.userData.linkId;
      this.graph.removeLink(id);
      this.nodeVisuals.removeSingleLink(id);
      this.deselect();
      this.menuManager.setStatus(`Deleted Link [${id}].`, 'info');
    }
  }

  // ==========================================
  // VR CONTROLLERS SETUP
  // ==========================================
  initVRControllers() {
    this.controllerModelFactory = new XRControllerModelFactory();
    this.controllers = [];
    this.controllerGrips = [];

    for (let i = 0; i < 2; i++) {
      const controller = this.renderer.xr.getController(i);
      controller.userData.index = i;
      controller.userData.raycaster = new THREE.Raycaster();

      const rayGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -5)
      ]);
      const rayMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.75
      });
      const rayLine = new THREE.Line(rayGeo, rayMat);
      rayLine.name = `ray-line-${i}`;
      controller.add(rayLine);
      controller.userData.rayLine = rayLine;
      controller.userData.rayMat = rayMat;

      const dotGeo = new THREE.SphereGeometry(0.012, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
      const hitDot = new THREE.Mesh(dotGeo, dotMat);
      hitDot.visible = false;
      this.scene.add(hitDot);
      controller.userData.hitDot = hitDot;

      controller.addEventListener('selectstart', (e) => this.onSelectStart(e.target));
      controller.addEventListener('selectend', (e) => this.onSelectEnd(e.target));
      controller.addEventListener('squeezestart', (e) => this.onSqueezeStart(e.target));
      controller.addEventListener('squeezeend', (e) => this.onSqueezeEnd(e.target));

      this.dolly.add(controller);
      this.controllers.push(controller);

      const controllerGrip = this.renderer.xr.getControllerGrip(i);
      controllerGrip.add(this.controllerModelFactory.createControllerModel(controllerGrip));
      this.dolly.add(controllerGrip);
      this.controllerGrips.push(controllerGrip);
    }
  }

  // ==========================================
  // VR INPUT HANDLERS
  // ==========================================
  onSelectStart(controller) {
    // Dismiss start cheat sheet if visible
    if (this.tutorialPanel && this.tutorialPanel.visible) {
      this.tutorialPanel.visible = false;
      this.triggerHaptic(controller, 0.5, 60);
      sound.playClick();
      return;
    }

    // VR Classroom Billboard hit-testing
    if (this.classroomManager && this.classroomManager.visible) {
      const hit = this.getControllerIntersection(controller);
      if (hit && this.classroomManager.handlePointerDown(hit)) {
        this.triggerHaptic(controller, 0.6, 70);
        return;
      }
    }

    const hit = this.getControllerIntersection(controller);
    if (!hit) {
      if (this.simulation.traceState === 'idle' && !this.connectMode) {
        this.deselect();
      }
      return;
    }

    // Check VR Wrist Menu
    if (hit.object === this.menuManager.menuMesh) {
      const buttonId = this.menuManager.hitTestMenu(hit.uv);
      if (buttonId) {
        this.menuManager.pressButton(buttonId);
        this.triggerHaptic(controller, 0.7, 80);
      }
      return;
    }

    const targetGroup = hit.object.userData.parentGroup || hit.object;

    if (targetGroup.userData.isNode) {
      const nodeId = targetGroup.userData.nodeId;

      // Connect Mode Flow
      if (this.connectMode) {
        if (!this.connectSourceId) {
          this.connectSourceId = nodeId;
          const srcName = this.graph.nodes.get(nodeId)?.name || nodeId;
          this.menuManager.setStatus(`Connect: [${srcName}] selected. Now select SECOND node.`, 'warning');
          this.triggerHaptic(controller, 0.6, 90);
          sound.playSelect();
        } else if (this.connectSourceId !== nodeId) {
          const lId = this.graph.addLink(this.connectSourceId, nodeId);
          this.nodeVisuals.addSingleLink({ id: lId, from: this.connectSourceId, to: nodeId, status: 'up' });
          const srcName = this.graph.nodes.get(this.connectSourceId)?.name || this.connectSourceId;
          const dstName = this.graph.nodes.get(nodeId)?.name || nodeId;
          this.menuManager.setStatus(`Connected [${srcName}] ↔ [${dstName}]!`, 'success');
          this.triggerHaptic(controller, 0.8, 120);
          sound.playSuccess();
          this.connectMode = false;
          this.connectSourceId = null;
        }
        return;
      }

      // Trace Mode Flow
      if (this.simulation.traceState === 'await_source' || this.simulation.traceState === 'await_dest') {
        this.simulation.handleTraceNodeSelect(nodeId);
        return;
      }

      this.selectTarget(targetGroup);
      this.triggerHaptic(controller, 0.6, 90);
    } else if (targetGroup.userData.isLink) {
      if (this.simulation.traceState === 'idle' && !this.connectMode) {
        this.selectTarget(targetGroup);
        this.triggerHaptic(controller, 0.5, 70);
      }
    }
  }

  onSelectEnd(controller) {}

  onSqueezeStart(controller) {
    if (this.grabbedNode) return;

    const hit = this.getControllerIntersection(controller);
    if (!hit) return;

    const targetGroup = hit.object.userData.parentGroup || hit.object;
    if (targetGroup.userData.isNode) {
      this.grabbedNode = targetGroup;
      this.grabbingController = controller;
      this.grabbedNode.userData.isGrabbed = true;

      controller.getWorldPosition(_rayOrigin);
      this.grabInitialDist = _rayOrigin.distanceTo(this.grabbedNode.position);

      controller.worldToLocal(_grabOffset.copy(this.grabbedNode.position));
      this.grabLocalOffset = _grabOffset.clone();

      this.triggerHaptic(controller, 0.8, 120);
      sound.playSelect();
    }
  }

  onSqueezeEnd(controller) {
    if (this.grabbedNode && this.grabbingController === controller) {
      this.grabbedNode.userData.basePosition.copy(this.grabbedNode.position);
      this.graph.nodes.get(this.grabbedNode.userData.nodeId).position = {
        x: Number(this.grabbedNode.position.x.toFixed(2)),
        y: Number(this.grabbedNode.position.y.toFixed(2)),
        z: Number(this.grabbedNode.position.z.toFixed(2))
      };

      this.grabbedNode.userData.isGrabbed = false;
      this.nodeVisuals.updateLinksForNode(this.grabbedNode.userData.nodeId);

      if (this.selectedTarget === this.grabbedNode) {
        this.menuManager.showNodeInfo(
          this.graph.nodes.get(this.grabbedNode.userData.nodeId),
          this.graph.getNeighbors(this.grabbedNode.userData.nodeId).length,
          this.grabbedNode.position
        );
      }

      this.grabbedNode = null;
      this.grabbingController = null;
      this.triggerHaptic(controller, 0.4, 50);
      sound.playClick();
    }
  }

  getControllerIntersection(controller) {
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);

    _rayOrigin.setFromMatrixPosition(controller.matrixWorld);
    _rayDir.set(0, 0, -1).applyMatrix4(tempMatrix);

    const raycaster = controller.userData.raycaster;
    raycaster.ray.origin.copy(_rayOrigin);
    raycaster.ray.direction.copy(_rayDir);

    const targets = [];
    if (this.menuManager.menuMesh.visible) {
      targets.push(this.menuManager.menuMesh);
    }
    if (this.tutorialPanel && this.tutorialPanel.visible) {
      targets.push(this.tutorialPanel);
    }
    if (this.tourManager && this.tourManager.mesh && this.tourManager.mesh.visible) {
      targets.push(this.tourManager.mesh);
    }
    targets.push(this.nodeVisuals.nodesGroup);
    targets.push(this.nodeVisuals.linksGroup);

    const intersects = raycaster.intersectObjects(targets, true);
    return intersects.length > 0 ? intersects[0] : null;
  }

  triggerHaptic(controller, intensity = 0.5, durationMs = 50) {
    const session = this.renderer.xr.getSession();
    if (!session || !session.inputSources) return;

    const inputSource = session.inputSources[controller.userData.index];
    if (inputSource && inputSource.gamepad) {
      const actuators = inputSource.gamepad.hapticActuators;
      if (actuators && actuators.length > 0) {
        actuators[0].pulse(intensity, durationMs);
      } else if (inputSource.gamepad.vibrationActuator) {
        inputSource.gamepad.vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration: durationMs,
          weakMagnitude: intensity,
          strongMagnitude: intensity
        }).catch(() => {});
      }
    }
  }

  selectTarget(targetGroup) {
    this.selectedTarget = targetGroup;
    this.nodeVisuals.setSelected(targetGroup);

    if (targetGroup.userData.isNode) {
      const nodeId = targetGroup.userData.nodeId;
      const nodeData = this.graph.nodes.get(nodeId);
      const connectedCount = this.graph.getNeighbors(nodeId).length;
      this.menuManager.showNodeInfo(nodeData, connectedCount, targetGroup.position);
      this.menuManager.setStatus(`Selected Node: ${nodeData?.name || nodeId} (${nodeData?.ip})`);
    } else if (targetGroup.userData.isLink) {
      const linkId = targetGroup.userData.linkId;
      const linkData = this.graph.links.find(l => l.id === linkId);
      this.menuManager.showLinkInfo(linkData, targetGroup.position);
      this.menuManager.setStatus(`Selected Link: ${linkData?.from} ↔ ${linkData?.to}`);
    }
  }

  deselect() {
    this.selectedTarget = null;
    this.nodeVisuals.setSelected(null);
    this.menuManager.hideInfo();
    this.menuManager.setStatus('Ready. Select a node or press Trace Packet.');
  }

  // ==========================================
  // DESKTOP INTERACTION (MOUSE & KEYBOARD)
  // ==========================================
  initDesktopEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (this.isDesktopDragging && this.desktopDragNode) {
        this.updateDesktopDrag();
      }
    });

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('#desktop-ui') || e.target.closest('.vr-button')) return;

      if (e.button === 0) {
        _mouseRaycaster.setFromCamera(this.mouse, this.camera);
        const targets = [
          this.nodeVisuals.nodesGroup,
          this.nodeVisuals.linksGroup
        ];
        if (this.tutorialPanel && this.tutorialPanel.visible) {
          targets.push(this.tutorialPanel);
        }
        if (this.classroomManager && this.classroomManager.visible && this.classroomManager.billboardMesh) {
          targets.push(this.classroomManager.billboardMesh);
        }

        const hits = _mouseRaycaster.intersectObjects(targets, true);
        if (hits.length > 0) {
          const hit = hits[0];
          if (hit.object === this.tutorialPanel) {
            this.tutorialPanel.visible = false;
            sound.playClick();
            return;
          }
          if (this.classroomManager && this.classroomManager.visible && hit.object === this.classroomManager.billboardMesh) {
            this.classroomManager.handlePointerDown(hit);
            return;
          }

          const targetGroup = hit.object.userData.parentGroup || hit.object;

          if (this.isShiftDown && targetGroup.userData.isNode) {
            this.isDesktopDragging = true;
            this.desktopDragNode = targetGroup;
            this.desktopDragNode.userData.isGrabbed = true;

            _dragPlane.setFromNormalAndCoplanarPoint(
              this.camera.getWorldDirection(_camForward).negate(),
              targetGroup.position
            );
            sound.playSelect();
            return;
          }

          if (targetGroup.userData.isNode) {
            const nodeId = targetGroup.userData.nodeId;

            if (this.connectMode) {
              if (!this.connectSourceId) {
                this.connectSourceId = nodeId;
                const srcName = this.graph.nodes.get(nodeId)?.name || nodeId;
                this.menuManager.setStatus(`Connect: [${srcName}] selected. Now click destination node.`, 'warning');
                sound.playSelect();
              } else if (this.connectSourceId !== nodeId) {
                const lId = this.graph.addLink(this.connectSourceId, nodeId);
                this.nodeVisuals.addSingleLink({ id: lId, from: this.connectSourceId, to: nodeId, status: 'up' });
                const srcName = this.graph.nodes.get(this.connectSourceId)?.name || this.connectSourceId;
                const dstName = this.graph.nodes.get(nodeId)?.name || nodeId;
                this.menuManager.setStatus(`Connected [${srcName}] ↔ [${dstName}]!`, 'success');
                sound.playSuccess();
                this.connectMode = false;
                this.connectSourceId = null;
              }
              return;
            }

            if (this.simulation.traceState === 'await_source' || this.simulation.traceState === 'await_dest') {
              this.simulation.handleTraceNodeSelect(nodeId);
            } else {
              this.selectTarget(targetGroup);
            }
          } else if (targetGroup.userData.isLink) {
            if (this.simulation.traceState === 'idle' && !this.connectMode) {
              this.selectTarget(targetGroup);
            }
          }
        } else {
          if (!this.isShiftDown && this.simulation.traceState === 'idle' && !this.connectMode) {
            this.deselect();
          }
        }
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDesktopDragging && this.desktopDragNode) {
        this.desktopDragNode.userData.basePosition.copy(this.desktopDragNode.position);
        this.graph.nodes.get(this.desktopDragNode.userData.nodeId).position = {
          x: Number(this.desktopDragNode.position.x.toFixed(2)),
          y: Number(this.desktopDragNode.position.y.toFixed(2)),
          z: Number(this.desktopDragNode.position.z.toFixed(2))
        };
        this.desktopDragNode.userData.isGrabbed = false;
        this.nodeVisuals.updateLinksForNode(this.desktopDragNode.userData.nodeId);

        if (this.selectedTarget === this.desktopDragNode) {
          this.menuManager.showNodeInfo(
            this.graph.nodes.get(this.desktopDragNode.userData.nodeId),
            this.graph.getNeighbors(this.desktopDragNode.userData.nodeId).length,
            this.desktopDragNode.position
          );
        }

        this.isDesktopDragging = false;
        this.desktopDragNode = null;
        sound.playClick();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Shift') {
        this.isShiftDown = true;
      } else if (e.key === 't' || e.key === 'T') {
        this.simulation.startTraceMode();
      } else if (e.key === 'b' || e.key === 'B') {
        this.simulation.breakSelected(this.selectedTarget);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        this.deleteSelected();
      } else if (e.key === 'r' || e.key === 'R') {
        this.simulation.resetAll();
      } else if (e.key === 'l' || e.key === 'L') {
        this.nodeVisuals.toggleLabels();
      } else if (e.key === 'c' || e.key === 'C') {
        this.toggleConnectMode();
      } else if (e.key === 'h' || e.key === 'H') {
        if (this.tutorialPanel) {
          this.tutorialPanel.visible = !this.tutorialPanel.visible;
          sound.playClick();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') {
        this.isShiftDown = false;
      }
    });
  }

  updateDesktopDrag() {
    _mouseRaycaster.setFromCamera(this.mouse, this.camera);
    if (_mouseRaycaster.ray.intersectPlane(_dragPlane, _planeIntersect)) {
      this.desktopDragNode.position.copy(_planeIntersect);
      this.nodeVisuals.updateLinksForNode(this.desktopDragNode.userData.nodeId);
    }
  }

  // ==========================================
  // PER-FRAME VR INPUT LOOP
  // ==========================================
  update(delta) {
    const session = this.renderer.xr.getSession();
    if (session && this.renderer.xr.isPresenting) {
      this.updateVRThumbsticks(session, delta);
      this.updateVRControllers(delta);
    }
  }

  updateVRControllers(delta) {
    for (const controller of this.controllers) {
      const rayLine = controller.userData.rayLine;
      const rayMat = controller.userData.rayMat;
      const hitDot = controller.userData.hitDot;

      if (this.grabbedNode && this.grabbingController === controller) {
        controller.localToWorld(_grabOffset.copy(this.grabLocalOffset));
        this.grabbedNode.position.copy(_grabOffset);
        this.nodeVisuals.updateLinksForNode(this.grabbedNode.userData.nodeId);

        rayLine.scale.set(1, 1, this.grabInitialDist / 5.0);
        rayMat.color.setHex(0xfacc15);
        hitDot.position.copy(this.grabbedNode.position);
        hitDot.visible = true;
        continue;
      }

      const hit = this.getControllerIntersection(controller);
      if (hit) {
        const dist = hit.distance;
        rayLine.scale.set(1, 1, dist / 5.0);
        rayMat.color.setHex(0x00f3ff);
        hitDot.position.copy(hit.point);
        hitDot.visible = true;

        if (hit.object === this.menuManager.menuMesh) {
          const hoveredBtn = this.menuManager.hitTestMenu(hit.uv);
          if (hoveredBtn && hoveredBtn !== controller.userData.lastHoveredBtn) {
            this.triggerHaptic(controller, 0.25, 20);
            controller.userData.lastHoveredBtn = hoveredBtn;
          } else if (!hoveredBtn) {
            controller.userData.lastHoveredBtn = null;
          }
        } else {
          controller.userData.lastHoveredBtn = null;
        }
      } else {
        rayLine.scale.set(1, 1, 1);
        rayMat.color.setHex(0xffffff);
        hitDot.visible = false;
        controller.userData.lastHoveredBtn = null;
      }
    }
  }

  updateVRThumbsticks(session, delta) {
    if (!session.inputSources) return;

    if (!this.canSnapTurn) {
      this.snapTurnCooldownTimer += delta;
      if (this.snapTurnCooldownTimer >= 0.28) {
        this.canSnapTurn = true;
        this.snapTurnCooldownTimer = 0;
      }
    }

    for (const source of session.inputSources) {
      if (!source.gamepad || !source.gamepad.axes) continue;

      const axes = source.gamepad.axes;
      const buttons = source.gamepad.buttons;
      const isLeft = (source.handedness === 'left');
      const isRight = (source.handedness === 'right');

      let stickX = (axes.length >= 4) ? axes[2] : axes[0];
      let stickY = (axes.length >= 4) ? axes[3] : axes[1];

      if (Math.abs(stickX) < this.stickDeadzone) stickX = 0;
      if (Math.abs(stickY) < this.stickDeadzone) stickY = 0;

      if (isLeft) {
        if (stickX !== 0 || stickY !== 0) {
          this.camera.getWorldDirection(_camForward);
          _camForward.y = 0;
          _camForward.normalize();

          _camRight.crossVectors(_camForward, this.camera.up).normalize();

          this.dolly.position.addScaledVector(_camForward, -stickY * this.moveSpeed * delta);
          this.dolly.position.addScaledVector(_camRight, stickX * this.moveSpeed * delta);
        }

        if (buttons && buttons.length > 4) {
          const yPressed = buttons[4].pressed || (buttons[5] && buttons[5].pressed);
          if (yPressed && !this.prevYButtonState) {
            this.menuManager.toggleVisibility();
            const ctrl = this.controllers[0];
            if (ctrl) this.triggerHaptic(ctrl, 0.4, 40);
          }
          this.prevYButtonState = yPressed;
        }
      }

      if (isRight && this.canSnapTurn) {
        if (stickX > 0.55) {
          this.dolly.rotation.y -= Math.PI / 6;
          this.canSnapTurn = false;
          this.snapTurnCooldownTimer = 0;
          const ctrl = this.controllers[1] || this.controllers[0];
          if (ctrl) this.triggerHaptic(ctrl, 0.35, 30);
          sound.playClick();
        } else if (stickX < -0.55) {
          this.dolly.rotation.y += Math.PI / 6;
          this.canSnapTurn = false;
          this.snapTurnCooldownTimer = 0;
          const ctrl = this.controllers[1] || this.controllers[0];
          if (ctrl) this.triggerHaptic(ctrl, 0.35, 30);
          sound.playClick();
        }
      }
    }
  }

  dispose() {
    for (const ctrl of this.controllers) {
      if (ctrl.userData.hitDot) {
        this.scene.remove(ctrl.userData.hitDot);
        ctrl.userData.hitDot.geometry.dispose();
        ctrl.userData.hitDot.material.dispose();
      }
    }
  }
}
