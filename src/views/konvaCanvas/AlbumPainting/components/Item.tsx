import { Group, Rect, Image, Text } from "react-konva";
import png from '@assets/15.png'
import { useImage } from "../../hooks/useImage";
import { useAlbumPaintingStore } from "../../hooks";
import { observer } from "mobx-react-lite";
import { useMount } from "ahooks";
import Konva from 'konva';

export const Item = ((props: any) => {
  const { rowIndex, columnIndex, x = 0, y = 0, width, height, nums } = props;
  const groupRef = useRef<Konva.Group>(null);
  useMount(() => {
    // groupRef.current!.cache();
  })

  return (
    <Group
      ref={groupRef}
      id={`${rowIndex}:${columnIndex}`}
      onContextMenu={(event) => {
        event.evt.stopPropagation();
        event.evt.preventDefault();
        console.log('event', event);
      }}

    >
      <Rect
        x={x}
        y={y}
        height={height}
        width={width}
        hitStrokeWidth={1}
        strokeWidth={0.2}
        fill="#FFF"
        stroke="grey"
      />
      {/* <Image
        x={x}
        y={y}
        // ref={imgRef as any}
        height={160}
        width={(width || 2) - 1}
        image={useImage(png)[0]}
        // image={useImage('https://image.uisdc.com/wp-content/uploads/2023/08/Character-avatar-20230802-1.png')[0]}
        hitStrokeWidth={1}
        strokeWidth={0.1}
        fill="#FFF"
        stroke="grey"
      /> */}
      <Text
        x={x + 10}
        y={y + 180}
        height={30}
        width={width}
        opacity={0.8}

        text={'App 启动页设计'}
        fontSize={12}
        verticalAlign="top"
        align="left"
      />
      <Text
        x={x + 10}
        y={y + 210}
        height={30}
        width={width}
        text={`${rowIndex}-${columnIndex}` + '设计 APP 启动项，突出品牌特色'}
        fontSize={12}
        opacity={0.8}
        verticalAlign="top"
        fontFamily="PingFang SC"
        fontStyle="italic oblique normal normal 12px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
        align="left"
      />
      <Rect
        x={x + 10}
        y={(y + height - 40) || 0}
        height={25}
        width={50}
        roundRadius={0}
        hitStrokeWidth={1}
        strokeWidth={0.2}
        fill="#FFDCDB"
        stroke="grey"
      />
      <Text
        x={x + 18}
        y={(y + height - 32) || 0}
        height={25}
        width={50}
        text={'设计C'}
        fontSize={10}
        opacity={0.8}
        verticalAlign="top"
        align="left"
      />

    </Group>
  )
})
