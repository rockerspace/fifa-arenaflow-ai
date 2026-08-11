/**
 * Dijkstra Pathfinder Router Graph for Stadium Exit & Route Calculations
 * Dynamically computes exit pathways based on real-time gate congestion weights.
 */

// Stadium Graph definition
// Nodes:
// Stands: '101' (North), '104' (East), '107' (South), '110' (West)
// Gates: 'Gate A', 'Gate B', 'Gate C', 'Gate D'
const STADIUM_GRAPH = {
  '101': { 'Gate A': 4, 'Gate D': 10 },
  '104': { 'Gate B': 4, 'Gate A': 12, 'Gate C': 12 },
  '107': { 'Gate C': 5, 'Gate B': 10, 'Gate D': 10 },
  '110': { 'Gate D': 4, 'Gate A': 12, 'Gate C': 12 },
  'Gate A': { '101': 4, '104': 12, '110': 12 },
  'Gate B': { '104': 4, '107': 10 },
  'Gate C': { '107': 5, '104': 12, '110': 12 },
  'Gate D': { '110': 4, '101': 10, '107': 10 }
};

export function calculateDijkstraPath(startNode, currentScenario) {
  // 1. Copy graph structure
  const graph = JSON.parse(JSON.stringify(STADIUM_GRAPH));

  // 2. Adjust edge weights dynamically based on active simulator congestion
  if (currentScenario === 'transit_jam') {
    // South Rail Terminal bottleneck - heavily congest Gate C edges
    if (graph['107']['Gate C']) graph['107']['Gate C'] = 150;
    if (graph['Gate C']['107']) graph['Gate C']['107'] = 150;
  } else if (currentScenario === 'halftime') {
    // East Stand food concession overload - congest Gate B edges
    if (graph['104']['Gate B']) graph['104']['Gate B'] = 80;
    if (graph['Gate B']['104']) graph['Gate B']['104'] = 80;
  } else if (currentScenario === 'evac') {
    // Evacuation scenario increases all pathways baseline loads,
    // but keeps relative ratios
  }

  // 3. Dijkstra's Algorithm
  const distances = {};
  const previous = {};
  const queue = [];

  // Initialize
  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
    queue.push(node);
  }
  distances[startNode] = 0;

  while (queue.length > 0) {
    // Find node with minimum distance
    queue.sort((a, b) => distances[a] - distances[b]);
    const u = queue.shift();

    if (distances[u] === Infinity) break;

    for (const neighbor in graph[u]) {
      const alt = distances[u] + graph[u][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = u;
      }
    }
  }

  // 4. Find the nearest gate with lowest path distance
  const gates = ['Gate A', 'Gate B', 'Gate C', 'Gate D'];
  let optimalGate = 'Gate A';
  let minDistance = Infinity;

  gates.forEach(gate => {
    if (distances[gate] < minDistance) {
      minDistance = distances[gate];
      optimalGate = gate;
    }
  });

  // Reconstruct path to optimal gate
  const path = [];
  let curr = optimalGate;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return {
    path,
    gate: optimalGate,
    distance: minDistance
  };
}
