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
  ControlButton,
} from 'reactflow';

import { Icon, colors } from '@mui/material';
import { TwitchClip } from 'twitch-api-helix';

import * as api from '@/api';

import VideoHelpPanel from './VideoHelpPanel';
import VideoNode from './VideoNode';
import VideoInfoPanel from './VideoInfoPanel';

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

  const [linearGraph, setLinearGraph] = useState<Node[] | null>();
  const checkLinearGraph = useCallback(() => {
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    const linearNodes = isLinearGraph(nodes, edges);
    const updatedNodes = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        videoPosition: 'middle',
      },
    }));
    if (linearNodes) {
      updatedNodes[0].data.videoPosition = 'start';
      updatedNodes[nodes.length - 1].data.videoPosition = 'end';
    }
    reactFlowInstance.setNodes(updatedNodes);
    setLinearGraph(linearNodes);
  }, [reactFlowInstance]);

  useEffect(() => {
    const currentNodes = reactFlowInstance.getNodes();
    const nodes = Array.from(selectedClips.values()).map((clip, index) => ({
      id: clip.id,
      type: 'videoNode',
      data: clip,
      position: {
        x:
          currentNodes[index]?.position?.x ||
          Math.random() * 50 * selectedClips.size,
        y:
          currentNodes[index]?.position?.y ||
          Math.random() * 50 * selectedClips.size,
      },
    }));
    reactFlowInstance.setNodes(nodes);
    checkLinearGraph();
  }, [selectedClips, checkLinearGraph, reactFlowInstance]);

  const uploadResult = useCallback(() => {
    if (linearGraph) {
      upload(linearGraph.map((node) => node.data as TwitchClip));
    }
  }, [linearGraph]);

  const autoConnect = useCallback(() => {
    const nodes = reactFlowInstance.getNodes();

    // eslint-disable-next-line no-plusplus
    for (let i = nodes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
    }

    const edges = nodes.map((node, index) => {
      nodes[index].position = {
        x: index * 300,
        y: index % 2 === 0 ? 0 : 400,
      };

      return {
        id: `${node.id}-${nodes[index + 1]?.id}`,
        source: node.id,
        target: nodes[index + 1]?.id,
      };
    });

    reactFlowInstance.setNodes(nodes);
    reactFlowInstance.setEdges(edges);
    checkLinearGraph();
  }, [reactFlowInstance, checkLinearGraph]);

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
      <VideoHelpPanel />
      <VideoInfoPanel
        selectedClips={selectedClips}
        upload={uploadResult}
        linearGraph={Boolean(linearGraph)}
      />
      <Controls>
        <ControlButton onClick={autoConnect} title="auto connect">
          <Icon fontSize="small">route</Icon>
        </ControlButton>
      </Controls>
      <MiniMap />
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
