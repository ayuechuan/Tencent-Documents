import './index.less'

import svg from '@assets/Docker.svg'
import { NodeProps, NodeToolbar, Position, useReactFlow } from '@xyflow/react'
import { Button, Checkbox, Form, Select, Space, Textarea } from 'tdesign-react'

import { IconFont } from '@/utils/iconFont'

import { CustomHandle } from '../../handles'
const FormItem = Form.FormItem

const options = [
  { label: '计算机学院', value: '1' },
  { label: '软件学院', value: '2' },
  { label: '物联网学院', value: '3' },
]

export function FormNode(
  props: NodeProps & {
    data: {
      forceToolbarVisible: boolean
      toolbarPosition: Position
    }
  },
) {
  const { isConnectable, height, data, positionAbsoluteX, positionAbsoluteY } = props
  const { zoomIn, zoomOut, zoomTo } = useReactFlow()

  return (
    <div className="flow-form animate__animated animate__swing">
      <h5>
        公司表格上传
        <img style={{ width: 40 }} src={svg} alt="" />
      </h5>
      <div className="main">
        <Form
          labelAlign="top"
          layout="vertical"
          preventSubmitDefault
          resetType="initial"
          showErrorMessage
          onValuesChange={(changedValues, allValues) => {
            console.log(changedValues, allValues)
          }}
          // disabled
        >
          <FormItem initialData={['1']} label="选择对应的文件格式" name="fileType">
            <Checkbox.Group>
              <Checkbox value="1">.xlcx</Checkbox>
              <Checkbox value="2">.xxlx</Checkbox>
              <Checkbox value="3">.csv</Checkbox>
            </Checkbox.Group>
          </FormItem>
          <FormItem initialData={['1']} label="数据来源" name="dataSource">
            <Checkbox.Group>
              <Checkbox value="1">数据导入</Checkbox>
              <Checkbox value="2">表格自建</Checkbox>
            </Checkbox.Group>
          </FormItem>
          <FormItem label="回话信息" name="replymessage">
            <Textarea placeholder="请输入内容" className="textarea" autosize={{ minRows: 4, maxRows: 10 }} />
          </FormItem>

          <FormItem label="学院" name="college" initialData="">
            <Select clearable>
              {options.map((item, index) => (
                <Select.Option value={item.value} label={item.label} key={index}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Form>
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: 20,
          left: 0,
          top: 0,
          position: 'absolute',
          transform: `translate(-25px,${height! / 2}px)`,
          zIndex: 9999,
          cursor: 'pointer',
        }}
        onClick={(event) => {
          event.stopPropagation()
          event.preventDefault()
        }}
      >
        <IconFont type="icon-jiahao" />
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 20,
          right: 0,
          top: 0,
          position: 'absolute',
          transform: `translate(25px,${height! / 2}px)`,
          zIndex: 9999,
          cursor: 'pointer',
        }}
        onClick={(event) => {
          event.stopPropagation()
          event.preventDefault()
        }}
      >
        <IconFont type="icon-jiahao" />
      </div>

      <NodeToolbar
        isVisible={data.forceToolbarVisible || undefined}
        position={data.toolbarPosition || Position.Top}
        // style={{
        //   position : 'absolute',
        //  transform: `translate(${positionAbsoluteX}px,${positionAbsoluteY  - 35}px)`,
        // }}
      >
        <Space>
          <Button type="button" onClick={() => zoomIn({ duration: 800 })}>
            放大
          </Button>
          <Button type="button" onClick={() => zoomOut({ duration: 800 })}>
            缩小
          </Button>
          <Button type="button" onClick={() => zoomTo(1, { duration: 800 })}>
            指定
          </Button>
        </Space>
      </NodeToolbar>

      <CustomHandle
        type={'target'}
        id="red"
        position={Position.Top}
        // style={{ ...DEFAULT_HANDLE_STYLE, left: '15%', background: 'red' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <CustomHandle type={'source'} position={Position.Bottom} />
    </div>
  )
}
