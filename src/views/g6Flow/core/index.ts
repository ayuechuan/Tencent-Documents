import { DisplayObject, Group } from '@antv/g'
import * as g6 from '@antv/g6'

import { Backgrounds } from '../plugins/background'
import { CustomNode } from './node'
import { ExtendRect } from './test'
// Use your own iconfont.
const iconFont = document.createElement('script')
iconFont.src = '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js'
document.head.appendChild(iconFont)

g6.register(g6.ExtensionCategory.NODE, 'custom-Node', CustomNode)
g6.register(g6.ExtensionCategory.PLUGIN, 'back', Backgrounds)
g6.register(g6.ExtensionCategory.NODE, 'ExtendRect', ExtendRect)

export class CustomGraph {
  private graph!: g6.Graph
  constructor(instance: HTMLElement) {
    const startTime = new Date('2023-08-01').getTime()
    const diff = 3600 * 24 * 1000
    const timebarData = [10, 2, 3, 4, 15, 10, 5, 0, 3, 1].map((value, index) => ({
      time: new Date(startTime + index * diff),
      value,
      label: new Date(startTime + index * diff).toLocaleString(),
    }))
    this.graph = new g6.Graph({
      container: instance as HTMLElement,
      width: 1200,
      height: 800,
      // layout: {
      //   type: 'grid',
      //   cols: 7,
      // },
      layout: {
        type: 'grid',
      },
      behaviors: ['zoom-canvas', 'drag-canvas', 'drag-element'],
      autoFit: 'center',
      plugins: [
        { type: 'grid-line', follow: true },
        {
          type: 'back',
          width: '800px',
          height: '600px',
          backgroundImage:
            'url(https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*0Qq0ToQm1rEAAAAAAAAAAAAADmJ7AQ/original)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: 0,
        },
        {
          type: 'fullscreen',
        },
        // {
        //   type: 'toolbar',
        //   position: 'right-center',
        //   onClick: (item: any) => {
        //     alert('item clicked:' + item);
        //   },
        //   getItems: () => {
        //     // G6 内置了 9 个 icon，分别是 zoom-in、zoom-out、redo、undo、edit、delete、auto-fit、export、reset
        //     return [
        //       { id: 'zoom-in', value: 'zoom-in' },
        //       { id: 'zoom-out', value: 'zoom-out' },
        //       { id: 'redo', value: 'redo' },
        //       { id: 'undo', value: 'undo' },
        //       { id: 'edit', value: 'edit' },
        //       { id: 'delete', value: 'delete' },
        //       { id: 'auto-fit', value: 'auto-fit' },
        //       { id: 'export', value: 'export' },
        //       { id: 'reset', value: 'reset' },
        //       { id: 'icon-xinjian', value: 'new' },
        //       { id: 'icon-fenxiang', value: 'share' },
        //       { id: 'icon-chexiao', value: 'undo' },
        //     ];
        //   },
        // },
        // {
        //   type: 'watermark',
        //   text: 'G6: Graph Visualization',
        //   textFontSize: 14,
        //   textFontFamily: '',
        //   fill: 'rgba(0, 0, 0, 0.1)',
        //   rotate: Math.PI / 12,
        //   width: '800px',
        //   height: '600px',
        //   // type: 'watermark',
        //   // width: 200,
        //   // height: 100,
        //   // rotate: Math.PI / 12,
        //   // imageURL: 'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
        // },
        // {
        //   type: 'tooltip',
        //   getContent: (e:any, items:any) => {
        //     let result = `<h4>Custom Content</h4>`;
        //     items.forEach((item:any) => {
        //       result += `<p>Type: ${item.data.description}</p>`;
        //     });
        //     return result;
        //   },
        // },
      ],
      // padding:[50,50,50,50]
    })
    this.bind()
  }

  bind() {
    this.graph.on('node:click', (event: g6.IEvent) => {
      console.error('==', event)
    })
  }

  ready() {
    this.graph.setData(data)
    this.graph.render()
  }

  fullscreen() {
    const fullscreen = this.graph.getPluginInstance('fullscreen') as g6.Fullscreen
    fullscreen.request()
  }

  destory() {
    this.graph.destroy()
  }
}

const data: g6.GraphData = {
  // 点集
  nodes: [
    {
      id: 'node1', // String，该节点存在则必须，节点的唯一标识
      x: 0, // Number，可选，节点位置的 x 值
      y: 0, // Number，可选，节点位置的 y 值
      type: 'ExtendRect',
      fontSize: 12,
      style: {
        size: [100, 100],
        // fontSize: 12,
      },
      // data: {
      //   label: 'node-0', description: 'This is node-0.'
      //  }
    },
    {
      id: 'node2', // String，该节点存在则必须，节点的唯一标识
      x: 0, // Number，可选，节点位置的 x 值
      y: 0, // Number，可选，节点位置的 y 值
      r: 50,
      style: {
        r: 50,
      },
    },
  ],
  // 边集
  edges: [
    {
      source: 'node1', // String，必须，起始点 id
      target: 'node2', // String，必须，目标点 id,
    },
    // { source: '0', target: '1', data: { description: 'This is edge from node 0 to node 1.' } },
  ],
}
