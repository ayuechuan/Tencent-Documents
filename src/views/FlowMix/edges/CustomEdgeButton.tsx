import {
  EdgeProps,
  getBezierPath,
  getEdgeCenter,
} from "@xyflow/react";

const foreignObjectSize = 40;

export function CustomEdgeButton({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  // const edgePath = getBezierPath({
  //   sourceX,
  //   sourceY,
  //   sourcePosition,
  //   targetX,
  //   targetY,
  //   targetPosition
  // }); //
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });
  // const markerEnd = getMarkerEnd(ArrowHeadType.ArrowClosed, markerEndId);
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY
  });
  return (
    <>

      <path
        id={id}
        style={style}
        className="react-flow__edge-path animated"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2 + 10}
        y={edgeCenterY - foreignObjectSize / 2 +2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
          <button
            className="edgebutton"
            onClick={(event) => {
              event.stopPropagation();
              // data?.onRemove && data.onRemove(id);
            }}
          >
           X
          </button>
      </foreignObject>
    </>
  );
}