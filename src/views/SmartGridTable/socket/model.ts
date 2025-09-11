export enum SocketEventKey {
  room = 'room',
  joined = 'joined',
  reconnected = 'reconnected',
  refresh = 'refresh',
  smartsheet = 'smartsheet',
  authority = 'authority',
}

export enum SmartSheetEventKey {
  //  用户选择区域
  selection,
  //  修改单元格内容
  changCellText,
  //  修改列宽
  changeColumnWidth
}

export interface Events {
  //  [1, 2, 3, 4] | ' A1:B2'
  cells: [number, number, number, number] | 'string';
  //  超级表 事件
  event: SmartSheetEventKey;
  //  当前操作表
  sheetId : string;
}