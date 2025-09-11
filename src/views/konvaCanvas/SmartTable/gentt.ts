import Konva from "konva";
import { RowIndexCalculator, ColumnIndexCalculator } from "../common/RowIndexCalculator";
import { getColumnOffset, getColumnStartIndexForOffset, getColumnStopIndexForStartIndex, getColumnWidth, getRowHeight, getRowOffset, getRowStartIndexForOffset, getRowStopIndexForStartIndex, itemKey } from "../common/helpers";

const calculator = new RowIndexCalculator();
const colCalculator = new ColumnIndexCalculator();


function findCellAtPosition1(cells: any[], x: number, y: number): any | null {
  for (const cell of cells) {
    if (
      x >= cell.x &&
      x < cell.x + cell.width &&
      y >= cell.y &&
      y < cell.y + cell.height
    ) {
      return cell;
    }
  }
  return null; // 如果没有找到则返回 null
}


interface Cell {
  x: number;
  y: number;
  width: number;
  height: number;
  rowIndex: number;
  columnIndex: number;
  name: string;
  key: string;
}

function binarySearchByY(cells: Cell[], y: number, rowHeight: number, rowCount: number): number {
  let low = 0;
  let high = rowCount - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const cellY = mid * rowHeight;

    if (y >= cellY && y < cellY + rowHeight) {
      return mid;
    } else if (y < cellY) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return -1; // 没有找到匹配的行
}

function binarySearchByX(cells: Cell[], x: number, rowIndex: number, columnWidth: number, columnCount: number): Cell | null {
  let low = 0;
  let high = columnCount - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const cell = cells.find(cell => cell.rowIndex === rowIndex && cell.columnIndex === mid);
    const cellX = mid * columnWidth;

    if (cell && x >= cellX && x < cellX + columnWidth) {
      return cell;
    } else if (x < cellX) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return null; // 没有找到匹配的列
}

function findCellAtPosition(cells: Cell[], x: number, y: number, rowHeight: number, columnWidth: number, rowCount: number, columnCount: number): Cell | null {
  // 1. 按 y 坐标找到所在的行
  const rowIndex = binarySearchByY(cells, y, rowHeight, rowCount);
  if (rowIndex === -1) {
    return null;
  }

  // 2. 按 x 坐标在该行中找到所在的列
  return binarySearchByX(cells, x, rowIndex, columnWidth, columnCount);
}




export class Gentt {
  finalWidth = 20;
  instanceProps = {
    columnMetadataMap: {},
    rowMetadataMap: {},
    lastMeasuredColumnIndex: -1,
    lastMeasuredRowIndex: -1,
  }
  stage: Konva.Stage;
  constructor() {
    this.stage = new Konva.Stage({
      container: '.smart-table-root',
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const layer = new Konva.Layer();
    const group = new Konva.Group({
      offsetX: 0,
      offsetY: 0,
      id: 'one-two'
    });
    layer.add(group);
    this.stage.add(layer);
    const { items, columnStartIndex, columnStopIndex } = this.render();
    console.log('items', items, columnStartIndex, columnStopIndex);

    for (let index = columnStartIndex; index < columnStopIndex; index++) {
      const colindex = items[index];
      const line = new Konva.Line({
        points: [
          colindex.x,            // 起点 x
          colindex.y,            // 起点 y
          colindex.x,            // 终点 x (与起点相同)
          colindex.y + 1000      // 终点 y (从起点向下延伸 1000 像素)
        ],
        stroke: 'red',          // 线条颜色
        strokeWidth: 0.2        // 线条宽度
      });

      // 将线条添加到组中
      group.add(line);
    }
    const now = performance.now();
    // const cell = findCellAtPosition(items, 140, 20);
    // 测试查找
    const x = 650;
    const y = 560;
    const rowHeight = 40;
    const columnWidth = 130;
    const rowCount = 20; // 假设有3行
    const columnCount = 7; // 假设每行有4列

    // const cell = findCellAtPosition(items, x, y, rowHeight, columnWidth, rowCount, columnCount);
    // console.log(cell); // 输出该位置的 cell 对象
    // const after = performance.now();
    // console.log('cell', cell, (after - now) / 1000);

    const now1 = performance.now();
    // 示例：在执行某段代码前后打标记
    performance.mark('startTask');

    const cell1 = findCellAtPosition1(items, x, y)
    const after1 = performance.now();
    performance.mark('endTask');
    performance.measure('Measured Task', 'startTask', 'endTask');
    console.log('cell111-----', cell1, (after1 - now1) / 1000);

    // items.forEach(({  x,
    //   y,
    //   width,
    //   height,
    //   rowIndex,
    //   columnIndex,
    //   name,
    //   key 
    // })=>{
    //   group.add(new Konva.Rect({
    //     x,
    //     y,
    //     height,
    //     width,
    //     hitStrokeWidth: 1,
    //     strokeWidth: 0.2,
    //     fill: '#FFF',
    //     stroke: 'grey',
    //     name,
    //     key
    //   }))
    // })

  }

  render() {
    const rowHeight = () => 40;
    const columnWidth = () => 130;
    const rowCount = 40;
    const columnCount = 40;
    const containerWidth = 12000
    const scrollTop = 0;
    const containerHeight = 12000;
    const scrollLeft = 100;
    const rowStartIndex = getRowStartIndexForOffset({
      itemType: "row",
      rowHeight,
      columnWidth,
      rowCount,
      columnCount,
      instanceProps: this.instanceProps,
      offset: scrollTop,
    });
    const rowStopIndex = getRowStopIndexForStartIndex({
      startIndex: rowStartIndex,
      rowCount,
      rowHeight,
      columnWidth,
      scrollTop,
      containerHeight,
      instanceProps: this.instanceProps,
    });
    const columnStartIndex = getColumnStartIndexForOffset({
      itemType: "column",
      rowHeight,
      columnWidth,
      rowCount,
      columnCount,
      instanceProps: this.instanceProps,
      offset: scrollLeft,
    });

    const columnStopIndex = getColumnStopIndexForStartIndex({
      startIndex: columnStartIndex,
      columnCount,
      rowHeight,
      columnWidth,
      scrollLeft,
      containerWidth,
      instanceProps: this.instanceProps,
    });

    const items = [];
    if (columnCount > 0 && rowCount) {
      for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        for (
          let columnIndex = columnStartIndex;
          columnIndex <= columnStopIndex;
          columnIndex++
        ) {
          const width = getColumnWidth(columnIndex, this.instanceProps);
          const x = getColumnOffset({
            index: columnIndex,
            rowHeight,
            columnWidth,
            instanceProps: this.instanceProps,
          });
          const height = getRowHeight(rowIndex, this.instanceProps);
          const y = getRowOffset({
            index: rowIndex,
            rowHeight,
            columnWidth,
            instanceProps: this.instanceProps,
          });
          items.push(
            {
              x,
              y,
              width,
              height,
              rowIndex,
              columnIndex,
              name: 'container_cell',
              key: itemKey({ rowIndex, columnIndex }),
            }
          );
        }
      }
    }
    return {
      columnStartIndex,
      columnStopIndex,
      items
    }

  }


  getYCoordinate(rowIndex: number) {
    return rowIndex * 40;
  }
}