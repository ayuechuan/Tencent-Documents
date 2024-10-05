import * as Comlink from 'comlink'
import React from 'react'

import { Iremote } from '@/worker/worker'

export interface Unsubscribable {
  unsubscribe(): void
}

export const WebWorkerContext = React.createContext<{
  worker: Comlink.Remote<Iremote> | null
  open(): Unsubscribable
  close(): void
} | null>(null)
