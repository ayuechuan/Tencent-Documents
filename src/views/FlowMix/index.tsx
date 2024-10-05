import { ReactFlowProvider } from '@xyflow/react'

import { FlowMix } from './FlowMain'
import { FlowMobxProvider } from './FlowProvider'
import { SocketProvider } from './flowSocketNamespace/SocketProvider'

export function CombineFlowEditor() {
  return (
    <FlowMobxProvider>
      <ReactFlowProvider>
        <SocketProvider>
          <FlowMix />
        </SocketProvider>
      </ReactFlowProvider>
    </FlowMobxProvider>
  )
}
