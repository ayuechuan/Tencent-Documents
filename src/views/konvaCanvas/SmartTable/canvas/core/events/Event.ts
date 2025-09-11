export class SmartEvent {
  private readonly listeners = new Map();

  on<T>(eventType: EventType, callback: T) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [callback]);
      return this;
    }
    const listeners = this.listeners.get(eventType);
    this.listeners.set(eventType, [...listeners, callback]);
    return this;
  }

  emit<T>(eventType: EventType, args: T) {
    if (this.listeners.has(eventType)) {
      const currentListener = this.listeners.get(eventType);
      for (const callback of currentListener) {
        callback(args);
      }
    }
  }

  removeListener<T>(eventType: EventType, callback: T) {
    if (this.listeners.has(eventType)) {
      const currentListener = this.listeners.get(eventType);
      const idx = currentListener.indexOf(callback);
      if (idx && idx >= 0) {
        currentListener.splice(idx, 1);
      }
    }
  }

  once(eventType: EventType, callback: (...args: any) => void) {
    const execCalllback = (...args: any) => {
      callback(...args);
      this.removeListener(eventType, execCalllback);
    };
    this.on(eventType, execCalllback);
  }
}

export enum EventType {
  Change,
  SelectorMove,
  EditorMove,
  Editing,
  Input,
  Scroll,
  ScrollX,
  ScrollY,
  Selected,
  InsertRow,
  SetRowHeight,
  DeleteRow,
  HideRow,
  InsertColumn,
  SetColWidth,
  DeleteColumn,
  HideColumn,
  DeleteCells,
  DeleteCell,
  CalSelectedRangeByEnd,
  SetSelectedCellText,
  Freeze,
  Undo,
  Redo,
  Merge,
  Copy,
  Cut,
  Paste,
  PasteFromText,
  Focus,
  Filters,
  SetAutoFilter,
  Move,
  StatusChange,
  Blur,
  ContextMenu,
  Backspace,
  Sort,
  Replace,
  Hotkeys,
  UnFreeze,
  UnMerge,
  TargetAreaIncludesMerge,
  SelectedChange,
  ExtendChange,
  //  最右侧添加列的事件
  AddcolumnButton = 45,
  ComposeEvent
}