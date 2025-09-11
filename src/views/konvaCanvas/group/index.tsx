import { useMount } from "ahooks"
import { GroupCore } from "./core"


export function GroupKonva(){
  useMount(()=>{
    new GroupCore();
  })
  return <div className="container-konva">123</div>
}