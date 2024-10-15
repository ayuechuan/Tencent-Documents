import { haveIntersection } from "@/utils";
import Konva from "konva";
import { KonvaEventObject, NodeConfig ,Node } from "konva/lib/Node";
import { IRect, Vector2d } from "konva/lib/types";
import { makeAutoObservable, observable } from "mobx";

export interface ISeat {
  key: string;
  occupied: boolean;
}

export class ConferenceStore {

  layer: Konva.Layer | null = null;
  stage: Konva.Stage | null = null;

  //  会议桌的相对位置
  tableX = 100;
  tableY = 100;
  //  座位间距
  spacing = 20;
  //  根据桌子的宽高 生成可容纳的所有座位 
  allSeats = [] as { key: string; occupied: boolean; }[];
  //  图层是否可拖动
  draggable = false;
  //  座位大小
  imageSize = 60;
  //  会议桌宽度
  tableWidth = 800;
  //  会议桌高度
  tableHeight = 300;
  //  是否正在拖拽 新增座位
  isDropingAddSeat = false;
  //  座位是否移动中
  isSeatMoving = false;
  moveingSourceGroup = null as { x: number, y: number, name: string } | any;
  moveingTargetGroup = null as { x: number, y: number, name: string } | any;
  moveingSeat: null | { x: number, y: number } = null;
  //  点击座位时 鼠标坐标相对座位的坐标  用于拖动中减去这段距离
  oldRect: any = {};
  //  已占用座位
  occupiedSeats = [
    { key: 'top-2', occupied: true },
    { key: 'top-5', occupied: true },
    { key: 'bottom-3', occupied: true },
    { key: 'left-1', occupied: true },
    { key: 'left-5', occupied: true },
    { key: 'right-1', occupied: true },
    { key: 'top-10', occupied: true },
    { key: 'top-12', occupied: true },
    { key: 'top-13', occupied: true },
    { key: 'top-14', occupied: true },
  ] as ISeat[];
  //  未占用座位
  unoccupiedSeats = observable.array([]) as ISeat[];
  cache = new Map<string, {}>();
  highlight = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  getCacheValue(key: string) {
    return this.cache.get(key)
  }

  get imagesVerSide() {
    return Math.floor(this.tableWidth / (this.imageSize + this.spacing)); // 根据桌子的宽度动态计算
  }
  get imagesHorSize() {
    return Math.floor(this.tableHeight / (this.imageSize + this.spacing)); // 根据桌子的高度动态计算
  }

  toggleDraggable() {
    this.draggable = !this.draggable;
  }

  // 计算出所有的座位
  getSeats() {
    const { imagesVerSide, imagesHorSize } = this;
    const allSeats: ISeat[] = [];
    // 得到横排所有座位
    for (let i = 0; i < imagesVerSide; i++) {
      allSeats.push(
        { key: 'top-' + i, occupied: false },
        { key: 'bottom-' + i, occupied: false }
      )
    }
    // 得到竖排所有座位
    for (let i = 0; i < imagesHorSize; i++) {
      allSeats.push(
        { key: 'left-' + i, occupied: false },
        { key: 'right-' + i, occupied: false }
      );
    }
    this.allSeats = allSeats;
  }

  getUnoccupiedSeats() {
    // 找出未占用的座位
    return this.allSeats.filter(pos =>
      !this.occupiedSeats.some(occupied =>
        occupied.key === pos.key
      )
    );
  }

  getPositionLength(position: 'top' | 'bottom' | 'left' | 'right') {
    if (position === 'top' || position === 'bottom') {
      return this.allSeats.filter((seat) => seat.key.includes('top')).length;
    }
    return this.allSeats.filter((seat) => seat.key.includes('left')).length;
  }

  add(seat: { key: string; occupied: boolean; }) {
    this.occupiedSeats.push(seat);
    const [position, index] = seat.key.split('-');
    const length = this.getPositionLength(position as any);

    if (length - 1 === Number(index)) {
      //  加一个座位
      if (position === 'top' || position === 'bottom') {
        this.tableWidth = this.tableWidth + this.imageSize + this.spacing;
      } else {
        this.tableHeight = this.tableHeight + + this.imageSize + this.spacing;
      }

    }
    this.getSeats();
    this.unoccupiedSeats = this.getUnoccupiedSeats();
  }

  constructor() {
    makeAutoObservable(this, {
      cache: false,
      layer: false
    });
    this.ready();
  }


  ready() {
    // 存储座位的最大索引
    let maxTop = 0;
    let maxBottom = 0;
    let maxLeft = 0;
    let maxRight = 0;

    // 解析 occupiedSeats 来找到最大索引
    this.occupiedSeats.forEach(seat => {
      const [position, index] = seat.key.split('-');
      const idx = parseInt(index, 10);

      if (seat.occupied) {
        switch (position) {
          case 'top':
            maxTop = Math.max(maxTop, idx);
            break;
          case 'bottom':
            maxBottom = Math.max(maxBottom, idx);
            break;
          case 'left':
            maxLeft = Math.max(maxLeft, idx);
            break;
          case 'right':
            maxRight = Math.max(maxRight, idx);
            break;
        }
      }
    });

    const xMax = Math.max(maxTop, maxBottom) + 1;
    const yMax = Math.max(maxLeft, maxRight) + 1;

    this.tableWidth = Math.max(xMax * this.imageSize + xMax * this.spacing, this.tableWidth);
    this.tableHeight = Math.max(yMax * this.imageSize + yMax * this.spacing, this.tableHeight);

    this.getSeats();
    this.unoccupiedSeats = this.getUnoccupiedSeats();
  }

  changeHighlight(rect: IRect) {
    if (rect.width && this.highlight.width) {
      return;
    }

    if (rect.height && this.highlight.height) {
      return;
    }

    if (!rect.width && !this.highlight.width) {
      return;
    }

    if (!rect.height && !this.highlight.height) {
      return;
    }

    this.highlight = rect;
  }


  toggleDrop(isDrag: boolean) {
    this.isDropingAddSeat = isDrag;
  }

  onMouseDown() {
    if (this.draggable) {
      return;
    }
    this.isSeatMoving = true;
    const shape = this.getPointer('.occupiedSeats')!;
    if (!shape) {
      return;
    }
    const { group, pointer } = shape;
    const rect = group.getClientRect();

    const scale = this.stage?.scaleX()!
    this.oldRect = {
      x: (pointer?.x! - rect?.x) / scale,
      y: (pointer?.y! - rect?.y) / scale
    };
  }

  templatSeatMap = new Map<string, { pointer: Vector2d; group: Konva.Group; } | undefined>([
    ['occupiedSeats', undefined],
    ['freeSeats', undefined],
  ])

  onmouseMove() {
    if (!this.isSeatMoving) {
      return;
    }

    if (!this.moveingSourceGroup) {
      //  拖动抓手中
      this.stage!.container()!.style.cursor = 'grabbing';
      if (!this.templatSeatMap.get('occupiedSeats')) {
        this.templatSeatMap.set('occupiedSeats', this.getPointer('.occupiedSeats'))
      }
      const rectOccupiedSeats = this.templatSeatMap.get('occupiedSeats');
      if (!rectOccupiedSeats) {
        this.isSeatMoving = false;
        return;
      }

      if (rectOccupiedSeats) {
        this.isSeatMoving = true;
        this.moveingSourceGroup = {
          name: rectOccupiedSeats.group.attrs.id,
          ...this.cache.get(rectOccupiedSeats.group.attrs.id)! as any
        }
      }
    }

    const rect = this.getPointer('.freeSeats')
    const pointer = this.stage?.getPointerPosition()!;

    this.moveingSeat = {
      ...this.moveingSourceGroup,
      x: (pointer.x - this.oldRect.x) / this.stage?.scaleX()!,
      y: (pointer.y - this.oldRect.y) / this.stage?.scaleY()!,
    };

    if (!rect) {
      this.moveingTargetGroup = null;
      return;
    }
    //  查询到目标
    const name = rect.group.children[0].attrs.name;
    this.moveingTargetGroup = {
      name,
      ...this.cache.get(name)! as any
    }
  }

  onMouseUp() {
    this.isDropingAddSeat = false;
    this.stage!.container()!.style.cursor = 'default';
    //  处理 移动座位结束的逻辑
    if (this.moveingTargetGroup) {
      if (this.moveingTargetGroup?.name === this.moveingSourceGroup!.name) {
        this.clearStatus();
        return;
      }
      //  找到移走的座位
      const index = this.occupiedSeats.findIndex((seat) => seat.key === this.moveingSourceGroup!.name);
      this.occupiedSeats.splice(
        index,
        1,
        { key: (this.moveingTargetGroup as any)!.name, occupied: true }
      );
      //  重新计算空闲座位
      this.unoccupiedSeats = this.getUnoccupiedSeats();
    }
    this.clearStatus();
  }

  //  空闲座位的 Group 是否显示
  get unoccupiedSeatGroupVisible() {
    return this.isDropingAddSeat || this.moveingSourceGroup !== null;
  }

  clearStatus() {
    this.isSeatMoving = false;
    this.moveingSourceGroup = null;
    this.moveingSeat = null;
    this.templatSeatMap.set('occupiedSeats', undefined);
    this.moveingTargetGroup = null;
  }


  getPointer(key: string) {
    const groups = this.layer!.find(key)!;
    const pointer = this.stage!.getPointerPosition()!;
    for (let index = 0; index < groups.length; index++) {
      const group = groups[index] as Konva.Group;
      const rect = group.getClientRect();
      if (haveIntersection(rect, pointer)) {
        return {
          pointer,
          group
        }
      }
    }
  }

  // 获取某个座位的坐标
  getSeatCoordinates(key: string) {
    const { tableHeight, tableWidth, imageSize, spacing } = this;
    const parts = key.split('-');
    // top, bottom, left 或 right
    const position = parts[0];     
    // 获取座位索引
    const index = parseInt(parts[1]); 
    // 计算座位的坐标
    let x, y;
    //  座位旋转角度
    let rotation = 0;
    let offsetY = 0;
    let offsetX = 0; 

    if (position === 'top') {
      x = (imageSize + spacing) * index;
      y = -imageSize;
    } else if (position === 'bottom') {
      x = (imageSize + spacing) * index; // 计算X坐标
      y = tableHeight;
      rotation = 180;
      offsetY = this.imageSize;
      offsetX = this.imageSize;
    } else if (position === 'left') {
      // 计算左侧座位的坐标
      x = -imageSize;
      y = (imageSize * index) + (spacing * (index + 1));
      rotation = -90
      offsetY = 0
      offsetX = this.imageSize
    } else if (position === 'right') {
      // 计算右侧座位的坐标
      x = tableWidth;
      y = (imageSize * index) + (spacing * (index + 1));
      rotation = 90;
      offsetY = this.imageSize
      offsetX = 0
    } else {
      throw new Error('Invalid seat position');
    }
    return { x, y, rotation, offsetY, offsetX };
  }
}
