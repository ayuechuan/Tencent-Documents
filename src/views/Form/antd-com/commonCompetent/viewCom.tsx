/**
 * @Author zhiyuan.xu
 * @Date 2020/12/23
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/23
 */
import { Modal, Input, Tooltip } from 'antd';
import { useState, useEffect,useRef } from 'react'
// import ContentEditable from 'react-contenteditable'
import  { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {droppableValueForm} from "../../com-setting/DroppableIDs";
import { changeMapKey } from '../../com-setting'
// import cloneDeep from 'clone-deep';
import {actionKeys} from '../../com-setting/cpvSetting'
const { TextArea } = Input;

const ViewValueCom = ({
          changeVlaue,
          defaultValue,
          viewId,
          data,
          setSettingDataActive,
          iconClassName,
    }) => {
    const [visible, setVisible] = useState(false);
    const [optionsText, setOptionsText] = useState('')
    const prevCountRef = useRef(defaultValue);
    const text = useRef('');

    useEffect(() => {
        prevCountRef.current = defaultValue
    }, [defaultValue])

    const inputChange = (value, index) => {
        // const arr = cloneDeep(prevCountRef.current)
        // arr[index].value = value;
        // changeVlaue(changeMapKey.Select, viewId, arr, arr[index], actionKeys.changeValue);
    }

    // 单个选项
    const addOption = () => {
        // const copyOptions = cloneDeep(prevCountRef.current)
        // const option = {
        //     value: '自定义选项',
        //     id: Math.random().toString(16).substring(2)
        // }
        // copyOptions.push(option)
        // changeVlaue(changeMapKey.Select, viewId, copyOptions, option, actionKeys.addOne);
    }
    // 多个选项
    const addOptions = () => {
        setVisible(true)
    }

    const modleOkData = () => {
        const strList = optionsText.split('\n');
        const trimList = strList.filter(str => str.trim() !== '').map((item) => ({
            value: item,
            id: Math.random().toString(16).substring(2)
        }))
        changeVlaue(changeMapKey.Select, viewId, prevCountRef.current.concat(trimList), trimList, actionKeys.addMany);
        setVisible(false)
    }

    // 排序handle
    const changeListHandle = (dragIndex, hoverIndex) => {
        // let dataList = cloneDeep(prevCountRef.current);
        // let tmp = dataList[dragIndex] //临时储存文件
        // dataList.splice(dragIndex,1) //移除拖拽项
        // dataList.splice(hoverIndex,0, tmp) //插入放置项
        // changeVlaue(changeMapKey.Select, viewId, dataList, dataList, actionKeys.sort);
    }

    // 排序
    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) {
            return;
        }
        changeListHandle(source.index, destination.index)
    }

    // 删除选项
    const deleteFormItem = (id) => {
        // if (prevCountRef.current.length > 1) {
        //     const dataList = cloneDeep(prevCountRef.current).filter((item) => item.id !== id);
        //     changeVlaue(changeMapKey.Select, viewId, dataList, id, actionKeys.delete);
        // }

    }

    const valueOnblur = (index, id) => {
        if (prevCountRef.current.length > 1) {
            inputChange(text.current, index)
            if (!text.current || text.current.trim() === '') {
                deleteFormItem(id)
            }
        } else {
            if (!text.current || text.current.trim() === '') {
                inputChange(prevCountRef.current[index].value, index)
            } else {
                inputChange(text.current, index)
            }
            // inputChange(prevCountRef.current[index], index)
        }

    }

    return <div className={'radio-view-wrap'}>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable key={`DroppableContent`} droppableId={`${viewId}-${droppableValueForm}`}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef}
                         style={snapshot.isDraggingOver ? {pointerEvents: 'none'} : {} }
                    >
                        {
                            defaultValue.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={`${item.id}`}
                                    index={index}>
                                    {(
                                        provided,
                                        snapshot
                                    ) => (
                                        <>
                                            <div key={'sssredieo-son'} className={'redio-view-son-wrap'}
                                                 ref={provided.innerRef}
                                                 {...provided.draggableProps}
                                                 style={ provided.draggableProps.style}
                                            >
                                                <Tooltip placement="top" title={'移动排序'}>
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className={'ico-btn sort-btn'}
                                                    >
                                                        {/* <Icon type="bars" /> */}
                                                    </div>
                                                </Tooltip>
                                                <div className={`${iconClassName}`}></div>
                                                {/* <ContentEditable className={'input'} key={`input${index}`} type="text" html={item.value}
                                                                 onFocus={() => {
                                                                     text.current = item.value
                                                                 }}
                                                                 onChange={(evt) => {
                                                                     text.current = evt.target.value;
                                                                 } }
                                                                 onBlur={(e) => {
                                                                     valueOnblur(index, item.id)
                                                                 }}
                                                /> */}
                                                <div className={'value-wrap'}>
                                                    <Tooltip placement="top" title={'设置选项值'}>
                                                        {/* <Icon onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSettingDataActive({
                                                                pId: data.id,
                                                                pName: data.name,
                                                                pSort: index,
                                                                data: item,
                                                                key: changeMapKey.Select
                                                            })
                                                        }} 
                                                        className={'value-icon'} 
                                                        type="setting" /> */}
                                                    </Tooltip>
                                                    <Tooltip placement="top" title={'删除选项值'}>
                                                        {/* <Icon onClick={() => deleteFormItem(item.id) } className={'value-icon'} type="delete" /> */}
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            {snapshot.isDragging && (
                                                <div key={`ssssasdggffssss`} className={'redio-empety-son-wrap'}></div>
                                            )}
                                        </>
                                    )}
                                </Draggable>
                            ))
                        }
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
        {
            data.active ?
                <div className={'active-wrap'}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={ () => { addOption(data) } }>
                        {/* <Icon type="file-add" /> */}
                        <span>添加单个选项</span>
                    </a>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={ () => { addOptions(data) } }>
                        {/* <Icon type="diff" /> */}
                        <span>批量添加多个选项</span>
                    </a>
                    <Modal
                        title="批量添加选项"
                        visible={visible}
                        onOk={modleOkData}
                        okText = {'确认'}
                        cancelText = {'取消'}
                        onCancel={() => {
                            setVisible(false)
                            setOptionsText('')
                        }}
                    >
                        <p>每行代表一个选项，可以添加多个选项</p>
                        <TextArea value={optionsText}
                                  onChange={(e) => {
                                      setOptionsText(e.target.value)
                                  }}
                                  autoSize={{ minRows: 2, maxRows: 8 }}
                        />
                    </Modal>
                </div>
                :
                null
        }
    </div>
}

export default ViewValueCom;
