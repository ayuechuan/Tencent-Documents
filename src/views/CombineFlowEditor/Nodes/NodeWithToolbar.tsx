import { NodeProps, NodeToolbar, Position } from '@xyflow/react'
import { Button } from 'tdesign-react'

export function NodeWithToolbar({
  data,
}: NodeProps & {
  data: {
    forceToolbarVisible: boolean
    toolbarPosition: Position
  }
}) {
  return (
    <>
      <NodeToolbar isVisible={data.forceToolbarVisible || undefined} position={data.toolbarPosition}>
        <Button type="button">cut</Button>
        <Button type="button">copy</Button>
        <Button type="button">paste</Button>
      </NodeToolbar>
      <div className="react-flow__node-default">{'1212151541514'}</div>
    </>
  )
}
