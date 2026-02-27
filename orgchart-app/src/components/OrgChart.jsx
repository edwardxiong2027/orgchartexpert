import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import OrgNode from "./OrgNode";
import { buildOrgFlowData } from "../utils/layoutUtils";

const nodeTypes = { orgNode: OrgNode };

export default function OrgChart({
  members,
  selectedNode,
  onSelectNode,
  flowRef,
}) {
  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(
    () => buildOrgFlowData(members),
    [members]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  // Update nodes/edges when layout changes
  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
    // Fit view after layout
    setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 100);
  }, [layoutNodes, layoutEdges, setNodes, setEdges, fitView]);

  // Highlight selected node
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: n.id === selectedNode,
      }))
    );
  }, [selectedNode, setNodes]);

  const onNodeClick = useCallback(
    (_, node) => {
      onSelectNode(node.id);
    },
    [onSelectNode]
  );

  const onPaneClick = useCallback(() => {
    onSelectNode(null);
  }, [onSelectNode]);

  return (
    <div id="orgchart-canvas" className="w-full h-full" ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={20} size={1} />
        <Controls position="bottom-right" />
        <MiniMap
          position="bottom-left"
          nodeColor={(n) => n.data?.color || "#4A90B8"}
          maskColor="rgba(255,255,255,0.8)"
          style={{ width: 150, height: 100 }}
        />
      </ReactFlow>
    </div>
  );
}
