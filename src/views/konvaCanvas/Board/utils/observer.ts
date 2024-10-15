import { autorun, makeAutoObservable } from "mobx";

function _get(source: any, path: any, defaultValue = undefined) {
  // translate array case to dot case, then split witth .
  // a[0].b -> a.0.b -> ['a', '0', 'b']
  const keyList = path.replace(/\[(\d+)\]/g, '.$1').split('.')

  const result = keyList.reduce((obj: any, key: any) => {
    return Object(obj)[key]; // null undefined get attribute will throwError, Object() can return a object 
  }, source)
  return result === undefined ? defaultValue : result;
}

// 监听装饰器，在这里是用于拦截目标类，去注册 watcher 的监听
export const observer = (observerPropertyKey: string) =>
  <T extends new (...args: any[]) => any>(Constructor: T) =>
    class extends Constructor {
      public constructor(...args: any[]) {
        super(...args);
        // 取出所有的 $watchers，遍历执行，触发 Mobx 的依赖收集
        Constructor.prototype?.$watchers?.forEach((watcher: any) => {
          watcher(this, this[observerPropertyKey])
        });
      }
    };

// 定义 @watch 装饰器
export const watch = <T = void>(path: string) => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.$watchers) {
      target.$watchers = [];
    }
    // 将 autorun 挂载到 $watchers 上面，方便之后执行
    target.$watchers.push((context: any, model: T) => {
      // 使用 autorun 触发依赖收集
      autorun(() => {
        const result = _get(model, path);
        if(!model){
          return;
        }
        descriptor.value.call(context, result);
      });
    });
  };
};

// Model 类
export class Model {
  public count = 0;

  public constructor() {
    makeAutoObservable(this);
  }

  public increment() {
    this.count++;
    console.log('添加---', this.count);
  }
}

// SearchFeature 类
// @observer()
// class SearchFeature {
//   model: Model;
//   constructor(model: Model) {
//     this.model = model;
//   }

//   @watch('count')
//   public refresh(count: number) {
//     console.log('刷新----', count);
//   }
// }

// // 创建实例并测试
// const model = new Model();
// const feature = new SearchFeature(model);

// setTimeout(() => {

//   model.increment(); // 这时应该调用 refresh
// }, 5000);
