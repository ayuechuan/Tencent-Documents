import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { Group, Rect, Image } from "react-konva";
import { Portal, useImage } from "react-konva-utils";
import { BoardStore } from "..";

export const PoralGroup = observer(({ store }: { store: BoardStore }) => {

  return (
    <>
      <Portal selector=".controls-layer">

        <Rect
          fill={'rgba(0, 0, 0, 0.033)'}
          strokeWidth={0}
          {...store.hoverGroupRect}
          visible={!!store.hoverGroupRect.width}
        />
        <Rect
          x={store.dargColumnItemHelperLine.x}
          y={store.dargColumnItemHelperLine.y}
          width={232}
          height={2}
          fill="#0b57d0"
          strokeWidth={1}
          visible={!!store.dargColumnItemHelperLine.x}
        />
        <Rect
          x={store.dargColumnHelperLine.x}
          y={0}
          width={2}
          height={window.innerHeight}
          fill="#0b57d0"
          strokeWidth={1}
          visible={!!store.dargColumnHelperLine.x}
        />

        <Rect
          x={store.activeSelectedRect.x}
          y={store.activeSelectedRect.y}
          width={store.activeSelectedRect.width}
          height={store.activeSelectedRect.height}
          // fill="#0b57d0"
          stroke={'#0b57d0'}
          // strokeWidth={1}
          cornerRadius={[2, 2, 2, 2]}
          visible={!!store.activeSelectedRect.x}
        />
        <Rect
          width={100} // 滚动条宽度
          height={8} // 滚动条高度
          fill={'grey'}
          opacity={0.3}
          x={10} // 左侧边距
          y={innerHeight - 20} // 底部位置
          name="verticalBar"
          draggable
          cornerRadius={[10, 10, 10, 10]}
          dragBoundFunc={(pos) => {
            pos.y = store.stageRef!.height() - 10 - 10; // 固定 Y 轴位置
            pos.x = Math.max(
              Math.min(pos.x, store.stageRef!.width() - 10 - 100),
              10
            );
            return pos;
          }}
          onDragMove={() => {

          }}
        />
        <Group visible={store.visible}>
          <Rect
            x={store.cloneGroupRect.x}
            y={store.cloneGroupRect.y}
            width={store.cloneGroupRect.width}
            height={store.cloneGroupRect.height}
            fill="transparent"
          />
          <Image
            image={useImage(store.cloneGroupRect.img)[0]}
            x={store.cloneGroupRect.x}
            y={store.cloneGroupRect.y}
            width={store.cloneGroupRect.width}
            height={store.cloneGroupRect.height}
          />
        </Group>
      </Portal>
    </>
  )
})