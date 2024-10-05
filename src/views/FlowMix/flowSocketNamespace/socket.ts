import { Edge, Node, ReactFlowInstance } from '@xyflow/react'
import { makeAutoObservable, makeObservable, observable, toJS } from 'mobx'
import { io, Socket } from 'socket.io-client'
import { message } from 'tdesign-react'

import { useNodeController } from '../hooks/useNodeController'
import { EventType, SocketEventKey } from './model'
import { RoomUser } from './user'

const userid = Math.random() * 1000 + ''

export class FlowSocketClient {
  private socket!: Socket
  public users = observable.map<string, RoomUser>()

  constructor(
    private readonly controller: ReturnType<typeof useNodeController>,
    private readonly flowInstance: ReactFlowInstance<Node, Edge>,
  ) {
    //  只观察 users
    makeObservable(this, { users: observable })
  }

  get userItems() {
    return Array.from(this.users.values())
  }

  /**
   * 开启协作连接
   */
  public connect(roomid: string) {
    this.socket = io(`http://192.168.101.17:31020`, {
      path: '/api/collaboration/v1/socket',
      forceNew: true,
      multiplex: false,
      reconnectionDelay: 50,
      reconnectionDelayMax: 100,
      reconnectionAttempts: 3,
      reconnection: false,
      auth: {
        Authorization: userid,
        RoomId: roomid,
      },
      transports: ['websocket', 'polling'],
    })
    this.onSocketConnectEvent()
  }

  private onSocketConnectEvent() {
    const { socket } = this
    //  连接检测
    socket.on('pong', (data: number) => {
      console.log(`socket connect delay:${data}ms`)
    })

    //  连接
    socket
      .on('connect', () => {
        console.log('连接成功')

        //  加入房间
        socket.on(SocketEventKey.room, (roomUser: RoomUser[]) => {
          console.log('oldUsers', roomUser)
          //  遍历已存在的用户列表
          for (const user of roomUser) {
            this.users.set(user.userID, user)
          }
          //  加入房间后 监听flowNode事件
          this.onSocketEvents()
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

  private onSocketEvents(): void {
    this.socket
      //  新增协作用户事件
      .on(SocketEventKey.joined, (user) => {
        message.info(user.userID + '加入了房间')
        this.users.set(user.userID, user)
      })
      //  用户重连
      .on(SocketEventKey.reconnected, () => {})
      //  表格刷新
      .on(SocketEventKey.refresh, () => {
        window.location.reload()
      })
      //  节点操作事件
      .on(SocketEventKey.node, this.onNodeEvent.bind(this))
      //  权限变更
      .on(SocketEventKey.authority, (perm: 'read' | 'edit') => {
        //  权限变更级别
        //  (read => edit) 升级
        //  (edit => read) 降级
        if (perm === 'read') {
          message.error({
            content: '您的权限已变更，即将刷新获取最新权限！',
            duration: 1000,
            onClose: () => {
              window.location.reload()
            },
          })
          return
        }
        //  所有者给予当前用户权限升级 ( 用户可自行选择是否刷新以获得编辑权限 )
        message.success({
          closeBtn: true,
          content: '您的权限已升级，可刷新获取编辑权限！',
          duration: 1000,
        })
      })
      //  用户主动离开
      .on(SocketEventKey.leave, ({ userid }: { userid: string }) => {
        message.info(`${userid}-刘德华退出了协作房间！`)
      })
  }

  public changeNodesEvent(type: EventType, node: Node) {
    if (!this.socket) {
      return
    }
    this.socket.emit(SocketEventKey.node, {
      type,
      node,
      userID: userid,
    })
  }

  private onNodeEvent(event: {
    //  更新类型
    type: EventType
    //  新数据源
    node: Node
    //  更新数据 用户id
    userID: string
    //  正在操作目标
    selectNodes: []
  }) {
    switch (event.type) {
      case 'addNode':
        this.controller.addNode(event.node)
        break
      case 'updateNode':
        // 测试协作  => 后续迁移到 controller中去 维护历史栈
        this.flowInstance.setNodes((nodes) => nodes.map((node) => (node.id === event.node.id ? event.node : node)))
        break
      case 'selectNodeChange':
        //  协作用户 操作节
        console.log('event', event, toJS(this.users))

        const user = this.users.get(event.userID)
        if (!user) return
        this.users.set(event.userID, {
          ...user,
          selectNodes: event?.selectNodes?.length ? event.selectNodes : [event.node.id],
        })

        const element = document.getElementsByClassName(`shape-node-${event.node.id}`)[0] as HTMLElement
        if (!element) return
        console.log('element', element)

        const child = document.createElement('div')
        child.classList.add('share-node')
        child.style.background = (event.node.data?.tipColor as string) || '#f95e24'
        child.textContent = `user-${event.userID.substring(0, 3)} 修改中...`
        console.log('child', child)

        element.appendChild(child)
        break
      default:
        break
    }
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
