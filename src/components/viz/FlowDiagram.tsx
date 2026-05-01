import { ReactFlow, Background, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ServiceNode } from './ServiceNode'

const NODE_TYPES = { service: ServiceNode }

type Props = {
  nodes: Node[]
  edges: Edge[]
}

export function FlowDiagram({ nodes, edges }: Props) {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-surface-2">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnDrag={false}
      >
        <Background color="#21262d" gap={24} />
      </ReactFlow>
    </div>
  )
}
