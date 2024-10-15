import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { IFeatureModel } from "../../model";
import { FeatureCanvas } from "../FeatureCanvas";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";

export class HorziontalScrollbar implements IFeatureModel {
  name = 'HorziontalScrollbar';
  container!: Konva.Rect;
  constructor(private readonly featureCanvas: FeatureCanvas) { }
  
  bootstrap(): void {
    this.container = new Konva.Rect({
      name: this.name,
      width: 8,
      height: 100,
      fill: '#C0C4C9',
      strokeWidth: 1,
      y: 0,
      x: this.featureCanvas.layer.width() - 50,
      visible: true,
      cornerRadius: [10, 10, 10, 10],
      draggable: true,
      dragBoundFunc: (position: Vector2d) => {
        position.x = this.featureCanvas.layer.width() - 50;
        position.y = Math.max(
          Math.min(position.y, this.featureCanvas.layer.height() - 10),
          10
        );
        return position;
      },
    });
    this.container.on('dragmove', (e) => {
      console.log('移动中---');

      // this.featureCanvas.layer.batchDraw();
    });
    this.container.on('mousedown', (event) => {
      event.cancelBubble = true;
    })
    this.featureCanvas.layer.add(this.container);
  }
  updated(): void { }
  addActivedEvents(): void { }
  removeActivedEvents(): void { }
  destroy(): void {
    this.container.destroy();
  }
  onScroll() { }
  onMouseDown(event: KonvaEventObject<any, Stage>) { }
  paint() { }
}