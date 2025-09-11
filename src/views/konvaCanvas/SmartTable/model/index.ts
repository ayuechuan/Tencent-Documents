import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { FeatureCanvas } from "../canvas/FeatureCanvas";

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

export type IFeature = [new (featureCanvas: FeatureCanvas, model?: any) =>
  IFeatureModel, { requiredEdit: boolean }
]