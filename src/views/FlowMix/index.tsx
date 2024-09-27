import { FlowMix } from "./FlowMain";
import { FlowMobxProvider } from "./FlowProvider";
import { ReactFlowProvider } from '@xyflow/react';
import { SocketProvider } from "./flowSocketNamespace/SocketProvider";

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