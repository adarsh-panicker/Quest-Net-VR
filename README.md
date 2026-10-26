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
- [Topic-Wise Study Academy (CCNA, CCNP ENCOR, CCNP ENARSI)](#-topic-wise-study-academy)
  - [Exhaustive Syllabus Coverage](#exhaustive-syllabus-coverage)
  - [Interactive SVG Diagrams & Mental Models](#interactive-svg-diagrams--mental-models)
  - [Production Cisco IOS CLI Commands](#production-cisco-ios-cli-commands)
  - [1-Click 3D WebXR Lab Scene Launching](#1-click-3d-webxr-lab-scene-launching)
- [3D WebXR Classroom Billboard (In-Headset VR Learning)](#-3d-webxr-classroom-billboard)
- [CCNA 200-301 Visual Academy](#-ccna-200-301-visual-academy)
  - [OSI 7-Layer vs TCP/IP 4-Layer Encapsulation Stack](#1-osi-7-layer-vs-tcpip-4-layer-encapsulation-stack)
  - [TCP 3-Way Handshake vs UDP Datagram Simulator](#2-tcp-3-way-handshake-vs-udp-datagram-simulator)
  - [Physical Cabling Media & T568A/B Pinouts](#3-physical-cabling-media--t568ab-pinouts)
  - [Virtualization, Hypervisors, VMs & Containers](#4-virtualization-hypervisors-vms--containers)
  - [Site-to-Site IPsec VPN & Cryptographic Tunnels](#5-site-to-site-ipsec-vpn--cryptographic-tunnels)
  - [Interactive CCNA Knowledge Check Quiz](#6-interactive-ccna-knowledge-check-quiz)
- [Physical Hardware Photos & Equipment Gallery](#-physical-hardware-photos--equipment-gallery)
- [Comprehensive Network Topologies Library (23 Presets)](#-comprehensive-network-topologies-library)
  - [1. Interactive 3D Network Builder](#1-interactive-3d-network-builder)
  - [2. Cyber Security Attack & Defense Simulator](#2-cyber-security-attack--defense-simulator)
  - [3. Wireshark-Lite Live Packet Sniffer](#3-wireshark-lite-live-packet-sniffer)
  - [4. Multiple 3D Layout Algorithms](#4-multiple-3d-layout-algorithms)
  - [5. Multi-Protocol Packet Routing & Return Trips](#5-multi-protocol-packet-routing--return-trips)
  - [6. Interactive IPv4 CIDR Subnet Calculator](#6-interactive-ipv4-cidr-subnet-calculator)
  - [7. Executive PDF Report & Inventory Download](#7-executive-pdf-report--inventory-download)
  - [8. Ambient NOC Traffic & Web Audio Synthesizer](#8-ambient-noc-traffic--web-audio-synthesizer)
- [Controls Cheatsheet](#-controls-cheatsheet)
  - [Meta Quest 2 Touch Controllers](#meta-quest-2-touch-controllers)
  - [Desktop Mouse & Keyboard](#desktop-mouse--keyboard)
- [Enterprise Architecture Presets](#-comprehensive-network-topologies-library)
- [Getting Started (Local Running)](#-getting-started-local-running)
- [Deploying to Netlify Drop (10 Seconds)](#-deploying-to-netlify-drop-10-seconds)
- [Testing on Meta Quest 2](#-testing-on-meta-quest-2)
- [JSON Topology Schema Reference](#-json-topology-schema-reference)
- [Performance & VR Optimization](#-performance--vr-optimization)
- [License](#-license)

---

## 🎓 Topic-Wise Study Academy

Click the **📚 Study Academy (CCNA/CCNP)** button (or press `S` on your keyboard) to open the interactive curriculum portal.

The application delivers an end-to-end, topic-by-topic training path aligned strictly with official Cisco certification standards:

### Exhaustive Syllabus Coverage
1. **CCNA (200-301) Track**:
   - **Module 1: Network Fundamentals**: OSI 7-Layer vs TCP/IP 4-Layer, IPv4 Subnetting & VLSM, IPv6 Global/Link-Local/EUI-64, Physical Layer Cables & PoE.
   - **Module 2: Network Access**: 802.1Q VLANs & Voice VLAN, Spanning Tree (STP/RSTP/PVST+), EtherChannel LACP & PAgP.
   - **Module 3: IP Connectivity**: Routing Concepts & AD, OSPFv2 Multi-Area Link-State, FHRP (HSRP & VRRP Gateway Redundancy).
   - **Module 4: IP Services**: NAT/PAT Overload, DHCP DORA & Recursive DNS, Quality of Service (QoS) & Policing.
   - **Module 5: Security Fundamentals**: Standard & Extended ACLs, Layer 2 Security (Port Security, DHCP Snooping, Dynamic ARP Inspection).
   - **Module 6: Automation & Programmability**: SDN Architecture, REST APIs, JSON data, and Cisco DNA Center.
2. **CCNP ENCOR (350-401) Track**:
   - **Cisco SD-WAN & VXLAN Overlay Fabric**: Decoupling overlays from underlays; VXLAN UDP port 4789 and 24-bit VNI.
   - **BGP Path Attributes & Route Selection**: Multi-attribute route selection (Weight, Local Pref, AS-Path, MED, eBGP vs iBGP).
   - **Enterprise Wireless (Catalyst 9800 & CAPWAP)**: Split-MAC architecture, CAPWAP Control (UDP 5246) and Data (UDP 5247), Wi-Fi 6 roaming.
3. **CCNP ENARSI (300-410) Track**:
   - **Advanced OSPFv2/v3**: Not-So-Stubby Areas (NSSA), Type-7 to Type-5 translation, OSPF Virtual Links.
   - **MPLS LDP & Layer 3 BGP VPNs**: 32-bit shim labels, Penultimate Hop Popping (PHP), Provider Edge (PE) and Core (P) LSR routers.
   - **Dynamic Multipoint VPN (DMVPN Phase 3)**: Multipoint GRE (mGRE), NHRP Redirect & Shortcut, dynamic spoke-to-spoke IPsec tunnels.

### Every Lesson Includes:
- 💡 **Everyday Mental Model & Analogy**: Plain-English analogies (e.g. shipping containers, airport baggage barcodes, flight co-pilots) that clarify complex protocol internals for complete beginners.
- 📐 **Interactive SVG Architectural & Header Diagrams**: Crisp vector graphics illustrating encapsulation headers, frame formats, and traffic topology flows.
- 🔬 **Deep-Dive Engineering Theory**: RFC references, finite-state machine transitions, packet structures, and calculation formulas.
- 🖥️ **Production Cisco IOS CLI Commands**: Syntax-highlighted CLI terminal blocks with a 1-click **📋 Copy CLI Commands** button to copy configurations into Packet Tracer, GNS3, EVE-NG, or physical Cisco hardware.
- 🎯 **Exam Traps & Certification Tips**: Critical warnings on common multiple-choice exam traps (e.g. OSPF timer mismatches, STP priority increments of 4096, HSRP preemption).
- 🚀 **1-Click 3D Lab Scene Launch**: Instantly loads the exact corresponding 3D topology into the WebXR viewport and positions nodes for real-time packet tracing.
- 📈 **Progress Tracking**: Tracks completed topics with checkmarks saved in browser `localStorage`.

---

## 🥽 3D WebXR Classroom Billboard (In-Headset VR Learning)

Study while remaining inside Virtual Reality! When using a **Meta Quest 2 / Quest 3 / Pro** headset:
- Press the **🕶️ Toggle VR Screen** button or press `V` on your keyboard (or trigger the in-VR button).
- A floating high-resolution 3D billboard (`CanvasTexture` at 1200x725 resolution) appears in 3D space directly in front of you.
- Use your Oculus Touch controller raycaster laser to click:
  - `[◄ Prev Topic]` / `[Next Topic ►]` to step through lessons.
  - `[🚀 Spawn 3D Lab]` to materialize the lesson's physical network in the virtual room!
  - `[✕ Hide Screen]` to dock the display.

---

## 📘 CCNA 200-301 Visual Academy

Click the **📘 CCNA Academy** button in the top navigation bar to open an interactive study academy designed for junior engineers, network students, and CCNA candidates:

### 1. OSI 7-Layer vs TCP/IP 4-Layer Encapsulation Stack
- **Color-Coded Layers**: From Layer 7 (Application) down to Layer 1 (Physical).
- **PDU Tracking**: Follow data transformation as headers are prepended: **Data** (L7-5) $\rightarrow$ **Segment** (L4) $\rightarrow$ **Packet** (L3) $\rightarrow$ **Frame** (L2) $\rightarrow$ **Bits** (L1).
- **Hardware Mapping**: See which devices operate at each layer (L2 Switches, L3 Routers, L4 Firewalls/Load Balancers).

### 2. TCP 3-Way Handshake vs UDP Datagram Simulator
- **Interactive 3-Way Handshake**: Step 1 Client SYN (`Seq=0 Win=65535`) $\rightarrow$ Step 2 Server SYN-ACK (`Seq=0 Ack=1`) $\rightarrow$ Step 3 Client ACK (`Seq=1 Ack=1`) $\rightarrow$ Established session.
- **Header Comparison**: Side-by-side breakdown of TCP 20-byte reliable headers (Sequence/Ack numbers, Windowing, Flags) vs UDP 8-byte lightweight datagram headers.
- **Trace in 3D**: Select **TCP** or **UDP** in the top bar to watch handshake round-trips or high-speed datagram streams traverse the network in real-time, logged to the Wireshark drawer.

### 3. Physical Cabling Media & T568A/B Pinouts
- **Cabling Media Catalog**:
  - `Cat6 UTP`: Blue jacket copper twisted pair, 100m distance limit, RJ-45 connector.
  - `Single-Mode Fiber (OS2)`: Yellow jacket, 9/125µm laser core, 10km-40km long-range carrier links.
  - `Multi-Mode Fiber (OM4)`: Aqua jacket, 50/125µm VCSEL LED core, 400m data center fabric.
  - `Twinax DAC`: Shielded black direct-attach copper, passive SFP28/QSFP28, 1m-5m intra-rack.
  - `IPsec Encrypted Tunnel`: Holographic violet shield cylinder with cryptographic parameters.
- **Interactive T568A vs T568B RJ-45 Pinout Chart**: Color-coded wire pairs (White/Orange, Orange, White/Green, Blue, White/Blue, Green, White/Brown, Brown).

### 4. Virtualization, Hypervisors, VMs & Containers
- **Type-1 Bare-Metal (ESXi, KVM, Proxmox)** vs **Type-2 Hosted (VirtualBox, VMware Workstation)** architecture.
- **Virtual Distributed Switch (vSwitch)**: Port-groups, vNICs, physical uplink NIC teaming (802.3ad LACP).
- **Virtual Machines vs Docker Containers**: Hardware virtualization with full Guest OS vs OS kernel namespace and cgroup isolation.

### 5. Site-to-Site IPsec VPN & Cryptographic Tunnels
- **IKEv1 / IKEv2 Phase 1 (ISAKMP SA)**: HAGLE parameters (Hash SHA-256, Authentication PSK/Cert, DH Group 14/19, Lifetime, Encryption AES-256).
- **IKE Phase 2 (IPsec SA)**: ESP (Protocol 50) vs AH (Protocol 51), Tunnel Mode vs Transport Mode.
- **Visual Tunnel Model**: 3D links render as translucent glowing cryptographic sleeves enclosing packets.

### 6. Interactive CCNA Knowledge Check Quiz
- Rapid-fire multiple-choice quiz testing core CCNA 200-301 concepts with instant scoring, feedback, and detailed explanations.

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

### 1. Interactive 3D Network Builder
Design, rearrange, and test custom network topologies on the fly:
- **+ Add Device (`🏗️`)**: Add any hardware unit into the 3D world with custom Name, IPv4 address, and Department.
- **12 Hardware Device Roles with 3D Models & 2D Vector Icons**:
  - `🖥️ Server Blade` &mdash; Tall rack chassis with drive bays & LED activity lights
  - `💻 Desktop PC` &mdash; Monitor on stand with desktop workstation tower
  - `💻 Laptop` &mdash; Clamshell laptop with angled screen & keyboard
  - `🖨️ Printer` &mdash; Office laser printer with paper tray & output slot
  - `📶 Wi-Fi 6 AP (WAP)` &mdash; Ceiling-mounted saucer access point with concentric radio arcs
  - `📞 VoIP Phone` &mdash; IP desk phone with handset, screen, and dialpad buttons
  - `🏭 Industrial IoT / PLC` &mdash; DIN-rail industrial controller with sensor antenna and status LED
  - `🛡️ Firewall` &mdash; Perimeter security appliance with shield/wall motif
  - `🔄 Router` &mdash; Core and edge routing pucks with directional arrows
  - `🔀 Switch` &mdash; Ethernet distribution rack switch
  - `🗄️ Database` &mdash; Cylindrical database disk array
  - `⚖️ Load Balancer` &mdash; High-availability proxy cluster
- **Deep Enterprise Network Metadata Specs**:
  - Automatically generates and displays **MAC Addresses** (`52:54:00:xx:xx:xx`), **Subnet Masks** (`/24`, `/16`), **Default Gateways**, **VLAN IDs**, **Port Interfaces** (`GigE 0/1`, `eth0`), **Bandwidth Speeds** (`100 Gbps QSFP28`, `10 Gbps Fiber`, `1 Gbps`), and **OS / Firmware versions** (`Cisco IOS-XE`, `Ubuntu LTS`, `pfSense`).
- **Automatic Generic Device Thumbnails**: Dedicated 2D vector hardware icons rendered directly onto floating 3D canvas labels, creation modals, and info panels.
- **Department-Wise Segmentation**: 9 color-coded departments (IT & Infrastructure, Engineering & Dev, Finance & Accounting, HR, Sales & Marketing, Executive Suite, Operations & OT, DMZ & Perimeter, Data Center) with one-click **Department Isolation Filtering**.
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

## 🏢 Comprehensive Network Topologies Library

Switch instantly between 11 classic topologies and enterprise production architectures using the **Topology** dropdown:

1. **🏢 Cisco 3-Tier Enterprise Network (Dept-Wise)**: Full hierarchical enterprise network featuring Internet WAN, Edge Firewall, Core Layer 3 Router, Distribution Switches, Data Center Servers, Engineering & Finance Desktops, Executive Laptops, and Office Laser Printers.
2. **⭐ Star Topology (Central Switch LAN)**: Foundational LAN architecture where all endpoints connect into a single high-speed central switch. Highlights single-cable failure resilience.
3. **🔄 Ring Topology (Self-Healing Loop)**: Closed loop where every node has two neighbors. Demonstrates automated bidirectional traffic failover with zero packet loss if any link is cut.
4. **🕸️ Full Mesh Topology (High-Resilience WAN)**: Every mission-critical router is directly meshed to every other node ($O(N^2)$ links). Demonstrates ultra-resilient multipath routing for telco and military backbones.
5. **🚌 Bus Topology (Backbone Trunk & Drops)**: Classic shared medium Ethernet with coaxial trunk line, 50-ohm terminators at both ends, and AUI drop cables to workstations. Demonstrates broadcast collision domains.
6. **🌿 Spine-and-Leaf Data Center (Clos Architecture)**: Hyperscale data center fabric where every leaf switch connects to every spine switch. Eliminates Spanning Tree blocking and optimizes east-west server communication.
7. **📶 Campus Enterprise & Wi-Fi 6 (WAPs, VoIP, Laptops)**: Modern enterprise campus with PoE+ distribution switches, ceiling Wi-Fi 6 Access Points, VoIP telephony, executive laptops, and shared network printers.
8. **🏭 Industrial IoT & SCADA (Purdue OT Model)**: Critical infrastructure network with isolated Operational Technology (OT) DMZ, SCADA historian server, factory floor HMI console, and assembly line PLC controllers.
9. **☁️ 3-Tier Cloud Web Architecture (N-Tier)**: Public clients &rarr; Cloudflare WAF &rarr; HA Load Balancer &rarr; NGINX Web tier &rarr; Core API App tier &rarr; PostgreSQL Primary & Read Replica.
10. **🌐 SD-WAN Branch Office VPN (MPLS Backup)**: Multi-branch enterprise with SD-WAN edge routers, dual carrier MPLS & broadband underlays, and IPSec encrypted tunnels.
11. **🎨 Blank Canvas**: Completely empty 3D space to freely add custom systems, define IP subnets, route connections, and test network behaviors from scratch.

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
