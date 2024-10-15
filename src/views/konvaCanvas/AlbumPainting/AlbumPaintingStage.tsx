import { observer } from "mobx-react-lite";
import { Group, Layer, Rect, Stage } from "react-konva";
import { Portal } from "react-konva-utils";
import { createElement, PropsWithChildren, ReactNode } from "react";
import Konva from "konva";

import { ItemProps } from "./model";
import { useAlbumPaintingStore } from "../hooks";
import { toJS } from "mobx";
import { HoverShadow } from "./components";

interface Props {
  /**
   * 子项渲染
   */
  ItemChildrenRender: (props: ItemProps) => ReactNode;
  /**
   * 克隆项渲染
   */
  ActiveDragElement?: (props: ItemProps) => ReactNode;
  /**
   * 固定画布宽度
   */
  StageWidth?: number;
  /**
   * 画布高度
   */
  StageHeight?: number;
  /**
   * 自适应
   */
  autofit?: boolean;
}

export type ExtractProps = Pick<Props, 'StageHeight' | 'StageWidth' | 'autofit'>;

export const AlbumPaintingStage = observer((
  {
    children,
    ItemChildrenRender,
    ActiveDragElement = ItemChildrenRender,
    ...props
  }: PropsWithChildren<Props>) => {

  const { stageManager } = useAlbumPaintingStore();
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const verticalBarRef = useRef<Konva.Rect>(null);
  const horizontalBarRef = useRef<Konva.Rect>(null);

  useEffect(() => {
    stageManager.registerRefs({
      stage: stageRef.current!,
      layer: layerRef.current!,
      verticalScroll: verticalBarRef.current!,
      horizontalScroll: horizontalBarRef.current!
    });
  }, [])

  useEffect(() => {
    let effect: () => void;
    if (props.autofit) {
      effect = stageManager.resize();
    }
    return () => void effect?.();
  }, [])

  // console.log('stageManager.hoveRect', toJS(stageManager.hoveRect), !!stageManager.hoveRect?.width);

  return (
    <Stage
      width={stageManager.width}
      height={stageManager.height}
      ref={stageRef}
      id="stageContainer"
      style={{ background: '#F3F5F7', flex: 1 }}
      onWheel={(event) => {
        event.evt.preventDefault();
        const deltaY = event.evt.deltaY;
        // 每次滚动的步长
        const step = 50;
        // 根据滚动方向更新 scrollTop
        const newScrollTop = Math.max(
          0,
          Math.min(stageManager.scrollTop + (deltaY > 0 ? step : -step),
            stageManager.CANVAS_HEIGHT - stageManager.VIEWPORT_HEIGHT)
        );
        // 更新滚动条位置 && 更新视图渲染
        stageManager.setScrollTop(newScrollTop);

        //  更新画布的 y 坐标
        const availableHeight = stageRef.current!.height() - stageManager.PADDING * 2 - stageManager.calculateBarHeight;
        const barY = stageManager.PADDING + (newScrollTop / (stageManager.CANVAS_HEIGHT - stageManager.VIEWPORT_HEIGHT)) * availableHeight;
        horizontalBarRef.current!.y(barY);
      }}
      onMouseup={stageManager.stageMouseup.bind(stageManager)}
      onMousemove={stageManager.handleMouseMove.bind(stageManager)}
    >
      <Layer
        onMouseDown={stageManager.handleMouseDown.bind(stageManager)}
        ref={layerRef}>
        <Portal selector=".controls-layer">
          <Group visible={stageManager.portalGroupVisible}>
            <Rect
              {...stageManager.dragingHighlightLine}
              width={2}
              height={stageManager.rowHeight - 10}
              fill="#003cab"
              visible={stageManager.highlightLineVisible}
              draggable={true}
            />
            <Group
              {...stageManager.cloneCardGroupPosition}
              width={stageManager.draggerRect?.width || 0}
              height={stageManager.draggerRect?.height || 0}
            >
              {createElement(ActiveDragElement, stageManager.draggerRect as any)}
            </Group>
          </Group>
          <Rect
            width={8}
            height={stageManager.calculateBarHeight}
            fill={'#C0C4C9'}
            // opacity={0.2}
            x={stageManager.horizontalX}
            y={0}
            visible={stageManager.isShowScrollRect}
            cornerRadius={[10, 10, 10, 10]}
            draggable
            ref={horizontalBarRef}
            dragBoundFunc={(position) => {
              position.x = stageRef.current!.width() - stageManager.PADDING;
              position.y = Math.max(
                Math.min(position.y, stageRef.current!.height() - stageManager.PADDING - stageManager.calculateBarHeight),
                stageManager.PADDING
              );
              return position;
            }}
            onDragMove={() => {
              if (stageRef.current && horizontalBarRef.current) {
                const barY = horizontalBarRef.current.y();
                const availableHeight = stageRef.current.height() - stageManager.PADDING * 2 - stageManager.calculateBarHeight;
                const newScrollTop = ((barY - stageManager.PADDING) / availableHeight) * (stageManager.CANVAS_HEIGHT - stageManager.VIEWPORT_HEIGHT);
                stageManager.setScrollTop(Math.ceil(newScrollTop));
              }
            }}
          />
          {/* 横向滚动条 */}
          {/* <Rect
            width={100} // 滚动条宽度
            height={10} // 滚动条高度
            fill={'grey'}
            opacity={0.3}
            x={stageManager.PADDING} // 左侧边距
            y={stageRef.current?.height() - stageManager.PADDING - 10} // 底部位置
            draggable
            ref={verticalBarRef}
            cornerRadius={[10, 10, 10, 10]}
            dragBoundFunc={(pos) => {
              pos.y = stageRef.current.height() - stageManager.PADDING - 10; // 固定 Y 轴位置
              pos.x = Math.max(
                Math.min(pos.x, stageRef.current.width() - stageManager.PADDING - 100),
                stageManager.PADDING
              );
              return pos;
            }}
            onDragMove={() => {
              if (stageRef.current && verticalBarRef.current && layerRef.current) {
                const barX = verticalBarRef.current.x();
                const availableWidth = stageRef.current.width() - stageManager.PADDING * 2 - verticalBarRef.current.width();
                const delta = (barX - stageManager.PADDING) / availableWidth;
                layerRef.current.x(-(WIDTH - stageRef.current.width()) * delta);
                // layerRef.current.getLayer().batchDraw();
              }
            }}
          /> */}
        </Portal>
        {/* <Rect
          fill="rgba(255, 255, 255, 0.2)" // 透明填充
          visible={!!stageManager.hoveRect?.x}
          shadowColor="rgba(0,0,0,0.8)" // 阴影颜色
          shadowBlur={15} // 阴影模糊程度
          shadowOffsetX={5} // 阴影偏移X
          shadowOffsetY={5} // 阴影偏移Y
          // x={766}
          // y={295}
          // width={275}
          width={stageManager.finalWidth - 20}
          height={stageManager.rowHeight - 20}
          {...stageManager.hoveRect}
        /> */}
        <HoverShadow />
        <Group
          id='one'
          offsetY={stageManager.scrollTop}
          offsetX={stageManager.scrollLeft}
        >
          {stageManager.showItems.map(({ x, y, width, height, rowIndex, columnIndex }) => {
            return createElement(ItemChildrenRender, {
              x,
              y,
              width,
              height,
              rowIndex,
              columnIndex,
              key: `${rowIndex}:${columnIndex}`,
            })
          })}
        </Group>
      </Layer>
      <Layer
        name="controls-layer"
        height={stageManager.CANVAS_HEIGHT}
        width={600}
        visible={true}
      />
    </Stage>
  )
})
