import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { haveIntersection } from "@/utils";
import { v4 as uuid } from 'uuid';
// import { Lunar } from "lunar-typescript";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { SolarDay } from 'tyme4ts';


export interface KonvaCalendarConfig {
  //  模式  可读 ｜ 可修改 ( 影响拖动是否可修改日期 )
  mode: 'read' | 'edit';
  //  挂载节点
  container: string;
  //  日历表 宽高
  width?: number;
  height?: number;
  //  初始时间
  initDate?: Date | 'string';
  //  添加任务 btn
  isAddTaskBtn?: boolean
}

export interface Range {
  startTime: string;
  endTime: string;
  fill: string;
  description: string;
  id: string;
}

export interface DragRect {
  differenceX: number;
  differenceY: number;
  sourceX: number;
  sourceY: number;
  startX: number;
  startY: number;
  targetGroup: null | Konva.Group;
}

/**
 * @example
    const element = document.getElementsByClassName('.calendar-root')[0]!;
    const bootstrap = new CanvasKonvaCalendar({ 
      mode: 'edit', 
      container: '.smart-table-root',
      width : element.clientWidth || innerWidth - 240
     })
    
    bootstrap.setData([
    {
       startTime: '2024-10-01',
       endTime: '2024-10-20',
       fill: 'rgba(0, 0, 255, 0.3)',
       description: '3 ',
       id: uuid()
     },
    ])
    bootstrap.on('ADDTASKRANGE', (day: string) => {
      console.log('添加任务', day);
    })
    bootstrap.on('CLICKRANGE', (day: string) => {
      console.log('选择日期', day);
    })
    bootstrap.on('CONTEXTMENU', (day: string) => {
      console.log('右键', day);
    })
    bootstrap.on('UPDATETASK', (source: any) => {
      console.log('任务更新', source);
    })
    bootstrap.on('CLICKSURPASSTIP', (day: string) => {
      console.log('查看所有选项', day);
    })
 */
export class CanvasKonvaCalendar {
  static readonly daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周天'];
  //  渲染日历 layer ( 节点稳定 性能损失较小 )
  private readonly layer: Konva.Layer;
  //  用户交互 layer ( 节点变更频繁 )
  private readonly featureLayer: Konva.Layer;
  //  画布
  private readonly stage: Konva.Stage;
  //  horve group 实例
  private hoverGroup!: Konva.Group;
  private readonly cellWidth: number;
  private readonly cellHeight: number;
  //  x轴绘制起点
  private readonly startX = 20;
  private readonly emitter = new CalendarEvent();

  private hoverRect = { x: 0, y: 0, id: '' }
  //  渲染任务进度的数据源
  taskRanges = [
    // {
    //   startTime: '2024-10-01',
    //   endTime: '2024-10-20',
    //   fill: 'rgba(0, 0, 255, 0.3)',
    //   description: '3 ',
    //   id: uuid()
    // },
    {
      startTime: '2024-10-04',
      endTime: '2024-10-05',
      fill: 'pink',
      description: '2 ',
      id: uuid()
    },
    {
      startTime: '2024-10-10',
      endTime: '2024-10-12',
      fill: '#caeadb',
      description: '4',
      id: uuid()
    },
    {
      startTime: '2024-10-04',
      endTime: '2024-10-04',
      fill: 'rgba(214,241,255,0.6)',
      description: '555',
      id: uuid()
    },
    {
      startTime: '2024-09-30',
      endTime: '2024-09-30',
      fill: 'rgba(49, 116, 173,0.8)',
      description: '1',
      id: uuid()
    },
    // {
    //   startTime: '2024-10-01',
    //   endTime: '2024-10-20',
    //   fill: '#fff5cc',
    //   description: '1',
    //   id: uuid()
    // },
    // {
    //   startTime: '2024-10-04',
    //   endTime: '2024-10-05',
    //   fill: 'pink',
    //   description: '2 ',
    //   id: uuid()
    // },
    // {
    //   startTime: '2024-10-01',
    //   endTime: '2024-10-20',
    //   fill: 'rgba(0, 0, 255, 0.3)',
    //   description: '3 ',
    //   id: uuid()
    // },
    // {
    //   startTime: '2024-10-10',
    //   endTime: '2024-10-12',
    //   fill: '#caeadb',
    //   description: '4',
    //   id: uuid()
    // },
    // {
    //   startTime: '2024-10-05',
    //   endTime: '2024-10-05',
    //   fill: 'rgba(214,241,255,0.6)',
    //   description: '666',
    //   id: uuid()
    // },
    // {
    //   startTime: '2024-10-05',
    //   endTime: '2024-10-05',
    //   fill: 'rgba(214,241,255,0.6)',
    //   description: '不敢说话',
    //   id: uuid()
    // },
    // {
    //   startTime: '2024-10-05',
    //   endTime: '2024-10-05',
    //   fill: 'rgba(214,241,255,0.6)',
    //   description: '说错了挨打',
    //   id: uuid()
    // },
    // {
    //   startTime: '2024-10-03',
    //   endTime: '2024-10-05',
    //   fill: 'rgba(214,241,255,0.6)',
    //   description: '辞退',
    //   id: uuid()
    // },
    // {
    //   startTime: '2024-10-22',
    //   endTime: '2024-10-23',
    //   fill: 'rgba(214,241,255,0.6)',
    //   description: '吃早饭',
    //   id: uuid()
    // },
    // {
    //   startTime: '2024-10-23',
    //   endTime: '2024-10-24',
    //   fill: 'pink',
    //   description: '吃午饭',
    //   id: uuid()
    // },
    // {
    //   startTime: '2024-09-30',
    //   endTime: '2024-10-01',
    //   fill: 'rgba(255, 0, 0, 0.5)',
    //   description: '吃干饭',
    //   id: uuid()
    // },
    // {
    //   startTime: '2024-10-23',
    //   endTime: '2024-10-26',
    //   fill: 'rgba(255, 0, 0, 0.5)',
    //   description: '吃晚饭',
    //   id: uuid()
    // },
    ...[
      {
        startTime: '2024-09-30',
        endTime: '2024-09-30',
        fill: 'rgba(49, 116, 173,0.8)',
        description: '1',
        id: uuid()
      },
      // {
      //   startTime: '2024-10-01',
      //   endTime: '2024-10-20',
      //   fill: '#fff5cc',
      //   description: '1',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-04',
      //   endTime: '2024-10-05',
      //   fill: 'pink',
      //   description: '2 ',
      //   id: uuid()
      // },
      {
        startTime: '2024-10-01',
        endTime: '2024-10-20',
        fill: 'rgba(0, 0, 255, 0.3)',
        description: '3 ',
        id: uuid()
      },
      {
        startTime: '2024-10-10',
        endTime: '2024-10-12',
        fill: '#caeadb',
        description: '4',
        id: uuid()
      },
      {
        startTime: '2024-10-04',
        endTime: '2024-10-04',
        fill: 'rgba(214,241,255,0.6)',
        description: '555',
        id: uuid()
      },
      // {
      //   startTime: '2024-10-11',
      //   endTime: '2024-10-11',
      //   fill: 'rgba(214,241,255,0.6)',
      //   description: '辞退',
      //   id: uuid()
      // },
      {
        startTime: '2024-10-22',
        endTime: '2024-10-23',
        fill: 'rgba(214,241,255,0.6)',
        description: '吃早饭',
        id: uuid()
      },
      {
        startTime: '2024-10-23',
        endTime: '2024-10-24',
        fill: 'pink',
        description: '吃午饭',
        id: uuid()
      },
      {
        startTime: '2024-09-30',
        endTime: '2024-10-01',
        fill: 'rgba(255, 0, 0, 0.5)',
        description: '吃干饭',
        id: uuid()
      },
      {
        startTime: '2024-10-23',
        endTime: '2024-10-26',
        fill: 'rgba(255, 0, 0, 0.5)',
        description: '吃晚饭',
        id: uuid()
      },
    ]

  ];

  // 当前日期
  private date: Date = new Date();
  private stringDate!: string;
  private month!: number;
  private year!: number;

  //  记录 拖动任务group 一些坐标信息
  private recordsDragGroupRect: DragRect = {
    //  鼠标点击开始拖动位置与 range x 差值
    differenceX: 0,
    //  鼠标点击开始拖动位置与 range y 差值
    differenceY: 0,
    //  拖动源 原始值x
    sourceX: 0,
    //  拖动源 原始值y
    sourceY: 0,
    //  拖动源
    targetGroup: null,
    //  鼠标开始拖动位置
    startX: 0,
    //  鼠标开始拖动位置
    startY: 0
  }
  //  拖动 任务group实例
  private dragGroup: Konva.Group | null = null;
  private readonly stageHeight: number;
  private clickCurrentInfo: { x: number, y: number, id: string } = { x: 0, y: 0, id: '' };
  private element!: Element;

  constructor(
    private readonly config: KonvaCalendarConfig,
  ) {
    this.setContainer(config.container);
    this.stage = new Konva.Stage({
      width: Math.max(config.width || 0, 780),
      height: Math.max(config.height || 0, 730),
      x: 0,
      y: 0,
      container: config.container
    });
    this.layer = new Konva.Layer({ name: 'static-layer' });
    this.featureLayer = new Konva.Layer({ name: 'dynamic-layer' });
    this.stage.add(this.layer, this.featureLayer);

    (this.stage.container().children[0] as HTMLDivElement).style.background = '#FFF';
    const { width, height } = this.stageRect;
    this.stageHeight = height;
    this.cellWidth = (width - 40) / 7;
    this.cellHeight = (height - 60 - 30) / 5;
    this.registerEvents();
    this.drawHoverGroup();
    this.drawCalendar(this.month, this.year);
    this.initDate();
    this.drawResize();
    // this.draw();



    // const layer = new Konva.Layer();
    // this.stage.add(layer);

    // // 甘特图任务数据
    // const tasks = [
    //   { name: 'Task 1', start: 0, duration: 3, color: '#3498db' },
    //   { name: 'Task 2', start: 2, duration: 5, color: '#e74c3c' },
    //   { name: 'Task 3', start: 4, duration: 2, color: '#2ecc71' },
    // ];

    // const taskHeight = 40;
    // const taskSpacing = 20;
    // const timeUnitWidth = 50;  // 每个时间单位的宽度
    // const chartOffsetY = 50;
    // const chartOffsetX = 100;

    // // 绘制任务条及可拖动的handle
    // tasks.forEach((task, index) => {
    //   const taskGroup = new Konva.Group({ draggable: false }); // 每个任务用一个组
    //   const rect = new Konva.Rect({
    //     x: chartOffsetX + task.start * timeUnitWidth,
    //     y: chartOffsetY + index * (taskHeight + taskSpacing),
    //     width: task.duration * timeUnitWidth,
    //     height: taskHeight,
    //     fill: task.color,
    //     cornerRadius: 5,
    //     // draggable : true

    //   });

    //   const group = new Konva.Group({
    //     x: rect.x() + rect.width() - 10,
    //     y: rect.y(),
    //     visible: false, // 初始隐藏handle
    //     draggable: true,
    //     dragBoundFunc: function (pos) {
    //       const newX = Math.max(pos.x, rect.x() + 10); // 保证handle不会拖得太小
    //       return { x: newX, y: this.absolutePosition().y };
    //       // 保证handle不会被拖动到任务条的左侧，也不会超出任务条
    //       //  const newX = Math.max(pos.x, rect.x() + 10);
    //       //  const maxX = rect.x() + rect.width() - 10;  // 不能超过任务条的右边内侧
    //       //  return { x: Math.max(newX, maxX), y: this.absolutePosition().y };
    //     },
    //   });

    //   // 拖动handle，用于调整任务条宽度
    //   const handle = new Konva.Rect({
    //     // x: rect.x() + rect.width() - 10,
    //     // y: rect.y(),
    //     x: 0,
    //     y: 0,
    //     width: 10,
    //     height: taskHeight,
    //     fill: '#444',
    //     cornerRadius: [0, 3, 3, 0]
    //     // draggable: true,
    //     // visible: true, // 初始隐藏handle
    //     // dragBoundFunc: function (pos) {
    //     //   const newX = Math.max(pos.x, rect.x() + 10); // 保证handle不会拖得太小
    //     //   return { x: newX, y: this.absolutePosition().y };
    //     //    // 保证handle不会被拖动到任务条的左侧，也不会超出任务条
    //     //   //  const newX = Math.max(pos.x, rect.x() + 10);
    //     //   //  const maxX = rect.x() + rect.width() - 10;  // 不能超过任务条的右边内侧
    //     //   //  return { x: Math.max(newX, maxX), y: this.absolutePosition().y };
    //     // },

    //   });

    //   const gradientPattern = (context) => {
    //     const width = 20; // 每个单元的宽度
    //     for (let i = 0; i < 500; i += width) {
    //       context.fillStyle = (i % (2 * width) === 0) ? 'rgba(255, 255, 255, 0.15)' : 'transparent';
    //       context.fillRect(i, 0, width, 500);
    //     }
    //   };

    //   const background = new Konva.Shape({
    //     sceneFunc: (context, shape) => {
    //       gradientPattern(context);
    //       context.fillStrokeShape(shape);
    //     },
    //   });

    //   // 监听拖动事件，动态更新矩形宽度
    //   group.on('dragmove', () => {
    //     const newWidth = group.x() - rect.x() + 10;
    //     rect.width(newWidth);
    //     task.duration = Math.floor(newWidth / timeUnitWidth);  // 更新任务的持续时间
    //   });

    //   const lineRect = new Konva.Rect({
    //     x: 3,
    //     y: 5,
    //     width: 0.5,
    //     height: 28,
    //     fill: 'white',
    //     cornerRadius: [0, 3, 3, 0]
    //   });
    //   const lineRect2 = new Konva.Rect({
    //     x: 6,
    //     y: 3,
    //     width: 0.5,
    //     height: 33,
    //     fill: 'white',
    //     cornerRadius: [0, 3, 3, 0]
    //   });

    //   // 当拖动结束时，使用就近原则将 handle 对齐到最近的时间线
    //   group.on('dragend', () => {
    //     // // 获取 handle 的当前位置
    //     // const handleX = group.x();
    //     // // 计算最近的时间线
    //     // const closestGridX = Math.round(handleX / timeUnitWidth) * timeUnitWidth;
    //     // 获取 handle 的当前位置
    //     const handleX = group.x();
    //     // 计算最近的时间线，向上取整
    //     const closestGridX = Math.ceil(handleX / timeUnitWidth) * timeUnitWidth;


    //     // 更新 handle 位置并对齐
    //     group.x(closestGridX);
    //     // 根据 handle 位置更新任务条的宽度
    //     // const newWidth = handle.x() - rect.x();
    //     const newWidth = closestGridX - rect.x();
    //     group.x(closestGridX - 10);
    //     rect.width(newWidth);
    //     // 更新任务的持续时间
    //     task.duration = Math.floor(newWidth / timeUnitWidth);

    //   });

    //   // 当鼠标进入任务矩形时显示handle
    //   taskGroup.on('mouseenter', () => {
    //     group.setAttrs({
    //       visible: true,
    //       // x : rect.x() + rect.width() - 10
    //     })
    //     //  鼠标样式
    //     this.stage.container().style.cursor = 'ew-resize';
    //   });

    //   // 当鼠标离开任务矩形时隐藏handle
    //   taskGroup.on('mouseleave', () => {
    //     group.visible(false);
    //     this.stage.container().style.cursor = 'default';
    //   });

    //   // 添加任务名称
    //   const text = new Konva.Text({
    //     x: 10,
    //     y: chartOffsetY + index * (taskHeight + taskSpacing) + taskHeight / 2 - 10,
    //     text: task.name,
    //     fontSize: 18,
    //     fontFamily: 'Calibri',
    //     fill: '#333',
    //   });

    //   taskGroup.add(rect);
    //   // taskGroup.add(handle);
    //   group.add(handle,background, lineRect, lineRect2)
    //   taskGroup.add(group)
    //   layer.add(taskGroup, text);
    // });

    // // 绘制时间线
    // const timelineHeight = tasks.length * (taskHeight + taskSpacing) + chartOffsetY;
    // for (let i = 0; i < 10; i++) {  // 假设总共有 10 个时间单位
    //   const timeText = new Konva.Text({
    //     x: chartOffsetX + i * timeUnitWidth - 10,
    //     y: 10,
    //     text: i.toString(),
    //     fontSize: 16,
    //     fill: '#333',
    //   });
    //   layer.add(timeText);

    //   const line = new Konva.Line({
    //     points: [chartOffsetX + i * timeUnitWidth, chartOffsetY - 10, chartOffsetX + i * timeUnitWidth, timelineHeight],
    //     stroke: '#ccc',
    //     strokeWidth: 1,
    //   });

    //   layer.add(line);
    //   line.moveToBottom();
    // }




  }


  private initDate(date?: Date): void {
    this.date = new Date(date || this.config.initDate || new Date());
    this.stringDate = CanvasKonvaCalendar.formatDate(this.date);
    this.month = this.date.getMonth() + 1;
    this.year = this.date.getFullYear();
    if (this.month > 12) {
      this.month = 1;
      this.year = this.year + 1;
    }
  }

  private get box(): DOMRect {
    return this.element.getBoundingClientRect();
  }

  private setContainer(container: string): void {
    if (container.charAt(0) === '.') {
      const className = container.slice(1);
      this.element = document.getElementsByClassName(className)[0];
    } else {
      let id;
      if (container.charAt(0) !== '#') {
        id = container;
      } else {
        id = container.slice(1);
      }
      this.element = document.getElementById(id)!;
    }
  }

  private get container() {
    return this.stage.container();
  }

  downImage(config?: Parameters<Konva.Stage['toImage']>[number]): void {
    this.stage.toImage({
      pixelRatio: 2,
      callback: (image) => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = 'image.png';
        link.click();
      },
      ...config
    })
  }

  //  注册事件
  private registerEvents(): void {
    this.stage.on('click tap', (event: KonvaEventObject<MouseEvent, Stage>) => {
      if (event.evt.button === 2 || !this.clickCurrentInfo.id) return;
      this.emitter.emit('CLICKRANGE', this.clickCurrentInfo);
      this.clickCurrentInfo = { x: 0, y: 0, id: '' };
    })

    this.stage.on('mousedown touchstart', (event) => this.mousedown(event.evt));
    this.stage.on('mousemove touchmove', () => this.mousemoveHoveHighlight());
    this.stage.on('mousemove touchmove', () => this.dragMousemove())
    this.stage.on('mousemove touchmove', () => this.resizeTask())
    this.stage.on('mouseup touchend', () => this.mouseup())
    this.stage.on('mouseleave touchcancel', () => void this.hoverGroup.setAttr('visible', false))
    this.stage.on('contextmenu', (event) => this.contextMenu(event));
  }

  private currentid = '';
  private resizeGroup!: Konva.Group;
  private targetGroup!: Konva.Group;

  private resizeTask() {
    const result = this.findGroup(this.featureLayer, '.task-progress-group');
    if (!result) {
      if (this.resizeGroup.visible()) {
        this.resizeGroup.setAttr('visible', false);
        this.currentid = '';
      }
      return;
    }
    const { group, rect } = result;
    const { id, parentId } = group.attrs;
    if (id === this.currentid) {
      return;
    }
    this.currentid = id;
    this.resizeGroup.setAttrs({
      x: rect.x,
      y: rect.y,
      width: 20,
      height: rect.height,
      visible: true
    })
    this.resizeGroup.moveToTop();
  }
  private drawResize() {
    const resizeGroup = new Konva.Group({
      id: `resize-group-left`,
      visible: false
    });

    const resizeRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: 10,
      height: 20,
      fill: 'rgba(0,0,0,0.153)',
      cornerRadius: [3, 0, 0, 3]
    })

    const verticalLine = new Konva.Rect({
      x: 3,    // x 坐标
      y: 3,    // y 坐标
      width: 2, // 宽度
      height: 15, // 高度
      fill: 'rgba(255,255,255,0.7)', // 填充颜色
    });
    const verticalLineTwo = new Konva.Rect({
      x: 6,    // x 坐标
      y: 3,    // y 坐标
      width: 2, // 宽度
      height: 15, // 高度
      fill: 'rgba(255,255,255,0.7)', // 填充颜色
    });

    resizeGroup.add(resizeRect, verticalLine, verticalLineTwo);
    this.resizeGroup = resizeGroup;
    this.featureLayer.add(resizeGroup);

    resizeGroup.on('mousedown', (event) => {
      event.cancelBubble = true;
      event.evt.preventDefault();
      console.log('dddd', this.featureLayer.find(`#${this.currentid}`));

      this.targetGroup = this.featureLayer.find(`#${this.currentid}`)[0]! as Konva.Group;
      this.stage.on('mousemove', this.move.bind(this))
    })

    resizeGroup.on('mouseover', () => {
      this.container.style.cursor = 'ew-resize';
    })
    resizeGroup.on('mouseout', () => {
      this.container.style.cursor = 'default';
    })

    this.stage.on('mouseup', () => {
      console.log('解绑 ');

      this.stage.removeEventListener('mousemove')
    })

  }


  private move() {
    if (!this.targetGroup) {
      return;
    }
    const rect = this.stage.getPointerPosition();
    this.targetGroup.setAttrs({
      x: rect?.x! - this.targetGroup.x(),
      y: rect?.y! - this.targetGroup.y()
    })
    // this.targetGroup.moveToTop();
    console.log('====>>>', this.targetGroup);
  }

  private dragMousemoveResize() {

  }

  private contextMenu(event: KonvaEventObject<MouseEvent, Stage>): void {
    event.cancelBubble = true;
    event.evt.preventDefault();

    const result = this.findGroup(this.featureLayer, '.task-progress-group');
    if (!result) return;
    this.emitter.emit('CONTEXTMENU', {
      x: result.pointer.x,
      y: result.pointer.y,
      id: result.group.attrs.parentId
    })
  }

  private get stageRect() {
    return {
      width: this.stage.width(),
      height: this.stage.height()
    }
  }

  private mousedown(event: MouseEvent): void {
    const result = this.findGroup(this.featureLayer, '.task-progress-group');
    if (!result) return;
    this.clickCurrentInfo = {
      x: result.pointer.x,
      y: result.pointer.y,
      id: result.group.attrs.parentId
    }
    //  右键不能拖动
    if (event.button !== 0) return;
    //  只读模式 不能拖动
    if (this.config.mode === 'read') return;

    const { group, pointer, rect } = result;
    this.recordsDragGroupRect = {
      differenceX: pointer.x - rect.x,
      differenceY: pointer.y - rect.y,
      sourceX: rect.x,
      sourceY: rect.y,
      targetGroup: group,
      startX: pointer.x,
      startY: pointer.y
    }
  }

  private mousemoveHoveHighlight(): void {
    const result = this.findGroup(this.layer, '.dateCell');
    if (!result) {
      return;
    }

    const { group } = result;
    const newX = group.attrs.x!;
    const newY = group.attrs.y!;

    if (newX === this.hoverRect.x && newY === this.hoverRect.y) {
      if (!this.hoverGroup.isVisible()) {
        // this.hoverGroup.setZIndex(4)
        this.hoverGroup.moveToBottom();
        this.hoverGroup.setAttr('visible', true);
      }
      return;
    }
    this.hoverRect = { x: newX, y: newY, id: group.attrs.id }
    // this.hoverGroup.moveToTop();
    this.hoverGroup.setAttrs({ x: newX, y: newY, visible: true })
  }

  private dragMousemove(): void {
    if (this.config.mode === 'read') {
      return;
    }
    if (this.recordsDragGroupRect.differenceX === 0 && this.recordsDragGroupRect.differenceY === 0) {
      return;
    }
    //  拖动中
    if (!this.dragGroup) {
      this.dragGroup = this.recordsDragGroupRect.targetGroup!.clone();
      this.recordsDragGroupRect.targetGroup!.opacity(0.33);
      this.hoverGroup.children[0].setAttr('fill', 'rgba(237,244,255,0.8)');
      this.hoverGroup.moveToBottom();
      this.featureLayer.add(this.dragGroup);
    }

    const pointer = this.stage.getPointerPosition()!;
    this.dragGroup.setAttrs({
      x: pointer.x - this.recordsDragGroupRect.differenceX - this.recordsDragGroupRect.sourceX,
      y: pointer.y - this.recordsDragGroupRect.differenceY - this.recordsDragGroupRect.sourceY
    })
  }

  private mouseup(): void {
    if (this.config.mode === 'read') {
      return;
    }
    if (this.dragGroup) {
      //  拖动结束
      const sorceDate = this.findGroup(this.layer, '.dateCell', {
        x: this.recordsDragGroupRect.startX,
        y: this.recordsDragGroupRect.startY
      });
      const targetDate = this.findGroup(this.layer, '.dateCell');
      if (!targetDate || !sorceDate) {
        return;
      }
      const sorceDateId = sorceDate.group.attrs.id;
      const targetDateId = targetDate.group.attrs.id;

      const { day = 0, parentId } = this.recordsDragGroupRect.targetGroup?.attrs;
      const parent = this.taskRanges.find((item) => item.id === parentId);
      //  选择时间相同
      if (sorceDateId === targetDateId || parent!.startTime === targetDateId) {
        this.recordsDragGroupRect.targetGroup!.opacity(1);
      } else {
        const arratItem = this.taskRanges.findIndex((item) => item.id === parentId);
        if (arratItem >= 0) {
          const endTime = this.addDays(targetDateId, day);
          this.taskRanges[arratItem].startTime = targetDateId;
          this.taskRanges[arratItem].endTime = endTime;
          this.emitter.emit('UPDATETASK', {
            id: parentId,
            startTime: targetDateId,
            endTime: endTime
          })
          this.drawTaskProgress();
        }
      }
      this.dragGroup.remove();
    }
    this.recordsDragGroupRect = {
      differenceX: 0,
      differenceY: 0,
      sourceX: 0,
      sourceY: 0,
      startX: 0,
      startY: 0,
      targetGroup: null
    }
    this.dragGroup = null;
  }

  setData(ranges: Range | Range[]): this {
    // this.taskRanges = ranges instanceof Array ? ranges : [...this.taskRanges, ranges];
    // this.drawTaskProgress();
    return this;
  }

  on(key: EventType, callback: any): this {
    this.emitter.on(key, callback);
    return this;
  }

  destory() { }

  //  从基础日期 添加天数 得到新的日期
  private addDays(dateString: string, num: number): string {
    // 创建一个 Date 对象
    const date = new Date(dateString);
    // 将要增加的天数转换为毫秒（1天 = 24小时 = 24 * 60分钟 = 24 * 60 * 60秒 = 24 * 60 * 60 * 1000毫秒）
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    // 计算新的时间戳
    const newDate = new Date(date.getTime() + num * millisecondsPerDay);
    // 返回格式化后的新日期字符串
    return newDate.toISOString().split('T')[0]; // 格式为 YYYY-MM-DD
  }

  // 初始绘制
  private draw(): this {
    const now = performance.now();
    this.drawCalendar(this.month, this.year);
    this.drawHoverGroup();
    this.drawTaskProgress();
    return this;
  }

  // 下一个月
  nextMonth(): void {
    this.month++;
    if (this.month > 12) {
      this.month = 1;
      this.year++;
    }
    this.featureLayer.removeChildren();
    this.draw();
  }
  //  今天
  today(): void {
    this.initDate(new Date())
    this.draw();
  }
  //  上一个月
  prevMonth(): void {
    this.month--;
    if (this.month < 1) {
      this.month = 12;
      this.year--;
    }
    this.featureLayer.removeChildren();
    this.draw()
  }

  //  通过鼠标坐标 查找某个图层的元素
  private findGroup(
    layer: Konva.Layer,
    findkey: string,
    pointerParam?: Vector2d | null
  ) {
    const pointer = pointerParam || this.stage.getPointerPosition()!;
    const taskGroups = layer.find(findkey) as Konva.Group[];
    if (!taskGroups.length) {
      return;
    }
    for (let i = 0; i < taskGroups.length; i++) {
      const group = taskGroups[i];
      const rect = group.getClientRect();
      if (haveIntersection(rect, pointer)) {
        return { group, rect, pointer };
      }
    }
  }

  // 获取该月的第一天和最后一天
  private getDaysInMonth(month: number, year: number) {
    // 注意：JavaScript 中的月份是从 0 开始的，因此需要 -1
    const firstDay = new Date(year, month - 1, 1); // 月份从 0 开始
    const lastDay = new Date(year, month, 0);      // 传递下个月的第 0 天，表示本月的最后一天

    return {
      firstDay,                   // 本月的第一天
      lastDay,                    // 本月的最后一天
      daysInMonth: lastDay.getDate(),  // 获取当月的总天数
    };
  }


  private addMonth(lastMonthYear: number, lastMonth: number, num: number) {
    // 计算新的月份和年份
    let newMonth = lastMonth + num;
    let newYear = lastMonthYear;
    // 处理月份超出 12 的情况，进行年份进位或退位
    while (newMonth > 12) {
      newYear++;
      newMonth -= 12;
    }
    while (newMonth < 1) {
      newYear--;
      newMonth += 12;
    }
    // 格式化月份为两位数
    const monthString = newMonth < 10 ? `0${newMonth}` : `${newMonth}`;
    // 返回格式化的年月字符串
    return {
      stringDate: `${newYear}-${monthString}`,
      nonePadMonth: newMonth,
      month: monthString
    };
  }


  // 绘制日历
  private drawCalendar(month: number, year: number): void {
    // 清空图层
    this.layer.removeChildren();
    const { firstDay, daysInMonth } = this.getDaysInMonth(month, year);
    //  绘制当前显示的年份
    const headerGroup = new Konva.Group({ name: 'header' })
    const yearRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage.width(),
      height: 40,
      fill: 'white',
      strokeWidth: 1,
    });
    const yearText = new Konva.Text({
      x: 0,
      y: 10,
      text: `${year}年${month}月`,
      fontSize: 18,
      // fontFamily: 'Calibri',
      fontStyle: 'bold',
      width: 120,
      align: 'center',
    })
    headerGroup.add(yearRect, yearText);
    this.layer.add(headerGroup);

    // 绘制每个星期的标题
    CanvasKonvaCalendar.daysOfWeek.forEach((day, index) => {
      const backgroudRect = new Konva.Rect({
        x: index * this.cellWidth + this.startX,
        y: 40,
        width: this.cellWidth,
        height: 30,
        fill: 'white',
        strokeWidth: 1,
      })

      const text = new Konva.Text({
        x: index * this.cellWidth + this.startX,
        y: 50,
        text: day,
        fontSize: 12,
        // fontFamily: 'Calibri',
        fill: 'rgba(0,0,0,0.9)',
        width: this.cellWidth,
        align: 'center',
      });
      this.layer.add(backgroudRect, text);
    });
    // 计算偏移量
    const startOffset = (firstDay.getDay() + 6) % 7; // 计算偏移，周一为0
    const lastMonth = month === 0 ? 11 : month - 1;
    const lastMonthYear = month === 0 ? year - 1 : year;


    const { daysInMonth: lastDaysInMonth } = this.getDaysInMonth(lastMonth, lastMonthYear);
    // 渲染上一个月的日期
    for (let i = 0; i < startOffset; i++) {
      const day = lastDaysInMonth - startOffset + 1 + i; // 计算上一个月的日期
      const x = i * this.cellWidth + this.startX;
      // const id = `${lastMonthYear}-${lastMonth + 1}-${(day)}`.replace(/-(\d)-/g, '-0\$1-').replace(/-(\d)$/g, '-0\$1');
      // const id = this.addMonth(lastMonthYear, lastMonth, 0) + `-${day < 10 ? '0' + day : day}`;
      const { stringDate } = this.addMonth(lastMonthYear, lastMonth, 0);
      const id = stringDate + `-${day < 10 ? '0' + day : day}`;

      const { dayInChinese, monthInChinese } = CanvasKonvaCalendar.getChineseCalendar(new Date(id));
      const group = new Konva.Group({ name: 'dateCell', id: id, x: x, y: 70 });
      const rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.cellWidth,
        height: this.cellHeight,
        // fill: '#fff',
        fill : 'transparent',
        stroke: '#E1E2E3',
        strokeWidth: 1,
      });
      const text = new Konva.Text({
        x: 10,
        y: 10,
        text: day.toString(),
        fontSize: 16,
        fill: 'gray', // 用灰色标记上个月的日期
      });

      const chineseText = new Konva.Text({
        x: this.cellWidth - 40,
        y: 13,
        text: dayInChinese === '初一' ? `${monthInChinese}` : dayInChinese,
        fontSize: 12,
        fill: 'rgba(0,0,0,0.4)',
      });

      group.add(rect, text, chineseText);
      this.layer.add(group);
    }

    // 渲染当前月份的日期
    for (let i = 0; i < daysInMonth; i++) {
      const x = (i + startOffset) % 7 * this.cellWidth + this.startX;
      const y = Math.floor((i + startOffset) / 7) * this.cellHeight + 40 + 30; // + cellHeight 为下移一行
      const padDay = i + 1 < 10 ? '0' + (i + 1) : i + 1;
      const { stringDate, nonePadMonth } = this.addMonth(lastMonthYear, lastMonth, 1);
      const id = stringDate + `-${padDay}`;
      const group = new Konva.Group({ name: 'dateCell', id, x, y });
      const { dayInChinese, monthInChinese } = CanvasKonvaCalendar.getChineseCalendar(new Date(id));
      const activeDate = this.stringDate === id;
      const rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.cellWidth,
        height: this.cellHeight,
        fill: '#fff',
        stroke: '#EEE',
        strokeWidth: 1,
      });

      let fontSize = 16;
      let textContext = (i + 1).toString();
      
      if (textContext === '1') {
        textContext = nonePadMonth.toString() + '月';
        fontSize = 13;
      }
      
      // 创建文本
      const text = new Konva.Text({
        x: 15,  // 固定文本的 x 坐标
        y: 10,  // 固定文本的 y 坐标
        text: textContext,
        fontSize: fontSize,
        fill: activeDate ? '#FFF' : 'black',
        fontStyle: 'bold',
      });
      
      // 获取文本宽度和高度
      const textWidth = text.width();
      const textHeight = text.height();
      
      // 计算圆的半径，增加 padding 确保圆包裹住文本
      const padding = 5;
      const CircleRadius = 14 || Math.max(textWidth, textHeight) / 2 + padding;
      
      // 计算圆心坐标，使得圆能包裹住文本并居中
      const Circlex = text.x() + textWidth / 2;
      const Circley = text.y() + textHeight / 2;
      
      // 创建圆
      const circle = new Konva.Circle({
        x: Circlex,
        y: Circley,
        radius: CircleRadius,
        fill: activeDate ? '#1f6df6' : '#FFF',
        stroke: activeDate ? '#1f6df6' : '#FFF',
        strokeWidth: 1,
      });
      

      const chineseText = new Konva.Text({
        x: this.cellWidth - 40,
        y: 13,
        text: dayInChinese === '初一' ? `${monthInChinese}` : dayInChinese,
        fontSize: 12,
        fill: 'rgba(0,0,0,0.4)',
      });
      group.add(rect, circle, text, chineseText);
      const { y: groupY, height } = group.getClientRect();
      if (groupY + height < this.stageHeight) {
        this.layer.add(group);
        // group.moveToTop();
      }
    }

    // 渲染下一个月的日期
    const endOffset = (daysInMonth + startOffset) % 7;
    for (let i = 0; i < (7 - endOffset) % 7; i++) {
      const day = i + 1; // 下个月的日期
      const x = (daysInMonth + startOffset + i) % 7 * this.cellWidth + this.startX;
      const y = Math.floor((daysInMonth + startOffset) / 7) * this.cellHeight + 40 + 30;
      const { stringDate } = this.addMonth(lastMonthYear, lastMonth, 2);
      const id = stringDate + `-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`;
      const group = new Konva.Group({ name: 'dateCell', id, x, y });
      const { dayInChinese, monthInChinese } = CanvasKonvaCalendar.getChineseCalendar(new Date(id));

      const rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.cellWidth,
        height: this.cellHeight,
        fill: '#fff',
        stroke: '#E1E2E3',
        strokeWidth: 1,
      });
      const text = new Konva.Text({
        x: 10,
        y: 10,
        text: day.toString(),
        fontSize: 16,
        // 用灰色标记下个月的日期
        fill: 'gray',
        align: 'center',
      });
      const chineseText = new Konva.Text({
        x: this.cellWidth - 40,
        y: 13,
        text: dayInChinese === '初一' ? `${monthInChinese}` : dayInChinese,
        fontSize: 12,
        fill: 'rgba(0,0,0,0.4)',
      });
      group.add(rect, text, chineseText);

      const { y: groupY, height } = group.getClientRect();
      if (groupY + height < this.stageHeight) {
        this.layer.add(group);
      }

    }
  }

  // 绘制任务
  private drawTaskProgress(): void {
    this.removeTasks();
    if (!this.taskRanges.length) return;
    // 获取预处理的任务数据
    const expectedResult = this.splitRanges(this.taskRanges);

    console.log('expectedResult', expectedResult);


    // 计算每个任务的时间跨度，并按 startTime 和时间跨度结合的规则排序
    expectedResult.sort((a, b) => {
      const startA = new Date(a.startTime).getTime();
      const startB = new Date(b.startTime).getTime();
      const durationA = new Date(a.endTime).getTime() - startA;
      const durationB = new Date(b.endTime).getTime() - startB;

      // 首先按开始时间升序排序
      if (startA !== startB) {
        return startA - startB;
      }
      // 如果开始时间相同，按持续时间降序排序
      return durationA - durationB; // 时间跨度小的优先处理
    });

    // 初始化 sizeMap，用于管理不同 yOffset 对应的日期范围
    // 最多显示三项
    const sizeMap = new Map<number, string[][]>([[35, []], [60, []], [85, []]]);
    const surpassMap = new Map<string, any[]>();
    // 遍历任务数据
    expectedResult.forEach((range) => {
      const startDate = range.startTime;
      const endDate = range.endTime;

      // 计算任务跨越的天数，用于绘制宽度
      const dayCount = Math.abs(this.calculateDaysDifference(
        range.endTime,
        range.startTime
      )) + 1;
      const width = dayCount * this.cellWidth;

      // 查找任务开始日期的组
      const group = this.layer.find(`#${range.startTime}`)[0];
      console.log('group', group, range.startTime, this.layer);

      if (!group) return;
      const groupRect = group.getClientRect();

      // 查找合适的 yOffset
      let yOffset = 0;
      for (let [offset, dates] of sizeMap) {
        let overlap = false;

        // 检查当前 yOffset 是否有日期重叠
        for (let dateRange of dates) {
          if ((startDate >= dateRange[0] && startDate <= dateRange[1]) ||
            (endDate >= dateRange[0] && endDate <= dateRange[1]) ||
            (startDate <= dateRange[0] && endDate >= dateRange[1])) {
            overlap = true;
            break;
          }
        }
        // 如果没有重叠，使用当前的 yOffset，并将日期插入该 yOffset 的数组
        if (!overlap) {
          yOffset = offset;
          dates.push([startDate, endDate]);
          break;
        }
      }

      if (yOffset >= 110 || yOffset <= 0) {
        if (!surpassMap.has(range.startTime)) {
          surpassMap.set(range.startTime, [range]);
          return;
        }
        surpassMap.get(range.startTime)!.push(range);
        return;
      }

      //当前任务是否为 跟任务的起点周 ｜ 终点周
      let rectX = groupRect.x;
      let rectWidth = width;

      if (range.startSign) {
        rectX = rectX + 10;
        rectWidth = rectWidth - 10;
      }
      if (range.endSign) {
        rectWidth = rectWidth - 10;
      }
      // 绘制任务
      const rect = new Konva.Rect({
        y: groupRect.y + yOffset,
        x: rectX,
        width: rectWidth,
        height: 20,
        fill: range.fill || '#f3d4d4',
        opacity: 1,
        cornerRadius: [3, 3, 3, 3]
      });

      const text = new Konva.Text({
        x: groupRect.x + (range.startSign ? 15 : 5),
        y: groupRect.y + yOffset + 5,
        text: range.description || '未命名记录',
        fontSize: 12,
        fill: 'rgba(0,0,0,0.8)'
      });

      // 创建 Konva 组并添加任务矩形和文本
      const taskProgressGroup = new Konva.Group({
        name: `task-progress-group ${range.parentId}`,
        id: range.id,
        parentId: range.parentId,
        day: range.day,
        startSign: range.startSign,
        endSign: range.endSign,
      });

      taskProgressGroup.add(rect, text);
      this.featureLayer.add(taskProgressGroup);
      // taskProgressGroup.moveToTop();
    });
    //  绘制超出提示
    this.drawSurpassTips(surpassMap);
  }

  private drawSurpassTips(surpassMap: Map<string, any[]>): void {
    const values = surpassMap.values();
    while (true) {
      const { value, done } = values.next();
      if (done) break;
      const group = this.layer.find(`#${value[0].startTime}`) as Konva.Group[];
      if (group.length) {
        const groupRect = group[0].getClientRect();
        const text = new Konva.Text({
          x: 0,
          y: 5,
          text: `还有${value.length}项`,
          fontSize: 12,
          fill: 'rgba(0,0,0,0.4)',
        })

        const rect = new Konva.Rect({
          x: -5,
          y: 0,
          height: 18,
          width: text.getWidth() + 10,
          opacity: 1,
          cornerRadius: [3, 3, 3, 3]
        })

        const surpassGroup = new Konva.Group({
          name: "surpass-group",
          id: value[0].startTime,
          x: groupRect.x + 10,
          y: groupRect.y + groupRect.height - 22,
        })
        surpassGroup.add(rect, text);
        this.featureLayer.add(surpassGroup);

        //  点击事件
        surpassGroup.on('click tap', () => {
          this.emitter.emit(
            "CLICKSURPASSTIP",
            this.findTasksContainingDate(value[0].startTime)
          )
        })

        surpassGroup.on('mouseover', () => {
          this.container.style.cursor = 'pointer';
          rect.fill('rgba(0,0,0,0.1)');
        })
        surpassGroup.on('mouseout', () => {
          this.container.style.cursor = 'default';
          rect.fill('transparent');
        })
      }
    }
  }

  /**
   * 给定一个日期 判断 this.taskRanges 中哪些日期包含了这个日期
   */
  private findTasksContainingDate(dateString: string) {
    const targetDate = new Date(dateString);
    // 过滤出包含目标日期的任务范围
    return this.taskRanges.filter(task => {
      const startTime = new Date(task.startTime);
      const endTime = new Date(task.endTime);
      // 检查目标日期是否在开始和结束时间之间（包括边界）
      return targetDate >= startTime && targetDate <= endTime;
    });
  }

  // 移除所有任务
  private removeTasks(): void {
    const tasks = this.featureLayer.find(".task-progress-group,.surpass-group") as Konva.Group[];
    if (!tasks.length) {
      return;
    }
    tasks.forEach((task) => void task.remove())
  }

  // 计算两个日期之间的天数
  private calculateDaysDifference(start: Date | string, end: Date | string): number {
    const startDate = new Date(start) as any;
    const endDate = new Date(end) as any;
    const differenceInMilliseconds = endDate - startDate;
    return differenceInMilliseconds / (1000 * 60 * 60 * 24);
  }

  // 将时间范围按周划分
  private splitRanges(ranges: Array<Range>) {
    const splitRangeByWeek = (
      startDate: Date,
      endDate: Date,
      fill: string,
      description: string,
      id: string
    ) => {
      const result = [];
      let currentStart = new Date(startDate);
      const day = Math.abs(this.calculateDaysDifference(endDate, startDate));
      let currentIndex = 0;
      while (currentStart <= endDate) {
        const dayOfWeek = currentStart.getDay();
        let currentEnd;

        if (dayOfWeek === 0) {
          // If it's Sunday, current segment is a single day
          currentEnd = new Date(currentStart);
        } else {
          // Otherwise, go to the nearest Sunday or the end date
          currentEnd = new Date(currentStart);
          currentEnd.setDate(currentStart.getDate() + (7 - dayOfWeek));
          if (currentEnd > endDate) currentEnd = endDate;
        }
        const startTime = currentStart.toISOString().split('T')[0];
        const endTime = currentEnd.toISOString().split('T')[0];
        result.push({
          //  分割成 某一周新的开始时间
          startTime,
          //  分割成 某一周新的结束时间
          endTime,
          fill,
          description,
          //  父节点 id
          parentId: id,
          //  为 分割成某一周的range 成为唯一表示
          id: uuid(),
          //  父节点时间总跨度天数
          day,
          //  被分割的某一周 range 是否为父节点的 起点周 (作用： 用于range的收尾缩进)
          startSign: startDate.getTime() === currentStart.getTime(),
          //  被分割的某一周 range 是否为父节点的 终点周
          endSign: currentEnd.getTime() === endDate.getTime()
        });

        currentStart = new Date(currentEnd);
        currentStart.setDate(currentStart.getDate() + 1);
        currentIndex++;
      }
      return result;
    };

    return ranges.flatMap(range => {
      const startTime = new Date(range.startTime);
      const endTime = new Date(range.endTime);
      return splitRangeByWeek(
        startTime,
        endTime,
        range.fill,
        range.description,
        range.id
      );
    });
  }

  //  绘制鼠标悬浮的矩形
  private drawHoverGroup(): void {
    const group = new Konva.Group({
      visible: false,
      width: this.cellWidth,
      height: this.cellHeight,
      x: 0,
      y: 0,
      id: 'hoverGroup',
      opacity: 0.6
    })

    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.cellWidth,
      height: this.cellHeight,
      fill: 'rgba(0, 0, 0, 0.053)',
      strokeWidth: 1,
      cornerRadius: [2, 2, 2, 2],
    })
    this.hoverGroup = group;
    if (this.config.mode === 'read' || !this.config.isAddTaskBtn) {
      group.add(rect);
      this.featureLayer.add(group);
      return;
    }

    const { plusSignGroup, plusSignRect } = this.drawPlusSign();
    group.add(plusSignGroup, rect)
    this.featureLayer.add(group);
    // group.moveToBottom();

    plusSignRect.on('click tap', (event) => {
      event.cancelBubble = true;
      this.emitter.emit('ADDTASKRANGE', this.hoverRect.id);
    });
    plusSignRect.on('mouseover', () => {
      plusSignRect.setAttr('fill', 'rgba(0, 0, 0, 0.1)');
      this.stage.container().style.cursor = 'pointer';
    })
    plusSignRect.on('mouseout', () => {
      plusSignRect.setAttr('fill', 'rgba(0, 0, 0, 0)');
      this.stage.container().style.cursor = 'default';
    })
    plusSignGroup.moveToTop();

  }

  //  绘制加号
  private drawPlusSign() {
    const plusSignGroup = new Konva.Group({
      id: 'plusSignGroup',
      x: this.hoverGroup.x() + this.cellWidth - 30,
      y: this.hoverGroup.y() + 5,
    });

    const plusSignRect = new Konva.Rect({
      x: 10,
      y: -5,
      width: 20,
      height: 20,
      fill: 'rgba(0, 0, 0, 0)'
    });

    // 绘制十字架的两条线
    const verticalLine = new Konva.Line({
      points: [
        20,
        0,
        20,
        10
      ], // 中心垂直线
      stroke: 'rgba(0, 0, 255, 0.3)',
      strokeWidth: 2
    });

    const horizontalLine = new Konva.Line({
      points: [
        15,
        5,
        25,
        5
      ], // 中心水平线
      stroke: 'rgba(0, 0, 255, 0.3)',
      strokeWidth: 2
    });
    plusSignGroup.add(verticalLine, horizontalLine, plusSignRect);
    return {
      plusSignGroup,
      plusSignRect
    };
  }

  private static formatDate(date: Date): string {
    const year = date.getFullYear(); // 获取年份
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份（注意：月份是从0开始的，因此要加1）
    const day = String(date.getDate()).padStart(2, '0'); // 获取日期

    return `${year}-${month}-${day}`; // 返回格式化后的字符串
  }

  private static getChineseCalendar(date: Date) {
    const solarDay = SolarDay.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const splitDates = solarDay.getLunarDay().toString().match(/^(\S+年)(\S+月)(\S+)$/)!;
    const resultArray = splitDates.slice(1);
    return {
      dayInChinese: resultArray[2],
      monthInChinese: resultArray[1],
    };
  };
}


class CalendarEvent {
  private readonly listeners = new Map();

  on<T>(eventType: EventType, callback: T) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [callback]);
      return this;
    }
    const listeners = this.listeners.get(eventType);
    this.listeners.set(eventType, [...listeners, callback]);
    return this;
  }

  emit<T>(eventType: EventType, args: T) {
    if (this.listeners.has(eventType)) {
      const currentListener = this.listeners.get(eventType);
      for (const callback of currentListener) {
        callback(args);
      }
    }
  }

  removeListener<T>(eventType: EventType, callback: T) {
    if (this.listeners.has(eventType)) {
      const currentListener = this.listeners.get(eventType);
      const idx = currentListener.indexOf(callback);
      if (idx && idx >= 0) {
        currentListener.splice(idx, 1);
      }
    }
  }

  once(eventType: EventType, callback: (...args: any) => void) {
    const execCalllback = (...args: any) => {
      callback(...args);
      this.removeListener(eventType, execCalllback);
    };
    this.on(eventType, execCalllback);
  }
}

export type EventType =
  // 点击 加号 添加任务
  "ADDTASKRANGE" |
  //  点击 某个 range
  "CLICKRANGE" |
  //  更新任务
  "UPDATETASK" |
  //  右键
  "CONTEXTMENU" |
  //  点击查看 多余选项
  "CLICKSURPASSTIP"