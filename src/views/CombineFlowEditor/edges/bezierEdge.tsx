import {
  BezierEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  SmoothStepEdge,
  useReactFlow,
} from '@xyflow/react'

import { IconFont } from '@/utils/iconFont'

export function BezierEdgeComponent(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, id } = props

  const [eggePath, labelX, labelY, offsetX] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const { setEdges } = useReactFlow()

  return (
    <>
      <SmoothStepEdge
        {...props}
        style={{
          ...props.style,
          animation: 'flash-animation 1.5s infinite',
        }}
      ></SmoothStepEdge>
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan"
          style={{
            color: 'red',
            position: 'absolute',
            pointerEvents: 'all',
            cursor: 'default',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <IconFont
            type="icon-bianpinghuatubiaosheji-"
            style={{ fontSize: 20, animation: 'flash-animation 1.5s infinite' }}
            onClick={() => setEdges((prev) => prev.filter((edge) => edge.id !== id))}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
