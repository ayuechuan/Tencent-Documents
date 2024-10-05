import '@xyflow/react/dist/style.css'
import './index.less'
import '../CombineFlowEditor/index.less'

import {
  addEdge,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  Controls,
  Edge,
  EdgeTypes,
  MarkerType,
  MiniMap,
  Node,
  NodeChange,
  NodeTypes,
  OnNodesChange,
  ReactFlow,
  SelectionMode,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import { useMount, useUnmount } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { MutableRefObject } from 'react'
import { Button, Radio } from 'tdesign-react'
import { v4 as uuid } from 'uuid'

import { IconFont } from '@/utils/iconFont'

import { node_config } from './common'
import { getHelperLines } from './common/until'
import { DragOriginNode } from './components/DragOriginNode'
import { Header } from './components/header'
import { HelperLinesRenderer } from './components/helperLine'
import { CustomEdgeButton } from './edges/CustomEdgeButton'
import SimpleFloatingEdge from './edges/SimpleFloatingEdge'
import WorkflowLabelledEdge from './edges/WorkLabelEdge'
import { useFlowStore } from './FlowProvider'
import { FlowSocketClient } from './flowSocketNamespace/socket'
import { useFlowScoket } from './flowSocketNamespace/SocketProvider'
import { useNodeController } from './hooks/useNodeController'
import { ButtonNode } from './nodes/ButtonNode'
import { ImageNode } from './nodes/ImageNode'
import { LineMoveNode } from './nodes/LineMoveNode'
import { ShapeNode } from './nodes/ShapeNode'
import { WorkflowCard } from './nodes/WorkCard'
import { ConfigBar } from './Toolbar/ConfigBar'
import { ModeBar } from './Toolbar/ModeBar'
import { StyleBar } from './Toolbar/StyleBar'
import { WatermarkFlow } from './Toolbar/Watermark'

const INITNITIAL_NODES = [
  {
    id: '1',
    position: { x: 500, y: 400 },
    data: {
      amount: 200,
      mindmapColor: 'rgb(83, 86, 255)',
      className: 'animate__animated animate__rubberBand',
    },
    width: 150,
    height: 62,
    selected: false,
    type: 't-node-btn',
  },
  {
    id: '2',
    position: { x: 500, y: 100 },
    data: {
      amount: 200,
      mindmapColor: 'rgb(83, 86, 255)',
      className: 'animate__animated animate__rubberBand',
    },
    width: 150,
    height: 62,
    selected: false,
    type: 't-node-btn',
  },
  {
    id: '3',
    position: { x: 200, y: 400 },
    data: {
      label: '刘德华',
      tip: '刘德华 编辑中...',
      tipColor: '#0073E6',
      mindmapColor: 'rgb(83, 86, 255)',
      className: 'animate__animated animate__rubberBand',
    },
    width: 200,
    height: 80,
    selected: false,
    type: 'ShapeNode',
  },
  {
    id: '4',
    position: { x: 200, y: 200 },
    data: {
      label: 'google',
      tip: 'google 已将此节点锁定',
      tipColor: '#f95e24',
      mindmapColor: 'rgb(83, 86, 255)',
      className: 'animate__animated animate__rubberBand',
    },
    width: 200,
    height: 80,
    selected: false,
    type: 'ShapeNode',
  },
] as Node[]
const initialEdges = [
  {
    id: '1',
    source: '2',
    target: '1',
    type: 't-edge-floating',
    animated: false,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'rgb(158, 118, 255)',
    },
    style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 3 },
  },
] as Edge[]

const NODE_TYPES: NodeTypes = {
  't-node-btn': ButtonNode,
  't-node-image': ImageNode,
  WorkflowCard: WorkflowCard,
  LineMoveNode,
  ShapeNode,
}
const EDGES_TYPES: EdgeTypes = {
  't-edge-floating': SimpleFloatingEdge,
  't-edge-button': CustomEdgeButton,
  WorkflowLabelledEdge: WorkflowLabelledEdge,
}

export const FlowMix = observer(() => {
  const [nodes, setNodes, originOnNodeCahnge] = useNodesState(INITNITIAL_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const reactFlowInstance = useReactFlow()
  const store = useFlowStore()
  const { addNode } = useNodeController()
  const socket = useFlowScoket()

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            // type: "t-edge-floating",
            type: 't-edge-button',
            style: {
              stroke: 'rgb(158, 118, 255)',
              strokeWidth: 1,
            },
            markerEnd: {
              type: MarkerType.Arrow,
              color: 'rgb(158, 118, 255)',
              strokeWidth: 2,
            },
          },
          eds,
        ),
      ),
    [edges],
  )

  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    })
    const nodeType = event.dataTransfer.getData('nodeType')
    const defaultConfig = node_config[nodeType as keyof typeof node_config]

    const newNode = {
      id: uuid(),
      position: {
        x: position.x - defaultConfig.width / 2,
        y: position.y - defaultConfig.height / 2,
      },
      selected: false,
      ...defaultConfig,
    }
    addNode(newNode)
    socket.changeNodesEvent('addNode', newNode)
  }, [])

  const middlewareNodeChanges = useCallback(
    (changes: NodeChange[], nodes: Node[]): ReturnType<typeof applyNodeChanges> => {
      store.changeHelperLine(undefined, undefined)
      if (changes.length === 1 && changes[0].type === 'position' && changes[0].dragging && changes[0].position) {
        const helperLines = getHelperLines(changes[0], nodes)

        changes[0].position.x = helperLines.snapPosition.x ?? changes[0].position.x
        changes[0].position.y = helperLines.snapPosition.y ?? changes[0].position.y

        store.changeHelperLine(helperLines.horizontal, helperLines.vertical)
      }
      return applyNodeChanges(changes, nodes)
    },
    [],
  )
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => void setNodes((nodes) => middlewareNodeChanges(changes, nodes)),
    [setNodes, middlewareNodeChanges],
  )

  const nodesChange = useMemo(() => {
    return store.openHelperLine ? onNodesChange : originOnNodeCahnge
  }, [store.openHelperLine])

  return (
    <div className="flow_main">
      <Header />
      <div className="bottom_container">
        <div className="layer">
          <div className="item_group">
            <Radio.Group variant="default-filled" defaultValue="normal">
              <Radio.Button value="normal">常规型</Radio.Button>
              <Radio.Button value="card">卡片型</Radio.Button>
            </Radio.Group>
          </div>
          <DragOriginNode />
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={nodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          className="react-flow-subflows-example"
          // nodeOrigin={[20,20]}
          fitView
          maxZoom={1}
          minZoom={1}
          // viewport={{ x: 0, y: 0, zoom: 1 }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          // connectionLineComponent={ConnectionLineComponent}
          // connectionLineType={ConnectionLineType.SmoothStep}

          connectionMode={ConnectionMode.Loose}
          // connectionMode={ConnectionMode.Strict}
          // connectionLineContainerStyle={{background : 'red'}}
          connectOnClick={true}
          connectionLineStyle={{
            stroke: '#0052D9',
            strokeWidth: 1.5,
          }}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGES_TYPES}
          proOptions={{
            hideAttribution: true,
          }}
          onPaneClick={() => {
            store.toolbarStateChange({
              selectNodeId: '',
            })
          }}
          // snapToGrid={true}
          onMouseDownCapture={() => {}}
          onPaneScroll={() => {}}
          onNodeDragStop={(event, node) => {
            socket.changeNodesEvent('updateNode', node)
          }}
          panOnScroll
          // selectionMode={SelectionMode.Partial}
          // selectionMode={SelectionMode.Partial}
          onNodeClick={(event, node) => {
            store.toolbarStateChange({
              selectNodeId: node.id,
            })
            socket.changeNodesEvent('selectNodeChange', node)
          }}
          onPointerDownCapture={(...params) => {}}
          {...store.assignFlowProps}
        >
          <Controls />
          <MiniMap
            zoomable
            pannable
            nodeStrokeWidth={3}
            nodeClassName={(node) => node.type!}
            nodeColor={(node) => (node.data?.mindmapColor || '#EEE') as string}
          />
          <Background id="1" variant={BackgroundVariant.Dots} />
          <ModeBar />
          <StyleBar />
          <ConfigBar />
          <HelperLinesRenderer />
          <WatermarkFlow />
        </ReactFlow>
      </div>
    </div>
  )
})
