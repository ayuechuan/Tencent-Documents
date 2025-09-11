import Konva from "konva";
import { ContainerConfig } from "konva/lib/Container";
import { Group } from "konva/lib/Group";
import { Layer } from "konva/lib/Layer";
import { Vector2d } from "konva/lib/types";

export class TaskResizeGroup extends Group {
  private cacheWeekTasks: Record<string, Record<string, Konva.Rect>> = {};
  constructor(
    private readonly parentGroup: Group,
    private readonly containerLayer: Layer,
  ) {
    const x = parentGroup.getClientRect().width - 10;
    super(
      {
        x,
        y: 0,
        visible: true,
        draggable: true,
        name: '001',
      }
    );
    this.bootstrap();
  }

  private _drawResizeChildren(): void {
    // 拖动handle，用于调整任务条宽度
    const handle = new Konva.Rect({
      x: 0,
      y: 0,
      width: 10,
      height: 20,
      // fill: 'rgba(0,0,0,0.4)',
      fill: 'red',
      cornerRadius: [0, 3, 3, 0]
    });
    const lineRect = new Konva.Rect({
      x: 3,
      y: 5,
      width: 0.5,
      height: 28,
      fill: 'white',
      cornerRadius: [0, 3, 3, 0]
    });
    const lineRect2 = new Konva.Rect({
      x: 6,
      y: 3,
      width: 0.5,
      height: 33,
      fill: 'white',
      cornerRadius: [0, 3, 3, 0]
    });
    this.add(handle, lineRect, lineRect2)
  }

  private _registerEvents() {
    this.parentGroup.on("mouseenter", () => {
      this.setAttrs({ visible: true });
    })
    this.parentGroup.on('mouseleave', () => {
      this.visible(false);
    })

    this.on("mouseenter", () => {
      this.containerLayer.getStage().container().style.cursor = 'col-resize';
    })
    this.on('mouseleave', () => {
      this.containerLayer.getStage().container().style.cursor = 'default';
    })

    this.on("mousedown", (event) => {
      event.cancelBubble = true;
    })
    this.on("dragend", () => { });
    this.on("dragmove", () => {
      const position = this.getAbsolutePosition()
      // 获取当前的周和日期
      const currentWeekKey = this.getCurrentWeekKey(position);
      const taskStartWeekKey = this.getCurrentWeekKey(this.parentGroup.getAbsolutePosition());

      console.log('currentWeekKey',position);
      

      // 判断拖动是否超出任务的起始周范围
      if (currentWeekKey > taskStartWeekKey) {
        const existingTask = this.cacheWeekTasks[currentWeekKey];
        // 如果该周没有任务条，则创建新任务条
        if (!existingTask) {
          this.createNewTaskBar(position);
        } else {
          // 更新已存在任务条的宽度或位置
          const updatedWidth = this.calculateWidth(position, existingTask);
          this.updateTaskWidth(existingTask, updatedWidth);
        }
      }


    });
  }

  // 初始化并添加到图层
  public bootstrap() {
    this._drawResizeChildren();
    // this.parentGroup.add(this)
    this._registerEvents();
  }


  private isOutOfCurrentWeek(position: Vector2d): boolean {
    const weekBoundaryX = 1000;
    const currentWeekStartX = this.getAbsolutePosition().x;
    const currentWeekEndX = currentWeekStartX + weekBoundaryX;
    return position.x < currentWeekStartX || position.x > currentWeekEndX;
  }

  // 创建新的任务条
  private createNewTaskBar(position: Vector2d) {
    const newTask = new Konva.Rect({
      x: position.x,
      y: position.y,
      width: 200,
      height: 50,
      fill: 'blue',
      draggable: true,
    });

    this.add(newTask);
    const weekKey = this.getCurrentWeekKey(position);
    if (!this.cacheWeekTasks[weekKey]) {
      this.cacheWeekTasks[weekKey] = {};
    }
    this.cacheWeekTasks[weekKey][newTask.id()] = newTask;
    this.containerLayer.draw();
  }

  private calculateWidth(position: Vector2d, existingTask: Record<string, Konva.Rect>) {
    const task = Object.values(existingTask)[0];
    const width = position.x - task.x();
    return width > 0 ? width : task.width();
  }

  private updateTaskWidth(existingTask: Record<string, Konva.Rect>, width: number) {
    Object.values(existingTask).forEach(task => task.width(width));
    this.containerLayer.draw();
  }

  private getCurrentWeekKey(position: Vector2d): string {
    const weekNum = Math.floor(position.x / 1000);
    return `week-${weekNum}`;
  }

  private showWeekTasks(weekKey: string) {
    const tasks = this.cacheWeekTasks[weekKey];
    if (tasks) {
      Object.values(tasks).forEach(task => task.visible(true));
      this.containerLayer.draw();
    }
  }

  private hideWeekTasks(weekKey: string) {
    const tasks = this.cacheWeekTasks[weekKey];
    if (tasks) {
      Object.values(tasks).forEach(task => task.visible(false));
      this.containerLayer.draw();
    }
  }

}







