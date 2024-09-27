import React from 'react';
import {
  Handle,
  NodeProps,
  NodeToolbar,
  Position,
  useReactFlow,
  useStore
} from '@xyflow/react';

const handleStyle = {
  opacity: 0.3,
  background: 'linear-gradient(to bottom, red, #ff0071)'
};

export function ShapeNode({ id, data, selected }: NodeProps & {
  data: {
    width?: number,
    height?: number,
    label?: string,
    tipColor?: string,
    tip?: string
  }
}) {
  const width: number = data?.width || 170;
  const height: number = data?.height || 50;
  const styles = {
    fill: data?.color,
    strokeWidth: selected ? 2 : 0,
    stroke: '#fff'
  };
  return (
    <>
      <div className={`shape-node-${id}`} style={{ position: 'relative' }}>
        <Handle
          id="top"
          style={handleStyle}
          position={Position.Top}
          type="source"
        />
        <Handle
          id="right"
          style={handleStyle}
          position={Position.Right}
          type="source"
        />
        <Handle
          id="bottom"
          style={handleStyle}
          position={Position.Bottom}
          type="source"
        />
        <Handle
          id="left"
          style={handleStyle}
          position={Position.Left}
          type="source"
        />
        <svg
          style={{ display: 'block', overflow: 'visible' }}
          width={width}
          height={height}
        >
          <path
            d={`M0,0 L${width},0 L${width},${height} L0,${height} z`}
            {...styles}
            fill="#ffffff"
            strokeWidth="2"
            stroke="#0073E6"
          />
        </svg>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: 'blue',
              fontSize: 15
            }}
          >
            {data?.label}
          </div>
        </div>

        {/* <div className='share-node' style={{ background: data?.tipColor }}>
          {data?.tip}
        </div> */}
      </div>
    </>
  );
}
