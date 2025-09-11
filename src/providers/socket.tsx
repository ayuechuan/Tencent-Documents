import { useMount, useUnmount } from "ahooks";
import { createContext } from "react";
import io, { Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: React.PropsWithChildren) => {
  const [socketInstance] = useState(() => {
    return io('http://192.168.101.8:31020', {
      path: '/api/collaboration/v1/socket',
      forceNew: true,
      multiplex: false,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 2000,
      reconnectionAttempts: 10,
      reconnection: true,
      transports: ['websocket', 'polling'],
      transportOptions: {
        polling: {
          extraHeaders: {}
        }
      }
    });
  })

  useMount(() => {
    console.log('socketInstance', socketInstance);
    //. 监听socket心跳
    socketInstance.on('ping', (data) => {
      console.log('ping', data)
    })
  })

  useUnmount(() => {
    socketInstance.disconnect();
  })

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  )
}