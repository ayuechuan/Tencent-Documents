export interface User {
  //  连接时间
  loginTime: string;
  //  唯一id
  userID: string;
  //  分配一个标识color
  color: number;
  //  用户选择的 cells
  cells: [number, number, number, number]
  //  editing 是否正在编辑
  editing : boolean;
  //  用户名称
  name : string
}