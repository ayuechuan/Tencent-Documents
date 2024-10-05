import { useStore } from '@xyflow/react'
import { useEffect, useRef } from 'react'

import { useFlowStore } from '../FlowProvider'

export const HelperLinesRenderer = () => {
  const { width, height, transform } = useStore((state) => ({
    width: state.width,
    height: state.height,
    transform: state.transform,
  }))
  const { helperLineSource } = useFlowStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (!ctx || !canvas) {
      return
    }

    const dpi = window.devicePixelRatio
    canvas.width = width * dpi
    canvas.height = height * dpi

    ctx.scale(dpi, dpi)
    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = '#003cab'

    if (typeof helperLineSource.vertical === 'number') {
      ctx.moveTo(helperLineSource.vertical * transform[2] + transform[0], 0)
      ctx.lineTo(helperLineSource.vertical * transform[2] + transform[0], height)
      ctx.stroke()
    }

    if (typeof helperLineSource.horizontal === 'number') {
      ctx.moveTo(0, helperLineSource.horizontal * transform[2] + transform[1])
      ctx.lineTo(width, helperLineSource.horizontal * transform[2] + transform[1])
      ctx.stroke()
    }
  }, [width, height, transform, helperLineSource.horizontal, helperLineSource.vertical])

  return (
    <canvas
      ref={canvasRef}
      className="react-flow__canvas"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    />
  )
}
