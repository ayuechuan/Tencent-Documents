import { Rect, Stage } from "react-konva"
import { createElement } from "react"
import { Layer as LayerRef } from 'konva/lib/Layer'
import { IRect, Vector2d } from 'konva/lib/types'
import { Shape, ShapeConfig } from "konva/lib/Shape"
import { Group as typeGroup } from 'konva/lib/Group'
import { Shape as typeShape } from 'konva/lib/Shape'

import { makeAutoObservable, toJS } from "mobx"
import Konva from "konva"
import { getColumnOffset, getColumnStartIndexForOffset, getColumnStopIndexForStartIndex, getColumnWidth, getRowHeight, getRowOffset, getRowStartIndexForOffset, getRowStopIndexForStartIndex } from "../../common/helpers"
import { framesync } from "@/utils/Ainmation"
import { IProps } from "../model"
import { StageManager } from "./StageManager"
import { DataManagement } from "./DataManagement"


export type Item = {
  title: string;
  description: string;
} & Partial<{
  x: number;
  y: number;
  width: number;
  height: number;
  rowIndex: number;
  columnIndex: number;
  key: string;
}>

type Operator<T> = (input: T) => T;

export class OperationStore {
  constructor(private readonly dataManager: DataManagement) {
    makeAutoObservable(this);
  }

  public pipe(...operators: Operator<Item[]>[]): Operator<Item[]> {
    return (input: Item[]) => operators.reduce((acc, operator) => operator(acc), input);
  }

  public filterByKeyword(keyword: string): Operator<Item[]> {
    return (items: Item[]) => items.filter(item => item.title.includes(keyword));
  }

  public sortByTitle(): Operator<Item[]> {
    return (items: Item[]) => items.sort((a, b) => a.title.localeCompare(b.title));
  }

  public processItems(keyword: string) {
    const filteredAndSortedItems = this.pipe(
      this.filterByKeyword(keyword),
      this.sortByTitle()
    )(this.dataManager.items);

    this.dataManager.splice(filteredAndSortedItems);
  }



}