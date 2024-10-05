import { Node, useReactFlow } from '@xyflow/react'
import { toJS } from 'mobx'

import { useFlowStore } from '../FlowProvider'

export function useNodeController() {
  const store = useFlowStore()
  const { setNodes } = useReactFlow()

  const addNode = useCallback((node: Node) => {
    setNodes((nds) => nds.concat(node))
    store.history.pushHistory({
      redo: [{ addNode: node }],
      undo: [{ deleteNode: node }],
    })
  }, [])

  const deleteNode = useCallback((node: Node) => {
    //  更新 flow
    setNodes((nds) => nds.filter((nodeItem) => nodeItem.id !== node.id))
    //  添加到历史栈
    store.history.pushHistory({
      redo: [{ deleteNode: node }],
      undo: [{ addNode: node }],
    })
  }, [])

  return {
    addNode,
    deleteNode,
  }
}
