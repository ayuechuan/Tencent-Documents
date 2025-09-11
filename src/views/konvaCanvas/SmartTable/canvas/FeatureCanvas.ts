import Konva from "konva";
import { HoverFeature } from "./features/Hover";
import { observable } from "mobx";
import { Container } from "./Container";
import { IFeature, IFeatureModel } from "../model";
import { v4 as uuid } from 'uuid';
import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { SelectorFeature } from "./features/Selector";
import { Vector2d } from "konva/lib/types";
import { Store } from "../store/Store";
import { Search } from "./features/Search";
import { HorziontalScrollbar } from "./features/HorziontalScrollbar";
import { RectBorderNode } from "./createShapes/RectBorderNode";
import { ProgressNode } from "./createShapes/Progress";
import { TagShapeNode } from "./createShapes/TagShape";

const features: Array<IFeature> = [
  [
    HoverFeature,
    { requiredEdit: true }
  ],
  [
    SelectorFeature,
    { requiredEdit: true }
  ],
  [
    Search,
    { requiredEdit: true }
  ],
  [
    HorziontalScrollbar,
    { requiredEdit: true }
  ],
  // [Search, { requiredEdit: true }],
];

type EventKey = keyof GlobalEventHandlersEventMap;
type EventValue = { id: string, fn: (event: KonvaEventObject<any, Stage>) => void };

export class FeatureCanvas {
  public readonly layer: Konva.Layer;
  private readonly featuresMap = observable.map<string, IFeatureModel>();
  private readonly eventsmap = observable.map<EventKey, Array<EventValue>>();

  registerHandlers<K extends EventKey>(eventKey: K, fn: EventValue['fn']) {
    const id = uuid();
    if (!this.eventsmap.get(eventKey)?.length) {
      this.eventsmap.set(eventKey, [])
    }
    this.eventsmap.set(eventKey, this.eventsmap.get(eventKey)!.concat([{ id, fn }]));
    return () => {
      this.eventsmap.set(eventKey,
        this.eventsmap
          .get(eventKey)!
          .filter((event) => event.id !== id)
      );
    }
  }

  // constructor() {
  //   this.layer = new Konva.Layer();
  // }

  constructor(
    // private readonly store: Store
  ) {
    this.layer = new Konva.Layer({
      draggable : true
    });
    this.layer.add(new RectBorderNode({
      x: 200,
      y: 600,
      width: 200,
      height: 200
    }))

    const progressNode = new ProgressNode({
      x: 200,
      y: 600,
      width: 100,
      height: 20,
      progress: 0.5
    })

    const tag = new TagShapeNode({
      rectConfig:{
        x: 100,
        y: 600,
        width: 100,
        height: 20,
        radius: 5
      },
      textConfig:{
        x: 100,
        fill : 'red'
      }
    })

    this.layer.add(progressNode);
    this.layer.add(tag);
    console.log('progressNode',progressNode.outerRect);

    setTimeout(() => {
      progressNode.updateProgress(0.8)
      setTimeout(() => {
        progressNode.updateProgress(1)
      }, 2000);
    }, 2000);
    // this.on();
  }

  public bootstrap() {
    // 安装 feature 插件
    this.installFeatures(features);
  }

  add(...children: (Konva.Node | any)[]) {
    this.layer.add(...children);
    return this;
  }

  // on() {
  //   this.container.stage.on('mousedown touchstart', event => {
  //     this.eventsmap.get('mousedown')?.forEach(({ fn }) => {
  //       fn(event);
  //     })
  //   })
  //   this.container.stage.on('mousemove touchmove', event => {
  //     this.eventsmap.get('mousemove')?.forEach(({ fn }) => {
  //       fn(event);
  //     })
  //   })
  //   this.container.stage.on('mouseup touchend', event => {
  //     this.eventsmap.get('mouseup')?.forEach(({ fn }) => {
  //       fn(event);
  //     })
  //   })

  //   //  滚轮事件
  //   this.container.stage.on('wheel', event => { },)
  // }
  /**
   * 安装 features
   * @param features
   */
  public installFeatures(features: IFeature[]) {
    features.forEach((feature) => {
      const [FeatureConstructor, featureSetting] = feature;
      // 获取配置项
      const { requiredEdit } = featureSetting;
      let featureInstance;
      if (FeatureConstructor === Search) {
        featureInstance = new FeatureConstructor(this, this.store);
      } else {
        featureInstance = new FeatureConstructor(this);
      }
      featureInstance.bootstrap();
      this.featuresMap.set(featureInstance.name, featureInstance);
    });
  }

  public getFeature(name: string) {
    return this.featuresMap.get(name);
  }


  // getMousePointerShape(): {
  //   group: Konva.Group,
  //   pointer: Vector2d
  // } | null {
  //   const groups = this.container.stage?.find('.container_cell')!;
  //   const pointer = this.container.stage!.getPointerPosition()!;
  //   for (let index = 0; index < groups.length; index++) {
  //     const group = groups[index] as Konva.Group;
  //     const rect = group.getClientRect();
  //     //  Konva.Util.haveIntersection判断两个图形是否相交
  //     if (Konva.Util.haveIntersection(rect, {
  //       ...pointer,
  //       width: 1, height: 1
  //     })) {
  //       return {
  //         pointer,
  //         group
  //       }
  //     }
  //   }
  //   return null;
  // }

}



// this.stage = K.Node.create(myKonvaSavedJson, 'container');
// this.loadChildren(this.stage);

// loadChildren(element: K.Group | K.Layer | K.Stage) {
//     const children = element.getChildren();
//     children.forEach((child) => { 
//         enrich(child); 
//         if (child instanceof K.Group || child instanceof K.Layer) {
//             this.loadChildren(child); 
//         } 
//     });
// }

// // Enrich with custom logic
// //Here the "nameSVG" is a custom konva attribute 
// const enrichImage: enrichFunction = (image: Node) => { 
//     if (image instanceof Konva.Image) {
//         const canvasImage = new Image();
//         canvasImage.src = `/assets/diagram/bpmn/${image.getAttr('nameSVG')}.svg`; 
//         image.image(canvasImage);
//         return image;
//     }
//     return image; 
// };

// type enrichFunction = (node: Node) => Node;
// type enrichDict = { [key: string]: enrichFunction; }; 
// const dict: enrichDict = {
//     "Image": enrichImage,
//     //put anything you want for custom objects
// };
// export const enrich = (node: Node) => {
//     return dict[node.className] ? dict[node.className](node) : node; 
// };