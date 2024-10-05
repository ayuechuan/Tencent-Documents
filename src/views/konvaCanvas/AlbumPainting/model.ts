
export interface ItemProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rowIndex: number;
  columnIndex: number;
  key: string;
}

export interface IProps extends React.RefAttributes<any> {
  width: number
  height: number
  columnCount: number
  rowCount: number
  rowHeight: any
  columnWidth: any
  children: any
  scrollbarSize: number
  store: any
}