import { makeAutoObservable } from 'mobx'
import { createContext, PropsWithChildren } from 'react'

import { Watermark } from '@/utils/watermark'

import { FlowHistory, FlowServerController } from './common'

class FlowStore {
  public watermark: Watermark
  public history: FlowHistory
  public flowServerController: FlowServerController
  public helperLineSource = {
    horizontal: undefined,
    vertical: undefined,
  } as {
    horizontal: undefined | number
    vertical: undefined | number
  }
  public openHelperLine = false

  public changeHelperLine(horizontal: undefined | number, vertical: undefined | number) {
    this.helperLineSource.horizontal = horizontal
    this.helperLineSource.vertical = vertical
  }

  public toolbarStatus = {
    selectNodeId: '',
    styleModeType: '',
  }

  public mode = {
    type: 'selection' as 'selection' | 'move',
    colorMode: 'light' as 'light' | 'dark' | 'system',
  }

  get assignFlowProps() {
    const { mode } = this
    if (mode.type === 'selection') {
      return {
        selectionOnDrag: true,
        panOnDrag: [1, 2],
        colorMode: mode.colorMode,
      }
    }
    return {
      selectionOnDrag: false,
      panOnDrag: true,
      colorMode: mode.colorMode,
    }
  }

  toolbarStateChange(status: Partial<{ selectNodeId: string; styleModeType: string }>) {
    this.toolbarStatus = {
      ...this.toolbarStatus,
      ...(Reflect.has(status, 'selectNodeId') && !status.selectNodeId
        ? { selectNodeId: '', styleModeType: '' }
        : status),
    }
  }

  get isOpenConfig() {
    const { toolbarStatus } = this
    return toolbarStatus.selectNodeId && !!toolbarStatus.styleModeType
  }

  constructor() {
    this.watermark = new Watermark()
    this.history = new FlowHistory()
    this.flowServerController = new FlowServerController(this.history)

    makeAutoObservable(this, { watermark: false })
  }
}

const FlowContext = createContext<FlowStore>({} as FlowStore)

export function FlowMobxProvider({ children }: PropsWithChildren) {
  const [store] = useState(() => new FlowStore())
  return <FlowContext.Provider value={store}>{children}</FlowContext.Provider>
}

export function useFlowStore() {
  return useContext(FlowContext)
}
