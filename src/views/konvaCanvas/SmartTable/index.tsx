import { useMount } from "ahooks"
import { Container } from "./canvas/Container";
import { FeatureCanvas } from "./canvas/FeatureCanvas";
import { TableCanvas } from "./canvas/TableCanvas";
import React, {
  useRef,
  useCallback,
  useState,
  useMemo,
  createElement,
} from "react";
import { Stage, Layer, Group, Rect, Text, Shape, Image } from "react-konva";
import { getBoundedCells, getColumnOffset, getColumnStartIndexForOffset, getColumnStopIndexForStartIndex, getColumnWidth, getRowHeight, getRowOffset, getRowStartIndexForOffset, getRowStopIndexForStartIndex, itemKey } from "../common/helpers";
import Konva from "konva";
import { TagShapeNode } from "./canvas/createShapes/TagShape";
import { Store } from "./store/Store";
import { TTTT } from "./components";
import { useImage } from "react-konva-utils";
import { SmartSheet } from "./canvas/SmartSheet";
import { v4 as uuid } from 'uuid';
import { haveIntersection } from "@/utils";
import { Button, message, Space } from "tdesign-react";
import { IRect, Vector2d } from "konva/lib/types";
// import { CanvasKonvaCalendar, EventType } from "./bootstrap";
import { CanvasKonvaCalendar } from './testsssssss/core/index'
import { Gentt } from "./gentt";
// import CanvasKonvaCalendar from 'konva-calendar'

const Cell = ({
  rowIndex,
  columnIndex,
  x,
  y,
  width,
  height,
}: IChildrenProps) => {
  const group = useRef<Konva.Group>(null);

  let text = `${rowIndex}x${columnIndex}`;

  if (columnIndex === 0) {
    text = rowIndex + '';
  }

  // useMount(()=>{
  //   group.current?.cache();

  //   if(columnIndex === 0){
  //     group.current!.moveTo((window as any).refs)
  //   }

  // })

  return (
    <Group ref={group} name='container_cell'>
      <Rect
        x={x}
        y={y}
        height={height}
        width={width}
        fill="white"
        strokeWidth={0.2}
        stroke="rgba(0, 0, 0, 0.51)"
      />
      <Text
        x={x}
        y={y}
        height={height}
        width={width}
        text={text}
        verticalAlign="middle"
        align="center"
      />
    </Group>
  );
};

function formatDate(date: any) {
  const year = date.getFullYear(); // 获取年份
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份（注意：月份是从0开始的，因此要加1）
  const day = String(date.getDate()).padStart(2, '0'); // 获取日期

  return `${year}-${month}-${day}`; // 返回格式化后的字符串
}

let bootstrap: CanvasKonvaCalendar;
export function SmartTable() {


  useMount(() => {

    // new Gentt();


    // const layer = new Konva.Layer();
    // stage.add(layer);

    // // 创建一个可拖拽的矩形
    // const rect = new Konva.Rect({
    //   x: 50,
    //   y: 50,
    //   width: 100,
    //   height: 100,
    //   fill: 'blue',
    //   draggable: true,
    // });
    // layer.add(rect);
    // layer.draw();

    // let lastPosition = { x: 0, y: 0 };
    // let lastTime = 0;
    // let velocityX = 0;
    // let velocityY = 0;

    // rect.on('dragstart', () => {
    //   lastPosition = rect.position();
    //   lastTime = Date.now();
    // });

    // rect.on('dragmove', () => {
    //   const newPosition = rect.position();
    //   const newTime = Date.now();

    //   const dx = newPosition.x - lastPosition.x;
    //   const dy = newPosition.y - lastPosition.y;
    //   const dt = (newTime - lastTime) / 1000;

    //   velocityX = dx / dt;
    //   velocityY = dy / dt;

    //   lastPosition = newPosition;
    //   lastTime = newTime;
    // });

    // rect.on('dragend', () => {
    //   const maxDistance = 150; // 最大滑动距离限制

    //   // 计算合速度和角度，以确保滑动方向与最后拖动方向一致
    //   const speed = Math.sqrt(velocityX ** 2 + velocityY ** 2);
    //   const angle = Math.atan2(velocityY, velocityX);

    //   // 限制滑动的总距离
    //   const distance = Math.min(maxDistance, speed * 0.5);
    //   const inertiaDistanceX = distance * Math.cos(angle);
    //   const inertiaDistanceY = distance * Math.sin(angle);

    //   const finalX = Math.min(
    //     stage.width() - rect.width(),
    //     Math.max(0, rect.x() + inertiaDistanceX)
    //   );
    //   const finalY = Math.min(
    //     stage.height() - rect.height(),
    //     Math.max(0, rect.y() + inertiaDistanceY)
    //   );

    //   rect.to({
    //     x: finalX,
    //     y: finalY,
    //     duration: 0.5,
    //     easing: Konva.Easings.EaseOut
    //   })
    // });


    // return;
    // const sheet = new SmartSheet({}, '.smart-table-root')
    // const element = document.getElementsByClassName('.smart-table-root')[0]!;
    bootstrap = new CanvasKonvaCalendar({
      mode: 'edit',
      isAddTaskBtn: true,
      container: '.smart-table-root',
      width: innerWidth - 240,
      // initDate: new Date('2024-10-01')
    })

    bootstrap.setData([
      // {
      //   startTime: '2024-10-01',
      //   endTime: '2024-10-20',
      //   fill: 'rgba(0, 0, 255, 0.3)',
      //   description: '3 ',
      //   id: uuid()
      // },
      {
        startTime: '2024-10-04',
        endTime: '2024-10-05',
        fill: 'pink',
        description: '2 ',
        id: uuid()
      },
      // {
      //   startTime: '2024-10-10',
      //   endTime: '2024-10-12',
      //   fill: '#caeadb',
      //   description: '4',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-04',
      //   endTime: '2024-10-04',
      //   fill: 'rgba(214,241,255,0.6)',
      //   description: '555',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-09-30',
      //   endTime: '2024-09-30',
      //   fill: 'rgba(49, 116, 173,0.8)',
      //   description: '1',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-01',
      //   endTime: '2024-10-20',
      //   fill: '#fff5cc',
      //   description: '1',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-04',
      //   endTime: '2024-10-05',
      //   fill: 'pink',
      //   description: '2 ',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-01',
      //   endTime: '2024-10-20',
      //   fill: 'rgba(0, 0, 255, 0.3)',
      //   description: '3 ',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-10',
      //   endTime: '2024-10-12',
      //   fill: '#caeadb',
      //   description: '4',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-05',
      //   endTime: '2024-10-05',
      //   fill: 'rgba(214,241,255,0.6)',
      //   description: '666',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-05',
      //   endTime: '2024-10-05',
      //   fill: 'rgba(214,241,255,0.6)',
      //   description: '不敢说话',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-05',
      //   endTime: '2024-10-05',
      //   fill: 'rgba(214,241,255,0.6)',
      //   description: '说错了挨打',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-03',
      //   endTime: '2024-10-05',
      //   fill: 'rgba(214,241,255,0.6)',
      //   description: '辞退',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-22',
      //   endTime: '2024-10-23',
      //   fill: 'rgba(214,241,255,0.6)',
      //   description: '吃早饭',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-23',
      //   endTime: '2024-10-24',
      //   fill: 'pink',
      //   description: '吃午饭',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-09-30',
      //   endTime: '2024-10-01',
      //   fill: 'rgba(255, 0, 0, 0.5)',
      //   description: '吃干饭',
      //   id: uuid()
      // },
      // {
      //   startTime: '2024-10-23',
      //   endTime: '2024-10-26',
      //   fill: 'rgba(255, 0, 0, 0.5)',
      //   description: '吃晚饭',
      //   id: uuid()
      // },
      ...[
        // {
        //   startTime: '2024-09-30',
        //   endTime: '2024-09-30',
        //   fill: 'rgba(49, 116, 173,0.8)',
        //   description: '1',
        //   id: uuid()
        // },
        // {
        //   startTime: '2024-10-01',
        //   endTime: '2024-10-20',
        //   fill: '#fff5cc',
        //   description: '1',
        //   id: uuid()
        // },
        // {
        //   startTime: '2024-10-04',
        //   endTime: '2024-10-05',
        //   fill: 'pink',
        //   description: '2 ',
        //   id: uuid()
        // },
        // {
        //   startTime: '2024-10-01',
        //   endTime: '2024-10-20',
        //   fill: 'rgba(0, 0, 255, 0.3)',
        //   description: '3 ',
        //   id: uuid()
        // },
        // {
        //   startTime: '2024-10-10',
        //   endTime: '2024-10-12',
        //   fill: '#caeadb',
        //   description: '4',
        //   id: uuid()
        // },
        // {
        //   startTime: '2024-10-04',
        //   endTime: '2024-10-04',
        //   fill: 'rgba(214,241,255,0.6)',
        //   description: '555',
        //   id: uuid()
        // },
        // {
        //   startTime: '2024-10-11',
        //   endTime: '2024-10-11',
        //   fill: 'rgba(214,241,255,0.6)',
        //   description: '辞退',
        //   id: uuid()
        // },
        {
          startTime: '2024-10-22',
          endTime: '2024-10-23',
          fill: 'rgba(214,241,255,0.6)',
          description: '吃早饭',
          id: uuid()
        },
        {
          startTime: '2024-10-23',
          endTime: '2024-10-24',
          fill: 'pink',
          description: '吃午饭',
          id: uuid()
        },
        {
          startTime: '2024-09-30',
          endTime: '2024-10-01',
          fill: 'rgba(255, 0, 0, 0.5)',
          description: '吃干饭',
          id: uuid()
        },
        {
          startTime: '2024-10-23',
          endTime: '2024-10-26',
          fill: 'rgba(255, 0, 0, 0.5)',
          description: '吃晚饭',
          id: uuid()
        },
      ]

    ])

    bootstrap.on('ADDTASKRANGE', (day: string) => {
      console.log('添加任务', day);
    })
    bootstrap.on('CLICKRANGE', (day: string) => {
      console.log('选择日期', day);
    })
    bootstrap.on('CONTEXTMENU', (day: string) => {
      console.log('右键', day);
    })
    bootstrap.on('UPDATETASK', (source: any) => {
      console.log('任务更新', source);
    })
    bootstrap.on('CLICKSURPASSTIP', (day: string) => {
      console.log('查看所有选项', day);
    })
  })



  // useEffect(()=>{
  //   setTimeout(() => {
  //     const canvas = document.getElementById('canvas');
  //     const ctx = canvas.getContext('2d');

  //     function drawTextWithEllipsis(text, maxWidth, lineHeight, maxLines) {
  //         const words = splitText(text);
  //         let lines = [];
  //         let currentLine = '';
  //         let start = 0;

  //         while (start < words.length && lines.length < maxLines) {
  //             let [line, end] = findMaxFitLine(words, start, maxWidth);

  //             if (lines.length === maxLines - 1 && end < words.length) {
  //                 // 最后一行，添加省略号
  //                 while (ctx.measureText(line + '...').width > maxWidth) {
  //                     line = line.slice(0, -1); // 逐字删除，直到可以加省略号
  //                 }
  //                 line += '...';
  //             }

  //             lines.push(line);
  //             start = end;
  //         }

  //         // 绘制每一行文本
  //         lines.forEach((line, index) => {
  //             ctx.fillText(line, 0, (index + 1) * lineHeight);
  //         });
  //     }

  //     // 二分法查找可以在当前宽度内显示的最大词数
  //     function findMaxFitLine(words, start, maxWidth) {
  //         let low = start;
  //         let high = words.length;
  //         let line = '';

  //         while (low < high) {
  //             const mid = Math.floor((low + high) / 2);
  //             const testLine = words.slice(start, mid + 1).join('');

  //             if (ctx.measureText(testLine).width <= maxWidth) {
  //                 line = testLine; // 保存当前合适的行
  //                 low = mid + 1;   // 尝试扩展范围
  //             } else {
  //                 high = mid;      // 缩小范围
  //             }
  //         }

  //         return [line, low]; // 返回合适的行文本和结束索引
  //     }

  //     function splitText(text) {
  //         const regex = /[\u4e00-\u9fa5]|[a-zA-Z0-9]+/g;
  //         return text.match(regex) || [];
  //     }

  //     // 设置字体样式，确保测量和绘制的字体一致
  //     ctx.font = '16px Arial';
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     // 调用绘制函数
  //     drawTextWithEllipsis("腾讯文档是一study names others todo可多人111协作的在线文档，可以同时编辑...", 200, 20, 3);

  //   }, 200);
  //   // setTimeout(() => {
  //   //   const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
  //   //   console.log('canvas',canvas);

  //   //   canvas.width = 500;
  //   //   canvas.height = 500;
  //   //   const ctx = canvas.getContext('2d')!;

  //   //   function drawTextWithEllipsis(text:any, maxWidth:any, lineHeight:any, maxLines:any) {
  //   //       const words = splitText(text);
  //   //       const wordWidths = {} as any; // 用于缓存词的宽度
  //   //       let lines = [];
  //   //       let currentLine = '';
  //   //       let currentWidth = 0;

  //   //       for (let word of words) {
  //   //           let wordWidth = wordWidths[word] || ctx.measureText(word).width;
  //   //           wordWidths[word] = wordWidth; // 缓存测量结果

  //   //           if (currentWidth + wordWidth > maxWidth) {
  //   //               // 如果当前行加上这个词超出了最大宽度，则换行
  //   //               lines.push(currentLine.trim());
  //   //               currentLine = word;
  //   //               currentWidth = wordWidth;

  //   //               if (lines.length === maxLines - 1) {
  //   //                   // 如果已经到达最大行数，最后一行加省略号
  //   //                   while (currentWidth + ctx.measureText('...').width > maxWidth) {
  //   //                       word = word.slice(0, -1); // 逐渐减少字符，直到可以加上省略号
  //   //                       wordWidth = ctx.measureText(word).width;
  //   //                   }
  //   //                   currentLine = word + '...';
  //   //                   break;
  //   //               }
  //   //           } else {
  //   //               // 否则继续添加到当前行
  //   //               currentLine += word;
  //   //               currentWidth += wordWidth;
  //   //           }
  //   //       }

  //   //       lines.push(currentLine.trim());

  //   //       // 开始绘制每一行
  //   //       lines.forEach((line, index) => {
  //   //           ctx.fillText(line, 0, (index + 1) * lineHeight);
  //   //       });
  //   //   }

  //   //   function splitText(text:any) {
  //   //       const regex = /[\u4e00-\u9fa5]|[a-zA-Z0-9]+/g;
  //   //       return text.match(regex) || [];
  //   //   }

  //   //   // 设置字体样式，确保测量和绘制的字体一致
  //   //   ctx.font = '16px Arial';
  //   //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   //   // 调用绘制函数
  //   //   drawTextWithEllipsis("腾讯文档是一款可多人协作的在线文档，可以同时编辑...", 200, 20, 3);

  //   // }, 2000);
  // },[])

  // useMount(() => {
  //   const sheet = new SmartSheet({}, '.smart-table-root')
  //   const layer = sheet.core.graph.tableCanvas.layer;
  //   const featureLayer = sheet.core.graph.featureCanvas.layer;
  //   const stage = sheet.core.graph.stage;
  //   let hoverGroup: Konva.Group;
  //   const cellWidth = (window.innerWidth - 240) / 7;
  //   const cellHeight = (window.innerHeight - 50) / 5;
  //   //  按下
  //   stage.on('click tap', (event: any) => {
  //     console.log('event', event);
  //     findGroup(featureLayer, '.task-progress-group', (group) => {
  //       hoverGroup.setAttrs({
  //         x: group.children[0].attrs.x - 10,
  //         y: group.children[0].attrs.y - 25,
  //         visible: true
  //       })
  //       console.log('hoverGrouphoverGroup', hoverGroup);
  //       message.success(`点击事件-${group.attrs.name.split(' ')[1]}`)
  //     })

  //   })

  //   stage.on('mousemove', (event: any) => {
  //     findGroup(layer, '.dateCell', (group) => {
  //       // console.log('dateCelldateCell', group);
  //       const { x, y } = group.attrs;
  //       const { x: hoverX, y: hoverY } = hoverGroup.attrs;
  //       if (x === hoverX && y === hoverY) {
  //         return;
  //       }
  //       hoverGroup.setAttrs({
  //         x: group.children[0].attrs.x,
  //         y: group.children[0].attrs.y,
  //         visible: true
  //       })
  //     })
  //   })

  //   stage
  //     .on('mouseleave', (event: any) => {
  //       console.log('离开了');
  //       hoverGroup.setAttr('visible', false);
  //     })

  //   function findGroup(
  //     layer: Konva.Layer,
  //     findkey: string,
  //     resultCallback: (group: Konva.Group, rect: IRect, pointer: Vector2d) => void
  //   ) {
  //     const pointer = stage.getPointerPosition()!;
  //     const taskGroups = layer.find(findkey) as Konva.Group[];
  //     if (!taskGroups.length) {
  //       return;
  //     }
  //     for (let i = 0; i < taskGroups.length; i++) {
  //       const group = taskGroups[i];
  //       const rect = group.getClientRect();
  //       if (haveIntersection(rect, pointer)) {
  //         return resultCallback(group, rect, pointer);
  //       }
  //     }
  //   }

  //   // 获取当前日期
  //   const date = new Date();
  //   const stringDate = formatDate(date);
  //   let month = date.getMonth(); // 这里不减1，因为我们会显示当前月份
  //   let year = date.getFullYear();

  //   // 获取该月的第一天和最后一天
  //   function getDaysInMonth(month: any, year: any) {
  //     const firstDay = new Date(year, month, 1);
  //     const lastDay = new Date(year, month + 1, 0);
  //     return {
  //       firstDay,
  //       lastDay,
  //       daysInMonth: lastDay.getDate(),
  //     };
  //   }

  //   // 绘制日历
  //   function drawCalendar(month: any, year: any) {
  //     // 清空图层
  //     layer.removeChildren();

  //     const { firstDay, daysInMonth } = getDaysInMonth(month, year);
  //     const daysOfWeek = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];

  //     // 日历单元格的尺寸
  //     // const cellWidth = 100;
  //     // const cellHeight = 80;
  //     const cellWidth = (window.innerWidth - 240) / 7;
  //     const cellHeight = (window.innerHeight - 50) / 5;

  //     // 绘制每个星期的标题
  //     daysOfWeek.forEach((day, index) => {
  //       const text = new Konva.Text({
  //         x: index * cellWidth,
  //         y: 20,
  //         text: day,
  //         fontSize: 14,
  //         fontFamily: 'Calibri',
  //         fill: 'black',
  //         width: cellWidth,
  //         align: 'center',
  //       });
  //       layer.add(text);
  //     });

  //     // 计算偏移量
  //     const startOffset = (firstDay.getDay() + 6) % 7; // 计算偏移，周一为0
  //     let dayCounter = 1;

  //     // 渲染上一个月的日期
  //     const lastMonth = month === 0 ? 11 : month - 1;
  //     const lastMonthYear = month === 0 ? year - 1 : year;
  //     const { daysInMonth: lastDaysInMonth } = getDaysInMonth(lastMonth, lastMonthYear);

  //     for (let i = 0; i < startOffset; i++) {
  //       const day = lastDaysInMonth - startOffset + 1 + i; // 计算上一个月的日期
  //       const x = i * cellWidth;
  //       const y = cellHeight; // 在第二行绘制
  //       const id = `${year}-${month}-${(day)}`.replace(/-(\d)-/g, '-0\$1-').replace(/-(\d)$/g, '-0\$1');
  //       const group = new Konva.Group({
  //         name: 'dateCell',
  //         // id: `${year}-${month}-${day}`
  //         id: id,
  //       });

  //       const rect = new Konva.Rect({
  //         x: x,
  //         y: 40,
  //         width: cellWidth,
  //         height: cellHeight,
  //         fill: '#fff',
  //         stroke: '#E1E2E3',
  //         strokeWidth: 1,
  //       });
  //       // layer.add(rect);

  //       const text = new Konva.Text({
  //         x: x,
  //         y: 40 + cellHeight / 4,
  //         text: day.toString(),
  //         fontSize: 24,
  //         fontFamily: 'Calibri',
  //         fill: 'gray', // 用灰色标记上个月的日期
  //         width: cellWidth,
  //         align: 'center',
  //       });
  //       const monthText = new Konva.Text({
  //         x: x,
  //         // y: 40  + cellHeight / 4,
  //         y: 40 + cellHeight / 2,
  //         text: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
  //         fontSize: 14,
  //         fontFamily: 'Calibri',
  //         width: cellWidth,
  //         align: 'center',
  //       });

  //       group.add(rect, text, monthText);
  //       layer.add(group);
  //     }

  //     // 渲染当前月份的日期
  //     for (let i = 0; i < daysInMonth; i++) {
  //       const x = (i + startOffset) % 7 * cellWidth;
  //       const y = Math.floor((i + startOffset) / 7) * cellHeight + 40; // + cellHeight 为下移一行
  //       const id = `${year}-${month + 1}-${(i + 1)}`.replace(/-(\d)-/g, '-0\$1-').replace(/-(\d)$/g, '-0\$1');
  //       // const id = `${year}-${month + 1}-${(i + 1).toString().padStart(2, '0')}`;
  //       const group = new Konva.Group({
  //         name: 'dateCell',
  //         id
  //       });

  //       const activeDate = stringDate === id;
  //       const rect = new Konva.Rect({
  //         x: x,
  //         y: y,
  //         width: cellWidth,
  //         height: cellHeight,
  //         fill: '#fff',
  //         stroke: '#E1E2E3',
  //         strokeWidth: 1,
  //       });

  //       let Circlex = x + 21;
  //       let Circley = y + 18;
  //       let CircleRadius = 13;
  //       let fontSize = 20;
  //       let textContext = (i + 1).toString();
  //       if (textContext === '1') {
  //         textContext = month + 1 + '月'
  //         fontSize = 15;
  //         CircleRadius = 15
  //       }
  //       console.log('day', textContext);


  //       //  画一个蓝色的圆
  //       const circle = new Konva.Circle({
  //         x: Circlex,
  //         y: Circley,
  //         radius: CircleRadius,
  //         fill: activeDate ? '#1f6df6' : '#FFF',
  //         stroke: activeDate ? '#1f6df6' : '#FFF',
  //         strokeWidth: 1,
  //       });

  //       // layer.add(rect);
  //       const text = new Konva.Text({
  //         x: textContext?.length > 1 ? x + 10 : x + 15,
  //         y: textContext?.length > 1 ? y + 10 : y + 10,
  //         text: textContext,
  //         fontSize: fontSize,
  //         fontFamily: 'Calibri',
  //         fill: activeDate ? '#FFF' : 'black',
  //         width: cellWidth - 20,
  //         fontStyle: 'bold',
  //         // align: 'center',
  //       });
  //       // layer.add(text);

  //       // 添加月份名称
  //       const monthText = new Konva.Text({
  //         x: x,
  //         y: y + cellHeight / 2, // 调整位置以显示月份
  //         text: new Date(year, month).toLocaleString('default', { month: 'long' }),
  //         fontSize: 14,
  //         fontFamily: 'Calibri',
  //         fill: 'black',
  //         width: cellWidth,
  //         align: 'center',
  //       });


  //       group.add(rect, circle, text, monthText)
  //       layer.add(group);
  //     }

  //     // 渲染下一个月的日期
  //     const endOffset = (daysInMonth + startOffset) % 7;
  //     for (let i = 0; i < (7 - endOffset) % 7; i++) {
  //       const day = i + 1; // 下个月的日期
  //       const x = (daysInMonth + startOffset + i) % 7 * cellWidth;
  //       const y = Math.floor((daysInMonth + startOffset) / 7) * cellHeight + 40;
  //       const id = `${year}-${month + 2}-${(day).toString().padStart(2, '0')}`;
  //       const group = new Konva.Group({
  //         name: 'dateCell',
  //         // id: `${year}-${month + 2}-${day}`
  //         id
  //       });
  //       const rect = new Konva.Rect({
  //         x: x,
  //         y: y,
  //         width: cellWidth,
  //         height: cellHeight,
  //         fill: '#fff',
  //         stroke: '#E1E2E3',
  //         strokeWidth: 1,
  //       });
  //       // layer.add(rect);

  //       const text = new Konva.Text({
  //         x: x,
  //         y: y + cellHeight / 4,
  //         text: day.toString(),
  //         fontSize: 24,
  //         fontFamily: 'Calibri',
  //         fill: 'gray', // 用灰色标记下个月的日期
  //         width: cellWidth,
  //         align: 'center',
  //       });
  //       // layer.add(text);

  //       // 添加月份名称
  //       const monthText = new Konva.Text({
  //         x: x,
  //         y: y + cellHeight / 2, // 调整位置以显示月份
  //         text: new Date(year, month + 1).toLocaleString('default', { month: 'long' }),
  //         fontSize: 14,
  //         fontFamily: 'Calibri',
  //         fill: 'black',
  //         width: cellWidth,
  //         align: 'center',
  //       });
  //       // layer.add(monthText);
  //       group.add(rect, text, monthText)
  //       layer.add(group);
  //     }

  //     // const rect = new Konva.Rect({
  //     //   x: 300,
  //     //   y: 300,
  //     //   width: 120,
  //     //   height: 25,
  //     //   fill: '#d6e5ff',
  //     //   stroke: '#d6e5ff',
  //     //   strokeWidth: 1,
  //     //   cornerRadius: [3, 3, 3, 3]
  //     // });

  //     // const rect2 = new Konva.Rect({
  //     //   x: 300,
  //     //   y: 330,
  //     //   width: 120,
  //     //   height: 25,
  //     //   fill: '#f3d4d4',
  //     //   stroke: '#f3d4d4',
  //     //   strokeWidth: 1,
  //     //   cornerRadius: [3, 3, 3, 3]
  //     // });
  //     // layer.add(rect, rect2)

  //     function splitRanges(ranges) {
  //       const splitRangeByWeek = (
  //         startDate: any,
  //         endDate: any,
  //         fill: string,
  //         description: string,
  //         originTime: string
  //       ) => {
  //         const result = [];
  //         let currentStart = new Date(startDate);

  //         while (currentStart <= endDate) {
  //           const dayOfWeek = currentStart.getDay();
  //           let currentEnd;

  //           if (dayOfWeek === 0) {
  //             // If it's Sunday, current segment is a single day
  //             currentEnd = new Date(currentStart);
  //           } else {
  //             // Otherwise, go to the nearest Sunday or the end date
  //             currentEnd = new Date(currentStart);
  //             currentEnd.setDate(currentStart.getDate() + (7 - dayOfWeek));
  //             if (currentEnd > endDate) currentEnd = endDate;
  //           }

  //           result.push({
  //             startTime: currentStart.toISOString().split('T')[0],
  //             endTime: currentEnd.toISOString().split('T')[0],
  //             id: uuid(),
  //             fill,
  //             description,
  //             origin: originTime
  //           });

  //           // Move to the next day after the current segment
  //           currentStart = new Date(currentEnd);
  //           currentStart.setDate(currentStart.getDate() + 1);
  //         }

  //         return result;
  //       };

  //       return ranges.flatMap(range => {
  //         const startTime = new Date(range.startTime);
  //         const endTime = new Date(range.endTime);
  //         return splitRangeByWeek(startTime, endTime, range.fill, range.description, range.startTime);
  //       });
  //     }


  //     // function splitRanges(ranges) {
  //     //   const splitRangeByWeek = (startDate, endDate) => {
  //     //     const result = [];
  //     //     let currentStart = new Date(startDate);
  //     //     let currentEnd = new Date(startDate);

  //     //     while (currentStart <= endDate) {
  //     //       currentEnd = new Date(currentStart);
  //     //       const dayOfWeek = currentEnd.getDay();

  //     //       if (dayOfWeek === 0) {
  //     //         // Sunday, only one day segment
  //     //         currentEnd = currentStart;
  //     //       } else if (dayOfWeek >= 1 && dayOfWeek <= 6) {
  //     //         // From Monday to Saturday, go to the next Sunday or end date
  //     //         currentEnd.setDate(currentStart.getDate() + (7 - dayOfWeek));
  //     //         if (currentEnd > endDate) currentEnd = endDate;
  //     //       }

  //     //       result.push({
  //     //         startTime: currentStart.toISOString().split('T')[0],
  //     //         endTime: currentEnd.toISOString().split('T')[0]
  //     //       });

  //     //       // Move to the next start day
  //     //       currentStart = new Date(currentEnd);
  //     //       currentStart.setDate(currentStart.getDate() + 1);
  //     //     }

  //     //     return result;
  //     //   };

  //     //   return ranges.flatMap(range => {
  //     //     const startTime = new Date(range.startTime);
  //     //     const endTime = new Date(range.endTime);
  //     //     return splitRangeByWeek(startTime, endTime);
  //     //   });
  //     // }

  //     // 测试数据
  //     const ranges = [
  //       // { startTime: '2024-10-06', endTime: '2024-10-23', fill: '#f3d4d4', description: '第一条记录' },
  //       // { startTime: '2024-10-14', endTime: '2024-10-28', fill: '#f3d4d4', description: '第一条记录' }
  //       { startTime: '2024-10-01', endTime: '2024-10-20', fill: '#f3d4d4', description: '干早饭' },
  //       { startTime: '2024-10-19', endTime: '2024-10-19', fill: '#caeadb', description: '干午饭' },
  //       { startTime: '2024-10-15', endTime: '2024-10-17', fill: '#ccddf6', description: '干晚饭' },
  //       { startTime: '2024-10-16', endTime: '2024-10-17', fill: 'yellow', description: '睡大觉' },
  //     ];


  //     // const origin = [
  //     //   { id: 1, startTime: '2024-10-01', endTime: '2024-10-06' },
  //     //   { id: 2, startTime: '2024-10-07', endTime: '2024-10-13' },
  //     //   { id: 3, startTime: '2024-10-14', endTime: '2024-10-20' },
  //     //   { id: 4, startTime: '2024-10-15', endTime: '2024-10-18' },
  //     //   { id: 5, startTime: '2024-10-19', endTime: '2024-10-19' },
  //     //   { id: 6, startTime: '2024-10-16', endTime: '2024-10-17' },
  //     //   { id: 7, startTime: '2024-10-15', endTime: '2024-10-17' },
  //     // ]

  //     // function find(origin, item = { id: 1, startTime: '2024-10-01', endTime: '2024-10-06' }) {
  //     //   // Helper function to check if one range is within another
  //     //   function isWithin(item, parent) {
  //     //     const startItem = new Date(item.startTime);
  //     //     const endItem = new Date(item.endTime);
  //     //     const startParent = new Date(parent.startTime);
  //     //     const endParent = new Date(parent.endTime);

  //     //     return startItem >= startParent && endItem <= endParent && item.id !== parent.id;
  //     //   }

  //     //   // Find and return parent items that contain the current item
  //     //   const parents = origin.filter(parent => isWithin(item, parent));

  //     //   return parents;
  //     // }

  //     // const item = { id: 6, startTime: '2024-10-16', endTime: '2024-10-17' };
  //     // console.log("9999999999",find(origin, item));
  //     // console.log('=========100',splitRanges(ranges));







  //     // 调用函数
  //     const now = performance.now();
  //     const expectedResult = splitRanges(ranges) as {
  //       startTime: string, endTime: string, fill: string, description: string, origin: string
  //     }[];
  //     console.log("----120", (performance.now() - now) / 1000);
  //     console.log("----", expectedResult);
  //     console.log('childrens===', layer.children);

  //     expectedResult.forEach(range => {
  //       const width = Math.abs(calculateDaysDifference(range.endTime, range.startTime)) * cellWidth;
  //       const group = layer.find(`#${range.startTime}`)[0];
  //       if (!group) {
  //         return;
  //       }
  //       const groupRect = group.getClientRect();
  //       const parents = find(expectedResult, range as any)
  //       console.log('parents------', parents, range, group.attrs.id);

  //       const taskProgressGroup = new Konva.Group({
  //         name: `task-progress-group ${range.origin}`,
  //         id: group.attrs.id
  //       })

  //       console.log('taskProgressGroup', taskProgressGroup);

  //       const rect = new Konva.Rect({
  //         x: groupRect.x + 10,
  //         y: groupRect.y + 35 + (parents.length) * 25,
  //         width: width + cellWidth - 10,
  //         height: 20,
  //         fill: range.fill || '#f3d4d4',
  //         // stroke: range.fill || '#f3d4d4',
  //         // strokeWidth: 1,
  //         cornerRadius: [3, 3, 3, 3]
  //       });
  //       //  文本描述
  //       const text = new Konva.Text({
  //         x: groupRect.x + 20,
  //         y: groupRect.y + 35 + (parents.length) * 25 + 5,
  //         text: range.description || '无',
  //         fontSize: 12,
  //         fill: 'black'
  //       })
  //       taskProgressGroup.add(rect, text);
  //       featureLayer.add(taskProgressGroup);
  //     })


  //   }

  //   // 初始绘制
  //   drawCalendar(month, year);

  //   const group = new Konva.Group({
  //     visible: false,
  //     width: cellWidth,
  //     height: cellHeight,
  //     x: 0,
  //     y: 0,
  //     id: 'hoverGroup'
  //   })

  //   const rect = new Konva.Rect({
  //     x: 0,
  //     y: 0,
  //     width: cellWidth,
  //     height: cellHeight,
  //     fill: 'rgba(0, 0, 0, 0.053)',
  //     stroke: '#E1E2E3',
  //     strokeWidth: 0,
  //   })
  //   hoverGroup = group;
  //   group.add(rect)
  //   featureLayer.add(group)
  // })


  // 绘制任务的矩形
  // ranges.forEach(range => {
  //   const startDate = new Date(range.startTime);
  //   const endDate = new Date(range.endTime);

  //   // 确定任务的起始和结束日期在日历中的位置
  //   const startDay = startDate.getDate();
  //   const startMonth = startDate.getMonth(); // 注意：这仍然是基于零的
  //   const endDay = endDate.getDate();
  //   const endMonth = endDate.getMonth();

  //   // 计算起始日期在当前绘制月份中的位置
  //   const startX = (startDay - 1 + startOffset) % 7 * cellWidth;
  //   const startY = Math.floor((startDay - 1 + startOffset) / 7) * cellHeight + 40;

  //   // 计算结束日期在当前绘制月份中的位置
  //   const endX = (endDay - 1 + startOffset) % 7 * cellWidth;
  //   const endY = Math.floor((endDay - 1 + startOffset) / 7) * cellHeight + 40;

  //   // 计算宽度：计算结束日期和开始日期的跨度，计算宽度
  //   const width = (endDay - startDay + 1) * cellWidth;

  //   console.log('startX', startX, startY);


  //   // 绘制矩形
  //   const taskRect = new Konva.Rect({
  //     x: startX,
  //     y: startY,
  //     width: width,  // 正确的宽度
  //     height: cellHeight, // 只绘制一行高
  //     fill: range.fill,
  //     opacity: 0.7,
  //   });

  //   // 添加描述文本
  //   const taskText = new Konva.Text({
  //     x: startX + 5,
  //     y: startY + 5,
  //     text: range.description,
  //     fontSize: 14,
  //     fontFamily: 'Calibri',
  //     fill: 'black',
  //   });

  //   layer.add(taskRect);
  //   layer.add(taskText);
  // });


  function calculateDaysDifference(start: string, end: string) {
    const startDate = new Date(start) as any;
    const endDate = new Date(end) as any;

    // Get the difference in milliseconds
    const differenceInMilliseconds = endDate - startDate;

    // Convert milliseconds to days
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return differenceInDays;
  }

  // 示例
  const startTime = '2024-10-14';
  const endTime = '2024-10-21';
  const daysDifference = Math.abs(calculateDaysDifference(startTime, endTime));
  console.log("100000", daysDifference);  // 输出结果：7



  return (
    <div>
      <div style={{ width: '100%', height: '120px' }}>
        <Space>
          <Button type='button' onClick={() => {
            bootstrap.prevMonth();
          }}>上一月</Button>
          <Button type='button' onClick={() => {
            bootstrap.today();
          }} >今天</Button>
          <Button type='button' onClick={() => {
            bootstrap.nextMonth();
          }}>下一月</Button>

          <Button type='button' onClick={() => {
            // bootstrap.downImage();
            bootstrap.setData([
              {
                startTime: '2024-10-01',
                endTime: '2024-10-20',
                fill: 'rgba(0, 0, 255, 0.3)',
                description: '3 ',
                id: uuid()
              },
            ])
          }}>生成</Button>

        </Space>
        {/* <canvas id="canvas" style={{ width: '500px' , height : 500}}></canvas> */}
      </div>
      <div className="smart-table-root"></div>
    </div>
    // <div>

    //   <Grid {...defaultProps}>{Cell}</Grid>
    // </div>
  )
}


function findRelations(origin) {
  // Helper function to check if one range is within another
  function isWithin(range1, range2) {
    const start1 = new Date(range1.startTime);
    const end1 = new Date(range1.endTime);
    const start2 = new Date(range2.startTime);
    const end2 = new Date(range2.endTime);

    return start1 >= start2 && end1 <= end2;
  }

  // Copy the original array so we don't modify the original
  const result = origin.map(item => ({ ...item }));

  // Iterate over each time range
  result.forEach(current => {
    // Initialize parentId as an empty array
    current.parentId = [];

    // Check if the current range is within any other range
    result.forEach(other => {
      if (current.id !== other.id && isWithin(current, other)) {
        current.parentId.push(other.id);
      }
    });

    // Remove parentId if it's empty (i.e., no parent found)
    if (current.parentId.length === 0) {
      delete current.parentId;
    }
  });

  return result;
}
// console.log("00000000000000",findRelations(origin));

function find(origin, item = { id: 1, startTime: '2024-10-01', endTime: '2024-10-06' }) {
  // Helper function to check if one range is within another
  function isWithin(item, parent) {
    const startItem = new Date(item.startTime);
    const endItem = new Date(item.endTime);
    const startParent = new Date(parent.startTime);
    const endParent = new Date(parent.endTime);

    return startItem >= startParent && endItem <= endParent && item.id !== parent.id;
  }

  // Find and return parent items that contain the current item
  const parents = origin.filter(parent => isWithin(item, parent));

  return parents;
}

export interface IProps {
  width: number;
  height: number;
  columnCount: number;
  rowCount: number;
  rowHeight: TItemSize;
  columnWidth: TItemSize;
  children: RenderComponent;
  scrollbarSize: number;
}

const defaultProps = {
  width: innerWidth - 280,
  height: innerHeight - 50,
  rowCount: 200,
  columnCount: 200,
  rowHeight: () => 52,
  columnWidth: (i: number) => {
    if (i === 0) {
      return 45
    }
    if (i <= 2) {
      return 150
    }
    return 300
  },
  scrollbarSize: 20,
};

type RenderComponent = React.FC<IChildrenProps>;

export interface IChildrenProps extends ICell {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TItemSize = (index?: number) => number;

export interface IArea {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ICell {
  rowIndex: number;
  columnIndex: number;
}

export interface IInstanceProps {
  columnMetadataMap: TCellMetaDataMap;
  rowMetadataMap: TCellMetaDataMap;
  lastMeasuredColumnIndex: number;
  lastMeasuredRowIndex: number;
}

export type TCellMetaDataMap = Record<number, TCellMetaData>;
export type TCellMetaData = {
  offset: number;
  size: number;
};

/**
 * Grid component
 * @param props
 */
const Grid: React.FC<IProps> = (props) => {
  const {
    width: containerWidth,
    height: containerHeight,
    rowHeight,
    columnWidth,
    rowCount,
    columnCount,
    scrollbarSize,
    children,
  } = props;
  const stageRef = useRef<Konva.Stage>(null);

  useMount(() => {
    setTimeout(() => {
      // const store = new Store();
      // const container = new Container(stageRef.current!);
      // const tableLayer = new TableCanvas(container);
      // const featureLayer = new FeatureCanvas(container, store);
      // container.add([
      //   tableLayer.layer, featureLayer.layer])
      // featureLayer.bootstrap();
    }, 200);
  })

  const instanceProps = useRef<IInstanceProps>({
    columnMetadataMap: {},
    rowMetadataMap: {},
    lastMeasuredColumnIndex: -1,
    lastMeasuredRowIndex: -1,
  });
  const verticalScrollRef = useRef<HTMLDivElement>(null);
  const wheelingRef = useRef<number | null>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(346);

  const groupRef = useRef<Konva.Group>(null);
  const groupTopRef = useRef<Konva.Group>(null);

  const handleScroll = useCallback((e: any) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  const handleScrollLeft = useCallback((e: any) => {
    setScrollLeft(e.target.scrollLeft);
  }, []);
  const scrollHeight = rowCount * rowHeight();
  const scrollWidth = columnCount * columnWidth();
  const [selectedArea, setSelectedArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const boundedCells = useMemo(() => getBoundedCells(selectedArea), [
    selectedArea,
  ]);
  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (wheelingRef.current) return;
    const { deltaX, deltaY, deltaMode } = event.nativeEvent;
    let dx = deltaX;
    let dy = deltaY;

    if (deltaMode === 1) {
      dy = dy * 17;
    }
    if (!horizontalScrollRef.current || !verticalScrollRef.current) return;
    const x = horizontalScrollRef.current?.scrollLeft;
    const y = verticalScrollRef.current?.scrollTop;
    wheelingRef.current = window.requestAnimationFrame(() => {
      wheelingRef.current = null;
      if (horizontalScrollRef.current)
        horizontalScrollRef.current.scrollLeft = x + dx;
      if (verticalScrollRef.current)
        verticalScrollRef.current.scrollTop = y + dy;
    });
  }, []);

  const rowStartIndex = getRowStartIndexForOffset({
    itemType: "row",
    rowHeight,
    columnWidth,
    rowCount,
    columnCount,
    instanceProps: instanceProps.current,
    offset: scrollTop,
  });
  const rowStopIndex = getRowStopIndexForStartIndex({
    startIndex: rowStartIndex,
    rowCount,
    rowHeight,
    columnWidth,
    scrollTop,
    containerHeight,
    instanceProps: instanceProps.current,
  });
  const columnStartIndex = getColumnStartIndexForOffset({
    itemType: "column",
    rowHeight,
    columnWidth,
    rowCount,
    columnCount,
    instanceProps: instanceProps.current,
    offset: scrollLeft,
  });
  // const columnStartIndex = 3;
  const columnStopIndex = getColumnStopIndexForStartIndex({
    startIndex: columnStartIndex,
    columnCount,
    rowHeight,
    columnWidth,
    scrollLeft,
    containerWidth,
    instanceProps: instanceProps.current,
  });

  const items = [];
  if (columnCount > 0 && rowCount) {
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
      for (
        let columnIndex = columnStartIndex;
        columnIndex <= columnStopIndex;
        columnIndex++
      ) {
        const width = getColumnWidth(columnIndex, instanceProps.current);
        const x = getColumnOffset({
          index: columnIndex,
          rowHeight,
          columnWidth,
          instanceProps: instanceProps.current,
        });
        const height = getRowHeight(rowIndex, instanceProps.current);
        const y = getRowOffset({
          index: rowIndex,
          rowHeight,
          columnWidth,
          instanceProps: instanceProps.current,
        });
        items.push(
          createElement(children, {
            x,
            y,
            width,
            height,
            rowIndex,
            columnIndex,
            name: 'container_cell',
            key: itemKey({ rowIndex, columnIndex }),
          })
        );
      }
    }
  }


  // useMount(() => {
  //   console.log('(window as any).refs', groupRef.current);
  //   const rowStartIndex = getRowStartIndexForOffset({
  //     itemType: "row",
  //     rowHeight,
  //     columnWidth,
  //     rowCount,
  //     columnCount,
  //     instanceProps: instanceProps.current,
  //     offset: scrollTop,
  //   });
  //   const rowStopIndex = getRowStopIndexForStartIndex({
  //     startIndex: rowStartIndex,
  //     rowCount,
  //     rowHeight,
  //     columnWidth,
  //     scrollTop,
  //     containerHeight,
  //     instanceProps: instanceProps.current,
  //   });
  //   const columnStartIndex = 0;
  //   const columnStopIndex = 2

  //   const items = [];
  //   if (columnCount > 0 && rowCount) {
  //     for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
  //       for (
  //         let columnIndex = columnStartIndex;
  //         columnIndex <= columnStopIndex;
  //         columnIndex++
  //       ) {
  //         const width = getColumnWidth(columnIndex, instanceProps.current);
  //         const x = getColumnOffset({
  //           index: columnIndex,
  //           rowHeight,
  //           columnWidth,
  //           instanceProps: instanceProps.current,
  //         });
  //         const height = getRowHeight(rowIndex, instanceProps.current);
  //         const y = getRowOffset({
  //           index: rowIndex,
  //           rowHeight,
  //           columnWidth,
  //           instanceProps: instanceProps.current,
  //         });
  //         const text = `${rowIndex}x${columnIndex}`
  //         const group = new Konva.Group();
  //         const rect = new Konva.Rect({
  //           x,
  //           y,
  //           width,
  //           height,
  //           fill: '#EEE',
  //           strokeWidth: 0.2,
  //           stroke: 'rgba(0, 0, 0, 0.51)',
  //         })

  //         const textShape = new Konva.Text({
  //           x,
  //           y,
  //           width,
  //           height,
  //           text: '' + rowIndex,
  //           verticalAlign: 'middle',
  //           align: 'center',
  //         })
  //         group.add(rect, textShape);
  //         groupRef.current?.add(group);
  //         // groupRef.current?.removeChildren();


  //         // const tagNode = new TagShapeNode({
  //         //   rectConfig: {
  //         //     x,
  //         //     y,
  //         //     width,
  //         //     height,
  //         //     fill: 'white',
  //         //     strokeWidth: 0.2,
  //         //     stroke: 'rgba(0, 0, 0, 0.51)',
  //         //   },
  //         //   textConfig: {
  //         //     x,
  //         //     y,
  //         //     text: '进行中',
  //         //     fill: Math.random() * 10 > 4 ? '#de3c36' : Math.random() * 10 > 6 ? '#4faa7a' : '#f3e196',
  //         //     verticalAlign: 'middle',
  //         //     align: 'center',
  //         //   }
  //         // });
  //         // groupRef.current?.add(tagNode);

  //         // items.push(
  //         //   createElement(children, {
  //         //     x,
  //         //     y,
  //         //     width,
  //         //     height,
  //         //     rowIndex,
  //         //     columnIndex,
  //         //     key: itemKey({ rowIndex, columnIndex }),
  //         //   })
  //         // );
  //       }
  //     }
  //   }

  // })


  // useMount(() => {
  //   // const rowStartIndex = getRowStartIndexForOffset({
  //   //   itemType: "row",
  //   //   rowHeight,
  //   //   columnWidth,
  //   //   rowCount,
  //   //   columnCount,
  //   //   instanceProps: instanceProps.current,
  //   //   offset: scrollTop,
  //   // });
  //   // const rowStopIndex = getRowStopIndexForStartIndex({
  //   //   startIndex: rowStartIndex,
  //   //   rowCount,
  //   //   rowHeight,
  //   //   columnWidth,
  //   //   scrollTop,
  //   //   containerHeight,
  //   //   instanceProps: instanceProps.current,
  //   // });
  //   const columnStartIndex = getColumnStartIndexForOffset({
  //     itemType: "column",
  //     rowHeight,
  //     columnWidth,
  //     rowCount,
  //     columnCount,
  //     instanceProps: instanceProps.current,
  //     offset: scrollLeft,
  //   });
  //   // const columnStartIndex = 3;
  //   const columnStopIndex = getColumnStopIndexForStartIndex({
  //     startIndex: columnStartIndex,
  //     columnCount,
  //     rowHeight,
  //     columnWidth,
  //     scrollLeft,
  //     containerWidth,
  //     instanceProps: instanceProps.current,
  //   });

  //   const rowStartIndex = 0;
  //   const rowStopIndex = 0;
  //   if (columnCount > 0 && rowCount) {
  //     for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
  //       for (
  //         let columnIndex = columnStartIndex;
  //         columnIndex <= columnStopIndex;
  //         columnIndex++
  //       ) {
  //         const width = getColumnWidth(columnIndex, instanceProps.current);
  //         const x = getColumnOffset({
  //           index: columnIndex,
  //           rowHeight,
  //           columnWidth,
  //           instanceProps: instanceProps.current,
  //         });
  //         const height = getRowHeight(rowIndex, instanceProps.current);
  //         const y = getRowOffset({
  //           index: rowIndex,
  //           rowHeight,
  //           columnWidth,
  //           instanceProps: instanceProps.current,
  //         });
  //         const text = `${rowIndex}x${columnIndex}`
  //         const group = new Konva.Group();
  //         const rect = new Konva.Rect({
  //           x,
  //           y,
  //           width,
  //           height,
  //           fill: '#EEE',
  //           strokeWidth: 0.2,
  //           stroke: 'rgba(0, 0, 0, 0.51)',
  //         })

  //         const textShape = new Konva.Text({
  //           x,
  //           y,
  //           width,
  //           height,
  //           text: '' + columnIndex,
  //           verticalAlign: 'middle',
  //           align: 'center',
  //         })
  //         group.add(rect, textShape);
  //         groupRef.current?.add(group);
  //       }
  //     }
  //   }


  // })



  // useMount(() => {
  // })
  const [img2] = useImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALESURBVHgB7Zo9bNNAFICfk5SkpUlZ6FBR4QEpSF0QygJTygRLCQsMCEjEQjcW2BiibiztFhbUCNElC4WFMZnSAaiyIFGpEhFIHcpCE36S0tS8Z3yVk2I7rjqcfe+TTs7Zz6d8vvP5TncADKME2rCBhmFk8aCDvHzH1NA0rTlMsKe4Jbzc7hr61s4+tHcNkJGpVMRMSBlT0esBuIqjdA4Pr1bWd6FU7wDKg8yQ+MK1UciciTUxO+sm7yX++Vm9q5fWOhAknt86SfKrKH7DKSbidAGl81ut/cBJE6V6lw45dDjlFBNxuV//tN2DIPL+6574qTvFuIq3O3K/00NwpBoPNSyuGiyuGixux/rwn00lNJiaCN6zscbsxAWnmL4hKwrreFjElBPj8mRcgzcfcay+1gWapMhMZjoKj7OjkJ6MAo46xQNoYirj8LVojz0Qt6SrG996+tNq52D0kz4dhQeX43AeC7tf+Smt/NzMCCxcHYPBCdXczAmYx/+PD4HkCyLeLr6M0vmbL378t2Aa+AOWRfKyQa9j5c44rHyglnl4bkE1X7k7Tq23gPJlOme2Bau280/e/nYsnK5lpmNmC5ANnImZNew0oaJm/3LdnLjcE+dEL6DTjVjjjoXTzZTSk/J1dlfOjUB1849rTHXTfHWzIt8n7gWJy0gyAdDymFANTrj4O64aLK4aLK4aLK4aLK4aLK4aLK4aLK4aLK4ayorHwCepeMS+UhFYfIs/mk2YSTbefdnzFe9L/OHqL3NJSUb8bkXzJU6Fy77XbVi4V1cNZcSTif6+SYg36BMla8d1HFiLnU2RN8Vx6bSBhxqtI4cVy+21yNubevH2xTjMXwqXPLXipetjNOhqYnZJnB/cCkLbtBdp8+7Gdg9aIfh00RIyytfwZ8G+jfvQS21tEsjCv40zExBsdjDR9u0aMAzDMAwTGv4Cfmnwxm+8LqoAAAAASUVORK5CYII=');

  const [clone, setClone] = useState<any>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  return (
    <div style={{ position: "relative", width: containerWidth + 20 }}>
      <div
        style={{
          height: containerHeight,
          overflow: "scroll",
          position: "absolute",
          right: 0,
          top: 0,
          width: scrollbarSize,
          background: "#666",
        }}
        onScroll={handleScroll}
        ref={verticalScrollRef}
      >
        <div
          style={{
            position: "absolute",
            height: scrollHeight,
            width: 1,
          }}
        />
      </div>
      <div
        style={{
          overflow: "scroll",
          position: "absolute",
          bottom: -scrollbarSize,
          left: 0,
          width: containerWidth,
          height: scrollbarSize,
          background: "#666",
        }}
        onScroll={handleScrollLeft}
        ref={horizontalScrollRef}
      >
        <div
          style={{
            position: "absolute",
            width: scrollWidth,
            height: 1,
          }}
        />
      </div>
      <div onWheel={handleWheel} tabIndex={-1}>
        <Stage
          ref={stageRef}
          width={containerWidth}
          height={containerHeight}
          onMouseMove={(event) => {
            if (event.target?.parent?.attrs?.name === 'freeSeats' ||
              event.target?.parent?.attrs?.name === 'occupiedSeats'
            ) {

              const group = event.target?.parent as Konva.Group;
              const pointer = group.getClientRect();

              setClone({
                ...event.target.attrs,
                ...pointer,
                image: img2
              })
            } else {
              setClone({
                x: 0,
                y: 0,
                width: 0,
                height: 0
              })
            }
          }}

        // scaleX={1.5}
        // scaleY={1.5}
        >
          <Layer>
            {clone.width > 0 ? <Group name="occupiedSeats">
              <Image
                strokeEnabled={false}
                fill="#EEE"
                {...clone}
              />
            </Group> : null}

            {/* <Group offsetY={scrollTop} offsetX={scrollLeft}>
              {items}
            </Group>

            <Group
              width={200}
              height={1000}
              x={0}
              y={0}
              ref={groupRef}
              name="left"
            >
            </Group>
            <Group
              width={1000}
              height={40}
              x={0}
              y={0}
              ref={groupTopRef}
              name="top"
            >
            </Group> */}

            {/* <Group
              offsetY={0}
              offsetX={0}
              clipX={200}
              clipY={200}
              clipWidth={innerWidth - 200 - 200}
              clipHeight={innerHeight - 200 - 200}
            // ref={groupRef}
            >
              <CellRenderer
                x={20}
                y={20}
                width={400}
                height={400}
                rowIndex={1}
                columnIndex={1}
                strokeTopColor={'yellow'}
                strokeRightColor={'red'}
                strokeBottomColor={'red'}
                strokeLeftColor={'red'}
                key='1551'
              />
            </Group> */}

            {/* <CellRenderer
              x={20}
              y={20}
              width={200}
              height={200}
              rowIndex={1}
              columnIndex={1}
              strokeTopColor={'red'}
              strokeRightColor={'red'}
              strokeBottomColor={'red'}
              strokeLeftColor={'red'}
              key='1551'
            /> */}
            {/* <CellRenderer
              x={220}
              y={20}
              width={200}
              height={200}
              rowIndex={12}
              columnIndex={12}
              strokeTopColor={'red'}
              strokeRightColor={'red'}
              strokeBottomColor={'red'}
              strokeLeftColor={'red'}
              key='15510'
            />

            <Rect
              x={300}
              y={400}
              fill={'#EEE'}
              stroke={'red'}
              strokeWidth={1}
              hitStrokeWidth={1}
              // dash={[10, 10]}
              width={200}
              height={200}
            />
            <Rect
              x={500}
              y={400}
              fill={'#EEE'}
              stroke={'red'}
              strokeWidth={1}
              hitStrokeWidth={1}
              // dash={[10, 10]}
              width={200}
              height={200}
            /> */}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};



export const getOffsetFromWidth = (width: number) => {
  return width / 2 - 0.5
}

const CellOverlay: React.FC<any> = memo(props => {
  const {
    x,
    y,
    width,
    height,
    strokeTopColor = 'red',
    strokeRightColor = 'red',
    strokeBottomColor = 'red',
    strokeLeftColor = 'red',
    strokeTopDash = [],
    strokeRightDash = [],
    strokeBottomDash = [],
    strokeLeftDash = [],
    strokeTopWidth,
    strokeRightWidth,
    strokeBottomWidth,
    strokeLeftWidth,
    lineCap
  } = props;

  console.log('props', props);


  const userStroke =
    strokeTopColor || strokeRightColor || strokeBottomColor || strokeLeftColor;
  // if (!userStroke) return null;
  return (
    <Shape
      x={x}
      y={y}
      width={width}
      height={height}
      sceneFunc={(context, shape) => {
        /* Top border */
        if (strokeTopColor) {
          context.beginPath();
          context.moveTo(
            strokeLeftColor ? -getOffsetFromWidth(strokeLeftWidth) : 0,
            0.5
          );
          context.lineTo(
            shape.width() +
            (strokeRightColor ? getOffsetFromWidth(strokeRightWidth) + 1 : 1),
            0.5
          );
          context.setAttr("strokeStyle", strokeTopColor);
          context.setAttr("lineWidth", strokeTopWidth);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeTopDash);
          context.stroke();
        }
        /* Bottom border */
        if (strokeBottomColor) {
          context.beginPath();
          context.moveTo(
            strokeLeftColor ? -getOffsetFromWidth(strokeLeftWidth) : 0,
            shape.height() + 0.5
          );
          context.lineTo(
            shape.width() +
            (strokeRightColor ? getOffsetFromWidth(strokeRightWidth) + 1 : 1),
            shape.height() + 0.5
          );
          context.setAttr("lineWidth", strokeBottomWidth);
          context.setAttr("strokeStyle", strokeBottomColor);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeBottomDash);
          context.stroke();
        }
        /* Left border */
        if (strokeLeftColor) {
          context.beginPath();
          context.moveTo(
            0.5,
            strokeTopColor ? -getOffsetFromWidth(strokeTopWidth) : 0
          );
          context.lineTo(
            0.5,
            shape.height() +
            (strokeBottomColor
              ? getOffsetFromWidth(strokeBottomWidth) + 1
              : 1)
          );
          context.setAttr("strokeStyle", strokeLeftColor);
          context.setAttr("lineWidth", strokeLeftWidth);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeLeftDash);
          context.stroke();
        }
        /* Right border */
        if (strokeRightColor) {
          context.beginPath();
          context.moveTo(
            shape.width() + 0.5,
            strokeTopColor ? -getOffsetFromWidth(strokeTopWidth) : 0
          );
          context.lineTo(
            shape.width() + 0.5,
            shape.height() +
            (strokeBottomColor
              ? getOffsetFromWidth(strokeBottomWidth) + 1
              : 1)
          );
          context.setAttr("strokeStyle", strokeRightColor);
          context.setAttr("lineWidth", strokeRightWidth);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeRightDash);
          context.stroke();
        }
      }}
    />
  );
});



const CellRenderer = (props: any) => {
  const {
    x,
    y,
    width,
    height,
    stroke,
    strokeTopColor = stroke,
    strokeRightColor = stroke,
    strokeBottomColor = stroke,
    strokeLeftColor = stroke,
    strokeDash = [],
    strokeTopDash = [],
    strokeRightDash = [],
    strokeBottomDash = [],
    strokeLeftDash = [],
    strokeWidth = 1,
    strokeTopWidth = strokeWidth,
    strokeRightWidth = strokeWidth,
    strokeBottomWidth = strokeWidth,
    strokeLeftWidth = strokeWidth,
    lineCap = "butt",
  } = props;
  const userStroke =
    strokeTopColor || strokeRightColor || strokeBottomColor || strokeLeftColor;
  console.log('userStroke', userStroke);

  // if (!userStroke) return null;
  return (
    <CellOverlay
      key={'51515'}
      x={x}
      y={y}
      width={width}
      height={height}
      strokeTopColor={strokeTopColor}
      strokeRightColor={strokeRightColor}
      strokeBottomColor={strokeBottomColor}
      strokeLeftColor={strokeLeftColor}
      strokeDash={strokeDash}
      strokeTopDash={strokeTopDash}
      strokeRightDash={strokeRightDash}
      strokeBottomDash={strokeBottomDash}
      strokeLeftDash={strokeLeftDash}
      strokeTopWidth={strokeTopWidth}
      strokeRightWidth={strokeRightWidth}
      strokeBottomWidth={strokeBottomWidth}
      strokeLeftWidth={strokeLeftWidth}
      lineCap={lineCap}
    />
  );
};