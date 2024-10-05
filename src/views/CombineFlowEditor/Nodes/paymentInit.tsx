import { Handle, NodeProps, Position } from '@xyflow/react'
import { Button } from 'tdesign-react'

import { CustomHandle } from '../handles'

interface Props extends NodeProps {
  id: '1'
  position: {
    x: 100
    y: 100
  }
  data: { amount: 100; className: string }
  type: 'paymentInit'
}

export function PaymentInit(props: Props) {
  return (
    <div
      className={'animate__animated animate__wobble'}
      style={
        {
          // animationDelay : '1s'
        }
      }
    >
      <div
        style={{
          border: '2px solid red',
          padding: 20,
        }}
      >
        一起
      </div>
      <CustomHandle type={'source'} position={Position.Right} />
    </div>
  )
}
