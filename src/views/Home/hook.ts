import { MutableRefObject, RefObject } from "react";

export function useHook(domRef: MutableRefObject<HTMLDivElement | undefined>) {
  useEffect(() => {
    if (!domRef.current) {
      console.log('暂时没有值');
      return;
    }
    console.log('监听dom的变化', domRef.current);

  }, [])
}