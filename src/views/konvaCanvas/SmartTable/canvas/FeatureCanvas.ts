import Konva from "konva";
import { HoverFeature } from "./features/Hover";
import { observable } from "mobx";
import { Container } from "./Container";
import { IFeatureModel } from "../model";
import { v4 as uuid } from 'uuid';
import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { SelectorFeature } from "./features/Selector";
import { Vector2d } from "konva/lib/types";
import { Store } from "../store/Store";
import { Search } from "./features/Search";
import { HorziontalScrollbar } from "./features/HorziontalScrollbar";
import { RectBorderNode } from "./createShapes/RectBorderNode";

type IFeature = [new (featureCanvas: FeatureCanvas, model?: Store) =>
  IFeatureModel, { requiredEdit: boolean }
]

const features: IFeature[] = [
  [HoverFeature, { requiredEdit: true }],
  [SelectorFeature, { requiredEdit: true }],
  [Search, { requiredEdit: true }],
  [HorziontalScrollbar, { requiredEdit: true }],
  // [Search, { requiredEdit: true }],
];

export class FeatureCanvas {
  public readonly layer: Konva.Layer;
  private readonly featuresMap = observable.map<string, IFeatureModel>();
  private readonly eventsmap =
    observable.map<
      keyof GlobalEventHandlersEventMap, { id: string, fn: (event: KonvaEventObject<any, Stage>) => void }[]
    >();

  registerHandlers<K extends keyof GlobalEventHandlersEventMap>(eventKey: K, fn: (event: KonvaEventObject<any, Stage>) => void) {
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

  constructor(
    private readonly container: Container,
    private readonly store: Store
  ) {
    this.layer = new Konva.Layer();
    this.layer.add(new RectBorderNode({
      x : 200,
      y : 600,
      width : 200,
      height : 200
    }))
    this.on();
  }

  public bootstrap() {
    // 安装 feature 插件
    this.installFeatures(features);
  }

  add(...children: (Konva.Node | any)[]) {
    this.layer.add(...children);
    return this;
  }

  on() {
    this.container.stage.on('mousedown touchstart', event => {
      this.eventsmap.get('mousedown')?.forEach(({ fn }) => {
        fn(event);
      })
    })
    this.container.stage.on('mousemove touchmove', event => {
      this.eventsmap.get('mousemove')?.forEach(({ fn }) => {
        fn(event);
      })
    })
    this.container.stage.on('mouseup touchend', event => {
      this.eventsmap.get('mouseup')?.forEach(({ fn }) => {
        fn(event);
      })
    })

    //  滚轮事件
    this.container.stage.on('wheel', event => {},)
  }
  /**
   * 安装 features
   * @param features
   */
  public installFeatures(features: IFeature[]) {
    features.forEach((feature) => {
      const [FeatureConstructor, featureSetting] = feature;
      // 获取配置项
      const { requiredEdit } = featureSetting;
      // 检查是否具有相关权限
      // if (
      //   requiredEdit ||
      //   (!canUseInServer)
      // ) {
      //   return;
      // }
      let featureInstance;
      if (FeatureConstructor === Search) {
        featureInstance = new FeatureConstructor(this, this.store);
      } else {
        featureInstance = new FeatureConstructor(this);
      }
      featureInstance.bootstrap();
      this.featuresMap.set(featureInstance.name, featureInstance);
      // this.features[name] = featureInstance;
    });
  }

  public getFeature(name: string) {
    return this.featuresMap.get(name);
  }


  getMousePointerShape(): {
    group: Konva.Group,
    pointer: Vector2d
  } | null {
    const groups = this.container.stage?.find('.container_cell')!;
    const pointer = this.container.stage!.getPointerPosition()!;
    for (let index = 0; index < groups.length; index++) {
      const group = groups[index] as Konva.Group;
      const rect = group.getClientRect();
      //  Konva.Util.haveIntersection判断两个图形是否相交
      if (Konva.Util.haveIntersection(rect, {
        ...pointer,
        width: 1, height: 1
      })) {
        return {
          pointer,
          group
        }
      }
    }
    return null;
  }

}