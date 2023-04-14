import { getIncomers, getOutgoers, Node, Edge, ReactFlowInstance } from 'reactflow';

function getNodePath(node: Node, nodes: Node[], edges: Edge[]) {
  const path = [node];
  let currentNode = node;
  while (currentNode) {
    const outgoers = getOutgoers(currentNode, nodes, edges);
    if (outgoers.length === 0) {
      break;
    }
    [currentNode] = outgoers;
    path.push(currentNode);
  }
  return path;
}

export function shuffleNodes(reactFlowInstance: ReactFlowInstance) {
  const nodes = reactFlowInstance.getNodes();
  for (let i = nodes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
  }
  return nodes;
}

export function buildLinearGraph(reactFlowInstance: ReactFlowInstance): [Node[], Node[]] {
  const nodes = reactFlowInstance.getNodes();
  const edges = reactFlowInstance.getEdges();

  const candidates = nodes.filter((node) => getIncomers(node, nodes, edges).length === 0);

  const paths = new Set(candidates.map((candidate) => getNodePath(candidate, nodes, edges)));
  const longestPath = [...paths].reduce((acc, path) => (path.length > acc.length ? path : acc), []);
  const rest = new Set(paths);
  rest.delete(longestPath);

  return [longestPath, [...rest].flat()];
}
