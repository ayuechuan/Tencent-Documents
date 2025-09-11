import {
  action,
  autorun,
  extendObservable,
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
  toJS,
  transaction,
} from "mobx";
import { createContext } from "react";

export abstract class SetupContainer<T> {
  loading = observable.box(false);
  dataSource: Array<T> = observable.array([]);
  constructor() {
    extendObservable(this, {
      loading: observable,
      dataSource: observable,
      setSearchKey: action
    });
  }
  setLoading(key: boolean) {
    this.loading.set(key ?? !this.loading.get());
  }
}

function getUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '123',
        name: '月传'
      })
    }, 1000);
  })
}


export class CounterStore extends SetupContainer<{ name: string, id: string }> {
  searchKey = observable.box('');
  constructor() {
    super();
    makeObservable(this, {
      searchKey: observable,
      setup: action,
    });
    this.setup();
    this.searchKey.set('数据变革');
  }

  async setup() {
    const user = await getUser() as any
    runInAction(() => {
      this.dataSource = [user];
      // this.loading = false;
    })
  }
}

export class TemplateStore extends SetupContainer<{}>{

}



export class SearchStore {
  // test = observable.shallow({ a: { b: 1 } }, 'a')
  // test1 = observable.ref({}, '')
  // test3 = observable.struct({}, '');
  // test4 = observable.map([[0, 1], [2, 3]]);
  // test5 = observable.set();

  array = [] as number[];
  array1 = observable.array<number>([]);
  items = observable.array(
    [
      { id: 1, name: 'item1' },
      { id: 2, name: 'item2' }
    ], { deep: false });
  rrr = observable.object({ name: '' }, {}, { deep: false })

  rrrr = observable({
    count: 1,
    user: { name: '123' },
    items: observable.shallow
  }, {
    user: observable.ref
  }, { deep: false })

  state = observable({
    user: { name: 'Tom' }  // ✅ 默认值
  }, {
    user: observable.deep   // ✅ 指定 user 这个字段用 ref 代理
  });
  constructor() {
    // makeAutoObservable(this)
    setTimeout(() => {
      this.state.user.name = 'Jerry'; // 这不会触发视图更新
      console.log('出发了');

      // this.state.user = { name: 'Jerry' }; // 这会触发视图更新
    }, 2000);
    autorun(() => {
      console.log('变化==', toJS(this.state.user));

    })
  }

  add() {
    // this.items.push({
    //   id: 3, name: 'item3'
    // })
    this.items[0].name = '515151'

  }
}