import Konva from "konva";
export class GroupCore {
  private layer: Konva.Layer;
  constructor() {
    const stage = new Konva.Stage({
      container: '.container-konva',
      width: 800,
      height: 800,
    });

    this.layer = new Konva.Layer();

    // const rect = new Konva.Rect({
    //   x: 150,
    //   y: 150,
    //   width: 100,
    //   height: 100,
    //   fill: '#1e6fff',
    // });

    // const rect1 = new Konva.Rect({
    //   x: 100,
    //   y: 100,
    //   width: 200,
    //   height: 200,
    //   fill: '#ffb5b1',
    //   opacity : 0.5
    // });
    // Bottom rectangle with blended color
    const rect = new Konva.Rect({
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      // fill: '#8f92d8', // Mixed color
      fill:'rgb(51, 112, 255)'
    });

    // Top rectangle
    const rect1 = new Konva.Rect({
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      fill: 'rgba(245, 74, 69, 0.55)',
      opacity: 1,
    });

    
    const rect3 = new Konva.Rect({
      x: 300,
      y: 300,
      width: 200,
      height: 200,
      fill: '#e58cbe',
      opacity: 1,
    });

    stage.add(this.layer);
    this.layer.add(rect, rect1 , rect3);
    rect.moveUp();

    // Create a dynamic group and add rectangles to it
    // const group = new Konva.Group({
    //   x: 0,
    //   y: 0,
    //   draggable: true,
    // });
    const { group, destory } = this.renderGroup();

    group.add(rect);
    group.add(rect1);
    this.layer.add(group);

    group.on('dragend', () => {
      console.log('group.children', group.children);

      // return;
      // Remove rectangles from the group
      const childrens = group.children;
      const maps = new Map<any, { x: number, y: number }>();


      childrens.forEach((child) => {
        // layer.add(child); // Add child directly back to the layer
        // // Update the child's position relative to the stage
        // child.x(group.x() + child.x());
        // child.y(group.y() + child.y());
        maps.set(child, { x: group.x() + child.x(), y: group.y() + child.y() })
      });

      const weakMap = new WeakMap<any, { x: number, y: number }>();


      const keys = maps.keys();
      while (true) {
        const item = keys.next();
        if (item.done) {
          break;
        }
        const value = maps.get(item.value);
        item.value.x(value?.x)
        item.value.y(value?.y);
        this.layer.add(item.value); // Add child directly back to the layer

        // item.value.x(value?.x)
        // item.value.y(value?.y);
      }
      // Destroy the group
      destory();
      // layer.draw(); // Redraw the layer
    });

  }

  private renderGroup() {
    const group = new Konva.Group({
      x: 0,
      y: 0,
      draggable: true,
    });

    return {
      group,
      destory() {
        group.destroy();
      }
    }
  }
}