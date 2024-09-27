import { Node, useReactFlow } from "@xyflow/react";
import { useFlowStore } from "../FlowProvider";
import { toJS } from "mobx";

export function useClearFlow() {
  const store = useFlowStore();
  const { setNodes, getNodes, getEdges, setEdges } = useReactFlow();

  return useCallback(() => {
    // 
    const nodes = getNodes();;
    const edges = getEdges();

    const redos = {
      ...(nodes.length ? { deleteNodes: nodes } : {}),
      ...(edges.length ? { deleteEdges: edges } : {}),
    };

    const undos = {
      ...(nodes.length ? { addNodes: nodes } : {}),
      ...(edges.length ? { addEdges: edges } : {}),
    };

    store.history.pushHistory({
      redo: [redos],
      undo: [undos]
    })
    setNodes([]);
    setEdges([]);
  }, [])
}