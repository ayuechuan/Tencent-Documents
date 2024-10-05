import { Handle, NodeProps, Position } from '@xyflow/react'

import { CustomHandle } from '../handles'

export function PaymentCountry(props: NodeProps<any>) {
  return (
    <div>
      <div
        style={{
          width: 200,
          background: 'green',
        }}
      >
        {props?.data!.curreny}
      </div>
      <CustomHandle type="target" position={Position.Left} />
      <CustomHandle type="source" position={Position.Bottom} />
    </div>
  )
}
