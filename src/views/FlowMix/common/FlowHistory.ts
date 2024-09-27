import { Edge, Node } from '@xyflow/react';
import { makeAutoObservable, toJS } from 'mobx';

export type EditorHistory = Partial<{
  addNode: Node,
  deleteNode: Node,
  addEdge: Edge,
  deleteEdge: Edge,
  addNodes: Node[],
  deleteNodes: Node[],
  addEdges: Edge[],
  deleteEdges: Edge[]
}>;

export type EditorHistorys = EditorHistory[];

export type StackModel = {
  redo: EditorHistorys,
  undo: EditorHistorys
};

export class FlowHistory {
  public stack: Array<StackModel> = [];
  public index = 0;
  constructor(private readonly maxStack = 10) {
    makeAutoObservable(this);
  }

  /**
   * 是否满栈
   */
  isFull() {
    return this.stack.length >= this.maxStack;
  }

  get canBeRedo() {
    return this.stack.length > 0 &&
     this.index !== this.stack.length
     ;
  }

  get canBeUndo() {
    return this.stack.length > 0 && this.index > 0;
  }
  /**
   * 重做
   */
  redo() {
    const index = this.index;
    this.index++;
    return toJS(this.stack[index].redo);
  }
  /**
   * 撤销
   */
  undo() {
    this.index--;
    return toJS(this.stack[this.index].undo);
  }

  pushHistory(history: StackModel): void {
    const curIndex = this.index;
    if (curIndex >= this.maxStack) {
      this.stack.shift();
    } else {
      this.index++;
      if (this.stack.length >= this.maxStack) {
        this.stack.splice(this.stack.length - 1, 1);
      }
    }
    this.stack.splice(curIndex, this.stack.length, history);
  }

  clear() {
    this.stack = [];
  }

}
