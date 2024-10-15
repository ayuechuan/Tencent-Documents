import { useMount } from "ahooks"
import { Container } from "./canvas/Container";
import { FeatureCanvas } from "./canvas/FeatureCanvas";
import { TableCanvas } from "./canvas/TableCanvas";
import React, {
  useRef,
  useCallback,
  useState,
  useMemo,
  createElement,
} from "react";
import { Stage, Layer, Group, Rect, Text, Shape ,Image } from "react-konva";
import { getBoundedCells, getColumnOffset, getColumnStartIndexForOffset, getColumnStopIndexForStartIndex, getColumnWidth, getRowHeight, getRowOffset, getRowStartIndexForOffset, getRowStopIndexForStartIndex, itemKey } from "../common/helpers";
import Konva from "konva";
import { TagShapeNode } from "./canvas/createShapes/TagShape";
import { Store } from "./store/Store";
import { TTTT } from "./components";
import { useImage } from "react-konva-utils";

const Cell = ({
  rowIndex,
  columnIndex,
  x,
  y,
  width,
  height,
}: IChildrenProps) => {
  const group = useRef<Konva.Group>(null);

  let text = `${rowIndex}x${columnIndex}`;

  if (columnIndex === 0) {
    text = rowIndex + '';
  }

  // useMount(()=>{
  //   group.current?.cache();

  //   if(columnIndex === 0){
  //     group.current!.moveTo((window as any).refs)
  //   }

  // })

  return (
    <Group ref={group} name='container_cell'>
      <Rect
        x={x}
        y={y}
        height={height}
        width={width}
        fill="white"
        strokeWidth={0.2}
        stroke="rgba(0, 0, 0, 0.51)"
      />
      <Text
        x={x}
        y={y}
        height={height}
        width={width}
        text={text}
        verticalAlign="middle"
        align="center"
      />
    </Group>
  );
};

export function SmartTable() {
  // return <div className="smart-table-root"></div>

  return (
    // <div className="smart-table-root"></div>
    <div>

      <Grid {...defaultProps}>{Cell}</Grid>
    </div>
  )
}

export interface IProps {
  width: number;
  height: number;
  columnCount: number;
  rowCount: number;
  rowHeight: TItemSize;
  columnWidth: TItemSize;
  children: RenderComponent;
  scrollbarSize: number;
}

const defaultProps = {
  width: innerWidth - 280,
  height: innerHeight - 50,
  rowCount: 200,
  columnCount: 200,
  rowHeight: () => 52,
  columnWidth: (i: number) => {
    if (i === 0) {
      return 45
    }
    if (i <= 2) {
      return 150
    }
    return 300
  },
  scrollbarSize: 20,
};

type RenderComponent = React.FC<IChildrenProps>;

export interface IChildrenProps extends ICell {
  x: number;
  y: number;
  width: number;
  height: number;
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
const Grid: React.FC<IProps> = (props) => {
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
  const stageRef = useRef<Konva.Stage>(null);

  useMount(() => {
    setTimeout(() => {
      const store = new Store();
      const container = new Container(stageRef.current!);
      const tableLayer = new TableCanvas(container);
      const featureLayer = new FeatureCanvas(container, store);
      container.add([
        tableLayer.layer, featureLayer.layer])
      featureLayer.bootstrap();
    }, 200);
  })

  const instanceProps = useRef<IInstanceProps>({
    columnMetadataMap: {},
    rowMetadataMap: {},
    lastMeasuredColumnIndex: -1,
    lastMeasuredRowIndex: -1,
  });
  const verticalScrollRef = useRef<HTMLDivElement>(null);
  const wheelingRef = useRef<number | null>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(346);

  const groupRef = useRef<Konva.Group>(null);
  const groupTopRef = useRef<Konva.Group>(null);

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
  // const columnStartIndex = 3;
  const columnStopIndex = getColumnStopIndexForStartIndex({
    startIndex: columnStartIndex,
    columnCount,
    rowHeight,
    columnWidth,
    scrollLeft,
    containerWidth,
    instanceProps: instanceProps.current,
  });

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
            name: 'container_cell',
            key: itemKey({ rowIndex, columnIndex }),
          })
        );
      }
    }
  }


  // useMount(() => {
  //   console.log('(window as any).refs', groupRef.current);
  //   const rowStartIndex = getRowStartIndexForOffset({
  //     itemType: "row",
  //     rowHeight,
  //     columnWidth,
  //     rowCount,
  //     columnCount,
  //     instanceProps: instanceProps.current,
  //     offset: scrollTop,
  //   });
  //   const rowStopIndex = getRowStopIndexForStartIndex({
  //     startIndex: rowStartIndex,
  //     rowCount,
  //     rowHeight,
  //     columnWidth,
  //     scrollTop,
  //     containerHeight,
  //     instanceProps: instanceProps.current,
  //   });
  //   const columnStartIndex = 0;
  //   const columnStopIndex = 2

  //   const items = [];
  //   if (columnCount > 0 && rowCount) {
  //     for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
  //       for (
  //         let columnIndex = columnStartIndex;
  //         columnIndex <= columnStopIndex;
  //         columnIndex++
  //       ) {
  //         const width = getColumnWidth(columnIndex, instanceProps.current);
  //         const x = getColumnOffset({
  //           index: columnIndex,
  //           rowHeight,
  //           columnWidth,
  //           instanceProps: instanceProps.current,
  //         });
  //         const height = getRowHeight(rowIndex, instanceProps.current);
  //         const y = getRowOffset({
  //           index: rowIndex,
  //           rowHeight,
  //           columnWidth,
  //           instanceProps: instanceProps.current,
  //         });
  //         const text = `${rowIndex}x${columnIndex}`
  //         const group = new Konva.Group();
  //         const rect = new Konva.Rect({
  //           x,
  //           y,
  //           width,
  //           height,
  //           fill: '#EEE',
  //           strokeWidth: 0.2,
  //           stroke: 'rgba(0, 0, 0, 0.51)',
  //         })

  //         const textShape = new Konva.Text({
  //           x,
  //           y,
  //           width,
  //           height,
  //           text: '' + rowIndex,
  //           verticalAlign: 'middle',
  //           align: 'center',
  //         })
  //         group.add(rect, textShape);
  //         groupRef.current?.add(group);
  //         // groupRef.current?.removeChildren();


  //         // const tagNode = new TagShapeNode({
  //         //   rectConfig: {
  //         //     x,
  //         //     y,
  //         //     width,
  //         //     height,
  //         //     fill: 'white',
  //         //     strokeWidth: 0.2,
  //         //     stroke: 'rgba(0, 0, 0, 0.51)',
  //         //   },
  //         //   textConfig: {
  //         //     x,
  //         //     y,
  //         //     text: '进行中',
  //         //     fill: Math.random() * 10 > 4 ? '#de3c36' : Math.random() * 10 > 6 ? '#4faa7a' : '#f3e196',
  //         //     verticalAlign: 'middle',
  //         //     align: 'center',
  //         //   }
  //         // });
  //         // groupRef.current?.add(tagNode);

  //         // items.push(
  //         //   createElement(children, {
  //         //     x,
  //         //     y,
  //         //     width,
  //         //     height,
  //         //     rowIndex,
  //         //     columnIndex,
  //         //     key: itemKey({ rowIndex, columnIndex }),
  //         //   })
  //         // );
  //       }
  //     }
  //   }

  // })


  // useMount(() => {
  //   // const rowStartIndex = getRowStartIndexForOffset({
  //   //   itemType: "row",
  //   //   rowHeight,
  //   //   columnWidth,
  //   //   rowCount,
  //   //   columnCount,
  //   //   instanceProps: instanceProps.current,
  //   //   offset: scrollTop,
  //   // });
  //   // const rowStopIndex = getRowStopIndexForStartIndex({
  //   //   startIndex: rowStartIndex,
  //   //   rowCount,
  //   //   rowHeight,
  //   //   columnWidth,
  //   //   scrollTop,
  //   //   containerHeight,
  //   //   instanceProps: instanceProps.current,
  //   // });
  //   const columnStartIndex = getColumnStartIndexForOffset({
  //     itemType: "column",
  //     rowHeight,
  //     columnWidth,
  //     rowCount,
  //     columnCount,
  //     instanceProps: instanceProps.current,
  //     offset: scrollLeft,
  //   });
  //   // const columnStartIndex = 3;
  //   const columnStopIndex = getColumnStopIndexForStartIndex({
  //     startIndex: columnStartIndex,
  //     columnCount,
  //     rowHeight,
  //     columnWidth,
  //     scrollLeft,
  //     containerWidth,
  //     instanceProps: instanceProps.current,
  //   });

  //   const rowStartIndex = 0;
  //   const rowStopIndex = 0;
  //   if (columnCount > 0 && rowCount) {
  //     for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
  //       for (
  //         let columnIndex = columnStartIndex;
  //         columnIndex <= columnStopIndex;
  //         columnIndex++
  //       ) {
  //         const width = getColumnWidth(columnIndex, instanceProps.current);
  //         const x = getColumnOffset({
  //           index: columnIndex,
  //           rowHeight,
  //           columnWidth,
  //           instanceProps: instanceProps.current,
  //         });
  //         const height = getRowHeight(rowIndex, instanceProps.current);
  //         const y = getRowOffset({
  //           index: rowIndex,
  //           rowHeight,
  //           columnWidth,
  //           instanceProps: instanceProps.current,
  //         });
  //         const text = `${rowIndex}x${columnIndex}`
  //         const group = new Konva.Group();
  //         const rect = new Konva.Rect({
  //           x,
  //           y,
  //           width,
  //           height,
  //           fill: '#EEE',
  //           strokeWidth: 0.2,
  //           stroke: 'rgba(0, 0, 0, 0.51)',
  //         })

  //         const textShape = new Konva.Text({
  //           x,
  //           y,
  //           width,
  //           height,
  //           text: '' + columnIndex,
  //           verticalAlign: 'middle',
  //           align: 'center',
  //         })
  //         group.add(rect, textShape);
  //         groupRef.current?.add(group);
  //       }
  //     }
  //   }


  // })



  // useMount(() => {
  // })
  const [img2] = useImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALESURBVHgB7Zo9bNNAFICfk5SkpUlZ6FBR4QEpSF0QygJTygRLCQsMCEjEQjcW2BiibiztFhbUCNElC4WFMZnSAaiyIFGpEhFIHcpCE36S0tS8Z3yVk2I7rjqcfe+TTs7Zz6d8vvP5TncADKME2rCBhmFk8aCDvHzH1NA0rTlMsKe4Jbzc7hr61s4+tHcNkJGpVMRMSBlT0esBuIqjdA4Pr1bWd6FU7wDKg8yQ+MK1UciciTUxO+sm7yX++Vm9q5fWOhAknt86SfKrKH7DKSbidAGl81ut/cBJE6V6lw45dDjlFBNxuV//tN2DIPL+6574qTvFuIq3O3K/00NwpBoPNSyuGiyuGixux/rwn00lNJiaCN6zscbsxAWnmL4hKwrreFjElBPj8mRcgzcfcay+1gWapMhMZjoKj7OjkJ6MAo46xQNoYirj8LVojz0Qt6SrG996+tNq52D0kz4dhQeX43AeC7tf+Smt/NzMCCxcHYPBCdXczAmYx/+PD4HkCyLeLr6M0vmbL378t2Aa+AOWRfKyQa9j5c44rHyglnl4bkE1X7k7Tq23gPJlOme2Bau280/e/nYsnK5lpmNmC5ANnImZNew0oaJm/3LdnLjcE+dEL6DTjVjjjoXTzZTSk/J1dlfOjUB1849rTHXTfHWzIt8n7gWJy0gyAdDymFANTrj4O64aLK4aLK4aLK4aLK4aLK4aLK4aLK4aLK4ayorHwCepeMS+UhFYfIs/mk2YSTbefdnzFe9L/OHqL3NJSUb8bkXzJU6Fy77XbVi4V1cNZcSTif6+SYg36BMla8d1HFiLnU2RN8Vx6bSBhxqtI4cVy+21yNubevH2xTjMXwqXPLXipetjNOhqYnZJnB/cCkLbtBdp8+7Gdg9aIfh00RIyytfwZ8G+jfvQS21tEsjCv40zExBsdjDR9u0aMAzDMAwTGv4Cfmnwxm+8LqoAAAAASUVORK5CYII=');

  const [clone, setClone] = useState<any>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

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
          ref={stageRef}
          width={containerWidth}
          height={containerHeight}
          onMouseMove={(event) => {
            if (event.target?.parent?.attrs?.name === 'freeSeats' ||
              event.target?.parent?.attrs?.name === 'occupiedSeats'
            ) {
              
              const group = event.target?.parent as Konva.Group;
              const pointer = group.getClientRect();

              setClone({
                ...event.target.attrs,
                ...pointer,
                image: img2
              })
            } else {
              setClone({
                x: 0,
                y: 0,
                width: 0,
                height: 0
              })
            }
          }}

        // scaleX={1.5}
        // scaleY={1.5}
        >
          <Layer>
            <TTTT />
            {clone.width > 0 ?  <Group name="occupiedSeats">
              <Image
                strokeEnabled={false}
                fill="#EEE"
                {...clone}
              />
            </Group> : null}

            {/* <Group offsetY={scrollTop} offsetX={scrollLeft}>
              {items}
            </Group>

            <Group
              width={200}
              height={1000}
              x={0}
              y={0}
              ref={groupRef}
              name="left"
            >
            </Group>
            <Group
              width={1000}
              height={40}
              x={0}
              y={0}
              ref={groupTopRef}
              name="top"
            >
            </Group> */}

            {/* <Group
              offsetY={0}
              offsetX={0}
              clipX={200}
              clipY={200}
              clipWidth={innerWidth - 200 - 200}
              clipHeight={innerHeight - 200 - 200}
            // ref={groupRef}
            >
              <CellRenderer
                x={20}
                y={20}
                width={400}
                height={400}
                rowIndex={1}
                columnIndex={1}
                strokeTopColor={'yellow'}
                strokeRightColor={'red'}
                strokeBottomColor={'red'}
                strokeLeftColor={'red'}
                key='1551'
              />
            </Group> */}

            {/* <CellRenderer
              x={20}
              y={20}
              width={200}
              height={200}
              rowIndex={1}
              columnIndex={1}
              strokeTopColor={'red'}
              strokeRightColor={'red'}
              strokeBottomColor={'red'}
              strokeLeftColor={'red'}
              key='1551'
            /> */}
            {/* <CellRenderer
              x={220}
              y={20}
              width={200}
              height={200}
              rowIndex={12}
              columnIndex={12}
              strokeTopColor={'red'}
              strokeRightColor={'red'}
              strokeBottomColor={'red'}
              strokeLeftColor={'red'}
              key='15510'
            />

            <Rect
              x={300}
              y={400}
              fill={'#EEE'}
              stroke={'red'}
              strokeWidth={1}
              hitStrokeWidth={1}
              // dash={[10, 10]}
              width={200}
              height={200}
            />
            <Rect
              x={500}
              y={400}
              fill={'#EEE'}
              stroke={'red'}
              strokeWidth={1}
              hitStrokeWidth={1}
              // dash={[10, 10]}
              width={200}
              height={200}
            /> */}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};



export const getOffsetFromWidth = (width: number) => {
  return width / 2 - 0.5
}

const CellOverlay: React.FC<any> = memo(props => {
  const {
    x,
    y,
    width,
    height,
    strokeTopColor = 'red',
    strokeRightColor = 'red',
    strokeBottomColor = 'red',
    strokeLeftColor = 'red',
    strokeTopDash = [],
    strokeRightDash = [],
    strokeBottomDash = [],
    strokeLeftDash = [],
    strokeTopWidth,
    strokeRightWidth,
    strokeBottomWidth,
    strokeLeftWidth,
    lineCap
  } = props;

  console.log('props', props);


  const userStroke =
    strokeTopColor || strokeRightColor || strokeBottomColor || strokeLeftColor;
  // if (!userStroke) return null;
  return (
    <Shape
      x={x}
      y={y}
      width={width}
      height={height}
      sceneFunc={(context, shape) => {
        /* Top border */
        if (strokeTopColor) {
          context.beginPath();
          context.moveTo(
            strokeLeftColor ? -getOffsetFromWidth(strokeLeftWidth) : 0,
            0.5
          );
          context.lineTo(
            shape.width() +
            (strokeRightColor ? getOffsetFromWidth(strokeRightWidth) + 1 : 1),
            0.5
          );
          context.setAttr("strokeStyle", strokeTopColor);
          context.setAttr("lineWidth", strokeTopWidth);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeTopDash);
          context.stroke();
        }
        /* Bottom border */
        if (strokeBottomColor) {
          context.beginPath();
          context.moveTo(
            strokeLeftColor ? -getOffsetFromWidth(strokeLeftWidth) : 0,
            shape.height() + 0.5
          );
          context.lineTo(
            shape.width() +
            (strokeRightColor ? getOffsetFromWidth(strokeRightWidth) + 1 : 1),
            shape.height() + 0.5
          );
          context.setAttr("lineWidth", strokeBottomWidth);
          context.setAttr("strokeStyle", strokeBottomColor);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeBottomDash);
          context.stroke();
        }
        /* Left border */
        if (strokeLeftColor) {
          context.beginPath();
          context.moveTo(
            0.5,
            strokeTopColor ? -getOffsetFromWidth(strokeTopWidth) : 0
          );
          context.lineTo(
            0.5,
            shape.height() +
            (strokeBottomColor
              ? getOffsetFromWidth(strokeBottomWidth) + 1
              : 1)
          );
          context.setAttr("strokeStyle", strokeLeftColor);
          context.setAttr("lineWidth", strokeLeftWidth);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeLeftDash);
          context.stroke();
        }
        /* Right border */
        if (strokeRightColor) {
          context.beginPath();
          context.moveTo(
            shape.width() + 0.5,
            strokeTopColor ? -getOffsetFromWidth(strokeTopWidth) : 0
          );
          context.lineTo(
            shape.width() + 0.5,
            shape.height() +
            (strokeBottomColor
              ? getOffsetFromWidth(strokeBottomWidth) + 1
              : 1)
          );
          context.setAttr("strokeStyle", strokeRightColor);
          context.setAttr("lineWidth", strokeRightWidth);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeRightDash);
          context.stroke();
        }
      }}
    />
  );
});



const CellRenderer = (props: any) => {
  const {
    x,
    y,
    width,
    height,
    stroke,
    strokeTopColor = stroke,
    strokeRightColor = stroke,
    strokeBottomColor = stroke,
    strokeLeftColor = stroke,
    strokeDash = [],
    strokeTopDash = [],
    strokeRightDash = [],
    strokeBottomDash = [],
    strokeLeftDash = [],
    strokeWidth = 1,
    strokeTopWidth = strokeWidth,
    strokeRightWidth = strokeWidth,
    strokeBottomWidth = strokeWidth,
    strokeLeftWidth = strokeWidth,
    lineCap = "butt",
  } = props;
  const userStroke =
    strokeTopColor || strokeRightColor || strokeBottomColor || strokeLeftColor;
  console.log('userStroke', userStroke);

  // if (!userStroke) return null;
  return (
    <CellOverlay
      key={'51515'}
      x={x}
      y={y}
      width={width}
      height={height}
      strokeTopColor={strokeTopColor}
      strokeRightColor={strokeRightColor}
      strokeBottomColor={strokeBottomColor}
      strokeLeftColor={strokeLeftColor}
      strokeDash={strokeDash}
      strokeTopDash={strokeTopDash}
      strokeRightDash={strokeRightDash}
      strokeBottomDash={strokeBottomDash}
      strokeLeftDash={strokeLeftDash}
      strokeTopWidth={strokeTopWidth}
      strokeRightWidth={strokeRightWidth}
      strokeBottomWidth={strokeBottomWidth}
      strokeLeftWidth={strokeLeftWidth}
      lineCap={lineCap}
    />
  );
};