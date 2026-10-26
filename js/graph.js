/**
 * graph.js - Network Data Model & Pathfinding for VR Network Topology Explorer
 *
 * Implements node/link management, status handling (up/down), neighbor queries,
 * breadth-first search (BFS) shortest-path pathfinding, and internet reachability
 * analysis across healthy network components with Department tagging.
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
  'Operations',
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
  'Operations':          '#06b6d4', // Cyan
  'DMZ & Perimeter':     '#f97316', // Orange
  'Data Center':         '#a855f7'  // Purple
};

export class Graph {
  constructor() {
    /** @type {Map<string, {id: string, name: string, type: string, ip: string, department: string, subnet?: string, position: {x:number, y:number, z:number}, status: 'up'|'down'}>} */
    this.nodes = new Map();

    /** @type {Array<{id: string, from: string, to: string, status: 'up'|'down'}>} */
    this.links = [];
  }

  /**
   * Add a node to the network graph
   * @param {Object} nodeData
   */
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

    this.nodes.set(nodeData.id, {
      id: String(nodeData.id),
      name: nodeData.name || nodeData.id,
      type: type,
      ip: nodeData.ip || '10.0.0.1',
      department: department,
      subnet: nodeData.subnet || department,
      position: position,
      status: nodeData.status === 'down' ? 'down' : 'up'
    });
    return this.nodes.get(nodeData.id);
  }

  /**
   * Remove a node and any connected links
   * @param {string} id
   */
  removeNode(id) {
    this.nodes.delete(id);
    this.links = this.links.filter(l => l.from !== id && l.to !== id);
  }

  /**
   * Add a link between two nodes
   * @param {string} fromId
   * @param {string} toId
   * @param {string} [customId]
   */
  addLink(fromId, toId, customId = null) {
    const id = customId || `link-${fromId}-${toId}`;
    const exists = this.links.some(
      l => (l.from === fromId && l.to === toId) || (l.from === toId && l.to === fromId)
    );
    if (!exists) {
      this.links.push({
        id: id,
        from: String(fromId),
        to: String(toId),
        status: 'up'
      });
    }
    return id;
  }

  /**
   * Remove a link by id
   * @param {string} linkId
   */
  removeLink(linkId) {
    this.links = this.links.filter(l => l.id !== linkId);
  }

  /**
   * Set the status of a node ('up' | 'down')
   * @param {string} id
   * @param {'up'|'down'} status
   */
  setNodeStatus(id, status) {
    const node = this.nodes.get(id);
    if (node) {
      node.status = status;
    }
  }

  /**
   * Set the status of a link ('up' | 'down')
   * @param {string} linkId
   * @param {'up'|'down'} status
   */
  setLinkStatus(linkId, status) {
    const link = this.links.find(l => l.id === linkId);
    if (link) {
      link.status = status;
    }
  }

  /**
   * Find a link between two nodes regardless of direction
   * @param {string} idA
   * @param {string} idB
   */
  findLink(idA, idB) {
    return this.links.find(
      l => (l.from === idA && l.to === idB) || (l.from === idB && l.to === idA)
    );
  }

  /**
   * Reset all nodes and links to 'up' status
   */
  reset() {
    for (const node of this.nodes.values()) {
      node.status = 'up';
    }
    for (const link of this.links) {
      link.status = 'up';
    }
  }

  /**
   * Clear all nodes and links
   */
  clear() {
    this.nodes.clear();
    this.links = [];
  }

  /**
   * Get operational neighbors of a node (only traverses UP links and UP nodes)
   * @param {string} id
   * @returns {string[]} neighbor node IDs
   */
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

  /**
   * Compute shortest path between two nodes using Breadth-First Search (BFS)
   * Only traverses operational (status === 'up') nodes and links.
   * @param {string} fromId
   * @param {string} toId
   * @returns {string[]|null} Array of node IDs representing path, or null if unreachable
   */
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

  /**
   * Find all nodes reachable from a given node (default: internet node)
   * @param {string} internetId
   * @returns {Set<string>} Set of reachable node IDs
   */
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
 * Enterprise Architecture Topology Templates for Training & Onboarding
 */
export const NETWORK_TEMPLATES = {
  corporate: {
    id: 'corporate',
    title: '1. Corporate Enterprise Network (Department-Wise)',
    desc: 'Full corporate network with perimeter firewall, core router, department switches, server blades, workstations, executive laptops, and shared network printers.',
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
        { id: "link-inet-fw1", from: "inet", to: "fw1" },
        { id: "link-fw1-rcore", from: "fw1", to: "r_core" },
        { id: "link-rcore-swit", from: "r_core", to: "sw_it" },
        { id: "link-rcore-sweng", from: "r_core", to: "sw_eng" },
        { id: "link-rcore-swfin", from: "r_core", to: "sw_fin" },
        { id: "link-swit-srv1", from: "sw_it", to: "srv1" },
        { id: "link-swit-srv2", from: "sw_it", to: "srv2" },
        { id: "link-sweng-pceng", from: "sw_eng", to: "pc_eng" },
        { id: "link-sweng-lapexec", from: "sw_eng", to: "lap_exec" },
        { id: "link-swfin-pcfin", from: "sw_fin", to: "pc_fin" },
        { id: "link-swfin-prnfin", from: "sw_fin", to: "prn_fin" },
        { id: "link-backup-eng-fin", from: "sw_eng", to: "sw_fin" } // Redundant STP Backup Link!
      ]
    }
  },
  threeTier: {
    id: 'threeTier',
    title: '2. 3-Tier Enterprise Web App',
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
  sdwan: {
    id: 'sdwan',
    title: '3. SD-WAN & Branch Office VPN',
    desc: 'Connecting Headquarters LAN through an encrypted SD-WAN tunnel over public Internet to remote branch office desktops and printers.',
    data: {
      name: "SD-WAN Enterprise Topology",
      nodes: [
        { id: "hq_srv", name: "HQ Core File Server", type: "server", ip: "10.1.0.10", department: "Data Center", subnet: "HQ DataCenter", position: [-2.6, 1.8, -1.0] },
        { id: "hq_sw", name: "HQ Core Switch", type: "switch", ip: "10.1.0.1", department: "IT & Infrastructure", subnet: "HQ Core", position: [-1.6, 1.8, -1.0] },
        { id: "hq_gw", name: "HQ SD-WAN Edge Gateway", type: "router", ip: "198.51.10.1", department: "IT & Infrastructure", subnet: "HQ Perimeter", position: [-0.6, 1.8, -1.0] },
        { id: "wan", name: "Carrier ISP WAN Cloud", type: "cloud", ip: "203.0.113.1", department: "DMZ & Perimeter", subnet: "Underlay WAN", position: [0.0, 1.4, -1.0] },
        { id: "br_gw", name: "Branch SD-WAN Router", type: "router", ip: "198.51.20.1", department: "Operations", subnet: "Branch Gateway", position: [0.7, 1.1, -1.0] },
        { id: "br_sw", name: "Branch Office Switch", type: "switch", ip: "10.2.0.1", department: "Operations", subnet: "Branch LAN", position: [1.7, 1.1, -1.0] },
        { id: "br_pc1", name: "Branch Desktop PC", type: "desktop", ip: "10.2.0.101", department: "Sales & Marketing", subnet: "Branch LAN", position: [2.7, 1.5, -1.0] },
        { id: "br_lap", name: "Branch Staff Laptop", type: "laptop", ip: "10.2.0.102", department: "Sales & Marketing", subnet: "Branch LAN", position: [2.7, 1.1, -1.0] },
        { id: "br_prn", name: "Branch Network Printer", type: "printer", ip: "10.2.0.201", department: "Operations", subnet: "Branch LAN", position: [2.7, 0.7, -1.0] }
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
  blank: {
    id: 'blank',
    title: '4. Blank Canvas (Build Own Network)',
    desc: 'Empty canvas ready for interactive building. Use the Add Node and Connect tools to design any custom network!',
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
