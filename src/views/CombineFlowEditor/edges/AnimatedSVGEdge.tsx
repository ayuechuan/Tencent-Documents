import { BaseEdge, EdgeProps, getBezierPath, getSmoothStepPath, SmoothStepEdge } from '@xyflow/react'

export function AnimatedSVGEdge(props: EdgeProps) {
  const [edgePath] = getSmoothStepPath(props)
  const [edgePaths] = getBezierPath(props)

  console.log('props', props)

  return (
    <>
      {!props.selected && <SmoothStepEdge {...props} />}
      {props.selected && <BaseEdge {...props} path={edgePaths} />}
      <circle r="5" fill="#ff0073">
        <animateMotion dur="4s" repeatCount="indefinite" path={edgePath} />
      </circle>
      {/* <circle r="10" fill="#ff0073">
        <animateMotion dur="4s" repeatCount="indefinite" path={edgePath} />
      </circle>
      <line
        x1={-5}
        y1={0.5}
        x2={0}
        y2={0.5}
        stroke="blue"
        strokeWidth="2"
      >
        <animateMotion dur="4s" repeatCount="indefinite" path={edgePath} />
      </line>
      <polygon
        points="5,0.5 0,-2 0,3"
        fill="blue"
      >
        <animateMotion dur="4s" repeatCount="indefinite" path={edgePath} />
      </polygon> */}
    </>
  )
}
// // 固定三角形的三个顶点
// const points = "50,15 90,85 10,85";

// return (
//   <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
//     <polygon points={points} fill="blue" />
//   </svg>

{
  /* <polygon
        points={`5,1 ${0},${-2} ${0},${3}`}
        fill="blue"
      >
        <animateMotion dur="4s" repeatCount="indefinite" path={edgePath} />
      </polygon> */
}
