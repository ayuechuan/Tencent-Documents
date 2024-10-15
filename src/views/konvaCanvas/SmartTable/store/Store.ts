import { autorun, makeAutoObservable, observable } from "mobx";

export class Store {
  search = '';
  searchMeetConditions = observable.array([]);
  activeCell = {
    x: 10,
    y: 20,
    width: 200,
    height: 200
  };

  constructor() {
    makeAutoObservable(this);
    
    setTimeout(()=>{
      this.activeCell = {
        x: 10,
        y: 20,
        width: 200,
        height: 200
      }
      setTimeout(()=>{
        this.activeCell = {
          x: 100,
          y: 20,
          width: 200,
          height: 200
        }
      },1000)
    },1000)
  }
}