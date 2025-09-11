import { LayerContianerProvider } from "./layerInstance";
import { SmartSheet } from "./smartsheet/SmartSheet";
import { SocketProvider } from "./socket/provider";

export function Container(){
  return (
    <LayerContianerProvider>
      <SocketProvider>
        <SmartSheet />
      </SocketProvider>
    </LayerContianerProvider>
  )
}