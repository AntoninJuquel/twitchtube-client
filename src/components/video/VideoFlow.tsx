import { useState, useCallback, useEffect } from 'react';
import { Icon, colors } from '@mui/material';
import ReactFlow, {
  ReactFlowInstance,
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

import {
  buildLinearGraph,
  connectNodes,
  disconnectNodes,
  randomizeNodes,
  handlePosition,
  computePosition,
} from '@/utils/video';
import { Clip } from '@/remotion/Clip';
import { useVideo } from '@/contexts/VideoContext';
import VideoClipNode from './VideoClipNode';
import VideoPlayer from './VideoPlayer';

const nodeTypes = { clip: VideoClipNode };

const defaultEdge = {
  type: 'smoothstep',
  animated: true,
  style: {
    stroke: colors.lightBlue[900],
    strokeWidth: 2,
  },
};

type ActionFunction = (instance: ReactFlowInstance) => void;

function Flow() {
  const reactFlowInstance = useReactFlow<Clip>();
  const { removeClip } = useVideo();

  const [linearGraph, setLinearGraph] = useState<Clip[]>([]);

  const [horizontal, setHorizontal] = useState(true);

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

  const onClipAdded = useCallback(
    (event: CustomEvent<Clip>) => {
      if (!reactFlowInstance) return;
      const clip = event.detail;
      reactFlowInstance.addNodes({
        id: clip.id,
        type: 'clip',
        data: clip,
        position: computePosition(reactFlowInstance.getNodes().length, horizontal),
      });
      updateLinearGraph();
    },
    [reactFlowInstance, horizontal, updateLinearGraph]
  );

  const onClipRemoved = useCallback(
    (event: CustomEvent<Clip>) => {
      if (!reactFlowInstance) return;
      const removedClip = event.detail;
      const nodes = reactFlowInstance.getNodes();
      const removedNode = nodes.find((node) => node.id === removedClip.id);
      if (removedNode) {
        reactFlowInstance.deleteElements({
          nodes: [removedNode],
        });
      }
      updateLinearGraph();
    },
    [reactFlowInstance, updateLinearGraph]
  );

  useEffect(() => {
    document.addEventListener('video:clip:added', onClipAdded);
    document.addEventListener('video:clip:removed', onClipRemoved);

    return () => {
      document.removeEventListener('video:clip:added', onClipAdded);
      document.removeEventListener('video:clip:removed', onClipRemoved);
    };
  }, [onClipAdded, onClipRemoved]);

  const handleControlClick = useCallback(
    (action: ActionFunction) => {
      if (!reactFlowInstance) return;

      action(reactFlowInstance);
      const nodes = reactFlowInstance.getNodes();
      reactFlowInstance.setNodes(nodes.map(handlePosition(horizontal)));
      updateLinearGraph();
    },
    [reactFlowInstance, horizontal, updateLinearGraph]
  );

  const toggleDirection = useCallback(() => {
    setHorizontal((prev) => {
      const nodes = reactFlowInstance.getNodes();
      reactFlowInstance.setNodes(nodes.map(handlePosition(!prev)));
      return !prev;
    });
  }, [reactFlowInstance]);

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
      <Controls showInteractive={false} showZoom={false}>
        <ControlButton
          title={`stack ${horizontal ? 'vertically' : 'horizontally'}`}
          onClick={toggleDirection}
        >
          <Icon fontSize="small">{horizontal ? 'view_stream' : 'view_week'}</Icon>
        </ControlButton>
        <ControlButton title="auto connect" onClick={() => handleControlClick(connectNodes)}>
          <Icon fontSize="small">route</Icon>
        </ControlButton>
        <ControlButton title="shuffle" onClick={() => handleControlClick(randomizeNodes)}>
          <Icon fontSize="small">shuffle</Icon>
        </ControlButton>
        <ControlButton title="disconnect" onClick={() => handleControlClick(disconnectNodes)}>
          <Icon fontSize="small">restart_alt</Icon>
        </ControlButton>
      </Controls>
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
