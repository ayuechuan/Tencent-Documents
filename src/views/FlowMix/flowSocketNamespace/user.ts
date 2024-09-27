export interface RoomUser {
  //  连接时间
  loginTime: string;
  //  
  socketid: string;
  //  唯一id
  userID: string,

  //  用户当前操作的节点集合  ['nodeID']
  selectNodes: string[]
}