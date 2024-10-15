import Konva from "konva";

export class Container {
  // public readonly stage: Konva.Stage;
  constructor(public readonly stage : Konva.Stage) {
    // this.stage = new Konva.Stage({
    //   width: innerWidth - 200,
    //   height: innerHeight,
    //   x: 0,
    //   y: 0,
    //   container: '.smart-table-root'
    // });
    this.ready();
    this.replaceClassnames();
  }

  replaceClassnames(){
   const element = document.getElementsByClassName('konvajs-content')[0];
   if(!element){
    return;
   }

   element.className = 'canvas-root'
  //  root.classList.remove('konvajs-content');
  //  root.classList.add('smart-table-root');
  }

  add(layer: Konva.Layer | Konva.Layer[]) {
    if (layer instanceof Array) {
      layer.forEach(l => this.stage.add(l));
      return;
    }
    this.stage.add(layer);
  }

  ready() {
    
  }

}