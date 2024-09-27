import { Handle, NodeProps, Position } from "@xyflow/react";
import { Button } from "tdesign-react";
import { CustomHandle } from "../handles";

export function ProcessEndedNode(props: NodeProps & {
  data: {
    label: string
  }
}) {
  return (
    <div>
      <Button
        disabled
        type='button'
        style={{ width: 300, cursor: 'auto' }}
      >{props.data?.label}</Button>
      <CustomHandle
        type={'target'}
        position={Position.Top} />
    </div>
  )
}


