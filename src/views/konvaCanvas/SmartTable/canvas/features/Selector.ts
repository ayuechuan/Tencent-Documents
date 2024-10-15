import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { IFeatureModel } from "../../model";
import { FeatureCanvas } from "../FeatureCanvas";
import { autorun } from 'mobx';
import Konva from "konva";

export class SelectorFeature implements IFeatureModel {
  name = 'Highlight';
  container!: Konva.Group;
  cell = { x: 0, y: 0, width: 0, height: 0 };
  mousedownDisposer!: () => void;
  mousemoveDisposer!: () => void;
  constructor(private readonly featureCanvas: FeatureCanvas) { }

  bootstrap() {
    this.container = new Konva.Group({
      visible: false
    });
    this.featureCanvas.add(this.container);
    this.featureCanvas.registerHandlers('mousedown', this.onMouseDown.bind(this))
  }
  updated() {
    this.paint();
  }
  addActivedEvents() {
    this.mousemoveDisposer = this.featureCanvas.registerHandlers('mousemove', this.mousemove.bind(this));
    this.featureCanvas.registerHandlers('mouseup', this.mouseup.bind(this))
  }

  mousemove(event: any) {
    console.log('move===', event);

  }

  mouseup() {
    this.mousemoveDisposer?.();
  }

  removeActivedEvents() {
    this.mousedownDisposer?.();
    this.mousemoveDisposer?.();
  }
  destroy() {
    this.container?.destroy();
    this.removeActivedEvents();
  }

  onMouseDown(event: KonvaEventObject<any, Stage>) {
    const shape = this.featureCanvas.getMousePointerShape();
    if (!shape) {
      return;
    }
    const { group } = shape;
    const rect = group.getClientRect();
    this.cell = rect;
    this.paint();
    this.addActivedEvents();
  }
  onScroll() { }
  paint() {
    const { cell } = this;
    if (!this.container.hasChildren()) {
      const rect = new Konva.Rect({
        x: cell.x,
        y: cell.y,
        width: cell.width,
        height: cell.height,
        fill: 'transparent',
        stroke: '#0b57d0',
        strokeWidth: 2
      });

      this.container.add(rect);
      this.container.visible(true);
      return;
    }
    //  存在
    const rect = this.container.children[0];
    rect.setAttrs({
      x: cell.x,
      y: cell.y,
      width: cell.width,
      height: cell.height
    })
    this.container.visible(true);
  }
}