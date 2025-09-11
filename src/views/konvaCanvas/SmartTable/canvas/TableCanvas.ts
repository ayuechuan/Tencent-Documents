import Konva from "konva";
import { Container } from "./Container";

export class TableCanvas {
  public readonly layer: Konva.Layer;
  constructor() {
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
    //   draggable: true,
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

    // // 获取当前日期
    // const date = new Date();
    // const month = date.getMonth();
    // const year = date.getFullYear();
    // const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // // 初始绘制
    // this.drawCalendar(month, year);



    // 获取当前日期
const date = new Date();
let month = date.getMonth()-1;
let year = date.getFullYear();



// 初始绘制
// this.drawCalendar2(month, year);
  }


  // 获取该月的第一天和最后一天
 getDaysInMonth2(month : number, year : number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return {
      firstDay,
      lastDay,
      daysInMonth: lastDay.getDate(),
  };
}

  // 绘制日历
 drawCalendar2(month:number, year:number) {
  const { firstDay, lastDay, daysInMonth } = this.getDaysInMonth2(month, year);
  const daysOfWeek = [
    '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];

  // 日历单元格的尺寸
  const cellWidth = 100;
  const cellHeight = 80;

  // 绘制每个星期的标题
  daysOfWeek.forEach((day, index) => {
      const text = new Konva.Text({
          x: index * cellWidth,
          y: 0,
          text: day,
          fontSize: 20,
          fontFamily: 'Calibri',
          fill: 'black',
          width: cellWidth,
          align: 'center',
      });
      this.layer.add(text);
  });

  // 获取上一个月的最后一天
  const lastMonth = month === 0 ? 11 : month - 1;
  const lastMonthYear = month === 0 ? year - 1 : year;
  const { daysInMonth: lastDaysInMonth, firstDay: lastFirstDay } = 
  this.getDaysInMonth2(lastMonth, lastMonthYear);

  // 计算偏移量
  const startOffset = (firstDay.getDay() + 6) % 7; // 计算偏移，周一为0
  let dayCounter = 1;

  // 渲染上一个月的日期
  for (let i = 0; i < startOffset; i++) {
      const day = lastDaysInMonth - startOffset + 1 + i; // 计算上一个月的日期
      const x = i * cellWidth;
      const y = cellHeight; // 在第二行绘制
      const rect = new Konva.Rect({
          x: x,
          y: y,
          width: cellWidth,
          height: cellHeight,
          fill: '#fff',
          stroke: 'black',
          strokeWidth: 1,
      });
      this.layer.add(rect);

      const text = new Konva.Text({
          x: x,
          y: y + cellHeight / 4,
          text: day.toString(),
          fontSize: 24,
          fontFamily: 'Calibri',
          fill: 'gray', // 用灰色标记上个月的日期
          width: cellWidth,
          align: 'center',
      });
      this.layer.add(text);
  }

  // 渲染当前月份的日期
  for (let i = 0; i < daysInMonth; i++) {
      const x = (i + startOffset) % 7 * cellWidth;
      const y = Math.floor((i + startOffset) / 7) * cellHeight + cellHeight; // + cellHeight 为下移一行
      const rect = new Konva.Rect({
          x: x,
          y: y,
          width: cellWidth,
          height: cellHeight,
          fill: '#fff',
          stroke: 'black',
          strokeWidth: 1,
      });
      this.layer.add(rect);

      const text = new Konva.Text({
          x: x,
          y: y + cellHeight / 4,
          text: (i + 1).toString(),
          fontSize: 24,
          fontFamily: 'Calibri',
          fill: 'black',
          width: cellWidth,
          align: 'center',
      });
      this.layer.add(text);
  }

  // 渲染下一个月的日期
  const endOffset = (daysInMonth + startOffset) % 7;
  for (let i = 0; i < (7 - endOffset) % 7; i++) {
      const day = i + 1; // 下个月的日期
      const x = (daysInMonth + startOffset + i) % 7 * cellWidth;
      const y = Math.floor((daysInMonth + startOffset) / 7) * cellHeight + cellHeight;

      const rect = new Konva.Rect({
          x: x,
          y: y,
          width: cellWidth,
          height: cellHeight,
          fill: '#fff',
          stroke: 'black',
          strokeWidth: 1,
      });
      this.layer.add(rect);

      const text = new Konva.Text({
          x: x,
          y: y + cellHeight / 4,
          text: day.toString(),
          fontSize: 24,
          fontFamily: 'Calibri',
          fill: 'gray', // 用灰色标记下个月的日期
          width: cellWidth,
          align: 'center',
      });
      this.layer.add(text);
  }
}



  // 绘制日历
  drawCalendar(month: any, year: any) {
    // 清空图层
    this.layer.removeChildren();

    const { firstDay, lastDay, daysInMonth } = this.getDaysInMonth(month, year);
    const daysOfWeek = [
      '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];

    // 日历单元格的尺寸
    const cellWidth = 100;
    const cellHeight = 80;

    // 绘制每个星期的标题
    daysOfWeek.forEach((day, index) => {
      const text = new Konva.Text({
        x: index * cellWidth,
        y: 0,
        text: day,
        fontSize: 20,
        fontFamily: 'Calibri',
        fill: 'black',
        width: cellWidth,
        align: 'center',
      });
      this.layer.add(text);
    });

    // 绘制每一天的单元格
    for (let i = 0; i < daysInMonth; i++) {
      const day = i + 1;

      // 计算单元格的位置
      const date = new Date(year, month, day);
      const dayOfWeek = (date.getDay() + 6) % 7; // 计算周一到周日的偏移，周一为0，周日为6
      const x = dayOfWeek * cellWidth;
      const y = Math.floor((i + firstDay.getDay() + 6) / 7) * cellHeight + cellHeight;

      // 绘制单元格
      const rect = new Konva.Rect({
        x: x,
        y: y,
        width: cellWidth,
        height: cellHeight,
        fill: '#fff',
        stroke: 'black',
        strokeWidth: 1,
      });
      this.layer.add(rect);

      // 绘制天数
      const text = new Konva.Text({
        x: x,
        y: y + cellHeight / 4,
        text: day.toString(),
        fontSize: 24,
        fontFamily: 'Calibri',
        fill: 'black',
        width: cellWidth,
        align: 'center',
      });
      this.layer.add(text);

      // 为每个单元格添加点击事件
      rect.on('click', function () {
        alert(`You clicked on ${day}`);
      });
    }

    // 更新图层以显示内容
    this.layer.draw();
  }


  // 获取该月的第一天和最后一天
  getDaysInMonth(month: any, year: any) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return {
      firstDay,
      lastDay,
      daysInMonth: lastDay.getDate(),
    };
  }
}