React + konva +socket.io实现腾讯文档表格协作
=================
#### 1.技术栈说明

*   载体：此部分的代码在React Next都可以轻松迁移转换。
*   表格插件：利用konva实现，协作提示相关使用多层layer来展示。
*   服务端：Nest.js 也集合成了socket.io 喜欢依赖注入的方式来书写.

#### 2.实现的效果 多人协作

*   腾讯文档的：
    ![555649f5fcc0a3e667543ee80f6a7ca7.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/00fa3d6db310436fbb4bb6ec659b5f7e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=1ze3jXyP8oEZBSc%2FznW8goYJZEA%3D)

*   自己实现的 <img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/ffacc9cfbd9b4b8fbca707f46302ddd8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=K313qeZLaT0ApIu07fd9rlk%2FxL4%3D" alt="image.png" width="50%">

#### 3.进入正题 前端部分

1.  通过上面的截图，我们分析出有用的信息是些什么呢。要表示一个用户的状态，需要些什么数据

```js
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
```

2.  有了描述，就需要渲染。这里我们采用konva画布来实现。

<img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/7b9dcf23723b4807aa63d88cbe0f8a88~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=KwydsmRwa5OvqJx9gZml7D7mh%2BE%3D" alt="image.png" width="70%">

单个用户的大概就这样。看过我上篇文章的应该知道。我们还需要一个manager来管理 前端部分的 增删改查。我就简要的实现一个更新吧。待会儿协作通知的实现需要用到这个class来更新通知每一个range。

<img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/d3788a93a2234a79bf3ab3843a02a06e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=GKBoqf71HEifbJ0%2BFGG0jCQArno%3D" alt="image.png" width="70%">  

3.React dom结构搭建.

```js
export function Container(){
  return (
    <LayerContianerProvider>
      <SocketProvider>
        <SmartSheet />
      </SocketProvider>
    </LayerContianerProvider>
  )
}

import { useUnmount } from 'ahooks'
import { createContext, PropsWithChildren } from 'react'
import { SocketClient } from './socket'
import { useSmartSheetInstance } from '../smartsheet';
import { RangeManager } from '@/views/konvaCanvas';

const SocketClientContext = createContext<SocketClient>({} as SocketClient);

export function SocketProvider({ children }: PropsWithChildren) {
  const core = useSmartSheetInstance();
  const userManager = useState(() => new RangeManager())[0];
  const [store] = useState(() => new SocketClient(userManager, core));

  useUnmount(() => {
    store.destory();
  })

  return <SocketClientContext.Provider value={store}>{children}</SocketClientContext.Provider>
}

export function useScoket() {
  return useContext(SocketClientContext)
}
```

着重关注 SocketClient即可 与后台打交道。前端的代码就到这里了，等下连接socket的时候再对照讲下具体的。

<img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/b63f2eaf298249fc80918c0520e7c6cd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=kpxgRGQdsj8iAcpPQdJtOQ%2FMnSc%3D" alt="image.png" width="70%">

#### 4.后台nest部分( 需要对nest熟悉 )

1.  使用redis来缓存房间协作的信息。为了适配有的用单节点 ｜ 分布式环境 ｜ 哨兵模式。这里我们需要实现一下 WebSocketAdapter。

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/dbf0929a759842bfa64678e4d293f834~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=UesMkoNFWO0qDJLS%2Bl%2FXTZKJeMY%3D)

来看看协作我们需要怎么定义数据结构  待会就操作redis中的数据即可。

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/56cab800116d47f3b454a11d06dc4f58~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=BzgZ2SnModKdWvrXv8%2F7BiBuVW0%3D)

注册一个自定义的redis模块和服务。

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/878caf7725434cc2b1cacbe488db0291~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=OGbF1vGUqs9NONeBF%2B9Wq9eg28s%3D)

这个服务其实就是处理房间 用户 分配颜色的一个管理器。

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/6fa548f36d9643b8b82999f00a7ae79f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=4r%2Bv2CpEHyN7n7riYAqrDneTR6U%3D)

1.  SocketRedisRooms => 增删改查房间 和 管理 用户 ｜ 颜色
2.  Colors => 增删 用户颜色
3.  Users => 增删 用户 和 用户的集合

其实无非就是对redis hash Set数据的增删改查罢了。

前端携带握手参数 发起socket连接。

<img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/62bbaf568b864d9fbdc7ccab29905e14~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=aMKyZa8q6P4LdLF4iGM8M8Wnp6M%3D" alt="image.png" width="50%">

后台在中间件中验证握手参数并处理 协作房间的初始化操作。主要就是生成房间，生成一个用户，生成color。

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/65dc387d758a4199a6b50cec6020b4b8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=zzv4RRoI%2FoIHXY%2BID9parWTdLEE%3D)

中间件验证完成 就要去处理socket网关服务。

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/28092bb3b6cc405f8e37475f74895213~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=8yzN5BdpR%2Fa0M0T3Jw5y%2FT1uPt0%3D)

然后前端处理接收事件

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/2ee6e8cad44c4c6cac65eff262ed793c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=1JWMGbTioF7nNjZEFBw0O3mLghU%3D)

来前端部分正式连接一下试试。顺便看看nest服务操作redis成功没。

![3dfcede50cd1e99880c910329fd986e7.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/dbd12948fbc84ccebe13c22063402abc~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=W%2B6X62tggRCZbka3RjLxbP9Ywbc%3D)

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/21013dae7c1c4dcea824df5fcddc758b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=MQwb1vJcGltgl89fJCKR0s5M3vI%3D)

能成功连接并写入缓存数据了。此时需要与表格插件接洽了。将用户操作表格的事件与socket对应起来。我表格插件会向外界传递用户的操作事件，我只需要监听一下selectionMove事件即可，然后当前socket端传递到服务端，有服务端去更新当前用户的选择区域并广播给其他房间内的用户。

```js
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
```

服务端只需要处理 更新redis缓存和广播即可。
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/ba3be13bf05d418bac08e2897604a943~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=MrCu1sLQsRviXGXBNKPTvKeXvs0%3D)

其它客户端接收到变更 需要更新用户在界面上的选择区域。

```js
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
```

rangeManager的作用就在这里体现了，它接管了数据去更新konva的Group的具体界面表现。这里只是简单的讲解了一下使用。

如果某个用户主动离开房间呢？ 我们也无非就是广播房间内的其他用户和更新redis的缓存 将这个用户删除即可.

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/34f6863bd8a94de9be23483b962aaefa~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=6lDvytxqPuCKwZxShYomkTkbsjw%3D)

到目前为止，多人协作就完成了。

<img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/ffacc9cfbd9b4b8fbca707f46302ddd8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=K313qeZLaT0ApIu07fd9rlk%2FxL4%3D" alt="image.png" width="50%">

当然了 协作的问题还需要很多问题去处理

1.  协作冲突的问题（ 多个用户编辑同一单元格 ）数据如何取舍整合？
2.  某些用户协作过程中 网络中断 ｜ 网络延迟过高。恢复后如何保持操作同步和数据同步？
    这些问题就不展开了，我只是带大家入个门。

简单回答一下

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/ba7dbc3b61ea403da5b9912b3fd83d49~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5LiA5LiqYnVn5oiR5oyo5LiA5be05o6M:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU4NzU3MTMwNjA2MDIzIn0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1735614260&x-orig-sign=w51NI2XcQ7WYOsRqbqhOFKMmi98%3D)
