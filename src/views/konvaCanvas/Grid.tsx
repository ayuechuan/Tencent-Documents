import React, {
  useRef,
  useCallback,
  useState,
  useMemo,
  createElement,
  LegacyRef,
} from "react";
import { Stage, Layer, Group, KonvaNodeComponent, Rect, RegularPolygon, Text, Label, Tag } from "react-konva";
import {
  getBoundedCells,
  getRowStartIndexForOffset,
  getRowStopIndexForStartIndex,
  getColumnStartIndexForOffset,
  getColumnStopIndexForStartIndex,
  itemKey,
  getRowOffset,
  getColumnOffset,
  getColumnWidth,
  getRowHeight,
} from "./helpers";
import { Context } from "konva/lib/Context";
import { Shape } from "konva/lib/Shape";
import { Tween } from "konva/lib/Tween";

export interface IProps extends React.RefAttributes<any> {
  width: number;
  height: number;
  columnCount: number;
  rowCount: number;
  rowHeight: TItemSize;
  columnWidth: TItemSize;
  children: RenderComponent;
  scrollbarSize: number;
  store: any
}

const SIZE = 500;

const downloadURI = (uri: string | undefined, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri || "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const defaultProps = {
  width: 800,
  height: 800,
  rowCount: 200,
  columnCount: 200,
  rowHeight: () => 20,
  columnWidth: () => 100,
  scrollbarSize: 20,
};

type RenderComponent = React.FC<IChildrenProps>;

export interface IChildrenProps extends ICell {
  x: number;
  y: number;
  width: number;
  height: number;
  store: any
}

export type TItemSize = (index?: number) => number;

export interface IArea {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ICell {
  rowIndex: number;
  columnIndex: number;
}

export interface IInstanceProps {
  columnMetadataMap: TCellMetaDataMap;
  rowMetadataMap: TCellMetaDataMap;
  lastMeasuredColumnIndex: number;
  lastMeasuredRowIndex: number;
}

export type TCellMetaDataMap = Record<number, TCellMetaData>;
export type TCellMetaData = {
  offset: number;
  size: number;
};

/**
 * Grid component
 * @param props
 */
const Grid: React.FC<IProps> = forwardRef((props, ref: React.ForwardedRef<any>) => {
  const {
    width: containerWidth,
    height: containerHeight,
    rowHeight,
    columnWidth,
    rowCount,
    columnCount,
    scrollbarSize,
    children,
  } = props;
  const instanceProps = useRef<IInstanceProps>({
    columnMetadataMap: {},
    rowMetadataMap: {},
    lastMeasuredColumnIndex: -1,
    lastMeasuredRowIndex: -1,
  });
  const verticalScrollRef = useRef<HTMLDivElement>(null);
  const wheelingRef = useRef<number | null>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  const stageRef = useRef<React.LegacyRef<typeof Stage>>() as any;

  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const handleScroll = useCallback((e: any) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  const handleScrollLeft = useCallback((e: any) => {
    setScrollLeft(e.target.scrollLeft);
  }, []);
  const scrollHeight = rowCount * rowHeight();
  const scrollWidth = columnCount * columnWidth();
  const [selectedArea, setSelectedArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const boundedCells = useMemo(() => getBoundedCells(selectedArea), [
    selectedArea,
  ]);
  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (wheelingRef.current) return;
    const { deltaX, deltaY, deltaMode } = event.nativeEvent;
    let dx = deltaX;
    let dy = deltaY;

    if (deltaMode === 1) {
      dy = dy * 17;
    }
    if (!horizontalScrollRef.current || !verticalScrollRef.current) return;
    const x = horizontalScrollRef.current?.scrollLeft;
    const y = verticalScrollRef.current?.scrollTop;
    wheelingRef.current = window.requestAnimationFrame(() => {
      wheelingRef.current = null;
      if (horizontalScrollRef.current)
        horizontalScrollRef.current.scrollLeft = x + dx;
      if (verticalScrollRef.current)
        verticalScrollRef.current.scrollTop = y + dy;
    });
  }, []);

  const rowStartIndex = getRowStartIndexForOffset({
    itemType: "row",
    rowHeight,
    columnWidth,
    rowCount,
    columnCount,
    instanceProps: instanceProps.current,
    offset: scrollTop,
  });
  const rowStopIndex = getRowStopIndexForStartIndex({
    startIndex: rowStartIndex,
    rowCount,
    rowHeight,
    columnWidth,
    scrollTop,
    containerHeight,
    instanceProps: instanceProps.current,
  });
  const columnStartIndex = getColumnStartIndexForOffset({
    itemType: "column",
    rowHeight,
    columnWidth,
    rowCount,
    columnCount,
    instanceProps: instanceProps.current,
    offset: scrollLeft,
  });
  const columnStopIndex = getColumnStopIndexForStartIndex({
    startIndex: columnStartIndex,
    columnCount,
    rowHeight,
    columnWidth,
    scrollLeft,
    containerWidth,
    instanceProps: instanceProps.current,
  });

  useImperativeHandle(ref, () => ({
    img() {
      const dataURL = stageRef?.current?.toDataURL({ pixelRatio: 3 });
      downloadURI(dataURL, "image.png");
    }
  }))


  const items = [];
  if (columnCount > 0 && rowCount) {
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
      for (
        let columnIndex = columnStartIndex;
        columnIndex <= columnStopIndex;
        columnIndex++
      ) {
        const width = getColumnWidth(columnIndex, instanceProps.current);
        const x = getColumnOffset({
          index: columnIndex,
          rowHeight,
          columnWidth,
          instanceProps: instanceProps.current,
        });
        const height = getRowHeight(rowIndex, instanceProps.current);
        const y = getRowOffset({
          index: rowIndex,
          rowHeight,
          columnWidth,
          instanceProps: instanceProps.current,
        });
        items.push(
          createElement(children, {
            x,
            y,
            width,
            height,
            rowIndex,
            columnIndex,
            key: itemKey({ rowIndex, columnIndex }),
            store: props.store
          })
        );
      }
    }
  }


  return (
    <div style={{ position: "relative", width: containerWidth + 20 }}>
      <div
        style={{
          height: containerHeight,
          overflow: "scroll",
          position: "absolute",
          right: 0,
          top: 0,
          width: scrollbarSize,
          background: "#666",
        }}
        onScroll={handleScroll}
        ref={verticalScrollRef}
      >
        <div
          style={{
            position: "absolute",
            height: scrollHeight,
            width: 1,
          }}
        />
      </div>
      <div
        style={{
          overflow: "scroll",
          position: "absolute",
          bottom: -scrollbarSize,
          left: 0,
          width: containerWidth,
          height: scrollbarSize,
          background: "#666",
        }}
        onScroll={handleScrollLeft}
        ref={horizontalScrollRef}
      >
        <div
          style={{
            position: "absolute",
            width: scrollWidth,
            height: 1,
          }}
        />
      </div>
      <div onWheel={handleWheel} tabIndex={-1}>
        <Stage
          width={containerWidth}
          height={containerHeight}
          ref={stageRef as any}
        >
          <Layer>
            <Group offsetY={scrollTop} offsetX={scrollLeft}>
              <Rect
                x={20}
                y={200}
                width={150}
                height={80}
                stroke={"green"}
                fill={"#ccc"}
                strokeWidth={0.5}
                cornerRadius={10}
              // opacity={.5}
              />
              <Rect
                x={200}
                y={200}
                width={220}
                height={200}
                stroke={"green"}
                fill={"#ccc"}
                strokeWidth={0.5}
                draggable
                
              />
              <Text
                draggable
                x={200}
                y={200}
                width={220}
                height={200}
                text={"测试\n\换行"}
                fontSize={16}
                fill={'red'}
                padding={10}
                align="center"
                verticalAlign="middle"
                letterSpacing={2}
              />
              <Label
                x={250}
                y={50}
                opacity={0.85}
                pointerDirection="right"
                pointerWidth={10}
                pointerHeight={10}
                lineJoin="round"
                shadowColor="black"
                shadowBlur={10}
                shadowOffsetX={10}
                shadowOffsetY={10}
                shadowOpacity={.5}
                cornerRadius={2}
                draggable
                onClick={(event)=>{
                  console.log('event', event)
                }}
              >
                <Tag
                  fill='#000'
                  pointerDirection='down'
                  pointerWidth={10}
                  pointerHeight={10}
                  lineJoin='round'
                  shadowColor='black'
                  shadowBlur={10}
                  shadowOffsetX={10}
                  shadowOffsetY={10}
                  shadowOpacity={.5}
                  cornerRadius={2}
                />
                <Text
                  text={'Tooltip pointing down'}
                  fontFamily='Calibri'
                  fontSize={22}
                  padding={5}
                  fill='#FFF'
                />
              </Label>
              {items}
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  );
});

export default Grid;
