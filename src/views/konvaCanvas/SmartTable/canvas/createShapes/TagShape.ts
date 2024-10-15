import Konva from "konva";
import { RectConfig } from "konva/lib/shapes/Rect";
import { TextConfig } from "konva/lib/shapes/Text";

interface Props {
  rectConfig: RectConfig,
  textConfig: TextConfig
}

export class TagShapeNode extends Konva.Group {
  constructor(config: Props) {
    super();
    this.register(config);
  }
  register(config: Props) {
    const text = new Konva.Text({
      x: 0,
      y: 0,
      text: '进行中...',
      ...config.textConfig,
      fill: '#FFF'
    });
    const width = text.getTextWidth();
    const rect = new Konva.Rect({
      width: width + 10,
      height: 40,
      ...config.rectConfig,
    })

    const coloRect = new Konva.Rect({
      ...config.rectConfig,
      width: width + 20,
      height: 25,
      //  圆角
      cornerRadius: [3, 3, 3, 3],
      fill: config.textConfig.fill
    })

    coloRect.x(coloRect.x() + 5)
    coloRect.y(coloRect.y() + coloRect.height() / 2);
    // 计算文本的居中位置
    text.x(coloRect.x() + 10); // 文本左边距10像素
    text.y(coloRect.y() + (coloRect.height() - text.fontSize()) / 2); // 垂直居中
    this.add(rect)
    this.add(coloRect);
    this.add(text)
  }
}
