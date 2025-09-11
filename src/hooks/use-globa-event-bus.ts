import { globaErrorKey } from "@/constants/globa.event";
import { useEventBus } from "@/providers/eventBus"

export const useGlobaEventBus = () => {
  const eventBus = useEventBus();
  useEffect(() => {
    eventBus?.on(globaErrorKey["error-permission"], () => {
      console.log('接收到了消息----');

    })

    return () => eventBus?.destory();
  }, []);
}