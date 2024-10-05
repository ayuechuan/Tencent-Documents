export enum SocketEventKey {
  //  一般性事件
  joined = 'joined',
  reconnected = 'reconnected',
  refresh = 'refresh',
  authority = 'authority',
  leave = 'leave',
  room = 'room',
  //  复杂事件（节点事件）
  node = 'node',
}

export type EventType =
  | 'addNode'
  | 'updateNode'
  | 'selectNodeChange'
  | 'deleteNode'
  | 'addEgde'
  | 'updateEgde'
  | 'deleteEgde'
