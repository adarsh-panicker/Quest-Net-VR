/**
 * curriculum.js - Comprehensive CCNA (200-301), CCNP ENCOR (350-401) & CCNP ENARSI (300-410)
 * Structured Study Academy & Lab Syllabus
 *
 * Implements full topic-wise lessons with diagrams, Cisco CLI configurations,
 * real-time 3D lab bindings, and exam tips.
 */

export const CURRICULUM = [
  // =========================================================================
  // CCNA (200-301) TOPIC LIST
  // =========================================================================
  {
    track: 'CCNA 200-301',
    module: '1. Network Fundamentals',
    id: 'ccna_1_1_osi',
    title: 'OSI & TCP/IP Reference Models',
    badge: 'CCNA 1.1',
    labTemplate: 'corporate',
    summary: 'The foundational architectural models for computer networking, standardizing how data is encapsulated, transmitted, and de-encapsulated across physical and logical boundaries.',
    analogy: 'Sending a gift internationally: You wrap the gift (L7-L5 Data), put it in a box with a tracking number (L4 Segment), address the outside with destination and return addresses (L3 Packet), place it in a postal container with barcode tags (L2 Frame), and load it onto an airplane cargo hold (L1 Bits).',
    diagramSvg: `<svg viewBox="0 0 700 240" class="study-svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f97316;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="150" height="200" rx="8" fill="#1e293b" stroke="#00f3ff" stroke-width="2"/>
      <text x="95" y="45" fill="#00f3ff" font-size="14" font-weight="bold" text-anchor="middle">OSI 7-LAYER</text>
      <text x="95" y="70" fill="#ef4444" font-size="11" text-anchor="middle">7. Application</text>
      <text x="95" y="95" fill="#f97316" font-size="11" text-anchor="middle">6. Presentation</text>
      <text x="95" y="120" fill="#f59e0b" font-size="11" text-anchor="middle">5. Session</text>
      <text x="95" y="145" fill="#10b981" font-size="11" text-anchor="middle">4. Transport</text>
      <text x="95" y="170" fill="#06b6d4" font-size="11" text-anchor="middle">3. Network</text>
      <text x="95" y="195" fill="#3b82f6" font-size="11" text-anchor="middle">2. Data Link</text>
      <text x="95" y="215" fill="#8b5cf6" font-size="11" text-anchor="middle">1. Physical</text>

      <path d="M 180 120 L 250 120" stroke="#facc15" stroke-width="3" marker-end="url(#arrow)"/>

      <rect x="260" y="20" width="170" height="200" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
      <text x="345" y="45" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle">TCP/IP 4-LAYER</text>
      <text x="345" y="85" fill="#f97316" font-size="12" text-anchor="middle">Application (L7-5)</text>
      <text x="345" y="130" fill="#10b981" font-size="12" text-anchor="middle">Transport (L4)</text>
      <text x="345" y="165" fill="#06b6d4" font-size="12" text-anchor="middle">Internet (L3)</text>
      <text x="345" y="205" fill="#3b82f6" font-size="12" text-anchor="middle">Network Access (L2-1)</text>

      <rect x="450" y="20" width="230" height="200" rx="8" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
      <text x="565" y="45" fill="#a855f7" font-size="14" font-weight="bold" text-anchor="middle">PDU & HEADERS</text>
      <text x="470" y="80" fill="#cbd5e1" font-size="11">Data: [HTTP / Payload]</text>
      <text x="470" y="115" fill="#cbd5e1" font-size="11">Segment: [TCP/UDP] + Data</text>
      <text x="470" y="150" fill="#cbd5e1" font-size="11">Packet: [IP Source/Dst] + Seg</text>
      <text x="470" y="185" fill="#cbd5e1" font-size="11">Frame: [MAC Hdr] + Pkt + [FCS]</text>
      <text x="470" y="215" fill="#cbd5e1" font-size="11">Bits: 0101100101101...</text>
    </svg>`,
    deepDive: `
      <h4>The Encapsulation Process (Top to Bottom):</h4>
      <ul>
        <li><strong>Application Layer (L7-L5):</strong> Generates data (e.g. HTTP GET request, DNS query).</li>
        <li><strong>Transport Layer (L4):</strong> Adds TCP or UDP header containing Source Port (ephemeral e.g. 52140) and Destination Port (well-known e.g. 80, 443). PDU: <em>Segment</em>.</li>
        <li><strong>Network Layer (L3):</strong> Adds IPv4 or IPv6 header containing Source IP and Destination IP. Decrements TTL (Time to Live). PDU: <em>Packet</em>.</li>
        <li><strong>Data Link Layer (L2):</strong> Adds Ethernet frame header containing Source MAC and Destination MAC, plus 802.1Q VLAN tag if trunking. Calculates CRC checksum appended to Frame Check Sequence (FCS). PDU: <em>Frame</em>.</li>
        <li><strong>Physical Layer (L1):</strong> Converts frame into physical transmission bits (voltage over copper, optical pulses over glass, radio waves over air). PDU: <em>Bits</em>.</li>
      </ul>
    `,
    cliSnippet: `# Cisco IOS Verification Commands
show version
show interfaces status
show ip interface brief`,
    examTip: 'Remember the mnemonic: "Please Do Not Throw Sausage Pizza Away" (Physical, Data Link, Network, Transport, Session, Presentation, Application).'
  },

  {
    track: 'CCNA 200-301',
    module: '1. Network Fundamentals',
    id: 'ccna_1_2_subnetting',
    title: 'IPv4 Subnetting, VLSM & CIDR',
    badge: 'CCNA 1.2',
    labTemplate: 'corporate',
    summary: 'Subnetting divides large IP networks into smaller, efficient broadcast domains. Variable Length Subnet Masking (VLSM) allows using different subnet sizes to prevent IP address wastage.',
    analogy: 'Dividing a large piece of commercial land: A /24 network is a whole shopping plaza (256 addresses). Subnetting it into four /26 subnets is like partitioning the plaza into 4 separate retail stores of 64 addresses each.',
    diagramSvg: `<svg viewBox="0 0 700 180" class="study-svg">
      <rect x="20" y="20" width="660" height="40" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="6"/>
      <text x="350" y="45" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">Class C Subnet (/24): 192.168.1.0 - 256 Total IPs</text>

      <rect x="20" y="80" width="160" height="50" fill="#0f172a" stroke="#10b981" stroke-width="2" rx="6"/>
      <text x="100" y="102" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">Subnet A: /26</text>
      <text x="100" y="120" fill="#cbd5e1" font-size="10" text-anchor="middle">.0 - .63 (62 hosts)</text>

      <rect x="186" y="80" width="160" height="50" fill="#0f172a" stroke="#f59e0b" stroke-width="2" rx="6"/>
      <text x="266" y="102" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">Subnet B: /26</text>
      <text x="266" y="120" fill="#cbd5e1" font-size="10" text-anchor="middle">.64 - .127 (62 hosts)</text>

      <rect x="353" y="80" width="160" height="50" fill="#0f172a" stroke="#a855f7" stroke-width="2" rx="6"/>
      <text x="433" y="102" fill="#a855f7" font-size="12" font-weight="bold" text-anchor="middle">Subnet C: /27</text>
      <text x="433" y="120" fill="#cbd5e1" font-size="10" text-anchor="middle">.128 - .159 (30 hosts)</text>

      <rect x="520" y="80" width="160" height="50" fill="#0f172a" stroke="#ec4899" stroke-width="2" rx="6"/>
      <text x="600" y="102" fill="#ec4899" font-size="12" font-weight="bold" text-anchor="middle">WAN Point-to-Point: /30</text>
      <text x="600" y="120" fill="#cbd5e1" font-size="10" text-anchor="middle">.160 - .163 (2 hosts)</text>
    </svg>`,
    deepDive: `
      <h4>Magic Number Method for Subnetting:</h4>
      <p>1. Identify the interesting octet where the mask is neither 255 nor 0.</p>
      <p>2. Calculate Magic Number = <strong>256 - Subnet Mask Value</strong>.</p>
      <p>Example: Mask <code>255.255.255.192 (/26)</code> &rarr; Magic Number = 256 - 192 = <strong>64</strong>.</p>
      <p>3. Subnet multiples increment by 64: <code>.0</code>, <code>.64</code>, <code>.128</code>, <code>.192</code>.</p>
      <p>4. Usable host formula: <strong>2<sup>H</sup> - 2</strong> (subtract 2 for Network ID and Broadcast ID).</p>
    `,
    cliSnippet: `! Cisco IOS Interface Addressing
interface GigabitEthernet0/1
 ip address 192.168.1.1 255.255.255.192
 no shutdown`,
    examTip: 'A /30 mask yields 2 usable hosts (perfect for router-to-router WAN links). A /31 (RFC 3021) is also supported on point-to-point links with 2 addresses and no broadcast.'
  },

  {
    track: 'CCNA 200-301',
    module: '1. Network Fundamentals',
    id: 'ccna_1_3_ipv6',
    title: 'IPv6 Addressing (Global, Link-Local, EUI-64)',
    badge: 'CCNA 1.3',
    labTemplate: 'corporate',
    summary: 'IPv6 provides a 128-bit address space (340 undecillion addresses) eliminating the need for NAT. Key address types include Global Unicast (2000::/3), Link-Local (FE80::/10), and Unique Local (FC00::/7).',
    analogy: 'IPv4 was a 10-digit telephone number that ran out of combinations. IPv6 is a cosmic passport number that gives every grain of sand on Earth millions of unique public addresses.',
    deepDive: `
      <h4>IPv6 Address Types:</h4>
      <ul>
        <li><strong>Global Unicast (2000::/3):</strong> Publicly routable on the global Internet (equivalent to public IPv4).</li>
        <li><strong>Link-Local (FE80::/10):</strong> Automatically configured on every interface; used for local segment communication, routing protocol neighbor discovery (OSPFv3, BGP), and default gateways.</li>
        <li><strong>Unique Local (FC00::/7):</strong> Private enterprise addresses (equivalent to RFC 1918 private IPv4).</li>
        <li><strong>Multicast (FF00::/8):</strong> One-to-many communication; replaces IPv4 broadcasts (e.g. FF02::1 all nodes, FF02::2 all routers).</li>
        <li><strong>EUI-64:</strong> Automatically derives a 64-bit interface ID from a 48-bit MAC address by inserting <code>FF:FE</code> in the middle and inverting the 7th bit (U/L bit).</li>
      </ul>
    `,
    cliSnippet: `! Enabling IPv6 Routing on Cisco Router
ipv6 unicast-routing

interface GigabitEthernet0/0
 ipv6 address 2001:db8:acad:1::1/64
 ipv6 address fe80::1 link-local
 no shutdown`,
    examTip: 'IPv6 has NO broadcast addresses. Broadcast functionality is entirely replaced by targeted Multicast groups!'
  },

  {
    track: 'CCNA 200-301',
    module: '1. Network Fundamentals',
    id: 'ccna_1_4_cabling',
    title: 'Physical Layer: Cables, Fiber & PoE',
    badge: 'CCNA 1.4',
    labTemplate: 'corporate',
    summary: 'The physical medium carrying network signals. Covers Cat5e/Cat6/Cat6a copper twisted pair, Single-Mode vs Multi-Mode optical fiber, transceivers (SFP/SFP+), and Power over Ethernet (802.3af/at/bt).',
    analogy: 'Pipes carrying water: Thin copper pipes (Cat6) can supply an office floor for 100 meters. Massive high-pressure laser pipelines (Single-Mode Fiber) carry bulk city reservoirs for 40 kilometers.',
    deepDive: `
      <h4>Cabling & Transceiver Comparison:</h4>
      <ul>
        <li><strong>Cat6 UTP:</strong> 250 MHz frequency, 1 Gbps up to 100m, 10 Gbps up to 55m. RJ-45 connector.</li>
        <li><strong>Single-Mode Fiber (OS2):</strong> 9µm core, 1310/1550nm laser, distance up to 40km. Yellow jacket. Used for WAN and campus backbones.</li>
        <li><strong>Multi-Mode Fiber (OM4):</strong> 50µm core, 850nm VCSEL LED, distance up to 400m. Aqua jacket. Used for data center inter-switch links.</li>
        <li><strong>Power over Ethernet (PoE):</strong>
          <ul>
            <li>PoE (802.3af): 15.4W at switch (12.95W at device) - IP phones</li>
            <li>PoE+ (802.3at): 30W at switch (25.5W at device) - Wi-Fi 6 APs, PTZ cameras</li>
            <li>UPOE / PoE++ (802.3bt): 60W - 90W - Smart building monitors, laptops</li>
          </ul>
        </li>
      </ul>
    `,
    cliSnippet: `! Verify PoE power on switch ports
show power inline
show interfaces GigabitEthernet1/0/1 transceiver`,
    examTip: 'Single-Mode uses LASERS (expensive transceivers, tiny 9µm core, long distance). Multi-Mode uses LEDs/VCSEL (cheaper transceivers, wider 50µm core, modal dispersion limits distance).'
  },

  // =========================================================================
  // 2. NETWORK ACCESS
  // =========================================================================
  {
    track: 'CCNA 200-301',
    module: '2. Network Access',
    id: 'ccna_2_1_vlans',
    title: 'VLANs, Voice VLAN & 802.1Q Trunking',
    badge: 'CCNA 2.1',
    labTemplate: 'vlan_segmentation',
    summary: 'VLANs partition a physical switch into multiple isolated logical broadcast domains. 802.1Q trunk ports multiplex frames from multiple VLANs across a single cable using a 4-byte VLAN tag.',
    analogy: 'Dividing an office building into security keycard zones: Sales employees cannot enter the Server Room unless granted permission by the security door (Router).',
    deepDive: `
      <h4>IEEE 802.1Q Tag Structure (4 Bytes):</h4>
      <ul>
        <li><strong>TPID (2 Bytes):</strong> Tag Protocol Identifier (0x8100 identifies 802.1Q).</li>
        <li><strong>PCP (3 Bits):</strong> Priority Code Point (802.1p Class of Service for QoS).</li>
        <li><strong>DEI (1 Bit):</strong> Drop Eligible Indicator.</li>
        <li><strong>VID (12 Bits):</strong> VLAN Identifier (Supports 4,096 VLANs: 1 to 4094 usable).</li>
      </ul>
      <p><strong>Voice VLAN:</strong> Allows an IP Phone and a PC to share a single switch port. The phone uses tagged frames (e.g. VLAN 30 with 802.1p priority), while PC traffic passes untagged through the phone switch to the data VLAN (e.g. VLAN 10).</p>
    `,
    cliSnippet: `! Cisco Catalyst VLAN & Trunk Configuration
vlan 10
 name Sales
vlan 20
 name Engineering
vlan 30
 name Voice

interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30

! IP Phone + PC Port
interface GigabitEthernet0/2
 switchport mode access
 switchport access vlan 10
 switchport voice vlan 30`,
    examTip: 'The Native VLAN is transmitted UNTAGGED across an 802.1Q trunk. For security, change Native VLAN from default 1 to an unused VLAN (e.g. 99) on both ends of the trunk!'
  },

  {
    track: 'CCNA 200-301',
    module: '2. Network Access',
    id: 'ccna_2_2_stp',
    title: 'Spanning Tree Protocol (STP & Rapid PVST+)',
    badge: 'CCNA 2.2',
    labTemplate: 'stp_etherchannel',
    summary: 'STP (802.1D) and Rapid STP (802.1w) prevent Layer 2 bridging loops, broadcast storms, and MAC table corruption by placing redundant switch ports into a blocking state until a failure occurs.',
    analogy: 'A floodgate system: Two bridges connect two islands. To prevent a catastrophic traffic collision loop, one bridge gate is lowered (blocking). If the open bridge collapses, the floodgate raises within seconds to restore traffic.',
    deepDive: `
      <h4>Root Bridge Election Process:</h4>
      <p>1. Lowest <strong>Bridge ID (BID)</strong> wins. BID = <em>Bridge Priority (default 32768) + Extended System ID (VLAN ID) + MAC Address</em>.</p>
      <p>2. Port Roles elected:</p>
      <ul>
        <li><strong>Root Port (RP):</strong> One per non-root switch; lowest path cost to Root Bridge.</li>
        <li><strong>Designated Port (DP):</strong> One per segment; forward state.</li>
        <li><strong>Alternate / Blocking Port (AP):</strong> Discards frames to break the loop.</li>
      </ul>
      <p><strong>Convergence Times:</strong> Legacy 802.1D takes 30-50 seconds. Rapid PVST+ (802.1w) converges in under 2 seconds using proposal/agreement handshakes!</p>
    `,
    cliSnippet: `! Configure Rapid PVST+ & Make Switch Root Bridge
spanning-tree mode rapid-pvst
spanning-tree vlan 10 priority 4096
spanning-tree portfast default
spanning-tree portfast bpduguard default`,
    examTip: 'Bridge priority MUST be set in increments of 4096 (e.g. 0, 4096, 8192, 32768) because the lower 12 bits store the VLAN ID!'
  },

  {
    track: 'CCNA 200-301',
    module: '2. Network Access',
    id: 'ccna_2_3_etherchannel',
    title: 'EtherChannel (LACP & PAgP Port Bundling)',
    badge: 'CCNA 2.3',
    labTemplate: 'stp_etherchannel',
    summary: 'Bundles up to 8 active physical Ethernet links into a single logical link (Port-Channel). Increases bisectional bandwidth and provides instantaneous load balancing and failover without STP blocking.',
    analogy: 'Merging 4 single-lane dirt roads into a 4-lane paved superhighway. Traffic drives across all 4 lanes simultaneously. If one lane has a pothole, cars seamlessly use the remaining 3 lanes.',
    deepDive: `
      <h4>Negotiation Protocols:</h4>
      <ul>
        <li><strong>LACP (IEEE 802.3ad - Open Standard):</strong> Modes: <code>active</code> (initiates negotiation) and <code>passive</code> (responds).</li>
        <li><strong>PAgP (Cisco Proprietary):</strong> Modes: <code>desirable</code> (initiates) and <code>auto</code> (responds).</li>
        <li><strong>Static (No protocol):</strong> Mode <code>on</code> (forces bundle without health checks).</li>
      </ul>
      <p><strong>Load-Balancing Algorithms:</strong> Hashes Source IP, Destination IP, or Layer 4 Port numbers to distribute frames across member links without out-of-order delivery.</p>
    `,
    cliSnippet: `! Configure LACP EtherChannel Bundle
interface range GigabitEthernet0/1 - 2
 channel-group 1 mode active

interface Port-channel 1
 switchport mode trunk
 switchport trunk allowed vlan 10,20`,
    examTip: 'All member interfaces in an EtherChannel MUST have identical speed, duplex, access/trunk mode, and allowed VLAN lists, or the bundle will be suspended!'
  },

  // =========================================================================
  // 3. IP CONNECTIVITY
  // =========================================================================
  {
    track: 'CCNA 200-301',
    module: '3. IP Connectivity',
    id: 'ccna_3_1_routing',
    title: 'Routing Concepts & Administrative Distance',
    badge: 'CCNA 3.1',
    labTemplate: 'corporate',
    summary: 'Routers maintain a Routing Table to forward packets to destination networks. When multiple routes exist to the same destination, the router picks the path with the lowest Administrative Distance (AD), followed by lowest Metric.',
    analogy: 'Choosing who to trust for road directions: If your police chief (AD 0 Directly Connected) gives directions, you trust them over your neighbor (AD 110 OSPF) or an unverified rumor (AD 170 External EIGRP).',
    deepDive: `
      <h4>Standard Administrative Distance (AD) Values:</h4>
      <ul>
        <li><strong>0:</strong> Directly Connected Interface</li>
        <li><strong>1:</strong> Static Route (<code>ip route ...</code>)</li>
        <li><strong>90:</strong> EIGRP Internal</li>
        <li><strong>110:</strong> OSPF (Open Shortest Path First)</li>
        <li><strong>115:</strong> IS-IS</li>
        <li><strong>120:</strong> RIP (Routing Information Protocol)</li>
        <li><strong>170:</strong> EIGRP External</li>
        <li><strong>20:</strong> eBGP (External BGP)</li>
        <li><strong>200:</strong> iBGP (Internal BGP)</li>
        <li><strong>255:</strong> Untrusted / Unusable</li>
      </ul>
      <p><strong>Floating Static Route:</strong> A backup static route configured with a higher AD than the primary routing protocol (e.g. AD 120 vs OSPF 110) that only becomes active if OSPF fails.</p>
    `,
    cliSnippet: `! Default Route & Floating Static Backup
ip route 0.0.0.0 0.0.0.0 203.0.113.1
ip route 0.0.0.0 0.0.0.0 198.51.100.1 120  ! Backup floating route`,
    examTip: 'The LONGEST PREFIX MATCH always wins first! A /28 route from RIP (AD 120) will beat a /24 route from OSPF (AD 110) because the destination prefix is more specific!'
  },

  {
    track: 'CCNA 200-301',
    module: '3. IP Connectivity',
    id: 'ccna_3_2_ospf',
    title: 'OSPFv2 Fundamentals (LSA, DR/BDR, Cost)',
    badge: 'CCNA 3.2',
    labTemplate: 'ospf_routing',
    summary: 'OSPF is a Link-State routing protocol using Dijkstra’s Shortest Path First (SPF) algorithm. Routers establish neighbor adjacencies, exchange Link-State Advertisements (LSAs), and elect a Designated Router (DR) on broadcast networks.',
    analogy: 'Air traffic control radar: Every router has a complete 360-degree radar map of every other router in the area. If a runway closes, all planes recalculate their flight path simultaneously.',
    deepDive: `
      <h4>OSPF Adjacency States:</h4>
      <p><code>Down &rarr; Init &rarr; 2-Way &rarr; ExStart &rarr; Exchange &rarr; Loading &rarr; Full</code>.</p>
      <ul>
        <li><strong>DR / BDR Election:</strong> On multi-access broadcast segments (Ethernet), routers elect a DR and BDR to reduce LSA flooding. Highest <em>OSPF Priority (0-255)</em> wins, followed by highest <em>Router ID (RID)</em>. Priority 0 never participates.</li>
        <li><strong>Cost Metric:</strong> Formula: <code>Cost = Reference Bandwidth / Interface Bandwidth</code> (Default ref bw is 100 Mbps).</li>
        <li><strong>Areas:</strong> All non-backbone areas (Area 1, Area 2) MUST connect directly to the Backbone (Area 0) via an Area Border Router (ABR).</li>
      </ul>
    `,
    cliSnippet: `! Configure Single-Area & Multi-Area OSPF
router ospf 1
 router-id 1.1.1.1
 auto-cost reference-bandwidth 100000  ! 100 Gbps reference
 network 10.1.0.0 0.0.255.255 area 1
 network 10.0.0.0 0.0.0.255 area 0

show ip ospf neighbor
show ip ospf database`,
    examTip: 'OSPF neighbors will NOT form an adjacency if their Hello/Dead timers, Area ID, Subnet Mask, or Authentication keys do not match exactly!'
  },

  {
    track: 'CCNA 200-301',
    module: '3. IP Connectivity',
    id: 'ccna_3_3_fhrp',
    title: 'First Hop Redundancy Protocols (HSRP & VRRP)',
    badge: 'CCNA 3.3',
    labTemplate: 'fhrp_hsrp',
    summary: 'FHRP provides default gateway redundancy for client hosts. Two physical routers share a single virtual IP address and virtual MAC address. If the active gateway crashes, the standby router seamlessly takes over.',
    analogy: 'Co-pilots in an aircraft cockpit: Both have hands near the controls. The Captain flies the plane. If the Captain loses consciousness, the Co-pilot instantly takes over the flight controls without the passengers ever knowing.',
    deepDive: `
      <h4>HSRP (Cisco Proprietary - RFC 2281) vs VRRP (Open Standard - RFC 5798):</h4>
      <ul>
        <li><strong>HSRP Active / Standby:</strong> Highest priority (default 100) becomes Active. Preemption must be enabled with <code>standby preempt</code> for a recovered router to reclaim the active role.</li>
        <li><strong>Virtual MAC Format:</strong>
          <ul>
            <li>HSRP v1: <code>0000.0c07.acXX</code> (XX = hex group number)</li>
            <li>HSRP v2: <code>0000.0c9f.fXXX</code> (XXX = hex group number)</li>
            <li>VRRP: <code>0000.5e00.01XX</code></li>
          </ul>
        </li>
      </ul>
    `,
    cliSnippet: `! Configure HSRP v2 Gateway Redundancy
interface GigabitEthernet0/1
 ip address 192.168.1.2 255.255.255.0
 standby version 2
 standby 1 ip 192.168.1.254    ! Shared Virtual Gateway IP
 standby 1 priority 110        ! Higher priority wins
 standby 1 preempt             ! Reclaim active if rebooted`,
    examTip: 'Without "preempt" configured, a higher-priority router that reboots will remain Standby and will NOT take over the active role from a lower-priority router!'
  },

  // =========================================================================
  // 4. IP SERVICES
  // =========================================================================
  {
    track: 'CCNA 200-301',
    module: '4. IP Services',
    id: 'ccna_4_1_nat',
    title: 'Network Address Translation (Static, Dynamic & PAT)',
    badge: 'CCNA 4.1',
    labTemplate: 'nat_pat',
    summary: 'NAT conserves public IPv4 addresses by translating private RFC 1918 addresses into public routable IPs. Port Address Translation (PAT / NAT Overload) maps thousands of private clients to a single public IP using unique Layer 4 port numbers.',
    analogy: 'An apartment building mailroom: Every resident has an apartment number (Private IP), but the entire building shares one street address (Public IP). The mailroom clerk uses apartment numbers (Port numbers) to deliver incoming mail to the correct resident.',
    deepDive: `
      <h4>NAT Terminology:</h4>
      <ul>
        <li><strong>Inside Local:</strong> The private IP assigned to a host on the internal LAN (e.g. 192.168.1.10).</li>
        <li><strong>Inside Global:</strong> The public IP representing the internal host to the outside world (e.g. 203.0.113.5).</li>
        <li><strong>Outside Local:</strong> The IP address of an outside host as known to the internal network.</li>
        <li><strong>Outside Global:</strong> The real public IP assigned to the outside destination host (e.g. 8.8.8.8).</li>
      </ul>
    `,
    cliSnippet: `! Configure PAT (NAT Overload) on Cisco Router
ip access-list standard NAT_LAN
 permit 192.168.1.0 0.0.0.255

interface GigabitEthernet0/0
 ip nat inside
interface GigabitEthernet0/1
 ip nat outside

ip nat inside source list NAT_LAN interface GigabitEthernet0/1 overload
show ip nat translations`,
    examTip: 'PAT (Overload) can track up to ~65,000 concurrent connections per public IP address based on available 16-bit Layer 4 port numbers.'
  },

  {
    track: 'CCNA 200-301',
    module: '4. IP Services',
    id: 'ccna_4_2_dhcp_dns',
    title: 'DHCP DORA Process, DHCP Relay & DNS',
    badge: 'CCNA 4.2',
    labTemplate: 'dhcp_dns',
    summary: 'DHCP automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to hosts using the 4-step DORA handshake. DHCP Relay forwards client UDP broadcasts across routers to a centralized DHCP server.',
    analogy: 'Renting a hotel room: You walk up to reception asking for a room (Discover), the clerk offers you Room 204 (Offer), you agree to take it (Request), and the clerk hands you the keycard (Acknowledge).',
    deepDive: `
      <h4>The 4-Step DHCP DORA Process:</h4>
      <ol>
        <li><strong>Discover (Client &rarr; Broadcast 255.255.255.255):</strong> Source 0.0.0.0:68, Dst 255.255.255.255:67.</li>
        <li><strong>Offer (Server &rarr; Unicast/Broadcast):</strong> Server proposes IP address, mask, lease time, and gateway.</li>
        <li><strong>Request (Client &rarr; Broadcast):</strong> Client officially requests the offered IP and declines any other offers.</li>
        <li><strong>Acknowledge (Server &rarr; Unicast/Broadcast):</strong> Server commits the binding to its database.</li>
      </ol>
      <p><strong>DHCP Relay Agent:</strong> Routers drop broadcast packets by default. <code>ip helper-address [Server-IP]</code> converts UDP 67 broadcast into a unicast packet forwarded to the central server.</p>
    `,
    cliSnippet: `! Configure Cisco IOS DHCP Server & Relay
ip dhcp excluded-address 192.168.1.1 192.168.1.10
ip dhcp pool OFFICE_LAN
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 1.1.1.1 8.8.8.8
 lease 7

! On remote branch router interface:
interface GigabitEthernet0/1
 ip helper-address 10.0.10.50`,
    examTip: 'The "ip helper-address" command relays not just DHCP (ports 67/68), but also TFTP (69), DNS (53), Time (37), TACACS (49), and NetBIOS (137/138) by default!'
  },

  {
    track: 'CCNA 200-301',
    module: '4. IP Services',
    id: 'ccna_4_3_qos',
    title: 'Quality of Service (QoS) & Traffic Policing',
    badge: 'CCNA 4.3',
    labTemplate: 'campusWifi',
    summary: 'QoS manages network congestion by prioritizing mission-critical and latency-sensitive traffic (VoIP and video) over bulk data transfers (file downloads and web browsing). Covers classification, marking (DSCP/CoS), queuing, policing, and shaping.',
    analogy: 'An emergency vehicle lane on a highway: Ambulances and fire trucks (VoIP phone calls) get an empty siren lane, while commuter cars and freight trucks (emails and downloads) wait in normal traffic.',
    deepDive: `
      <h4>Traffic Parameters:</h4>
      <ul>
        <li><strong>Bandwidth:</strong> Total data capacity of the link (bps).</li>
        <li><strong>Delay (Latency):</strong> Time required for a packet to travel source to destination (VoIP requires <150 ms one-way).</li>
        <li><strong>Jitter:</strong> Variation in packet delay (VoIP requires <30 ms).</li>
        <li><strong>Packet Loss:</strong> Dropped packets due to buffer queue exhaustion (VoIP requires <1% loss).</li>
      </ul>
      <h4>Marking Headers:</h4>
      <ul>
        <li><strong>Layer 2 CoS (802.1p):</strong> 3-bit field inside 802.1Q tag (values 0-7; Voice is CoS 5).</li>
        <li><strong>Layer 3 DSCP:</strong> 6-bit field inside IPv4 ToS byte / IPv6 Traffic Class (values 0-63; Voice is Expedited Forwarding <code>EF 46</code>).</li>
      </ul>
    `,
    cliSnippet: `! Modular QoS CLI (MQC) 3-Step Configuration
class-map match-any VOICE_TRAFFIC
 match dscp ef

policy-map ENTERPRISE_QOS
 class VOICE_TRAFFIC
  priority percent 30  ! Low Latency Queuing (LLQ)
 class class-default
  fair-queue

interface GigabitEthernet0/1
 service-policy output ENTERPRISE_QOS`,
    examTip: 'Policing DROPS traffic exceeding the rate limit. Shaping BUFFERS excess traffic into a queue to smooth out bursts without drops.'
  },

  // =========================================================================
  // 5. SECURITY FUNDAMENTALS
  // =========================================================================
  {
    track: 'CCNA 200-301',
    module: '5. Security Fundamentals',
    id: 'ccna_5_1_acls',
    title: 'Access Control Lists (Standard & Extended)',
    badge: 'CCNA 5.1',
    labTemplate: 'corporate',
    summary: 'ACLs are ordered permit/deny statement filters applied to router interfaces. Standard ACLs filter solely by Source IP. Extended ACLs filter by Source IP, Destination IP, Protocol (TCP/UDP/ICMP), and Port numbers.',
    analogy: 'A security guest checklist: Standard ACL checks only your name on your ID card. Extended ACL checks your name, where you are going, what room number you are entering, and what tools you are carrying.',
    deepDive: `
      <h4>ACL Numbering & Placement Rules:</h4>
      <ul>
        <li><strong>Standard ACLs (1-99 & 1300-1999):</strong> Filter Source IP only. <em>Placement rule: Place as CLOSE TO DESTINATION as possible</em> (to avoid unintentionally blocking traffic to other networks).</li>
        <li><strong>Extended ACLs (100-199 & 2000-2699):</strong> Filter Source, Destination, Protocol, and Port. <em>Placement rule: Place as CLOSE TO SOURCE as possible</em> (to drop forbidden packets early and conserve WAN bandwidth).</li>
        <li><strong>Implicit Deny Any:</strong> Every ACL has an invisible <code>deny any</code> statement at the very end. If a packet does not match a permit statement, it is dropped!</li>
      </ul>
    `,
    cliSnippet: `! Extended Named ACL Blocking Telnet but Permitting Web
ip access-list extended SECURE_INBOUND
 remark Block unencrypted Telnet access
 deny tcp any any eq 23
 permit tcp 192.168.1.0 0.0.0.255 any eq 443
 permit tcp 192.168.1.0 0.0.0.255 any eq 80
 permit ip any any

interface GigabitEthernet0/0
 ip access-group SECURE_INBOUND in`,
    examTip: 'ACLs process statements top-to-bottom and STOP on the first match! Always place specific rules at the top and general rules at the bottom.'
  },

  {
    track: 'CCNA 200-301',
    module: '5. Security Fundamentals',
    id: 'ccna_5_2_layer2_security',
    title: 'Layer 2 Security: Port Security, DHCP Snooping & DAI',
    badge: 'CCNA 5.2',
    labTemplate: 'corporate',
    summary: 'Hardening the local switch access layer against rogue DHCP servers, ARP poisoning (man-in-the-middle), CAM table overflow attacks, and unauthorized devices plugging into wall jacks.',
    analogy: 'Apartment building security guards verifying tenant keys: Port security ensures only registered keys work in the door. DHCP snooping ensures nobody sets up a fake mail distribution table in the lobby. DAI ensures nobody impersonates the landlord.',
    deepDive: `
      <h4>Three Essential Layer 2 Defense Mechanisms:</h4>
      <ul>
        <li><strong>Port Security:</strong> Restricts switch port to specific MAC addresses. Violation modes:
          <ul>
            <li><code>shutdown</code> (default): Shuts port into error-disabled (err-disable) state and sends SNMP trap.</li>
            <li><code>restrict</code>: Drops unauthorized packets and increments violation counter.</li>
            <li><code>protect</code>: Silently drops unauthorized packets without alert.</li>
          </ul>
        </li>
        <li><strong>DHCP Snooping:</strong> Designates switch ports as Trusted (connected to real DHCP server) or Untrusted (user ports). Drops rogue DHCP server offers and builds a dynamic IP-to-MAC binding database.</li>
        <li><strong>Dynamic ARP Inspection (DAI):</strong> Uses the DHCP snooping database to inspect and drop fake ARP reply packets, preventing ARP cache poisoning / Man-in-the-Middle attacks.</li>
      </ul>
    `,
    cliSnippet: `! Configure Port Security & DHCP Snooping
interface GigabitEthernet0/5
 switchport mode access
 switchport port-security
 switchport port-security maximum 2
 switchport port-security violation shutdown
 switchport port-security mac-address sticky

ip dhcp snooping
ip dhcp snooping vlan 10
ip arp inspection vlan 10`,
    examTip: 'Sticky MAC addresses dynamically learn the connected device’s MAC address and save it directly into the running-config so it persists after reboots!'
  },

  // =========================================================================
  // 6. AUTOMATION & PROGRAMMABILITY
  // =========================================================================
  {
    track: 'CCNA 200-301',
    module: '6. Automation & Programmability',
    id: 'ccna_6_1_automation',
    title: 'Network Automation, REST APIs, JSON & Cisco DNA Center',
    badge: 'CCNA 6.1',
    labTemplate: 'cloud_hybrid',
    summary: 'The shift from manual CLI typing on individual routers to centralized Software-Defined Networking (SDN) controllers using RESTful APIs, JSON data serialization, and Python automation.',
    analogy: 'Replacing 1,000 independent pilot-controlled airplanes with a centralized automated air traffic control supercomputer that configures all routes via software in seconds.',
    deepDive: `
      <h4>SDN Architecture Planes:</h4>
      <ul>
        <li><strong>Data Plane (Forwarding):</strong> Hardware ASIC chips switching frames and routing packets at wire speed.</li>
        <li><strong>Control Plane:</strong> Routing protocols (OSPF, BGP, STP) determining where packets should go. In SDN, the control plane is centralized into a controller (e.g. Cisco DNA Center / Catalyst Center).</li>
        <li><strong>Management Plane:</strong> SSH, Telnet, Web GUI, REST APIs used by network engineers to configure devices.</li>
      </ul>
      <h4>REST API Verbs:</h4>
      <ul>
        <li><code>GET</code>: Retrieve data (read status)</li>
        <li><code>POST</code>: Create a new resource (e.g. configure a new VLAN)</li>
        <li><code>PUT</code>: Replace an existing resource</li>
        <li><code>DELETE</code>: Remove a resource</li>
      </ul>
    `,
    cliSnippet: `# Python REST API GET Request using requests
import requests
import json

url = "https://sandboxdnac.cisco.com/dna/intent/api/v1/network-device"
headers = {"X-Auth-Token": "auth_token_here", "Content-Type": "application/json"}

response = requests.get(url, headers=headers, verify=False)
devices = response.json()
print(json.dumps(devices, indent=2))`,
    examTip: 'Southbound APIs (OpenFlow, NETCONF, RESTCONF) connect the SDN controller to physical switches. Northbound APIs (REST APIs) connect the controller to business applications and scripts.'
  },

  // =========================================================================
  // CCNP ENCOR (350-401) TOPIC LIST
  // =========================================================================
  {
    track: 'CCNP ENCOR 350-401',
    module: '1. Architecture & Virtualization',
    id: 'encor_1_sdwan_vxlan',
    title: 'Cisco SD-WAN, SDA & VXLAN Overlay Fabric',
    badge: 'CCNP 1.1',
    labTemplate: 'sdwan',
    summary: 'Software-Defined Access (SDA) and SD-WAN decouple network overlays from the physical underlay transport. VXLAN encapsulates Layer 2 frames in Layer 4 UDP packets (port 4789) across any IP network.',
    analogy: 'Shipping a sports car inside a standard shipping container: The container ship (Underlay IP network) only cares about moving the shipping container. Inside the container is the sports car (Layer 2 VXLAN frame), completely protected from salt water.',
    deepDive: `
      <h4>Cisco SD-WAN Component Architecture:</h4>
      <ul>
        <li><strong>vManage (Management Plane):</strong> Centralized single pane of glass GUI for policy and configuration templates.</li>
        <li><strong>vSmart (Control Plane):</strong> Distributes routing policies, encryption keys, and OMP (Overlay Management Protocol) updates.</li>
        <li><strong>vBond (Orchestration Plane):</strong> Authenticates and orchestrates edge routers joining the SD-WAN fabric; assists NAT traversal.</li>
        <li><strong>vEdge / cEdge (Data Plane):</strong> Physical or virtual routers forwarding encrypted IPsec user data packets.</li>
      </ul>
    `,
    cliSnippet: `! Cisco SD-WAN OMP Verification
show sdwan control connections
show sdwan bfd sessions
show sdwan policy from-vsmart`,
    examTip: 'VXLAN expands the 12-bit VLAN limit (4,096 VLANs) to a 24-bit VNI (VXLAN Network Identifier) supporting up to 16 million virtual networks!'
  },

  {
    track: 'CCNP ENCOR 350-401',
    module: '2. Infrastructure Routing',
    id: 'encor_2_bgp_advanced',
    title: 'BGP Path Attributes & Route Selection',
    badge: 'CCNP 2.1',
    labTemplate: 'bgp_mpls',
    summary: 'Border Gateway Protocol (BGPv4) is the routing protocol of the global Internet. BGP uses autonomous systems (AS) and an extensive list of Path Attributes (PA) to choose the best path.',
    analogy: 'The United Nations of networking: Instead of raw speed or hop counts, BGP routes traffic based on political agreements, business relationships, and international treaties between countries and telco providers.',
    deepDive: `
      <h4>BGP Best Path Selection Algorithm (Memorize: N WLLA OMNI):</h4>
      <ol>
        <li><strong>N</strong>ext-Hop reachable?</li>
        <li>Highest <strong>W</strong>eight (Cisco proprietary, local to router, default 0 or 32768 for locally originated).</li>
        <li>Highest <strong>L</strong>ocal Preference (Exchanged within iBGP AS, default 100).</li>
        <li>Prefer routes <strong>L</strong>ocally originated.</li>
        <li>Shortest <strong>A</strong>S_Path (fewer AS hops).</li>
        <li>Lowest <strong>O</strong>rigin Code (IGP &lt; EGP &lt; Incomplete).</li>
        <li>Lowest <strong>M</strong>ED (Multi-Exit Discriminator sent to eBGP neighbor).</li>
        <li>Prefer <strong>e</strong>BGP over iBGP.</li>
        <li>Lowest <strong>I</strong>GP metric to BGP next-hop.</li>
        <li>Oldest route / Lowest BGP Router ID.</li>
      </ol>
    `,
    cliSnippet: `! Configure eBGP Peering with Service Provider
router bgp 65001
 neighbor 203.0.113.1 remote-as 65100
 neighbor 203.0.113.1 description ISP_PE_ROUTER
 address-family ipv4
  network 198.51.100.0 mask 255.255.255.0
  neighbor 203.0.113.1 activate`,
    examTip: 'Weight is LOCAL to the router (never advertised to peers). Local Preference is advertised to all iBGP peers inside the same Autonomous System.'
  },

  {
    track: 'CCNP ENCOR 350-401',
    module: '3. Wireless Architecture',
    id: 'encor_3_wlc_capwap',
    title: 'Wireless LAN Controller (WLC) & CAPWAP Architecture',
    badge: 'CCNP 3.1',
    labTemplate: 'wlc_capwap',
    summary: 'Centralized Cisco Catalyst 9800 WLC architecture uses Control and Provisioning of Wireless Access Points (CAPWAP) tunnels to separate real-time RF functions (AP) from policy, roaming, and encryption (WLC).',
    analogy: 'Air traffic control radar towers: The towers on the field (Lightweight APs) detect planes and signal beacons, but the central air traffic tower (WLC) assigns gate arrivals, frequencies, and passenger tickets.',
    deepDive: `
      <h4>Split-MAC Architecture Functions:</h4>
      <ul>
        <li><strong>Handled by Lightweight AP:</strong> 802.11 beacon frames, probe responses, packet acknowledgements, real-time RF signal monitoring.</li>
        <li><strong>Handled by WLC Controller:</strong> 802.11 association & reassociation, 802.1X EAP authentication, Quality of Service, inter-AP roaming, RF channel assignment (RRM).</li>
        <li><strong>CAPWAP Tunnels:</strong> Control traffic uses UDP 5246 (DTLS encrypted). Data payload uses UDP 5247.</li>
      </ul>
    `,
    cliSnippet: `! Cisco Catalyst 9800 WLC CLI
show ap summary
show wireless client summary
show capwap summary`,
    examTip: 'In Local Mode, user traffic is tunneled back to the central WLC. In FlexConnect Mode, user traffic is switched directly onto the local branch switch, so clients keep working even if the WAN link to the WLC drops!'
  },

  // =========================================================================
  // CCNP ENARSI (300-410) TOPIC LIST
  // =========================================================================
  {
    track: 'CCNP ENARSI 300-410',
    module: '1. Layer 3 Technologies',
    id: 'enarsi_1_ospf_advanced',
    title: 'Advanced OSPFv2/v3: NSSA & Virtual Links',
    badge: 'ENARSI 1.1',
    labTemplate: 'ospf_routing',
    summary: 'Deep-dive into multi-area OSPF tuning: Not-So-Stubby Areas (NSSA) allowing local external route redistribution via Type-7 LSAs translated to Type-5 LSAs at the ABR, and OSPF Virtual Links.',
    analogy: 'A secure research lab inside a military base: It blocks outside civilian traffic (Stub), but has its own internal prototype lab that produces classified inventions (Type-7 LSA) translated for the rest of the army.',
    deepDive: `
      <h4>OSPF LSA Types Review:</h4>
      <ul>
        <li><strong>Type 1 (Router LSA):</strong> Generated by every router inside an area describing its links.</li>
        <li><strong>Type 2 (Network LSA):</strong> Generated by DR on broadcast segments describing connected routers.</li>
        <li><strong>Type 3 (Summary LSA):</strong> Generated by ABR to advertise inter-area routes to other areas.</li>
        <li><strong>Type 4 (ASBR Summary):</strong> Generated by ABR advertising how to reach an ASBR.</li>
        <li><strong>Type 5 (AS External):</strong> Generated by ASBR advertising routes redistributed from outside OSPF (e.g. BGP or EIGRP).</li>
        <li><strong>Type 7 (NSSA External):</strong> Generated inside NSSA areas where Type 5 LSAs are blocked; translated to Type 5 by ABR.</li>
      </ul>
    `,
    cliSnippet: `! Configure OSPF Not-So-Stubby-Area (NSSA)
router ospf 1
 area 10 nssa
 area 10 nssa default-information-originate

! OSPF Virtual Link through transit area
area 1 virtual-link 2.2.2.2`,
    examTip: 'An OSPF Virtual Link can NEVER transit through a Stub or NSSA area—it requires a regular, non-stub transit area!'
  },

  {
    track: 'CCNP ENARSI 300-410',
    module: '2. VPN Technologies',
    id: 'enarsi_2_mpls_vpn',
    title: 'MPLS LDP & Layer 3 BGP VPNs',
    badge: 'ENARSI 2.1',
    labTemplate: 'bgp_mpls',
    summary: 'Multiprotocol Label Switching (MPLS) uses Label Distribution Protocol (LDP) to switch packets using simple 32-bit labels instead of searching complex IP routing tables. MP-BGP provides customer VPN separation via VRFs and Route Distinguishers.',
    analogy: 'Luggage routing at an international airport: Instead of border security reading your entire passport at every baggage carousel, they slap a baggage barcode sticker (MPLS label) on the handle. Airport machines sort it in milliseconds based strictly on the barcode sticker.',
    deepDive: `
      <h4>MPLS 32-Bit Label Header (The "Shim" Header):</h4>
      <ul>
        <li><strong>Label Value (20 Bits):</strong> Specifies the forwarding path (0-1,048,575).</li>
        <li><strong>Traffic Class / Exp (3 Bits):</strong> Quality of Service / CoS priority.</li>
        <li><strong>Bottom of Stack S-bit (1 Bit):</strong> 1 indicates this is the bottom label in the stack; 0 indicates another label follows.</li>
        <li><strong>TTL (8 Bits):</strong> Decremented at each hop to prevent routing loops.</li>
      </ul>
      <p><strong>Router Roles:</strong> Customer Edge (CE), Provider Edge (PE - imposes and disposes labels), Provider Core (P - swaps labels at wire speed).</p>
    `,
    cliSnippet: `! Enable MPLS & LDP on Core Router
ip cef
mpls ip
mpls label range 100 999

interface GigabitEthernet0/0
 mpls ip

show mpls ldp neighbors
show mpls forwarding-table`,
    examTip: 'Penultimate Hop Popping (PHP) strips the outer MPLS label at the second-to-last router (P router) before delivering the packet to the PE router, saving the PE from performing two lookups!'
  },

  {
    track: 'CCNP ENARSI 300-410',
    module: '2. VPN Technologies',
    id: 'enarsi_2_dmvpn',
    title: 'Dynamic Multipoint VPN (DMVPN Phase 1/2/3)',
    badge: 'ENARSI 2.2',
    labTemplate: 'dmvpn',
    summary: 'Cisco DMVPN combines Multipoint GRE (mGRE), Next Hop Resolution Protocol (NHRP), and IPsec crypto profiles to build scalable hub-and-spoke and dynamic spoke-to-spoke encrypted tunnels without static manual configurations.',
    analogy: 'Uber driver on-demand matching: Spokes don’t need permanent cables connected to all other spokes. When Spoke A wants to call Spoke B, it queries the dispatcher (Hub NHRP server) and establishes an on-demand direct private tunnel directly between them!',
    deepDive: `
      <h4>DMVPN Evolution:</h4>
      <ul>
        <li><strong>Phase 1:</strong> Hub-and-Spoke only. All spoke-to-spoke traffic MUST transit through the Hub.</li>
        <li><strong>Phase 2:</strong> Spoke-to-Spoke dynamic tunnels supported. Spokes preserve next-hop IP addresses.</li>
        <li><strong>Phase 3:</strong> Advanced Spoke-to-Spoke using NHRP Redirect and NHRP Shortcut. Hub sends an NHRP redirect saying "You can talk directly to Spoke 2!", allowing instant direct tunnels with optimal summarization.</li>
      </ul>
    `,
    cliSnippet: `! Configure DMVPN mGRE Tunnel on Hub Router
interface Tunnel0
 ip address 10.255.0.1 255.255.255.0
 ip nhrp network-id 1
 ip nhrp redirect
 tunnel source GigabitEthernet0/0
 tunnel mode gre multipoint
 tunnel protection ipsec profile DMVPN_IPSEC_PROFILE`,
    examTip: 'DMVPN Phase 3 requires "ip nhrp redirect" on the Hub and "ip nhrp shortcut" on the Spokes to trigger on-demand dynamic tunnels!'
  }
];
