import type { DisplayObjectConfig, Group, RectStyleProps as GRectStyleProps, TextStyleProps } from '@antv/g'
import { ElementEvent, Text } from '@antv/g'
import { CommonEvent, Rect, RectStyleProps, subStyleProps } from '@antv/g6'

interface ExtendRectStyleProps extends GRectStyleProps {
  // 自定义属性
  paragraph: string
}

export class ExtendRect extends Rect {
  constructor(options: DisplayObjectConfig<RectStyleProps>) {
    super({ ...options, size: [100, 100] } as any)
    this.type = 'ExtendRect'
  }

  protected getTextStyle(attributes: Required<ExtendRectStyleProps>, container: Group): TextStyleProps {
    // 获取以 paragraph 开头的样式属性，例如 paragraphFontSize
    // const paragraphStyle = subStyleProps(attributes, 'paragraph');
    // return { ...paragraphStyle, text: attributes.paragraph };
    return {
      ...this.drawKeyShape(attributes as any, container),
      text: '文档',
      x: 50,
      y: 10,
      cursor: 'help',

      // fontSize: 30,
      // ...attributes,
    }
  }

  protected drawTextShape(attributes: Required<ExtendRectStyleProps>, container: Group) {
    // 自定义绘制逻辑，创建一个 G.Text
    return this.upsert('text', Text, this.getTextStyle(attributes, container), container)
  }

  render(attrs: any, container: Group) {
    const attr = {
      ...attrs,
      // size: [100, 100]
    }
    super.render(attr, container)
    // 调用自定义绘制逻辑
    const text = this.drawTextShape(attr, container)!
    // text.addEventListener(CommonEvent.CLICK, (event:any) => {
    //   event.stopPropagation();
    //     console.log('---------',event);

    // });
  }

  update(attr?: Partial<RectStyleProps> | undefined): void {}

  destroy(): void {}
}
