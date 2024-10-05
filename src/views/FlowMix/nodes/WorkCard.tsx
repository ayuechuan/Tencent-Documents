import { Handle, NodeProps, Position } from '@xyflow/react'

export function WorkflowCard({
  id,
  data,
}: NodeProps & {
  data: {
    opacity: number
    title: string
    label: string
  }
}) {
  return (
    <div className={`flow_card ${data?.className ?? ''}`}>
      <Handle type="target" position={Position.Top} />
      <div>
        <span />
        <span>{data.title}</span>
      </div>
      {data.label && <p>{data.label}</p>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
