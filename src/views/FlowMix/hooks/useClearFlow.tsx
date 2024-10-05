import { Node, useReactFlow } from '@xyflow/react'
import { toJS } from 'mobx'

import { useFlowStore } from '../FlowProvider'

export function useClearFlow() {
  const store = useFlowStore()
  const { setNodes, getNodes, getEdges, setEdges } = useReactFlow()

  return useCallback(() => {
    //
    const nodes = getNodes()
    const edges = getEdges()

    const redos = {
      ...(nodes.length ? { deleteNodes: nodes } : {}),
      ...(edges.length ? { deleteEdges: edges } : {}),
    }

    const undos = {
      ...(nodes.length ? { addNodes: nodes } : {}),
      ...(edges.length ? { addEdges: edges } : {}),
    }

    store.history.pushHistory({
      redo: [redos],
      undo: [undos],
    })
    setNodes([])
    setEdges([])
  }, [])
}
