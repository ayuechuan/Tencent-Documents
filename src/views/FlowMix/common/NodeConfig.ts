import { MarkerType } from "@xyflow/react"

export const node_config = {
  't-node-btn': {
    type: 't-node-btn',
    width: 150,
    height: 62,
    data: {
      label: '腾讯文档',
      mindmapColor: 'rgb(83, 86, 255)',
      className: 'animate__animated animate__rubberBand'
    },
  },
  't-node-image': {
    type: 't-node-image',
    width: 500,
    height: 180,
    data: {
      url: 'https://magic.dooring.vip/assets/logo-nvGOfOJy.png',
      mindmapColor: 'rgb(87, 166, 161)',
      className: 'animate__animated animate__rubberBand'
    }
  }
}

export const defaultConfig = {
  default: {
    nodes: [
      {
        id: '1', position: { x: 500, y: 400 }, data: {
          amount: 200,
          mindmapColor: 'rgb(83, 86, 255)',
          className: 'animate__animated animate__rubberBand'
        },
        width: 150,
        height: 62,
        selected: false,
        type: 't-node-btn',
      },
      {
        id: '2', position: { x: 500, y: 100 }, data: {
          amount: 200,
          mindmapColor: 'rgb(83, 86, 255)',
          className: 'animate__animated animate__rubberBand'
        },
        width: 150,
        height: 62,
        selected: false,
        type: 't-node-btn',
      },
    ],
    edges: [
      {
        id: '1',
        source: '1',
        target: '2',
        type: 't-edge-floating',
        // sourceHandle : 'bottom',
        animated: false,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 3 },
      }
    ]
  },
  projectProcess: {
    nodes: [
      {
        id: "workflow-a",
        type: "WorkflowCard",
        position: { x: 0, y: -200 },
        data: {
          title: "Yes/No Branch",
          label: "Segment is Customers who Purchased.",

        },
      },
      {
        id: "workflow-b",
        type: "WorkflowCard",
        position: { x: -300, y: 0 },
        data: {
          title: "Push Notification",
          label: "💎 10% discount for our VIP customers 💎",
        },
      },
      {
        id: "workflow-c",
        type: "WorkflowCard",
        position: { x: 300, y: 0 },
        data: {
          title: "Push Notification",
          label: "🎉 20% discount for first-time customers 🎉",
        },
      },
      {
        id: "workflow-d",
        type: "WorkflowCard",
        position: { x: 100, y: 300 },
        data: {
          title: "Wait 15 minutes",
        },
      },
    ],
    edges: [
      {
        id: "workflow-a->workflow-b",
        type: "WorkflowLabelledEdge",
        source: "workflow-a",
        target: "workflow-b",
        animated: true,
        data: { label: "Yes" },
      },
      {
        id: "workflow-a->workflow-c",
        type: "WorkflowLabelledEdge",
        source: "workflow-a",
        target: "workflow-c",
        data: { label: "No" },
      },
      {
        id: "workflow-b->workflow-d",
        source: "workflow-b",
        target: "workflow-d",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "workflow-c->workflow-d",
        source: "workflow-c",
        target: "workflow-d",
        type: "smoothstep",
        markerEnd:{
          type: MarkerType.ArrowClosed,
          color: 'rgb(158, 118, 255)',
        }
      },
    ]
  },
  helperLine:{
    nodes:[
      {
        id: '1', 
        position: { x: -100, y: -300 }, data: {
          background: 'rgb(0, 215, 202)',
          label:'Move me around'
        },
        width: 200,
        height: 100,
        selected: false,
        type: 'LineMoveNode'
      },
      {
        id: '2', 
        position: { x: 200, y: -350 }, data: {
          background: 'rgb(255, 0, 113)',
          label:'Move me around'
        },
        width: 180,
        height: 180,
        selected: false,
        type: 'LineMoveNode'
      },
      {
        id: '3', 
        position: { x: -200, y: -150 }, data: {
          background: 'rgb(255, 103, 0)',
          label:'Move me around'
        },
        width: 125,
        height: 220,
        selected: false,
        type: 'LineMoveNode'
      },
      {
        id: '4', 
        position: { x: 300, y: -150 }, data: {
          background: 'rgb(110, 222, 135)',
          label:'Move me around'
        },
        width: 220,
        height: 400,
        selected: false,
        type: 'LineMoveNode'
      },
      {
        id: '5', 
        position: { x: -300, y: 100 }, data: {
          background: 'rgb(120, 75, 232)',
          label:'Move me around'
        },
        width: 300,
        height: 120,
        selected: false,
        type: 'LineMoveNode'
      }
    ],
    edges:[]
  }
}