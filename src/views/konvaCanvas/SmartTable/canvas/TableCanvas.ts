import Konva from "konva";
import { Container } from "./Container";

export class TableCanvas {
  public readonly layer: Konva.Layer;
  constructor(private readonly ontainer: Container) {
    this.layer = new Konva.Layer();
    // this.layer.add(new Konva.Text({
    //   x: 0,
    //   y: 0,
    //   text: 'hello word',
    //   fontSize: 20
    // }))

    // var freezeColumnGroup = new Konva.Group({
    //   x: 0,
    //   y: 0,
    //   name: 'container_cell',
    //   draggable: false,
    // });
    // var containerGroup = new Konva.Group({
    //   x: 320,
    //   y: 0,
    //   name: 'container_cell',
    //   draggable: false,
    // });

    // var box = new Konva.Rect({
    //   x: 10,
    //   y: 10,
    //   width: 100,
    //   height: 50,
    //   fill: 'red',
    //   stroke: 'black',
    // });

    // var yellowCircle = new Konva.Rect({
    //   x: 0,
    //   y: 0,
    //   width: 200,
    //   height: window.innerHeight,
    //   fill: 'yellow',
    //   stroke: 'black',
    // });

    // var blueCircle = new Konva.Rect({
    //   x: 0,
    //   y: 0,
    //   width: 400,
    //   height: window.innerHeight,
    //   fill: 'transparent',
    //   stroke: 'black',
    // });
    // // build node tree
    // containerGroup.add(yellowCircle);
    // containerGroup.add(box);
    // freezeColumnGroup.add(blueCircle);


    // this.layer.add(containerGroup);
    // this.layer.add(freezeColumnGroup);
    // box.moveTo(containerGroup)

  }



}