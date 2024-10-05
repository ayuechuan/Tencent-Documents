import './index.less'

import { addEdge, Edge, Handle, MarkerType, Node, NodeProps, NodeResizer, Position, useReactFlow } from '@xyflow/react'
import { Button } from 'tdesign-react'
import { v4 as uuid } from 'uuid'

import { IconFont } from '@/utils/iconFont'

import { useNodeController } from '../hooks/useNodeController'

export function ButtonNode(
  props: NodeProps & {
    data: {
      label: string
    }
  },
) {
  const { selected, data, width, height, id, positionAbsoluteX, positionAbsoluteY } = props
  const { addNode } = useNodeController()
  const { setEdges } = useReactFlow()

  function add() {
    const uid = uuid()
    const node: Node = {
      id: uid,
      type: 't-node-btn',
      position: {
        x: positionAbsoluteX + +(width ?? 0) + 100,
        y: positionAbsoluteY,
      },
      width: 150,
      height: 62,
      selected: false,
      data: {
        label: '腾讯文档',
        className: 'animate__animated animate__flash',
      },
    }
    addNode(node)
    setTimeout(() => {
      setEdges((prevEdges) =>
        addEdge(
          {
            type: 't-edge-floating',
            animated: true,
            style: {
              stroke: 'rgb(158, 118, 255)',
              strokeWidth: 1,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: 'rgb(158, 118, 255)',
              // strokeWidth: 2,
            },
            id: uid,
            source: id,
            target: uid,
          },
          prevEdges,
        ),
      )
    })
  }

  return (
    <div className={`btn-node ${data?.className ?? ''}`}>
      <NodeResizer color="#0059FF" isVisible={selected} />
      <div className="btn-container">
        <Button type="button" style={{ height: 50 }}>
          {data?.label || '腾讯文档'}
        </Button>
      </div>
      {selected && (
        <div
          style={{
            display: 'flex',
            fontSize: 15,
            right: 0,
            top: `${height! / 2}px`,
            position: 'absolute',
            transform: `translate(25px,-30%)`,
            zIndex: 9999,
            cursor: 'pointer',
          }}
          onClick={(event) => {
            event.stopPropagation()
            event.preventDefault()
            add()
          }}
        >
          <IconFont type="icon-jiahao" />
        </div>
      )}
      <Handle type="source" style={{ backgroundColor: '#0059FF' }} color="#0059FF" position={Position.Top} id="a" />
      <Handle type="source" style={{ backgroundColor: '#0059FF' }} position={Position.Right} id="b" />
      <Handle type="source" style={{ backgroundColor: '#0059FF' }} position={Position.Bottom} id="c" />
      <Handle type="source" style={{ backgroundColor: '#0059FF' }} position={Position.Left} id="d" />
    </div>
  )
}
