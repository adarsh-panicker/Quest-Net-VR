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
