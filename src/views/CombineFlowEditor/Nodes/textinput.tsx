import { Handle, NodeProps, Position, ReactFlowState, useReactFlow, useStore } from '@xyflow/react'
const dimensionAttrs = ['width', 'height']

export const TextNode = ({ id }: NodeProps) => {
  const { setNodes } = useReactFlow()
  const dimensions = useStore((s: ReactFlowState) => {
    const node = s.nodeLookup.get(id)
    if (
      !node ||
      // !node.width ||
      // !node.height ||
      !s.edges.some((edge) => edge.target === id)
    ) {
      return null
    }

    return {
      width: node.width,
      height: node.height,
    }
  })

  console.log('dimensions', dimensions)

  const updateDimension = (attr: any) => (event: any) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === '2-3') {
          return {
            ...n,
            style: {
              ...n.style,
              [attr]: parseInt(event.target.value),
            },
          }
        }

        return n
      }),
    )
  }

  return (
    <>
      <div className="wrapper gradient">
        <div className="inner">
          {dimensionAttrs.map((attr) => (
            <Fragment key={attr}>
              <label>node {attr}</label>
              <input
                type="number"
                // value={dimensions ? parseInt((dimensions as any)[attr]) : 0}
                onChange={updateDimension(attr)}
                className="nodrag"
                disabled={!dimensions}
              />
            </Fragment>
          ))}
          {!dimensionAttrs && 'no node connected'}
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
    </>
  )
}
