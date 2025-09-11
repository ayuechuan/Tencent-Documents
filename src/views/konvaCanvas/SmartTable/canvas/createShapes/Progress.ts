import Konva from "konva";
import { ContainerConfig } from "konva/lib/Container";

export interface ProgressNodeConfig extends ContainerConfig {
  progress?: number;
}

export class ProgressNode extends Konva.Group {
  readonly innerRect: Konva.Rect;
  readonly outerRect: Konva.Rect;

  constructor(config: ProgressNodeConfig) {
    super(Object.assign({
      draggable: true,
      x: 200,
      y: 200
    }, config));

    this.outerRect = new Konva.Rect({
      width: config.width,
      height: config.height,
      stroke: '#149985',
      strokeWidth: 2,
      cornerRadius: [3, 3, 3, 3], //圆角
    });

    this.innerRect = new Konva.Rect({
      width: 0,
      height: config.height,
      opacity: 0.8, //透明度
      fill: '#149985',
      cornerRadius: [3, 3, 3, 3], //圆角
    });

    //  显示进度
    const text = new Konva.Text({
      x: config.width! + 5,
      y: config.height! / 2 - 5,
      text: `${Math.floor(config.progress! * 100)}%`,
      fontSize: 12,
      fill: 'rgba(0,0,0,1)',
      align: 'center',
      verticalAlign: 'middle',
    })

    this.add(this.innerRect, this.outerRect, text);
    this.updateProgress(config.progress || 0); // 设置初始进度
  }

  // 更新进度的方法
  updateProgress(newProgress: number) {
    const targetWidth = this.outerRect.width() * newProgress;
    // 使用动画更新内部矩形的宽度
    this.innerRect.to({
      width: targetWidth,
      duration: 2,
      easing: Konva.Easings.StrongEaseOut,
    });
    (this.children[2] as Konva.Text).text(`${Math.floor(newProgress * 100)}%`);
  }
}

