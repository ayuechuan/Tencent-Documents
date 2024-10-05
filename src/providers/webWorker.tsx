import * as Comlink from 'comlink'

import { Unsubscribable, WebWorkerContext } from '@/contexts/webWorker'
import type { Iremote } from '@/worker/worker'
import SheetsRemote from '@/worker/worker?worker'

export const WebWorkerProvider = ({ children }: any): React.ReactNode => {
  const [instance] = useState(() => {
    return {
      worker: null as Comlink.Remote<Iremote> | null,
      open(): Unsubscribable {
        instance.worker = Comlink.wrap(new SheetsRemote()) as Comlink.Remote<Iremote>
        return {
          unsubscribe: () => this.close(),
        }
      },
      close(): void {
        if (instance.worker) {
          instance.worker[Comlink.releaseProxy]?.()
          instance.worker = null
        }
      },
    }
  })
  return <WebWorkerContext.Provider value={instance}>{children}</WebWorkerContext.Provider>
}
