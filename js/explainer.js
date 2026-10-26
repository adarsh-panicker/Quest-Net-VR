/**
 * explainer.js - Real-Time Network Explanation Engine & Beginner Knowledge Hub
 *
 * Provides plain-English analogies, live hop-by-hop packet narration,
 * dynamic topology architectural breakdowns, and friendly device/cable guides
 * so anyone (especially noobies & junior engineers) can visually learn how networks work in real time.
 */

import { PROTOCOLS } from './simulation.js';

export const DEVICE_ANALOGIES = {
  firewall: {
    role: 'Perimeter Security & Ingress Filtering',
    analogy: '🛡️ The Airport Customs / Nightclub Bouncer',
    explanation: 'Inspects every incoming and outgoing packet. It checks IP addresses, port numbers, and connection state. If a packet looks suspicious or wasn’t requested by an internal computer, the firewall drops it immediately to protect the company.'
  },
  router: {
    role: 'Layer 3 Path Determination & Inter-Network Gateway',
    analogy: '🔄 The Postal Sorting Center & GPS Navigator',
    explanation: 'Connects completely different networks together (like your home LAN to the public Internet). It reads the destination IP address, checks its Routing Table, and chooses the fastest highway (interface) for the packet to travel next.'
  },
  switch: {
    role: 'Layer 2 Ethernet Distribution & Local Switching',
    analogy: '🔀 The Office Building Mailroom / Elevator',
    explanation: 'Connects all computers, printers, and servers inside the SAME local room or building. It reads hardware MAC addresses from Ethernet frames and sends packets directly to the exact destination cable port without bothering the router.'
  },
  server: {
    role: 'Enterprise Application & Resource Host',
    analogy: '🖥️ The Restaurant Chef / Bank Teller',
    explanation: 'A powerful, high-uptime computer that runs 24/7. It listens for incoming requests from clients (like "show me this website" or "fetch my balance") and sends back the requested data.'
  },
  desktop: {
    role: 'End-User Client Workstation',
    analogy: '💻 The Customer / Office Worker Desk',
    explanation: 'The endpoint system where humans do work. It initiates requests (like opening a browser or printing a document) and expects response packets back from the servers.'
  },
  laptop: {
    role: 'Mobile / Remote Client Endpoint',
    analogy: '💻 The Traveling Employee / Executive',
    explanation: 'A portable battery-powered client computer that moves between wireless Wi-Fi 6 access points, desk docking stations, and remote home VPN tunnels.'
  },
  printer: {
    role: 'Network Print Server & Peripheral',
    analogy: '🖨️ The Shared Office Printing Press',
    explanation: 'Has its own static IP address on the network so anyone with permission can send print jobs over TCP port 9100 without needing a dedicated computer plugged into it.'
  },
  wap: {
    role: 'Wi-Fi 6 Wireless Access Point',
    analogy: '📶 The Radio Translator Megaphone',
    explanation: 'Converts electrical Ethernet pulses from a cable into radio waves (2.4 GHz, 5 GHz, 6 GHz) so laptops, tablets, and smartphones can join the wired network through the air.'
  },
  phone: {
    role: 'VoIP IP Telephony Endpoint',
    analogy: '📞 Digital Voice Communicator',
    explanation: 'Digitizes human voice into small, ultra-fast UDP packets (RTP streams) and sends them across a prioritized "Voice VLAN" so phone calls never drop or lag when people download big files.'
  },
  iot: {
    role: 'Industrial PLC Controller & Sensor Node',
    analogy: '🏭 Factory Floor Robotic Brain / Sensor',
    explanation: 'A ruggedized micro-computer that monitors physical machinery, temperature, and assembly lines in factories using industrial protocols (Modbus, PROFINET, EtherNet/IP).'
  },
  hypervisor: {
    role: 'Type-1 Bare-Metal Virtualization Host',
    analogy: '🖥️ The Apartment Building Foundation & Landlord',
    explanation: 'Instead of spending $50,000 on 10 separate physical computers, a Hypervisor installs directly on ONE physical supercomputer and carves it into 10 isolated "Virtual Machines" that share the CPU and RAM safely.'
  },
  vm: {
    role: 'Virtual Machine (vNIC Guest OS)',
    analogy: '📦 The Virtual Apartment',
    explanation: 'A software computer running inside a hypervisor. It honestly believes it is a real physical PC! It has its own operating system (like Linux or Windows), virtual CPU, virtual RAM, and virtual MAC address.'
  },
  container: {
    role: 'Docker / Microservice Container Pod',
    analogy: '🐳 The Shipping Cargo Box',
    explanation: 'Even lighter than a Virtual Machine! It skips installing a full guest operating system and just packages the single program (like an API or web app) with its dependencies, starting up in less than 1 second.'
  },
  vpn: {
    role: 'IPsec Cryptographic VPN Gateway',
    analogy: '🔒 The Armored Secret Tunnel',
    explanation: 'Creates a mathematically encrypted tunnel through the dangerous public Internet. Even if an evil hacker taps the wire, they only see scrambled letters and numbers (AES-256 encryption).'
  },
  cloud_vpc: {
    role: 'Cloud Virtual Private Cloud (VPC) Gateway',
    analogy: '☁️ Your Private Fortress in the Public Cloud',
    explanation: 'An isolated virtual network inside AWS, Azure, or Google Cloud. Only your authorized corporate routers and encrypted VPN connections can communicate with it.'
  },
  database: {
    role: 'Relational Database / Storage Cluster',
    analogy: '🗄️ The Master Vault & Filing Room',
    explanation: 'Stores all company records, financial balances, passwords, and user data. Everything is protected with strict ACID guarantees so data is never lost even during power outages.'
  },
  loadbalancer: {
    role: 'High-Availability Reverse Proxy',
    analogy: '⚖️ The Airport Traffic Controller',
    explanation: 'Sits in front of a bank of servers. When millions of visitors arrive, the load balancer distributes the visitors evenly so no single server gets overloaded and crashes.'
  },
  internet: {
    role: 'Public Global Internet WAN',
    analogy: '🌐 The Wild Public Highway Network',
    explanation: 'A worldwide web of interconnected telecom providers, undersea optical cables, and internet exchange points (IXPs). Completely untrusted; traffic must be encrypted!'
  }
};

export const CABLE_ANALOGIES = {
  cat6: {
    title: 'Cat6 Copper UTP (Blue Cable)',
    analogy: '🔵 The Short-Range Copper Highway',
    explanation: 'Carries electrical voltage signals over 4 pairs of twisted copper wires. The twists cancel out electrical noise. Standard limit is 100 meters (328 feet)—perfect for connecting desks to closet switches.'
  },
  smf: {
    title: 'Single-Mode Fiber OS2 (Yellow Cable)',
    analogy: '🟡 The Long-Distance Laser Beam',
    explanation: 'Shoots a microscopic infrared laser pulse through a glass strand thinner than human hair (9 µm). Because the light doesn’t bounce off the walls, it can travel 40 kilometers (25 miles) without fading!'
  },
  mmf: {
    title: 'Multi-Mode Fiber OM4 (Aqua Cable)',
    analogy: '🟦 The High-Density Campus LED Fiber',
    explanation: 'Uses an affordable LED or VCSEL laser light source. The light bounces off the inner core walls. Ideal for connecting high-speed switches and server racks inside the same data center (up to 400 meters).'
  },
  dac: {
    title: 'Twinax DAC (Black Direct-Attach Cable)',
    analogy: '⬛ The Ultra-Fast Intra-Rack Cable',
    explanation: 'Heavy-duty copper cable with built-in metal SFP+ transceiver plugs on both ends. Extremely cheap, zero latency, used exclusively for connecting servers to the top-of-rack switch inside the same rack (1-5m).'
  },
  vpn_tunnel: {
    title: 'Encrypted IPsec VPN Tunnel (Glowing Purple Sleeve)',
    analogy: '🟣 The Mathematical Security Pipe',
    explanation: 'Not a physical cable! It’s a virtual encrypted pipe running over the public Internet. Original packets are wrapped in an ESP (Encapsulating Security Payload) header and encrypted with AES-256 cipher.'
  }
};

export const TOPOLOGY_EXPLANATIONS = {
  corporate: {
    name: 'Cisco 3-Tier Enterprise Network (Hierarchical Model)',
    badge: '🏢 Enterprise Corporate Standard',
    tagline: 'How large companies structure their physical IT infrastructure for high speed and security.',
    summary: 'Divided into three distinct layers: Core (ultra-fast routing highway), Distribution (department policy and access control), and Access (where desks, laptops, and printers plug in). An edge firewall and DMZ guard against Internet threats.',
    analogy: 'Think of a major international airport: The Runway & Skyway is the Core, the Security Gates & Terminals are the Distribution layer, and the individual passenger boarding gates are the Access layer.',
    journey: [
      '1. Finance PC creates a packet with destination IP 10.0.10.11 (App Server).',
      '2. Finance Switch checks its MAC address table and forwards the frame out its uplink port.',
      '3. Core Layer 3 Router inspects the IP header and forwards traffic from VLAN 30 to VLAN 10.',
      '4. Edge Firewall inspects stateful table to ensure Finance is permitted to talk to the Data Center.',
      '5. Server Blade receives the packet and sends back the requested financial database report!'
    ],
    faultTolerance: 'If the primary switch link fails, traffic automatically reroutes via the redundant backup switch interconnect with zero interruption.'
  },

  vpn_ipsec: {
    name: 'Site-to-Site IPsec VPN & Remote Access',
    badge: '🔒 Military-Grade Cryptography',
    tagline: 'Connecting branch offices and remote workers securely across the untrusted public Internet.',
    summary: 'Branch office PCs and home workers need to access HQ databases, but sending raw passwords over the public Internet is dangerous. An IPsec VPN concentrator encrypts every packet into scrambled ciphertext using AES-256 before sending it into the WAN.',
    analogy: 'Like placing your confidential business contract inside an armored titanium lockbox with a combination that only HQ and the Branch know. Even if someone steals the box while in transit, they cannot read what is inside.',
    journey: [
      '1. Branch PC wants to query the HQ Database at 10.100.1.10.',
      '2. Branch Router intercepts the packet: "This packet is heading to HQ, so it must be encrypted!"',
      '3. Router encrypts the payload with AES-256 and adds an IPsec ESP header (IP Protocol 50).',
      '4. The encrypted packet travels safely across the public Internet WAN ISP backbone.',
      '5. HQ VPN Concentrator receives the packet, validates the hash authentication, decrypts it, and forwards the clean packet to the HQ Core Switch!'
    ],
    faultTolerance: 'Even if the public Internet is full of eavesdroppers, man-in-the-middle attacks are impossible due to Diffie-Hellman cryptographic keys.'
  },

  virtualization: {
    name: 'Bare-Metal Hypervisor, VMs & Virtual Switch (ESXi)',
    badge: '🖥️ Cloud Virtualization Fabric',
    tagline: 'How modern data centers run hundreds of servers on a single physical machine.',
    summary: 'In the old days, companies bought 1 physical server for every single application (expensive and wasteful). Today, a Type-1 Bare-Metal Hypervisor (like VMware ESXi) runs directly on the hardware and hosts multiple Virtual Machines and Docker containers that share the resources.',
    analogy: 'An apartment building: Instead of building 5 separate standalone houses on 5 pieces of land, you build one large apartment building with private apartments (VMs) that share the same electrical grid and plumbing.',
    journey: [
      '1. A Web VM (VM-Web-01) needs to fetch user data from a Database VM (VM-DB-01) on the same host.',
      '2. Web VM sends the packet out its virtual network card (vNIC).',
      '3. vSwitch0 (the virtual switch inside the hypervisor RAM) receives the packet.',
      '4. vSwitch0 immediately delivers the packet to Database VM in nanoseconds—never even touching a physical cable!',
      '5. For outside traffic, the hypervisor bridges packets through physical 25Gbps Twinax DAC cables to the top-of-rack physical switch.'
    ],
    faultTolerance: 'If a physical power supply fails, hypervisor clustering (vSphere vMotion / HA) automatically live-migrates the VMs to a neighboring server with zero downtime.'
  },

  cloud_hybrid: {
    name: 'Enterprise Hybrid Cloud (On-Premises to AWS VPC)',
    badge: '☁️ Multi-Cloud Interconnect',
    tagline: 'Bridging corporate data centers with public cloud compute and storage.',
    summary: 'Allows companies to keep sensitive databases in their private on-premises data center while scaling customer-facing web apps dynamically in AWS or Azure using dedicated fiber (DirectConnect).',
    analogy: 'A secure private underground subway connecting your corporate headquarters directly into an Amazon fulfillment center.',
    journey: [
      '1. An on-prem server sends data to AWS S3 Object Storage.',
      '2. Traffic leaves On-Prem Core Router over a dedicated 10Gbps Single-Mode Fiber DirectConnect circuit.',
      '3. Enters AWS Transit Gateway (the master cloud router in AWS).',
      '4. Forwarded into the private VPC subnet where EC2 compute instances process the files.',
      '5. Stored permanently in AWS S3 with 99.999999999% data durability.'
    ],
    faultTolerance: 'If the primary DirectConnect fiber cut occurs, traffic automatically fails over to an IPsec VPN backup tunnel over the public Internet.'
  },

  vlan_segmentation: {
    name: '802.1Q VLANs & Router-on-a-Stick',
    badge: '🏷️ Broadcast Domain Isolation',
    tagline: 'How to separate departments for security without buying 10 separate physical switches.',
    summary: 'Virtual LANs (VLANs) divide a single physical switch into multiple isolated virtual switches (VLAN 10 Sales, VLAN 20 Engineering, VLAN 30 Voice). A single cable (802.1Q Trunk) connects to the router with virtual subinterfaces to route traffic between them.',
    analogy: 'Color-coded folders in a filing cabinet: All papers are in the same cabinet, but the Red folder (HR) cannot be read by anyone holding the Blue folder (Sales) unless the manager (Router) explicitly approves it.',
    journey: [
      '1. Sales PC (VLAN 10) sends a message to Engineering Dev Box (VLAN 20).',
      '2. Switch tags the Ethernet frame with 802.1Q header: VLAN ID = 10.',
      '3. Frame travels across the Trunk cable to the Router’s subinterface G0/0.10.',
      '4. Router strips the VLAN 10 tag, routes the IP packet to subinterface G0/0.20, and re-tags it with VLAN 20.',
      '5. Switch receives the frame on VLAN 20 and delivers it to the Engineering Dev Box.'
    ],
    faultTolerance: 'Prevents rogue broadcast storms from taking down the entire company—broadcasts stay strictly inside their own VLAN!'
  },

  ospf_routing: {
    name: 'OSPF Dynamic Multi-Area Routing (Link-State)',
    badge: '🔀 Smart Self-Healing Routing',
    tagline: 'Routers talking to each other to automatically find the fastest path through complex networks.',
    summary: 'Open Shortest Path First (OSPF) uses Dijkstra’s algorithm. Every router shares its local connections (Link-State Advertisements) to build an identical 3D map of the entire network, calculating the lowest "Cost" (highest bandwidth) path.',
    analogy: 'Google Maps or Waze: All routers share live traffic reports. If a road closes or gets congested, Google Maps automatically recalculates your route around the jam.',
    journey: [
      '1. HQ PC sends a packet to the Branch Accounting Desktop.',
      '2. HQ Router consults its OSPF routing table: Area 1 -> Area 0 (Backbone) -> Area 2.',
      '3. Backbone Router (ABR) forwards the packet along the lowest-cost 10Gbps fiber link.',
      '4. Branch Router receives the packet and hands it off to the Branch switch.',
      '5. If any link is cut, OSPF routers detect the dead link within 2 seconds and automatically reroute all packets through alternate paths!'
    ],
    faultTolerance: 'Zero human intervention required during a cable cut—the network heals itself dynamically in seconds.'
  },

  star: {
    name: 'Classic Star Topology',
    badge: '⭐ The Foundation of Modern LANs',
    tagline: 'The most common local network topology in homes and offices worldwide.',
    summary: 'Every single computer, laptop, server, and printer plugs directly into one central switch. If one cable gets cut or pulled out by an employee, ONLY that single device loses connection—everyone else stays online!',
    analogy: 'A bicycle wheel: The central switch is the hub, and each device cable is a spoke radiating outward.',
    journey: [
      '1. PC 1 wants to print a document on the Network Printer.',
      '2. PC 1 sends the print job to the Central Star Switch.',
      '3. Central Switch reads the printer’s MAC address and sends the data solely down the printer’s spoke cable.',
      '4. The printer receives the job and prints!'
    ],
    faultTolerance: 'High resilience against cable faults. However, the Central Switch is a Single Point of Failure (SPOF)—if the switch powers off, the whole LAN goes down.'
  },

  ring: {
    name: 'Ring Topology (Self-Healing Loop)',
    badge: '🔄 Token Ring & SONET Metro Loop',
    tagline: 'Circular loop networks designed for automated bidirectional failover.',
    summary: 'Every node connects to exactly two neighbors, forming a complete circular loop. Packets travel along the ring. If any single link is cut, the ring detects the break and instantly reverses traffic direction with zero packet loss.',
    analogy: 'A circular running track with two-way lanes: If someone blocks the north turn, runners simply turn around and run the other way to reach the finish line.',
    journey: [
      '1. Node A sends data clockwise around the ring toward Node D.',
      '2. Each intermediary node receives the signal, regenerates it to prevent degradation, and passes it forward.',
      '3. Node D receives the packet.',
      '4. If Link C-D is cut, Node C detects the optical loss and wraps traffic counter-clockwise back around Node B and Node A!'
    ],
    faultTolerance: 'Excellent resilience against single cable cuts; used extensively in municipal fiber rings and railway signaling.'
  },

  mesh: {
    name: 'Full Mesh Topology (Ultra-Resilient)',
    badge: '🕸️ Telco & Military Defense Backbone',
    tagline: 'Maximum possible redundancy where every node is directly connected to every other node.',
    summary: 'With N nodes, there are N*(N-1)/2 direct cables. If you have 5 routers, there are 10 separate connections! Multiple cables can be completely severed by a backhoe and communication will still proceed.',
    analogy: 'A group of 5 friends sitting in a circle, where every single person holds a private tin-can telephone string connected to everyone else.',
    journey: [
      '1. Node 1 sends packets directly to Node 5 over its dedicated primary link.',
      '2. If that link is destroyed, Node 1 can detour through Node 2, Node 3, or Node 4—there are always 4 backup routes available!'
    ],
    faultTolerance: 'The absolute highest reliability possible in networking. The downside is high cabling and hardware port expense ($O(N^2)$ scaling).'
  },

  bus: {
    name: 'Linear Bus Topology (Legacy Ethernet)',
    badge: '🚌 10Base5 Coaxial Backbone',
    tagline: 'How Ethernet was originally born using a single shared coaxial trunk cable.',
    summary: 'All computers tap into a single long coaxial copper cable (the bus). Both ends must have 50-ohm resistor terminators to absorb electrical signals; without terminators, signals bounce back and create destructive collisions.',
    analogy: 'A single one-lane road with houses tapping into it: Only one car can drive at a time. If two cars enter simultaneously, they crash (collision) and must back up, wait a random time (CSMA/CD), and try again.',
    journey: [
      '1. Workstation 1 listens to the cable to ensure no one else is talking (Carrier Sense).',
      '2. Workstation 1 broadcasts electrical pulses down the trunk.',
      '3. All workstations receive the signal, but only the machine whose MAC address matches processes it.',
      '4. The 50-ohm terminators at each end absorb the signal so it doesn’t reflect.'
    ],
    faultTolerance: 'Fragile: If anyone cuts the trunk cable anywhere, the bus loses termination, signals reflect, and the ENTIRE network collapses!'
  },

  spineLeaf: {
    name: 'Spine-and-Leaf Clos Fabric (Hyperscale Data Center)',
    badge: '🌿 The Modern Cloud Standard',
    tagline: 'How Google, Amazon, and Microsoft build ultra-fast cloud data center networks.',
    summary: 'Every Leaf switch (at the top of each server rack) connects to EVERY Spine switch. Eliminates Spanning Tree blocking and guarantees that every single server in the entire data center is exactly 2 hops away from every other server!',
    analogy: 'A multi-lane superhighway overpass where every city on-ramp connects directly to every express lane with zero traffic lights.',
    journey: [
      '1. Compute Server 1 sends data to Storage Cluster in another rack.',
      '2. Leaf Switch 1 hashes the packet and balances it across Spine 1 or Spine 2 using Equal-Cost Multi-Pathing (ECMP).',
      '3. The Spine switch forwards the packet directly to Leaf Switch 3.',
      '4. Leaf Switch 3 delivers to the Storage Cluster. Total hops: exactly 2!'
    ],
    faultTolerance: 'Massive redundancy: If Spine 1 explodes, Spine 2 seamlessly carries all traffic with zero packet loss and 50% capacity remaining.'
  },

  campusWifi: {
    name: 'Campus Enterprise LAN & Wi-Fi 6',
    badge: '📶 Modern Corporate Mobility',
    tagline: 'How offices support mobile workers, executive laptops, and crystal-clear VoIP phone calls.',
    summary: 'Power-over-Ethernet (PoE+) switches power ceiling Wi-Fi 6 Access Points and VoIP desk phones down the same copper Cat6 cable—no separate power brick required! Voice traffic is prioritized over regular web browsing via Quality of Service (QoS).',
    analogy: 'A modern smart building where electrical power and high-speed data flow through the exact same wires to ceiling sensors and smart lighting.',
    journey: [
      '1. Executive Laptop sends an email over Wi-Fi 6 radio waves to the ceiling Access Point.',
      '2. The AP converts radio waves back to Ethernet pulses and sends them down Cat6 to the PoE switch.',
      '3. A VoIP Phone is simultaneously making a phone call; the switch marks the VoIP packets with high priority (DSCP EF / CoS 5).',
      '4. The Campus Core Gateway routes both out to the Internet without voice stutter or jitter.'
    ],
    faultTolerance: 'If an Access Point loses power, nearby client laptops automatically roam to neighboring APs with 802.11k/v/r fast transition.'
  },

  iot: {
    name: 'Industrial IoT & SCADA (Purdue OT Model)',
    badge: '🏭 Critical Infrastructure & Factory Automation',
    tagline: 'Protecting assembly lines, power plants, and robotic controllers from cyber threats.',
    summary: 'Operational Technology (OT) networks must prioritize human safety and physical reliability. An Industrial Firewall strictly separates the business corporate IT network from the factory floor PLC controllers, preventing ransomware from shutting down physical machines.',
    analogy: 'A nuclear plant control room: Physical air-locks and heavy blast doors prevent unauthorized visitors from entering the reactor floor.',
    journey: [
      '1. Assembly Line PLC 1 reads temperature and vibration sensors on a robotic arm.',
      '2. Sends Modbus/TCP sensor data to the Factory Floor HMI Console for human operators to view.',
      '3. Data is recorded into the SCADA Historian Server for audit logging.',
      '4. If a computer in the Sales department gets infected with malware, the Industrial OT Firewall blocks all connection attempts to the PLCs, keeping the factory safe.'
    ],
    faultTolerance: 'DIN-rail switches are ruggedized against extreme heat, electromagnetic factory vibration, and power surges.'
  },

  threeTier: {
    name: '3-Tier Cloud Web Architecture (N-Tier)',
    badge: '☁️ High-Availability Web Services',
    tagline: 'The architecture powering modern web apps (like Netflix, Uber, or Amazon).',
    summary: 'Separates public Internet users from backend database vaults into 3 tiers: Presentation Web Tier (NGINX), Business Application Tier (Node/Go/Java APIs), and Data Tier (PostgreSQL/Redis). Users never talk directly to databases!',
    analogy: 'A luxury bank: The Receptionist (Tier 1 Web) welcomes you, the Loan Officer (Tier 2 App) processes your application, and only the Armed Vault Guard (Tier 3 DB) can access the cash in the vault.',
    journey: [
      '1. Public client sends an HTTPS request from the Internet.',
      '2. Cloudflare WAF scrubs DDoS botnet traffic.',
      '3. HA Load Balancer distributes the request across Web Servers.',
      '4. Web Server calls the Internal App API to verify credentials.',
      '5. App API queries the PostgreSQL Primary Database and returns the user’s account dashboard.'
    ],
    faultTolerance: 'If Web Server 1 crashes, the Load Balancer immediately redirects users to Web Server 2 with zero downtime.'
  },

  sdwan: {
    name: 'SD-WAN Multi-Branch Enterprise Mesh',
    badge: '🌐 Software-Defined Wide Area Network',
    tagline: 'Replacing expensive legacy telecom circuits with smart cloud-managed internet tunnels.',
    summary: 'Uses software intelligence to bond multiple cheap Internet connections (Fiber, Cable, 5G cellular) together, automatically routing critical VoIP traffic over the lowest-latency path and file downloads over cheaper links.',
    analogy: 'A smart shipping fleet that constantly monitors weather, traffic jams, and toll prices, routing high-priority express packages over the fastest road and bulk cargo over the cheapest road.',
    journey: [
      '1. Branch employee initiates a Zoom video call to HQ.',
      '2. SD-WAN router measures jitter, packet loss, and latency on both Carrier A (MPLS) and Carrier B (Broadband).',
      '3. It dynamically routes Zoom packets over Carrier A because it has 0% packet loss.',
      '4. Simultaneously, it routes a big YouTube video download over Carrier B so it doesn’t slow down the Zoom call.'
    ],
    faultTolerance: 'If Carrier A is accidentally cut, SD-WAN fails over to Carrier B in under 50 milliseconds—without dropping the active phone call!'
  },

  stp_etherchannel: {
    name: 'STP & EtherChannel LACP Lab',
    badge: '🛡️ Layer 2 Loop Prevention & Aggregation',
    tagline: 'Eliminate broadcast loops and double inter-switch bandwidth with LACP port channeling.',
    summary: 'Spanning Tree Protocol (STP) elects a Root Bridge (lowest priority 24576) and places redundant links into Alternate/Blocking state to prevent catastrophic broadcast storms. EtherChannel aggregates multiple physical cables into a single logical link (Po1).',
    analogy: 'A traffic roundabout with emergency barricades: If two bridges cross the same river, one has a barrier raised (blocking) to prevent head-on crashes. EtherChannel turns two single-lane bridges into a single wide two-lane bridge that cars cross simultaneously.',
    journey: [
      '1. Root Bridge switch broadcasts BPDUs every 2 seconds.',
      '2. Switch B and Switch C elect Root Ports with lowest path cost to the Root Bridge.',
      '3. Switch C blocks its redundant link to Switch B (Alternate/Blocking Port) to break the circular loop.',
      '4. Dual 10Gbps DAC links between Root and Switch B are bundled into Port-Channel 1 (Po1) via LACP, giving 20Gbps combined throughput!'
    ],
    faultTolerance: 'If the active primary link fails, the blocked port transitions to Forwarding in under 2 seconds (Rapid PVST+).'
  },

  fhrp_hsrp: {
    name: 'FHRP (HSRP / VRRP) High Availability Gateway',
    badge: '🔄 Zero-Downtime Client Default Gateway Failover',
    tagline: 'Two physical routers acting as one virtual gateway so users never lose internet connectivity.',
    summary: 'HSRP (Hot Standby Router Protocol) allows R1 (Active, priority 110) and R2 (Standby, priority 100) to share a single Virtual IP (192.168.1.254) and Virtual MAC address (0000.0c07.ac01). Client PCs point to the Virtual IP as their Default Gateway.',
    analogy: 'Commercial jet airline co-pilots: The Captain (Active Router) flies the aircraft. The First Officer (Standby Router) listens on the radio. If the Captain faints, the First Officer instantly grabs the flight yoke without passengers spilling their drinks.',
    journey: [
      '1. Client PC sends an outbound internet packet with destination MAC set to Virtual Gateway MAC 0000.0c07.ac01.',
      '2. R1 (Active) receives the frame, decrements TTL, and routes the packet out its fiber WAN uplink.',
      '3. R1 and R2 exchange multicast Hello packets every 3 seconds on 224.0.0.2 UDP 1985.',
      '4. If R1 goes offline, R2 misses 3 Hellos (Hold time 10s) and immediately claims the Active role with zero client configuration changes!'
    ],
    faultTolerance: 'With "preempt" enabled, when R1 recovers from maintenance, it automatically reclaims the Active gateway role.'
  },

  nat_pat: {
    name: 'Network Address Translation (NAT / PAT Overload)',
    badge: '🌐 Private RFC 1918 to Public IP Translation',
    tagline: 'How millions of devices access the Internet using a single public IP address.',
    summary: 'Translates private RFC 1918 addresses (192.168.1.x) into public routable IPs. Port Address Translation (PAT) modifies Layer 4 TCP/UDP port numbers, allowing an entire enterprise of 5,000 employees to surf the web through one public IP.',
    analogy: 'A corporate office receptionist: Inside callers don’t each have their own direct outside phone line. Everyone dials outside through the main switchboard, and the receptionist tracks extension numbers (Port numbers) to route incoming callbacks to the right desk.',
    journey: [
      '1. Inside Local PC (192.168.1.50) sends HTTP request with source port 52410 to Cloud Web Server (198.51.100.80:443).',
      '2. NAT Router intercepts packet at inside interface Gi0/1 and checks its NAT translation table.',
      '3. NAT Router rewrites Source IP from 192.168.1.50 to public IP 203.0.113.2 (Inside Global) with translated port 61001.',
      '4. Cloud Server replies to 203.0.113.2:61001.',
      '5. NAT Router receives the reply, looks up port 61001 in its table, translates destination IP back to 192.168.1.50, and delivers it to the PC!'
    ],
    faultTolerance: 'Protects internal LAN machines from being directly scanned or probed from the public Internet.'
  },

  dhcp_dns: {
    name: 'DHCP DORA & Recursive DNS Resolution',
    badge: '📡 Dynamic Host Configuration & Name Translation',
    tagline: 'The two critical protocols that configure your network and turn domain names into IP addresses.',
    summary: 'DHCP automatically assigns IP configuration to unconfigured machines via the 4-step DORA handshake (Discover, Offer, Request, Acknowledge). DNS recursively resolves human-friendly names (cisco.com) into IP addresses (198.51.100.80).',
    analogy: 'Checking into a hotel: You ask reception for a room key (DHCP DORA). Once in your room, you call the concierge desk to find the street address of a restaurant in town (DNS lookup).',
    journey: [
      '1. Unconfigured PC boots up with IP 0.0.0.0 and broadcasts DHCP Discover (UDP 68 -> 67).',
      '2. DHCP Server replies with DHCP Offer proposing IP 192.168.1.105, subnet mask /24, and DNS server 192.168.1.253.',
      '3. PC broadcasts DHCP Request accepting the lease.',
      '4. Server confirms with DHCP Acknowledge (ACK). The PC is now fully online!',
      '5. PC types "google.com", sends a DNS query to 192.168.1.253 (UDP 53), which resolves the A-record and returns the IP address.'
    ],
    faultTolerance: 'DHCP leases renew automatically halfway through their duration (T1 timer at 50% lease time).'
  },

  bgp_mpls: {
    name: 'CCNP BGP & MPLS Label Switching Core',
    badge: '🌐 Service Provider Backbone & MP-BGP VPNv4',
    tagline: 'How telecom carriers route Internet traffic across continents at optical speeds using MPLS labels.',
    summary: 'Customer Edge (CE) routers peer with Provider Edge (PE) routers via eBGP. Inside the Service Provider core, P routers swap simple 32-bit MPLS labels (LDP) instead of doing slow, deep IP table lookups, with Penultimate Hop Popping (PHP) at the exit.',
    analogy: 'Express shipping barcodes: Instead of postal workers opening and reading every address label at every transfer hub, they slap an express barcode on the box. Conveyor belts (P routers) read the barcode in 1 millisecond and sort the package without opening it.',
    journey: [
      '1. CE-HQ router sends an IPv4 packet destined for Branch subnet 10.2.0.0/24.',
      '2. PE-1 Ingress router looks up customer VRF and pushes MPLS VPN label (1002) + Transport label onto the packet.',
      '3. P-Core LSR receives the labeled packet, swaps label 1002 for 2004, and sends it along the fast label-switched path (LSP).',
      '4. PE-2 Egress router performs Penultimate Hop Popping, strips the MPLS shim header, and hands the clean IPv4 packet to CE-Branch.'
    ],
    faultTolerance: 'MPLS Fast Reroute (FRR) pre-programs backup bypass tunnels that reroute traffic around severed fiber lines in under 50ms.'
  },

  wlc_capwap: {
    name: 'Cisco Catalyst 9800 WLC & Split-MAC CAPWAP',
    badge: '📶 Centralized Enterprise Wi-Fi 6 Controller',
    tagline: 'Managing hundreds of campus Wi-Fi access points from a single centralized brain.',
    summary: 'Decouples Wi-Fi functions into Split-MAC architecture: Lightweight Access Points (LAPs) handle real-time RF antenna signals, while the Catalyst 9800 WLC centrally manages 802.1X security, client roaming, channel allocation, and QoS via CAPWAP tunnels.',
    analogy: 'A hive mind: The worker bees (Lightweight APs) gather pollen and observe the flowers, while the Queen Bee (WLC) coordinates the entire hive, tells bees which flowers to pollinate, and manages hive defenses.',
    journey: [
      '1. Corporate Laptop connects to SSID "CorpSecure" on LAP-Campus-101.',
      '2. LAP encapsulates the 802.11 association request inside a CAPWAP tunnel (UDP 5246) to the Catalyst 9800 WLC.',
      '3. WLC authenticates the user via RADIUS 802.1X, assigns the user to VLAN 30, and downloads encryption keys to the LAP.',
      '4. When the user walks to another building, the WLC smoothly hands off the client to LAP-Branch-102 without dropping an active Webex call (802.11r Fast Roaming)!'
    ],
    faultTolerance: 'FlexConnect local switching allows branch APs to keep functioning and switching local data even if the WAN link to the central WLC goes down.'
  },

  dmvpn: {
    name: 'DMVPN Phase 3 (mGRE + NHRP Dynamic Mesh)',
    badge: '🔒 Dynamic Multipoint VPN Spoke-to-Spoke',
    tagline: 'On-demand direct spoke-to-spoke encrypted tunnels across any public Internet transport.',
    summary: 'Cisco DMVPN Phase 3 combines Multipoint GRE (mGRE) Tunnel0 with Next Hop Resolution Protocol (NHRP) and IPsec. Spokes register with the central Hub NHS, but when Dallas talks to London, they establish an on-demand direct IPsec tunnel between themselves!',
    analogy: 'Calling a friend on a mobile phone network: You don’t need a permanent wire running between your house and your friend’s house. The cellular tower (Hub NHRP) connects your call, and your phones communicate directly.',
    journey: [
      '1. Dallas Branch host sends a database packet to London Branch server.',
      '2. Initial packets travel through the Hub over mGRE Tunnel0.',
      '3. Hub recognizes that both Dallas and London are spokes on the same mGRE subnet and sends an NHRP Redirect to Dallas.',
      '4. Dallas router sends an NHRP Resolution Request directly to London router.',
      '5. Dallas and London establish an on-demand direct IPsec tunnel (NHRP Shortcut) and send all subsequent packets directly across the Internet with ZERO Hub delay!'
    ],
    faultTolerance: 'Zero single point of failure bottleneck at the Hub—data flows directly spoke-to-spoke at line rate.'
  },

  blank: {
    name: 'Custom Network (Blank Canvas)',
    badge: '🎨 Your Own Sandbox',
    tagline: 'Design, cable, test, and simulate any network architecture you can imagine.',
    summary: 'Use the "+ Add Device" button to place servers, firewalls, routers, laptops, and Wi-Fi APs into 3D space. Use the "Connect Nodes" tool to span cables between them, set IP addresses, and trace packets to see how your custom design behaves.',
    analogy: 'A clean digital whiteboard with an infinite box of enterprise networking hardware.',
    journey: [
      '1. Click "+ Add Device" to place a Firewall, Switch, and Server.',
      '2. Click "Connect Nodes" to link them together.',
      '3. Trace packets to verify connectivity!',
      '4. Download the PDF report to present your design to teammates.'
    ],
    faultTolerance: 'Test your own fault tolerance by using the "Break Selected" tool to see if your redundant links recover!'
  }
};

export class ExplainerManager {
  constructor(graph, simulation, menuManager) {
    this.graph = graph;
    this.simulation = simulation;
    this.menuManager = menuManager;

    this.currentTopologyKey = 'corporate';
    this.isNarrationActive = true;

    this.drawer = document.getElementById('explainer-drawer');
    this.narrationToast = document.getElementById('narration-toast');

    this.initUI();
  }

  initUI() {
    // Top bar toggle button
    document.getElementById('btn-explainer')?.addEventListener('click', () => {
      this.toggleDrawer();
    });

    document.getElementById('btn-close-explainer')?.addEventListener('click', () => {
      this.closeDrawer();
    });

    // Device click delegation for plain-English explanation
    document.getElementById('btn-explain-selected')?.addEventListener('click', () => {
      this.explainCurrentlySelected();
    });
  }

  toggleDrawer() {
    if (!this.drawer) return;
    this.drawer.classList.toggle('hidden');
    if (!this.drawer.classList.contains('hidden')) {
      this.renderCurrentTopologyExplanation();
    }
  }

  openDrawer() {
    if (!this.drawer) return;
    this.drawer.classList.remove('hidden');
    this.renderCurrentTopologyExplanation();
  }

  closeDrawer() {
    if (!this.drawer) return;
    this.drawer.classList.add('hidden');
  }

  onTopologyChanged(topologyKey) {
    this.currentTopologyKey = topologyKey || 'corporate';
    if (this.drawer && !this.drawer.classList.contains('hidden')) {
      this.renderCurrentTopologyExplanation();
    }
    // Also show brief summary toast
    const data = TOPOLOGY_EXPLANATIONS[this.currentTopologyKey] || TOPOLOGY_EXPLANATIONS.corporate;
    this.showToastNarration(`💡 Loaded: <strong>${data.name}</strong> — ${data.tagline}`, 4000);
  }

  renderCurrentTopologyExplanation() {
    const container = document.getElementById('explainer-content-body');
    if (!container) return;

    const info = TOPOLOGY_EXPLANATIONS[this.currentTopologyKey] || TOPOLOGY_EXPLANATIONS.corporate;
    const currentNodes = Array.from(this.graph.nodes.values());
    const currentLinks = this.graph.links;

    container.innerHTML = `
      <div class="explainer-hero">
        <span class="explainer-badge">${info.badge}</span>
        <h2 class="explainer-title">${info.name}</h2>
        <p class="explainer-tagline">${info.tagline}</p>
      </div>

      <!-- Real-World Plain English Analogy -->
      <div class="explainer-analogy-card">
        <div class="analogy-header">
          <span>🧠 Real-World Analogy for Beginners</span>
        </div>
        <p class="analogy-text">${info.analogy}</p>
      </div>

      <!-- How It Works Section -->
      <div class="explainer-section">
        <h3>🚀 How Data Flows (The Golden Path)</h3>
        <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 8px;">Step-by-step breakdown of how packets traverse this specific architecture:</p>
        <ol class="explainer-steps-list">
          ${info.journey.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>

      <!-- Live Devices Currently in this Network -->
      <div class="explainer-section">
        <h3>🔍 Active Devices in this Setup (${currentNodes.length} Nodes, ${currentLinks.length} Links)</h3>
        <div class="explainer-device-chips-grid">
          ${currentNodes.slice(0, 8).map(n => {
            const analogy = DEVICE_ANALOGIES[n.type] || DEVICE_ANALOGIES.desktop;
            return `
              <div class="explainer-device-chip" title="${analogy.explanation}">
                <strong>${n.name}</strong>
                <span class="device-role-tag">${(n.type || 'device').toUpperCase()}</span>
                <p style="font-size: 11.5px; color: #94a3b8; margin-top: 4px;">${analogy.analogy}</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Security & Fault Tolerance -->
      <div class="explainer-section">
        <h3>🛡️ Fault Tolerance & High Availability</h3>
        <div class="explainer-callout-box">
          <strong>Why this matters:</strong> ${info.faultTolerance}
          <div style="margin-top: 8px;">
            <button id="btn-explainer-break-demo" class="pill-btn pill-danger" style="font-size: 11.5px;">💥 Try Breaking a Link to Test Failover</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-explainer-break-demo')?.addEventListener('click', () => {
      this.closeDrawer();
      if (currentLinks.length > 0) {
        const link = currentLinks[Math.floor(Math.random() * currentLinks.length)];
        this.simulation.toggleLinkBreak(link.id);
        this.menuManager.setStatus(`💥 Simulated fault on [${link.id}]! Watch packets reroute or ripple in red.`, 'warning');
      }
    });
  }

  /**
   * Called in real-time on every single packet hop during active trace!
   */
  narrateHop({ sourceNode, destNode, currentNode, nextNode, hopIndex, totalHops, protocol, link, isReturning }) {
    if (!this.isNarrationActive) return;

    const fromName = currentNode?.name || 'Sender';
    const toName = nextNode?.name || 'Receiver';
    const cable = link?.cable || 'cat6';
    const cableSpec = CABLE_ANALOGIES[cable] || CABLE_ANALOGIES.cat6;

    let narrative = '';

    if (isReturning) {
      narrative = `🔄 <strong>Return Hop ${hopIndex}/${totalHops}</strong>: [${fromName}] sends payload confirmation back to [${toName}] via ${cableSpec.title}.`;
    } else if (hopIndex === 1) {
      narrative = `🛫 <strong>Hop 1/${totalHops} (Departure)</strong>: [${fromName}] initiates ${protocol.toUpperCase()} packet. Encapsulates IP header into Ethernet frame with destination MAC. Sent over ${cableSpec.title}.`;
    } else if (hopIndex === totalHops) {
      narrative = `🎯 <strong>Final Hop ${hopIndex}/${totalHops} (Destination Reached)</strong>: Packet arrives at target [${toName}]. OS strips headers and delivers payload to listening server application!`;
    } else {
      narrative = `⚡ <strong>Hop ${hopIndex}/${totalHops} (Transit)</strong>: [${fromName}] inspects packet headers and forwards across ${cableSpec.title} to next-hop [${toName}].`;
    }

    this.showToastNarration(narrative, 3200);
  }

  showToastNarration(htmlMessage, durationMs = 3500) {
    if (!this.narrationToast) return;
    this.narrationToast.innerHTML = htmlMessage;
    this.narrationToast.classList.remove('hidden');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.narrationToast.classList.add('hidden');
    }, durationMs);
  }
}
