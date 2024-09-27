import { Panel, useReactFlow, useStore, useStoreApi } from "@xyflow/react";
import { GestureRightSlipIcon } from "tdesign-icons-react";
import { CheckTagGroup, InputNumber, Tabs, Tag } from "tdesign-react";
import { useFlowStore } from "../../FlowProvider";
import { observer } from "mobx-react-lite";
import { IconFont } from "@/utils/iconFont";

const { TabPanel } = Tabs;

const animations = [
  { value: 'animate__bounce', label: '跳动' },
  { value: 'animate__flash', label: '闪烁' },
  { value: 'animate__pulse', label: '脉冲' },
  { value: 'animate__rubberBand', label: '橡皮筋' },
  { value: 'animate__shakeX', label: '横向抖动' },
  { value: 'animate__shakeY', label: '纵向抖动' },
  { value: 'animate__swing', label: '摇摆' },
  { value: 'animate__tada', label: '滴滴打' },
  { value: 'animate__wobble', label: '摆动' },
  { value: 'animate__jello', label: '果冻' },
  { value: 'animate__bounceIn', label: '跳入' },
  { value: 'animate__bounceInDown', label: '向下跳入' },
  { value: 'animate__bounceInLeft', label: '向左跳入' },
  { value: 'animate__bounceInRight', label: '向右跳入' },
  { value: 'animate__bounceInUp', label: '向上跳入' },
  { value: 'animate__bounceOut', label: '向下1跳入' },
  { value: 'animate__bounceOutDown', label: '跳出' },
  { value: 'animate__bounceOutLfet', label: '向左跳出' },
  { value: 'animate__bounceOutLfet5453', label: '向左跳出1' },
  { value: 'animate__bounceOutLfet45', label: '向左跳出2' },
  { value: 'animate__bounceOutLfet55', label: '向左跳出3' },
  { value: 'animate__bounceOutLfet333', label: '向左跳出7' },
]

export const ConfigBar = observer(() => {
  const { setNodes } = useReactFlow();
  const store = useFlowStore();

  const animationTag = useStore((state) => {
    const currentNode = state.nodes
      .filter((node) => node.id === store.toolbarStatus.selectNodeId);
    if (!currentNode.length) return null;

    const firstNode = currentNode[0];
    const className = firstNode?.data?.className as string;
    if (!className) return null;

    const {
      length,
      [length - 1]: animationClassName
    } = className.split(' ');

    return {
      animationClassName,
      label: animations.find((item) => item.value === animationClassName)?.label || ''
    };
  })

  if (!store.isOpenConfig) {
    return null
  }
  return (
    <Panel position='top-right'>
      <div className='config_panel react-flow__panel'>
        <div className='box'>
          <Tabs
            placement={'top'}
            defaultValue={store.toolbarStatus.styleModeType}
            theme={'normal'}
            disabled={false}
            onChange={(event) => {
              if (event === 'animation') {
                store.toolbarStateChange({
                  styleModeType: ''
                })
              }
            }}
            size='medium'
            style={{ margin: '5px 2px' }}
          >
            <TabPanel value={'style'} label={<IconFont type="icon-yangshi" />}>
              <div className="tabs-content">
                <div className='animate_warp'>
                  <div className='title'>动画</div>
                  <div className='animate_title'>
                    <div>动画类型:</div>
                    {animationTag?.label ?
                      <Tag size="small" theme="primary">{animationTag?.label}</Tag> : <div></div>}
                  </div>
                  <CheckTagGroup
                    options={animations}
                    defaultValue={[animationTag?.animationClassName ?? '']}
                    multiple={false}
                    onChange={(key) => {
                      setNodes((nds) =>
                        nds.map((node) => {
                          if (node.id === store.toolbarStatus.selectNodeId) {
                            return {
                              ...node,
                              data: {
                                ...node.data,
                                className: key ? `animate__animated ${key[0]}` : ''
                              },
                            };
                          }

                          return node;
                        }))
                    }}
                  />
                </div>
                <div className='animate_row'>持续时间<InputNumber size='small' defaultValue={5} theme="column" onChange={(v) => console.log(v)} /></div>
                <div className='animate_row'>延迟时间<InputNumber size='small' defaultValue={5} theme="column" onChange={(v) => console.log(v)} /></div>
                <div className='animate_row'>动画次数(大于 500为循环)<InputNumber size='small' defaultValue={5} theme="column" onChange={(v) => console.log(v)} /></div>
              </div>
            </TabPanel>
            <TabPanel value={'animation'} label={<IconFont type="icon-donghua" />}>
              <div className="tabs-content" style={{ margin: 20 }}>
                选项卡2内容区
              </div>
            </TabPanel>
            <TabPanel value={'interaction'} label={<IconFont type="icon-jiaohushezhi" />}>
              <div className="tabs-content" style={{ margin: 20 }}>
                选项卡3内容区
              </div>
            </TabPanel>
            <TabPanel value={'nodeInfo'} label={<IconFont type="icon-xinxi" />}>
              <div className="tabs-content" style={{ margin: 20 }}>
                选项卡3内容区
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </Panel>
  )
});
