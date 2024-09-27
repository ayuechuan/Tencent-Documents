import { Group, Image, Rect, Text } from "react-konva";
import Grid from "./Grid";
import { Button } from "tdesign-react/esm";
import { useMount } from "ahooks";
import { GridService } from "./service";
import { observer, useLocalObservable, useObserver } from "mobx-react-lite";
import { makeAutoObservable, toJS } from "mobx";
import dayjs from "dayjs";
import React from "react";

function useImage(url: any, crossOrigin?: any, referrerpolicy?: any) {
  // lets use refs for image and status
  // so we can update them during render
  // to have instant update in status/image when new data comes in
  const statusRef = React.useRef<any>('loading');
  const imageRef = React.useRef<any>();

  // we are not going to use token
  // but we need to just to trigger state update
  const [_, setStateToken] = React.useState(0);

  // keep track of old props to trigger changes
  const oldUrl = React.useRef();
  const oldCrossOrigin = React.useRef();
  const oldReferrerPolicy = React.useRef();
  if (oldUrl.current !== url || oldCrossOrigin.current !== crossOrigin || oldReferrerPolicy.current !== referrerpolicy) {
    statusRef.current = 'loading';
    imageRef.current = undefined;
    oldUrl.current = url;
    oldCrossOrigin.current = crossOrigin;
    oldReferrerPolicy.current = referrerpolicy;
  }

  React.useLayoutEffect(
    function () {
      if (!url) return;
      var img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      function onload() {
        statusRef.current = 'loaded';
        canvas.width = img.width;
        canvas.height = img.height;
        context!.drawImage(img, 0, 0);
        imageRef.current = canvas;
        setStateToken(Math.random());
      }

      function onerror() {
        statusRef.current = 'failed';
        imageRef.current = undefined;
        setStateToken(Math.random());
      }

      img.addEventListener('load', onload);
      img.addEventListener('error', onerror);
      crossOrigin && (img.crossOrigin = crossOrigin);
      referrerpolicy && (img.referrerPolicy = referrerpolicy);
      img.src = url;

      return function cleanup() {
        img.removeEventListener('load', onload);
        img.removeEventListener('error', onerror);
      };
    },
    [url, crossOrigin, referrerpolicy]
  );

  // return array because it is better to use in case of several useImage hooks
  // const [background, backgroundStatus] = useImage(url1);
  // const [patter] = useImage(url2);
  return [imageRef.current, statusRef.current];
};


class Store {
  public dataSource!: any
  constructor() {
    makeAutoObservable(this);
    GridService.getDataSource().then(([error, source]) => {
      console.log('errrrr',error,source);
      
      if (error) {
        return;
      }
      console.log('source============>>>>>', (source as any).data);
      this.dataSource = [...(source as any).data]
    })
  }
}


export const KonvaCanvas = observer(() => {
  const GridRef = useRef<any>();
  const store = useLocalObservable(() => new Store());
  return (
    <div>
      <Button
        type='button'
        onClick={() => {
          GridRef.current?.img();
        }}>导出</Button>
      <Grid
        scrollbarSize={20}
        rowCount={7}
        columnCount={15}
        width={1200}
        height={800}
        store={store.dataSource}
        ref={GridRef}
        rowHeight={(rowIndex) => 100}
        columnWidth={(columnIndex) => 120}
      >
        {Cell}
      </Grid>
    </div>
  )

})
const usernames = [
  { "email": "123@qq.com", "username": "test-1" },
  { "email": "789@qq.com", "username": "test-2" },
  { "email": "126@qq.com", "username": "test-3" },
  { "email": "456@qq.com", "username": "test-4" },
  { "email": "1678@qq.com", "username": "test-5" },
  { "email": "123@qq.com", "username": "test-6" }
]
const Cell = (props: any) => {
  const { rowIndex, columnIndex, x, y, width, height, store } = props;
  if (!store?.length) {
    return <></>;
  }

  if (rowIndex === 0 && columnIndex === 0) {
    return <Rect
      x={x}
      y={y}
      height={height}
      width={width}
      hitStrokeWidth={1}
      strokeWidth={0.2}
      fill="#FFF"
      stroke="grey"
    />;
  }


  if (rowIndex === 0) {
    return (
      <Group
        onClick={(event) => {
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
        <Text
          x={x}
          y={y - 20}
          height={height}
          width={width}
          fontSize={16}
          text={store[columnIndex].date}
          verticalAlign="middle"
          align="center"
        />
        <Text
          x={x - 25}
          y={y + 10}
          fontSize={16}
          height={height}
          width={width}
          text={dayjs(store[columnIndex].date).day().toString()}
          verticalAlign="middle"
          align="center"
        />
      </Group>
    )
  }

  if (columnIndex === 0) {
    return <IamgeGroup {...props}/>

  }

  if (rowIndex >= 1 && columnIndex >= 1) {
    const name = store[columnIndex].shiftList[rowIndex]?.name;
    const color = name === '早班' ? '#266efe' : name === '中班' ? '#20cad4' : '#fa9f25'
    const bgcolor = name === '早班' ? '#e8f4fd' : name === '中班' ? '#e8fffc' : '#fffae8'


    return <Group>
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
      {name && <ContextCell {...props} name={name} color={color} bgcolor={bgcolor} />}
    </Group>
  }

  return (
    <Group>
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
    </Group>
  )
}

// 

function ContextCell(props: any) {
  const { rowIndex, columnIndex, x, y, width, height, store, name, bgcolor, color } = props;
  if (rowIndex === 2 && columnIndex <= 3) {
    return <ItemCell  {...props} />
  }
  return (
    <><Rect
      x={x + 10}
      y={y + 10}
      height={height - 20}
      width={width - 20}
      hitStrokeWidth={1}
      strokeWidth={devicePixelRatio * 1}
      fill={bgcolor}
      stroke={color}
    />
      <Text
        x={x + 20}
        y={y + 20}
        height={height}
        width={width}
        text={store[columnIndex].shiftList[rowIndex]?.name}
        fill={color}
        fontSize={16}
        verticalAlign="top"
        align="left"
      />
    </>
  )
}
// https://svgsilh.com/svg/3199412.svg


function ItemCell({ rowIndex, columnIndex, x, y, width, height, store, name, bgcolor, color }: any) {
  const img = useImage('https://img.ixintu.com/download/jpg/20201117/47b0927fa6ca7b105c3cccda2038095a_512_386.jpg!con')
  return (
    <><Rect
      x={x + 10}
      y={y + 10}
      height={height - 20}
      width={width - 20}
      hitStrokeWidth={1}
      strokeWidth={devicePixelRatio * 1}
      fill={bgcolor}
      stroke={color}
    />
      <Text
        x={x + 20}
        y={y + 20}
        height={height}
        width={width}
        text={store[columnIndex].shiftList[rowIndex]?.name}
        fill={color}
        fontSize={16}
        verticalAlign="top"
        align="left"
      />
        <Image
        image={img[0]}
        width={50}
        x={x + 50}
        y={y + 35}
        height={50}
      />
    </>
  )
}



function IamgeGroup({ rowIndex, columnIndex, x, y, width, height, store }: any) {
  const img = useImage('https://image.uisdc.com/wp-content/uploads/2023/08/Character-avatar-20230802-1.png')
  return (
    <Group>
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
      <Text
        x={x + 40}
        y={y + 35}
        height={height}
        width={width}
        text={usernames[rowIndex - 1].username}
        fontSize={16}
        verticalAlign="top"
        align="left"
      />
      <Text
        x={x + 40}
        y={y + 60}
        height={height}
        width={width}
        text={usernames[rowIndex - 1].email}
        fontSize={13}
        verticalAlign="top"
        align="left"
      />
      <Image
        image={img[0]}
        width={30}
        x={x + 5}
        y={y + 35}
        height={30}
      />
    </Group>
  )
}