// eventBus.ts
type EventHandler = (...args: any[]) => void;

let listeners: Record<string, EventHandler[]> = {};

export class EventBus{
  on(event: string, handler: EventHandler) {
    (listeners[event] = listeners[event] || []).push(handler);
  }

  off(event: string, handler: EventHandler) {
    listeners[event] = (listeners[event] || []).filter(h => h !== handler);
  }

  emit(event: string, ...args: any[]) {
    (listeners[event] || []).forEach(handler => handler(...args));
  }

  destory(){
    listeners = {} as  Record<string, EventHandler[]>;
  }
};

export const eventBus = new EventBus();
