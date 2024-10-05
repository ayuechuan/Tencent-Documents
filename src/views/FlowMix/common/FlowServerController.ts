import { Edge, Node } from '@xyflow/react'
import { makeAutoObservable } from 'mobx'

import { EditorHistory, EditorHistorys, FlowHistory } from './FlowHistory'

export class FlowServerController {
  constructor(private readonly history: FlowHistory) {}

  public redo() {
    this.executeHistoryStack(this.history.redo())
  }

  public undo() {
    this.executeHistoryStack(this.history.undo())
  }

  private executeHistoryStack(stack: EditorHistorys) {
    const map = new Map([
      [
        (stackItem: EditorHistory) => Reflect.has(stackItem, 'addNode'),
        (stackItem: EditorHistory) => {
          this.addNode(stackItem.addNode!)
        },
      ],
      [
        (stackItem: EditorHistory) => Reflect.has(stackItem, 'deleteNode'),
        (stackItem: EditorHistory) => {
          this.deleteNode(stackItem.deleteNode!)
        },
      ],
      [
        (stackItem: EditorHistory) => Reflect.has(stackItem, 'addEdge'),
        (stackItem: EditorHistory) => {
          this.addEdge(stackItem.addEdge!)
        },
      ],
      [
        (stackItem: EditorHistory) => Reflect.has(stackItem, 'deleteEdge'),
        (stackItem: EditorHistory) => {
          this.deleteEdge(stackItem.deleteEdge!)
        },
      ],
      [
        (stackItem: EditorHistory) => Reflect.has(stackItem, 'addNodes'),
        (stackItem: EditorHistory) => {
          this.addNodes(stackItem.addNodes!)
        },
      ],
      [
        (stackItem: EditorHistory) => Reflect.has(stackItem, 'deleteNodes'),
        (stackItem: EditorHistory) => {
          this.deleteNodes(stackItem.deleteNodes!)
        },
      ],
      [
        (stackItem: EditorHistory) => Reflect.has(stackItem, 'addEdges'),
        (stackItem: EditorHistory) => {
          this.addEdges(stackItem.addEdges!)
        },
      ],
      [
        (stackItem: EditorHistory) => Reflect.has(stackItem, 'deleteEdges'),
        (stackItem: EditorHistory) => {
          this.deleteEdges(stackItem.deleteEdges!)
        },
      ],
    ])

    stack.forEach((stackItem) => {
      map.forEach((fn, key) => {
        if (key(stackItem)) {
          fn(stackItem)
        }
      })
    })
  }

  public addNodes(nodes: Node[]) {}

  public deleteNodes(nodes: Node[]) {}

  addEdges(edges: Edge[]) {}
  deleteEdges(edges: Edge[]) {}

  //  新增节点
  public addNode(node: Node) {
    console.log('新增节点----', node)

    // this.history.pushHistory({
    //   redo: [{ addNode: node }],
    //   undo: [{ deleteNode: node }]
    // })
  }

  //  删除节点
  public deleteNode(node: Node, edge?: Edge) {
    console.log('删除节点----', node)
    // this.history.pushHistory({
    //   redo: [{ deleteNode: node }],
    //   undo: [{ addNode: node }]
    // })
  }

  // 克隆节点
  public cloneNode(node: Node, edge?: Edge) {
    // this.history.pushHistory({
    //   redo: [{ addNode: node }],
    //   undo: [{ deleteNode: node }]
    // })
  }

  // 新增边
  public addEdge(edge: Edge) {
    // this.history.pushHistory({
    //   redo: [{ addEdge: edge }],
    //   undo: [{ deleteEdge: edge }]
    // })
  }

  // 删除边
  public deleteEdge(edge: Edge) {
    // this.history.pushHistory({
    //   redo: [{ deleteEdge: edge }],
    //   undo: [{ addEdge: edge }]
    // })
  }
}
