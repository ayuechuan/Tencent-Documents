import { EdgeProps, getBezierEdgeCenter, getBezierPath, getEdgeCenter, useInternalNode } from '@xyflow/react'
import { Position } from '@xyflow/react'

import { IconFont } from '@/utils/iconFont'

// returns the position (top,right,bottom or right) passed node compared to
function getParams(nodeA: any, nodeB: any) {
  const centerA = getNodeCenter(nodeA)
  const centerB = getNodeCenter(nodeB)

  const horizontalDiff = Math.abs(centerA.x - centerB.x)
  const verticalDiff = Math.abs(centerA.y - centerB.y)

  let position

  // when the horizontal difference between the nodes is bigger, we use Position.Left or Position.Right for the handle
  if (horizontalDiff > verticalDiff) {
    position = centerA.x > centerB.x ? Position.Left : Position.Right
  } else {
    // here the vertical difference between the nodes is bigger, so we use Position.Top or Position.Bottom for the handle
    position = centerA.y > centerB.y ? Position.Top : Position.Bottom
  }

  const [x, y] = getHandleCoordsByPosition(nodeA, position)
  return [x, y, position]
}

function getHandleCoordsByPosition(node: any, handlePosition: any) {
  // all handles are from type source, that's why we use handleBounds.source here
  const handle = node.internals.handleBounds.source.find((h: any) => h.position === handlePosition)

  let offsetX = handle.width / 2
  let offsetY = handle.height / 2

  // this is a tiny detail to make the markerEnd of an edge visible.
  // The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset
  // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0
      break
    case Position.Right:
      offsetX = handle.width
      break
    case Position.Top:
      offsetY = 0
      break
    case Position.Bottom:
      offsetY = handle.height
      break
  }

  const x = node.internals.positionAbsolute.x + handle.x + offsetX
  const y = node.internals.positionAbsolute.y + handle.y + offsetY

  return [x, y]
}

function getNodeCenter(node: any) {
  return {
    x: node.internals.positionAbsolute.x + node.measured.width / 2,
    y: node.internals.positionAbsolute.y + node.measured.height / 2,
  }
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: any, target: any) {
  const [sx, sy, sourcePos] = getParams(source, target)
  const [tx, ty, targetPos] = getParams(target, source)

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  }
}

function SimpleFloatingEdge({ id, source, target, markerEnd, style, selected }: EdgeProps) {
  const sourceNode = useInternalNode(source)
  const targetNode = useInternalNode(target)

  if (!sourceNode || !targetNode) {
    return null
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode)

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  })

  const [edgeCenterX, edgeCenterY] = getBezierEdgeCenter({
    sourceX: sx,
    sourceY: sy,
    sourceControlX: sx,
    sourceControlY: sy,
    targetControlX: tx,
    targetControlY: ty,
    targetX: tx,
    targetY: ty,
  })

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        stroke="#0052D9"
        strokeWidth={5}
        markerEnd={markerEnd}
        style={style}
      />
      <foreignObject
        width={25}
        height={21}
        visibility={selected ? 'visible' : 'hidden'}
        x={edgeCenterX - 40 / 2 + 7}
        y={edgeCenterY - 40 / 2 + 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="foreignObject-item">
          <IconFont type="icon-shanchu1" />
        </div>
      </foreignObject>
    </>
  )
}

export default SimpleFloatingEdge
