/**
 * exportPdf.js - Client-Side PDF Generation for Network Topology Layout & Device Inventory
 *
 * Implements:
 * 1. WebGL high-resolution snapshot capture
 * 2. Executive layout summary with department metrics
 * 3. Complete system inventory table (Name, Type, Department, IP, Status, Connected Links)
 * 4. jsPDF vector rendering with automatic fallback to native print-to-PDF
 */

import { sound } from './audio.js';

export function exportNetworkToPDF({ renderer, scene, camera, graph }) {
  try {
    // 1. Capture snapshot of 3D WebGL Canvas
    renderer.render(scene, camera);
    const snapshotDataUrl = renderer.domElement.toDataURL('image/png');

    // Collect network inventory
    const nodes = Array.from(graph.nodes.values());
    const links = graph.links;

    // Group by department
    const deptMap = {};
    for (const n of nodes) {
      const dept = n.department || 'IT & Infrastructure';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    }

    // Check if jsPDF is loaded
    const jsPDF = window.jspdf ? window.jspdf.jsPDF : null;

    if (jsPDF) {
      generateJsPDFDocument({ snapshotDataUrl, nodes, links, deptMap });
    } else {
      generatePrintableFallback({ snapshotDataUrl, nodes, links, deptMap });
    }

    sound.playSuccess();
    return true;
  } catch (err) {
    console.error('Failed to export PDF:', err);
    alert('PDF Generation failed: ' + err.message);
    return false;
  }
}

/**
 * Generate PDF using jsPDF library (Landscape A4)
 */
function generateJsPDFDocument({ snapshotDataUrl, nodes, links, deptMap }) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Page 1: Executive Diagram & Architecture Snapshot
  // Header Banner
  doc.setFillColor(11, 15, 26); // #0b0f1a
  doc.rect(0, 0, pageWidth, 65, 'F');

  doc.setTextColor(0, 243, 255); // Cyan
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ENTERPRISE NETWORK TOPOLOGY & INVENTORY REPORT', 30, 36);

  doc.setTextColor(148, 163, 184); // Muted
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const now = new Date().toLocaleString();
  doc.text(`Generated: ${now}  |  VR Network Topology Explorer`, 30, 52);

  // Embed 3D Layout Snapshot
  const imgWidth = pageWidth - 60;
  const imgHeight = 280;
  doc.addImage(snapshotDataUrl, 'PNG', 30, 80, imgWidth, imgHeight);

  // Executive Metrics Card below snapshot
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(30, 375, pageWidth - 60, 110, 8, 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(30, 375, pageWidth - 60, 110, 8, 8, 'D');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('EXECUTIVE NETWORK METRICS', 45, 396);

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Active Network Devices: ${nodes.length}`, 45, 418);
  doc.text(`Total Interconnected Data Links: ${links.length}`, 45, 436);
  doc.text(`Segmented Departments / Subnets: ${Object.keys(deptMap).length}`, 45, 454);

  // Department Breakdown summary
  doc.setFont('helvetica', 'bold');
  doc.text('Department Device Allocation:', 320, 396);
  doc.setFont('helvetica', 'normal');
  let deptX = 320;
  let deptY = 416;
  let count = 0;
  for (const [dept, total] of Object.entries(deptMap)) {
    doc.text(`• ${dept}: ${total} device(s)`, deptX, deptY);
    deptY += 16;
    count++;
    if (count % 3 === 0) {
      deptX += 220;
      deptY = 416;
    }
  }

  // Page 2: Detailed Device & Server Inventory Table
  doc.addPage('a4', 'landscape');

  // Header Banner Page 2
  doc.setFillColor(11, 15, 26);
  doc.rect(0, 0, pageWidth, 55, 'F');
  doc.setTextColor(0, 243, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('DEVICE INVENTORY & INTERCONNECTION MATRIX', 30, 34);

  // Table Header
  const startY = 75;
  const rowHeight = 22;
  doc.setFillColor(30, 41, 59);
  doc.rect(30, startY, pageWidth - 60, rowHeight, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');

  doc.text('DEVICE FULL NAME', 36, startY + 15);
  doc.text('ROLE', 185, startY + 15);
  doc.text('DEPARTMENT', 255, startY + 15);
  doc.text('IPV4 / MASK', 380, startY + 15);
  doc.text('MAC ADDRESS', 495, startY + 15);
  doc.text('VLAN / GATEWAY', 610, startY + 15);
  doc.text('STATUS', 715, startY + 15);
  doc.text('PEERS', 765, startY + 15);

  // Rows
  let curY = startY + rowHeight;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  nodes.forEach((node, idx) => {
    // Check if new page needed
    if (curY > pageHeight - 35) {
      doc.addPage('a4', 'landscape');
      curY = 35;
    }

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(30, curY, pageWidth - 60, rowHeight, 'F');
    }

    doc.setTextColor(15, 23, 42);
    let displayName = node.name || node.id;
    if (displayName.length > 24) displayName = displayName.substring(0, 22) + '...';
    doc.text(displayName, 36, curY + 14);

    doc.setTextColor(59, 130, 246);
    doc.text((node.type || 'desktop').toUpperCase(), 185, curY + 14);

    doc.setTextColor(100, 116, 139);
    let deptName = node.department || 'IT Infrastructure';
    if (deptName.length > 20) deptName = deptName.substring(0, 18) + '...';
    doc.text(deptName, 255, curY + 14);

    doc.setTextColor(15, 23, 42);
    doc.text(node.ip || '10.0.0.1', 380, curY + 14);

    doc.setTextColor(71, 85, 105);
    doc.text(node.mac || '00:1A:2B:3C:4D:5E', 495, curY + 14);

    doc.setTextColor(15, 23, 42);
    const vlanStr = `${node.vlan || 'V1'} (${node.gateway || '10.0.0.1'})`;
    doc.text(vlanStr, 610, curY + 14);

    const isUp = (node.status !== 'down');
    doc.setTextColor(isUp ? 22 : 220, isUp ? 163 : 38, isUp ? 74 : 38);
    doc.text(isUp ? 'ONLINE' : 'DOWN', 715, curY + 14);

    // Connected peers count
    const peerLinks = links.filter(l => l.from === node.id || l.to === node.id);
    doc.setTextColor(71, 85, 105);
    doc.text(`${peerLinks.length} link(s)`, 765, curY + 14);

    curY += rowHeight;
  });

  doc.save('network-topology-layout-report.pdf');
}

/**
 * Fallback to browser printable window if jsPDF CDN is blocked
 */
function generatePrintableFallback({ snapshotDataUrl, nodes, links, deptMap }) {
  const win = window.open('', '_blank');
  if (!win) {
    alert('Popup blocked. Please allow popups to download/print the network layout PDF.');
    return;
  }

  const rows = nodes.map(n => `
    <tr>
      <td><strong>${n.name}</strong></td>
      <td><code>${n.type.toUpperCase()}</code></td>
      <td>${n.department || 'IT Infrastructure'}</td>
      <td><code>${n.ip}</code></td>
      <td><code>${n.mac || '00:1A:2B:3C:4D:5E'}</code></td>
      <td>${n.vlan || 'VLAN 1'} (GW: ${n.gateway || '10.0.0.1'})</td>
      <td><span style="color: ${n.status === 'down' ? '#ef4444' : '#10b981'}; font-weight: bold;">${n.status === 'down' ? 'DOWN' : 'ONLINE'}</span></td>
      <td>${links.filter(l => l.from === n.id || l.to === n.id).length} Connected</td>
    </tr>
  `).join('');

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Network Topology Report</title>
      <style>
        body { font-family: -apple-system, Roboto, sans-serif; padding: 24px; color: #0f172a; }
        h1 { color: #0284c7; margin-bottom: 4px; }
        .meta { color: #64748b; font-size: 13px; margin-bottom: 16px; }
        .snapshot { width: 100%; max-height: 480px; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 24px; background: #0b0f1a; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
        th { background: #f1f5f9; }
        tr:nth-child(even) { background: #f8fafc; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <button onclick="window.print()" style="float: right; padding: 8px 16px; background: #0284c7; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">🖨️ Print / Save as PDF</button>
      <h1>ENTERPRISE NETWORK TOPOLOGY & INVENTORY REPORT</h1>
      <div class="meta">Generated: ${new Date().toLocaleString()} | VR Network Topology Explorer</div>
      <img src="${snapshotDataUrl}" class="snapshot" alt="Topology 3D Snapshot">
      <h2>System & Server Inventory (${nodes.length} Devices, ${links.length} Links)</h2>
      <table>
        <thead>
          <tr>
            <th>Device Full Name</th>
            <th>Role / Type</th>
            <th>Department</th>
            <th>IPv4 Address</th>
            <th>MAC Address</th>
            <th>VLAN / Gateway</th>
            <th>Status</th>
            <th>Peers</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `);
  win.document.close();
}
