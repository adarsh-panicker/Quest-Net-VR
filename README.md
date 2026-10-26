# 🌐 VR Network Topology Explorer

<p align="center">
  <img src="https://img.shields.io/badge/Three.js-r160-00f3ff?style=for-the-badge&logo=three.js&logoColor=black" alt="Three.js r160">
  <img src="https://img.shields.io/badge/WebXR-Meta_Quest_2-blueviolet?style=for-the-badge&logo=oculus&logoColor=white" alt="WebXR Meta Quest 2">
  <img src="https://img.shields.io/badge/Pure_Static-Zero_Build_Step-10b981?style=for-the-badge" alt="Pure Static">
  <img src="https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge" alt="MIT License">
  <img src="https://img.shields.io/badge/Status-Production_Ready-brightgreen?style=for-the-badge" alt="Status">
</p>

An interactive, zero-build **WebXR Network Engineering, Security Simulator, and Onboarding Training Suite** built specifically for the **Meta Quest 2 Browser** and modern desktop browsers (Chrome, Edge, Firefox, Safari).

Walk inside enterprise corporate networks in 3D/VR, trace multi-protocol packet flows hop-by-hop, launch and mitigate real-time DDoS cyber attacks, inspect live packet headers in an integrated Wireshark-lite stream, build custom hardware topologies with automatic device thumbnails, and download executive PDF inventory sheets.

---

## 📑 Table of Contents

- [Why This Exists](#-why-this-exists)
- [Target Audience](#-who-its-for)
- [Feature Showcase](#-feature-showcase)
  - [1. Interactive New Joinee Guided Tour](#1-interactive-new-joinee-guided-tour)
  - [2. Interactive 3D Network Builder](#2-interactive-3d-network-builder)
  - [3. Cyber Security Attack & Defense Simulator](#3-cyber-security-attack--defense-simulator)
  - [4. Wireshark-Lite Live Packet Sniffer](#4-wireshark-lite-live-packet-sniffer)
  - [5. Multiple 3D Layout Algorithms](#5-multiple-3d-layout-algorithms)
  - [6. Multi-Protocol Packet Routing & Return Trips](#6-multi-protocol-packet-routing--return-trips)
  - [7. Interactive IPv4 CIDR Subnet Calculator](#7-interactive-ipv4-cidr-subnet-calculator)
  - [8. Executive PDF Report & Inventory Download](#8-executive-pdf-report--inventory-download)
  - [9. Ambient NOC Traffic & Web Audio Synthesizer](#9-ambient-noc-traffic--web-audio-synthesizer)
- [Controls Cheatsheet](#-controls-cheatsheet)
  - [Meta Quest 2 Touch Controllers](#meta-quest-2-touch-controllers)
  - [Desktop Mouse & Keyboard](#desktop-mouse--keyboard)
- [Enterprise Architecture Presets](#-enterprise-architecture-presets)
- [Getting Started (Local Running)](#-getting-started-local-running)
- [Deploying to Netlify Drop (10 Seconds)](#-deploying-to-netlify-drop-10-seconds)
- [Testing on Meta Quest 2](#-testing-on-meta-quest-2)
- [JSON Topology Schema Reference](#-json-topology-schema-reference)
- [Performance & VR Optimization](#-performance--vr-optimization)
- [License](#-license)

---

## 💡 Why This Exists

Flat 2D network architecture diagrams (Visio, Lucidchart, draw.io) are static, lifeless, and fail to convey how packets actually traverse routing hops, how Spanning Tree failover works during an outage, or what happens during a DDoS attack.

**VR Network Topology Explorer** transforms network diagrams into a **living, breathing, interactive 3D spatial simulation**. Put on a Meta Quest 2 headset to physically inspect enterprise infrastructure at eye height, grab devices to rearrange wiring, trigger link failures to observe cascading recovery ripples, and teach network concepts to junior engineers in an unforgettable visual format.

---

## 🎯 Who It's For

- **🏢 IT & Enterprise Teams:** Onboard new joinees and junior sysadmins with a guided, interactive walk-through of your company's network tiers, security perimeter, and failover design.
- **🎓 Educators & Universities:** Teach computer networking (CS/IT courses, CCNA/Network+ training) with tactile 3D packet traces, subnetting calculators, and packet sniffing.
- **🛡️ Cybersecurity Teams & SOC Analysts:** Visually demonstrate SYN Flood DDoS attacks, botnet traffic surges, and WAF shield mitigation to stakeholders.
- **☁️ Cloud & DevOps Engineers:** Visualize microservices, HA load balancers, database clusters, and SD-WAN branch tunnels.
- **🥽 WebXR & Three.js Enthusiasts:** A reference example of pure static ES modules running at a locked 90 FPS on standalone Quest 2 hardware with zero bundler or npm dependencies.

---

## 🚀 Feature Showcase

### 1. Interactive New Joinee Guided Tour
Click **🎓 Joinee Tour** to launch a 6-step interactive training curriculum:
- **Module 1: The Perimeter & Ingress Security** &mdash; Ingress filtering, stateful firewall inspection, and DMZ architecture.
- **Module 2: Layer 3 Core Routing** &mdash; Default gateways, routing tables, and inter-subnet routing.
- **Module 3: Layer 2 Ethernet Switching & VLANs** &mdash; MAC address tables, collision/broadcast domains, and VLAN isolation.
- **Module 4: High Availability & Spanning Tree (STP)** &mdash; Single points of failure, redundant links, and zero-downtime automated failover.
- **Module 5: Endpoints, Servers & Protocol Handshakes** &mdash; Client-server architecture, DNS resolution, and TCP handshakes.
- **Module 6: Hands-On Challenge** &mdash; Practical test guiding new hires to break a core link and watch traffic reroute via redundant paths.

### 2. Interactive 3D Network Builder
Design, rearrange, and test custom network topologies on the fly:
- **+ Add Device (`🏗️`)**: Add any hardware unit into the 3D world with custom Name, IPv4 address, and Department.
- **9 Hardware Device Roles**:
  - `🖥️ Server Blade` &mdash; Tall rack chassis with drive bays & LED activity lights
  - `💻 Desktop PC` &mdash; Monitor on stand with desktop tower unit
  - `💻 Laptop` &mdash; Clamshell laptop with angled screen & keyboard
  - `🖨️ Printer` &mdash; Office laser printer with paper tray & output slot
  - `🛡️ Firewall` &mdash; Perimeter security appliance with shield/wall motif
  - `🔄 Router` &mdash; Core and edge routing pucks with directional arrows
  - `🔀 Switch` &mdash; Ethernet distribution rack switch
  - `🗄️ Database` &mdash; Cylindrical database disk array
  - `⚖️ Load Balancer` &mdash; High-availability proxy cluster
- **Automatic Generic Device Thumbnails**: Dedicated 2D vector hardware icons rendered directly onto floating 3D canvas labels, creation modals, and info panels.
- **Department-Wise Segmentation**: 9 color-coded departments (IT, Engineering, Finance, HR, Sales, Executive Suite, Operations, DMZ, Data Center) with one-click **Department Isolation Filtering**.
- **Connect Tool (`C`)**: Click Node A &rarr; Node B to span real-time dynamic cyber-cables.
- **Physical 3D Dragging**: Hold <kbd>Shift</kbd> (or Grip on Quest) to freely move devices; links stretch and follow in real-time.

### 3. Cyber Security Attack & Defense Simulator
Simulate realistic SOC/NOC incident response:
- **🚨 Launch DDoS Attack**: Spawns a high-velocity botnet SYN Flood surging from the Internet WAN towards target servers. Links glow intensely red/orange as packet queues surge.
- **🔥 Server Thermal Overload**: If unmitigated, target servers overheat, crash into `DOWN` state, and trigger cascading downstream failure ripples.
- **🛡️ WAF Shield Mitigation**: Toggle Web Application Firewall mitigation to filter rogue botnet IPs at the edge firewall, restoring server health in green.

### 4. Wireshark-Lite Live Packet Sniffer
Click **🔍 Wireshark** to open a real-time promiscuous packet capture drawer:
- Live streaming log of simulated Ethernet/IP frames:
  - `No.`, `Time`, `Source IP`, `Destination IP`, `Protocol (TCP SYN, TCP RST, ICMP, HTTP, DNS, SQL)`, `Packet Length`, and `Detailed Header / Flag Summary`.
- Color-coded protocol rows matching Wireshark standards.

### 5. Multiple 3D Layout Algorithms
Switch between spatial layout engines via the **3D Layout** dropdown:
- **📐 Hierarchical Layered (Default)**: Clean left-to-right enterprise flow (Perimeter &rarr; Core &rarr; Distribution &rarr; Access &rarr; Endpoints).
- **🎯 Concentric Radial**: Core router centered at origin with departments orbiting outwards in radial rings.
- **⚡ Force-Directed Physics**: Coulomb repulsion + Hooke's spring attraction steps that organically relax nodes into an optimal balanced 3D structure.

### 6. Multi-Protocol Packet Routing & Return Trips
Choose your protocol before tracing:
- **Ping (ICMP)**: High-speed connectivity probe.
- **HTTP/S Web Request**: Green request packet hops to the server, then a **blue response payload returns to the client**.
- **DNS Query**: Domain lookup resolution.
- **Database SQL Query**: Queries application databases.

### 7. Interactive IPv4 CIDR Subnet Calculator
Click **🧮 CIDR Calc** to open an integrated IP subnet calculator:
- Enter any CIDR prefix (e.g. `10.0.10.0/24`, `192.168.1.0/26`, `172.16.0.0/16`).
- Computes: Subnet Mask, Wildcard Mask, Network Address, Broadcast Address, Usable Host Range, Usable Host Count, and RFC 1918 Private/Public scope.

### 8. Executive PDF Report & Inventory Download
Click **📄 Download PDF**:
- Captures a high-resolution snapshot of the current 3D topology diagram.
- Generates a formatted PDF report:
  - **Page 1**: Executive Summary, 3D Network Snapshot, Total Systems & Links, and Department Device Allocation metrics.
  - **Page 2**: Complete Device & Server Inventory Table with Full Names, Hardware Roles, Departments, IP Addresses, Online Status, and Connected Peer Matrix.
  - Downloads directly as `network-topology-layout-report.pdf`.

### 9. Ambient NOC Traffic & Web Audio Synthesizer
- **🌊 Live Ambient Traffic**: Simulates background packets continually flowing across healthy links for a 24/7 Network Operations Center feel.
- **🔊 Native Web Audio Synthesizer**: Generates futuristic sci-fi sound effects (device clicks, packet hops, electrical crackles on link failure, and attack sirens) with zero external audio assets.

---

## 🎮 Controls Cheatsheet

### Meta Quest 2 Touch Controllers

| Input | Hand | Action |
|---|---|---|
| **Trigger (Index)** | Either | Point laser and pull to select device/link, or tap holographic menu buttons |
| **Grip (Squeeze)** | Either | Point at a device, squeeze and hold to physically grab & move it in 3D |
| **Left Thumbstick** | Left | Smooth locomotion relative to headset gaze (2 m/s, deadzone 0.15) |
| **Right Thumbstick** | Right | Comfort snap-turn by 30° with flick cooldown |
| **Y Button** | Left | Toggle floating VR wrist menu visibility |
| **Trigger on Start**| Either | Dismisses the startup "How To Use" tutorial card |

### Desktop Mouse & Keyboard

| Input | Action |
|---|---|
| **Left Click** | Select device or link (opens detail Info Panel) |
| **Shift + Click & Drag** | Move any device along the camera view plane (links update in real-time) |
| **Right Click + Drag** | OrbitControls: rotate camera view around network center |
| **Scroll Wheel** | Zoom in / out |
| **C Key** | Toggle Connect Tool (Click Device A &rarr; Click Device B to bridge) |
| **T Key** | Start Packet Trace mode |
| **B Key** | Break or repair currently selected device/link |
| **Delete / Backspace** | Delete selected device or link from network |
| **R Key** | Reset all nodes, links, and simulations to operational |
| **L Key** | Toggle 3D floating text labels |
| **F Key** | Toggle FPS / Triangles / Draw Calls telemetry overlay |
| **H Key** | Toggle startup cheat sheet |

---

## 🏢 Enterprise Architecture Presets

Select from pre-built production stacks using the **Stack** dropdown:

1. **🏢 Corporate Network (Dept-Wise)**: Edge perimeter firewall, core router, department switches, server blades, workstations, executive laptops, and finance laser printers.
2. **☁️ 3-Tier Cloud Web Architecture**: Public clients &rarr; Cloudflare WAF &rarr; HA Load Balancer &rarr; NGINX Web tier &rarr; Core API App tier &rarr; PostgreSQL Primary & Read Replica.
3. **🌐 SD-WAN Branch Office VPN**: Headquarters Data Center, SD-WAN Gateway, Carrier WAN underlay, Branch Office Gateway, Workstations & Printers.
4. **🎨 Blank Canvas**: Start from scratch to design, cable, and test custom topologies.

---

## 🏃 Getting Started (Local Running)

Because the project is built with **native browser ES modules** and pinned via `<script type="importmap">`, **no npm, node_modules, or build step is required**.

WebXR requires a secure context (**HTTPS** or **localhost**).

### Option 1: Python HTTP Server (Fastest)
```bash
python -m http.server 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in Chrome, Edge, or Firefox.

### Option 2: Node npx serve
```bash
npx serve .
```

---

## ☁️ Deploying to Netlify Drop (10 Seconds)

1. Open **[https://app.netlify.com/drop](https://app.netlify.com/drop)** in your desktop browser.
2. Drag and drop this entire project folder (`Quest/`) directly onto the Netlify Drop target area.
3. Netlify will immediately provide a free, live **HTTPS URL** (e.g. `https://my-vr-network.netlify.app`).
4. The included `netlify.toml` automatically configures the publish root and sets the appropriate JavaScript module MIME headers.

---

## 🥽 Testing on Meta Quest 2

1. Turn on your Meta Quest 2 headset and connect to Wi-Fi.
2. Open the **Meta Quest Browser**.
3. Navigate to your deployed Netlify HTTPS URL.
4. Click the cyan **ENTER VR** button at the bottom center.
5. In the permission prompt, choose **Allow** to enter the immersive WebXR session.
6. Look at your left wrist to access your holographic VR controller pad!

---

## 📦 JSON Topology Schema Reference

You can import or export topologies by clicking **Topology JSON**:

```json
{
  "name": "Corporate Enterprise Network",
  "nodes": [
    {
      "id": "srv1",
      "name": "Enterprise App Server",
      "type": "server",
      "department": "Data Center",
      "ip": "10.0.10.11",
      "position": [2.0, 2.30, -1.0]
    },
    {
      "id": "prn_fin",
      "name": "Finance Laser Printer",
      "type": "printer",
      "department": "Finance & Accounting",
      "ip": "10.0.30.201",
      "position": [2.9, 0.70, -1.0]
    }
  ],
  "links": [
    {
      "id": "link-sw-srv",
      "from": "sw_it",
      "to": "srv1"
    }
  ]
}
```

*Note: If the `position` array `[x, y, z]` is omitted, the built-in BFS layout engine automatically calculates optimal 3D coordinates.*

---

## ⚡ Performance & VR Optimization

- **Polygon Budget**: Total topology is ~8,500 triangles (far below the Quest 2 mobile GPU budget of 100,000 triangles).
- **Draw Calls**: ~26 draw calls via shared geometry and instanced materials.
- **Zero Garbage Collection**: Vector math (`Vector3`, `Matrix4`, `Quaternion`) uses pre-allocated module-level instances in the 90 FPS render loop.
- **Fixed Foveated Rendering**: Leverages WebXR `renderer.xr.setFoveation(1.0)` for maximum Quest 2 frame pacing.

---

## 📄 License

This project is licensed under the **MIT License** &mdash; see the LICENSE file for details. Free for educational, personal, and commercial enterprise training use.
