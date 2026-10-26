/**
 * graph.js - Network Data Model, Topologies & Pathfinding
 *
 * Implements:
 * 1. Rich enterprise network model: Full Names, IPs, MAC Addresses, Default Gateways,
 *    Subnet Masks, DNS, VLAN IDs, Port Interfaces, Link Bandwidths, and Operating Systems.
 * 2. Complete library of classic & modern network topologies:
 *    - Star Topology (Central Switch / Hub LAN)
 *    - Ring Topology (Closed Circular Loop with Redundant Failover)
 *    - Full Mesh Topology (N*(N-1)/2 Interconnections, Zero Single Points of Failure)
 *    - Bus Topology (Linear Trunk Backbone with Drop Lines & Terminators)
 *    - Spine-and-Leaf Clos Fabric (Data Center East-West Bisectional Bandwidth)
 *    - Campus LAN & Wi-Fi 6 (PoE Switches, Access Points, VoIP Phones, Printers)
 *    - Industrial IoT / SCADA & OT Network (Purdue Enterprise Model)
 *    - Cisco 3-Tier Enterprise Network (Core, Distribution, Access)
 *    - 3-Tier Cloud Web Architecture (WAF, Load Balancer, Microservices, DB Cluster)
 *    - SD-WAN Multi-Site Branch VPN
 * 3. BFS Shortest-Path pathfinding and Internet reachability analysis.
 */

export const NODE_TYPES = [
  'internet',
  'firewall',
  'router',
  'switch',
  'server',
  'desktop',
  'pc',
  'laptop',
  'printer',
  'wap',
  'phone',
  'iot',
  'hypervisor',
  'vm',
  'container',
  'vpn',
  'cloud_vpc',
  'loadbalancer',
  'database',
  'cloud'
];

export const DEPARTMENTS = [
  'IT & Infrastructure',
  'Engineering & Dev',
  'Finance & Accounting',
  'Human Resources (HR)',
  'Sales & Marketing',
  'Executive Suite',
  'Operations & OT',
  'DMZ & Perimeter',
  'Data Center'
];

export const DEPARTMENT_COLORS = {
  'IT & Infrastructure': '#38bdf8', // Sky Blue
  'Engineering & Dev':   '#8b5cf6', // Violet
  'Finance & Accounting':'#10b981', // Emerald Green
  'Human Resources (HR)':'#f59e0b', // Amber
  'Sales & Marketing':   '#ec4899', // Pink
  'Executive Suite':     '#eab308', // Gold
  'Operations & OT':     '#06b6d4', // Cyan
  'DMZ & Perimeter':     '#f97316', // Orange
  'Data Center':         '#a855f7'  // Purple
};

/**
 * Generate deterministic virtual MAC address from string seed
 */
export function generateMAC(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const hex = ('00000000' + Math.abs(hash).toString(16)).slice(-8);
  return `00:50:56:${hex.slice(0, 2)}:${hex.slice(2, 4)}:${hex.slice(4, 6)}`.toUpperCase();
}

export class Graph {
  constructor() {
    /** @type {Map<string, Object>} */
    this.nodes = new Map();

    /** @type {Array<Object>} */
    this.links = [];
  }

  addNode(nodeData) {
    if (!nodeData || !nodeData.id) {
      throw new Error('Node must have a valid id');
    }
    let type = nodeData.type ? String(nodeData.type).toLowerCase() : 'desktop';
    if (type === 'pc') type = 'desktop';
    if (!NODE_TYPES.includes(type)) type = 'desktop';

    const pos = nodeData.position || [0, 1.5, -1.0];
    const position = Array.isArray(pos)
      ? { x: pos[0] ?? 0, y: pos[1] ?? 1.5, z: pos[2] ?? -1.0 }
      : { x: pos.x ?? 0, y: pos.y ?? 1.5, z: pos.z ?? -1.0 };

    const department = nodeData.department || 'IT & Infrastructure';
    const ip = nodeData.ip || '10.0.0.1';
    const mac = nodeData.mac || generateMAC(nodeData.id);
    const gateway = nodeData.gateway || (ip.split('.').slice(0, 3).join('.') + '.1');
    const mask = nodeData.mask || '255.255.255.0';
    const vlan = nodeData.vlan || (department.includes('Data') ? 'VLAN 10' : department.includes('Eng') ? 'VLAN 20' : 'VLAN 30');
    const port = nodeData.port || 'GigabitEthernet 0/1';
    const speed = nodeData.speed || '1 Gbps Full Duplex';
    const firmware = nodeData.firmware || (type === 'router' || type === 'switch' ? 'Cisco IOS-XE 17.9' : type === 'firewall' ? 'PAN-OS 11.0' : type === 'server' ? 'Ubuntu 22.04 LTS' : 'Windows 11 Pro');

    this.nodes.set(nodeData.id, {
      id: String(nodeData.id),
      name: nodeData.name || nodeData.id,
      type: type,
      ip: ip,
      mac: mac,
      gateway: gateway,
      mask: mask,
      dns: nodeData.dns || '1.1.1.1, 8.8.8.8',
      vlan: vlan,
      port: port,
      speed: speed,
      firmware: firmware,
      department: department,
      subnet: nodeData.subnet || vlan,
      position: position,
      status: nodeData.status === 'down' ? 'down' : 'up'
    });
    return this.nodes.get(nodeData.id);
  }

  removeNode(id) {
    this.nodes.delete(id);
    this.links = this.links.filter(l => l.from !== id && l.to !== id);
  }

  addLink(fromId, toId, customId = null, extra = {}) {
    const id = customId || `link-${fromId}-${toId}`;
    const exists = this.links.some(
      l => (l.from === fromId && l.to === toId) || (l.from === toId && l.to === fromId)
    );
    if (!exists) {
      this.links.push({
        id: id,
        from: String(fromId),
        to: String(toId),
        status: 'up',
        speed: extra.speed || '10 Gbps Fiber',
        cable: extra.cable || 'cat6',
        distance: extra.distance || '25m',
        portA: extra.portA || 'Gi0/1',
        portB: extra.portB || 'Gi0/24'
      });
    }
    return id;
  }

  removeLink(linkId) {
    this.links = this.links.filter(l => l.id !== linkId);
  }

  setNodeStatus(id, status) {
    const node = this.nodes.get(id);
    if (node) {
      node.status = status;
    }
  }

  setLinkStatus(linkId, status) {
    const link = this.links.find(l => l.id === linkId);
    if (link) {
      link.status = status;
    }
  }

  findLink(idA, idB) {
    return this.links.find(
      l => (l.from === idA && l.to === idB) || (l.from === idB && l.to === idA)
    );
  }

  reset() {
    for (const node of this.nodes.values()) {
      node.status = 'up';
    }
    for (const link of this.links) {
      link.status = 'up';
    }
  }

  clear() {
    this.nodes.clear();
    this.links = [];
  }

  getNeighbors(id) {
    const currentNode = this.nodes.get(id);
    if (!currentNode || currentNode.status !== 'up') {
      return [];
    }

    const neighbors = [];
    for (const link of this.links) {
      if (link.status !== 'up') continue;

      let neighborId = null;
      if (link.from === id) neighborId = link.to;
      else if (link.to === id) neighborId = link.from;

      if (neighborId) {
        const neighborNode = this.nodes.get(neighborId);
        if (neighborNode && neighborNode.status === 'up') {
          neighbors.push(neighborId);
        }
      }
    }
    return neighbors;
  }

  shortestPath(fromId, toId) {
    if (fromId === toId) {
      const node = this.nodes.get(fromId);
      return node && node.status === 'up' ? [fromId] : null;
    }

    const startNode = this.nodes.get(fromId);
    const endNode = this.nodes.get(toId);
    if (!startNode || !endNode || startNode.status !== 'up' || endNode.status !== 'up') {
      return null;
    }

    const queue = [fromId];
    const visited = new Set([fromId]);
    const parentMap = new Map();

    let found = false;

    while (queue.length > 0) {
      const current = queue.shift();
      if (current === toId) {
        found = true;
        break;
      }

      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parentMap.set(neighbor, current);
          queue.push(neighbor);
        }
      }
    }

    if (!found) return null;

    const path = [];
    let curr = toId;
    while (curr) {
      path.unshift(curr);
      curr = parentMap.get(curr);
    }
    return path;
  }

  getReachableFrom(internetId) {
    const reachable = new Set();
    const rootNode = this.nodes.get(internetId);
    if (!rootNode || rootNode.status !== 'up') {
      return reachable;
    }

    const queue = [internetId];
    reachable.add(internetId);

    while (queue.length > 0) {
      const current = queue.shift();
      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!reachable.has(neighbor)) {
          reachable.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return reachable;
  }
}

/**
 * Complete Library of Network Topologies & Production Stacks
 */
export const NETWORK_TEMPLATES = {
  // 1. Classic Star Topology
  star: {
    id: 'star',
    title: '⭐ Star Topology (Central Switch LAN)',
    desc: 'The foundational local area network topology. All end systems connect directly to a single high-speed central switch. If one cable fails, only that single device disconnects.',
    data: {
      name: "Classic Star Topology LAN",
      nodes: [
        { id: "sw_center", name: "Central Star Switch", type: "switch", ip: "192.168.1.1", department: "IT & Infrastructure", vlan: "VLAN 1", position: [0.0, 1.5, -1.0] },
        { id: "srv_star", name: "Local File Server", type: "server", ip: "192.168.1.10", department: "Data Center", vlan: "VLAN 1", position: [0.0, 2.45, -1.0] },
        { id: "pc_1", name: "Office Desktop 01", type: "desktop", ip: "192.168.1.101", department: "Finance & Accounting", vlan: "VLAN 1", position: [1.8, 2.1, -1.0] },
        { id: "pc_2", name: "Office Desktop 02", type: "desktop", ip: "192.168.1.102", department: "Engineering & Dev", vlan: "VLAN 1", position: [2.2, 1.5, -1.0] },
        { id: "lap_1", name: "Executive Laptop", type: "laptop", ip: "192.168.1.105", department: "Executive Suite", vlan: "VLAN 1", position: [1.8, 0.9, -1.0] },
        { id: "prn_star", name: "Network Office Printer", type: "printer", ip: "192.168.1.200", department: "Operations & OT", vlan: "VLAN 1", position: [0.0, 0.55, -1.0] },
        { id: "pc_3", name: "HR Workstation", type: "desktop", ip: "192.168.1.103", department: "Human Resources (HR)", vlan: "VLAN 1", position: [-1.8, 0.9, -1.0] },
        { id: "lap_2", name: "Sales Laptop", type: "laptop", ip: "192.168.1.106", department: "Sales & Marketing", vlan: "VLAN 1", position: [-2.2, 1.5, -1.0] },
        { id: "fw_star", name: "Perimeter Firewall", type: "firewall", ip: "192.168.1.254", department: "DMZ & Perimeter", vlan: "VLAN 1", position: [-1.8, 2.1, -1.0] }
      ],
      links: [
        { id: "l-sw-srv", from: "sw_center", to: "srv_star", speed: "10 Gbps Fiber" },
        { id: "l-sw-pc1", from: "sw_center", to: "pc_1", speed: "1 Gbps Copper" },
        { id: "l-sw-pc2", from: "sw_center", to: "pc_2", speed: "1 Gbps Copper" },
        { id: "l-sw-lap1", from: "sw_center", to: "lap_1", speed: "1 Gbps Copper" },
        { id: "l-sw-prn", from: "sw_center", to: "prn_star", speed: "100 Mbps Copper" },
        { id: "l-sw-pc3", from: "sw_center", to: "pc_3", speed: "1 Gbps Copper" },
        { id: "l-sw-lap2", from: "sw_center", to: "lap_2", speed: "1 Gbps Copper" },
        { id: "l-sw-fw", from: "sw_center", to: "fw_star", speed: "10 Gbps Fiber" }
      ]
    }
  },

  // 2. Ring Topology
  ring: {
    id: 'ring',
    title: '🔄 Ring Topology (Redundant Circular Loop)',
    desc: 'Each node connects to exactly two neighbors forming a closed ring. Packets travel along the ring. If any single link is cut, traffic automatically loops backwards with zero downtime!',
    data: {
      name: "Self-Healing Ring Network",
      nodes: [
        { id: "r_node1", name: "Ring Node A (HQ Core)", type: "router", ip: "10.10.1.1", department: "IT & Infrastructure", position: [0.0, 2.4, -1.0] },
        { id: "r_node2", name: "Ring Node B (DataCenter)", type: "server", ip: "10.10.1.2", department: "Data Center", position: [1.8, 1.95, -1.0] },
        { id: "r_node3", name: "Ring Node C (Engineering)", type: "switch", ip: "10.10.1.3", department: "Engineering & Dev", position: [2.2, 1.05, -1.0] },
        { id: "r_node4", name: "Ring Node D (Finance)", type: "desktop", ip: "10.10.1.4", department: "Finance & Accounting", position: [1.1, 0.45, -1.0] },
        { id: "r_node5", name: "Ring Node E (Operations)", type: "printer", ip: "10.10.1.5", department: "Operations & OT", position: [-1.1, 0.45, -1.0] },
        { id: "r_node6", name: "Ring Node F (Sales)", type: "laptop", ip: "10.10.1.6", department: "Sales & Marketing", position: [-2.2, 1.05, -1.0] },
        { id: "r_node7", name: "Ring Node G (Perimeter)", type: "firewall", ip: "10.10.1.7", department: "DMZ & Perimeter", position: [-1.8, 1.95, -1.0] }
      ],
      links: [
        { id: "ring-1-2", from: "r_node1", to: "r_node2", speed: "100 Gbps DWDM" },
        { id: "ring-2-3", from: "r_node2", to: "r_node3", speed: "100 Gbps DWDM" },
        { id: "ring-3-4", from: "r_node3", to: "r_node4", speed: "10 Gbps Fiber" },
        { id: "ring-4-5", from: "r_node4", to: "r_node5", speed: "10 Gbps Fiber" },
        { id: "ring-5-6", from: "r_node5", to: "r_node6", speed: "10 Gbps Fiber" },
        { id: "ring-6-7", from: "r_node6", to: "r_node7", speed: "100 Gbps DWDM" },
        { id: "ring-7-1", from: "r_node7", to: "r_node1", speed: "100 Gbps DWDM" }
      ]
    }
  },

  // 3. Full Mesh Topology
  mesh: {
    id: 'mesh',
    title: '🕸️ Full Mesh Topology (High-Resilience WAN)',
    desc: 'Every node has a direct physical link to every other node in the network. Provides maximum fault tolerance and the lowest possible latency, used in mission-critical aerospace and banking backbones.',
    data: {
      name: "High-Resilience Full Mesh Network",
      nodes: [
        { id: "m_core1", name: "Mesh Router Alpha", type: "router", ip: "172.16.1.1", department: "IT & Infrastructure", position: [-1.8, 2.1, -1.0] },
        { id: "m_core2", name: "Mesh Router Beta", type: "router", ip: "172.16.1.2", department: "Data Center", position: [1.8, 2.1, -1.0] },
        { id: "m_core3", name: "Mesh Router Gamma", type: "router", ip: "172.16.1.3", department: "Engineering & Dev", position: [2.4, 0.9, -1.0] },
        { id: "m_core4", name: "Mesh Router Delta", type: "router", ip: "172.16.1.4", department: "Finance & Accounting", position: [0.0, 0.5, -1.0] },
        { id: "m_core5", name: "Mesh Router Epsilon", type: "router", ip: "172.16.1.5", department: "DMZ & Perimeter", position: [-2.4, 0.9, -1.0] }
      ],
      links: [
        { id: "m-1-2", from: "m_core1", to: "m_core2", speed: "400 Gbps Optical" },
        { id: "m-1-3", from: "m_core1", to: "m_core3", speed: "400 Gbps Optical" },
        { id: "m-1-4", from: "m_core1", to: "m_core4", speed: "400 Gbps Optical" },
        { id: "m-1-5", from: "m_core1", to: "m_core5", speed: "400 Gbps Optical" },
        { id: "m-2-3", from: "m_core2", to: "m_core3", speed: "400 Gbps Optical" },
        { id: "m-2-4", from: "m_core2", to: "m_core4", speed: "400 Gbps Optical" },
        { id: "m-2-5", from: "m_core2", to: "m_core5", speed: "400 Gbps Optical" },
        { id: "m-3-4", from: "m_core3", to: "m_core4", speed: "400 Gbps Optical" },
        { id: "m-3-5", from: "m_core3", to: "m_core5", speed: "400 Gbps Optical" },
        { id: "m-4-5", from: "m_core4", to: "m_core5", speed: "400 Gbps Optical" }
      ]
    }
  },

  // 4. Linear Bus Topology
  bus: {
    id: 'bus',
    title: '🚌 Bus Topology (Backbone Trunk & Drops)',
    desc: 'Classic shared medium Ethernet bus. Nodes tap into a common linear trunk cable with 50-ohm terminators at both ends. Highlights signal reflection and collision domains.',
    data: {
      name: "Linear Bus Backbone Network",
      nodes: [
        { id: "term_left", name: "50-Ohm Terminator A", type: "firewall", ip: "10.0.0.254", department: "IT & Infrastructure", position: [-2.8, 1.5, -1.0] },
        { id: "bus_tap1", name: "Engineering Workstation", type: "desktop", ip: "10.0.0.11", department: "Engineering & Dev", position: [-1.9, 2.2, -1.0] },
        { id: "bus_trunk1", name: "Bus Tap 1", type: "switch", ip: "10.0.0.1", department: "IT & Infrastructure", position: [-1.9, 1.5, -1.0] },
        { id: "bus_tap2", name: "Finance Desktop", type: "desktop", ip: "10.0.0.12", department: "Finance & Accounting", position: [-0.7, 0.8, -1.0] },
        { id: "bus_trunk2", name: "Bus Tap 2", type: "switch", ip: "10.0.0.2", department: "IT & Infrastructure", position: [-0.7, 1.5, -1.0] },
        { id: "bus_tap3", name: "Department Laser Printer", type: "printer", ip: "10.0.0.13", department: "Operations & OT", position: [0.7, 2.2, -1.0] },
        { id: "bus_trunk3", name: "Bus Tap 3", type: "switch", ip: "10.0.0.3", department: "IT & Infrastructure", position: [0.7, 1.5, -1.0] },
        { id: "bus_tap4", name: "Staff Laptop", type: "laptop", ip: "10.0.0.14", department: "Sales & Marketing", position: [1.9, 0.8, -1.0] },
        { id: "bus_trunk4", name: "Bus Tap 4", type: "switch", ip: "10.0.0.4", department: "IT & Infrastructure", position: [1.9, 1.5, -1.0] },
        { id: "term_right", name: "50-Ohm Terminator B", type: "firewall", ip: "10.0.0.255", department: "IT & Infrastructure", position: [2.8, 1.5, -1.0] }
      ],
      links: [
        { id: "b-t1", from: "term_left", to: "bus_trunk1", speed: "10Base5 Coaxial" },
        { id: "b-t2", from: "bus_trunk1", to: "bus_trunk2", speed: "10Base5 Coaxial" },
        { id: "b-t3", from: "bus_trunk2", to: "bus_trunk3", speed: "10Base5 Coaxial" },
        { id: "b-t4", from: "bus_trunk3", to: "bus_trunk4", speed: "10Base5 Coaxial" },
        { id: "b-t5", from: "bus_trunk4", to: "term_right", speed: "10Base5 Coaxial" },
        { id: "b-d1", from: "bus_trunk1", to: "bus_tap1", speed: "AUI Drop Cable" },
        { id: "b-d2", from: "bus_trunk2", to: "bus_tap2", speed: "AUI Drop Cable" },
        { id: "b-d3", from: "bus_trunk3", to: "bus_tap3", speed: "AUI Drop Cable" },
        { id: "b-d4", from: "bus_trunk4", to: "bus_tap4", speed: "AUI Drop Cable" }
      ]
    }
  },

  // 5. Spine-and-Leaf Clos Architecture
  spineLeaf: {
    id: 'spineLeaf',
    title: '🌿 Spine-and-Leaf Data Center (Clos Architecture)',
    desc: 'The modern hyperscale data center standard. Every Leaf switch connects to every Spine switch. Eliminates Spanning Tree blocking and guarantees predictable, ultra-low latency east-west server communication.',
    data: {
      name: "Modern Spine-Leaf Data Center Fabric",
      nodes: [
        { id: "spine1", name: "Spine Switch 01", type: "switch", ip: "10.254.0.1", department: "Data Center", position: [-0.9, 2.3, -1.0] },
        { id: "spine2", name: "Spine Switch 02", type: "switch", ip: "10.254.0.2", department: "Data Center", position: [0.9, 2.3, -1.0] },
        { id: "leaf1", name: "Leaf ToR Switch 01", type: "switch", ip: "10.10.1.1", department: "Data Center", position: [-2.4, 1.4, -1.0] },
        { id: "leaf2", name: "Leaf ToR Switch 02", type: "switch", ip: "10.10.2.1", department: "Data Center", position: [-0.8, 1.4, -1.0] },
        { id: "leaf3", name: "Leaf ToR Switch 03", type: "switch", ip: "10.10.3.1", department: "Data Center", position: [0.8, 1.4, -1.0] },
        { id: "leaf4", name: "Leaf ToR Switch 04", type: "switch", ip: "10.10.4.1", department: "Data Center", position: [2.4, 1.4, -1.0] },
        { id: "srv_compute1", name: "Compute Server Rack 01", type: "server", ip: "10.10.1.10", department: "Data Center", position: [-2.4, 0.6, -1.0] },
        { id: "srv_compute2", name: "Compute Server Rack 02", type: "server", ip: "10.10.2.10", department: "Data Center", position: [-0.8, 0.6, -1.0] },
        { id: "srv_storage1", name: "NVMe Storage Cluster", type: "database", ip: "10.10.3.10", department: "Data Center", position: [0.8, 0.6, -1.0] },
        { id: "srv_storage2", name: "Kubernetes Worker Nodes", type: "server", ip: "10.10.4.10", department: "Data Center", position: [2.4, 0.6, -1.0] }
      ],
      links: [
        { id: "sl-s1-l1", from: "spine1", to: "leaf1", speed: "100 Gbps QSFP28" },
        { id: "sl-s1-l2", from: "spine1", to: "leaf2", speed: "100 Gbps QSFP28" },
        { id: "sl-s1-l3", from: "spine1", to: "leaf3", speed: "100 Gbps QSFP28" },
        { id: "sl-s1-l4", from: "spine1", to: "leaf4", speed: "100 Gbps QSFP28" },
        { id: "sl-s2-l1", from: "spine2", to: "leaf1", speed: "100 Gbps QSFP28" },
        { id: "sl-s2-l2", from: "spine2", to: "leaf2", speed: "100 Gbps QSFP28" },
        { id: "sl-s2-l3", from: "spine2", to: "leaf3", speed: "100 Gbps QSFP28" },
        { id: "sl-s2-l4", from: "spine2", to: "leaf4", speed: "100 Gbps QSFP28" },
        { id: "sl-l1-s1", from: "leaf1", to: "srv_compute1", speed: "25 Gbps SFP28" },
        { id: "sl-l2-s2", from: "leaf2", to: "srv_compute2", speed: "25 Gbps SFP28" },
        { id: "sl-l3-s3", from: "leaf3", to: "srv_storage1", speed: "25 Gbps SFP28" },
        { id: "sl-l4-s4", from: "leaf4", to: "srv_storage2", speed: "25 Gbps SFP28" }
      ]
    }
  },

  // 6. Campus Enterprise LAN & Wi-Fi 6
  campusWifi: {
    id: 'campusWifi',
    title: '📶 Campus Enterprise LAN & Wi-Fi 6 (WAPs, VoIP, Laptops)',
    desc: 'Corporate enterprise campus with core routing, PoE distribution switches, ceiling Wi-Fi 6 Access Points, VoIP telephony, executive laptops, and color printers.',
    data: {
      name: "Enterprise Campus LAN & Wireless Fabric",
      nodes: [
        { id: "c_router", name: "Campus Core Gateway", type: "router", ip: "10.0.0.1", department: "IT & Infrastructure", position: [-2.6, 1.8, -1.0] },
        { id: "c_poe_sw", name: "Campus PoE+ Switch", type: "switch", ip: "10.0.1.1", department: "IT & Infrastructure", position: [-1.4, 1.8, -1.0] },
        { id: "wap_fl1", name: "Wi-Fi 6 AP (Floor 1)", type: "wap", ip: "10.0.1.50", department: "Engineering & Dev", position: [0.0, 2.2, -1.0] },
        { id: "wap_fl2", name: "Wi-Fi 6 AP (Executive)", type: "wap", ip: "10.0.1.51", department: "Executive Suite", position: [0.0, 1.4, -1.0] },
        { id: "voip_phone", name: "Cisco IP Phone 8845", type: "phone", ip: "10.0.1.120", department: "Finance & Accounting", position: [0.0, 0.7, -1.0] },
        { id: "c_laptop1", name: "Engineering MacBook Pro", type: "laptop", ip: "10.0.20.15", department: "Engineering & Dev", position: [1.8, 2.4, -1.0] },
        { id: "c_laptop2", name: "Staff ThinkPad X1", type: "laptop", ip: "10.0.20.16", department: "Sales & Marketing", position: [1.8, 1.9, -1.0] },
        { id: "c_exec_lap", name: "CEO Executive Laptop", type: "laptop", ip: "10.0.50.5", department: "Executive Suite", position: [1.8, 1.4, -1.0] },
        { id: "c_printer", name: "Floor 1 Color Laser MFP", type: "printer", ip: "10.0.30.200", department: "Finance & Accounting", position: [1.8, 0.7, -1.0] }
      ],
      links: [
        { id: "c-r-sw", from: "c_router", to: "c_poe_sw", speed: "10 Gbps SFP+" },
        { id: "c-sw-wap1", from: "c_poe_sw", to: "wap_fl1", speed: "PoE+ 2.5 Gbps mGig" },
        { id: "c-sw-wap2", from: "c_poe_sw", to: "wap_fl2", speed: "PoE+ 2.5 Gbps mGig" },
        { id: "c-sw-phone", from: "c_poe_sw", to: "voip_phone", speed: "PoE 1 Gbps Voice VLAN" },
        { id: "c-wap1-lap1", from: "wap_fl1", to: "c_laptop1", speed: "Wi-Fi 6 1200 Mbps" },
        { id: "c-wap1-lap2", from: "wap_fl1", to: "c_laptop2", speed: "Wi-Fi 6 866 Mbps" },
        { id: "c-wap2-exec", from: "wap_fl2", to: "c_exec_lap", speed: "Wi-Fi 6 2400 Mbps" },
        { id: "c-sw-prn", from: "c_poe_sw", to: "c_printer", speed: "1 Gbps Copper" }
      ]
    }
  },

  // 7. Industrial IoT / SCADA & OT Network
  iot: {
    id: 'iot',
    title: '🏭 Industrial IoT & SCADA (Purdue OT Model)',
    desc: 'Critical infrastructure network with isolated Operational Technology (OT) DMZ, SCADA historian server, human-machine interface (HMI), and PLC industrial field controllers.',
    data: {
      name: "Industrial SCADA & OT Purdue Network",
      nodes: [
        { id: "ot_firewall", name: "Industrial OT Firewall", type: "firewall", ip: "192.168.100.1", department: "DMZ & Perimeter", position: [-2.6, 1.5, -1.0] },
        { id: "scada_server", name: "SCADA Historian Server", type: "server", ip: "192.168.100.10", department: "Operations & OT", position: [-1.4, 2.0, -1.0] },
        { id: "hmi_workstation", name: "Factory Floor HMI Console", type: "desktop", ip: "192.168.100.20", department: "Operations & OT", position: [-1.4, 1.0, -1.0] },
        { id: "ot_switch", name: "DIN-Rail Industrial Switch", type: "switch", ip: "192.168.100.2", department: "Operations & OT", position: [0.0, 1.5, -1.0] },
        { id: "plc_controller1", name: "Assembly Line PLC Unit 01", type: "iot", ip: "192.168.100.101", department: "Operations & OT", position: [1.8, 2.1, -1.0] },
        { id: "plc_controller2", name: "Robotic Arm PLC Unit 02", type: "iot", ip: "192.168.100.102", department: "Operations & OT", position: [1.8, 1.5, -1.0] },
        { id: "iot_sensor", name: "Vibration & Temp IoT Sensors", type: "iot", ip: "192.168.100.103", department: "Operations & OT", position: [1.8, 0.9, -1.0] }
      ],
      links: [
        { id: "ot-fw-sw", from: "ot_firewall", to: "ot_switch", speed: "1 Gbps Ruggedized" },
        { id: "ot-sw-hist", from: "ot_switch", to: "scada_server", speed: "1 Gbps Copper" },
        { id: "ot-sw-hmi", from: "ot_switch", to: "hmi_workstation", speed: "1 Gbps Copper" },
        { id: "ot-sw-plc1", from: "ot_switch", to: "plc_controller1", speed: "100 Mbps Modbus/TCP" },
        { id: "ot-sw-plc2", from: "ot_switch", to: "plc_controller2", speed: "100 Mbps EtherNet/IP" },
        { id: "ot-sw-sens", from: "ot_switch", to: "iot_sensor", speed: "100 Mbps PROFINET" }
      ]
    }
  },

  // 8. Cisco 3-Tier Enterprise Network (Default)
  corporate: {
    id: 'corporate',
    title: '🏢 Corporate Network (Dept-Wise)',
    desc: 'Full enterprise network with perimeter firewall, core router, department switches, server blades, workstations, executive laptops, and shared network printers.',
    data: {
      name: "Corporate Enterprise Network",
      nodes: [
        { id: "inet", name: "Global Internet WAN", type: "internet", ip: "198.51.100.1", department: "DMZ & Perimeter", subnet: "Public WAN", position: [-3.0, 1.5, -1.0] },
        { id: "fw1", name: "Edge Security Firewall", type: "firewall", ip: "192.168.1.1", department: "DMZ & Perimeter", subnet: "Perimeter", position: [-2.0, 1.5, -1.0] },
        { id: "r_core", name: "Core Layer 3 Router", type: "router", ip: "10.0.0.1", department: "IT & Infrastructure", subnet: "Backbone", position: [-1.0, 1.5, -1.0] },
        { id: "sw_it", name: "DataCenter Switch", type: "switch", ip: "10.0.10.1", department: "Data Center", subnet: "VLAN 10 DC", position: [0.4, 2.05, -1.0] },
        { id: "sw_eng", name: "Engineering Switch", type: "switch", ip: "10.0.20.1", department: "Engineering & Dev", subnet: "VLAN 20 Eng", position: [0.4, 1.45, -1.0] },
        { id: "sw_fin", name: "Finance Office Switch", type: "switch", ip: "10.0.30.1", department: "Finance & Accounting", subnet: "VLAN 30 Fin", position: [0.4, 0.85, -1.0] },
        { id: "srv1", name: "Enterprise App Server", type: "server", ip: "10.0.10.11", department: "Data Center", subnet: "VLAN 10 DC", position: [2.0, 2.30, -1.0] },
        { id: "srv2", name: "Primary Database Server", type: "database", ip: "10.0.10.12", department: "Data Center", subnet: "VLAN 10 DC", position: [2.0, 1.85, -1.0] },
        { id: "pc_eng", name: "Dev Workstation 01", type: "desktop", ip: "10.0.20.101", department: "Engineering & Dev", subnet: "VLAN 20 Eng", position: [2.0, 1.45, -1.0] },
        { id: "lap_exec", name: "Executive MacBook Pro", type: "laptop", ip: "10.0.20.105", department: "Executive Suite", subnet: "VLAN 20 Eng", position: [2.9, 1.45, -1.0] },
        { id: "pc_fin", name: "Finance Desktop PC", type: "desktop", ip: "10.0.30.101", department: "Finance & Accounting", subnet: "VLAN 30 Fin", position: [2.0, 0.95, -1.0] },
        { id: "prn_fin", name: "Finance Laser Printer", type: "printer", ip: "10.0.30.201", department: "Finance & Accounting", subnet: "VLAN 30 Fin", position: [2.9, 0.70, -1.0] }
      ],
      links: [
        { id: "link-inet-fw1", from: "inet", to: "fw1", speed: "10 Gbps Fiber" },
        { id: "link-fw1-rcore", from: "fw1", to: "r_core", speed: "10 Gbps Fiber" },
        { id: "link-rcore-swit", from: "r_core", to: "sw_it", speed: "40 Gbps QSFP" },
        { id: "link-rcore-sweng", from: "r_core", to: "sw_eng", speed: "10 Gbps SFP+" },
        { id: "link-rcore-swfin", from: "r_core", to: "sw_fin", speed: "10 Gbps SFP+" },
        { id: "link-swit-srv1", from: "sw_it", to: "srv1", speed: "10 Gbps Copper" },
        { id: "link-swit-srv2", from: "sw_it", to: "srv2", speed: "10 Gbps Copper" },
        { id: "link-sweng-pceng", from: "sw_eng", to: "pc_eng", speed: "1 Gbps Copper" },
        { id: "link-sweng-lapexec", from: "sw_eng", to: "lap_exec", speed: "1 Gbps Copper" },
        { id: "link-swfin-pcfin", from: "sw_fin", to: "pc_fin", speed: "1 Gbps Copper" },
        { id: "link-swfin-prnfin", from: "sw_fin", to: "prn_fin", speed: "100 Mbps Copper" },
        { id: "link-backup-eng-fin", from: "sw_eng", to: "sw_fin", speed: "10 Gbps Backup STP" }
      ]
    }
  },

  // 9. 3-Tier Cloud Web Architecture
  threeTier: {
    id: 'threeTier',
    title: '☁️ 3-Tier Web App Architecture',
    desc: 'Production cloud web stack: Cloudflare WAF, Load Balancer, Web cluster, Application tier, Primary DB & Read Replica.',
    data: {
      name: "3-Tier Cloud Web Architecture",
      nodes: [
        { id: "users", name: "Public Web Clients", type: "desktop", ip: "203.0.113.42", department: "DMZ & Perimeter", subnet: "Public Internet", position: [-2.8, 1.5, -1.0] },
        { id: "waf", name: "Cloudflare WAF", type: "cloud", ip: "104.16.24.1", department: "DMZ & Perimeter", subnet: "Cloud Edge", position: [-1.8, 1.5, -1.0] },
        { id: "lb", name: "HA Load Balancer", type: "loadbalancer", ip: "10.100.0.1", department: "IT & Infrastructure", subnet: "DMZ Subnet", position: [-0.8, 1.5, -1.0] },
        { id: "web1", name: "NGINX Web Server 01", type: "server", ip: "10.100.1.11", department: "Engineering & Dev", subnet: "Web Tier", position: [0.4, 1.9, -1.0] },
        { id: "web2", name: "NGINX Web Server 02", type: "server", ip: "10.100.1.12", department: "Engineering & Dev", subnet: "Web Tier", position: [0.4, 1.1, -1.0] },
        { id: "app1", name: "Core API Server 01", type: "server", ip: "10.100.2.21", department: "Engineering & Dev", subnet: "App Tier", position: [1.6, 1.9, -1.0] },
        { id: "app2", name: "Core API Server 02", type: "server", ip: "10.100.2.22", department: "Engineering & Dev", subnet: "App Tier", position: [1.6, 1.1, -1.0] },
        { id: "db_pri", name: "Primary PostgreSQL", type: "database", ip: "10.100.3.50", department: "Data Center", subnet: "DB Tier", position: [2.7, 1.8, -1.0] },
        { id: "db_rep", name: "Replica PostgreSQL", type: "database", ip: "10.100.3.51", department: "Data Center", subnet: "DB Tier", position: [2.7, 1.2, -1.0] }
      ],
      links: [
        { id: "l-usr-waf", from: "users", to: "waf" },
        { id: "l-waf-lb", from: "waf", to: "lb" },
        { id: "l-lb-web1", from: "lb", to: "web1" },
        { id: "l-lb-web2", from: "lb", to: "web2" },
        { id: "l-w1-app1", from: "web1", to: "app1" },
        { id: "l-w2-app2", from: "web2", to: "app2" },
        { id: "l-w1-app2", from: "web1", to: "app2" },
        { id: "l-w2-app1", from: "web2", to: "app1" },
        { id: "l-app1-db1", from: "app1", to: "db_pri" },
        { id: "l-app2-db1", from: "app2", to: "db_pri" },
        { id: "l-db1-db2", from: "db_pri", to: "db_rep" }
      ]
    }
  },

  // 10. SD-WAN Branch Office VPN
  sdwan: {
    id: 'sdwan',
    title: '🌐 SD-WAN Branch Office VPN',
    desc: 'Connecting Headquarters LAN through an encrypted SD-WAN tunnel over public Internet to remote branch office desktops and printers.',
    data: {
      name: "SD-WAN Enterprise Topology",
      nodes: [
        { id: "hq_srv", name: "HQ Core File Server", type: "server", ip: "10.1.0.10", department: "Data Center", subnet: "HQ DataCenter", position: [-2.6, 1.8, -1.0] },
        { id: "hq_sw", name: "HQ Core Switch", type: "switch", ip: "10.1.0.1", department: "IT & Infrastructure", subnet: "HQ Core", position: [-1.6, 1.8, -1.0] },
        { id: "hq_gw", name: "HQ SD-WAN Edge Gateway", type: "router", ip: "198.51.10.1", department: "IT & Infrastructure", subnet: "HQ Perimeter", position: [-0.6, 1.8, -1.0] },
        { id: "wan", name: "Carrier ISP WAN Cloud", type: "cloud", ip: "203.0.113.1", department: "DMZ & Perimeter", subnet: "Underlay WAN", position: [0.0, 1.4, -1.0] },
        { id: "br_gw", name: "Branch SD-WAN Router", type: "router", ip: "198.51.20.1", department: "Operations & OT", subnet: "Branch Gateway", position: [0.7, 1.1, -1.0] },
        { id: "br_sw", name: "Branch Office Switch", type: "switch", ip: "10.2.0.1", department: "Operations & OT", subnet: "Branch LAN", position: [1.7, 1.1, -1.0] },
        { id: "br_pc1", name: "Branch Desktop PC", type: "desktop", ip: "10.2.0.101", department: "Sales & Marketing", subnet: "Branch LAN", position: [2.7, 1.5, -1.0] },
        { id: "br_lap", name: "Branch Staff Laptop", type: "laptop", ip: "10.2.0.102", department: "Sales & Marketing", subnet: "Branch LAN", position: [2.7, 1.1, -1.0] },
        { id: "br_prn", name: "Branch Network Printer", type: "printer", ip: "10.2.0.201", department: "Operations & OT", subnet: "Branch LAN", position: [2.7, 0.7, -1.0] }
      ],
      links: [
        { id: "l-hq-srv-sw", from: "hq_srv", to: "hq_sw" },
        { id: "l-hq-sw-gw", from: "hq_sw", to: "hq_gw" },
        { id: "l-hq-wan", from: "hq_gw", to: "wan" },
        { id: "l-wan-br", from: "wan", to: "br_gw" },
        { id: "l-br-sw", from: "br_gw", to: "br_sw" },
        { id: "l-br-pc1", from: "br_sw", to: "br_pc1" },
        { id: "l-br-lap", from: "br_sw", to: "br_lap" },
        { id: "l-br-prn", from: "br_sw", to: "br_prn" }
      ]
    }
  },

  // 11. Site-to-Site IPsec VPN & Remote Access
  vpn_ipsec: {
    id: 'vpn_ipsec',
    title: '🔒 Site-to-Site IPsec VPN (Encrypted Tunnel)',
    desc: 'Enterprise branch interconnection traversing untrusted public Internet. Shows encapsulated IKEv2 / IPsec ESP encrypted tunnels, security associations (SAs), and remote worker AnyConnect tunnels.',
    data: {
      name: "IPsec Cryptographic VPN Network",
      nodes: [
        { id: "hq_db", name: "HQ Core Database & ERP", type: "database", ip: "10.100.1.10", department: "Data Center", vlan: "VLAN 100", position: [-2.6, 2.2, -1.0] },
        { id: "hq_core", name: "HQ Core Switch (C9300)", type: "switch", ip: "10.100.1.1", department: "IT & Infrastructure", vlan: "VLAN 100", position: [-2.6, 1.4, -1.0] },
        { id: "hq_vpn", name: "HQ IPsec VPN Concentrator", type: "vpn", ip: "198.51.100.2", department: "DMZ & Perimeter", firmware: "Cisco ASA 5545-X (IKEv2/AES-256)", position: [-1.4, 1.4, -1.0] },
        { id: "inet_wan", name: "Public Internet WAN ISP", type: "internet", ip: "203.0.113.1", department: "DMZ & Perimeter", position: [0.0, 2.1, -1.0] },
        { id: "remote_lap", name: "Remote Exec (AnyConnect)", type: "laptop", ip: "172.16.50.25", department: "Executive Suite", firmware: "Cisco AnyConnect SSL/IPsec", position: [0.0, 0.7, -1.0] },
        { id: "br_vpn", name: "Branch IPsec Router (ISR 4331)", type: "vpn", ip: "203.0.113.50", department: "DMZ & Perimeter", firmware: "Cisco IOS-XE (ESP Tunnel Mode)", position: [1.4, 1.4, -1.0] },
        { id: "br_sw_vpn", name: "Branch LAN Switch", type: "switch", ip: "192.168.10.1", department: "IT & Infrastructure", vlan: "VLAN 10", position: [2.5, 1.4, -1.0] },
        { id: "br_workstation", name: "Branch Finance Desktop", type: "desktop", ip: "192.168.10.101", department: "Finance & Accounting", vlan: "VLAN 10", position: [2.5, 2.2, -1.0] },
        { id: "br_printer", name: "Branch Office Laser Printer", type: "printer", ip: "192.168.10.200", department: "Operations & OT", vlan: "VLAN 10", position: [2.5, 0.7, -1.0] }
      ],
      links: [
        { id: "l-hq-db", from: "hq_db", to: "hq_core", cable: "dac", speed: "10 Gbps SFP+ Twinax DAC" },
        { id: "l-hq-core-vpn", from: "hq_core", to: "hq_vpn", cable: "smf", speed: "10 Gbps Single-Mode Fiber OS2" },
        { id: "l-hq-wan", from: "hq_vpn", to: "inet_wan", cable: "smf", speed: "1 Gbps Carrier Metro Ethernet" },
        { id: "l-vpn-tunnel", from: "hq_vpn", to: "br_vpn", cable: "vpn_tunnel", speed: "IPsec IKEv2 ESP Tunnel (AES-256-GCM / SHA-384)" },
        { id: "l-br-wan", from: "inet_wan", to: "br_vpn", cable: "smf", speed: "1 Gbps Carrier Fiber DIA" },
        { id: "l-rem-tunnel", from: "remote_lap", to: "hq_vpn", cable: "vpn_tunnel", speed: "Remote-Access SSL/TLS VPN Tunnel" },
        { id: "l-br-vpn-sw", from: "br_vpn", to: "br_sw_vpn", cable: "cat6", speed: "1 Gbps Cat6 Copper UTP" },
        { id: "l-br-sw-pc", from: "br_sw_vpn", to: "br_workstation", cable: "cat6", speed: "1 Gbps Cat6 Copper UTP" },
        { id: "l-br-sw-prn", from: "br_sw_vpn", to: "br_printer", cable: "cat6", speed: "1 Gbps Cat6 Copper UTP" }
      ]
    }
  },

  // 12. Virtualization, Hypervisors, VMs & Containers
  virtualization: {
    id: 'virtualization',
    title: '🖥️ Virtualization & Cloud (ESXi, vSwitch & Containers)',
    desc: 'Bare-metal Type-1 hypervisor architecture. Demonstrates Virtual Distributed Switches (vSwitches), virtual NICs (vNICs), virtual machines (VMs), Docker container pods, and SAN storage uplinks.',
    data: {
      name: "Bare-Metal Virtualization & Hypervisor Fabric",
      nodes: [
        { id: "esxi_host", name: "ESXi Bare-Metal Host", type: "hypervisor", ip: "10.0.1.10", department: "Data Center", firmware: "VMware ESXi 8.0 (Type-1 Bare-Metal)", position: [-1.8, 1.5, -1.0] },
        { id: "vswitch0", name: "vSwitch0 (Virtual Switch)", type: "switch", ip: "10.0.1.11", department: "Data Center", firmware: "vSphere Distributed Switch 8.0", position: [-0.6, 1.5, -1.0] },
        { id: "vm_web", name: "VM-Web-01 (NGINX)", type: "vm", ip: "10.0.1.21", department: "Data Center", firmware: "Ubuntu 22.04 LTS (4 vCPU, 8GB vRAM)", position: [0.7, 2.2, -1.0] },
        { id: "vm_db", name: "VM-DB-01 (PostgreSQL)", type: "vm", ip: "10.0.1.22", department: "Data Center", firmware: "RHEL 9 (8 vCPU, 32GB vRAM)", position: [0.7, 1.5, -1.0] },
        { id: "cont_api", name: "Container-Pod (Docker)", type: "container", ip: "10.0.1.30", department: "Engineering & Dev", firmware: "Alpine Linux Container (Node.js API)", position: [0.7, 0.8, -1.0] },
        { id: "san_storage", name: "NVMe-oF SAN Storage Array", type: "database", ip: "10.0.1.5", department: "Data Center", firmware: "All-Flash SAN Array (100Gbps Fibre Channel)", position: [-2.8, 2.2, -1.0] },
        { id: "tor_switch", name: "Physical ToR Switch (Nexus)", type: "switch", ip: "10.0.1.1", department: "IT & Infrastructure", firmware: "Cisco Nexus 9300 (NX-OS 10.3)", position: [-2.8, 0.8, -1.0] },
        { id: "admin_laptop", name: "vSphere Admin Laptop", type: "laptop", ip: "10.0.1.100", department: "IT & Infrastructure", position: [-1.8, 0.2, -1.0] }
      ],
      links: [
        { id: "l-host-vsw", from: "esxi_host", to: "vswitch0", cable: "dac", speed: "Internal Hypervisor VMkernel Bus" },
        { id: "l-vsw-vm1", from: "vswitch0", to: "vm_web", cable: "cat6", speed: "Virtual vNIC (VMXNET3 10Gbps)" },
        { id: "l-vsw-vm2", from: "vswitch0", to: "vm_db", cable: "cat6", speed: "Virtual vNIC (VMXNET3 10Gbps)" },
        { id: "l-vsw-cont", from: "vswitch0", to: "cont_api", cable: "cat6", speed: "Container veth Virtual Bridge" },
        { id: "l-host-san", from: "esxi_host", to: "san_storage", cable: "mmf", speed: "32 Gbps Fibre Channel OM4 MMF" },
        { id: "l-host-tor", from: "esxi_host", to: "tor_switch", cable: "dac", speed: "2x 25 Gbps SFP28 802.3ad LACP Uplink" },
        { id: "l-tor-admin", from: "tor_switch", to: "admin_laptop", cable: "cat6", speed: "1 Gbps Cat6 Copper UTP" }
      ]
    }
  },

  // 13. Hybrid Cloud Architecture (On-Premises to AWS VPC)
  cloud_hybrid: {
    id: 'cloud_hybrid',
    title: '☁️ Hybrid Cloud (AWS VPC & DirectConnect)',
    desc: 'Enterprise hybrid cloud interconnection. Bridges on-premises corporate infrastructure with AWS Virtual Private Cloud (VPC), Transit Gateway, EC2 compute instances, and S3 object storage.',
    data: {
      name: "Enterprise Hybrid Cloud & AWS VPC",
      nodes: [
        { id: "onprem_core", name: "On-Prem Core Router (ASR 1000)", type: "router", ip: "10.10.0.1", department: "IT & Infrastructure", position: [-2.5, 1.5, -1.0] },
        { id: "onprem_srv", name: "On-Prem Legacy Server", type: "server", ip: "10.10.1.20", department: "Data Center", position: [-2.5, 2.3, -1.0] },
        { id: "dx_circuit", name: "AWS DirectConnect Gateway", type: "cloud_vpc", ip: "10.254.1.1", department: "DMZ & Perimeter", firmware: "AWS DirectConnect 10Gbps Dedicated Interconnect", position: [-1.2, 1.5, -1.0] },
        { id: "aws_tgw", name: "AWS Transit Gateway Hub", type: "router", ip: "172.20.0.1", department: "Data Center", firmware: "AWS Transit Gateway (BGP ASN 64512)", position: [0.1, 1.5, -1.0] },
        { id: "aws_ec2_web", name: "AWS EC2 Web Cluster (VPC)", type: "cloud_vpc", ip: "172.20.1.50", department: "Engineering & Dev", firmware: "Amazon Linux 2023 (t4g.xlarge)", position: [1.5, 2.2, -1.0] },
        { id: "aws_rds_db", name: "AWS Aurora Serverless DB", type: "database", ip: "172.20.2.100", department: "Data Center", firmware: "Amazon Aurora Multi-AZ Cluster", position: [1.5, 1.5, -1.0] },
        { id: "aws_s3_buck", name: "AWS S3 Cloud Bucket", type: "cloud", ip: "172.20.3.10", department: "Data Center", position: [1.5, 0.8, -1.0] }
      ],
      links: [
        { id: "l-onprem-core-srv", from: "onprem_core", to: "onprem_srv", cable: "cat6", speed: "10 Gbps Copper Cat6a" },
        { id: "l-onprem-dx", from: "onprem_core", to: "dx_circuit", cable: "smf", speed: "10 Gbps Single-Mode Fiber DirectConnect" },
        { id: "l-dx-tgw", from: "dx_circuit", to: "aws_tgw", cable: "smf", speed: "AWS Cloud Backbone Fabric" },
        { id: "l-tgw-ec2", from: "aws_tgw", to: "aws_ec2_web", cable: "smf", speed: "VPC Peering 100 Gbps ENA" },
        { id: "l-tgw-db", from: "aws_tgw", to: "aws_rds_db", cable: "smf", speed: "VPC Peering 100 Gbps ENA" },
        { id: "l-tgw-s3", from: "aws_tgw", to: "aws_s3_buck", cable: "smf", speed: "AWS VPC S3 Gateway Endpoint" }
      ]
    }
  },

  // 14. CCNA 802.1Q VLAN Trunking & Router-on-a-Stick
  vlan_segmentation: {
    id: 'vlan_segmentation',
    title: '🏷️ 802.1Q VLANs & Router-on-a-Stick (Segmentation)',
    desc: 'Core CCNA topic: Layer 2 broadcast domain isolation with 802.1Q VLAN tagging and Layer 3 inter-VLAN routing via single physical trunk with subinterfaces (Router-on-a-Stick).',
    data: {
      name: "CCNA 802.1Q Inter-VLAN Routing Fabric",
      nodes: [
        { id: "roas_router", name: "Cisco Router-on-a-Stick", type: "router", ip: "192.168.0.1", department: "IT & Infrastructure", firmware: "Cisco IOS-XE (G0/0.10, G0/0.20, G0/0.30)", position: [-1.8, 1.5, -1.0] },
        { id: "core_trunk_sw", name: "Trunk Switch (Catalyst 9300)", type: "switch", ip: "192.168.0.2", department: "IT & Infrastructure", firmware: "802.1Q Trunk Port (Native VLAN 99)", position: [-0.6, 1.5, -1.0] },
        { id: "pc_vlan10", name: "Sales Workstation", type: "desktop", ip: "192.168.10.15", department: "Sales & Marketing", vlan: "VLAN 10 Sales", position: [1.2, 2.3, -1.0] },
        { id: "pc_vlan20", name: "Engineering Dev Box", type: "desktop", ip: "192.168.20.25", department: "Engineering & Dev", vlan: "VLAN 20 Eng", position: [1.2, 1.6, -1.0] },
        { id: "phone_vlan30", name: "VoIP Desk Phone", type: "phone", ip: "192.168.30.50", department: "Operations & OT", vlan: "VLAN 30 Voice", position: [1.2, 0.9, -1.0] },
        { id: "srv_vlan99", name: "Management Server", type: "server", ip: "192.168.99.10", department: "Data Center", vlan: "VLAN 99 Mgmt", position: [1.2, 0.2, -1.0] }
      ],
      links: [
        { id: "l-roas-trunk", from: "roas_router", to: "core_trunk_sw", cable: "cat6", speed: "802.1Q Dot1Q Trunk (Tagged 10,20,30, Native 99)" },
        { id: "l-sw-vlan10", from: "core_trunk_sw", to: "pc_vlan10", cable: "cat6", speed: "Access Port (Untagged VLAN 10)" },
        { id: "l-sw-vlan20", from: "core_trunk_sw", to: "pc_vlan20", cable: "cat6", speed: "Access Port (Untagged VLAN 20)" },
        { id: "l-sw-vlan30", from: "core_trunk_sw", to: "phone_vlan30", cable: "cat6", speed: "Voice VLAN Port (Tagged 30, Data 10)" },
        { id: "l-sw-vlan99", from: "core_trunk_sw", to: "srv_vlan99", cable: "cat6", speed: "Access Port (Untagged VLAN 99)" }
      ]
    }
  },

  // 15. CCNA OSPFv2 Multi-Area Dynamic Routing
  ospf_routing: {
    id: 'ospf_routing',
    title: '🔀 OSPF Dynamic Multi-Area Routing (Link-State)',
    desc: 'Core CCNA dynamic routing topic. Open Shortest Path First (OSPFv2) Dijkstra algorithm with Area 0 Backbone, Area 1 (HQ), and Area 2 (Branch), Cost metrics, and designated routers (DR/BDR).',
    data: {
      name: "OSPFv2 Multi-Area Dynamic Routing Lab",
      nodes: [
        { id: "ospf_abr", name: "Area Border Router (ABR)", type: "router", ip: "10.0.0.1", department: "IT & Infrastructure", firmware: "OSPFv2 Process 1 (RID: 1.1.1.1, Area 0/1/2)", position: [0.0, 1.8, -1.0] },
        { id: "ospf_r1", name: "HQ Internal Router (Area 1)", type: "router", ip: "10.1.0.1", department: "Engineering & Dev", firmware: "OSPFv2 Process 1 (RID: 2.2.2.2, Area 1)", position: [-1.8, 1.3, -1.0] },
        { id: "ospf_r2", name: "Branch Internal Router (Area 2)", type: "router", ip: "10.2.0.1", department: "Finance & Accounting", firmware: "OSPFv2 Process 1 (RID: 3.3.3.3, Area 2)", position: [1.8, 1.3, -1.0] },
        { id: "sw_ospf1", name: "HQ Area 1 Switch", type: "switch", ip: "10.1.1.1", department: "Engineering & Dev", position: [-2.6, 0.6, -1.0] },
        { id: "sw_ospf2", name: "Branch Area 2 Switch", type: "switch", ip: "10.2.1.1", department: "Finance & Accounting", position: [2.6, 0.6, -1.0] },
        { id: "pc_ospf1", name: "HQ Dev Engineer PC", type: "desktop", ip: "10.1.1.100", department: "Engineering & Dev", position: [-1.4, 0.3, -1.0] },
        { id: "pc_ospf2", name: "Branch Finance PC", type: "desktop", ip: "10.2.1.100", department: "Finance & Accounting", position: [1.4, 0.3, -1.0] }
      ],
      links: [
        { id: "l-ospf-abr-r1", from: "ospf_abr", to: "ospf_r1", cable: "smf", speed: "10 Gbps Fiber (OSPF Cost: 1, Area 1)" },
        { id: "l-ospf-abr-r2", from: "ospf_abr", to: "ospf_r2", cable: "smf", speed: "10 Gbps Fiber (OSPF Cost: 1, Area 2)" },
        { id: "l-ospf-r1-sw", from: "ospf_r1", to: "sw_ospf1", cable: "cat6", speed: "1 Gbps Copper (OSPF Cost: 10, Area 1)" },
        { id: "l-ospf-r2-sw", from: "ospf_r2", to: "sw_ospf2", cable: "cat6", speed: "1 Gbps Copper (OSPF Cost: 10, Area 2)" },
        { id: "l-sw1-pc", from: "sw_ospf1", to: "pc_ospf1", cable: "cat6", speed: "1 Gbps Cat6 UTP (Edge Access)" },
        { id: "l-sw2-pc", from: "sw_ospf2", to: "pc_ospf2", cable: "cat6", speed: "1 Gbps Cat6 UTP (Edge Access)" }
      ]
    }
  },

  // 16. Spanning Tree Protocol (STP) & EtherChannel Port Bundling (LACP)
  stp_etherchannel: {
    id: 'stp_etherchannel',
    title: '🛡️ STP & EtherChannel (LACP Bundling & Loop Elimination)',
    desc: 'Core CCNA Layer 2 switching architecture. Demonstrates Spanning Tree Protocol (Root Bridge election, Root Ports, Designated Ports, Alternate/Blocking loop-free ports) combined with 802.3ad LACP EtherChannel link aggregation.',
    data: {
      name: "STP & EtherChannel Lab",
      nodes: [
        { id: "sw_root", name: "Root Bridge Switch (Priority: 24576)", type: "switch", ip: "192.168.10.1", department: "IT & Infrastructure", firmware: "Cisco Catalyst 9300 (PVST+ Root for VLAN 10/20)", position: [0.0, 1.8, -1.0] },
        { id: "sw_dist", name: "Distribution Switch B (Priority: 28672)", type: "switch", ip: "192.168.10.2", department: "Engineering & Dev", firmware: "Cisco Catalyst 9300 (Secondary Root)", position: [-1.8, 1.1, -1.0] },
        { id: "sw_acc", name: "Access Switch C (Priority: 32768)", type: "switch", ip: "192.168.10.3", department: "Finance & Accounting", firmware: "Cisco Catalyst 2960X", position: [1.8, 1.1, -1.0] },
        { id: "pc_v10", name: "Engineering PC (VLAN 10)", type: "desktop", ip: "192.168.10.15", department: "Engineering & Dev", position: [-1.8, 0.3, -1.0] },
        { id: "pc_v20", name: "Finance PC (VLAN 20)", type: "desktop", ip: "192.168.20.25", department: "Finance & Accounting", position: [1.8, 0.3, -1.0] }
      ],
      links: [
        { id: "l-po1-a", from: "sw_root", to: "sw_dist", cable: "dac", speed: "10 Gbps (Po1 Bundled Member Gi0/1 - LACP Active)" },
        { id: "l-po1-b", from: "sw_dist", to: "sw_root", cable: "dac", speed: "10 Gbps (Po1 Bundled Member Gi0/2 - LACP Active)" },
        { id: "l-root-acc", from: "sw_root", to: "sw_acc", cable: "cat6", speed: "1 Gbps (Root Port - Forwarding State)" },
        { id: "l-dist-acc", from: "sw_dist", to: "sw_acc", cable: "cat6", speed: "1 Gbps (STP Alternate Port - Blocking State / Loop-Free)" },
        { id: "l-dist-pc10", from: "sw_dist", to: "pc_v10", cable: "cat6", speed: "1 Gbps Cat6 UTP (VLAN 10 Access)" },
        { id: "l-acc-pc20", from: "sw_acc", to: "pc_v20", cable: "cat6", speed: "1 Gbps Cat6 UTP (VLAN 20 Access)" }
      ]
    }
  },

  // 17. First Hop Redundancy Protocols (HSRP / VRRP Default Gateway Redundancy)
  fhrp_hsrp: {
    id: 'fhrp_hsrp',
    title: '🔄 FHRP (HSRP / VRRP) High Availability Gateway Lab',
    desc: 'Cisco First Hop Redundancy Protocol (HSRP). R1 (Active Priority 110 Preempt) and R2 (Standby Priority 100) share Virtual IP 192.168.1.254 and Virtual MAC 0000.0c07.ac01 to provide transparent zero-downtime client failover.',
    data: {
      name: "HSRP / VRRP High Availability Lab",
      nodes: [
        { id: "hsrp_inet", name: "Upstream ISP WAN Gateway", type: "internet", ip: "198.51.100.1", department: "IT & Infrastructure", firmware: "BGP / Edge ISP Core", position: [0.0, 2.3, -1.0] },
        { id: "r1_active", name: "R1-Active (Pri: 110 Preempt)", type: "router", ip: "192.168.1.1", department: "IT & Infrastructure", firmware: "Cisco ISR 4331 (HSRP Group 1 State: ACTIVE)", position: [-1.6, 1.6, -1.0] },
        { id: "r2_standby", name: "R2-Standby (Pri: 100)", type: "router", ip: "192.168.1.2", department: "IT & Infrastructure", firmware: "Cisco ISR 4331 (HSRP Group 1 State: STANDBY)", position: [1.6, 1.6, -1.0] },
        { id: "sw_hsrp_core", name: "Campus Core Switch (VIP: 192.168.1.254)", type: "switch", ip: "192.168.1.10", department: "IT & Infrastructure", position: [0.0, 0.9, -1.0] },
        { id: "pc_hsrp_client", name: "Client PC (DG: 192.168.1.254)", type: "desktop", ip: "192.168.1.50", department: "Engineering & Dev", position: [0.0, 0.2, -1.0] }
      ],
      links: [
        { id: "l-r1-inet", from: "r1_active", to: "hsrp_inet", cable: "smf", speed: "10 Gbps SMF (Active Primary WAN)" },
        { id: "l-r2-inet", from: "r2_standby", to: "hsrp_inet", cable: "smf", speed: "10 Gbps SMF (Standby Backup WAN)" },
        { id: "l-r1-core", from: "r1_active", to: "sw_hsrp_core", cable: "cat6", speed: "1 Gbps Copper (Active Forwarding to VIP)" },
        { id: "l-r2-core", from: "r2_standby", to: "sw_hsrp_core", cable: "cat6", speed: "1 Gbps Copper (Standby Listening Hellos 3s/10s)" },
        { id: "l-core-pc", from: "sw_hsrp_core", to: "pc_hsrp_client", cable: "cat6", speed: "1 Gbps Cat6 UTP (Host Default Gateway 192.168.1.254)" }
      ]
    }
  },

  // 18. Network Address Translation (Static NAT, Dynamic NAT & PAT Overload)
  nat_pat: {
    id: 'nat_pat',
    title: '🌐 NAT / PAT (Private RFC 1918 to Public Translation)',
    desc: 'Essential IPv4 conservation technology. Demonstrates Inside Local (192.168.1.50), Inside Global (203.0.113.2:Port), Outside Global (198.51.100.80) port address translation with Cisco NAT Overload.',
    data: {
      name: "NAT / PAT Translation Lab",
      nodes: [
        { id: "nat_pc", name: "Inside Local PC (192.168.1.50)", type: "desktop", ip: "192.168.1.50", department: "Engineering & Dev", position: [-2.2, 0.6, -1.0] },
        { id: "nat_dmz", name: "Inside DMZ Web Server (192.168.1.100)", type: "server", ip: "192.168.1.100", department: "IT & Infrastructure", firmware: "Apache HTTP (Static NAT -> 203.0.113.10)", position: [-2.2, 1.6, -1.0] },
        { id: "nat_lan_sw", name: "Internal LAN Switch", type: "switch", ip: "192.168.1.2", department: "IT & Infrastructure", position: [-1.1, 1.1, -1.0] },
        { id: "nat_rtr", name: "NAT/PAT Gateway Router", type: "router", ip: "203.0.113.2", department: "IT & Infrastructure", firmware: "Cisco ISR (ip nat inside source list 1 int Gi0/0 overload)", position: [0.3, 1.1, -1.0] },
        { id: "nat_isp", name: "Public Internet WAN Gateway", type: "internet", ip: "203.0.113.1", department: "IT & Infrastructure", position: [1.6, 1.1, -1.0] },
        { id: "nat_cloud_svr", name: "Public Cloud Web Server (Outside)", type: "cloud_vpc", ip: "198.51.100.80", department: "IT & Infrastructure", position: [2.6, 1.1, -1.0] }
      ],
      links: [
        { id: "l-nat-pc-sw", from: "nat_pc", to: "nat_lan_sw", cable: "cat6", speed: "1 Gbps Cat6 UTP (Private RFC 1918)" },
        { id: "l-nat-dmz-sw", from: "nat_dmz", to: "nat_lan_sw", cable: "cat6", speed: "1 Gbps Cat6 UTP (DMZ Host)" },
        { id: "l-nat-sw-rtr", from: "nat_lan_sw", to: "nat_rtr", cable: "cat6", speed: "1 Gbps Inside NAT Interface (Gi0/1)" },
        { id: "l-nat-rtr-isp", from: "nat_rtr", to: "nat_isp", cable: "smf", speed: "10 Gbps Outside NAT Interface (Gi0/0 - Public IP 203.0.113.2)" },
        { id: "l-nat-isp-cloud", from: "nat_isp", to: "nat_cloud_svr", cable: "smf", speed: "100 Gbps Internet Transit (Destination 198.51.100.80:443)" }
      ]
    }
  },

  // 19. Infrastructure Services: DHCP DORA & Recursive DNS
  dhcp_dns: {
    id: 'dhcp_dns',
    title: '📡 DHCP DORA & Recursive DNS Resolution Lab',
    desc: 'Demonstrates the 4-step DHCP lease process (Discover, Offer, Request, Acknowledge) and hierarchical recursive DNS name resolution from Root Hints to Local Resolver.',
    data: {
      name: "DHCP DORA & DNS Resolution Lab",
      nodes: [
        { id: "srv_dhcp", name: "Cisco IOS DHCP Server", type: "server", ip: "192.168.1.250", department: "IT & Infrastructure", firmware: "DHCP Scope: 192.168.1.100-200 (Lease: 8 Days)", position: [-1.8, 1.7, -1.0] },
        { id: "srv_dns", name: "Local Recursive DNS Server", type: "server", ip: "192.168.1.253", department: "IT & Infrastructure", firmware: "BIND9 DNS (Forwarders: 8.8.8.8, 1.1.1.1)", position: [1.8, 1.7, -1.0] },
        { id: "sw_dhcp", name: "Campus Aggregation Switch", type: "switch", ip: "192.168.1.1", department: "IT & Infrastructure", position: [0.0, 1.1, -1.0] },
        { id: "pc_dora", name: "Host PC (DHCP Discovering Client)", type: "desktop", ip: "0.0.0.0 (Awaiting DORA Lease)", department: "Engineering & Dev", position: [-1.3, 0.3, -1.0] },
        { id: "pc_dns_user", name: "Configured PC (DNS Querying)", type: "desktop", ip: "192.168.1.15", department: "Sales & Marketing", position: [1.3, 0.3, -1.0] }
      ],
      links: [
        { id: "l-dhcp-sw", from: "srv_dhcp", to: "sw_dhcp", cable: "cat6", speed: "1 Gbps Copper (DHCP Server Offer/Ack UDP 67)" },
        { id: "l-dns-sw", from: "srv_dns", to: "sw_dhcp", cable: "cat6", speed: "1 Gbps Copper (DNS Resolver UDP 53)" },
        { id: "l-dora-sw", from: "pc_dora", to: "sw_dhcp", cable: "cat6", speed: "1 Gbps Copper (DHCP Broadcast Discover UDP 68->67)" },
        { id: "l-user-sw", from: "pc_dns_user", to: "sw_dhcp", cable: "cat6", speed: "1 Gbps Copper (DNS Query: 'cisco.com' A-Record)" }
      ]
    }
  },

  // 20. CCNP BGP Path Attributes & MPLS LDP Label Switching Core
  bgp_mpls: {
    id: 'bgp_mpls',
    title: '🌐 CCNP BGP & MPLS Label Switching (LSR / LDP Core)',
    desc: 'Service Provider & Enterprise Core routing. Customer Edge (CE) eBGP peering to Provider Edge (PE-1/PE-2) with Multi-Protocol BGP VPNv4 and MPLS LDP Label Switching through the P-Core LSR with Penultimate Hop Popping (PHP).',
    data: {
      name: "BGP & MPLS Label Switched Core Lab",
      nodes: [
        { id: "ce_hq", name: "CE-HQ Router (AS 65001)", type: "router", ip: "10.1.0.1", department: "IT & Infrastructure", firmware: "Cisco ISR 4451 (eBGP AS 65001)", position: [-2.6, 1.1, -1.0] },
        { id: "pe_ingress", name: "PE-1 Ingress LSR (AS 65000)", type: "router", ip: "172.16.0.1", department: "IT & Infrastructure", firmware: "Cisco ASR 9000 (MP-BGP VPNv4 & LDP Ingress)", position: [-1.3, 1.1, -1.0] },
        { id: "p_core_lsr", name: "P-Core LSR (Transit Router)", type: "router", ip: "172.16.0.2", department: "IT & Infrastructure", firmware: "Cisco CRS (Label Switching Router - LSR)", position: [0.0, 1.1, -1.0] },
        { id: "pe_egress", name: "PE-2 Egress LSR (PHP Node)", type: "router", ip: "172.16.0.3", department: "IT & Infrastructure", firmware: "Cisco ASR 9000 (Penultimate Hop Popping PHP)", position: [1.3, 1.1, -1.0] },
        { id: "ce_branch", name: "CE-Branch Router (AS 65002)", type: "router", ip: "10.2.0.1", department: "Finance & Accounting", firmware: "Cisco ISR 4451 (eBGP AS 65002)", position: [2.6, 1.1, -1.0] }
      ],
      links: [
        { id: "l-ce1-pe1", from: "ce_hq", to: "pe_ingress", cable: "smf", speed: "10 Gbps Fiber (eBGP Peering - IP Packet IPv4)" },
        { id: "l-pe1-p", from: "pe_ingress", to: "p_core_lsr", cable: "smf", speed: "100 Gbps SMF (MPLS Ingress Push Label 1002)" },
        { id: "l-p-pe2", from: "p_core_lsr", to: "pe_egress", cable: "smf", speed: "100 Gbps SMF (MPLS Swap Label 1002->2004)" },
        { id: "l-pe2-ce2", from: "pe_egress", to: "ce_branch", cable: "smf", speed: "10 Gbps Fiber (PHP Pop Label -> IP Packet eBGP)" }
      ]
    }
  },

  // 21. CCNP Enterprise Wireless: Catalyst 9800 WLC & CAPWAP Split-MAC
  wlc_capwap: {
    id: 'wlc_capwap',
    title: '📶 Cisco Catalyst 9800 WLC & Split-MAC CAPWAP',
    desc: 'CCNP ENCOR Enterprise Wireless. Centralized Catalyst 9800 Wireless Controller managing Lightweight APs via encrypted CAPWAP Control (UDP 5246) and Data (UDP 5247) split-MAC tunnels, handling 802.11ax Wi-Fi 6 roaming and QoS.',
    data: {
      name: "Catalyst 9800 WLC & CAPWAP Lab",
      nodes: [
        { id: "wlc_9800", name: "Cisco Catalyst 9800-CL WLC", type: "server", ip: "10.10.10.2", department: "IT & Infrastructure", firmware: "Cisco IOS-XE Wireless 17.9 (Split-MAC Controller)", position: [0.0, 2.0, -1.0] },
        { id: "sw_poe_core", name: "Campus PoE+ Core Switch 3850", type: "switch", ip: "10.10.10.1", department: "IT & Infrastructure", firmware: "802.3at PoE+ (30W per port for APs)", position: [0.0, 1.1, -1.0] },
        { id: "lap_campus", name: "LAP-Campus-101 (Wi-Fi 6)", type: "wap", ip: "10.10.20.11", department: "Engineering & Dev", firmware: "Cisco Catalyst 9130AX (Local Mode CAPWAP)", position: [-1.7, 1.1, -1.0] },
        { id: "lap_branch", name: "LAP-Branch-102 (FlexConnect)", type: "wap", ip: "10.10.20.12", department: "Sales & Marketing", firmware: "Cisco Catalyst 9120AX (FlexConnect Local Switching)", position: [1.7, 1.1, -1.0] },
        { id: "lap_laptop", name: "Corporate Wi-Fi 6 Laptop", type: "laptop", ip: "10.10.30.55", department: "Engineering & Dev", position: [-1.7, 0.3, -1.0] },
        { id: "lap_phone", name: "Executive VoIP Smartphone", type: "phone", ip: "10.10.40.77", department: "Executive Suite", position: [1.7, 0.3, -1.0] }
      ],
      links: [
        { id: "l-wlc-sw", from: "wlc_9800", to: "sw_poe_core", cable: "dac", speed: "10 Gbps DAC (CAPWAP Tunnel Termination Gi0/0)" },
        { id: "l-sw-lap1", from: "sw_poe_core", to: "lap_campus", cable: "cat6", speed: "1 Gbps PoE+ (CAPWAP UDP 5246/5247 Tunnel)" },
        { id: "l-sw-lap2", from: "sw_poe_core", to: "lap_branch", cable: "cat6", speed: "1 Gbps PoE+ (FlexConnect Tunnel)" },
        { id: "l-lap1-laptop", from: "lap_campus", to: "lap_laptop", cable: "cat6", speed: "802.11ax 1200 Mbps (WPA3-Enterprise 802.1X)" },
        { id: "l-lap2-phone", from: "lap_branch", to: "lap_phone", cable: "cat6", speed: "802.11ax 866 Mbps (Fast BSS Transition 802.11r)" }
      ]
    }
  },

  // 22. CCNP ENARSI Dynamic Multipoint VPN (DMVPN Phase 3 with mGRE & NHRP)
  dmvpn: {
    id: 'dmvpn',
    title: '🔒 DMVPN Phase 3 (mGRE + NHRP Dynamic Spoke-to-Spoke)',
    desc: 'Cisco CCNP ENARSI advanced WAN VPN. DMVPN Phase 3 combines Multipoint GRE (mGRE) Tunnel0 with Next Hop Resolution Protocol (NHRP) and IPsec crypto, enabling spokes to establish on-demand direct spoke-to-spoke encrypted tunnels without traversing the Hub.',
    data: {
      name: "DMVPN Phase 3 Advanced WAN Lab",
      nodes: [
        { id: "dmvpn_hub", name: "DMVPN HQ Hub Router", type: "vpn", ip: "172.16.1.1", department: "IT & Infrastructure", firmware: "Cisco ISR 4451 (NHRP NHS / mGRE Tunnel0)", position: [0.0, 1.8, -1.0] },
        { id: "spoke_dallas", name: "Spoke 1 Router (Dallas)", type: "vpn", ip: "172.16.1.2", department: "Engineering & Dev", firmware: "Cisco ISR 4331 (NHRP Client / Spoke-to-Spoke Enabled)", position: [-1.8, 1.1, -1.0] },
        { id: "spoke_london", name: "Spoke 2 Router (London)", type: "vpn", ip: "172.16.1.3", department: "Finance & Accounting", firmware: "Cisco ISR 4331 (NHRP Client / Spoke-to-Spoke Enabled)", position: [1.8, 1.1, -1.0] },
        { id: "dallas_host", name: "Dallas Dev PC", type: "desktop", ip: "192.168.10.50", department: "Engineering & Dev", position: [-1.8, 0.3, -1.0] },
        { id: "london_db", name: "London Finance DB Server", type: "database", ip: "192.168.20.100", department: "Finance & Accounting", position: [1.8, 0.3, -1.0] }
      ],
      links: [
        { id: "l-hub-dallas", from: "dmvpn_hub", to: "spoke_dallas", cable: "vpn_tunnel", speed: "IPsec mGRE Tunnel0 (NHRP Control Plane)" },
        { id: "l-hub-london", from: "dmvpn_hub", to: "spoke_london", cable: "vpn_tunnel", speed: "IPsec mGRE Tunnel0 (NHRP Control Plane)" },
        { id: "l-spoke-shortcut", from: "spoke_dallas", to: "spoke_london", cable: "vpn_tunnel", speed: "Dynamic Direct Spoke-to-Spoke IPsec Shortcut (Zero Hub Hairpin)" },
        { id: "l-dallas-pc", from: "spoke_dallas", to: "dallas_host", cable: "cat6", speed: "1 Gbps LAN Access (Dallas Subnet 192.168.10.0/24)" },
        { id: "l-london-db", from: "spoke_london", to: "london_db", cable: "cat6", speed: "10 Gbps LAN Access (London Subnet 192.168.20.0/24)" }
      ]
    }
  },

  // 11. Custom Blank Canvas
  blank: {
    id: 'blank',
    title: '🎨 Blank Canvas (Build Own)',
    desc: 'Empty canvas ready for interactive building. Use the Add Device and Connect tools to design any custom network!',
    data: {
      name: "Custom Network (Blank)",
      nodes: [],
      links: []
    }
  }
};

export function runGraphSelfTest() {
  console.group('%c[Graph Model Self-Test]', 'color: #00f3ff; font-weight: bold;');
  const testGraph = new Graph();

  testGraph.addNode({ id: 'inet', name: 'Internet', type: 'internet' });
  testGraph.addNode({ id: 'fw', name: 'Firewall', type: 'firewall' });
  testGraph.addNode({ id: 'r1', name: 'Router', type: 'router' });
  testGraph.addNode({ id: 'sw1', name: 'Switch 1', type: 'switch' });
  testGraph.addNode({ id: 'sw2', name: 'Switch 2', type: 'switch' });
  testGraph.addNode({ id: 'pc1', name: 'Desktop 1', type: 'desktop' });
  testGraph.addNode({ id: 'prn1', name: 'Printer 1', type: 'printer' });

  testGraph.addLink('inet', 'fw', 'l1');
  testGraph.addLink('fw', 'r1', 'l2');
  testGraph.addLink('r1', 'sw1', 'l3');
  testGraph.addLink('r1', 'sw2', 'l4');
  testGraph.addLink('sw1', 'sw2', 'l5');
  testGraph.addLink('sw2', 'pc1', 'l6');
  testGraph.addLink('sw2', 'prn1', 'l7');

  const path1 = testGraph.shortestPath('pc1', 'inet');
  console.assert(path1 !== null && path1.length === 5, 'Test 1 Failed', path1);
  console.log('✓ Primary path test passed:', path1?.join(' -> '));

  testGraph.setLinkStatus('l4', 'down');
  const path2 = testGraph.shortestPath('pc1', 'inet');
  console.assert(path2 !== null && path2.includes('sw1'), 'Test 2 Failed', path2);
  console.log('✓ Reroute test passed:', path2?.join(' -> '));

  console.groupEnd();
}
