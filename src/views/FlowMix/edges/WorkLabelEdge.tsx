import { EdgeProps } from "@xyflow/react";
import { EdgeLabelRenderer, getSmoothStepPath } from "@xyflow/react";

export default function WorkflowLabelledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps & {
  data: { label: string }
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} />
      <EdgeLabelRenderer>
        <div
          className="label_tag"
          style={{
            position : 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          {data.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}