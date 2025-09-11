import { makeAutoObservable } from "mobx";
import { createContext } from "react";


export class GlobaData {
  value = '1'
  constructor() {
    makeAutoObservable(this);
    setTimeout(() => {
      this.value = '2'
      console.log('变化了---', this.value);
      
    }, 3000);
  }

}

const globaData = createContext<GlobaData>(new GlobaData());

export function useGlobaData() {
  return useContext(globaData);
}

