interface GetVisibleRowIndicesProps {
  rowHeight: number;
  rowCount: number;
  offset: number;
  containerHeight: number; // 可选，计算停止行时用到
}

export class RowIndexCalculator {
  private cache: { [key: number]: { startRowIndex: number; endRowIndex: number } } = {};

  getVisibleRowIndices({
    rowHeight,
    rowCount,
    offset,
    containerHeight,
  }: GetVisibleRowIndicesProps): { startRowIndex: number; endRowIndex: number } {
    // 使用offset作为缓存的键
    if (this.cache[offset]) {
      return this.cache[offset];
    }

    const startRowIndex = Math.floor(offset / rowHeight);
    const boundedStartRowIndex = Math.max(0, startRowIndex);

    // 计算结束行索引
    const endRowIndex = Math.min(
      rowCount - 1,
      Math.floor((offset + containerHeight) / rowHeight)
    );

    const result = {
      startRowIndex: boundedStartRowIndex,
      endRowIndex: endRowIndex,
    };
    // 缓存结果
    this.cache[offset] = result;
    return result;
  }
}