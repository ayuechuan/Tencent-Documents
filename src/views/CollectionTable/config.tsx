import { DownOutlined, HolderOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Dropdown, Form, Input, MenuProps, Space, message } from "antd";
import { useState } from "react";
import DraggableComp from "./components/CusDraggable";

const onClick: MenuProps['onClick'] = ({ key }) => {
  message.info(`Click on item ${key}`);
};

const items: MenuProps['items'] = [
  {
    label: '自定义文本',
    key: '1',
  },
  {
    label: '创建日期',
    key: '2',
  },
  {
    label: '自增数字',
    key: '3',
  },
];

export function SerialNumberConfig() {
  const [sortConditionList, setSortConditionList] = useState([
    { id: '1', content: (item: any, dragHandle: any) => Content(item, dragHandle) },
    { id: '2', content: (item: any, dragHandle: any) => Content(item, dragHandle) },
    { id: '3', content: (item: any, dragHandle: any) => Content(item, dragHandle) },
    { id: '4', content: (item: any, dragHandle: any) => Content(item, dragHandle) },
  ]);

  const dragEnd = (result: any, provided: any) => {
    if (!result.destination) {
      return;
    }
    let tempItems = sortConditionList;
    let { source: { index: sourceIndex }, destination: { index: destinationIndex } } = result;
    const sourceItem = sortConditionList[sourceIndex];
    tempItems.splice(sourceIndex, 1);
    tempItems.splice(destinationIndex, 0, sourceItem);
    setSortConditionList([...tempItems]);
  }

  return (
    <>
      <Form.Item style={{ marginBottom: 0 }} label="编号规则"></Form.Item>
      <div style={{ borderRadius: "4px", height: "35px", lineHeight: "35px", marginBottom: "8px", width: "100%", backgroundColor: "#E7E7E7" }}>
        <span style={{ color: "#848484", margin: "0 24px 0 8px" }}>预览</span>
        <span>1</span>
      </div>
      <Form.Item style={{ background: '#F5F6F8', marginBottom: "8px", padding: '6px' }} >
        <DraggableComp items={sortConditionList} onDragEnd={dragEnd as any} />
        <Dropdown menu={{ items, onClick }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              添加规则
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Form.Item>
    </>
  );
}

export function Content(item: any, dragHandle: any) {
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "6px", }}>
      <div {...dragHandle}><HolderOutlined /></div>
      <div style={{ userSelect: "none", whiteSpace: "nowrap", marginLeft: "5px" }}>自定义文本</div>
      <Input
        placeholder="请输入选项"
        style={{ margin: "0 5px" }}
      />
      <MinusCircleOutlined />
    </div>
  )
}