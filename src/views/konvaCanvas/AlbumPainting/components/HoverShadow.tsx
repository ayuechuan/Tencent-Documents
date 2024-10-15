import { Rect } from "react-konva";
import { useAlbumPaintingStore } from "../../hooks";
import { observer } from "mobx-react-lite";

export const HoverShadow=observer(()=> {
  const { stageManager } = useAlbumPaintingStore();
  return (
    <Rect
      fill="rgba(255, 255, 255, 0.2)" // 透明填充
      visible={!!stageManager.hoveRect?.x}
      shadowColor="rgba(0,0,0,0.8)" // 阴影颜色
      shadowBlur={15} // 阴影模糊程度
      shadowOffsetX={5} // 阴影偏移X
      shadowOffsetY={5} // 阴影偏移Y
      x={766}
      y={295}
      width={stageManager.finalWidth - 20}
      height={stageManager.rowHeight - 20}
      {...stageManager.hoveRect}
    />
  )
})
