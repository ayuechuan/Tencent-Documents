import { makeObservable, observable, ObservableMap } from 'mobx'
import { io, Socket } from 'socket.io-client'
import { message } from 'tdesign-react'
import { Events, SmartSheetEventKey, SocketEventKey } from './model'
import { User } from './user'
import { RangeManager } from '@/views/konvaCanvas'

export class SocketClient {
  private socket!: Socket;
  private readonly userid = localStorage.getItem('userid') || Math.random() * 1000 + '';
  public users = observable.map<string, User>();

  constructor(
    private readonly rangeManager: RangeManager,
    //  表格插件
    private readonly smartSheetCore: any
  ) {
    //  只观察 users
    makeObservable(this, { users: observable });
    //  监听选择区域
    this.smartSheetCore.on('selectionMove', (event: { cells: any }) => {
      if (!this.socket) {
        return;
      }
      //  触发的太频繁了 为了减轻redis服务器的压力 最好加个节流
      this.socket.emit(SocketEventKey.smartsheet, {
        cells: event.cells,
        event: SmartSheetEventKey.selection,
        sheetId: '123'
      })
    })
  }

  get userItems() {
    return Array.from(this.users.values())
  }

  private each<T>(map: ObservableMap<string, T>, cb: (value: T) => void) {
    const values = map.values();
    while (true) {
      const value = values.next();
      if (value.done) {
        break;
      }
      cb(value.value);
    }
  }

  //  添加协作区域
  private addUserRange(users: User | User[]) {
    users = Array.isArray(users) ? users : [users];
    users.forEach((user) => {
      this.users.set(user.userID, user);

    })
  }

  /**
   * 开启协作连接
   */
  public connect(roomid: string) {
    this.socket = io(`http://192.168.101.8:31020`, {
      path: '/api/collaboration/v1/socket',
      forceNew: true,
      multiplex: false,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 3000,
      reconnectionAttempts: 310,
      reconnection: true,
      auth: {
        Authorization: this.userid,
        RoomId: roomid,
      },
      transports: ['websocket', 'polling'],
    })
    this.onSocketConnectEvent()
  }

  private onSocketConnectEvent() {
    const { socket } = this;
    //  连接
    socket
      .on('connect', () => {
        //  自己加入房间 并收到 已在房间内的所有协作用户信息
        socket.on(SocketEventKey.room, (users: User[]) => this.addUserRange(users));
        //  新加入协作房间的用户
        socket.on(SocketEventKey.joined, (user) => {
          message.info(user.userID + '加入了房间!')
          this.addUserRange(user);
        });
        //  表格操作
        socket.on(SocketEventKey.smartsheet, (event: Events) => {
          switch (event.event) {
            //  用户选择区域变更  (新增 ｜ 修改)
            case SmartSheetEventKey.selection:
              const userGroup = this.smartSheetCore.find(`${this.userid}-selection`);
              if (!userGroup) {
                // this.rangeManager.createSelectionRange();
                return;
              }
              // 构建一个user
              this.rangeManager.updateRange(this.userid, event.cells as any);
              break;
            //  修改单元格内容
            case SmartSheetEventKey.changCellText:
              break;
            //  修改列宽
            case SmartSheetEventKey.changeColumnWidth:
              break;
          }
        })
      })
      //  连接失败
      .on('error', (error) => {
        console.log(' error', error)
      })
      //  断开连接
      .on('disconnect', (reason: string) => {
        console.log('断开连接')
      })
      //  中间件验证失败
      .on('connect_error', (error) => {
        console.log('中间件验证失败', error.message)
      })
  }

  //  销毁
  destory() {
    this.disconnect()
    this.users.clear()
  }

  //  主动断开
  public disconnect() {
    this.socket?.close?.()
  }
}
