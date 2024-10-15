import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { IFeatureModel } from "../../model";
import { FeatureCanvas } from "../FeatureCanvas";

export class HoverFeature implements IFeatureModel {
  name = 'HoverFeature';
  constructor(private readonly featureCanvas: FeatureCanvas) {
    this.featureCanvas.registerHandlers('mousedown', this.onMouseDown)
  }

  onMouseDown(event: KonvaEventObject<any, Stage>) {
    console.log('确实执行了');

  }


  bootstrap(): void {
    console.log(111, this);

  }
  updated(): void {

  }
  addActivedEvents(): void {

  }
  removeActivedEvents(): void {

  }
  destroy(): void {

  }


  onScroll() { }
  paint() { }
}