/**
 * subnet.js - Interactive CIDR Subnet Calculator for Network Engineers & Joinees
 *
 * Implements:
 * 1. IPv4 CIDR prefix parser (/8 to /32)
 * 2. Calculation of Subnet Mask, Network Address, Broadcast, Usable Host Range, and Total Hosts
 * 3. IP class detection (Class A, B, C, Private RFC 1918, Loopback, Link-Local)
 */

export function calculateSubnet(cidrInput) {
  try {
    const trimmed = (cidrInput || '').trim();
    const parts = trimmed.split('/');
    if (parts.length !== 2) {
      throw new Error('Please enter in CIDR notation (e.g., 10.0.10.0/24 or 192.168.1.0/26)');
    }

    const ipStr = parts[0].trim();
    const prefix = parseInt(parts[1].trim(), 10);

    if (isNaN(prefix) || prefix < 0 || prefix > 32) {
      throw new Error('Prefix length must be between 0 and 32 (e.g., /24)');
    }

    const octets = ipStr.split('.').map(Number);
    if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
      throw new Error('Invalid IPv4 address format (e.g., 10.0.10.0)');
    }

    // Convert IP to 32-bit unsigned integer
    const ipInt = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;

    // Subnet mask
    const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const wildcardInt = (~maskInt) >>> 0;

    const netInt = (ipInt & maskInt) >>> 0;
    const bcastInt = (netInt | wildcardInt) >>> 0;

    const firstHostInt = prefix >= 31 ? netInt : (netInt + 1) >>> 0;
    const lastHostInt = prefix >= 31 ? bcastInt : (bcastInt - 1) >>> 0;

    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(totalHosts - 2, 0);

    // IP Class detection
    let ipClass = 'Class C';
    if (octets[0] < 128) ipClass = 'Class A';
    else if (octets[0] < 192) ipClass = 'Class B';
    else if (octets[0] < 224) ipClass = 'Class C';
    else if (octets[0] < 240) ipClass = 'Class D (Multicast)';
    else ipClass = 'Class E (Reserved)';

    // RFC 1918 Private detection
    let isPrivate = false;
    if (octets[0] === 10) isPrivate = true;
    else if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) isPrivate = true;
    else if (octets[0] === 192 && octets[1] === 168) isPrivate = true;

    return {
      valid: true,
      cidr: `${intToIp(netInt)}/${prefix}`,
      ipAddress: ipStr,
      prefix: `/${prefix}`,
      subnetMask: intToIp(maskInt),
      wildcardMask: intToIp(wildcardInt),
      networkAddress: intToIp(netInt),
      broadcastAddress: intToIp(bcastInt),
      firstUsableHost: intToIp(firstHostInt),
      lastUsableHost: intToIp(lastHostInt),
      usableHostRange: `${intToIp(firstHostInt)} – ${intToIp(lastHostInt)}`,
      totalHosts: totalHosts.toLocaleString(),
      usableHosts: usableHosts.toLocaleString(),
      ipClass: `${ipClass} (${isPrivate ? 'RFC 1918 Private' : 'Public Routable'})`
    };
  } catch (err) {
    return {
      valid: false,
      error: err.message
    };
  }
}

function intToIp(int) {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}
