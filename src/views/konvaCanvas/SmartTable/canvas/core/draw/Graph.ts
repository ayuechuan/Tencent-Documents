import Konva from "konva";
import { Config } from "../config/config";
import { TableCanvas } from "../../TableCanvas";
import { FeatureCanvas } from "../../FeatureCanvas";
import { SmartEvent } from "../events/Event";
import { History } from '../handle/History';
import { Clipboard } from '../handle/Clipboard';
import { Resizer } from "../handle/Resizer";

export class Graph {
  readonly stage: Konva.Stage;
  readonly tableCanvas: TableCanvas;
  readonly featureCanvas: FeatureCanvas;
  private readonly smartEvent: SmartEvent;
  private readonly history: History;
  private readonly clipboard: Clipboard;
  private readonly resizer: Resizer;

  constructor(
    private readonly config: Config
  ) {
    this.stage = new Konva.Stage({
      width: innerWidth - 350,
      height: innerHeight - 170,
      x: 0,
      y: 0,
      //  背景颜色
      container: '.smart-table-root'
    });

    this.smartEvent = new SmartEvent();
    this.history = new History();
    this.tableCanvas = new TableCanvas();
    this.featureCanvas = new FeatureCanvas();
    this.clipboard = new Clipboard();
    this.resizer = new Resizer();
    this.render();
    this.remove();
  }

  render() {
    const backgroudRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage.width(),
      height: this.stage.height(),
      fill: 'white',
    })
    this.tableCanvas.layer.add(backgroudRect);
    backgroudRect.moveToBottom();
    this.stage.add(this.tableCanvas.layer);
    this.stage.add(this.featureCanvas.layer);
  }

  remove() {
    const element = document.getElementsByClassName('konvajs-content')[0];
    if (!element) {
      return;
    }
    element.className = 'anyshare-canvas'
  }
}