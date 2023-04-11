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
  ReactFlowInstance,
  getIncomers,
  getOutgoers,
  Panel,
} from 'reactflow';

import { Clip } from '@/remotion/Clip';
import { useVideo } from '@/contexts/VideoContext';
import VideoClipNode from './VideoClipNode';
import VideoPlayer from './VideoPlayer';

function buildLinearGraph(reactFlowInstance: ReactFlowInstance<Clip>) {
  const nodes = reactFlowInstance.getNodes();
  const edges = reactFlowInstance.getEdges();

  const linearGraph: Clip[] = [];
  const visited = new Set();

  let currentNode = nodes.find((node) => getIncomers(node, nodes, edges).length === 0);

  while (currentNode) {
    linearGraph.push(currentNode.data);
    visited.add(currentNode.data.id);
    [currentNode] = getOutgoers(currentNode, nodes, edges);
    if (!currentNode) {
      console.log('No outgoers');
      break;
    }
    if (visited.has(currentNode.data.id)) {
      console.error('Cycle detected');
      break;
    }
  }

  if (linearGraph.length === nodes.length) {
    console.log('Linear graph');
  }
  return linearGraph;
}

const nodeTypes = { clip: VideoClipNode };

function FlowControls({ setLinearGraph }: { setLinearGraph: (clips: Clip[]) => void }) {
  const [stack, toggleStack] = useToggle(false);
  const reactFlowInstance = useReactFlow<Clip>();

  const stackNodes = useCallback(() => {
    const nodes = reactFlowInstance.getNodes();

    nodes.forEach((node, index) => {
      const y = index % 2 === 0 ? 0 : 400;

      // eslint-disable-next-line no-param-reassign
      node.position = {
        x: stack ? 0 : index * 300,
        y: stack ? index * 400 : y,
      };
    });

    reactFlowInstance.setNodes([...nodes]);
    toggleStack();
  }, [reactFlowInstance, stack, toggleStack]);

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
    setLinearGraph(nodes.map((node) => node.data));
  }, [reactFlowInstance, setLinearGraph]);
  return (
    <Controls showInteractive={false}>
      <ControlButton title={`stack ${stack ? 'vertically' : 'horizontally'}`} onClick={stackNodes}>
        <Icon fontSize="small">{stack ? 'view_stream' : 'view_week'}</Icon>
      </ControlButton>
      <ControlButton title="auto connect" onClick={autoConnect}>
        <Icon fontSize="small">route</Icon>
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
  const { clips } = useVideo();
  const [linearGraph, setLinearGraph] = useState<Clip[]>([]);

  const checkLinearGraph = useCallback(() => {
    if (reactFlowInstance) {
      console.log('Checking linear graph');
      setLinearGraph(buildLinearGraph(reactFlowInstance));
    }
  }, [reactFlowInstance]);

  useEffect(() => {
    if (reactFlowInstance && clips) {
      const currentNodes = reactFlowInstance.getNodes();
      const nodes: Node[] = Array.from(clips.values()).map((clip, index) => ({
        id: clip.id,
        type: 'clip',
        data: clip,
        position: {
          x: currentNodes[index]?.position?.x || Math.random() * window.innerWidth,
          y: currentNodes[index]?.position?.y || Math.random() * window.innerHeight,
        },
      }));

      reactFlowInstance.setNodes(nodes);
      checkLinearGraph();
    }
  }, [reactFlowInstance, clips, checkLinearGraph]);

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
      onEdgesChange={checkLinearGraph}
      onConnect={checkLinearGraph}
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
