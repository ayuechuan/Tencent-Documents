import './index.less'

import png from '@assets/12.png'
import png1 from '@assets/13.png'
import png2 from '@assets/14.jpg'
import { useReactFlow } from '@xyflow/react'
import { useMount } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { Avatar, AvatarGroup, Button, Drawer, Image, message, Space } from 'tdesign-react'

import { IconFont } from '@/utils/iconFont'

import { defaultConfig } from '../../common'
import { useFlowScoket } from '../../flowSocketNamespace/SocketProvider'
import { EditorPerm } from '../EditorPerm'

const imgs = [
  { title: '项目流程图', url: png, id: 'projectProcess' },
  { title: '辅助线', url: png1, id: 'helperLine' },
]

export const Header = observer(() => {
  const { setEdges, setNodes, fitView } = useReactFlow()
  const [visible, setVisible] = useState(false)
  const socket = useFlowScoket()

  function paly(id: keyof typeof defaultConfig) {
    const { nodes, edges } = defaultConfig[id]
    setEdges(edges)
    setNodes(nodes)
    setVisible(false)

    setTimeout(() => {
      fitView({ minZoom: 1, maxZoom: 1 })
    }, 20)
  }

  useMount(() => {
    // message.success('游客加入协作房间,开启编辑之旅吧！')
  })

  return (
    <div className="flowmix_header">
      <div className="left">
        <Space size={'78px'} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconFont
              type="icon-tengxunhuiyi"
              size={50}
              style={{
                fontSize: 50,
              }}
            />
            <div style={{ fontSize: 20, fontWeight: 700, marginLeft: 10 }}>腾讯文档</div>
          </div>
          <div>
            <Button
              style={{ fontWeight: 500, fontSize: 16, margin: '0 5px' }}
              type="button"
              onClick={() => setVisible(true)}
            >
              模板库
            </Button>
            <Button
              type="button"
              style={{ fontWeight: 500, fontSize: 16, margin: '0 5px' }}
              onClick={() => {
                socket.connect('flow')
              }}
            >
              开启协作
            </Button>
            <Button
              type="button"
              style={{ fontWeight: 500, fontSize: 16, margin: '0 5px' }}
              onClick={() => {
                socket.disconnect()
              }}
            >
              断开连接
            </Button>
          </div>
        </Space>
      </div>
      <div className="center">
        <AvatarGroup size="large" max={5}>
          {socket.userItems.map((user) => (
            <Avatar image={png2} key={user.userID}></Avatar>
          ))}
          <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></Avatar>
          <Avatar>腾</Avatar>
          <Avatar image={png2}></Avatar>
        </AvatarGroup>
      </div>
      <div className="right" style={{ display: 'flex' }}>
        <EditorPerm />
        <Image
          src={png2}
          loading={<></>}
          placeholder=""
          style={{ width: 32, height: 32, margin: ' 0 auto', borderRadius: 5 }}
          overlayTrigger="hover"
        />
      </div>
      <Drawer
        placement={'left'}
        key={'1212'}
        size={'378px'}
        onClose={() => setVisible(false)}
        header={'模板案例'}
        visible={visible}
        footer={false}
      >
        {imgs.map((imgItem) => (
          <div
            key={imgItem.url}
            style={{
              background: '#f8f9fb',
              padding: '20px 20px 5px',
              margin: '0 0 20px 0',
              borderRadius: 5,
            }}
          >
            <Image
              src={imgItem.url}
              style={{ width: 284, height: 160, margin: ' 0 auto', borderRadius: 5 }}
              overlayContent={
                <div
                  style={{
                    background: 'rgba(0,0,0,.4)',
                    color: '#fff',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => void paly(imgItem.id as any)}
                >
                  使用
                </div>
              }
              overlayTrigger="hover"
            />
            <p style={{ margin: '10px 0', textAlign: 'center' }}>{imgItem.title}</p>
          </div>
        ))}
      </Drawer>
    </div>
  )
})
