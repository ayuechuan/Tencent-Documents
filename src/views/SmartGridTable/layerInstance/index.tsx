import { useUnmount } from 'ahooks'
import { createContext, LegacyRef, PropsWithChildren } from 'react'

import { useSmartSheetInstance } from '../smartsheet';
import { Layer } from 'react-konva';
import { Layer as LayerInstance } from 'konva/lib/Layer';

export interface LayerContext {
  instance: LayerInstance,
  ops: any
}

const LayerContainerContext = createContext<LayerContext>({} as LayerContext);

export function LayerContianerProvider({ children }: PropsWithChildren) {
  const ref = useRef<LayerInstance | null>();

  return (
    <LayerContainerContext.Provider value={{
      instance: ref.current!,
      ops: {

      }
    }}>
      <Layer ref={ref as any}>
        {children}
      </Layer>
    </LayerContainerContext.Provider>
  )

}

export function useLayer() {
  return useContext(LayerContainerContext)
}
