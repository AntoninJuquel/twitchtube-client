import ReactFlow, {
  ReactFlowProvider,
  useReactFlow,
  Background,
  BackgroundVariant,
} from 'reactflow';

function Flow() {
  const reactFlowInstance = useReactFlow();
  return (
    <ReactFlow
      fitView
      minZoom={0.1}
      defaultNodes={[]}
      defaultEdges={[]}
      connectOnClick={false}
      connectionRadius={100}
      //   nodeTypes={nodeTypes}
      //   selectionMode={SelectionMode.Partial}
      //   defaultEdgeOptions={defaultEdge}
      //   onEdgesChange={checkLinearGraph}
      //   onConnect={checkLinearGraph}
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
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
