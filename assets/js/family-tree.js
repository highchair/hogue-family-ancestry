// family-tree.js
const svg = d3.select("svg");
const width = window.innerWidth;
const height = window.innerHeight;
svg.attr("width", width).attr("height", height);

const zoomLayer = d3.select("#zoom-layer");
const cardsLayer = d3.select("#cards-layer");
const linesLayer = d3.select("#lines-layer");

const zoom = d3.zoom().on("zoom", (event) => {
  zoomLayer.attr("transform", event.transform);
});
svg.call(zoom);

d3.select("#reset-btn")?.on("click", () => {
  svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
});

fetch("/family-tree.json")
  .then((res) => res.json())
  .then((data) => renderTree(data))
  .catch(err => console.error("Failed to load family-tree.json:", err));

function renderTree(data) {
  const nodeMap = new Map(data.map(d => [d.id, d]));
  const allIds = data.map(d => d.id);
  const childIds = new Set(data.flatMap(d => d.children || []));

  // Candidate roots
  const candidateRoots = data.map(d => d.id).filter(id => !childIds.has(id));
  const rootSet = new Set();
  candidateRoots.forEach(id => {
    if (rootSet.has(id)) return;
    const node = nodeMap.get(id);
    const spouseId = node?.spouse;
    if (spouseId && candidateRoots.includes(spouseId)) {
      const idxA = allIds.indexOf(id);
      const idxB = allIds.indexOf(spouseId);
      rootSet.add(idxA <= idxB ? id : spouseId);
    } else {
      rootSet.add(id);
    }
  });
  const rootIds = Array.from(rootSet);

  const positions = new Map();
  const nodeWidth = 150, nodeHeight = 170;
  const paddingX = 60, paddingY = 120;
  const rowWidths = [];

  function layoutTree(id, depth, offsetX) {
    if (positions.has(id)) return;
    if (offsetX === undefined) {
      offsetX = (rowWidths[depth] !== undefined) ? rowWidths[depth] : (rowWidths.slice(0, depth).reduce((a,b)=>Math.max(a,b||0), 0) + paddingX);
    }
    if (rowWidths[depth] === undefined) rowWidths[depth] = offsetX;

    const x = rowWidths[depth];
    const y = depth * (nodeHeight + paddingY);
    positions.set(id, { x, y });

    const node = nodeMap.get(id) || {};
    if (node.spouse && !positions.has(node.spouse) && nodeMap.has(node.spouse)) {
      positions.set(node.spouse, { x: x + nodeWidth + paddingX, y });
    }

    let childOffset = x;
    (node.children || []).forEach(cid => {
      layoutTree(cid, depth + 1, childOffset);
      childOffset = (rowWidths[depth + 1] !== undefined ? rowWidths[depth + 1] : childOffset) + nodeWidth + paddingX;
      rowWidths[depth + 1] = childOffset;
    });

    const widthUsed = node.spouse ? (nodeWidth * 2 + paddingX) : nodeWidth;
    rowWidths[depth] = Math.max(rowWidths[depth], x + widthUsed + paddingX);
  }

  let startX = 50;
  rootIds.forEach(rootId => {
    layoutTree(rootId, 0, startX);
    const maxRow = Math.max(...rowWidths.filter(v => v !== undefined));
    startX = (isFinite(maxRow) ? maxRow : startX) + paddingX * 2;
  });

  // Clear existing
  cardsLayer.selectAll("*").remove();
  linesLayer.selectAll("*").remove();

  // Build parent/child maps for lineage lookup
  const parentsMap = new Map();
  const childrenMap = new Map();
  data.forEach(person => {
    if (person.children) {
      childrenMap.set(person.id, person.children);
      person.children.forEach(childId => {
        if (!parentsMap.has(childId)) parentsMap.set(childId, []);
        parentsMap.get(childId).push(person.id);
      });
    }
  });

  function getLineageIds(id) {
    const visited = new Set();
    function dfsUp(curr) {
      if (visited.has(curr)) return;
      visited.add(curr);
      (parentsMap.get(curr) || []).forEach(p => dfsUp(p));
    }
    function dfsDown(curr) {
      if (visited.has(curr)) return;
      visited.add(curr);
      (childrenMap.get(curr) || []).forEach(c => dfsDown(c));
    }
    dfsUp(id);
    dfsDown(id);
    return visited;
  }

  // Draw cards
  positions.forEach((pos, id) => {
    const node = nodeMap.get(id) || { name: id, photo: "Photos/Default.jpg" };
    const group = cardsLayer.append("g")
      .attr("class", "person-card")
      .attr("data-id", id);

    group.append("rect")
      .attr("x", pos.x).attr("y", pos.y)
      .attr("width", nodeWidth).attr("height", nodeHeight)
      .attr("fill", "#fff").attr("stroke", "#444")
      .attr("rx", 8).attr("ry", 8);

    group.append("image")
      .attr("href", node.photo || "Photos/Default.jpg")
      .attr("x", pos.x + (nodeWidth - 80) / 2).attr("y", pos.y + 15)
      .attr("width", 80).attr("height", 80)
      .attr("preserveAspectRatio", "xMidYMid slice");

    group.append("text")
      .attr("x", pos.x + nodeWidth / 2).attr("y", pos.y + 115)
      .attr("text-anchor", "middle").attr("font-size", "14px")
      .attr("font-weight", "bold").text(node.name || "");

    const life = `${node.birth || ''}${node.birth || node.death ? ' - ' : ''}${node.death || ''}`;
    group.append("text")
      .attr("x", pos.x + nodeWidth / 2).attr("y", pos.y + 145)
      .attr("text-anchor", "middle").attr("font-size", "12px")
      .attr("fill", "#555").text(life);

    // Hover highlight lineage
    group.on("mouseenter", function() {
      const lineage = getLineageIds(id);
      d3.selectAll(".connector").classed("hovered", function() {
        const from = d3.select(this).attr("data-from");
        const to = d3.select(this).attr("data-to");
        return lineage.has(from) && lineage.has(to);
      });
    }).on("mouseleave", function() {
      d3.selectAll(".connector").classed("hovered", false);
    });
  });

  // Draw connectors
  data.forEach(d => {
    const from = positions.get(d.id);
    if (!from) return;

    const hasSpouse = d.spouse && positions.has(d.spouse);
    const hasChildren = d.children && d.children.length > 0;

    // Spouse line
    if (hasSpouse && d.id < d.spouse) {
      const to = positions.get(d.spouse);
      if (to) {
        const y = from.y + nodeHeight / 2;
        linesLayer.append("line")
          .attr("class", "connector")
          .attr("data-from", d.id)
          .attr("data-to", d.spouse)
          .attr("x1", from.x + nodeWidth / 2).attr("y1", y)
          .attr("x2", to.x + nodeWidth / 2).attr("y2", y)
          .attr("stroke", "#888")
          .attr("stroke-width", 1.5)
          .attr("stroke-linecap", "round");
      }
    }

    // Children connectors
    if (hasChildren && (!hasSpouse || d.id < d.spouse)) {
      const spousePos = hasSpouse ? positions.get(d.spouse) : null;
      const parentX = (hasSpouse && spousePos)
        ? ((from.x + nodeWidth / 2) + (spousePos.x + nodeWidth / 2)) / 2
        : (from.x + nodeWidth / 2);
      const parentY = from.y + nodeHeight / 2;
      const midY = parentY + nodeHeight / 2 + 20;

      linesLayer.append("line")
        .attr("class", "connector")
        .attr("data-from", d.id)
        .attr("data-to", hasSpouse ? d.spouse : d.id) 
        .attr("data-type", "parent-midline") // generic mid-line
        .attr("x1", parentX).attr("y1", parentY)
        .attr("x2", parentX).attr("y2", midY)
        .attr("stroke", "#000")
        .attr("stroke-width", 1.2)
        .attr("stroke-linecap", "round");

      d.children.forEach(cid => {
        const childPos = positions.get(cid);
        if (!childPos) return;

        const childX = childPos.x + nodeWidth / 2;
        const childY = childPos.y;
        const curve = 12;
        const hx = childX < parentX ? childX + curve : childX - curve;

        const path = `M${parentX},${midY} L${hx},${midY} Q${childX},${midY} ${childX},${midY + curve} L${childX},${childY}`;
        linesLayer.append("path")
          .attr("class", "connector")
          .attr("data-from", d.id)
          .attr("data-to", cid)
          .attr("d", path)
          .attr("stroke", "#000")
          .attr("fill", "none")
          .attr("stroke-width", 1.2)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round");
      });
    }
  });
}