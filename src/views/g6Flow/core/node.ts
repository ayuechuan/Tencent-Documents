import * as g6 from '@antv/g6'
import { BaseNode, BaseNodeStyleProps, IconStyleProps } from '@antv/g6'

type OgiginType = ConstructorParameters<typeof g6.Rect>[0]

export class CustomNode extends g6.Rect {
  constructor(options: OgiginType) {
    super(options)
    this.type = 'custom-Node'
  }

  drawBadgeShapes() {}

  update(attr?: Partial<g6.RectStyleProps> | undefined): void {
    // console.log('update', attr);
  }

  render(atts: Required<RectStyleProps>, container: g6.Rect) {
    super.render(atts)
    // this.appendChild(, container );
  }
}

/**
 * <zh/> 矩形节点样式配置项
 *
 * <en/> Rect node style props
 */
export interface RectStyleProps extends BaseNodeStyleProps {}
type ParsedRectStyleProps = Required<RectStyleProps>

/**
 * <zh/> 矩形节点
 *
 * <en/> Rect node
 */
// export class Rect extends BaseNode<RectStyleProps> {
//   constructor(options: RectStyleProps) {
//     super(options);
//   }

//   protected getKeyStyle(attributes: ParsedRectStyleProps) {
//     const [width, height] = this.getSize(attributes);
//     return {
//       ...super.getKeyStyle(attributes),
//       width,
//       height,
//       x: -width / 2,
//       y: -height / 2,
//     };
//   }

//   protected getIconStyle(attributes: ParsedRectStyleProps): false  | IconStyleProps{
//     const style = super.getIconStyle(attributes);
//     const { width, height } = this.getShape('key').attributes;

//     return style
//       ? ({
//           width: (width as number) * .8,
//           height: (height as number) * .8,
//           ...style,
//         } as IconStyleProps)
//       : false;
//   }

//   protected drawKeyShape(attributes: ParsedRectStyleProps, container: any): any | undefined {
//     return this.upsert('key', GRect, this.getKeyStyle(attributes), container);
//   }
// }
