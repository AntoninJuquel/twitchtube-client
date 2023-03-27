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
  useViewport,
  OnConnectStartParams,
  getOutgoers,
  Node,
} from 'reactflow';

import { Fab } from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';

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
  return outgoers.reduce((acc, outgoer) => {
    return acc.concat(getOrder(outgoer, nodes, edges));
  }, outgoers);
}

export default function VideoFlow({ selectedClips }: VideoFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { x, y, zoom } = useViewport();

  const connectingNodeId = useRef<string>('');
  const didConnect = useRef(false);

  const onConnectStart = useCallback(
    (
      event: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>,
      params: OnConnectStartParams
    ) => {
      connectingNodeId.current = params.nodeId as string;
    },
    []
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      didConnect.current = true;
      setEdges((es) => addEdge({ ...params, ...defaultEdge }, es));
    },
    [setEdges]
  );

  const onConnectEnd = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!didConnect.current) {
        const mouse = e as MouseEvent;
        const newNode = {
          id: 'new',
          position: { x: (mouse.x - x) / zoom, y: (mouse.y - y) / zoom },
          data: { label: 'new node' },
        };
        const newEdge = {
          id: 'new',
          source: connectingNodeId.current,
          target: newNode.id,
          ...defaultEdge,
        };

        setNodes((prev) => prev.concat(newNode));
        setEdges((prev) => prev.concat(newEdge));
      }
      didConnect.current = false;
    },
    [x, y, zoom, setNodes, setEdges]
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

  return (
    <ReactFlow
      minZoom={0.1}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnectStart={onConnectStart}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      nodeTypes={nodeTypes}
      fitView
      onEdgeClick={onEdgeClick}
      selectionMode={SelectionMode.Partial}
    >
      <VideoPanel />
      <Controls />
      <MiniMap />
      <Fab
        onClick={() => {
          const node = nodes.find((n) => !edges.some((e) => e.target === n.id));

          if (!node) return;

          const order = [node, ...getOrder(node, nodes, edges)];

          axios.post('http://217.160.192.110:80/video', {
            clips: order.map((n) => n.data),
          });
        }}
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: '50%',
          zIndex: 1000,
        }}
      >
        <CheckIcon />
      </Fab>
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
}
