import { useUnmount } from 'ahooks'
import { createContext, PropsWithChildren } from 'react'
import { SocketClient } from './socket'
import { useSmartSheetInstance } from '../smartsheet';
import { RangeManager } from '@/views/konvaCanvas';

const SocketClientContext = createContext<SocketClient>({} as SocketClient);

export function SocketProvider({ children }: PropsWithChildren) {
  const core = useSmartSheetInstance();
  const userManager = useState(() => new RangeManager())[0];
  const [store] = useState(() => new SocketClient(userManager, core));

  useUnmount(() => {
    store.destory();
  })

  return <SocketClientContext.Provider value={store}>{children}</SocketClientContext.Provider>
}

export function useScoket() {
  return useContext(SocketClientContext)
}
