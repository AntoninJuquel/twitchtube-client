import { useEffect, useState, useCallback } from 'react';

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Edge,
  SelectionMode,
  getOutgoers,
  getIncomers,
  Node,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';

import { Fab, Icon, Zoom, colors } from '@mui/material';
import { TwitchClip } from 'twitch-api-helix';

import * as api from '@/api';

import VideoPanel from './VideoPanel';
import VideoNode from './VideoNode';

type VideoFlowProps = {
  selectedClips: Omit<Map<string, TwitchClip>, 'clear' | 'set' | 'delete'>;
};

const nodeTypes = { videoNode: VideoNode };

const defaultEdge = {
  type: 'smoothstep',
  animated: true,
  style: {
    stroke: colors.lightBlue[900],
    strokeWidth: 2,
  },
};

function isLinearGraph(nodes: Node[], edges: Edge[]): Node[] | null {
  const startNodes = nodes.filter(
    (node) => getIncomers(node, nodes, edges).length === 0
  );
  const endNodes = nodes.filter(
    (node) => getOutgoers(node, nodes, edges).length === 0
  );

  if (startNodes.length !== 1 || endNodes.length !== 1) {
    return null;
  }

  const [startNode] = startNodes;
  const [endNode] = endNodes;

  const uniquePredsAndSuccessors = nodes.every((node) => {
    const incomers = getIncomers(node, nodes, edges);
    const outgoers = getOutgoers(node, nodes, edges);
    return (
      incomers.length === (node === startNode ? 0 : 1) &&
      outgoers.length === (node === endNode ? 0 : 1)
    );
  });

  if (!uniquePredsAndSuccessors) {
    return null;
  }

  const linearNodes = [startNode];
  let currentNode = startNode;

  while (currentNode !== endNode) {
    const [nextNode] = getOutgoers(currentNode, nodes, edges);
    linearNodes.push(nextNode);
    currentNode = nextNode;
  }

  return linearNodes;
}

async function upload(clips: TwitchClip[]) {
  const data = clips.map((clip) => {
    const slicePoint = clip.thumbnail_url.indexOf('-preview-');
    const videoUrl = `${clip.thumbnail_url.slice(0, slicePoint)}.mp4`;
    return {
      layers: [
        {
          type: 'video',
          path: videoUrl,
        },
      ],
    };
  });
  await api.postVideoStart(data);
}

function Flow({ selectedClips }: VideoFlowProps) {
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    const nodes = Array.from(selectedClips.values()).map((clip) => ({
      id: clip.id,
      type: 'videoNode',
      data: clip,
      position: { x: Math.random() * 10, y: Math.random() * 10 },
    }));
    reactFlowInstance.setNodes(nodes);
  }, [selectedClips, reactFlowInstance]);

  const [linearGraph, setLinearGraph] = useState<Node[] | null>();

  const checkLinearGraph = useCallback(() => {
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    setLinearGraph(isLinearGraph(nodes, edges));
  }, [reactFlowInstance]);

  const uploadResult = useCallback(() => {
    if (linearGraph) {
      upload(linearGraph.map((node) => node.data as TwitchClip));
    }
  }, [linearGraph]);

  return (
    <ReactFlow
      fitView
      minZoom={0.1}
      nodeTypes={nodeTypes}
      selectionMode={SelectionMode.Partial}
      defaultEdgeOptions={defaultEdge}
      defaultNodes={[]}
      defaultEdges={[]}
      onEdgesChange={checkLinearGraph}
      onConnect={checkLinearGraph}
      connectOnClick={false}
      connectionRadius={100}
    >
      <VideoPanel />
      <Controls />
      <MiniMap />
      <Zoom in={!!linearGraph}>
        <Fab
          onClick={uploadResult}
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

export default function VideoFLow({ selectedClips }: VideoFlowProps) {
  return (
    <ReactFlowProvider>
      <Flow selectedClips={selectedClips} />
    </ReactFlowProvider>
  );
}
