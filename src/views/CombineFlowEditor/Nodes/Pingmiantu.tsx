import img from '@assets/pingmian.png'
import { NodeProps } from '@xyflow/react'

import { IconFont } from '@/utils/iconFont'

function Pingmiantu(props: NodeProps) {
  return (
    <div style={{ position: 'relative' }}>
      <img src={img} alt="" />
      <IconFont
        size={20}
        style={{
          fontSize: '40px',
          color: '#0fad96',
          background: '#0fad96',
          margin: '50px 0 0 50px',
          position: 'absolute',
          top: 160,
          left: 40,
        }}
        type="icon-shexiangtou"
      ></IconFont>
      <IconFont
        size={20}
        style={{
          fontSize: '40px',
          color: '#0fad96',
          background: '#0fad96',
          margin: '50px 0 0 50px',
          position: 'absolute',
          top: 340,
          left: 310,
        }}
        type="icon-shexiangtou"
      ></IconFont>
      <IconFont
        size={20}
        style={{
          fontSize: '40px',
          color: '#0fad96',
          background: '#0fad96',
          margin: '50px 0 0 50px',
          position: 'absolute',
          top: 640,
          left: 330,
        }}
        type="icon-shexiangtou"
      ></IconFont>
    </div>
  )
}

export default Pingmiantu
