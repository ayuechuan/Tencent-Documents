import * as g6 from '@antv/g6';
import { useMount, useUnmount } from 'ahooks';
import { CustomGraph } from './core';


export function G6Chart() {

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let graph: CustomGraph;
    graph = new CustomGraph(ref.current!);
    graph.ready();

    return () => {
      graph.destory();
    }
  }, [])

  return (
    <div id='g' style={{ width: 1920, height: 1080 }} ref={ref}>
      <button onClick={() => {
        // graph.fullscreen();
      }} style={{position : 'absolute'}}>全屏</button>
    </div>
  )
}