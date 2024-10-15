
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';
import { IFeatureModel } from '../../model';
import Konva from 'konva';
import type { IRect, Vector2d } from 'konva/lib/types';
import { observer, watch } from '@/views/konvaCanvas/Board/utils/observer';
import { FeatureCanvas } from '../FeatureCanvas';
import { Store } from '../../store/Store';
import { toJS } from 'mobx';

@observer('model')
export class Search implements IFeatureModel {
  name = 'search';
  container!: Konva.Group;
  cell = { x: 0, y: 0, width: 0, height: 0 } as IRect;

  constructor(
    private readonly featureCanvas: FeatureCanvas,
    public readonly model?: Store
  ) { }
  onMouseDown(event: KonvaEventObject<any, Stage>): void {

  }

  bootstrap(): void {
    this.container = new Konva.Group({ visible: false });
    this.featureCanvas.add(this.container);
  }

  hide() {
    this.container.visible(false);
  }
  show() {
    this.container.visible(true);
  }

  @watch('activeCell')
  updated(cell: IRect): void {
    this.cell = cell;
    console.log('this.cell', this.cell);

    // this.paint();
  }
  addActivedEvents(): void { }
  removeActivedEvents(): void { }
  destroy(): void { }
  onScroll() { }

  private hasChildren() {
    return this.container.children.length > 0;
  }

  paint() {
    if (!this.container) {
      return;
    }
    const has = this.hasChildren();
    if (has) {
      const shape = this.container.children[0];
      shape.setAttrs(this.cell);
      return;
    }
    const rect = new Konva.Rect({
      ...this.cell,
      fill: '#FFFCEB'
    });
    this.container.add(rect);
    this.show();
  }
}