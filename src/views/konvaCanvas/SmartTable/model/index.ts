import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";

export class IFeatureModel {
  name!: string;
  bootstrap() { }
  updated(...args: any[]) { }
  addActivedEvents() { }
  removeActivedEvents() { }
  destroy() { }
  onMouseDown(event: KonvaEventObject<any, Stage>) { }
  onScroll() { }
  paint() { }
}