import { ItemProps } from "../model"
import { Layer as LayerRef } from 'konva/lib/Layer'
import { IRect, Vector2d } from 'konva/lib/types'
import { Shape, ShapeConfig } from "konva/lib/Shape"
import { Group as typeGroup } from 'konva/lib/Group'
import { Shape as typeShape } from 'konva/lib/Shape'
import Konva from "konva"
import { framesync } from "@/utils/Ainmation"
import { DataManagement } from "./DataManagement"
import { makeAutoObservable, observable, IObservableArray, toJS } from "mobx"
import { Item } from "./Operation"
import { RowIndexCalculator } from "../../common/RowIndexCalculator"
import { debounce } from "@/utils/debounce"

const calculator = new RowIndexCalculator();

export class StageManager {
  verticalScrollRef!: Konva.Rect
  wheelingRef!: number | null
  horizontalScrollRef!: null | any
  stageRef: Konva.Stage | null = null;
  LayerRef: LayerRef | null = null;
  scrollTop = 0;
  scrollHeight = 0
  scrollWidth = 0
  horizontalX = 0;
  //  画布宽度
  width!: number
  //  画布高度
  height!: number

  /**
   * 行高
   */
  rowHeight = 285
  /**
   * 暂定
   */
  scrollLeft = 0;
  /**
   * 上一次鼠标 Y 坐标 鼠标移动时判断是向上移动还是向下
   */
  lastY = 0;
  /**
   * 是否处于拖动状态
   */
  isDragging = false;
  /**
   * 当前拖拽元素的 Rect
   */
  draggerRect: ItemProps | null = null;
  /**
   * 是否处于滚动动画中
   */
  isInAnimationFrame = false;
  /**
   * 卡片数量
   */
  cards = 0;
  /**
   * 界面展示的 items
   */
  showItems = observable.array<Required<Item>>();
  cloneItems = observable.array<Required<Item>>();
  /**
   * 行的数量
   */
  rowLength = 0;
  /**
   * 最佳展示的卡片宽度
   */
  finalWidth = 0;
  /**
   * 通过 可视区域宽度 / 最佳展示的卡片宽度 得出列的数量
   */
  optimalCount = 0;
  /**
   * 拖动中卡片 的位置信息
   */
  cloneCardGroupPosition = { x: 0, y: 0 }

  /**
   * 点击命中的元素
   */
  groupRef = {
    targetRect: null,
    target: null
  } as {
    targetRect: IRect & { point: Vector2d } & Partial<{ oldX: number, oldY: number }> | null,
    target: Shape<ShapeConfig> | typeShape | null
  }
  /**
   * 拖动位置高亮线
   */
  dragingHighlightLine = { x: 0, y: 0 }
  /**
   * 边距
   */
  PADDING = 10;
  /**
   * 可视区域的高度
   */
  VIEWPORT_HEIGHT = 600;
  /**
   * 画布的高度
   */
  CANVAS_HEIGHT = 0;
  /**
   * 横坐标滚动方向
   */
  horizontalScrollDirection: 'bottom' | 'top' | 'none' = 'none';
  /**
   * 滚动步长
   */
  step: number = 5
  /**
   * 卡片最小宽度
   */
  cardMinWidth = 250
  /**
   * 卡片最大宽度
   */
  cardMaxWidth = 325;
  debouncedResize: () => void = () => { }
  constructor(private readonly dataManager: DataManagement) {
    //  观察 items 更新列表渲染
    // autorun(() => {
    //   const items = this.dataManager.items;
    //   this.cloneItems = items as IObservableArray<Required<Item>>
    //   console.log('itemsitems', toJS(items));
    // })

    // if (autofit) {
    //   this.columnCount = Math.floor(StageWidth / this.columnWidth())
    //   this.rowCount = Math.floor(StageHeight / this.rowHeight())
    // }
    this.width = window.innerWidth - 232;
    this.height = window.innerHeight
    this.VIEWPORT_HEIGHT = this.height;
    this.cards = 134;
    const minWidth = 250;
    const maxWidth = 325;

    const { finalWidth, optimalCount } = this.calculateOptimalCardCount(
      this.width,
      minWidth,
      maxWidth
    );

    this.finalWidth = finalWidth;
    this.optimalCount = optimalCount

    this.rowLength = Math.ceil(this.cards / optimalCount);
    // 画布的总高度
    this.CANVAS_HEIGHT = (this.rowLength * this.rowHeight + this.rowLength * this.PADDING);

    makeAutoObservable(this, {
      debouncedResize: false
    });

    this.debouncedResize = debounce(this.render.bind(this), 100);
  }


  getYCoordinate(rowIndex: number) {
    return rowIndex * this.rowHeight + this.PADDING;
  }

  getStartRow(scrollTop: number) {
    const rowHeight = this.rowHeight;
    const effectiveRowHeight = rowHeight + this.PADDING; // 每行的有效高度
    const startRow = Math.floor(scrollTop / effectiveRowHeight); // 计算起点行号
    return startRow;
  }

  getEndRow(scrollTop: number) {
    const rowHeight = this.rowHeight;
    const effectiveRowHeight = rowHeight + this.PADDING; // 每行的有效高度
    // 计算到达屏幕底部的滚动位置
    const endScrollTop = scrollTop + this.VIEWPORT_HEIGHT;
    // 计算结束行号
    const endRow = Math.floor(endScrollTop / effectiveRowHeight);
    return endRow; // 确保不超过总行数
  }


  ready() {

  }


  setScrollTop(scroll: number) {
    this.scrollTop = scroll;
    this.render();
  }

  resize() {
    window.addEventListener('resize', this.debouncedResize.bind(this));
    return () => {
      window.removeEventListener('resize', this.debouncedResize.bind(this));
    }
  }

  resizeCb() {
    this.width = window.innerWidth - 200;
    this.horizontalX = this.width - this.PADDING;
    // this.severalColumnsByRow()
  }

  //  当前宽度 一行可放置几列
  severalColumnsByRow(items: Item[]) {
    const stageWidth = this.width - 10;
    // 定义参数
    const minCardWidth = 250;
    const maxCardWidth = 325;

    // 调用函数计算最佳卡片数量和宽度
    const { finalWidth, optimalCount } = this.calculateOptimalCardCount(stageWidth, minCardWidth, maxCardWidth);
    console.log('result------', stageWidth, finalWidth, optimalCount);
    // this.rowCount
    // this.columnCount = optimalCount;
    // this.columnWidth = () => finalWidth;
    // this.rowCount = Math.ceil(items.length / optimalCount);
    // this.render();
  }

  calculateOptimalCardCount(
    canvasWidth: number,
    minCardWidth: number,
    maxCardWidth: number,
    margin = 10
  ) {
    let optimalCount = 0;
    let optimalWidth = 0;

    // 从最小宽度到最大宽度逐步计算
    for (let width = minCardWidth; width <= maxCardWidth; width++) {
      // 每个卡片的宽度加上边距
      const totalWidthWithMargin = width + margin;

      // 计算可以放下的卡片数量，需要减去左边距
      const count = Math.floor((canvasWidth + margin) / totalWidthWithMargin);

      // 如果当前宽度的卡片数量大于之前记录的最佳数量，更新最佳数量和宽度
      if (count > optimalCount && count > 0) {
        optimalCount = count;
        optimalWidth = width;
      }
    }
    // 计算剩余空间并均摊
    const totalUsedWidth = optimalCount * (optimalWidth + margin);
    const remainingSpace = canvasWidth - totalUsedWidth;
    // 每个卡片分配的额外宽度
    const additionalWidthPerCard = optimalCount > 0 ? remainingSpace / optimalCount : 0;
    // 计算新的卡片宽度
    const finalWidth = optimalWidth + additionalWidthPerCard;
    return { optimalCount, optimalWidth, finalWidth };
  }

  registerRefs({ stage, layer, verticalScroll, horizontalScroll }: {
    stage: Konva.Stage,
    layer: Konva.Layer,
    verticalScroll: Konva.Rect,
    horizontalScroll: Konva.Rect
  }) {
    this.stageRef = stage;
    this.LayerRef = layer;
    this.verticalScrollRef = verticalScroll;
    this.horizontalScrollRef = horizontalScroll;
    this.horizontalX = stage?.width() - this.PADDING
    this.render();
  }

  render() {
    const { finalWidth, optimalCount } = this;
    const starttime = performance.now();
    // 使用scrollTop来计算起始和结束行索引
    const { startRowIndex, endRowIndex } = calculator.getVisibleRowIndices({
      rowHeight: this.rowHeight,
      rowCount: this.rowLength,
      offset: this.scrollTop,
      containerHeight: this.height, // 假设有一个容器高度
    });

    // 处理边界情况
    if (endRowIndex >= this.rowLength || startRowIndex < 0) {
      return;
    }

    const items: Required<Item>[] = [];
    const nums = startRowIndex * optimalCount;

    // 渲染可见的卡片
    for (let i = startRowIndex; i <= endRowIndex; i++) {
      const yCoordinate = this.getYCoordinate(i);

      for (let j = 0; j < optimalCount; j++) {
        const xCoordinate = j * finalWidth;
        const currentCardCount = (i - startRowIndex) * optimalCount + j;

        // 检查当前卡片是否超出总卡片数量
        if (currentCardCount + nums < this.cards) {
          items.push({
            x: xCoordinate + 10,
            y: yCoordinate,
            width: finalWidth - 10,
            height: this.rowHeight - 10,
            key: `${i}:${j}`,
            rowIndex: i,
            columnIndex: j,
            title: '',
            description: '',
          });
        }
      }
    }
    const endtime = performance.now();
    console.log('渲染耗时:', (endtime - starttime) / 1000, '秒');
    this.showItems = items as IObservableArray<Required<Item>>;
  }

  // 计算滚动条的高度
  get calculateBarHeight() {
    const barHeight = (this.VIEWPORT_HEIGHT / this.CANVAS_HEIGHT) * this.VIEWPORT_HEIGHT; // 滚动条高度
    const height = Math.min(Math.max(barHeight, 20), this.VIEWPORT_HEIGHT); // 最小高度限制为 20
    return height;
  };

  get portalGroupVisible() {
    return !!(this.cloneCardGroupPosition.x && this.cloneCardGroupPosition.y)
  }

  get highlightLineVisible() {
    return !!(this.dragingHighlightLine.x && this.dragingHighlightLine.y)
  }

  handleMouseDown(event: Konva.KonvaEventObject<MouseEvent>): void {
    if (event.evt.button !== 0) {
      return;
    }

    const stage = event.target.getStage()!;
    const point = stage.getPointerPosition()!;
    const clientRect = event.target.parent!.getClientRect();

    this.groupRef = {
      targetRect: {
        ...clientRect,
        oldX: parseFloat((point.x - clientRect.x).toFixed(2)),
        oldY: parseFloat((point.y - clientRect.y).toFixed(2)),
        point
      },
      target: event.target.parent as any
    }
    this.lastY = point.y || event.evt.clientY; // 记录开始拖动时的 Y 坐标
    this.isDragging = true; // 设置为拖动状态
  };

  hoveRect = {} as Partial<{x : number, y : number,}>;
  handleMouseMove(event: any): void {
    if (!this.isDragging) {
      const pointer = event.target.getStage()?.getPointerPosition();
      const childrens = (this.LayerRef!.children[2] as any)?.children;

      // 如果没有子元素，直接返回
      if (!childrens?.length) {
        return;
      }

      let isHover = false;
      let templateRect = {} as any;

      for (let i = 0; i < childrens.length; i++) {
        const group = childrens[i];
        const rect = group.getClientRect();

        if (this.haveIntersection(rect, pointer, 10)) {
          // 当找到交集时，设置光标为指针
          window.document.body.style.cursor = 'pointer';
          isHover = true;

          // 只在找到交集时计算 templateRect
          templateRect = {
            ...rect,
            width: rect.width - 10,
            height: rect.height
          };
          break;
        }
      }
      // 设置光标为默认值，如果没有找到交集
      if (!isHover) {
        window.document.body.style.cursor = 'default';
        // this.hoveRect?.x && (this.hoveRect = {});
        this.hoveRect = {}
        return;
      }
      //  有值
      // !this.hoveRect?.x && (this.hoveRect = templateRect)
      this.hoveRect = templateRect
      return;
    }

    const stage = event.target.getStage()!;
    const point = stage.getPointerPosition()!;

    if (!this.draggerRect) {
      this.cloneDraggerRect();
      document.body.style.cursor = 'grabbing';
    }
    const currentY = point.y; // 记录开始拖动时的 Y 坐标
    //  向上拖动
    if (point.y - this.lastY < 0) {
      if (point.y <= 10 && !this.isInAnimationFrame) {
        this.requestFrameScroll('top');
      }
      this.horizontalScrollDirection = 'top';
    } else {
      // 向下拖动
      if (point.y >= this.height - 10 && !this.isInAnimationFrame) {
        this.requestFrameScroll('bottom');
      }
      this.horizontalScrollDirection = 'bottom';
    }
    this.lastY = currentY;
    const rect = this.groupRef.targetRect;
    //  卡片原型
    this.cloneCardGroupPosition = {
      x: rect!.x + (point.x - rect!.x) - (rect?.point.x! - rect!.x) - 10,
      y: rect!.y + (point.y - rect!.y) - (rect?.point.y! - rect!.y) - 10,
    }

    //  计算拖动位置与哪一个 group 相交
    const pointer = event.target.getStage()?.getPointerPosition();
    (this.LayerRef!.children[2] as any).children.forEach((group: typeGroup, i: number) => {
      const rect = group.getClientRect();
      if (this.haveIntersection(rect, pointer)) {
        //  origin group === current drag group
        if (group.attrs.id === this.groupRef?.target!.attrs.id) {
          this.dragingHighlightLine = { x: 0, y: 0 };
          return;
        }

        // 判断相交的group 在相对于拖动源的哪个方向 （左 ｜ 右）
        const target = this.groupRef?.targetRect!
        let x = 0;
        //  同一行
        if (target.y === rect.y) {
          x = rect.x < this.groupRef?.targetRect!.x ? rect.x : rect.x + rect.width - 10;
        } else {
          // 获取相交元素的中心点
          const rectCenterX = rect.x + rect.width / 2;
          // 判断当前拖动坐标是否超过了相交元素的一半
          if (pointer.x > rectCenterX) {
            x = rect.x + rect.width - 10;
          } else {
            x = rect.x;
          }
        }
        this.dragingHighlightLine = {
          x,
          y: rect.y
        }
      }
    });
  }


  private requestFrameScroll(scrollType: 'top' | 'bottom'): void {
    this.isInAnimationFrame = true;
    const { start, stop } = framesync(() => {
      const deltaY = 10;
      const step = scrollType === 'top' ? -(this.step) : this.step; // 每次滚动的步长
      const newScrollTop = Math.max(0, Math.min((this.scrollTop) + (deltaY > 0 ? step : -step), this.CANVAS_HEIGHT - this.VIEWPORT_HEIGHT));
      //  更新视图
      this.setScrollTop(newScrollTop);
      const availableHeight = this.stageRef!.height() - this.PADDING * 2 - this.calculateBarHeight;
      const barY = this.PADDING + (newScrollTop / (this.CANVAS_HEIGHT - this.VIEWPORT_HEIGHT)) * availableHeight;
      //  更新纵向 Rect 滚动条位置
      this.horizontalScrollRef?.y(barY);

      //  滚动方向变化
      if (this.horizontalScrollDirection !== scrollType) {
        this.isInAnimationFrame = false;
        stop?.();
        return;
      }
      //  滚动到底
      const bottom = this.CANVAS_HEIGHT - this.VIEWPORT_HEIGHT === newScrollTop
      if (bottom || newScrollTop === 0) {
        this.isInAnimationFrame = false;
        stop?.();
        return;
      }
    })
    start();
  }

  cloneDraggerRect(): void {
    const groupid = this.groupRef.target?.attrs.id;
    const group = this.showItems.find((group) => group.key === groupid) as ItemProps;
    if (!group) {
      return;
    }

    this.draggerRect = Object.assign({},
      { ...group, x: 10, y: 10, rowIndex: 10000, columnIndex: 100000 })
  }


  stageMouseup(): void {
    this.isDragging = false;
    this.groupRef = {
      targetRect: null,
      target: null
    }
    this.draggerRect = null;
    this.cloneCardGroupPosition = { x: 0, y: 0 }
    this.horizontalScrollDirection = 'none';
    // 设置全局鼠标为抓手
    // document.body.style.cursor = 'pointer';
  };

  get isShowScrollRect(): boolean {
    return this.calculateBarHeight !== this.VIEWPORT_HEIGHT
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

}



