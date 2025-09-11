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

interface GetVisibleColumnIndicesProps {
  columnWidth: number; // 每列的宽度
  columnCount: number; // 列总数
  offsetX: number; // 水平偏移量
  containerWidth: number; // 容器宽度
}

export class ColumnIndexCalculator {
  private cache: { [key: number]: { startColumnIndex: number; endColumnIndex: number } } = {};

  getVisibleColumnIndices({
    columnWidth,
    columnCount,
    offsetX,
    containerWidth,
  }: GetVisibleColumnIndicesProps): { startColumnIndex: number; endColumnIndex: number } {
    // 使用offsetX作为缓存的键
    if (this.cache[offsetX]) {
      return this.cache[offsetX];
    }

    const startColumnIndex = Math.floor(offsetX / columnWidth);
    const boundedStartColumnIndex = Math.max(0, startColumnIndex);

    // 计算结束列索引
    const endColumnIndex = Math.min(
      columnCount - 1,
      Math.floor((offsetX + containerWidth) / columnWidth)
    );

    const result = {
      startColumnIndex: boundedStartColumnIndex,
      endColumnIndex: endColumnIndex,
    };
    // 缓存结果
    this.cache[offsetX] = result;
    return result;
  }
}
