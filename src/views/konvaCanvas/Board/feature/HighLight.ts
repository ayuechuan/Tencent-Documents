import { autorun, makeAutoObservable } from 'mobx';
import { makeObservable, observable, action } from 'mobx';
import { observer, watch } from '../utils/observer';
interface IFeature {

}

class HighLight {
  public Name = 'highLight';
  public cell = {
    row: 0,
    column: 0,
  };

  public bootstrap() {
    // // 创建一个容器节点
    // this.container = new Group();
    // // 将其添加到 Feature 图层
    // this.layer.add(this.container);
    // // 监听 mouseDown 事件
    // this.mouseDownEvent = global.mousedown.event(this.onMouseDown);
  }

  public updated() {
    this.paint();
  }

  public addActivedEvents() {
    // 绑定滚动事件
    // this.scrollEvent = global.scroll.event(this.onScroll);
  }

  public removeActivedEvents() {
    // this.scrollEvent?.dispose();
  }

  public destroy() {
    // this.container?.destroy();
    // this.removeActivedEvents();
  }

  private onMouseDown(param: any) {
    // const { x, y } = param;
    // // 根据点击的 x、y 坐标点获取当前触发的单元格
    // this.cell = this.getCell(x, y);
    // // 绘制
    // this.paint();
    // // 只有在鼠标点击之后，才需要绑定滚动等事件，避免不必要的开销
    // this.addActivedEvents();
  }

  private onScroll(delta: any) {
    const { deltaX, deltaY } = delta;
    // 根据滚动的 delta 值更新高亮背景的位置
    // const position = this.container.position();
    // this.container.x(position.x + deltaX);
    // this.container.y(position.y + deltaY);
  }

  /**
   * 绘制背景高亮
   */
  private paint() {
    // // 根据单元格获取对应的位置和宽高信息
    // const cellRect = this.getCellRect(this.cell);
    // // 创建一个矩形
    // const rect = new Rect({
    //   fill: 'red',
    //   x: cellRect.x,
    //   y: cellRect.y,
    //   width: cellRect.width,
    //   height: cellRect.height,
    // });
    // // 将矩形加入到父节点
    // this.container.add(rect);
  }
}

// 所有的 feature
const features = [
  [HighLight, { requiredEdit: false }],
  // [Search, { requiredEdit: false }],
  // [Selector, { requiredEdit: false, canUseInServer: true }],
  // [RecordHover, { requiredEdit: false, canUseInServer: true }],
  // [ToolTip, { requiredEdit: false }],
  // [Scroller, { requiredEdit: false, canUseInServer: true }],
];

export class FeatureCanvas {

  constructor(private readonly features: any) { }

  public bootstrap() {
    // 安装 feature 插件
    this.installFeatures(features);
  }

  /**
   * 安装 features
   */
  public installFeatures(features: any[]) {
    features.forEach((feature) => {
      const [FeatureConstructor, featureSetting] = feature;
      // 获取配置项
      const { requiredEdit, canUseInServer = false } = featureSetting;
      const featureInstance = new FeatureConstructor(this);
      featureInstance.bootstrap();
      this.features[featureInstance.name] = featureInstance;
    });
  }
}




export class Model {
  public count = 1;

  public constructor() {
    // 将 count 设置为可观察属性
    makeAutoObservable(this);
  }

  public increment() {
    this.count++;
    console.log('添加---', this.count);

  }
}



@observer()
class SearchFeature {
  constructor(public readonly model: Model) { }
  @watch('count')
  public refresh(count: number) {
    console.log('刷新----', count);

  }
}



// const model = new Model();
// const feature = new SearchFeature(model);
// setInterval(() => {
//   model.increment();
// }, 2000);


