import { NodeProps } from "@xyflow/react";

export function LineMoveNode({
  data
}: NodeProps & {
  data: {
    background: string;
    label: string;
    className?: string
  }
}) {
  return (
    <div
      className={`${data?.className}`}
      style={{ background: data?.background, width: '100%', height: '100%' }}>
      {data?.label}
    </div>
  )
}