import Konva from "konva";
import { Context } from "konva/lib/Context";
import { ShapeConfig } from "konva/lib/Shape";
import { GetSet } from "konva/lib/types";

export interface Props extends ShapeConfig {
  strokeTopColor?: string
  strokeRightColor?: string
  strokeBottomColor?: string
  strokeLeftColor?: string
  strokeTopDash?: number[]
  strokeRightDash?: number[]
  strokeBottomDash?: number[]
  strokeLeftDash?: number[]
  strokeTopWidth?: number,
  strokeRightWidth?: number,
  strokeBottomWidth?: number,
  strokeLeftWidth?: number,
  lineCap?: any
}

const getOffsetFromWidth = (width: number) => {
  return width / 2 - 0.5
}

export class RectBorderNode extends Konva.Shape {
  constructor(config: Props) {
    const {
      strokeTopColor = '#C0C4C9',
      strokeRightColor = '#C0C4C9',
      strokeBottomColor = '#C0C4C9',
      strokeLeftColor = '#C0C4C9',
      strokeTopDash = [],
      strokeRightDash = [],
      strokeBottomDash = [],
      strokeLeftDash = [],
      strokeTopWidth = 1,
      strokeRightWidth = 1,
      strokeBottomWidth = 1,
      strokeLeftWidth = 1,
      lineCap = "butt"
    } = config;

    const configassign = {
      name: 'RectBorderNode',
      sceneFunc(context: Context, shape: Konva.Shape) {
        const { x, y, width, height } = shape.attrs; // 使用 shape.attrs 获取属性
        /* Top border */
        if (strokeTopColor) {
          context.beginPath();
          context.moveTo(
            strokeLeftColor ? -getOffsetFromWidth(strokeLeftWidth) : 0,
            0.5
          );
          context.lineTo(
            shape.width() +
            (strokeRightColor ? getOffsetFromWidth(strokeRightWidth) + 1 : 1),
            0.5
          );
          context.setAttr("strokeStyle", strokeTopColor);
          context.setAttr("lineWidth", strokeTopWidth);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeTopDash);
          context.stroke();
        }
        /* Bottom border */
        if (strokeBottomColor) {
          context.beginPath();
          context.moveTo(
            strokeLeftColor ? -getOffsetFromWidth(strokeLeftWidth) : 0,
            shape.height() + 0.5
          );
          context.lineTo(
            shape.width() +
            (strokeRightColor ? getOffsetFromWidth(strokeRightWidth) + 1 : 1),
            shape.height() + 0.5
          );
          context.setAttr("lineWidth", strokeBottomWidth);
          context.setAttr("strokeStyle", strokeBottomColor);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeBottomDash);
          context.stroke();
        }
        /* Left border */
        if (strokeLeftColor) {
          context.beginPath();
          context.moveTo(
            0.5,
            strokeTopColor ? -getOffsetFromWidth(strokeTopWidth) : 0
          );
          context.lineTo(
            0.5,
            shape.height() +
            (strokeBottomColor
              ? getOffsetFromWidth(strokeBottomWidth) + 1
              : 1)
          );
          context.setAttr("strokeStyle", strokeLeftColor);
          context.setAttr("lineWidth", strokeLeftWidth);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeLeftDash);
          context.stroke();
        }
        /* Right border */
        if (strokeRightColor) {
          context.beginPath();
          context.moveTo(
            shape.width() + 0.5,
            strokeTopColor ? -getOffsetFromWidth(strokeTopWidth) : 0
          );
          context.lineTo(
            shape.width() + 0.5,
            shape.height() +
            (strokeBottomColor
              ? getOffsetFromWidth(strokeBottomWidth) + 1
              : 1)
          );
          context.setAttr("strokeStyle", strokeRightColor);
          context.setAttr("lineWidth", strokeRightWidth);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeRightDash);
          context.stroke();
        }
      }
    }
    super(Object.assign(configassign, config));
  }
}


