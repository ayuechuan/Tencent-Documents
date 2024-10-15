import Konva from "konva";
import { observer } from "mobx-react-lite";
import { Group, Rect } from "react-konva";
import { Portal } from "react-konva-utils";
import { useAlbumPaintingStore } from "../../hooks";
import { createElement, ReactNode } from "react";
import { ItemProps } from "../model";

interface Props {
  getLayer: () => Konva.Layer;
  ActiveDragElement: (props: ItemProps) => ReactNode;
}

export const PortalLayer = observer(({ getLayer ,ActiveDragElement }: Props) => {
  const { stageManager } = useAlbumPaintingStore();
  const horizontalBarRef = useRef<Konva.Rect>(null);

  return (
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
          position.x = getLayer().width() - stageManager.PADDING;
          position.y = Math.max(
            Math.min(position.y, getLayer().height() - stageManager.PADDING - stageManager.calculateBarHeight),
            stageManager.PADDING
          );
          return position;
        }}
        onDragMove={() => {
          const layer = getLayer();
          if (layer && horizontalBarRef.current) {
            const barY = horizontalBarRef.current.y();
            const availableHeight = layer.height() - stageManager.PADDING * 2 - stageManager.calculateBarHeight;
            const newScrollTop = ((barY - stageManager.PADDING) / availableHeight) * (stageManager.CANVAS_HEIGHT - stageManager.VIEWPORT_HEIGHT);
            stageManager.setScrollTop(Math.ceil(newScrollTop));
          }
        }}
      />
    </Portal>
  )
})