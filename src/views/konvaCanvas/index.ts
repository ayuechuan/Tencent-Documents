import Konva from 'konva';
import { User } from '../SmartGridTable/socket/user';
export * from './CanvasLayout';

export const Colors = ['#000', '#EEE'];
export class UserRange {
  container!: Konva.Group;
  constructor(public readonly user: User) {
    //  结合表格插件的部分  计算出range的 { x , y , width , height }
    //  这里我就不贴具体的代码了 假如已经计算出来了
    const position = this.position(this.user.cells);
    this.container = new Konva.Group({
      name: `${this.user.userID}-selection`,
      ...position
    });

    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      //  背景透明
      fill: 'transparent',
      width: position.width,
      height: position.height,
      //  边框
      stroke: Colors[this.user.color],
      strokeWidth: 2
    })

    const bgRect = new Konva.Rect({
      x: position.x + position.width - 50,
      y: -20,
      fill: Colors[this.user.color],
      width: 50,
      height: 20
    })

    const nameText = new Konva.Text({
      x: position.x + position.width - 50,
      y: -20,
      text: this.user.name,
      fontSize: 12,
      fill: Colors[this.user.color],
      align: 'center',
      verticalAlign: 'middle',
      width: position.width,
      name: `${this.user.userID}-text`
    })
    this.container.add(rect, bgRect, nameText,)
  }

  private position(cells: [number, number, number, number]) {
    return {
      x: 0, y: 0, width: 0, height: 0
    }
  }
  //  更新选区
  updateRangeCells(cells: [number, number, number, number]) {
    const position = this.position(cells);
    this.container.setAttrs(position);
  }
  //  更新用户的编辑状态
  updateUserStatus(editing: boolean) {
    const textShape = this.container.find(`${this.user.userID}-text`)[0] as Konva.Text;
    if (!textShape) {
      return;
    }
    textShape.text(editing ? `${this.user.name}正在输入...` : this.user.name);
  }
}

type userid = string;
export class RangeManager {
  //  初始化
  //  增加一个user
  //  删除user
  //  更新某个user ( 这里我举例 更新user的选区和状态 )
  ranges: Map<userid, UserRange> = new Map();


  updateRange(userid: string, ops: [number, number, number, number] | boolean) {
    const userRange = this.ranges.get(userid);
    if (!userRange) {
      return;
    }

    if (typeof ops !== 'boolean' && ops !== userRange.user.cells) {
      userRange.updateRangeCells(ops);
    }

    if (typeof ops === 'boolean' && ops !== userRange.user.editing) {
      userRange.updateUserStatus(ops);
    }
  }
}
