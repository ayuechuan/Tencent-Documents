import { observable } from "mobx";
import { Item } from "./Operation";

export class DataManagement {
  private _items = observable.array<Item>([
    { title: 'APP图标设计', description: '设计APP图标，突出品牌特色' },
    { title: 'APP图标设计1', description: '设计APP图标，突出品牌特色' },
    { title: 'APP图标设计2', description: '设计APP图标，突出品牌特色' },
    { title: 'APP图标设计3', description: '设计APP图标，突出品牌特色' },
    { title: 'APP图标设计4', description: '设计APP图标，突出品牌特色' },
  ]);

  constructor() {

  }
  get items() {
    return this._items;
  }

  public splice(newItems: Item[]) {
    this._items.replace(newItems);
  }

  public addItem(item: Item) {
    this._items.push(item);
  }

  public removeItem(item: Item) {
    this._items.remove(item);
  }

  public clearItems() {
    this._items.clear();
  }

}