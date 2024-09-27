import { MutableRefObject } from "react";
import { useFlowStore } from "../FlowProvider";
import { useMount } from "ahooks";
import { Watermark } from "@/utils/watermark";

export function WatermarkFlow() {
  const canvasRef = useRef<HTMLCanvasElement>();
  const store = useFlowStore();

  useMount(() => {
    if (canvasRef.current) {
      //  拿到父元素的宽高
      const partentDom = canvasRef.current.parentElement;
      //  拿到父元素的宽高
      const width = partentDom!.clientWidth;
      const height = partentDom!.clientHeight;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      store.watermark
        .register(canvasRef.current)
        .draw();
    }
  })

  return (
    <canvas
      ref={canvasRef as MutableRefObject<HTMLCanvasElement>}
    ></canvas>
  )
}