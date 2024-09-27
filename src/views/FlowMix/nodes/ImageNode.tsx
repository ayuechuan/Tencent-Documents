import { Handle, NodeProps, NodeResizer, Position, useReactFlow, Node, addEdge, MarkerType, Edge } from "@xyflow/react";
import './index.less'
import { Button, Image } from "tdesign-react";
import { IconFont } from "@/utils/iconFont";
import { v4 as uuid } from 'uuid';
import { useNodeController } from "../hooks/useNodeController";
import { node_config } from "../common";

export function ImageNode(props: NodeProps & {
  data: {
    url: string
  }
}) {
  const { selected, data, id, width, height, positionAbsoluteX, positionAbsoluteY } = props;
  const { addNode } = useNodeController();
  const { setEdges } = useReactFlow();

  function add() {
    const uid = uuid();
    const node: Node = {
      id: uid,
      position: {
        x: positionAbsoluteX + (width ?? 0) + 100,
        y: positionAbsoluteY
      },
      selected: false,
      ...node_config['t-node-image']
    };
    addNode(node);
    setTimeout(() => {
      setEdges((prevEdges) => addEdge({
        type: "t-edge-floating",
        animated: true,
        style: {
          stroke: 'rgb(158, 118, 255)',
          strokeWidth: 1,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'rgb(158, 118, 255)',
          // strokeWidth: 2,
        },
        id: uid,
        source: id,
        target: uid,
      }, prevEdges
      ));
    });

  }


  return (
    <div className={`btn-node ${data?.className ?? ''}`}>
      <NodeResizer
        color="#0059FF"
        isVisible={selected}
      />
      <div className="btn-container">
        <Image
          style={{ background: 'transparent', width: 'inherit', height: 'inherit' }}
          src={data.url || 'https://magic.dooring.vip/assets/logo-nvGOfOJy.png'} />
      </div>
      {selected && <div style={{
        display: 'flex1',
        fontSize: 15,
        right: 0,
        top: `${height! / 2}px`,
        position: "absolute",
        transform: `translate(25px,-30%)`,
        zIndex: 9999,
        cursor: 'pointer'
      }}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          add();
        }}
      >
        <IconFont
          type="icon-jiahao"
        />
      </div>}
      <Handle type="source" style={{ backgroundColor: '#0059FF' }} color="#0059FF" position={Position.Top} id="a" />
      <Handle type="source" style={{ backgroundColor: '#0059FF' }} position={Position.Right} id="b" />
      <Handle type="source" style={{ backgroundColor: '#0059FF' }} position={Position.Bottom} id="c" />
      <Handle type="source" style={{ backgroundColor: '#0059FF' }} position={Position.Left} id="d" />
    </div>
  )
}