import { useState, useCallback, useEffect } from 'react';
import { useToggle } from 'usehooks-ts';
import { Icon, colors } from '@mui/material';
import ReactFlow, {
  ReactFlowProvider,
  useReactFlow,
  Background,
  BackgroundVariant,
  Node,
  MiniMap,
  SelectionMode,
  Controls,
  ControlButton,
  Panel,
} from 'reactflow';

import { buildLinearGraph } from '@/utils/video';
import { Clip } from '@/remotion/Clip';
import { useVideo } from '@/contexts/VideoContext';
import VideoClipNode from './VideoClipNode';
import VideoPlayer from './VideoPlayer';

const nodeTypes = { clip: VideoClipNode };

function FlowControls({ setLinearGraph }: { setLinearGraph: (clips: Clip[]) => void }) {
  const reactFlowInstance = useReactFlow<Clip>();
  const [stack, toggleStack] = useToggle(false);

  const stackNodes = useCallback(() => {
    const [longestPath, rest] = buildLinearGraph(reactFlowInstance);
    const nodes = [...longestPath, ...rest].map((node, index) => ({
      ...node,
      position: stack ? { x: 0, y: index * 400 } : { x: index * 300, y: (index % 2) * 400 },
    }));
    reactFlowInstance.setNodes(nodes);
    toggleStack();
  }, [reactFlowInstance, stack, toggleStack]);

  const autoConnect = useCallback(() => {
    const [longestPath, rest] = buildLinearGraph(reactFlowInstance);
    const nodes = [...longestPath, ...rest].map((node, index) => ({
      ...node,
      position: { x: index * 300, y: (index % 2) * 400 },
    }));
    const edges = nodes.map((node, index) => {
      const nextNode = nodes[index + 1];
      return {
        id: `${node.id}-${nextNode?.id}`,
        source: node.id,
        target: nextNode?.id,
      };
    });
    reactFlowInstance.setEdges(edges);
    reactFlowInstance.setNodes(nodes);
  }, [reactFlowInstance]);

  const shuffle = useCallback(() => {}, []);

  return (
    <Controls showInteractive={false} showZoom={false}>
      <ControlButton title={`stack ${stack ? 'vertically' : 'horizontally'}`} onClick={stackNodes}>
        <Icon fontSize="small">{stack ? 'view_stream' : 'view_week'}</Icon>
      </ControlButton>
      <ControlButton title="auto connect" onClick={autoConnect}>
        <Icon fontSize="small">route</Icon>
      </ControlButton>
      <ControlButton title="shuffle" onClick={autoConnect}>
        <Icon fontSize="small">shuffle</Icon>
      </ControlButton>
    </Controls>
  );
}

const defaultEdge = {
  type: 'smoothstep',
  animated: true,
  style: {
    stroke: colors.lightBlue[900],
    strokeWidth: 2,
  },
};

function Flow() {
  const reactFlowInstance = useReactFlow<Clip>();
  const { clips, removeClip } = useVideo();
  const [linearGraph, setLinearGraph] = useState<Clip[]>([]);

  const updateLinearGraph = useCallback(() => {
    if (reactFlowInstance) {
      const [longestPath] = buildLinearGraph(reactFlowInstance);
      setLinearGraph(longestPath.map((node) => node.data));
    }
  }, [reactFlowInstance]);

  const handleNodeDelete = useCallback(
    (nodes: Node<Clip>[]) => {
      nodes.forEach((node) => {
        removeClip(node.data);
      });
    },
    [removeClip]
  );

  useEffect(() => {
    if (reactFlowInstance && clips) {
      const currentNodes = reactFlowInstance.getNodes();
      const currentEdges = reactFlowInstance.getEdges();
      const nodes: Node[] = Array.from(clips.values()).map((clip, index) => ({
        id: clip.id,
        type: 'clip',
        data: clip,
        position: {
          x: currentNodes[index]?.position?.x || index * 300,
          y: currentNodes[index]?.position?.y || (index % 2) * 400,
        },
      }));

      const edges = currentEdges.filter((edge) => {
        const source = nodes.find((node) => node.id === edge.source);
        const target = nodes.find((node) => node.id === edge.target);
        return source && target;
      });

      reactFlowInstance.setNodes(nodes);
      reactFlowInstance.setEdges(edges);

      updateLinearGraph();
    }
  }, [reactFlowInstance, clips, updateLinearGraph]);

  return (
    <ReactFlow
      fitView
      minZoom={0.1}
      defaultNodes={[]}
      defaultEdges={[]}
      connectOnClick={false}
      connectionRadius={100}
      nodeTypes={nodeTypes}
      selectionMode={SelectionMode.Partial}
      onEdgesChange={updateLinearGraph}
      onConnect={updateLinearGraph}
      onNodesDelete={handleNodeDelete}
      defaultEdgeOptions={defaultEdge}
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <MiniMap />
      <FlowControls setLinearGraph={setLinearGraph} />
      <Panel position="bottom-center">
        <VideoPlayer clips={linearGraph} />
      </Panel>
    </ReactFlow>
  );
}

export default function VideoFLow() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
