// 获取数组最后一个元素
const last = <T extends any[], R extends T[number]>(arr: T): R => arr[arr.length - 1];

export enum EditorHistory {
  insertRow = 1, //  { row : 1 , count : 1 }
  insertColumn,  // { contexnt : [{ name : '1111' }] }
  deleteRow,
  deleteColumn,
  cellModfiy
}

export interface InsertRowData {
  row: number;
  count: number;
}

export interface InsertColumnData {
  context: { name: string }[];
}

type SourceByEditorHistory<T extends EditorHistory> =
  T extends EditorHistory.insertRow ? InsertRowData
  :
  T extends EditorHistory.insertColumn ? InsertColumnData :
  // 其他操作类型与数据结构的对应关系...
  never;

type StackModel = Array<{
  key: EditorHistory,
  source: SourceByEditorHistory<EditorHistory>
}>;

export class History {
  // 历史记录栈
  public stack: StackModel[] = [];
  // 撤销栈
  public undoStack: StackModel[] = [];
  // 最新的值
  public currentValue: StackModel | null = null;

  constructor(
    private readonly maximumStack = 1000,
  ) { }

  public get<T extends EditorHistory>(key: T, i: number): SourceByEditorHistory<T> {
    const record = this.stack[i].find(item => item.key === key)?.source! as unknown as SourceByEditorHistory<T>;
    return record!;
  }

  /**
   * 是否满
   */
  isFull() {
    return this.stack.length >= this.maximumStack;
  }

  /**
   * 添加历史记录
   * @param {*} value 历史记录值
   */
  push(value: StackModel): StackModel[] {
    this.stack.push(value);
    this.undoStack = [];
    this.currentValue = value;
    if (this.stack.length > this.maximumStack) {
      this.stack.splice(0, 1);
    }
    return this.stack;
  }

  /**
   * 撤销
   */
  undo() {
    if (this.stack.length === 0) {
      return;
    }
    const value = this.stack.pop()!;
    this.undoStack.push(value);
    this.currentValue = last(this.stack);
  }

  /**
   * 重做
   */
  redo() {
    if (this.undoStack.length === 0) {
      return;
    }
    const valueList = this.undoStack.pop()!;
    this.stack.push(valueList);
    this.currentValue = last(this.stack);
  }

  //  执行
  execute() {

  }

  /**
   * 清空历史栈
   */
  clear() {
    // this.undoStack.push(this.stack);
    this.stack = [];
  }
}

const history = new History();
const stacks = history.push([
  { key: EditorHistory.insertRow, source: { row: 1, count: 1 } },
  { key: EditorHistory.insertColumn, source: { context: [{ name: '1111' }] } }
]);

console.log('历史栈', stacks);

stacks[0].forEach((stack) => {
  const key = stack.key;
  switch (key) {
    case EditorHistory.insertRow:
      const rowsource = history.get(EditorHistory.insertRow, stacks.length - 1);
      console.log(rowsource)
      break;
    case EditorHistory.insertColumn:
      const columnSource = history.get(EditorHistory.insertColumn, stacks.length - 1);
      console.log(columnSource.context[0].name)
      break;

    default:
      break;
  }
})