import { observer } from "mobx-react-lite";
import { useFlowStore } from "../../FlowProvider";
import { Dialog, Input, Radio, Space, Tooltip } from "tdesign-react";
import { RollbackIcon, RollfrontIcon, GestureRightSlipIcon, GestureRanslationIcon } from "tdesign-icons-react";
import { IconFont } from "@/utils/iconFont";

interface FormRef {
  title: string;
  description: string;
  type: "dense" | "loose";
}


export const StyleBar = observer(() => {
  const [visible, setvisible] = useState(false);
  const store = useFlowStore();
  const formRef = useRef<FormRef>({
    title: '',
    description: '',
    type: 'loose'
  });
  const opacity = store.toolbarStatus.selectNodeId ? 1 : 0.2;


  function change(styleModeType: string) {
    if (!store.toolbarStatus.selectNodeId) {
      return;
    }
    store.toolbarStateChange({
      styleModeType
    })
  }

  if (store.isOpenConfig) {
    return null;
  }
  return (
    <div className='flow_panel_right'>
      <div className='controller' style={{
        padding : '10px 6px'
      }}>
        <Space size={14} direction='vertical' >
          <Tooltip
            content="样式属性"
            destroyOnClose
            showArrow
            placement="left"
            theme="default"
          >
            <IconFont
              style={{ opacity }}
              type="icon-yangshi"
              onClick={() => void change('style')}
            />
          </Tooltip>
          <Tooltip
            content="动画"
            destroyOnClose
            showArrow
            placement="left"
            theme="default"
          >
            <IconFont
              style={{ opacity }}
              type="icon-donghua"
              onClick={() => void change('animation')}
            />
          </Tooltip>
          <Tooltip
            content="用户交互"
            destroyOnClose
            showArrow
            placement="left"
            theme="default"
          >
            <IconFont
              style={{ opacity }}
              type="icon-jiaohushezhi"
              onClick={() => void change('interaction')}
            />
          </Tooltip>
          <Tooltip
            content="节点信息"
            destroyOnClose
            showArrow
            placement="left"
            theme="default"
          >
            <IconFont
              style={{ opacity }}
              onClick={() => void change('nodeInfo')}
              type="icon-xinxi"
            />
          </Tooltip>

          <Tooltip
            content="文档水印"
            destroyOnClose
            showArrow
            placement="left"
            theme="default"
          > <IconFont
              type="icon-shuiyin-off"
              onClick={() => {
                setvisible(true)
              }}
            />
          </Tooltip>
          <Tooltip
            content="辅助线"
            destroyOnClose
            showArrow
            placement="left"
            theme="default"
          > <IconFont
              type="icon-fuzhuxian"
              size={18}
              style={{
                fontSize : 18
              }}
              onClick={() => store.openHelperLine = !store.openHelperLine }
            />
          </Tooltip>

        </Space>
        <Dialog
          header="文档水印"
          visible={visible}
          confirmOnEnter
          onClose={() => {
            setvisible(false)
          }}
          onConfirm={() => {
            const { title, description, type } = formRef.current!;
            store.watermark.draw(title, description, type);
            setvisible(false);
          }}
        // onCancel={onCancel}
        // onEscKeydown={onKeydownEsc}
        // onCloseBtnClick={onClickCloseBtn}
        // onOverlayClick={onClickOverlay}
        >
          <p>水印内容</p>
          <p>文字水印</p>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Input
              maxlength={10}
              showLimitNumber
              onChange={(event) => { formRef.current!.title = event }}
              placeholder="请输入水印文字"
            />
            <Input
              maxlength={10}
              showLimitNumber
              onChange={(event) => { formRef.current!.description = event }}
              placeholder="请输入描述水印文字"
            />
          </Space>
          <div className='divideLine'></div>
          <p>水印样式</p>
          <Radio.Group
            onChange={(e) => {
              formRef.current!.type = e as 'dense' | 'loose'
            }}
            defaultValue="loose">
            <Radio value="dense">密集型</Radio>
            <Radio value="loose">宽松型</Radio>
          </Radio.Group>
        </Dialog>
      </div>
    </div>
  )
})