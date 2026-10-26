/**
 * ccna.js - CCNA 200-301 Visual Academy, OSI/TCP Stack, Cabling, TCP/UDP & Virtualization Hub
 *
 * Implements interactive visual lessons, OSI 7-Layer PDU encapsulation diagram,
 * cable media pinout guide (T568A/B), TCP 3-way handshake simulator,
 * hypervisor vs container comparisons, IPsec VPN crypto specs, and practice quiz.
 */

export const OSI_LAYERS = [
  {
    layer: 7,
    name: 'Application',
    tcpIpLayer: 'Application',
    pdu: 'Data',
    description: 'Human-computer network interaction; HTTP, HTTPS, DNS, DHCP, SSH, FTP, Telnet.',
    devices: 'Host, Web Browser, API Gateway',
    color: '#ef4444'
  },
  {
    layer: 6,
    name: 'Presentation',
    tcpIpLayer: 'Application',
    pdu: 'Data',
    description: 'Data formatting, TLS/SSL encryption/decryption, JPEG/ASCII compression.',
    devices: 'OS Crypto Subsystem',
    color: '#f97316'
  },
  {
    layer: 5,
    name: 'Session',
    tcpIpLayer: 'Application',
    pdu: 'Data',
    description: 'Establishes, maintains, and terminates authentication sessions; RPC, NetBIOS.',
    devices: 'OS Sockets & Sessions',
    color: '#f59e0b'
  },
  {
    layer: 4,
    name: 'Transport',
    tcpIpLayer: 'Transport',
    pdu: 'Segment (TCP) / Datagram (UDP)',
    description: 'End-to-end communication; TCP (reliable, 3-way handshake) vs UDP (fast, connectionless); Port numbers (0-65535).',
    devices: 'Firewall, Load Balancer (Layer 4)',
    color: '#10b981'
  },
  {
    layer: 3,
    name: 'Network',
    tcpIpLayer: 'Internet',
    pdu: 'Packet',
    description: 'Logical IPv4/IPv6 addressing, routing decisions, path determination (OSPF, BGP, ICMP, ARP).',
    devices: 'Router, Layer 3 Multilayer Switch',
    color: '#06b6d4'
  },
  {
    layer: 2,
    name: 'Data Link',
    tcpIpLayer: 'Network Access',
    pdu: 'Frame',
    description: 'Physical MAC addressing, 802.1Q VLAN tagging, Spanning Tree (STP), Ethernet error detection (FCS/CRC).',
    devices: 'Ethernet Switch, Bridge, WAP',
    color: '#3b82f6'
  },
  {
    layer: 1,
    name: 'Physical',
    tcpIpLayer: 'Network Access',
    pdu: 'Bits (Voltage, Light Pulses, RF Waves)',
    description: 'Physical cable media, transceivers, electrical signals, optical wavelengths (1310/1550nm), radio frequencies (2.4/5/6 GHz).',
    devices: 'Cat6 UTP, Fiber (SMF/MMF), Hubs, SFP+',
    color: '#8b5cf6'
  }
];

export const CABLING_SPECS = {
  cat6: {
    name: 'Cat6 UTP (Unshielded Twisted Pair)',
    jacketColor: '#2563eb', // Blue
    media: 'Copper 4-Pair Twisted Wire (23 AWG)',
    connector: 'RJ-45 (8P8C)',
    maxSpeed: '10 Gbps (up to 55m) / 1 Gbps (100m)',
    maxDistance: '100 meters (328 ft)',
    frequency: '250 MHz',
    standard: 'TIA/EIA-568-C.2',
    useCase: 'Office workstations, access switches, PoE+ IP phones & access points'
  },
  smf: {
    name: 'Single-Mode Fiber (OS2 Yellow Jacket)',
    jacketColor: '#eab308', // Yellow
    media: 'Single 9/125 µm Glass Core with Laser Light Source',
    connector: 'LC / SC Duplex',
    maxSpeed: '100 Gbps - 400 Gbps (1310nm / 1550nm)',
    maxDistance: '10 km - 40 km (up to 80 km with ZR optics)',
    frequency: 'Optical TeraHertz (DWDM)',
    standard: 'ITU-T G.652.D',
    useCase: 'Telco WAN carrier circuits, campus inter-building backbones, long-haul links'
  },
  mmf: {
    name: 'Multi-Mode Fiber (OM4 Aqua Jacket)',
    jacketColor: '#06b6d4', // Aqua
    media: '50/125 µm Glass Core with 850nm VCSEL LED',
    connector: 'LC Duplex / MPO-12',
    maxSpeed: '25 Gbps / 40 Gbps / 100 Gbps',
    maxDistance: '400 meters (OM4) / 300 meters (OM3)',
    frequency: '850nm / 1300nm',
    standard: 'ISO/IEC 11801',
    useCase: 'Data center server-to-switch fabric, SAN storage arrays, intra-facility runs'
  },
  dac: {
    name: 'Twinax DAC (Direct Attach Copper)',
    jacketColor: '#1e293b', // Dark Slate / Black
    media: 'Shielded Twinaxial Copper Cable with Integrated SFP28/QSFP28 Transceivers',
    connector: 'Fixed SFP+ / SFP28 / QSFP28',
    maxSpeed: '10 Gbps / 25 Gbps / 100 Gbps',
    maxDistance: '1 meter - 5 meters (Low Latency <0.1µs)',
    frequency: 'Direct Differential Signalling',
    standard: 'SFF-8431 / SFF-8402',
    useCase: 'Top-of-Rack (ToR) switch to server blade racks, zero-latency interconnects'
  },
  vpn_tunnel: {
    name: 'IPsec Encrypted VPN Tunnel (ESP Tunnel Mode)',
    jacketColor: '#8b5cf6', // Violet Hologram
    media: 'Virtual Cryptographic Tunnel traversing Public Internet WAN',
    connector: 'IKEv2 / IPsec Security Association (SA)',
    maxSpeed: 'Line-Rate Crypto (AES-256-GCM / SHA-384)',
    maxDistance: 'Global Internet (Zero Physical Limit)',
    frequency: 'IP Protocol 50 (ESP) & UDP Port 500/4500 (NAT-T)',
    standard: 'RFC 4301 / RFC 7296',
    useCase: 'Branch office interconnects, secure remote executive access, multi-cloud interconnect'
  }
};

export const CCNA_QUIZ_QUESTIONS = [
  {
    q: 'Which protocol provides reliable, connection-oriented data transfer using a 3-way handshake?',
    options: ['UDP', 'TCP', 'ICMP', 'IP'],
    ans: 1,
    expl: 'TCP (Transmission Control Protocol) is connection-oriented and establishes sessions via SYN, SYN-ACK, ACK before transferring data reliably with sequence numbers and acknowledgements.'
  },
  {
    q: 'What is the standard maximum cable length for standard Cat6 twisted pair Ethernet at 1 Gbps?',
    options: ['50 meters', '100 meters', '300 meters', '500 meters'],
    ans: 1,
    expl: 'The TIA/EIA standard specifies a maximum channel limit of 100 meters (90m horizontal solid core + 10m stranded patch cords) for copper Ethernet.'
  },
  {
    q: 'What is the primary difference between a Type-1 and Type-2 Hypervisor?',
    options: [
      'Type-1 runs directly on bare-metal hardware; Type-2 runs on top of a host operating system.',
      'Type-1 supports only Windows; Type-2 supports only Linux.',
      'Type-1 is for Docker containers; Type-2 is for Virtual Machines.',
      'Type-1 has no virtual switches; Type-2 requires hardware routing.'
    ],
    ans: 0,
    expl: 'Type-1 (Bare-Metal, e.g. VMware ESXi, KVM, Proxmox) installs directly on the physical hardware server for maximum performance. Type-2 (Hosted, e.g. VirtualBox) runs as an app on an OS.'
  },
  {
    q: 'In an IPsec VPN, which protocol provides both data confidentiality (encryption) and data integrity?',
    options: ['AH (Authentication Header)', 'ESP (Encapsulating Security Payload)', 'SNMPv3', 'OSPF MD5'],
    ans: 1,
    expl: 'ESP (IP Protocol 50) provides encryption, origin authentication, integrity, and anti-replay. AH (Protocol 51) provides integrity and authentication only—no encryption!'
  },
  {
    q: 'Which OSI layer does an Ethernet switch operate on when forwarding traffic based on MAC addresses?',
    options: ['Layer 1 (Physical)', 'Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)'],
    ans: 1,
    expl: 'Traditional Layer 2 switches read Ethernet Frame headers and forward frames according to their MAC address table (CAM table).'
  }
];

export class CCNAAcademyManager {
  constructor() {
    this.modal = document.getElementById('ccna-modal');
    this.currentQuizIndex = 0;
    this.quizScore = 0;
    this.initEvents();
  }

  initEvents() {
    // Open Modal button
    document.getElementById('btn-ccna-academy')?.addEventListener('click', () => {
      this.openModal('osi');
    });

    document.getElementById('btn-close-ccna')?.addEventListener('click', () => {
      this.closeModal();
    });

    // Tab buttons
    document.querySelectorAll('.ccna-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Subnet calculator launch from CCNA modal
    document.getElementById('btn-ccna-calc')?.addEventListener('click', () => {
      this.closeModal();
      document.getElementById('btn-subnet-calc')?.click();
    });
  }

  openModal(defaultTab = 'osi') {
    if (!this.modal) return;
    this.modal.classList.remove('hidden');
    this.switchTab(defaultTab);
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
  }

  switchTab(tabName) {
    document.querySelectorAll('.ccna-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.ccna-tab-content').forEach(c => {
      c.classList.add('hidden');
    });

    const activeContent = document.getElementById(`ccna-tab-${tabName}`);
    if (activeContent) {
      activeContent.classList.remove('hidden');
    }

    if (tabName === 'quiz') {
      this.renderQuizQuestion();
    }
  }

  renderQuizQuestion() {
    const container = document.getElementById('ccna-quiz-container');
    if (!container) return;

    if (this.currentQuizIndex >= CCNA_QUIZ_QUESTIONS.length) {
      container.innerHTML = `
        <div class="quiz-completed-card">
          <div style="font-size: 48px;">🏆</div>
          <h3>CCNA Knowledge Check Completed!</h3>
          <p style="font-size: 18px; color: #00f3ff; font-weight: bold;">
            Your Score: ${this.quizScore} / ${CCNA_QUIZ_QUESTIONS.length} (${Math.round((this.quizScore / CCNA_QUIZ_QUESTIONS.length) * 100)}%)
          </p>
          <p style="color: #94a3b8; margin: 12px 0;">Great work! You have covered core CCNA 200-301 concepts: OSI, TCP/UDP, Cabling, Hypervisors, and IPsec VPNs.</p>
          <button id="btn-quiz-restart" class="pill-btn pill-primary">🔄 Retake Quiz</button>
        </div>
      `;
      document.getElementById('btn-quiz-restart')?.addEventListener('click', () => {
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.renderQuizQuestion();
      });
      return;
    }

    const qData = CCNA_QUIZ_QUESTIONS[this.currentQuizIndex];
    container.innerHTML = `
      <div class="quiz-header-row">
        <span class="quiz-step-badge">Question ${this.currentQuizIndex + 1} of ${CCNA_QUIZ_QUESTIONS.length}</span>
        <span class="quiz-score-badge">Current Score: ${this.quizScore}</span>
      </div>
      <h4 class="quiz-question-text">${qData.q}</h4>
      <div class="quiz-options-grid">
        ${qData.options.map((opt, idx) => `
          <button class="quiz-opt-btn" data-opt="${idx}">
            <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
            <span class="opt-label">${opt}</span>
          </button>
        `).join('')}
      </div>
      <div id="quiz-explanation" class="quiz-explanation hidden"></div>
      <div class="quiz-nav-row">
        <button id="btn-quiz-next" class="pill-btn pill-primary hidden">Next Question →</button>
      </div>
    `;

    container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selected = parseInt(e.currentTarget.getAttribute('data-opt'), 10);
        this.handleQuizAnswer(selected, qData);
      });
    });
  }

  handleQuizAnswer(selectedIndex, qData) {
    const container = document.getElementById('ccna-quiz-container');
    const buttons = container.querySelectorAll('.quiz-opt-btn');
    buttons.forEach((b, idx) => {
      b.disabled = true;
      if (idx === qData.ans) {
        b.classList.add('correct');
      } else if (idx === selectedIndex) {
        b.classList.add('incorrect');
      }
    });

    const isCorrect = (selectedIndex === qData.ans);
    if (isCorrect) {
      this.quizScore++;
      const scoreBadge = container.querySelector('.quiz-score-badge');
      if (scoreBadge) scoreBadge.textContent = `Current Score: ${this.quizScore}`;
    }

    const explEl = document.getElementById('quiz-explanation');
    if (explEl) {
      explEl.classList.remove('hidden');
      explEl.innerHTML = `
        <strong style="color: ${isCorrect ? '#10b981' : '#ef4444'};">
          ${isCorrect ? '✓ Correct!' : '✗ Incorrect!'}
        </strong> ${qData.expl}
      `;
    }

    const nextBtn = document.getElementById('btn-quiz-next');
    if (nextBtn) {
      nextBtn.classList.remove('hidden');
      nextBtn.addEventListener('click', () => {
        this.currentQuizIndex++;
        this.renderQuizQuestion();
      });
    }
  }
}
