import { Group, Layer, Rect, Text, Stage, Image } from "react-konva";
import { Portal, useImage } from "react-konva-utils";
import Konva from 'konva';
import { useMount } from "ahooks";
import { makeAutoObservable, observable, toJS } from "mobx";
import { observer, useLocalObservable, useObserver } from "mobx-react-lite";
import { PoralGroup } from "./components/PortalGroup";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Node as KonvaNode } from "konva/lib/Node";
import { KonvaEventObject, NodeConfig } from "konva/lib/Node";
import { IColumnID } from "./model";
import { Vector2d } from "konva/lib/types";
import { FeatureCanvas } from './feature/HighLight'
import { MenuItem } from "@/components/menuItem/menuItem";

export class BoardStore {
  constructor() {
    makeAutoObservable(this, {
      layerRef: false,
      columnGroupContainer: false,
      stageRef: false
    });
  }

  cloneGroupRect = { x: 0, y: 0, width: 0, height: 0, img: '' };
  hoverGroupRect = { x: 0, y: 0, width: 0, height: 0 };
  offsetY = 0;
  minColumnHeaderHeight = 47.9;
  isDraging = false;
  columnGroupContainer: Konva.Group | null = null;
  layerRef: Konva.Layer | null = null;
  stageRef: Konva.Stage | null = null;
  dargColumnHelperLine = {
    x: 0
  };

  dargColumnItemHelperLine = {
    x: 0,
    y: 0,
  };
  scrollGroupInstance: Konva.Group | null = null;

  dragGroupItem: Konva.Group | null = null;
  oldRect = { x: 0, y: 0 };
  activeSelectedRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  //  存储所有列 y 轴偏移量
  columnsScrollY = observable.map<IColumnID, number>();

  handleMouseMove(event: any) {
    if (!this.isDraging) {
      //  滚轮滚动时 需要确定鼠标位于的列
      this.scrollGroupInstance = this.getActiveColumnGroup();
      //  鼠标移入对应的子项 需要高亮
      this.handleMoveHover(event);
      return;
    }

    //  拖动列子项
    if (this.dragGroupItem) {
      this.dragGroupItemHandle();
      return;
    }

    //  拖动整列
    if (this.columnGroupContainer) {
      this.dragGroupColumnHandle();
      return;
    }
  }

  dragGroupColumnHandle() {
    if (!this.cloneGroupRect.img) {
      const url = this.toDataURLGroup();
      Object.assign(this.cloneGroupRect, { ...url });
      this.stageRef!.container().style.cursor = 'grabbing';
    }

    const pointer = this.stageRef!.getPointerPosition()!;
    if (!this.hoverGroupRect.height) {
      // 拖动时背景色
      this.hoverGroupRect = {
        x: this.columnGroupContainer!.x(),
        y: this.columnGroupContainer!.y(),
        width: this.columnGroupContainer!.width(),
        height: innerHeight,
      };
    }

    this.cloneGroupRect = {
      ...this.cloneGroupRect,
      x: pointer.x,
      y: pointer.y,
    };

    const childrens = this.layerRef!.children;
    for (let index = 0; index < childrens.length; index++) {
      const group = childrens[index];
      const rect = group.getClientRect();
      if (this.haveIntersection(rect, pointer)) {
        if (group.attrs.id === this.columnGroupContainer!.attrs.id) {
          this.dargColumnHelperLine = { x: 0 };
          return;
        }
        this.dargColumnHelperLine = { x: rect.x + rect.width };
      }
    }
  }

  dragGroupItemHandle() {
    const groups = this.layerRef!.find('.column_item');
    const pointer = this.stageRef!.getPointerPosition()!;

    if (!this.cloneGroupRect.img) {
      const url = this.toDataURLGroup();
      Object.assign(this.cloneGroupRect, { ...url });

      this.stageRef!.container().style.cursor = 'grabbing';
    }

    this.cloneGroupRect = {
      ...this.cloneGroupRect,
      x: pointer.x - this.oldRect.x,
      y: pointer.y - this.oldRect.y,
    };

    for (let index = 0; index < groups.length; index++) {
      const group = groups[index];
      const rect = group.getClientRect();
      if (this.haveIntersection(rect, pointer)) {
        this.dargColumnItemHelperLine = rect;
        return;
      }
    }
  }


  /**
   * 获取当前鼠标位于列  用于onWheel滚动时 偏移正确列
   * @returns 
   */
  getActiveColumnGroup(): Konva.Group | null {
    const childrens = this.layerRef!.children;
    const pointer = this.stageRef!.getPointerPosition()!;

    for (let index = 0; index < childrens.length; index++) {
      const group = childrens[index];
      const rect = group.getClientRect();
      if (this.haveIntersection(rect, pointer)) {
        return group as Konva.Group;
      }
    }
    return null;
  }

  /**
   * 获取列 group 信息  主要为了获取 动态计算的列高
   * @param group 
   * @returns 
   */
  getColumnGroupRect(group: Konva.Group) {
    return group.getClientRect();
  }

  /**
   * 设置滚动列 offsetY
   * @param scrollTop 
   */
  setGroupScroll(scrollTop: number) {
    const scrollGroup = this.scrollGroupInstance!.findOne('.column-scroll') as Konva.Group;
    scrollGroup!.offsetY(scrollTop)
  }

  /**
   * 鼠标进入当前列 是否可滚动
   */
  get canColumnScroll(): boolean {
    const { height: groupHeight } = this.getColumnGroupRect(this.scrollGroupInstance!);
    return groupHeight > window.innerHeight - 50;
  }

  has() {

  }

  haveIntersection(rect: any, point: any, marign = 0): boolean {
    const { x, y, width, height } = rect;
    const { x: pointX, y: pointY } = point;

    return (
      pointX >= x &&
      pointX <= x + width - marign &&
      pointY >= y &&
      pointY <= y + height
    );
  }

  getMousePointerShape(): {
    group: Konva.Group,
    pointer: Vector2d
  } | null {
    const groups = this.layerRef?.find('.column_item')!;
    const pointer = this.stageRef!.getPointerPosition()!;
    for (let index = 0; index < groups.length; index++) {
      const group = groups[index] as Konva.Group;
      const rect = group.getClientRect();
      if (this.haveIntersection(rect, pointer)) {
        return {
          pointer,
          group
        }
      }
    }
    return null;
  }

  handleMoveHover(event: any): void {
    const { parent } = event.target;
    if (event.target?.attrs?.name === 'verticalBar') {
      return;
    }

    if (parent instanceof Konva.Group
      && (parent?.attrs.name === 'column_item'
        || parent?.attrs.name === '_inner_portal')) {
      const shape = this.getMousePointerShape()!;
      if (!shape) {
        return;
      }
      const rect = shape.group?.getClientRect()!;
      if (rect.y < this.minColumnHeaderHeight) {
        rect.height = rect.height - (this.minColumnHeaderHeight - rect.y);
        rect.y = this.minColumnHeaderHeight;
      }
      this.stageRef!.container().style.cursor = 'pointer';
      this.hoverGroupRect = rect;
    } else {
      this.hoverGroupRect = { x: 0, y: 0, width: 0, height: 0 };
      this.stageRef!.container().style.cursor = 'default';
    }
  }

  toDataURLGroup() {
    // 获取 group 对象
    const group = this.columnGroupContainer!;
    const rect = group.getClientRect();
    // const groupRect = {
    //   x: group.x(),
    //   y: group.y(),
    //   width: group.width(),
    //   height: group.height() || innerHeight,
    // }
    const groupRect = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height || innerHeight,
    }
    // 生成数据 URL
    const dataURL = group!.getStage()!.toDataURL({
      pixelRatio: 3, // 增加像素比以提高图像质量
      ...groupRect,
      y: groupRect.y
    });

    return {
      img: dataURL,
      ...groupRect
    };
  }

  handleMouseUp() {
    this.isDraging = false;
    this.cloneGroupRect = { x: 0, y: 0, width: 0, height: 0, img: '' }
    // this.setHoverGroupRect();
    this.dargColumnHelperLine = { x: 0 };
    this.dargColumnItemHelperLine = { x: 0, y: 0 }
    this.dragGroupItem = null;
    this.columnGroupContainer = null;
  }

  setHoverGroupRect() {
    if (this.hoverGroupRect.width) {
      this.hoverGroupRect = { x: 0, y: 0, width: 0, height: 0 };
    }
  }

  handleMouseDown(columnID: string) {
    this.columnGroupContainer = this.getColumnGroupContainer(columnID);
    this.isDraging = true;
  }


  columnItemGroupMouseDown(event: Konva.KonvaEventObject<MouseEvent>) {
    if (event.evt.button !== 0) {
      return;
    }
    const shape = this.getMousePointerShape()!;
    if (!shape) {
      return;
    }
    const { group, pointer } = shape;
    const rect = group.getClientRect();
    this.isDraging = true;
    this.oldRect = {
      x: pointer?.x! - rect?.x,
      y: pointer?.y! - rect?.y
    };
    this.dragGroupItem = group as Konva.Group;
    this.columnGroupContainer = group! as Konva.Group;

    return;

    // const groups = this.layerRef!.find('.column_item');
    // const pointer = this.stageRef!.getPointerPosition();

    // for (let index = 0; index < groups.length; index++) {
    //   const group = groups[index];
    //   const rect = group.getClientRect();
    //   if (this.haveIntersection(rect, pointer)) {
    //     this.isDraging = true;
    //     console.log('group', group);
    //     this.oldRect = {
    //       x: pointer?.x! - rect?.x,
    //       y: pointer?.y! - rect?.y
    //     };
    //     this.dragGroupItem = group as Konva.Group;
    //     this.columnGroupContainer = group! as Konva.Group;
    //     return;
    //   }
    // }
  }

  getColumnGroupContainer(columnID: string): Konva.Group | null {
    return this.layerRef?.children.find((groupItem) => groupItem.attrs?.id === columnID) as Konva.Group | null;
  }

  onWheel(event: KonvaEventObject<WheelEvent, KonvaNode<NodeConfig>>) {
    event.evt.preventDefault();  // 阻止默认的滚动行为
    //  高度不够 不足以滚动
    if (!this.canColumnScroll) {
      return;
    }

    this.setHoverGroupRect();
    // 设置 鼠标抓手
    this.stageRef!.container().style.cursor = 'default'
    document.body.style.cursor = 'default';

    const deltaY = event.evt.deltaY;
    // 每次滚动的步长
    const step = 20;
    // 计算新的偏移量
    let newOffsetY = this.scrollGroupInstance!.offsetY() + Math.sign(deltaY) * step;
    // 确保新的偏移量不小于0
    if (newOffsetY < 0) {
      newOffsetY = 0;
    }
    // 更新 列 滚动group 的 offsetY偏移量
    this.setGroupScroll(newOffsetY);
  }

  onClick(event: KonvaEventObject<MouseEvent, KonvaNode<NodeConfig>>) {
    if (event.evt.button !== 0) {
      return;
    }
    const groups = this.layerRef?.find('.column_item')!;
    const pointer = this.stageRef!.getPointerPosition()!;
    let groupInstance: Konva.Group | null = null;

    for (let index = 0; index < groups.length; index++) {
      const group = groups[index];
      const rect = group.getClientRect();
      if (this.haveIntersection(rect, pointer)) {
        groupInstance = group as Konva.Group;
        break;
      }
    }

    if (!groupInstance) {
      this.activeSelectedRect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
      return;
    }

    // let rect = parent.getClientRect();
    const rect = groupInstance?.getClientRect()!;
    // if (rect.y < this.minColumnHeaderHeight) {
    //   rect.height = rect.height - (this.minColumnHeaderHeight - rect.y);
    //   rect.y = this.minColumnHeaderHeight;
    // }
    event.target.getStage()!.container().style.cursor = 'pointer';
    this.activeSelectedRect = rect;
  }

  get visible() {
    return !!(this.cloneGroupRect.img && this.cloneGroupRect.height) && this.isDraging
  }

  setRefs(layer: Konva.Layer, stage: Konva.Stage): void {
    this.layerRef = layer;
    this.stageRef = stage;
  }
}


export const Board = observer(() => {
  const layerRef = useRef<Konva.Layer>(null);
  const store = useLocalObservable(() => new BoardStore())
  const scrollRef = useRef<Konva.Group>(null);
  const stageRef = useRef<Konva.Stage>(null);

  useMount(() => {
    store.setRefs(
      layerRef.current!,
      stageRef.current!
    )
  })

  return (
    <>
      <MenuItem
        style={{
          width: 120,
          transform : 'translate(100px, 100px)',
          position: 'absolute',
          zIndex:999,
        }}
        items={[
          { key: '1', label: '展开', onClick: (key: string) => { } },
          { key: '2', label: '移除卡片', onClick: (key: string) => { } }
        ]}
        onClick={() => { }}
      />
      <Stage
        width={window.innerWidth - 200}
        height={window.innerHeight}
        id="stage-board"
        style={{ background: '#F3F5F7', flex: 1 }}
        ref={stageRef}
        onWheel={store.onWheel.bind(store)}
        onMousemove={store.handleMouseMove.bind(store)}
        onMouseUp={store.handleMouseUp.bind(store)}
        onMouseDown={store.columnItemGroupMouseDown.bind(store)}
        onClick={store.onClick.bind(store)}
        onContextMenu={(event) => {
          event.cancelBubble = true;
          event.evt.stopPropagation()
          event.evt.preventDefault()
          console.log('event', event);

        }}
      >
        <Layer
          // scaleX={1.2} 
          // scaleY={1.2}
          ref={layerRef}
          offsetX={0}
        >
          <PoralGroup store={store} />
          <Group
            // height={200}
            id='123'
            x={10}
            y={0}
            // listening={false}
            width={232}
          >

            <Group
              name="column-scroll"
              ref={scrollRef}
              y={0}
              x={0}
              offsetY={store.offsetY}
            >
              <Group
                name="column_item"
                y={50}
                width={232}>
                <Rect
                  x={0}
                  y={0}
                  width={232}
                  height={200}
                  fill="white" // 矩形的填充颜色
                  // stroke="rgba(0, 0, 0, 0.12)" // 边框颜色，使用 RGBA
                  stroke={'rgba(0, 0, 0, 0.41)'}
                  strokeWidth={0.2} // 边框宽度
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  text={'商品详情页设计'}
                  fontSize={13}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={30}
                  opacity={0.5}
                  text={'需求概览'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />

                <Rect
                  x={20}
                  y={70}
                  fill={'#d6e5ff'}
                  width={60}
                  height={30}
                  //  圆角
                  cornerRadius={3}
                />
                <Text
                  height={30}
                  // width={60}
                  x={30}
                  y={70}
                  // opacity={0.5}
                  text={'美工B'}
                  fontSize={12}
                  verticalAlign="middle"
                // align="middle"
                />

                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={100}
                  opacity={0.5}
                  text={'进行中'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Rect
                  x={20}
                  y={140}
                  fill={'#f3e096'}
                  width={60}
                  height={30}
                  //  圆角
                  cornerRadius={3}
                />
                <Text
                  height={30}
                  // width={60}
                  x={30}
                  y={140}
                  // opacity={0.5}
                  text={'未开始'}
                  fontSize={12}
                  verticalAlign="middle"
                // align="middle"
                />


              </Group>

              <Group name="column_item" y={247} width={232}>
                <Rect
                  x={0}
                  y={0}
                  width={232}
                  height={300}
                  fill="white" // 矩形的填充颜色
                  // stroke="rgba(0, 0, 0, 0.12)" // 边框颜色，使用 RGBA
                  stroke={'rgba(0, 0, 0, 0.41)'}
                  strokeWidth={0.2} // 边框宽度
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  text={'商品详情页设计'}
                  fontSize={13}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={30}
                  opacity={0.5}
                  text={'需求概览'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />

                <Rect
                  x={20}
                  y={70}
                  fill={'#d6e5ff'}
                  width={60}
                  height={30}
                  //  圆角
                  cornerRadius={3}
                />
                <Text
                  height={30}
                  // width={60}
                  x={30}
                  y={70}
                  // opacity={0.5}
                  text={'美工B'}
                  fontSize={12}
                  verticalAlign="middle"
                // align="middle"
                />

                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={100}
                  opacity={0.5}
                  text={'进行中'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Rect
                  x={20}
                  y={140}
                  fill={'#f3e096'}
                  width={60}
                  height={30}
                  //  圆角
                  cornerRadius={3}
                />
                <Text
                  height={30}
                  // width={60}
                  x={30}
                  y={140}
                  // opacity={0.5}
                  text={'未开始'}
                  fontSize={12}
                  verticalAlign="middle"
                // align="middle"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={165}
                  opacity={0.5}
                  text={'开始时间'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={200}
                  // opacity={0.5}
                  text={'2024年10月7日'}
                  fontSize={12}
                />

                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={210}
                  opacity={0.5}
                  text={'结束时间'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={245}
                  // opacity={0.5}
                  text={'2024年10月7日'}
                  fontSize={12}
                />

              </Group>

              <Group name="column_item" y={550} width={232}>
                <Rect
                  x={0}
                  y={0}
                  width={232}
                  height={300}
                  fill="white" // 矩形的填充颜色
                  // stroke="rgba(0, 0, 0, 0.12)" // 边框颜色，使用 RGBA
                  stroke={'rgba(0, 0, 0, 0.41)'}
                  strokeWidth={0.2} // 边框宽度
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  text={'商品详情页设计'}
                  fontSize={13}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={30}
                  opacity={0.5}
                  text={'需求概览'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />

                <Rect
                  x={20}
                  y={70}
                  fill={'#d6e5ff'}
                  width={60}
                  height={30}
                  //  圆角
                  cornerRadius={3}
                />
                <Text
                  height={30}
                  // width={60}
                  x={30}
                  y={70}
                  // opacity={0.5}
                  text={'美工B'}
                  fontSize={12}
                  verticalAlign="middle"
                // align="middle"
                />

                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={100}
                  opacity={0.5}
                  text={'进行中'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Rect
                  x={20}
                  y={140}
                  fill={'#f3e096'}
                  width={60}
                  height={30}
                  //  圆角
                  cornerRadius={3}
                />
                <Text
                  height={30}
                  // width={60}
                  x={30}
                  y={140}
                  // opacity={0.5}
                  text={'未开始'}
                  fontSize={12}
                  verticalAlign="middle"
                // align="middle"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={165}
                  opacity={0.5}
                  text={'开始时间'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={200}
                  // opacity={0.5}
                  text={'2024年10月7日'}
                  fontSize={12}
                />

                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={210}
                  opacity={0.5}
                  text={'结束时间'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={245}
                  // opacity={0.5}
                  text={'2024年10月7日'}
                  fontSize={12}
                />

              </Group>
            </Group>
            <Header id={'123'} store={store} />
          </Group>

          <Group
            // ref={groupRef}
            height={200}
            id='456'
            x={260}
            y={0}
            // listening={false}
            width={232}
          >
            <Group
              name="column-scroll"
              ref={scrollRef}
              y={0}
              offsetY={store.offsetY}
            >
              <Group
                name="column_item"
                y={50}
                width={232}>
                <Rect
                  // x={0}
                  y={0}
                  width={232}
                  height={200}
                  fill="white" // 矩形的填充颜色
                  // stroke="rgba(0, 0, 0, 0.12)" // 边框颜色，使用 RGBA
                  stroke={'rgba(0, 0, 0, 0.41)'}
                  strokeWidth={0.2} // 边框宽度
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  text={'商品详情页设计'}
                  fontSize={13}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={30}
                  opacity={0.5}
                  text={'需求概览'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />

                <Rect
                  x={20}
                  y={70}
                  fill={'#d6e5ff'}
                  width={60}
                  height={30}
                  //  圆角
                  cornerRadius={3}
                />
                <Text
                  height={30}
                  // width={60}
                  x={30}
                  y={70}
                  // opacity={0.5}
                  text={'美工B'}
                  fontSize={12}
                  verticalAlign="middle"
                // align="middle"
                />

                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={100}
                  opacity={0.5}
                  text={'进行中'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Rect
                  x={20}
                  y={140}
                  fill={'#f3e096'}
                  width={60}
                  height={30}
                  //  圆角
                  cornerRadius={3}
                />
                <Text
                  height={30}
                  // width={60}
                  x={30}
                  y={140}
                  // opacity={0.5}
                  text={'未开始'}
                  fontSize={12}
                  verticalAlign="middle"
                // align="middle"
                />


              </Group>

              <Group name="column_item" y={247} width={232}>
                <Rect
                  x={0}
                  y={0}
                  width={232}
                  height={300}
                  fill="white" // 矩形的填充颜色
                  // stroke="rgba(0, 0, 0, 0.12)" // 边框颜色，使用 RGBA
                  stroke={'rgba(0, 0, 0, 0.41)'}
                  strokeWidth={0.2} // 边框宽度
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  text={'商品详情页设计'}
                  fontSize={13}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={30}
                  opacity={0.5}
                  text={'需求概览'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />

                <Rect
                  x={20}
                  y={70}
                  fill={'#d6e5ff'}
                  width={60}
                  height={30}
                  //  圆角
                  cornerRadius={3}
                />
                <Text
                  height={30}
                  // width={60}
                  x={30}
                  y={70}
                  // opacity={0.5}
                  text={'美工B'}
                  fontSize={12}
                  verticalAlign="middle"
                // align="middle"
                />

                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={100}
                  opacity={0.5}
                  text={'进行中'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Rect
                  x={20}
                  y={140}
                  fill={'#f3e096'}
                  width={60}
                  height={30}
                  //  圆角
                  cornerRadius={3}
                />
                <Text
                  height={30}
                  // width={60}
                  x={30}
                  y={140}
                  // opacity={0.5}
                  text={'未开始'}
                  fontSize={12}
                  verticalAlign="middle"
                // align="middle"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={165}
                  opacity={0.5}
                  text={'开始时间'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={200}
                  // opacity={0.5}
                  text={'2024年10月7日'}
                  fontSize={12}
                />

                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={210}
                  opacity={0.5}
                  text={'结束时间'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={245}
                  // opacity={0.5}
                  text={'2024年10月7日'}
                  fontSize={12}
                />

              </Group>

              <Group name="column_item" y={550} width={232}>
                <Rect
                  x={0}
                  y={0}
                  width={232}
                  height={300}
                  fill="white" // 矩形的填充颜色
                  // stroke="rgba(0, 0, 0, 0.12)" // 边框颜色，使用 RGBA
                  stroke={'rgba(0, 0, 0, 0.41)'}
                  strokeWidth={0.2} // 边框宽度
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  text={'商品详情页设计'}
                  fontSize={13}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={30}
                  opacity={0.5}
                  text={'需求概览'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />

                <Rect
                  x={20}
                  y={70}
                  fill={'#d6e5ff'}
                  width={60}
                  height={30}
                  //  圆角
                  cornerRadius={3}
                />
                <Text
                  height={30}
                  // width={60}
                  x={30}
                  y={70}
                  // opacity={0.5}
                  text={'美工B'}
                  fontSize={12}
                  verticalAlign="middle"
                // align="middle"
                />

                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={100}
                  opacity={0.5}
                  text={'进行中'}
                  fontSize={10}
                  // fontStyle="bold #FFF"

                  verticalAlign="middle"
                  align="left"
                />
                <Rect
                  x={20}
                  y={140}
                  fill={'red'}
                  width={60}
                  height={30}
                  //  圆角
                  cornerRadius={3}
                />
                <Text
                  height={30}
                  // width={60}
                  x={30}
                  y={140}
                  // opacity={0.5}
                  text={'未开始'}
                  fontSize={12}
                  fill={'#FFF'}
                  verticalAlign="middle"
                // align="middle"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={165}
                  opacity={0.5}
                  text={'开始时间'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={200}
                  // opacity={0.5}
                  text={'2024年10月7日'}
                  fontSize={12}
                />

                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={210}
                  opacity={0.5}
                  text={'结束时间'}
                  fontSize={10}
                  verticalAlign="middle"
                  align="left"
                />
                <Text
                  height={44}
                  // width={60}
                  x={20}
                  y={245}
                  // opacity={0.5}
                  text={'2024年10月7日'}
                  fontSize={12}
                />

              </Group>
            </Group>
            <Header id={'456'} store={store} />
          </Group>
        </Layer>
        <Layer
          name="controls-layer"
          width={600}
          visible={true}
        />
      </Stage>
    </>
  )
});


function Header({ store, id }: any) {
  return (
    <>
      <Rect
        x={0}
        y={0}
        fill={'#F3F5F7'}
        width={235}
        height={30}
        // scale={{ x: 1.2, y: 1.2 }}
        //  圆角
        cornerRadius={3}
      />
      <Rect
        x={5}
        y={9}
        // fill={'#f3e096'}
        width={40}
        height={20}
        fill={'rgb(172, 226, 197)'}
        //  圆角
        cornerRadius={3}
      />
      <Text
        // height={44}
        width={60}
        x={12}
        y={13}
        onMouseDown={(event) => {
          event.cancelBubble = true
          store.handleMouseDown(id);
        }}
        // onMouseDown={(event) => {
        //   event.cancelBubble = true
        // }}
        fontStyle="bold" // 设置为加粗
        text={'P1'}
        fontSize={15}
        verticalAlign="middle"
        align="left"
      />
      <Text
        x={60}
        height={44}
        width={40}
        text={'4项'}
        fontSize={12}
        opacity={0.6}
        verticalAlign="middle"
        align="center"

      />
    </>
  )
}
