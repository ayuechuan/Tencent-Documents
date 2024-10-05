import { useReactFlow } from '@xyflow/react'
import { useUnmount } from 'ahooks'
import { createContext, PropsWithChildren } from 'react'

import { useNodeController } from '../hooks/useNodeController'
import { FlowSocketClient } from './socket'

const FlowSocketContext = createContext<FlowSocketClient>({} as FlowSocketClient)

export function SocketProvider({ children }: PropsWithChildren) {
  const controller = useNodeController()
  const flowInstance = useReactFlow()
  const [store] = useState(() => new FlowSocketClient(controller, flowInstance))

  useUnmount(() => {
    store.destory()
  })

  return <FlowSocketContext.Provider value={store}>{children}</FlowSocketContext.Provider>
}

export function useFlowScoket() {
  return useContext(FlowSocketContext)
}
