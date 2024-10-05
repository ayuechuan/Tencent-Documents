import '@xyflow/react/dist/style.css'
import './index.less'

import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  ConnectionLineType,
  ConnectionMode,
  Controls,
  Edge,
  EdgeTypes,
  MarkerType,
  MiniMap,
  Node,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useConnection,
  useEdges,
  useEdgesState,
  useHandleConnections,
  useKeyPress,
  useNodesState,
  useOnViewportChange,
  useReactFlow,
  useViewport,
  ViewportPortal,
} from '@xyflow/react'
import { useMount } from 'ahooks'
import { LegacyRef, useCallback } from 'react'
import { Button } from 'tdesign-react'

import { AnimatedSVGEdge } from './edges/AnimatedSVGEdge'
import { BezierEdgeComponent } from './edges/bezierEdge'
import { MakerEdge } from './edges/EgdeMaker'
import {
  FormNode,
  NodeWithToolbar,
  PaymentCountry,
  PaymentInit,
  ProcessEndedNode,
  ResizerNode,
  TextNode,
} from './Nodes'
import AnnotationNode from './Nodes/AnnotationNode'
import Pingmiantu from './Nodes/Pingmiantu'

const nodeTypes = {
  PaymentInit,
  PaymentCountry,
  annotation: AnnotationNode,
  resizer: ResizerNode,
  textinput: TextNode,
  form: FormNode,
  'node-with-toolbar': NodeWithToolbar,
  ProcessEndedNode,
  pingmiantu: Pingmiantu,
} as unknown as NodeTypes

const edgeTypes = {
  BezierEdgeComponent,
  animatedSvg: AnimatedSVGEdge,
  logo: MakerEdge,
} as EdgeTypes

const initialEdges: Edge[] = [
  {
    id: '1',
    source: '1',
    // sourceHandle: 'a',
    target: '2',
    type: 'animatedSvg',
    animated: true,
    style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 3 },
  },
  {
    id: '100',
    source: '2',
    // sourceHandle: 'a',
    target: '3-2',
    type: 'animatedSvg',
    animated: true,
    style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 3 },
  },
  {
    id: 'e-3333333',
    source: '1',
    target: '3-5',
    type: 'animatedSvg',
    // type: 'logo',
    // markerEnd: 'logo',
    // animated: true,
    animated: true,
    style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 3 },
  },
]

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 520, y: 100 },
    data: {
      amount: 200,
      className: '',
    },
    type: 'PaymentInit',
    className: 'flow_error',
  },
  {
    id: '2',
    position: { x: 300, y: 20 },
    data: { curreny: '$' },
    style: {
      background: 'green',
    },
    type: 'PaymentCountry',
  },
  {
    id: 'annotation-1',
    type: 'annotation',
    draggable: false,
    selectable: false,
    data: {
      level: 1,
      label: 'Built-in node and edge types. Draggable, deletable and connectable!',
      arrowStyle: {
        right: 0,
        bottom: 0,
        transform: 'translate(-30px,10px) rotate(0deg)',
      },
    },
    position: { x: -80, y: -30 },
  },
  {
    id: '2-3',
    type: 'resizer',
    data: {
      label: 'resizable node',
    },
    position: { x: 0, y: 50 },
    style: {
      width: 80,
      height: 80,
      background: 'rgb(208, 192, 247)',
      color: 'white',
    },
  },
  {
    id: '3-2',
    type: 'textinput',
    position: { x: 0, y: 250 },
    data: {},
    width: 200,
    height: 100,
    // style:{
    //   width: 200,
    //   minHeight: 100,
    // }
  },
  {
    id: '3-5',
    type: 'form',
    position: { x: 300, y: 250 },
    data: {},
    style: {
      width: 500,
      minHeight: 400,
      background: '#da5eaa',
      color: 'white',
      borderRadius: 3,
      padding: '0 10px 20px 10px',
    },
  },
  // {
  //   id: '1000',
  //   position: { x: 220, y: 0 },
  //   type: 'node-with-toolbar',
  //   data: { label: 'Select me to show the toolbar' }
  // }
  {
    id: '1000',
    position: { x: 0, y: 100 },
    type: 'ProcessEndedNode',
    data: { label: 'END' },
  },
]

export const NestedFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // useStoreApi();
  // useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) => {
      console.log('connection', connection)

      const egee = {
        ...connection,
        animated: true,
        id: `${edges.length + 1} + 1`,
        type: 'BezierEdgeComponent',
        style: {
          stroke: 'red' || connection.targetHandle || 'rgb(158, 118, 255)',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: 'red' || 'rgb(158, 118, 255)',
        },
      } as Connection | Edge
      setEdges((prevEdges) => addEdge(egee, prevEdges))
    },
    [edges],
  )

  // useMount(()=>{
  //   setNodes((nds) =>{
  //     return nds.map((n) => {
  //        if (n.id === '1') {
  //          return {
  //            ...n,
  //            data:{
  //              ...n.data,
  //              className: 'animate__animated animate__bounceInDown'
  //            }
  //          };
  //        }

  //        return n;
  //      })
  //    })
  // })

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlowProvider>
        <Buts></Buts>
        <Button type="button" onClick={() => {}}>
          导出
        </Button>
        <Button
          type="button"
          onClick={() => {
            //  计时
            const end = performance.now()
            import('html2canvas').then((instace) => {
              //  计时结束
              const now = performance.now()
              // console.log('time----------', now - old);
              console.log(`Execution time-------: ${now - end} milliseconds`)
              instace.default(document.body).then((canvas) => {
                // const image = canvas.toDataURL('image/png')
                // const link = document.createElement('a')
                // link.href = image
                // link.download = 'image.png'
                // link.click()
              })
            })
          }}
        >
          截图
        </Button>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          className="react-flow-subflows-example"
          // nodeOrigin={[20,20]}
          fitView
          // connectionLineComponent={ConnectionLineComponent}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionMode={ConnectionMode.Strict}
          // connectionLineContainerStyle={{background : 'red'}}
          connectOnClick={true}
          connectionLineStyle={{
            stroke: '#F6AD55',
            strokeWidth: 3,
          }}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={{
            hideAttribution: true,
          }}
          snapToGrid={true}
          onPaneClick={() => {
            console.log('eventtttt')
          }}
          onMouseDownCapture={() => {
            console.log('eventtttt15151')
          }}
          onPaneScroll={() => {
            console.log(15151)
          }}
          panOnScroll
          selectionOnDrag
          panOnDrag={[1, 2]}
          selectionMode={SelectionMode.Partial}
        >
          <Controls />
          <MiniMap zoomable pannable nodeStrokeWidth={3} nodeClassName={(node) => node.type!} />
          <Background variant={BackgroundVariant.Dots} gap={[12, 12]} bgColor="#FFF" />
          {/* <Maker /> */}
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}

export function Maker() {
  // const connection = useConnection();
  // const edges = useEdges();
  // const connections = useHandleConnections({ type: 'target' });
  // const keypress = useKeyPress('Ctrl+c');

  // useOnViewportChange({
  //   onStart:()=>{

  //   }
  // })

  // const { x, y ,zoom } = useViewport();

  return (
    <ViewportPortal>
      <div style={{ transform: 'translate(-100px, 10px)', position: 'absolute' }}>
        This div is positioned at [100, 100] on the flow.
      </div>
    </ViewportPortal>
  )
}

export const ConnectionLineComponent = ({ fromX, fromY, toX, toY }: any) => {
  const { fromHandle } = useConnection()

  // 计算中点
  const midX = (fromX + toX) / 2
  const midY = (fromY + toY) / 2

  // 三角形的第三个顶点偏离中点
  const offset = 30 // 偏移量，用于调整三角形的高度
  const thirdX = midX
  const thirdY = midY - offset

  const points = `${fromX},${fromY} ${toX},${toY} ${thirdX},${thirdY}`
  return (
    <g>
      <path
        fill="none"
        stroke={fromHandle!.id || ''}
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${toX},${toY} ${toX},${toY}`}
        strokeDasharray="10 10"
      />
      <circle cx={toX} cy={toY} fill="#fff" r={10} stroke={fromHandle!.id || ''} strokeWidth={1.5} />
    </g>
  )
}

function Buts() {
  const flow = useReactFlow()
  return (
    <div>
      <Button
        onClick={() => {
          const object = flow.toObject()
          console.log('object', object)
        }}
      >
        按钮
      </Button>
    </div>
  )
}
