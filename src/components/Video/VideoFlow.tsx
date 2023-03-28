import axios from 'axios';
import { useCallback, useEffect, useRef } from 'react';

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Connection,
  Edge,
  SelectionMode,
  getOutgoers,
  getIncomers,
  Node,
} from 'reactflow';

import { Fab, Icon, Zoom } from '@mui/material';
import { TwitchClip } from '@/api';

import VideoPanel from './VideoPanel';
import VideoNode from './VideoNode';

type VideoFlowProps = {
  selectedClips: Omit<Map<string, TwitchClip>, 'clear' | 'set' | 'delete'>;
};

const nodeTypes = { videoNode: VideoNode };

const defaultEdge = {
  type: 'smoothstep',
  animated: true,
};

function getOrder(node: Node, nodes: Node[], edges: Edge[]): Node[] {
  const outgoers = getOutgoers(node, nodes, edges);
  return outgoers.reduce((res, outgoer) => {
    return res.concat(getOrder(outgoer, nodes, edges));
  }, outgoers);
}

function isLinearGraph(nodes: Node[], edges: Edge[]): boolean {
  const startNodes = nodes.filter(
    (node) => getIncomers(node, nodes, edges).length === 0
  ).length;
  const endNodes = nodes.filter(
    (node) => getOutgoers(node, nodes, edges).length === 0
  ).length;

  if (startNodes !== 1 || endNodes !== 1) {
    return false;
  }

  // Vérifier que chaque nœud a exactement un prédécesseur et un successeur (sauf le départ et l'arrivée)
  // const uniquePredsAndSuccessor = nodes.every((node) => {
  //   return (
  //     getIncomers(node, nodes, edges).length === 1 &&
  //     getOutgoers(node, nodes, edges).length === 1
  //   );
  // });
  // if (!uniquePredsAndSuccessor) {
  //   return false;
  // }

  // Vérifier qu'il n'y a pas de cycles ou d'intersections
  const visite = new Set<Node>();
  const dfs = (node: Node) => {
    visite.add(node);
    const outgoers = getOutgoers(node, nodes, edges);
    outgoers.some((outgoer) => {
      if (visite.has(outgoer)) {
        return true;
      }
      return dfs(outgoer);
    });
    visite.delete(node);
    return true;
  };

  return dfs(nodes[0]);
}

export default function VideoFlow({ selectedClips }: VideoFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const didConnect = useRef(false);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      didConnect.current = true;
      setEdges((es) => addEdge({ ...params, ...defaultEdge }, es));
    },
    [setEdges]
  );

  useEffect(() => {
    setNodes((prev) =>
      Array.from(selectedClips.values()).map((clip, index) => ({
        id: clip.id,
        position: prev[index]?.position || { x: 0, y: index * 100 },
        data: clip,
        type: 'videoNode',
        deletable: false,
      }))
    );
  }, [setNodes, selectedClips]);

  const onEdgeClick = useCallback(
    (e: React.MouseEvent, edge: Edge) => {
      if (!edge) return;

      if (e.altKey) {
        setEdges((es) => es.filter((el) => el.id !== edge.id));
      } else {
        setEdges((es) =>
          es.map((el) =>
            el.id === edge.id
              ? {
                  ...el,
                  type: el.type === 'smoothstep' ? 'default' : 'smoothstep',
                }
              : el
          )
        );
      }
    },
    [setEdges]
  );

  const allConnected = nodes.every((n) =>
    edges.some((e) => e.source === n.id || e.target === n.id)
  );

  if (nodes.length > 0) console.log(isLinearGraph(nodes, edges));

  const upload = useCallback(async () => {
    const node = nodes.find((n) => !edges.some((e) => e.target === n.id));

    if (!node) return;

    const order = [node, ...getOrder(node, nodes, edges)];

    axios.post('http://217.160.192.110:80/video', {
      clips: order.map((n) => n.data),
    });
  }, [nodes, edges]);

  return (
    <ReactFlow
      minZoom={0.1}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      // onConnectEnd={onConnectEnd}
      nodeTypes={nodeTypes}
      fitView
      onEdgeClick={onEdgeClick}
      selectionMode={SelectionMode.Partial}
    >
      <VideoPanel />
      <Controls />
      <MiniMap />
      <Zoom in={allConnected}>
        <Fab
          onClick={upload}
          sx={{ bottom: 32, left: '50%', position: 'fixed' }}
          color="primary"
        >
          <Icon>check</Icon>
        </Fab>
      </Zoom>
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
}
