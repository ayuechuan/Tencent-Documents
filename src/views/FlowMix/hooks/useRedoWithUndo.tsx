import { Node, useReactFlow } from '@xyflow/react'

import { EditorHistory, EditorHistorys } from '../common'
import { useFlowStore } from '../FlowProvider'

export function useRedoWithUndo() {
  const store = useFlowStore()
  const { setNodes } = useReactFlow()

  const redo = useCallback(() => {
    const stack = store.history.redo()
    exStack(stack)
  }, [])

  const undo = useCallback(() => {
    const stack = store.history.undo()
    exStack(stack)
  }, [])

  const map = new Map([
    [
      (stackItem: EditorHistory) => Reflect.has(stackItem, 'addNode'),
      (stackItem: EditorHistory) => {
        setNodes((nds) => nds.concat(stackItem.addNode!))
      },
    ],
    [
      (stackItem: EditorHistory) => Reflect.has(stackItem, 'deleteNode'),
      (stackItem: EditorHistory) => {
        setNodes((nds) => nds.filter((node) => node.id !== stackItem.deleteNode!.id))
      },
    ],
    [(stackItem: EditorHistory) => Reflect.has(stackItem, 'addEdge'), (stackItem: EditorHistory) => {}],
    [(stackItem: EditorHistory) => Reflect.has(stackItem, 'deleteEdge'), (stackItem: EditorHistory) => {}],
    [
      (stackItem: EditorHistory) => Reflect.has(stackItem, 'addNodes'),
      (stackItem: EditorHistory) => {
        setNodes((nds) => nds.concat(stackItem.addNodes!))
      },
    ],
    [
      (stackItem: EditorHistory) => Reflect.has(stackItem, 'deleteNodes'),
      (stackItem: EditorHistory) => {
        setNodes((nds) => nds.filter((node) => !stackItem.deleteNodes!.some((nodeItem) => nodeItem.id === node.id)))
      },
    ],
    [(stackItem: EditorHistory) => Reflect.has(stackItem, 'addEdges'), (stackItem: EditorHistory) => {}],
    [(stackItem: EditorHistory) => Reflect.has(stackItem, 'deleteEdges'), (stackItem: EditorHistory) => {}],
  ])

  const exStack = useCallback((stack: EditorHistorys) => {
    stack.forEach((stackItem) => {
      map.forEach((fn, key) => {
        if (key(stackItem)) {
          fn(stackItem)
        }
      })
    })
  }, [])

  return { redo, undo }
}
