/**
 * curriculum.js - Comprehensive CCNA (200-301), CCNP ENCOR (350-401) & CCNP ENARSI (300-410)
 * Structured Study Academy & Lab Syllabus
 *
 * Implements full topic-wise lessons with high-fidelity SVG diagrams, real-world analogies,
 * concrete worked scenarios & examples, physical hardware photos, Cisco CLI configurations,
 * real-time 3D lab bindings, and exam tips.
 */

export const CURRICULUM = [
  {
    "track": "CCNA 200-301",
    "module": "1. Network Fundamentals",
    "id": "ccna_1_1_osi",
    "title": "OSI & TCP/IP Reference Models",
    "badge": "CCNA 1.1",
    "labTemplate": "corporate",
    "summary": "The foundational architectural models for computer networking, standardizing how data is encapsulated, transmitted, and de-encapsulated across physical and logical boundaries.",
    "analogy": "Sending a gift internationally: You wrap the gift (L7-L5 Data), put it in a box with a tracking number (L4 Segment), address the outside with destination and return addresses (L3 Packet), place it in a postal container with barcode tags (L2 Frame), and load it onto an airplane cargo hold (L1 Bits).",
    "diagramSvg": "<svg viewBox=\"0 0 700 240\" class=\"study-svg\">\n      <rect x=\"20\" y=\"20\" width=\"150\" height=\"200\" rx=\"8\" fill=\"#1e293b\" stroke=\"#00f3ff\" stroke-width=\"2\"/>\n      <text x=\"95\" y=\"45\" fill=\"#00f3ff\" font-size=\"14\" font-weight=\"bold\" text-anchor=\"middle\">OSI 7-LAYER</text>\n      <text x=\"95\" y=\"70\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\">7. Application</text>\n      <text x=\"95\" y=\"95\" fill=\"#f97316\" font-size=\"11\" text-anchor=\"middle\">6. Presentation</text>\n      <text x=\"95\" y=\"120\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"middle\">5. Session</text>\n      <text x=\"95\" y=\"145\" fill=\"#10b981\" font-size=\"11\" text-anchor=\"middle\">4. Transport</text>\n      <text x=\"95\" y=\"170\" fill=\"#06b6d4\" font-size=\"11\" text-anchor=\"middle\">3. Network</text>\n      <text x=\"95\" y=\"195\" fill=\"#3b82f6\" font-size=\"11\" text-anchor=\"middle\">2. Data Link</text>\n      <text x=\"95\" y=\"215\" fill=\"#8b5cf6\" font-size=\"11\" text-anchor=\"middle\">1. Physical</text>\n\n      <path d=\"M 180 120 L 250 120\" stroke=\"#facc15\" stroke-width=\"3\"/>\n\n      <rect x=\"260\" y=\"20\" width=\"170\" height=\"200\" rx=\"8\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"345\" y=\"45\" fill=\"#10b981\" font-size=\"14\" font-weight=\"bold\" text-anchor=\"middle\">TCP/IP 4-LAYER</text>\n      <text x=\"345\" y=\"85\" fill=\"#f97316\" font-size=\"12\" text-anchor=\"middle\">Application (L7-5)</text>\n      <text x=\"345\" y=\"130\" fill=\"#10b981\" font-size=\"12\" text-anchor=\"middle\">Transport (L4)</text>\n      <text x=\"345\" y=\"165\" fill=\"#06b6d4\" font-size=\"12\" text-anchor=\"middle\">Internet (L3)</text>\n      <text x=\"345\" y=\"205\" fill=\"#3b82f6\" font-size=\"12\" text-anchor=\"middle\">Network Access (L2-1)</text>\n\n      <rect x=\"450\" y=\"20\" width=\"230\" height=\"200\" rx=\"8\" fill=\"#0f172a\" stroke=\"#a855f7\" stroke-width=\"2\"/>\n      <text x=\"565\" y=\"45\" fill=\"#a855f7\" font-size=\"14\" font-weight=\"bold\" text-anchor=\"middle\">PDU &amp; HEADERS</text>\n      <text x=\"470\" y=\"80\" fill=\"#cbd5e1\" font-size=\"11\">Data: [HTTP / Payload]</text>\n      <text x=\"470\" y=\"115\" fill=\"#cbd5e1\" font-size=\"11\">Segment: [TCP/UDP] + Data</text>\n      <text x=\"470\" y=\"150\" fill=\"#cbd5e1\" font-size=\"11\">Packet: [IP Source/Dst] + Seg</text>\n      <text x=\"470\" y=\"185\" fill=\"#cbd5e1\" font-size=\"11\">Frame: [MAC Hdr] + Pkt + [FCS]</text>\n      <text x=\"470\" y=\"215\" fill=\"#cbd5e1\" font-size=\"11\">Bits: 0101100101101...</text>\n    </svg>",
    "example": {
      "scenario": "Alice in Sales visits https://cisco.com on her corporate laptop. Here is what happens layer-by-layer:",
      "steps": [
        "Application (L7): Chrome constructs an HTTP GET / request.",
        "Presentation (L6): TLS encrypts the HTTP request into AES-256 ciphertext.",
        "Session (L5): Keeps the HTTPS socket session synchronized between Alice and Cisco's web server.",
        "Transport (L4): Encapsulates ciphertext into a TCP Segment with Source Port 53120 and Destination Port 443.",
        "Network (L3): Adds IP header with Source IP 192.168.1.50 and Destination IP 198.51.100.80. PDU is now a Packet.",
        "Data Link (L2): Adds Ethernet frame with Alice's MAC as Source and Default Gateway Router's MAC as Destination, appending an FCS error checksum.",
        "Physical (L1): NIC converts frame into electrical voltage pulses transmitted over Cat6 copper twisted pairs."
      ],
      "keyTakeaway": "Each layer only interacts with the corresponding layer on the destination machine (peer-to-peer logical communication)."
    },
    "deepDive": "\n      <h4>The Encapsulation Process (Top to Bottom):</h4>\n      <ul>\n        <li><strong>Application Layer (L7-L5):</strong> Generates data (e.g. HTTP GET request, DNS query).</li>\n        <li><strong>Transport Layer (L4):</strong> Adds TCP or UDP header containing Source Port (ephemeral e.g. 52140) and Destination Port (well-known e.g. 80, 443). PDU: <em>Segment</em>.</li>\n        <li><strong>Network Layer (L3):</strong> Prepends Source IP and Destination IP addresses. Handles logical routing. PDU: <em>Packet</em>.</li>\n        <li><strong>Data Link Layer (L2):</strong> Prepends Source MAC and Destination MAC addresses and appends a Frame Check Sequence (FCS/CRC32) trailer for physical link error detection. PDU: <em>Frame</em>.</li>\n        <li><strong>Physical Layer (L1):</strong> Encodes binary bits into electrical voltages (copper), photon light pulses (optical fiber), or radio waves (Wi-Fi).</li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco IOS Device Verification\nshow interfaces GigabitEthernet0/1\nshow ip route\nshow mac address-table",
    "examTip": "Remember the mnemonic: \"Please Do Not Throw Sausage Pizza Away\" (Physical, Data Link, Network, Transport, Session, Presentation, Application).",
    "hardwarePhoto": {
      "title": "Cisco Catalyst 9300 24-Port PoE+ Enterprise Switch",
      "src": "assets/hardware/cisco_catalyst_switch.svg",
      "caption": "Hardware used: Enterprise Layer-2/Layer-3 access switch connecting office PCs, printers, and phones at wire-speed."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "1. Network Fundamentals",
    "id": "ccna_1_2_subnetting",
    "title": "IPv4 Subnetting, VLSM & CIDR",
    "badge": "CCNA 1.2",
    "labTemplate": "corporate",
    "summary": "Subnetting divides large IP networks into smaller, efficient broadcast domains. Variable Length Subnet Masking (VLSM) allows using different subnet sizes to prevent IP address wastage.",
    "analogy": "Dividing a large commercial building: A /24 network is a whole shopping plaza (256 addresses). Subnetting it with VLSM partitions it into 4 custom retail spaces matching each store size exactly.",
    "diagramSvg": "<svg viewBox=\"0 0 700 180\" class=\"study-svg\">\n      <rect x=\"20\" y=\"20\" width=\"660\" height=\"40\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\" rx=\"6\"/>\n      <text x=\"350\" y=\"45\" fill=\"#38bdf8\" font-size=\"14\" font-weight=\"bold\" text-anchor=\"middle\">Class C Subnet (/24): 192.168.1.0 - 256 Total IPs</text>\n\n      <rect x=\"20\" y=\"80\" width=\"160\" height=\"50\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\" rx=\"6\"/>\n      <text x=\"100\" y=\"102\" fill=\"#10b981\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">Subnet A: /26</text>\n      <text x=\"100\" y=\"120\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">.0 - .63 (62 hosts)</text>\n\n      <rect x=\"186\" y=\"80\" width=\"160\" height=\"50\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\" rx=\"6\"/>\n      <text x=\"266\" y=\"102\" fill=\"#f59e0b\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">Subnet B: /26</text>\n      <text x=\"266\" y=\"120\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">.64 - .127 (62 hosts)</text>\n\n      <rect x=\"353\" y=\"80\" width=\"160\" height=\"50\" fill=\"#0f172a\" stroke=\"#a855f7\" stroke-width=\"2\" rx=\"6\"/>\n      <text x=\"433\" y=\"102\" fill=\"#a855f7\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">Subnet C: /27</text>\n      <text x=\"433\" y=\"120\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">.128 - .159 (30 hosts)</text>\n\n      <rect x=\"520\" y=\"80\" width=\"160\" height=\"50\" fill=\"#0f172a\" stroke=\"#ec4899\" stroke-width=\"2\" rx=\"6\"/>\n      <text x=\"600\" y=\"102\" fill=\"#ec4899\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">WAN Link: /30</text>\n      <text x=\"600\" y=\"120\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">.160 - .163 (2 hosts)</text>\n    </svg>",
    "example": {
      "scenario": "Your company receives block 192.168.10.0/24 and needs to create 3 subnets: Sales (50 PCs), HR (20 PCs), and a Router Point-to-Point WAN link (2 routers):",
      "steps": [
        "1. Sales (Needs 50 hosts): 2^6 - 2 = 62 hosts. Borrow 2 host bits -> /26 mask (255.255.255.192). Network: 192.168.10.0/26. Usable: .1 to .62. Broadcast: .63.",
        "2. HR (Needs 20 hosts): 2^5 - 2 = 30 hosts. Borrow 3 host bits -> /27 mask (255.255.255.224). Network: 192.168.10.64/27. Usable: .65 to .94. Broadcast: .95.",
        "3. WAN Link (Needs 2 hosts): 2^2 - 2 = 2 hosts. Borrow 6 host bits -> /30 mask (255.255.255.252). Network: 192.168.10.96/30. Usable: .97 and .98. Broadcast: .99.",
        "4. Unused address space (192.168.10.100 to .255) remains free for future office expansion!"
      ],
      "keyTakeaway": "Always allocate the largest subnet first (Sales 50 -> HR 20 -> WAN 2) to prevent overlapping boundaries."
    },
    "deepDive": "\n      <h4>Magic Number Method for Subnetting:</h4>\n      <p>1. Identify the interesting octet where the mask is neither 255 nor 0.</p>\n      <p>2. Calculate Magic Number = <strong>256 - Subnet Mask Value</strong>.</p>\n      <p>Example: Mask <code>255.255.255.192 (/26)</code> &rarr; Magic Number = 256 - 192 = <strong>64</strong>.</p>\n      <p>3. Subnet multiples increment by 64: <code>.0</code>, <code>.64</code>, <code>.128</code>, <code>.192</code>.</p>\n      <p>4. Usable host formula: <strong>2<sup>H</sup> - 2</strong> (subtract 2 for Network ID and Broadcast ID).</p>\n    ",
    "cliSnippet": "! Cisco IOS Interface Addressing\ninterface GigabitEthernet0/1\n ip address 192.168.10.1 255.255.255.192\n no shutdown",
    "examTip": "A /30 mask yields 2 usable hosts (perfect for router-to-router WAN links). A /31 (RFC 3021) is also supported on point-to-point links with 2 addresses and no broadcast.",
    "hardwarePhoto": {
      "title": "Cisco ISR 4331 Enterprise Modular WAN Router",
      "src": "assets/hardware/cisco_isr_router.svg",
      "caption": "Hardware used: Routed interfaces (GE0/0/0, GE0/0/1) separate broadcast domains and route between VLSM subnets."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "1. Network Fundamentals",
    "id": "ccna_1_3_ipv6",
    "title": "IPv6 Addressing (Global, Link-Local, EUI-64)",
    "badge": "CCNA 1.3",
    "labTemplate": "corporate",
    "summary": "IPv6 provides a 128-bit address space (340 undecillion addresses) eliminating the need for NAT. Key address types include Global Unicast (2000::/3), Link-Local (FE80::/10), and Unique Local (FC00::/7).",
    "analogy": "IPv4 was a 10-digit telephone number that ran out of combinations. IPv6 is a cosmic passport number that gives every grain of sand on Earth billions of unique public addresses.",
    "diagramSvg": "<svg viewBox=\"0 0 700 200\" class=\"study-svg\">\n      <rect x=\"20\" y=\"20\" width=\"320\" height=\"70\" rx=\"8\" fill=\"#1e293b\" stroke=\"#00f3ff\" stroke-width=\"2\"/>\n      <text x=\"180\" y=\"48\" fill=\"#00f3ff\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">64-BIT NETWORK ROUTING PREFIX</text>\n      <text x=\"180\" y=\"72\" fill=\"#cbd5e1\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\">2001 : 0db8 : acad : 0001</text>\n\n      <rect x=\"360\" y=\"20\" width=\"320\" height=\"70\" rx=\"8\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"520\" y=\"48\" fill=\"#10b981\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">64-BIT INTERFACE HOST ID (EUI-64)</text>\n      <text x=\"520\" y=\"72\" fill=\"#cbd5e1\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\">0200 : 11ff : fe22 : 3344</text>\n\n      <rect x=\"20\" y=\"110\" width=\"660\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#a855f7\" stroke-width=\"1.5\"/>\n      <text x=\"40\" y=\"135\" fill=\"#a855f7\" font-size=\"12\" font-weight=\"bold\">EUI-64 MAC TRANSFORMATION PROCESS:</text>\n      <text x=\"40\" y=\"160\" fill=\"#cbd5e1\" font-size=\"11\" font-family=\"monospace\">MAC 00:00:11:22:33:44 -> Split in Half -> Insert FF:FE -> Flip 7th Bit (00->02) -> 0200:11FF:FE22:3344</text>\n    </svg>",
    "example": {
      "scenario": "A Cisco switch port generates its Link-Local address from MAC address 00:1B:78:3A:9C:12:",
      "steps": [
        "1. Split the 48-bit MAC in half: [00:1B:78] and [3A:9C:12].",
        "2. Insert 'FF:FE' in between: 001B:78FF:FE3A:9C12.",
        "3. Invert the 7th bit (Universal/Local) of the first byte: 0x00 (0000 0000) becomes 0x02 (0000 0010).",
        "4. Resulting Interface ID: 021B:78FF:FE3A:9C12.",
        "5. Prepend Link-Local prefix: fe80::21b:78ff:fe3a:9c12."
      ],
      "keyTakeaway": "Every IPv6-enabled interface automatically has a Link-Local (fe80::/10) address even if no DHCP or global IPv6 is configured!"
    },
    "deepDive": "\n      <h4>IPv6 Address Types:</h4>\n      <ul>\n        <li><strong>Global Unicast (2000::/3):</strong> Publicly routable on the global Internet (equivalent to public IPv4).</li>\n        <li><strong>Link-Local (FE80::/10):</strong> Automatically configured on every interface; used for local segment communication, routing protocol neighbor discovery (OSPFv3, BGP), and default gateways.</li>\n        <li><strong>Unique Local (FC00::/7):</strong> Private enterprise addresses (equivalent to RFC 1918 private IPv4).</li>\n        <li><strong>Multicast (FF00::/8):</strong> Replaces IPv4 broadcasts (FF02::1 all nodes, FF02::2 all routers).</li>\n      </ul>\n    ",
    "cliSnippet": "! Enabling IPv6 Routing on Cisco Router\nipv6 unicast-routing\n\ninterface GigabitEthernet0/0\n ipv6 address 2001:db8:acad:1::1/64\n ipv6 address fe80::1 link-local\n no shutdown",
    "examTip": "IPv6 has NO BROADCAST ADDRESS! Multicast (FF02::1) and Anycast replace all broadcast functions.",
    "hardwarePhoto": {
      "title": "Cisco ISR 4331 Dual-Stack IPv4/IPv6 Router",
      "src": "assets/hardware/cisco_isr_router.svg",
      "caption": "Hardware used: Supports Global Unicast (2001::/3) and auto-derives EUI-64 link-local interface addresses."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "1. Network Fundamentals",
    "id": "ccna_1_4_cabling",
    "title": "Physical Layer: Cables, Fiber & PoE",
    "badge": "CCNA 1.4",
    "labTemplate": "corporate",
    "summary": "The physical medium carrying binary bitstreams: Unshielded Twisted Pair (Cat6/Cat6A), Single-Mode and Multi-Mode Fiber Optic cables, Transceivers (SFP/SFP+), and Power-over-Ethernet (802.3af/at/bt).",
    "analogy": "Water pipes and garden hoses: Copper cables are copper pipes with high friction (100-meter distance limit). Fiber optic cables are laser tubes that bounce light off internal glass mirrors for 40 kilometers without losing pressure.",
    "diagramSvg": "<svg viewBox=\"0 0 700 230\" class=\"study-svg\">\n      <!-- Cat6 RJ45 Visual -->\n      <rect x=\"30\" y=\"25\" width=\"300\" height=\"180\" rx=\"8\" fill=\"#1e293b\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n      <text x=\"180\" y=\"55\" fill=\"#38bdf8\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">CAT6 RJ-45 PINOUT (T568B)</text>\n      \n      <circle cx=\"65\" cy=\"85\" r=\"7\" fill=\"#f97316\" stroke=\"#fff\" stroke-dasharray=\"2,2\"/>\n      <text x=\"85\" y=\"90\" fill=\"#cbd5e1\" font-size=\"10\">Pin 1: White/Orange</text>\n      <circle cx=\"65\" cy=\"110\" r=\"7\" fill=\"#f97316\"/>\n      <text x=\"85\" y=\"115\" fill=\"#cbd5e1\" font-size=\"10\">Pin 2: Orange</text>\n      <circle cx=\"65\" cy=\"135\" r=\"7\" fill=\"#10b981\" stroke=\"#fff\" stroke-dasharray=\"2,2\"/>\n      <text x=\"85\" y=\"140\" fill=\"#cbd5e1\" font-size=\"10\">Pin 3: White/Green</text>\n      <circle cx=\"65\" cy=\"160\" r=\"7\" fill=\"#3b82f6\"/>\n      <text x=\"85\" y=\"165\" fill=\"#cbd5e1\" font-size=\"10\">Pin 4: Blue</text>\n      <circle cx=\"65\" cy=\"185\" r=\"7\" fill=\"#3b82f6\" stroke=\"#fff\" stroke-dasharray=\"2,2\"/>\n      <text x=\"85\" y=\"190\" fill=\"#cbd5e1\" font-size=\"10\">Pin 5: White/Blue</text>\n\n      <!-- Fiber Optic Visual -->\n      <rect x=\"370\" y=\"25\" width=\"300\" height=\"180\" rx=\"8\" fill=\"#1e293b\" stroke=\"#eab308\" stroke-width=\"2\"/>\n      <text x=\"520\" y=\"55\" fill=\"#eab308\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">OPTICAL FIBER (SMF vs MMF)</text>\n\n      <rect x=\"390\" y=\"75\" width=\"260\" height=\"50\" rx=\"6\" fill=\"#0f172a\" stroke=\"#eab308\"/>\n      <text x=\"405\" y=\"95\" fill=\"#eab308\" font-size=\"11\" font-weight=\"bold\">Single-Mode Fiber (OS2 - Yellow)</text>\n      <text x=\"405\" y=\"115\" fill=\"#94a3b8\" font-size=\"10\">9µm Glass Core • 1310/1550nm Laser • 40km Distance</text>\n\n      <rect x=\"390\" y=\"135\" width=\"260\" height=\"50\" rx=\"6\" fill=\"#0f172a\" stroke=\"#06b6d4\"/>\n      <text x=\"405\" y=\"155\" fill=\"#06b6d4\" font-size=\"11\" font-weight=\"bold\">Multi-Mode Fiber (OM4 - Aqua)</text>\n      <text x=\"405\" y=\"175\" fill=\"#94a3b8\" font-size=\"10\">50µm Core • 850nm VCSEL LED • 400m Data Center</text>\n    </svg>",
    "example": {
      "scenario": "Wiring an office building: Connecting floor switches to servers vs ceiling Wi-Fi Access Points:",
      "steps": [
        "1. Desktop PC to Wall Jack: Cat6 UTP copper (T568B pinout) up to 100 meters. Provides 1 Gbps access.",
        "2. Ceiling Access Point to Switch: Cat6 cable using PoE+ (802.3at) providing 30 Watts of power down the same copper wire so no power outlet is needed in the ceiling!",
        "3. Floor 1 Switch to Floor 5 Core Switch (Vertical Riser): Multi-Mode Fiber (OM4 Aqua) with SFP+ 10GBASE-SR transceivers.",
        "4. HQ Data Center to Remote Warehouse (15 km away): Single-Mode Fiber (OS2 Yellow) with SFP+ 10GBASE-LR laser transceivers."
      ],
      "keyTakeaway": "Use copper for short distances (&lt;100m) with PoE; use fiber for long distances, EMI immunity, and high-bandwidth risers."
    },
    "deepDive": "\n      <h4>Power over Ethernet (PoE) Standards:</h4>\n      <ul>\n        <li><strong>PoE (802.3af):</strong> Up to 15.4W at port (12.95W at device). Powers basic VoIP phones.</li>\n        <li><strong>PoE+ (802.3at):</strong> Up to 30W at port (25.5W at device). Powers PTZ cameras, Wi-Fi 6 APs.</li>\n        <li><strong>PoE++ / UPoE (802.3bt):</strong> Up to 60W (Type 3) or 90W-100W (Type 4). Powers digital signage and laptops!</li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco Catalyst Switch PoE Verification\nshow power inline\nshow interfaces status\nshow interfaces transceiver",
    "examTip": "Cat6 copper cable supports 10 Gbps up to 55 meters; Cat6A supports 10 Gbps up to the full 100 meters!",
    "hardwarePhoto": {
      "title": "Molded Cat6 UTP Copper Cable & Gold-Plated RJ-45 Plug",
      "src": "assets/hardware/cat6_copper_cable.svg",
      "caption": "Hardware used: 4-pair 23AWG copper cable with cross-separator spline and 50µ gold contacts rated for 10 Gbps (55m)."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "2. Network Access",
    "id": "ccna_2_1_vlans",
    "title": "VLANs, Voice VLAN & 802.1Q Trunking",
    "badge": "CCNA 2.1",
    "labTemplate": "vlan_segmentation",
    "summary": "Virtual Local Area Networks (VLANs) segment a single physical switch into multiple isolated broadcast domains. IEEE 802.1Q trunking inserts a 4-byte VLAN tag into Ethernet frames to carry multiple VLANs across a single cable.",
    "analogy": "Apartment balconies on the same floor: People on Balcony 10 (Sales) cannot jump onto Balcony 20 (Engineering) unless they walk down the stairs to the ground floor reception lobby (Router).",
    "diagramSvg": "<svg viewBox=\"0 0 700 220\" class=\"study-svg\">\n      <!-- Switch Visual -->\n      <rect x=\"30\" y=\"30\" width=\"320\" height=\"160\" rx=\"8\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"190\" y=\"60\" fill=\"#38bdf8\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">CISCO CATALYST 9300 SWITCH</text>\n      \n      <rect x=\"50\" y=\"80\" width=\"80\" height=\"40\" rx=\"4\" fill=\"#1d4ed8\"/>\n      <text x=\"90\" y=\"105\" fill=\"#fff\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\">Ports 1-8: V10</text>\n      <text x=\"90\" y=\"140\" fill=\"#93c5fd\" font-size=\"9\" text-anchor=\"middle\">Sales (Data)</text>\n\n      <rect x=\"150\" y=\"80\" width=\"80\" height=\"40\" rx=\"4\" fill=\"#047857\"/>\n      <text x=\"190\" y=\"105\" fill=\"#fff\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\">Ports 9-16: V20</text>\n      <text x=\"190\" y=\"140\" fill=\"#6ee7b7\" font-size=\"9\" text-anchor=\"middle\">Eng (Data)</text>\n\n      <rect x=\"250\" y=\"80\" width=\"80\" height=\"40\" rx=\"4\" fill=\"#b91c1c\"/>\n      <text x=\"290\" y=\"105\" fill=\"#fff\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\">Port 24: Trunk</text>\n      <text x=\"290\" y=\"140\" fill=\"#fca5a5\" font-size=\"9\" text-anchor=\"middle\">802.1Q Uplink</text>\n\n      <!-- 802.1Q Header Tag -->\n      <rect x=\"380\" y=\"30\" width=\"290\" height=\"160\" rx=\"8\" fill=\"#0f172a\" stroke=\"#a855f7\" stroke-width=\"2\"/>\n      <text x=\"525\" y=\"60\" fill=\"#a855f7\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">802.1Q 4-BYTE VLAN TAG</text>\n      <text x=\"400\" y=\"95\" fill=\"#cbd5e1\" font-size=\"11\">• TPID (2 Bytes): 0x8100 identifies 802.1Q</text>\n      <text x=\"400\" y=\"125\" fill=\"#cbd5e1\" font-size=\"11\">• PCP (3 Bits): 802.1p Priority / CoS</text>\n      <text x=\"400\" y=\"155\" fill=\"#cbd5e1\" font-size=\"11\">• VID (12 Bits): VLAN ID (1 to 4094)</text>\n    </svg>",
    "example": {
      "scenario": "Connecting an Executive VoIP Phone and PC to a single wall port:",
      "steps": [
        "1. Wall port is configured with Data VLAN 10 (Sales) and Voice VLAN 30.",
        "2. An IP Phone plugs into the wall port, and the PC plugs into the data port behind the phone.",
        "3. When the phone transmits VoIP voice packets, it tags them with 802.1Q VID=30 and 802.1p Priority CoS=5.",
        "4. When the PC transmits web data, the phone passes it through untagged (Data VLAN 10).",
        "5. Result: Both share 1 cable while voice quality is guaranteed!"
      ],
      "keyTakeaway": "Voice VLAN provides automatic QoS prioritization for IP phones without running dual physical cables to every desk."
    },
    "deepDive": "\n      <h4>802.1Q Frame Fields:</h4>\n      <ul>\n        <li><strong>TPID (0x8100):</strong> Tells switches this frame contains an 802.1Q tag.</li>\n        <li><strong>VID (12 bits):</strong> Supports VLAN IDs from 1 to 4094 (VLAN 0 and 4095 are reserved).</li>\n        <li><strong>Native VLAN:</strong> Frames on the Native VLAN traverse trunks UNTAGGED. Default Native VLAN is VLAN 1.</li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco Switch VLAN & Trunk Configuration\nvlan 10\n name Sales\nvlan 30\n name Voice\n\ninterface GigabitEthernet0/1\n switchport mode access\n switchport access vlan 10\n switchport voice vlan 30\n\ninterface GigabitEthernet0/24\n switchport mode trunk\n switchport trunk allowed vlan 10,20,30",
    "examTip": "Always change the default Native VLAN from VLAN 1 to an unused VLAN (e.g. VLAN 999) to stop VLAN hopping attacks!",
    "hardwarePhoto": {
      "title": "Cisco Catalyst 9300 VLAN & 802.1Q Trunk Switch",
      "src": "assets/hardware/cisco_catalyst_switch.svg",
      "caption": "Hardware used: 24 Gigabit access ports partitioned into Sales, Eng, and Voice VLANs with 10G SFP+ trunk uplinks."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "2. Network Access",
    "id": "ccna_2_2_stp",
    "title": "Spanning Tree Protocol (STP & Rapid PVST+)",
    "badge": "CCNA 2.2",
    "labTemplate": "stp_etherchannel",
    "summary": "STP (802.1D) and Rapid STP (802.1w) prevent Layer 2 bridging loops, broadcast storms, and MAC table corruption by placing redundant switch ports into a blocking state until a failure occurs.",
    "analogy": "A floodgate system: Two bridges connect two islands. To prevent a catastrophic traffic collision loop, one bridge gate is lowered (blocking). If the open bridge collapses, the floodgate raises within seconds to restore traffic.",
    "diagramSvg": "<svg viewBox=\"0 0 700 230\" class=\"study-svg\">\n      <!-- Root Bridge -->\n      <rect x=\"260\" y=\"20\" width=\"180\" height=\"60\" rx=\"8\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"45\" fill=\"#10b981\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">ROOT BRIDGE (SW-1)</text>\n      <text x=\"350\" y=\"65\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Priority: 24576 (Lowest BID)</text>\n\n      <!-- Non-Root 1 -->\n      <rect x=\"70\" y=\"140\" width=\"170\" height=\"60\" rx=\"8\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"155\" y=\"165\" fill=\"#38bdf8\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">SWITCH 2 (SW-2)</text>\n      <text x=\"155\" y=\"185\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Priority: 32768</text>\n\n      <!-- Non-Root 2 -->\n      <rect x=\"460\" y=\"140\" width=\"170\" height=\"60\" rx=\"8\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"545\" y=\"165\" fill=\"#38bdf8\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">SWITCH 3 (SW-3)</text>\n      <text x=\"545\" y=\"185\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Priority: 32768</text>\n\n      <!-- Links -->\n      <line x1=\"260\" y1=\"50\" x2=\"160\" y2=\"140\" stroke=\"#10b981\" stroke-width=\"3\"/>\n      <line x1=\"440\" y1=\"50\" x2=\"540\" y2=\"140\" stroke=\"#10b981\" stroke-width=\"3\"/>\n      <line x1=\"240\" y1=\"170\" x2=\"460\" y2=\"170\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-dasharray=\"6,4\"/>\n      \n      <!-- Block Marker -->\n      <circle cx=\"350\" cy=\"170\" r=\"14\" fill=\"#ef4444\"/>\n      <text x=\"350\" y=\"175\" fill=\"#fff\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">X</text>\n      <text x=\"350\" y=\"205\" fill=\"#ef4444\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">Alternate / Blocking Port</text>\n    </svg>",
    "example": {
      "scenario": "Three switches SW-1, SW-2, SW-3 are connected in a loop. How does STP elect the Root Bridge?",
      "steps": [
        "1. Bridge ID = Priority (default 32768) + Extended System ID (VLAN ID) + MAC address.",
        "2. SW-1 BID: 24576 + 1 + 0001.0001.0001.",
        "3. SW-2 BID: 32768 + 1 + 0002.0002.0002.",
        "4. SW-3 BID: 32768 + 1 + 0003.0003.0003.",
        "5. SW-1 wins the election because 24576 is the lowest priority! All ports on SW-1 become Designated Ports (Forwarding).",
        "6. SW-2 and SW-3 put their direct link between each other into Blocking state (marked with red X), successfully killing the loop."
      ],
      "keyTakeaway": "Lowest Bridge ID always wins Root Bridge. Port roles are elected based on lowest path cost to the Root."
    },
    "deepDive": "\n      <h4>Root Bridge Election Process:</h4>\n      <p>1. Lowest <strong>Bridge ID (BID)</strong> wins. BID = <em>Bridge Priority (default 32768) + Extended System ID (VLAN ID) + MAC Address</em>.</p>\n      <p>2. Port Roles elected:</p>\n      <ul>\n        <li><strong>Root Port (RP):</strong> One per non-root switch; lowest path cost to Root Bridge.</li>\n        <li><strong>Designated Port (DP):</strong> One per segment; forward state.</li>\n        <li><strong>Alternate / Blocking Port (AP):</strong> Discards frames to break the loop.</li>\n      </ul>\n    ",
    "cliSnippet": "! Rapid PVST+ Root Bridge Configuration\nspanning-tree mode rapid-pvst\nspanning-tree vlan 10 priority 24576\nspanning-tree portfast default\nspanning-tree portfast bpduguard default",
    "examTip": "Bridge priority MUST be set in increments of 4096 (e.g. 0, 4096, 8192, 24576, 32768) because the lower 12 bits store the VLAN ID!",
    "hardwarePhoto": {
      "title": "Cisco Catalyst 9300 Spanning Tree Root Bridge",
      "src": "assets/hardware/cisco_catalyst_switch.svg",
      "caption": "Hardware used: Elected Root Bridge (priority 24576) broadcasting BPDUs every 2s to prevent broadcast storm loops."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "2. Network Access",
    "id": "ccna_2_3_etherchannel",
    "title": "EtherChannel (LACP & PAgP Port Bundling)",
    "badge": "CCNA 2.3",
    "labTemplate": "stp_etherchannel",
    "summary": "Bundles up to 8 active physical Ethernet links into a single logical link (Port-Channel). Increases bisectional bandwidth and provides instantaneous load balancing and failover without STP blocking.",
    "analogy": "Merging 4 single-lane dirt roads into a 4-lane paved superhighway. Traffic drives across all 4 lanes simultaneously. If one lane has a pothole, cars seamlessly use the remaining 3 lanes.",
    "diagramSvg": "<svg viewBox=\"0 0 700 200\" class=\"study-svg\">\n      <rect x=\"50\" y=\"50\" width=\"150\" height=\"90\" rx=\"8\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"125\" y=\"100\" fill=\"#38bdf8\" font-size=\"14\" font-weight=\"bold\" text-anchor=\"middle\">SWITCH A</text>\n\n      <rect x=\"500\" y=\"50\" width=\"150\" height=\"90\" rx=\"8\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"575\" y=\"100\" fill=\"#38bdf8\" font-size=\"14\" font-weight=\"bold\" text-anchor=\"middle\">SWITCH B</text>\n\n      <!-- Physical Bundled Lines -->\n      <line x1=\"200\" y1=\"75\" x2=\"500\" y2=\"75\" stroke=\"#a855f7\" stroke-width=\"4\"/>\n      <line x1=\"200\" y1=\"115\" x2=\"500\" y2=\"115\" stroke=\"#a855f7\" stroke-width=\"4\"/>\n\n      <!-- Logical Bundle Tube -->\n      <rect x=\"240\" y=\"60\" width=\"220\" height=\"70\" rx=\"35\" fill=\"rgba(168, 85, 247, 0.15)\" stroke=\"#c084fc\" stroke-width=\"1.5\" stroke-dasharray=\"4,4\"/>\n      <text x=\"350\" y=\"95\" fill=\"#f0abfc\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">Port-Channel 1 (Po1)</text>\n      <text x=\"350\" y=\"115\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">2x 10Gbps Bundled (LACP Active)</text>\n    </svg>",
    "example": {
      "scenario": "Connecting two core switches with two 10Gbps links without STP blocking one:",
      "steps": [
        "1. Without EtherChannel: STP detects a redundant loop and blocks Link 2. Bandwidth is limited to 10 Gbps.",
        "2. With EtherChannel: Both links are added to 'channel-group 1 mode active' (802.3ad LACP).",
        "3. Switches negotiate LACP PDUs and treat the pair as a single virtual link: 'Port-channel 1'.",
        "4. Total bandwidth doubles to 20 Gbps full-duplex with zero ports blocked by STP!",
        "5. If a rat chews through Cable 1, traffic flows across Cable 2 within 1 millisecond with zero dropped connections."
      ],
      "keyTakeaway": "EtherChannel combines redundancy with 100% link utilization—no blocked wasted cables!"
    },
    "deepDive": "\n      <h4>Negotiation Protocols:</h4>\n      <ul>\n        <li><strong>LACP (IEEE 802.3ad - Open Standard):</strong> Modes: <code>active</code> (initiates negotiation) and <code>passive</code> (responds).</li>\n        <li><strong>PAgP (Cisco Proprietary):</strong> Modes: <code>desirable</code> (initiates) and <code>auto</code> (responds).</li>\n        <li><strong>Static (No protocol):</strong> Mode <code>on</code> (forces bundle without health checks).</li>\n      </ul>\n    ",
    "cliSnippet": "! Configure LACP EtherChannel Bundle\ninterface range GigabitEthernet0/1 - 2\n channel-group 1 mode active\n\ninterface Port-channel 1\n switchport mode trunk\n switchport trunk allowed vlan 10,20",
    "examTip": "All member interfaces in an EtherChannel MUST have identical speed, duplex, access/trunk mode, and allowed VLAN lists!",
    "hardwarePhoto": {
      "title": "SFP+ 10G Optical Transceivers Bundled into Port-Channel 1",
      "src": "assets/hardware/fiber_sfp_transceiver.svg",
      "caption": "Hardware used: Dual 10G optical fiber links bonded with 802.3ad LACP for 20 Gbps aggregated non-blocking throughput."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "3. IP Connectivity",
    "id": "ccna_3_1_routing",
    "title": "Routing Concepts & Administrative Distance",
    "badge": "CCNA 3.1",
    "labTemplate": "corporate",
    "summary": "Routers maintain a Routing Table to forward packets to destination networks. When multiple routes exist to the same destination, the router picks the path with the lowest Administrative Distance (AD), followed by lowest Metric.",
    "analogy": "Choosing who to trust for road directions: If your police chief (AD 0 Directly Connected) gives directions, you trust them over your neighbor (AD 110 OSPF) or an unverified rumor (AD 170 External EIGRP).",
    "diagramSvg": "<svg viewBox=\"0 0 700 200\" class=\"study-svg\">\n      <rect x=\"30\" y=\"20\" width=\"640\" height=\"160\" rx=\"8\" fill=\"#1e293b\" stroke=\"#00f3ff\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"45\" fill=\"#00f3ff\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">CISCO ROUTING TABLE LOOKUP WATERFALL</text>\n\n      <rect x=\"50\" y=\"65\" width=\"180\" height=\"95\" rx=\"6\" fill=\"#0f172a\" stroke=\"#10b981\"/>\n      <text x=\"140\" y=\"90\" fill=\"#10b981\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">1. Longest Prefix</text>\n      <text x=\"140\" y=\"115\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Most specific subnet mask</text>\n      <text x=\"140\" y=\"140\" fill=\"#38bdf8\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">/28 beats /24 beats /16</text>\n\n      <rect x=\"260\" y=\"65\" width=\"180\" height=\"95\" rx=\"6\" fill=\"#0f172a\" stroke=\"#f59e0b\"/>\n      <text x=\"350\" y=\"90\" fill=\"#f59e0b\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">2. Lowest AD</text>\n      <text x=\"350\" y=\"115\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Trustworthiness of source</text>\n      <text x=\"350\" y=\"140\" fill=\"#fbbf24\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">Static (1) &lt; OSPF (110)</text>\n\n      <rect x=\"470\" y=\"65\" width=\"180\" height=\"95\" rx=\"6\" fill=\"#0f172a\" stroke=\"#a855f7\"/>\n      <text x=\"560\" y=\"90\" fill=\"#a855f7\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">3. Lowest Metric</text>\n      <text x=\"560\" y=\"115\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Tie-breaker within protocol</text>\n      <text x=\"560\" y=\"140\" fill=\"#c084fc\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">Lowest Cost / Bandwidth</text>\n    </svg>",
    "example": {
      "scenario": "A Cisco router has three routes in its routing table and receives a packet destined for 10.1.1.130:",
      "steps": [
        "Route 1: 10.1.0.0/16 via OSPF (AD 110, Metric 20).",
        "Route 2: 10.1.1.0/24 via RIP (AD 120, Metric 2).",
        "Route 3: 10.1.1.128/25 via EIGRP (AD 90, Metric 1500).",
        "Decision: Which route forwards the packet? Route 3 wins! /25 is the LONGEST prefix match (25 bits match the destination 10.1.1.130).",
        "Administrative distance is NEVER evaluated between routes with different prefix lengths!"
      ],
      "keyTakeaway": "Longest prefix match ALWAYS wins first, before Administrative Distance is even considered."
    },
    "deepDive": "\n      <h4>Standard Administrative Distance (AD) Values:</h4>\n      <ul>\n        <li><strong>0:</strong> Directly Connected Interface</li>\n        <li><strong>1:</strong> Static Route (<code>ip route ...</code>)</li>\n        <li><strong>90:</strong> EIGRP Internal</li>\n        <li><strong>110:</strong> OSPF</li>\n        <li><strong>120:</strong> RIP</li>\n        <li><strong>20:</strong> eBGP</li>\n        <li><strong>200:</strong> iBGP</li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco Static Route & Floating Backup\nip route 0.0.0.0 0.0.0.0 203.0.113.1\nip route 0.0.0.0 0.0.0.0 198.51.100.1 120  ! Backup floating static",
    "examTip": "The LONGEST PREFIX MATCH always wins first! A /28 route from RIP (AD 120) beats a /24 route from OSPF (AD 110).",
    "hardwarePhoto": {
      "title": "Cisco ISR 4331 Hardware Forwarding Engine",
      "src": "assets/hardware/cisco_isr_router.svg",
      "caption": "Hardware used: Multi-core forwarding plane executing longest prefix match routing lookups in under 1 microsecond."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "3. IP Connectivity",
    "id": "ccna_3_2_ospf",
    "title": "OSPFv2 Fundamentals (LSA, DR/BDR, Cost)",
    "badge": "CCNA 3.2",
    "labTemplate": "ospf_routing",
    "summary": "OSPF is a Link-State routing protocol using Dijkstra’s Shortest Path First (SPF) algorithm. Routers establish neighbor adjacencies, exchange Link-State Advertisements (LSAs), and elect a Designated Router (DR) on broadcast networks.",
    "analogy": "Air traffic control radar: Every router has a complete 360-degree radar map of every other router in the area. If a runway closes, all planes recalculate their flight path simultaneously.",
    "diagramSvg": "<svg viewBox=\"0 0 700 200\" class=\"study-svg\">\n      <ellipse cx=\"350\" cy=\"100\" rx=\"130\" ry=\"70\" fill=\"rgba(0, 243, 255, 0.1)\" stroke=\"#00f3ff\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"55\" fill=\"#00f3ff\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">OSPF AREA 0 (BACKBONE)</text>\n\n      <rect x=\"180\" y=\"80\" width=\"80\" height=\"40\" rx=\"6\" fill=\"#1e293b\" stroke=\"#10b981\"/>\n      <text x=\"220\" y=\"105\" fill=\"#10b981\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">ABR 1</text>\n\n      <rect x=\"440\" y=\"80\" width=\"80\" height=\"40\" rx=\"6\" fill=\"#1e293b\" stroke=\"#10b981\"/>\n      <text x=\"480\" y=\"105\" fill=\"#10b981\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">ABR 2</text>\n\n      <rect x=\"40\" y=\"80\" width=\"90\" height=\"40\" rx=\"6\" fill=\"#1e293b\" stroke=\"#f59e0b\"/>\n      <text x=\"85\" y=\"105\" fill=\"#f59e0b\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\">HQ Area 1</text>\n\n      <rect x=\"570\" y=\"80\" width=\"90\" height=\"40\" rx=\"6\" fill=\"#1e293b\" stroke=\"#f59e0b\"/>\n      <text x=\"615\" y=\"105\" fill=\"#f59e0b\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\">Branch Area 2</text>\n\n      <line x1=\"130\" y1=\"100\" x2=\"180\" y2=\"100\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n      <line x1=\"260\" y1=\"100\" x2=\"440\" y2=\"100\" stroke=\"#00f3ff\" stroke-width=\"3\"/>\n      <line x1=\"520\" y1=\"100\" x2=\"570\" y2=\"100\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n    </svg>",
    "example": {
      "scenario": "Configuring OSPFv2 between HQ and Branch across a 10Gbps fiber backbone and 1Gbps copper link:",
      "steps": [
        "1. Routers send Hello packets to multicast 224.0.0.5 every 10 seconds.",
        "2. Adjacency state machine transitions: Down -> Init -> 2-Way -> ExStart -> Exchange -> Loading -> Full.",
        "3. Cost formula = Reference Bandwidth / Interface Bandwidth.",
        "4. Setting 'auto-cost reference-bandwidth 100000' (100 Gbps):",
        "   - 10 Gbps Fiber link cost: 100,000 / 10,000 = Cost 10.",
        "   - 1 Gbps Copper link cost: 100,000 / 1,000 = Cost 100.",
        "5. OSPF automatically routes all user traffic across the faster 10Gbps fiber path!"
      ],
      "keyTakeaway": "Always adjust auto-cost reference-bandwidth on modern gigabit networks to avoid 1Gbps and 10Gbps having the exact same cost of 1."
    },
    "deepDive": "\n      <h4>OSPF Neighbor Requirements:</h4>\n      <ul>\n        <li>Matching Area ID</li>\n        <li>Matching Hello (10s) and Dead (40s) timers</li>\n        <li>Matching Subnet Mask on the link</li>\n        <li>Matching Authentication password (if enabled)</li>\n        <li>Unique Router IDs (RIDs)</li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco OSPF Multi-Area Configuration\nrouter ospf 1\n router-id 1.1.1.1\n auto-cost reference-bandwidth 100000\n network 10.0.0.0 0.0.0.255 area 0\n network 10.1.0.0 0.0.255.255 area 1",
    "examTip": "OSPF routers elect a DR and BDR on broadcast multi-access links (Ethernet) to prevent N*(N-1)/2 full mesh neighbor flooding.",
    "hardwarePhoto": {
      "title": "Cisco ISR 4331 OSPF Area Border Router (ABR)",
      "src": "assets/hardware/cisco_isr_router.svg",
      "caption": "Hardware used: Connects OSPF Area 0 Backbone to regional Area 1 & 2, recalculating Dijkstra SPF trees dynamically."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "3. IP Connectivity",
    "id": "ccna_3_3_fhrp",
    "title": "First Hop Redundancy Protocols (HSRP & VRRP)",
    "badge": "CCNA 3.3",
    "labTemplate": "fhrp_hsrp",
    "summary": "FHRP provides default gateway redundancy for client hosts. Two physical routers share a single virtual IP address and virtual MAC address. If the active gateway crashes, the standby router seamlessly takes over.",
    "analogy": "Co-pilots in an aircraft cockpit: Both have hands near the controls. The Captain flies the plane. If the Captain loses consciousness, the Co-pilot instantly takes over the flight controls without the passengers ever knowing.",
    "diagramSvg": "<svg viewBox=\"0 0 700 220\" class=\"study-svg\">\n      <!-- Active Router -->\n      <rect x=\"100\" y=\"30\" width=\"180\" height=\"70\" rx=\"8\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"190\" y=\"58\" fill=\"#10b981\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">R1 - ACTIVE (Pri: 110)</text>\n      <text x=\"190\" y=\"80\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Real IP: 192.168.1.1</text>\n\n      <!-- Standby Router -->\n      <rect x=\"420\" y=\"30\" width=\"180\" height=\"70\" rx=\"8\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"510\" y=\"58\" fill=\"#38bdf8\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">R2 - STANDBY (Pri: 100)</text>\n      <text x=\"510\" y=\"80\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Real IP: 192.168.1.2</text>\n\n      <!-- Shared Virtual Gateway -->\n      <rect x=\"250\" y=\"130\" width=\"200\" height=\"60\" rx=\"30\" fill=\"rgba(16, 185, 129, 0.15)\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"155\" fill=\"#34d399\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">SHARED VIRTUAL GATEWAY</text>\n      <text x=\"350\" y=\"175\" fill=\"#fff\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">VIP: 192.168.1.254</text>\n\n      <line x1=\"190\" y1=\"100\" x2=\"290\" y2=\"135\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <line x1=\"510\" y1=\"100\" x2=\"410\" y2=\"135\" stroke=\"#38bdf8\" stroke-width=\"2\" stroke-dasharray=\"4,4\"/>\n    </svg>",
    "example": {
      "scenario": "A backhoe cuts Router 1's power supply in the server room:",
      "steps": [
        "1. Host PCs on LAN have their Default Gateway configured to VIP 192.168.1.254.",
        "2. R1 (Active) normally sends HSRP Hello packets every 3 seconds to 224.0.0.2.",
        "3. R1 powers down. R2 (Standby) misses 3 Hellos (Hold timer = 10s).",
        "4. R2 transitions: Standby -> Speak -> Active.",
        "5. R2 broadcasts a Gratuitous ARP with Virtual MAC 0000.0c07.ac01.",
        "6. Switch updates its MAC table. All PCs continue sending internet traffic without dropping their active Zoom calls!"
      ],
      "keyTakeaway": "Client PCs never need reconfiguration because they target the shared Virtual IP, not the physical router IPs."
    },
    "deepDive": "\n      <h4>HSRP MAC Formats:</h4>\n      <ul>\n        <li>HSRP v1: <code>0000.0c07.acXX</code> (XX = hex group number)</li>\n        <li>HSRP v2: <code>0000.0c9f.fXXX</code> (XXX = hex group number)</li>\n        <li>VRRP: <code>0000.5e00.01XX</code></li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco HSRP v2 Gateway Configuration\ninterface GigabitEthernet0/1\n ip address 192.168.1.1 255.255.255.0\n standby version 2\n standby 1 ip 192.168.1.254\n standby 1 priority 110\n standby 1 preempt",
    "examTip": "Without \"standby 1 preempt\" configured, a higher-priority router that reboots will remain in Standby state and will NOT reclaim the Active role!",
    "hardwarePhoto": {
      "title": "Cisco ISR 4331 HSRP Active Gateway Router",
      "src": "assets/hardware/cisco_isr_router.svg",
      "caption": "Hardware used: Coordinates with Standby router to provide zero-downtime client failover for VIP 192.168.1.254."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "4. IP Services",
    "id": "ccna_4_1_nat",
    "title": "Network Address Translation (Static, Dynamic & PAT)",
    "badge": "CCNA 4.1",
    "labTemplate": "nat_pat",
    "summary": "NAT conserves public IPv4 addresses by translating private RFC 1918 addresses into public routable IPs. Port Address Translation (PAT / NAT Overload) maps thousands of private clients to a single public IP using unique Layer 4 port numbers.",
    "analogy": "An apartment building mailroom: Every resident has an apartment number (Private IP), but the entire building shares one street address (Public IP). The mailroom clerk uses apartment numbers (Port numbers) to deliver incoming mail to the correct resident.",
    "diagramSvg": "<svg viewBox=\"0 0 700 220\" class=\"study-svg\">\n      <!-- Inside Local PC -->\n      <rect x=\"30\" y=\"30\" width=\"160\" height=\"70\" rx=\"8\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"110\" y=\"58\" fill=\"#38bdf8\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">INSIDE LOCAL PC</text>\n      <text x=\"110\" y=\"80\" fill=\"#cbd5e1\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">192.168.1.50:52410</text>\n\n      <!-- NAT Router -->\n      <rect x=\"270\" y=\"25\" width=\"160\" height=\"160\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"55\" fill=\"#10b981\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">NAT / PAT ROUTER</text>\n      <text x=\"350\" y=\"85\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">TRANSLATION TABLE</text>\n      <rect x=\"285\" y=\"95\" width=\"130\" height=\"75\" rx=\"4\" fill=\"#1e293b\"/>\n      <text x=\"295\" y=\"115\" fill=\"#38bdf8\" font-size=\"9\" font-family=\"monospace\">In: 192.168.1.50:52410</text>\n      <text x=\"295\" y=\"135\" fill=\"#10b981\" font-size=\"9\" font-family=\"monospace\">Out: 203.0.113.2:61001</text>\n      <text x=\"295\" y=\"155\" fill=\"#f59e0b\" font-size=\"9\" font-family=\"monospace\">Dst: 198.51.100.80:443</text>\n\n      <!-- Outside Cloud Server -->\n      <rect x=\"510\" y=\"30\" width=\"160\" height=\"70\" rx=\"8\" fill=\"#1e293b\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n      <text x=\"590\" y=\"58\" fill=\"#f59e0b\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">OUTSIDE GLOBAL</text>\n      <text x=\"590\" y=\"80\" fill=\"#cbd5e1\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">198.51.100.80:443</text>\n\n      <line x1=\"190\" y1=\"65\" x2=\"270\" y2=\"65\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <line x1=\"430\" y1=\"65\" x2=\"510\" y2=\"65\" stroke=\"#10b981\" stroke-width=\"2\"/>\n    </svg>",
    "example": {
      "scenario": "Two employees in the office simultaneously open https://cisco.com:",
      "steps": [
        "1. Employee 1 PC (192.168.1.50:52410) sends a TCP SYN packet to Cisco Server (198.51.100.80:443).",
        "2. NAT router translates Source IP to its public interface IP 203.0.113.2 and translates Source Port to 61001.",
        "3. Employee 2 PC (192.168.1.51:52410) ALSO sends a packet to the exact same Cisco server on the exact same local port!",
        "4. NAT router translates Employee 2's packet to 203.0.113.2:61002.",
        "5. Cisco server replies to ports 61001 and 61002. The router looks up its NAT table and forwards each reply to the correct employee!"
      ],
      "keyTakeaway": "PAT enables up to ~65,000 simultaneous connections through a single public IPv4 address using port multiplexing."
    },
    "deepDive": "\n      <h4>NAT Terminology:</h4>\n      <ul>\n        <li><strong>Inside Local:</strong> Private IP on the internal LAN (e.g. 192.168.1.50).</li>\n        <li><strong>Inside Global:</strong> Public IP representing the internal host to the world (e.g. 203.0.113.2).</li>\n        <li><strong>Outside Global:</strong> Real public IP of the external destination (e.g. 198.51.100.80).</li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco PAT (NAT Overload) Configuration\nip access-list standard NAT_LAN\n permit 192.168.1.0 0.0.0.255\n\ninterface GigabitEthernet0/0\n ip nat inside\ninterface GigabitEthernet0/1\n ip nat outside\n\nip nat inside source list NAT_LAN interface GigabitEthernet0/1 overload",
    "examTip": "PAT is configured on Cisco routers with the keyword \"overload\" at the end of the \"ip nat inside source list\" command.",
    "hardwarePhoto": {
      "title": "Cisco ISR 4331 NAT / PAT Overload Edge Gateway",
      "src": "assets/hardware/cisco_isr_router.svg",
      "caption": "Hardware used: High-capacity translation state table mapping 5,000 internal private hosts to 1 public IP."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "4. IP Services",
    "id": "ccna_4_2_dhcp_dns",
    "title": "DHCP DORA Process, DHCP Relay & DNS",
    "badge": "CCNA 4.2",
    "labTemplate": "dhcp_dns",
    "summary": "DHCP automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to hosts using the 4-step DORA handshake. DHCP Relay forwards client UDP broadcasts across routers to a centralized DHCP server.",
    "analogy": "Renting a hotel room: You ask reception for a room (Discover), the clerk offers you Room 204 (Offer), you agree to take it (Request), and the clerk hands you the keycard (Acknowledge).",
    "diagramSvg": "<svg viewBox=\"0 0 700 220\" class=\"study-svg\">\n      <rect x=\"50\" y=\"20\" width=\"120\" height=\"50\" rx=\"6\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"110\" y=\"50\" fill=\"#38bdf8\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">CLIENT PC</text>\n\n      <rect x=\"530\" y=\"20\" width=\"120\" height=\"50\" rx=\"6\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"590\" y=\"50\" fill=\"#10b981\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">DHCP SERVER</text>\n\n      <!-- DORA Handshake Lines -->\n      <line x1=\"170\" y1=\"90\" x2=\"530\" y2=\"90\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"85\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"middle\">1. DISCOVER (Broadcast: 255.255.255.255 UDP 68->67)</text>\n\n      <line x1=\"530\" y1=\"120\" x2=\"170\" y2=\"120\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"115\" fill=\"#10b981\" font-size=\"11\" text-anchor=\"middle\">2. OFFER (Server proposes 192.168.1.100 + Mask + GW)</text>\n\n      <line x1=\"170\" y1=\"150\" x2=\"530\" y2=\"150\" stroke=\"#00f3ff\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"145\" fill=\"#00f3ff\" font-size=\"11\" text-anchor=\"middle\">3. REQUEST (Client accepts lease)</text>\n\n      <line x1=\"530\" y1=\"180\" x2=\"170\" y2=\"180\" stroke=\"#a855f7\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"175\" fill=\"#a855f7\" font-size=\"11\" text-anchor=\"middle\">4. ACKNOWLEDGE (Server confirms binding)</text>\n    </svg>",
    "example": {
      "scenario": "A remote branch PC needs an IP address from a centralized corporate DHCP server located across a WAN router:",
      "steps": [
        "1. Branch PC boots up and broadcasts a DHCP Discover (0.0.0.0:68 -> 255.255.255.255:67).",
        "2. Routers block broadcasts by default! The packet would die at the local branch router interface.",
        "3. With 'ip helper-address 10.0.0.50' configured on the branch router interface, the router intercepts the UDP 67 broadcast.",
        "4. Router converts the broadcast into a unicast packet with Destination IP 10.0.0.50 and forwards it over the WAN.",
        "5. Central DHCP server receives the unicast, allocates an IP from the branch scope, and replies back via the router!"
      ],
      "keyTakeaway": "The 'ip helper-address' command turns DHCP client broadcasts into unicast packets routed to the centralized server."
    },
    "deepDive": "\n      <h4>The 4-Step DHCP DORA Process:</h4>\n      <ol>\n        <li><strong>Discover:</strong> Client broadcasts looking for any available DHCP server.</li>\n        <li><strong>Offer:</strong> Server unicasts/broadcasts proposed IP and lease terms.</li>\n        <li><strong>Request:</strong> Client formally requests the proposed IP.</li>\n        <li><strong>Acknowledge:</strong> Server records MAC-to-IP binding in its lease table.</li>\n      </ol>\n    ",
    "cliSnippet": "! Cisco DHCP Server & Relay Helper Configuration\nip dhcp pool BRANCH_OFFICE\n network 192.168.1.0 255.255.255.0\n default-router 192.168.1.1\n dns-server 8.8.8.8 1.1.1.1\n lease 7\n\n! On remote branch interface:\ninterface GigabitEthernet0/1\n ip helper-address 10.0.0.50",
    "examTip": "The \"ip helper-address\" command forwards 8 UDP services by default: DHCP (67/68), DNS (53), TFTP (69), Time (37), TACACS (49), and NetBIOS (137/138).",
    "hardwarePhoto": {
      "title": "42U Enterprise Server Cabinet (DHCP Pools & BIND9 DNS)",
      "src": "assets/hardware/server_datacenter_rack.svg",
      "caption": "Hardware used: Enterprise compute nodes running central DHCP leasing scopes and recursive internal DNS resolvers."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "4. IP Services",
    "id": "ccna_4_3_qos",
    "title": "Quality of Service (QoS) & Traffic Policing",
    "badge": "CCNA 4.3",
    "labTemplate": "campusWifi",
    "summary": "QoS manages network congestion by classifying, marking, and prioritizing latency-sensitive traffic (VoIP voice and interactive video) over bandwidth-hungry elastic bulk data (file downloads, backups).",
    "analogy": "Airport security lanes: First Class and flight crew have a dedicated TSA priority lane with zero waiting (Voice queue). Regular economy passengers wait in the normal line (Best Effort queue).",
    "diagramSvg": "<svg viewBox=\"0 0 700 200\" class=\"study-svg\">\n      <rect x=\"30\" y=\"30\" width=\"150\" height=\"140\" rx=\"8\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"105\" y=\"60\" fill=\"#38bdf8\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">CLASSIFICATION</text>\n      <text x=\"105\" y=\"90\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\">VoIP Audio (EF / 46)</text>\n      <text x=\"105\" y=\"120\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"middle\">Video Stream (AF41)</text>\n      <text x=\"105\" y=\"150\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">Web / Bulk (BE / 0)</text>\n\n      <rect x=\"250\" y=\"30\" width=\"180\" height=\"140\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"340\" y=\"60\" fill=\"#10b981\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">PRIORITY QUEUING</text>\n      <rect x=\"270\" y=\"75\" width=\"140\" height=\"25\" rx=\"4\" fill=\"#7f1d1d\"/>\n      <text x=\"340\" y=\"92\" fill=\"#fecaca\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\">Queue 1: Voice (PQ)</text>\n      <rect x=\"270\" y=\"105\" width=\"140\" height=\"25\" rx=\"4\" fill=\"#78350f\"/>\n      <text x=\"340\" y=\"122\" fill=\"#fde68a\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\">Queue 2: Video (CBWFQ)</text>\n      <rect x=\"270\" y=\"135\" width=\"140\" height=\"25\" rx=\"4\" fill=\"#1e293b\"/>\n      <text x=\"340\" y=\"152\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Queue 3: Web / Data</text>\n\n      <rect x=\"500\" y=\"30\" width=\"160\" height=\"140\" rx=\"8\" fill=\"#1e293b\" stroke=\"#a855f7\" stroke-width=\"2\"/>\n      <text x=\"580\" y=\"60\" fill=\"#a855f7\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">OUTBOUND INTERFACE</text>\n      <text x=\"580\" y=\"95\" fill=\"#10b981\" font-size=\"11\" text-anchor=\"middle\">Zero Voice Jitter</text>\n      <text x=\"580\" y=\"125\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Line-Rate Transmission</text>\n    </svg>",
    "example": {
      "scenario": "During an all-hands CEO live video broadcast, an engineer initiates a 50GB backup download:",
      "steps": [
        "1. Without QoS: The 50GB backup saturates the 100Mbps WAN link to 100% capacity.",
        "2. CEO's video stutters, drops frames, and the audio goes robotic due to packet bufferbloat.",
        "3. With QoS Enabled: The router classifies the CEO's stream as DSCP EF (Expedited Forwarding).",
        "4. The router guarantees 30% dedicated bandwidth to Queue 1 and transmits voice/video frames first on every clock cycle.",
        "5. The 50GB backup download automatically slows down to fill remaining bandwidth without affecting the CEO's broadcast!"
      ],
      "keyTakeaway": "QoS doesn't create extra bandwidth—it manages congestion so vital traffic never drops."
    },
    "deepDive": "\n      <h4>Cisco QoS Traffic Parameters:</h4>\n      <ul>\n        <li><strong>VoIP Audio Requirements:</strong> Latency &lt; 150ms, Jitter &lt; 30ms, Packet Loss &lt; 1%.</li>\n        <li><strong>DSCP (Differentiated Services Code Point):</strong> 6-bit field in IP header allowing 64 distinct traffic classes.</li>\n        <li><strong>Expedited Forwarding (EF - Value 46):</strong> Highest priority queuing for interactive voice.</li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco MQC (Modular QoS CLI) Configuration\nclass-map match-any VOICE_TRAFFIC\n match ip dscp ef\n\npolicy-map ENTERPRISE_QOS\n class VOICE_TRAFFIC\n  priority 5000  ! 5 Mbps strict priority queue\n class class-default\n  fair-queue",
    "examTip": "Classification and marking should occur as close to the source as possible (e.g. at the IP Phone or Access Switch) inside the Trust Boundary!",
    "hardwarePhoto": {
      "title": "Cisco Catalyst 9300 Hardware Ingress/Egress QoS Buffers",
      "src": "assets/hardware/cisco_catalyst_switch.svg",
      "caption": "Hardware used: Hardware priority queues preventing packet jitter and stutter on voice and video conference calls."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "5. Security Fundamentals",
    "id": "ccna_5_1_acls",
    "title": "Access Control Lists (Standard & Extended)",
    "badge": "CCNA 5.1",
    "labTemplate": "corporate",
    "summary": "ACLs filter network traffic based on packet headers. Standard ACLs check Source IP only. Extended ACLs check Source IP, Destination IP, Protocol (TCP/UDP/ICMP), and Layer 4 Port numbers.",
    "analogy": "Building security guards: A Standard ACL guard only looks at who is entering (Source ID). An Extended ACL guard checks who you are, which specific executive office you are visiting, and whether you have an appointment letter for Room 403.",
    "diagramSvg": "<svg viewBox=\"0 0 700 200\" class=\"study-svg\">\n      <rect x=\"30\" y=\"30\" width=\"300\" height=\"140\" rx=\"8\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"180\" y=\"60\" fill=\"#38bdf8\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">STANDARD ACL (1-99, 1300-1999)</text>\n      <text x=\"50\" y=\"90\" fill=\"#cbd5e1\" font-size=\"11\">• Inspects: Source IP Address ONLY</text>\n      <text x=\"50\" y=\"115\" fill=\"#cbd5e1\" font-size=\"11\">• Cannot filter by port number (80, 443)</text>\n      <text x=\"50\" y=\"140\" fill=\"#10b981\" font-size=\"11\" font-weight=\"bold\">• Rule: Place CLOSEST TO DESTINATION</text>\n\n      <rect x=\"370\" y=\"30\" width=\"300\" height=\"140\" rx=\"8\" fill=\"#1e293b\" stroke=\"#a855f7\" stroke-width=\"2\"/>\n      <text x=\"520\" y=\"60\" fill=\"#a855f7\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">EXTENDED ACL (100-199, 2000-2699)</text>\n      <text x=\"390\" y=\"90\" fill=\"#cbd5e1\" font-size=\"11\">• Inspects: Source IP, Dst IP, Protocol, Port</text>\n      <text x=\"390\" y=\"115\" fill=\"#cbd5e1\" font-size=\"11\">• Precise filtering (HTTP, SSH, Ping)</text>\n      <text x=\"390\" y=\"140\" fill=\"#10b981\" font-size=\"11\" font-weight=\"bold\">• Rule: Place CLOSEST TO SOURCE</text>\n    </svg>",
    "example": {
      "scenario": "Preventing Marketing PCs (192.168.30.0/24) from accessing the Finance Database (192.168.20.100) while still allowing web browsing:",
      "steps": [
        "1. Create Extended ACL: 'access-list 101 deny tcp 192.168.30.0 0.0.0.255 host 192.168.20.100 eq 3306'. (Blocks MySQL)",
        "2. Add permit rule: 'access-list 101 permit ip 192.168.30.0 0.0.0.255 any'. (Permits everything else)",
        "3. Remember: Every Cisco ACL has an invisible 'deny ip any any' at the bottom!",
        "4. Apply on the router's Marketing interface: 'ip access-group 101 in'.",
        "5. Result: Marketing users can browse Google, but any connection to the Finance database is instantly rejected with ICMP Admin Prohibited."
      ],
      "keyTakeaway": "Place Extended ACLs as close to the source as possible to drop unauthorized traffic before it wastes WAN bandwidth."
    },
    "deepDive": "\n      <h4>Wildcard Mask Calculation:</h4>\n      <p>Subtract the subnet mask from <code>255.255.255.255</code>.</p>\n      <p>Example: Subnet mask <code>255.255.255.0 (/24)</code> &rarr; Wildcard = <code>0.0.0.255</code>.</p>\n      <p>Example: Single host (/32) &rarr; Wildcard = <code>0.0.0.0</code> (or use keyword <code>host</code>).</p>\n    ",
    "cliSnippet": "! Cisco Named Extended ACL\nip access-list extended BLOCK_FINANCE\n deny tcp 192.168.30.0 0.0.0.255 host 192.168.20.100 eq 3306\n permit ip any any\n\ninterface GigabitEthernet0/1\n ip access-group BLOCK_FINANCE in",
    "examTip": "Every Cisco ACL ends with an invisible \"deny any\" statement. If you do not include at least one \"permit\" statement, all traffic will be dropped!",
    "hardwarePhoto": {
      "title": "Next-Generation Enterprise Threat Defense Firewall",
      "src": "assets/hardware/enterprise_firewall.svg",
      "caption": "Hardware used: Stateful firewall appliance enforcing Layer 3 to Layer 7 Access Control Lists at 10 Gbps line-rate."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "5. Security Fundamentals",
    "id": "ccna_5_2_layer2_security",
    "title": "Layer 2 Security: Port Security, DHCP Snooping & DAI",
    "badge": "CCNA 5.2",
    "labTemplate": "corporate",
    "summary": "Crucial Layer 2 defenses that protect access switches from MAC flooding attacks, rogue DHCP servers, and ARP spoofing man-in-the-middle attacks.",
    "analogy": "Security badges and sign-in sheets: Port Security ensures only authorized employee laptop badges plug into cubicle desks. DHCP Snooping ensures only the official building management gives out room keys.",
    "diagramSvg": "<svg viewBox=\"0 0 700 200\" class=\"study-svg\">\n      <rect x=\"30\" y=\"30\" width=\"200\" height=\"140\" rx=\"8\" fill=\"#1e293b\" stroke=\"#ef4444\" stroke-width=\"2\"/>\n      <text x=\"130\" y=\"60\" fill=\"#ef4444\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">PORT SECURITY</text>\n      <text x=\"45\" y=\"85\" fill=\"#cbd5e1\" font-size=\"10\">• Limit MACs per port</text>\n      <text x=\"45\" y=\"105\" fill=\"#cbd5e1\" font-size=\"10\">• Sticky MAC learning</text>\n      <text x=\"45\" y=\"125\" fill=\"#cbd5e1\" font-size=\"10\">• Violation: Shutdown</text>\n      <text x=\"45\" y=\"145\" fill=\"#cbd5e1\" font-size=\"10\">• Stops MAC Flooding</text>\n\n      <rect x=\"250\" y=\"30\" width=\"200\" height=\"140\" rx=\"8\" fill=\"#1e293b\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"60\" fill=\"#f59e0b\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">DHCP SNOOPING</text>\n      <text x=\"265\" y=\"85\" fill=\"#cbd5e1\" font-size=\"10\">• Trusted vs Untrusted</text>\n      <text x=\"265\" y=\"105\" fill=\"#cbd5e1\" font-size=\"10\">• Drops rogue DHCP server</text>\n      <text x=\"265\" y=\"125\" fill=\"#cbd5e1\" font-size=\"10\">• Builds Snooping DB</text>\n      <text x=\"265\" y=\"145\" fill=\"#cbd5e1\" font-size=\"10\">• Stops starvation attacks</text>\n\n      <rect x=\"470\" y=\"30\" width=\"200\" height=\"140\" rx=\"8\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"570\" y=\"60\" fill=\"#10b981\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">DYNAMIC ARP INSP.</text>\n      <text x=\"485\" y=\"85\" fill=\"#cbd5e1\" font-size=\"10\">• Validates ARP packets</text>\n      <text x=\"485\" y=\"105\" fill=\"#cbd5e1\" font-size=\"10\">• Checks Snooping DB</text>\n      <text x=\"485\" y=\"125\" fill=\"#cbd5e1\" font-size=\"10\">• Drops fake Gratuitous ARP</text>\n      <text x=\"485\" y=\"145\" fill=\"#cbd5e1\" font-size=\"10\">• Stops Man-in-Middle</text>\n    </svg>",
    "example": {
      "scenario": "An intruder brings an unauthorized laptop into a conference room and unplugs the corporate printer to connect:",
      "steps": [
        "1. Switch port Gi0/5 is configured with Port Security (max 1 MAC, violation shutdown, sticky).",
        "2. The printer's MAC (00:11:22:33:44:55) is sticky-learned in the running-config.",
        "3. Intruder plugs in their Kali Linux laptop (MAC AA:BB:CC:DD:EE:FF).",
        "4. Switch immediately detects a second unauthorized MAC on the port.",
        "5. Port transitions to 'err-disabled' state: the link LED turns amber, the port shuts down, and a SNMP trap alert fires to the Security Operations Center (SOC)!"
      ],
      "keyTakeaway": "Port Security stops unauthorized rogue physical devices from ever gaining an IP address on corporate LANs."
    },
    "deepDive": "\n      <h4>Port Security Violation Modes:</h4>\n      <ul>\n        <li><strong>Shutdown (Default):</strong> Error-disables port immediately; turns off link LED; generates SNMP trap. Requires manual <code>shutdown / no shutdown</code> to recover.</li>\n        <li><strong>Restrict:</strong> Drops unauthorized frames; increments violation counter; generates Syslog and SNMP alert. Port stays active for authorized device.</li>\n        <li><strong>Protect:</strong> Silently drops unauthorized frames with zero logging.</li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco Layer 2 Security Hardening\ninterface GigabitEthernet0/5\n switchport mode access\n switchport port-security\n switchport port-security maximum 1\n switchport port-security mac-address sticky\n switchport port-security violation shutdown\n\n! Enable DHCP Snooping & DAI\nip dhcp snooping\nip dhcp snooping vlan 10\nip arp inspection vlan 10",
    "examTip": "Sticky MAC addresses dynamically learn the connected device’s MAC address and write it directly into running-config so it survives reboots!",
    "hardwarePhoto": {
      "title": "Cisco Catalyst 9300 Port Security & DAI Switch",
      "src": "assets/hardware/cisco_catalyst_switch.svg",
      "caption": "Hardware used: Drops unauthorized MAC addresses, monitors DHCP snooping table, and stops ARP spoofing attacks."
    }
  },
  {
    "track": "CCNA 200-301",
    "module": "6. Automation & Programmability",
    "id": "ccna_6_1_automation",
    "title": "Network Automation, REST APIs, JSON & Cisco DNA Center",
    "badge": "CCNA 6.1",
    "labTemplate": "cloud_hybrid",
    "summary": "The shift from manual CLI typing on individual routers to centralized Software-Defined Networking (SDN) controllers using RESTful APIs, JSON data serialization, and Python automation.",
    "analogy": "Replacing 1,000 independent pilot-controlled airplanes with a centralized automated air traffic control supercomputer that configures all routes via software in seconds.",
    "diagramSvg": "<svg viewBox=\"0 0 700 210\" class=\"study-svg\">\n      <rect x=\"50\" y=\"20\" width=\"600\" height=\"40\" rx=\"6\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"45\" fill=\"#38bdf8\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">MANAGEMENT APPLICATIONS / SCRIPTS (Python, Postman, Ansible)</text>\n\n      <line x1=\"350\" y1=\"60\" x2=\"350\" y2=\"85\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n      <text x=\"360\" y=\"75\" fill=\"#f59e0b\" font-size=\"10\">Northbound REST API (HTTP GET/POST JSON)</text>\n\n      <rect x=\"180\" y=\"85\" width=\"340\" height=\"50\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"115\" fill=\"#10b981\" font-size=\"14\" font-weight=\"bold\" text-anchor=\"middle\">SDN CONTROLLER (Cisco DNA Center)</text>\n\n      <line x1=\"350\" y1=\"135\" x2=\"350\" y2=\"160\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n      <text x=\"360\" y=\"150\" fill=\"#f59e0b\" font-size=\"10\">Southbound APIs (NETCONF, RESTCONF, YANG)</text>\n\n      <rect x=\"50\" y=\"160\" width=\"600\" height=\"40\" rx=\"6\" fill=\"#1e293b\" stroke=\"#a855f7\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"185\" fill=\"#a855f7\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">PHYSICAL FABRIC (Routers, Catalyst 9000 Switches, APs)</text>\n    </svg>",
    "example": {
      "scenario": "Company needs to roll out a security VLAN change across 400 branch switches simultaneously:",
      "steps": [
        "1. Traditional Manual CLI: Network engineer SSHs into each switch one-by-one, typing 'vlan 99', taking 3 days.",
        "2. SDN Automation Approach: Engineer writes a 15-line Python script using Python 'requests'.",
        "3. Script sends a single HTTPS POST request with JSON payload to Cisco DNA Center REST API.",
        "4. DNA Center validates syntax, performs compliance checks, and provisions all 400 switches via NETCONF in 3 seconds!",
        "5. Zero typos, zero human error, and full audit logs generated automatically."
      ],
      "keyTakeaway": "Northbound REST APIs connect engineers and scripts to controllers; Southbound APIs connect controllers to physical hardware."
    },
    "deepDive": "\n      <h4>REST API HTTP Verbs:</h4>\n      <ul>\n        <li><code>GET</code>: Retrieve resource data (read status)</li>\n        <li><code>POST</code>: Create a new resource</li>\n        <li><code>PUT</code>: Update or replace existing configuration</li>\n        <li><code>DELETE</code>: Remove a resource</li>\n      </ul>\n    ",
    "cliSnippet": "# Python REST API GET Request to Cisco DNA Center\nimport requests\nimport json\n\nurl = \"https://sandboxdnac.cisco.com/dna/intent/api/v1/network-device\"\nheaders = {\"X-Auth-Token\": \"auth_token_here\", \"Content-Type\": \"application/json\"}\n\nresponse = requests.get(url, headers=headers, verify=False)\nprint(json.dumps(response.json(), indent=2))",
    "examTip": "Southbound APIs (OpenFlow, NETCONF, RESTCONF) connect the controller to switches. Northbound APIs (REST APIs) connect the controller to apps.",
    "hardwarePhoto": {
      "title": "42U Compute Rack Hosting Cisco DNA Center Appliance",
      "src": "assets/hardware/server_datacenter_rack.svg",
      "caption": "Hardware used: Centralized SDN controller orchestrating automated provisioning across hundreds of switches."
    }
  },
  {
    "track": "CCNP ENCOR 350-401",
    "module": "1. Architecture & Virtualization",
    "id": "encor_1_sdwan_vxlan",
    "title": "Cisco SD-WAN, SDA & VXLAN Overlay Fabric",
    "badge": "CCNP 1.1",
    "labTemplate": "sdwan",
    "summary": "Software-Defined Access (SDA) and SD-WAN decouple network overlays from physical underlay transport. VXLAN encapsulates Layer 2 frames in Layer 4 UDP packets (port 4789) across any IP network.",
    "analogy": "Shipping a sports car inside a standard cargo container: The container ship (underlay IP network) only cares about moving the container. Inside is the car (Layer 2 VXLAN frame), completely protected.",
    "diagramSvg": "<svg viewBox=\"0 0 700 200\" class=\"study-svg\">\n      <rect x=\"30\" y=\"30\" width=\"140\" height=\"60\" rx=\"6\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"100\" y=\"55\" fill=\"#38bdf8\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">vManage</text>\n      <text x=\"100\" y=\"75\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Management Plane</text>\n\n      <rect x=\"200\" y=\"30\" width=\"140\" height=\"60\" rx=\"6\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"270\" y=\"55\" fill=\"#10b981\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">vSmart</text>\n      <text x=\"270\" y=\"75\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Control Plane (OMP)</text>\n\n      <rect x=\"370\" y=\"30\" width=\"140\" height=\"60\" rx=\"6\" fill=\"#1e293b\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n      <text x=\"440\" y=\"55\" fill=\"#f59e0b\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">vBond</text>\n      <text x=\"440\" y=\"75\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Orchestration Plane</text>\n\n      <rect x=\"540\" y=\"30\" width=\"140\" height=\"60\" rx=\"6\" fill=\"#1e293b\" stroke=\"#a855f7\" stroke-width=\"2\"/>\n      <text x=\"610\" y=\"55\" fill=\"#a855f7\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">vEdge / cEdge</text>\n      <text x=\"610\" y=\"75\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Data Plane (IPsec)</text>\n\n      <!-- VXLAN Packet Breakdown -->\n      <rect x=\"30\" y=\"115\" width=\"650\" height=\"65\" rx=\"6\" fill=\"#0f172a\" stroke=\"#00f3ff\"/>\n      <text x=\"355\" y=\"138\" fill=\"#00f3ff\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">VXLAN ENCAPSULATED PACKET FORMAT (UDP PORT 4789)</text>\n      <text x=\"355\" y=\"162\" fill=\"#cbd5e1\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">[Outer IP: Router Underlay] + [UDP: 4789] + [VXLAN Hdr: 24-bit VNI] + [Inner L2 Ethernet Frame: VM/Host]</text>\n    </svg>",
    "example": {
      "scenario": "Connecting two data centers across the country with a single Layer 2 broadcast domain:",
      "steps": [
        "1. VM1 in Dallas on VLAN 10 (192.168.10.50) needs to talk to VM2 in New York on VLAN 10 without routing.",
        "2. Traditional Layer 2 switching cannot cross public Internet routers.",
        "3. VXLAN encapsulates the Layer 2 Ethernet frame inside a standard Layer 4 UDP packet (Port 4789) with VNI 10010.",
        "4. Standard Internet underlay routers forward the UDP packet normally.",
        "5. New York VTEP decapsulates the UDP packet and delivers the original Layer 2 frame to VM2 seamlessly!"
      ],
      "keyTakeaway": "VXLAN expands the 4,096 VLAN limit to 16 million virtual segments (24-bit VNI) over standard IP routed networks."
    },
    "deepDive": "\n      <h4>Cisco SD-WAN Architecture Planes:</h4>\n      <ul>\n        <li><strong>vManage:</strong> Single pane of glass GUI.</li>\n        <li><strong>vSmart:</strong> Distributes routing policies and OMP routes.</li>\n        <li><strong>vBond:</strong> Authenticates edge routers joining the fabric.</li>\n        <li><strong>vEdge/cEdge:</strong> Forwards encrypted IPsec data packets.</li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco SD-WAN Control Verification\nshow sdwan control connections\nshow sdwan bfd sessions\nshow sdwan policy from-vsmart",
    "examTip": "VXLAN uses UDP port 4789. The 24-bit VNI identifier supports up to 16,777,216 distinct virtual network overlays.",
    "hardwarePhoto": {
      "title": "42U Cloud Edge Data Center Cabinet",
      "src": "assets/hardware/server_datacenter_rack.svg",
      "caption": "Hardware used: Top-of-rack 100G spine/leaf switches encapsulating VXLAN packets (UDP 4789) across SD-WAN overlays."
    }
  },
  {
    "track": "CCNP ENCOR 350-401",
    "module": "2. Infrastructure Routing",
    "id": "encor_2_bgp_advanced",
    "title": "BGP Path Attributes & Route Selection",
    "badge": "CCNP 2.1",
    "labTemplate": "bgp_mpls",
    "summary": "Border Gateway Protocol (BGPv4) is the routing protocol of the global Internet. BGP uses autonomous systems (AS) and an extensive list of Path Attributes (PA) to choose the best path.",
    "analogy": "The United Nations of networking: Instead of raw speed or hop counts, BGP routes traffic based on political agreements, business relationships, and international treaties between telco providers.",
    "diagramSvg": "<svg viewBox=\"0 0 700 200\" class=\"study-svg\">\n      <rect x=\"30\" y=\"20\" width=\"640\" height=\"160\" rx=\"8\" fill=\"#1e293b\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"45\" fill=\"#f59e0b\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">BGP BEST PATH SELECTION ALGORITHM (N WLLA OMNI)</text>\n      \n      <text x=\"60\" y=\"75\" fill=\"#10b981\" font-size=\"11\" font-weight=\"bold\">1. Next-Hop Reachable?</text>\n      <text x=\"60\" y=\"95\" fill=\"#cbd5e1\" font-size=\"11\">2. Highest <strong style=\"color:#00f3ff\">Weight</strong> (Cisco Local, default 0 or 32768)</text>\n      <text x=\"60\" y=\"115\" fill=\"#cbd5e1\" font-size=\"11\">3. Highest <strong style=\"color:#00f3ff\">Local Preference</strong> (default 100)</text>\n      <text x=\"60\" y=\"135\" fill=\"#cbd5e1\" font-size=\"11\">4. Prefer Locally Originated (network or aggregate)</text>\n      <text x=\"60\" y=\"155\" fill=\"#cbd5e1\" font-size=\"11\">5. Shortest <strong style=\"color:#00f3ff\">AS_Path</strong> (fewer AS hops)</text>\n\n      <text x=\"380\" y=\"75\" fill=\"#cbd5e1\" font-size=\"11\">6. Lowest Origin (IGP &lt; EGP &lt; Incomplete)</text>\n      <text x=\"380\" y=\"95\" fill=\"#cbd5e1\" font-size=\"11\">7. Lowest MED (Multi-Exit Discriminator)</text>\n      <text x=\"380\" y=\"115\" fill=\"#cbd5e1\" font-size=\"11\">8. Prefer eBGP over iBGP</text>\n      <text x=\"380\" y=\"135\" fill=\"#cbd5e1\" font-size=\"11\">9. Lowest IGP metric to Next-Hop</text>\n      <text x=\"380\" y=\"155\" fill=\"#cbd5e1\" font-size=\"11\">10. Lowest BGP Router ID</text>\n    </svg>",
    "example": {
      "scenario": "An enterprise has two ISP links (ISP 1: 100Mbps cheap link, ISP 2: 1Gbps fiber link) and wants all outbound web traffic to prefer ISP 2:",
      "steps": [
        "1. By default, both routes from ISP 1 and ISP 2 have Local Preference 100.",
        "2. Engineer creates a route-map on Edge Router 2 (connected to ISP 2) setting 'set local-preference 200'.",
        "3. Local Preference 200 is advertised to all internal iBGP routers across the company.",
        "4. Since 200 > 100, Step 3 of BGP selection algorithm picks ISP 2 for all outbound internet traffic!",
        "5. If ISP 2 fiber is cut, traffic automatically falls back to ISP 1 (Local Pref 100)."
      ],
      "keyTakeaway": "Local Preference controls outbound egress traffic across an AS; AS-Path Prepending controls inbound ingress traffic."
    },
    "deepDive": "\n      <h4>BGP Path Attributes:</h4>\n      <ul>\n        <li><strong>Well-Known Mandatory:</strong> AS_Path, Next_Hop, Origin.</li>\n        <li><strong>Well-Known Discretionary:</strong> Local_Preference, Atomic_Aggregate.</li>\n        <li><strong>Optional Transitive:</strong> Community, Aggregator.</li>\n        <li><strong>Optional Non-Transitive:</strong> MED (Multi-Exit Discriminator).</li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco BGP Configuration with Local Preference\nrouter bgp 65001\n neighbor 203.0.113.1 remote-as 65100\n neighbor 203.0.113.1 route-map PREFER_HIGH in\n\nroute-map PREFER_HIGH permit 10\n set local-preference 200",
    "examTip": "Weight is strictly LOCAL to the router (never sent to peers). Local Preference is advertised to all peers inside the same AS.",
    "hardwarePhoto": {
      "title": "Cisco ASR 1000 Service Provider Core Router",
      "src": "assets/hardware/cisco_isr_router.svg",
      "caption": "Hardware used: Enterprise edge router holding full BGP routing tables (>950,000 routes) and BGP path attributes."
    }
  },
  {
    "track": "CCNP ENCOR 350-401",
    "module": "3. Wireless Architecture",
    "id": "encor_3_wlc_capwap",
    "title": "Wireless LAN Controller (WLC) & CAPWAP Architecture",
    "badge": "CCNP 3.1",
    "labTemplate": "wlc_capwap",
    "summary": "Centralized Cisco Catalyst 9800 WLC architecture uses Control and Provisioning of Wireless Access Points (CAPWAP) tunnels to separate real-time RF functions (AP) from policy, roaming, and encryption (WLC).",
    "analogy": "Air traffic control radar towers: The towers on the field (Lightweight APs) detect planes and signal beacons, but the central air traffic tower (WLC) assigns gate arrivals, frequencies, and passenger tickets.",
    "diagramSvg": "<svg viewBox=\"0 0 700 200\" class=\"study-svg\">\n      <rect x=\"250\" y=\"20\" width=\"200\" height=\"60\" rx=\"8\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"45\" fill=\"#10b981\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">CATALYST 9800 WLC</text>\n      <text x=\"350\" y=\"65\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Central Brain (802.1X, Roaming, QoS)</text>\n\n      <rect x=\"80\" y=\"125\" width=\"160\" height=\"55\" rx=\"6\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"160\" y=\"150\" fill=\"#38bdf8\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">LAP-CAMPUS-101</text>\n      <text x=\"160\" y=\"168\" fill=\"#cbd5e1\" font-size=\"9\" text-anchor=\"middle\">Local Mode AP</text>\n\n      <rect x=\"460\" y=\"125\" width=\"160\" height=\"55\" rx=\"6\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"540\" y=\"150\" fill=\"#38bdf8\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">LAP-BRANCH-102</text>\n      <text x=\"540\" y=\"168\" fill=\"#cbd5e1\" font-size=\"9\" text-anchor=\"middle\">FlexConnect Mode AP</text>\n\n      <!-- CAPWAP Tunnels -->\n      <line x1=\"280\" y1=\"80\" x2=\"160\" y2=\"125\" stroke=\"#00f3ff\" stroke-width=\"3\" stroke-dasharray=\"4,4\"/>\n      <line x1=\"420\" y1=\"80\" x2=\"540\" y2=\"125\" stroke=\"#00f3ff\" stroke-width=\"3\" stroke-dasharray=\"4,4\"/>\n      <text x=\"200\" y=\"105\" fill=\"#00f3ff\" font-size=\"9\">CAPWAP UDP 5246/5247</text>\n      <text x=\"470\" y=\"105\" fill=\"#00f3ff\" font-size=\"9\">CAPWAP UDP 5246/5247</text>\n    </svg>",
    "example": {
      "scenario": "An executive walking across campus during a live Webex video call:",
      "steps": [
        "1. Executive connects to SSID 'CorpSecure' on AP-1 in Building A.",
        "2. WLC authenticates the user via RADIUS 802.1X and handles encryption keys.",
        "3. Executive walks to Building B. AP-1 signal weakens while AP-2 signal strengthens.",
        "4. Using 802.11r (Fast BSS Transition), AP-2 and WLC perform a pre-cached key exchange.",
        "5. Client roams to AP-2 in under 20 milliseconds without stuttering the video call!"
      ],
      "keyTakeaway": "Centralized WLC handles seamless roaming across hundreds of APs without dropped sessions."
    },
    "deepDive": "\n      <h4>Split-MAC Architecture Functions:</h4>\n      <ul>\n        <li><strong>Handled by AP:</strong> 802.11 beacons, probe responses, packet ACKs, radio frequency monitoring.</li>\n        <li><strong>Handled by WLC:</strong> 802.11 association, 802.1X authentication, QoS, inter-AP roaming, Radio Resource Management (RRM).</li>\n        <li><strong>CAPWAP Ports:</strong> Control (UDP 5246 DTLS), Data (UDP 5247).</li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco Catalyst 9800 WLC CLI\nshow ap summary\nshow wireless client summary\nshow capwap summary",
    "examTip": "In Local Mode, data is tunneled to the WLC. In FlexConnect Mode, data is switched locally at the branch switch.",
    "hardwarePhoto": {
      "title": "Cisco Catalyst 9120AX Wi-Fi 6 Access Point",
      "src": "assets/hardware/cisco_wifi6_ap.svg",
      "caption": "Hardware used: 4x4 MU-MIMO enterprise ceiling AP managed via encrypted CAPWAP tunnels from Catalyst 9800 WLC."
    }
  },
  {
    "track": "CCNP ENARSI 300-410",
    "module": "1. Layer 3 Technologies",
    "id": "enarsi_1_ospf_advanced",
    "title": "Advanced OSPFv2/v3: NSSA & Virtual Links",
    "badge": "ENARSI 1.1",
    "labTemplate": "ospf_routing",
    "summary": "Deep-dive into multi-area OSPF tuning: Not-So-Stubby Areas (NSSA) allowing local external route redistribution via Type-7 LSAs translated to Type-5 LSAs at the ABR, and OSPF Virtual Links.",
    "analogy": "A secure research lab inside a military base: It blocks outside civilian traffic (Stub), but has its own internal prototype lab that produces classified inventions (Type-7 LSA) translated for the rest of the army.",
    "diagramSvg": "<svg viewBox=\"0 0 700 200\" class=\"study-svg\">\n      <rect x=\"30\" y=\"30\" width=\"180\" height=\"140\" rx=\"8\" fill=\"#1e293b\" stroke=\"#00f3ff\" stroke-width=\"2\"/>\n      <text x=\"120\" y=\"60\" fill=\"#00f3ff\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">AREA 0 (BACKBONE)</text>\n      <text x=\"50\" y=\"90\" fill=\"#cbd5e1\" font-size=\"10\">• Type-1: Router LSA</text>\n      <text x=\"50\" y=\"115\" fill=\"#cbd5e1\" font-size=\"10\">• Type-2: Network LSA</text>\n      <text x=\"50\" y=\"140\" fill=\"#cbd5e1\" font-size=\"10\">• Type-5: External LSA</text>\n\n      <rect x=\"250\" y=\"30\" width=\"180\" height=\"140\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"340\" y=\"60\" fill=\"#10b981\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">ABR ROUTER</text>\n      <text x=\"340\" y=\"95\" fill=\"#f59e0b\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">TYPE-7 -> TYPE-5</text>\n      <text x=\"340\" y=\"115\" fill=\"#f59e0b\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">TRANSLATION</text>\n      <text x=\"340\" y=\"145\" fill=\"#cbd5e1\" font-size=\"9\" text-anchor=\"middle\">Injects Default Route</text>\n\n      <rect x=\"470\" y=\"30\" width=\"200\" height=\"140\" rx=\"8\" fill=\"#1e293b\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n      <text x=\"570\" y=\"60\" fill=\"#f59e0b\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">AREA 10 (NSSA)</text>\n      <text x=\"490\" y=\"90\" fill=\"#cbd5e1\" font-size=\"10\">• Type-5 LSAs Blocked</text>\n      <text x=\"490\" y=\"115\" fill=\"#f59e0b\" font-size=\"10\" font-weight=\"bold\">• Type-7: NSSA External</text>\n      <text x=\"490\" y=\"140\" fill=\"#cbd5e1\" font-size=\"10\">• ASBR Allowed Inside</text>\n    </svg>",
    "example": {
      "scenario": "Connecting a newly acquired company (running EIGRP) to an existing OSPF Area without flooding external routes:",
      "steps": [
        "1. Area 10 is designated as an OSPF NSSA (Not-So-Stubby Area).",
        "2. An ASBR inside Area 10 redistributes EIGRP routes as Type-7 LSAs.",
        "3. Standard Type-5 external LSAs from the rest of the company are blocked from entering Area 10.",
        "4. The Area Border Router (ABR) translates the Type-7 LSAs into Type-5 LSAs and advertises them into Backbone Area 0.",
        "5. Result: Full bidirectional routing with minimal routing table memory overhead!"
      ],
      "keyTakeaway": "NSSA areas block Type-5 LSAs from the outside but allow an internal ASBR to inject external routes via Type-7 LSAs."
    },
    "deepDive": "\n      <h4>OSPF LSA Types Summary:</h4>\n      <ul>\n        <li><strong>Type 1:</strong> Router LSA (Local to area)</li>\n        <li><strong>Type 2:</strong> Network LSA (Generated by DR)</li>\n        <li><strong>Type 3:</strong> Summary LSA (Inter-area generated by ABR)</li>\n        <li><strong>Type 4:</strong> ASBR Summary (Location of ASBR)</li>\n        <li><strong>Type 5:</strong> AS External (Redistributed routes)</li>\n        <li><strong>Type 7:</strong> NSSA External (Translated to Type 5 at ABR)</li>\n      </ul>\n    ",
    "cliSnippet": "! Configure OSPF Not-So-Stubby-Area (NSSA)\nrouter ospf 1\n area 10 nssa\n area 10 nssa default-information-originate",
    "examTip": "An OSPF Virtual Link can NEVER transit through a Stub or NSSA area—it requires a regular, non-stub transit area!",
    "hardwarePhoto": {
      "title": "Cisco ISR 4331 NSSA Translation Router",
      "src": "assets/hardware/cisco_isr_router.svg",
      "caption": "Hardware used: ABR translating Type-7 NSSA external LSAs into Type-5 LSAs into the Area 0 Backbone."
    }
  },
  {
    "track": "CCNP ENARSI 300-410",
    "module": "2. VPN Technologies",
    "id": "enarsi_2_mpls_vpn",
    "title": "MPLS LDP & Layer 3 BGP VPNs",
    "badge": "ENARSI 2.1",
    "labTemplate": "bgp_mpls",
    "summary": "Multiprotocol Label Switching (MPLS) uses Label Distribution Protocol (LDP) to switch packets using simple 32-bit labels instead of searching complex IP routing tables. MP-BGP provides customer VPN separation via VRFs and Route Distinguishers.",
    "analogy": "Luggage routing at an international airport: Instead of border security reading your entire passport at every baggage carousel, they slap a baggage barcode sticker (MPLS label) on the handle. Airport machines sort it in milliseconds based strictly on the barcode sticker.",
    "diagramSvg": "<svg viewBox=\"0 0 700 200\" class=\"study-svg\">\n      <rect x=\"30\" y=\"40\" width=\"130\" height=\"70\" rx=\"6\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"95\" y=\"70\" fill=\"#38bdf8\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">CE-HQ</text>\n      <text x=\"95\" y=\"90\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">Customer IPv4</text>\n\n      <rect x=\"190\" y=\"40\" width=\"130\" height=\"70\" rx=\"6\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"255\" y=\"70\" fill=\"#10b981\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">PE-1 (Ingress)</text>\n      <text x=\"255\" y=\"90\" fill=\"#10b981\" font-size=\"10\" text-anchor=\"middle\">PUSH Label 1002</text>\n\n      <rect x=\"360\" y=\"40\" width=\"130\" height=\"70\" rx=\"6\" fill=\"#0f172a\" stroke=\"#a855f7\" stroke-width=\"2\"/>\n      <text x=\"425\" y=\"70\" fill=\"#a855f7\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">P-Core (LSR)</text>\n      <text x=\"425\" y=\"90\" fill=\"#a855f7\" font-size=\"10\" text-anchor=\"middle\">SWAP 1002->2004</text>\n\n      <rect x=\"530\" y=\"40\" width=\"130\" height=\"70\" rx=\"6\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"595\" y=\"70\" fill=\"#10b981\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">PE-2 (PHP)</text>\n      <text x=\"595\" y=\"90\" fill=\"#10b981\" font-size=\"10\" text-anchor=\"middle\">POP Label</text>\n\n      <!-- MPLS Label Shim Structure -->\n      <rect x=\"130\" y=\"135\" width=\"440\" height=\"45\" rx=\"6\" fill=\"#1e293b\" stroke=\"#f59e0b\"/>\n      <text x=\"350\" y=\"162\" fill=\"#f59e0b\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">[Label: 20 Bits] [TC/Exp: 3 Bits] [S-bit: 1 Bit] [TTL: 8 Bits]</text>\n    </svg>",
    "example": {
      "scenario": "Telecom carrier transmitting traffic between Bank of America and Wells Fargo across the same physical fiber backbone:",
      "steps": [
        "1. Carrier configures separate VRFs (Virtual Routing & Forwarding) for each bank on PE routers.",
        "2. Bank of America and Wells Fargo can both use private IP 10.1.1.1 without any IP conflict!",
        "3. PE-1 router prepends an MPLS VPN label and an MPLS Transport label to incoming packets.",
        "4. Provider Core (P) routers swap 32-bit labels at hardware line-rate without reading IP headers.",
        "5. Penultimate Hop Popping (PHP) strips the outer label, and PE-2 delivers the clean packet to the correct bank."
      ],
      "keyTakeaway": "MPLS VPNs provide complete data isolation between different corporate customers on a shared carrier network."
    },
    "deepDive": "\n      <h4>MPLS 32-Bit Label Header (The Shim):</h4>\n      <ul>\n        <li><strong>Label Value (20 Bits):</strong> Specifies forwarding path (0-1,048,575).</li>\n        <li><strong>Traffic Class / Exp (3 Bits):</strong> Quality of Service / CoS priority.</li>\n        <li><strong>Bottom of Stack S-bit (1 Bit):</strong> 1 indicates bottom label.</li>\n        <li><strong>TTL (8 Bits):</strong> Prevents infinite routing loops.</li>\n      </ul>\n    ",
    "cliSnippet": "! Enable MPLS & LDP on Cisco Core Router\nip cef\nmpls ip\nmpls label range 100 999\n\ninterface GigabitEthernet0/0\n mpls ip\n\nshow mpls ldp neighbors\nshow mpls forwarding-table",
    "examTip": "Penultimate Hop Popping (PHP) strips the outer MPLS label at the second-to-last router (P router) before delivering the packet to the PE router, saving the PE from performing two lookups!",
    "hardwarePhoto": {
      "title": "Cisco Provider Edge (PE) MPLS Router",
      "src": "assets/hardware/cisco_isr_router.svg",
      "caption": "Hardware used: Pushes and swaps 32-bit MPLS shim labels and maintains VRF tables for multi-tenant enterprise VPNs."
    }
  },
  {
    "track": "CCNP ENARSI 300-410",
    "module": "2. VPN Technologies",
    "id": "enarsi_2_dmvpn",
    "title": "Dynamic Multipoint VPN (DMVPN Phase 1/2/3)",
    "badge": "ENARSI 2.2",
    "labTemplate": "dmvpn",
    "summary": "Cisco DMVPN combines Multipoint GRE (mGRE), Next Hop Resolution Protocol (NHRP), and IPsec crypto profiles to build scalable hub-and-spoke and dynamic spoke-to-spoke encrypted tunnels without static manual configurations.",
    "analogy": "On-demand ride dispatch: Spokes don’t need permanent cables connected to all other spokes. When Spoke A wants to call Spoke B, it queries the dispatcher (Hub NHRP server) and establishes an on-demand direct private tunnel directly between them!",
    "diagramSvg": "<svg viewBox=\"0 0 700 210\" class=\"study-svg\">\n      <rect x=\"270\" y=\"20\" width=\"160\" height=\"60\" rx=\"8\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      <text x=\"350\" y=\"45\" fill=\"#10b981\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">DMVPN HUB (HQ)</text>\n      <text x=\"350\" y=\"65\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">NHRP Server (NHS) • 172.16.1.1</text>\n\n      <rect x=\"80\" y=\"130\" width=\"160\" height=\"60\" rx=\"8\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"160\" y=\"155\" fill=\"#38bdf8\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">SPOKE 1 (Dallas)</text>\n      <text x=\"160\" y=\"175\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">mGRE Tunnel0 • 172.16.1.2</text>\n\n      <rect x=\"460\" y=\"130\" width=\"160\" height=\"60\" rx=\"8\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"540\" y=\"155\" fill=\"#38bdf8\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">SPOKE 2 (London)</text>\n      <text x=\"540\" y=\"175\" fill=\"#cbd5e1\" font-size=\"10\" text-anchor=\"middle\">mGRE Tunnel0 • 172.16.1.3</text>\n\n      <!-- Hub Tunnels -->\n      <line x1=\"310\" y1=\"80\" x2=\"190\" y2=\"130\" stroke=\"#00f3ff\" stroke-width=\"2\" stroke-dasharray=\"4,4\"/>\n      <line x1=\"390\" y1=\"80\" x2=\"510\" y2=\"130\" stroke=\"#00f3ff\" stroke-width=\"2\" stroke-dasharray=\"4,4\"/>\n\n      <!-- Dynamic Spoke-to-Spoke Shortcut -->\n      <line x1=\"240\" y1=\"160\" x2=\"460\" y2=\"160\" stroke=\"#10b981\" stroke-width=\"3\"/>\n      <text x=\"350\" y=\"150\" fill=\"#10b981\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\">DIRECT SPOKE-TO-SPOKE IPSEC SHORTCUT</text>\n    </svg>",
    "example": {
      "scenario": "Dallas branch user wants to send a database file to London branch:",
      "steps": [
        "1. Initial packet goes to the Hub router over mGRE Tunnel0.",
        "2. Hub recognizes both Dallas and London are spokes on the same mGRE subnet and sends an 'NHRP Redirect' to Dallas.",
        "3. Dallas router sends an 'NHRP Resolution Request' to London router asking for its public WAN IP.",
        "4. London router replies directly with an 'NHRP Resolution Reply'.",
        "5. Dallas and London dynamically establish an on-demand IPsec tunnel directly between each other (NHRP Shortcut)!",
        "6. All subsequent packets flow directly across the Internet with zero Hub bottleneck delay."
      ],
      "keyTakeaway": "DMVPN Phase 3 achieves optimal spoke-to-spoke routing without hairpinning traffic through the headquarters hub."
    },
    "deepDive": "\n      <h4>DMVPN Evolution:</h4>\n      <ul>\n        <li><strong>Phase 1:</strong> Hub-and-Spoke only. All spoke-to-spoke traffic transits the Hub.</li>\n        <li><strong>Phase 2:</strong> Dynamic Spoke-to-Spoke supported; spokes preserve original next-hop.</li>\n        <li><strong>Phase 3:</strong> Advanced Spoke-to-Spoke using <code>ip nhrp redirect</code> on Hub and <code>ip nhrp shortcut</code> on Spokes.</li>\n      </ul>\n    ",
    "cliSnippet": "! Cisco DMVPN Phase 3 Hub Configuration\ninterface Tunnel0\n ip address 172.16.1.1 255.255.255.0\n ip nhrp network-id 1\n ip nhrp redirect\n tunnel source GigabitEthernet0/0\n tunnel mode gre multipoint\n tunnel protection ipsec profile DMVPN_PROFILE",
    "examTip": "DMVPN Phase 3 requires \"ip nhrp redirect\" on the Hub and \"ip nhrp shortcut\" on the Spokes to trigger on-demand dynamic tunnels!",
    "hardwarePhoto": {
      "title": "Cisco ISR 4451 DMVPN mGRE Multipoint Hub",
      "src": "assets/hardware/cisco_isr_router.svg",
      "caption": "Hardware used: NHRP server directing spokes to establish on-demand direct spoke-to-spoke IPsec shortcut tunnels."
    }
  }
];
