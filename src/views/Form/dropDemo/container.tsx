/**
 * @Author zhiyuan.xu
 * @Date 2020/12/11
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/11
 */
import React, {  useState, useCallback, useRef, useEffect } from 'react';
import comDataMap, { ComMap, changeMapKey, getStateListData } from '../com-setting'
import { getSettingData } from '../com-setting/cpSetting';
import { actionKeys } from '../com-setting/cpvSetting';
import  { DragDropContext } from 'react-beautiful-dnd'
import { LeftWrap } from './leftWrap';
import { ContentWrap } from './contentWrap'
import { Tooltip, Button, Empty, Modal } from 'antd';
import CpvForm from "./cpvForm";
import CpForm from "./cpForm";
import { getFormData, getCpvData } from '../dropDemo/util';
// import { testData } from '../testData';
// import cloneDeep from 'clone-deep';
import { madeTemplateData } from '../com-setting/templateJsonSetting';

export const Container = function Container() {
    const [moveList, setMoveList] = useState([])
    const [rightData, setRightData] = useState(null)
    const [leftNav, setLeftNav] = useState(true);
    const [rightNav, setRightNav] = useState(false);
    const activeData = useRef({})
    const rightDataMap = useRef({})

    useEffect(() => {
        // 编辑情况
        // rightDataMap.current = cloneDeep(testData)
        // const editMoveList = getStateListData(cloneDeep(testData));
        // setMoveList(editMoveList)
    }, [])

    // 添加
    const dropData = (data, droppableDestination) => {
        const list = [...moveList]
        const itemId = Math.random().toString(16).substring(2);
        list.splice(droppableDestination.index, 0, {
            ...data,
            id: itemId
        });
        // 提交数据...处理
        rightDataMap.current[itemId] = getFormData(getSettingData(), data)
        // 处理排序
        list.forEach((item, index) => {
            rightDataMap.current[item.id].sort = index;
        })
        setMoveList(list);
    }

    const changeListHandle = useCallback((dragIndex, hoverIndex) => {
        let CardList = [...moveList];
        let tmp = CardList[dragIndex] //临时储存文件
        CardList.splice(dragIndex,1) //移除拖拽项
        CardList.splice(hoverIndex,0, tmp) //插入放置项
        // 处理排序
        CardList.forEach((item, index) => {
            rightDataMap.current[item.id].sort = index;
        })
        setMoveList(CardList)
    }, [moveList])


    const changeValueHanlde = (key, pId, data, activeData, actionKey) => {
        const Select = changeMapKey.Select;
        const obj = {
            [Select]: () => {
                setMoveList((list) => {
                    const cloneData = list.map((item) => {
                        if (item.id === pId) {
                            item.defaultValue = cloneDeep(data);
                        }
                        return item;
                    })
                    // 显示数据
                    return cloneData
                });

                // 提交数据
                const actionUpdateV = {
                    [actionKeys.changeValue]: (item) => {
                        rightDataMap.current[pId].cpvData[item.id].name = item.value;
                    },
                    [actionKeys.addMany]: (list) => {
                        const addData = getCpvData({
                            defaultValue: list
                        }, 9999)
                        rightDataMap.current[pId].cpvData = Object.assign(rightDataMap.current[pId].cpvData, addData)
                    },
                    [actionKeys.addOne]: (data) => {
                        const addData = getCpvData({
                            defaultValue: [ data ]
                        }, 9999)
                        rightDataMap.current[pId].cpvData = Object.assign(rightDataMap.current[pId].cpvData, addData)
                    },
                    [actionKeys.delete]: (id) => {
                        delete rightDataMap.current[pId].cpvData[id]
                    },
                    [actionKeys.sort]: (list) => {
                        list.map((item, index) => {
                            rightDataMap.current[pId].cpvData[item.id].sort = index;
                        })
                    }
                }
                actionUpdateV[actionKey](activeData)
            }
        }
        obj[key] && obj[key]()

    }


    const getItem = (id) => ComMap[id];

    const onDragEnd = (result) => {
        // dropped outside the list
        const { source, destination, draggableId } = result;

        if (!result.destination) {
            return;
        }
        if (source.droppableId === destination.droppableId) {
            // sort
            changeListHandle(source.index, destination.index)
        } else {
            // add
            const data = getItem(draggableId)
            dropData(data, destination);
        }
    }

    const setActive = (id) => {
        // 如果点击两次一致就不触发
        if (activeData.current.id === id) return;

        setMoveList((list) => {
            return list.map(item => {
                if (item.id === id) {
                    item.active = true
                    activeData.current = item
                } else {
                    item.active = false
                }
                return item;
            })
        })
    }

    const deleteItem = (id) => {
        if (rightData && rightData.data.id === id) {
            setRightData(null)
            setRightNav(false)
        }
        // 删除显示数据
        setMoveList((list) => list.filter( item => item.id !== id ));
        // 删除提交数据
        delete rightDataMap.current[id];
    }

    const changeLableName = (name, id) => {
        // 显示数据的改变
        setMoveList(list => {
            return  list.map(item => {
                if (item.id === id) {
                    item.name = name
                }
                return item;
            })
        })
        // 提交数据的改变
        rightDataMap.current[id].name = name;
    }

    const setSettingDataActive = (data) => {
        // 展示数据
        setRightData(data)
        hiddenRightHandle(true)
    }

    const hiddenRightHandle = (boolean) => {
        setRightNav(boolean)
    }

    // 改变cp的编辑
    const ChangeCpFormData = (id, data) => {
        Object.keys(data).forEach((key) => {
            rightDataMap.current[id][key] = data[key]
        })
    }

    // 左侧的显示数据菜单
    const setPvFormValue = (form, id) => {
        const values = form.getFieldsValue()
        Object.keys(values).forEach((k) => {
            values[k] = rightDataMap.current[id][k]
        })
        form.resetFields()
        form.setFieldsValue(values)
    }

    // 改变cpv data
    const ChangeCpvFormData = (pid, vid, value) => {
        Object.keys(value).forEach((key) => {
            rightDataMap.current[pid].cpvData[vid][key] = value[key]
        })
    }

    // 改变 cpv data
    const setCpvFormValue = (form, pId, vId) => {
        const values = form.getFieldsValue();
        Object.keys(values).forEach((k) => {
            values[k] = rightDataMap.current[pId].cpvData[vId][k]
        })
        form.resetFields()
        form.setFieldsValue(values)
    }

    const renderRight = (rightData) => {
        const rightObj = {
            [changeMapKey.Select]: <div className={'form-item-wrap'}>
                <div className={'form-right-wrap'}>
                    <div className={'form-item-title'}>
                        <span>
                             {
                                 `"${rightData.pName}"的选项: "${rightData.data.value}" 的设置`
                             }
                        </span>
                    </div>
                    <Tooltip placement="bottom" title={`收起`}>
                        <Button icon="double-right" onClick={() => {
                            hiddenRightHandle(false)
                        }} />
                    </Tooltip>
                </div>
                <div>
                    <CpvForm rightData={rightData}
                             ChangeCpvFormData={ ChangeCpvFormData }
                             setCpvFormValue = { setCpvFormValue }
                    />
                </div>
            </div>,
            [changeMapKey.cpChange]: <div className={'form-item-wrap'}>
                <div className={'form-right-wrap'}>
                    <div className={'form-item-title'}>
                        <span>
                            {
                                `"${rightData.data.name}"的设置`
                            }
                        </span>
                    </div>
                    <Tooltip placement="left" title={`收起`}>
                        <Button icon="double-right" onClick={() => {
                            hiddenRightHandle(false)
                        }} />
                    </Tooltip>
                </div>
                <div>
                    <CpForm ChangeCpFormData={ ChangeCpFormData }
                            rightData={rightData}
                            setPvFormValue = {setPvFormValue}
                    />
                </div>
            </div>
        }
        return rightObj[rightData.key]
    }

    const addFormItem = (draggableId) => {
        const data = getItem(draggableId)
        dropData(data, {
            index: moveList.length
        });
    }

    const hiddenLeftHandle = (boolean) => {
        setLeftNav(boolean)
    }

    return (
        <div>
            <div className={'title-btn-wrap'}>
                <Button type="primary" onClick={() => {
                    Modal.info({
                        title: '这是提交的数据',
                        width: 800,
                        content: (
                            <div>
                                <pre>
                                    <code>
                                        {
                                            JSON.stringify(rightDataMap.current, null, 4)
                                        }
                                    </code>
                                </pre>
                            </div>
                        ),
                    });
                }}>获取提交数据</Button>
                <Button type="primary" onClick={() => {
                    Modal.info({
                        title: '这是展示的数据',
                        width: 800,
                        content: (
                            <div>
                                <pre>
                                    <code>
                                        {
                                            JSON.stringify(moveList, null, 4)
                                        }
                                    </code>
                                </pre>
                            </div>
                        ),
                    });
                }}>获取展示数据</Button>
                <Button type="primary" onClick={() => {
                    const showViewData = madeTemplateData(rightDataMap.current);
                    Modal.info({
                        title: '这是展示的数据',
                        width: 800,
                        content: (
                            <div>
                                <pre>
                                    <code>
                                        {
                                            JSON.stringify(showViewData, null, 4)
                                        }
                                    </code>
                                </pre>
                            </div>
                        ),
                    });
                }}>获取JSON模板数据</Button>
            </div>
            <div className={'big-container'}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className={'leftNav'}>
                        <div className={'btn-big-wrap'} style={
                            leftNav ? {
                            } : {
                                width: 0,
                            }
                        }>
                            <LeftWrap btnList={comDataMap}
                                      addFormItem = {addFormItem}
                                      hiddenLeftHandle={ hiddenLeftHandle }
                            />
                        </div>
                        <div className={'more-btn'} style={
                            leftNav ? {display: 'none'} : {}
                        }>
                            <Tooltip placement="right" title={`展开`}>
                                <Button icon="double-right" onClick={() => {
                                    hiddenLeftHandle(true)
                                }} />
                            </Tooltip>
                        </div>
                    </div>
                    <div className={'content-wrap'} >
                        <ContentWrap changeLableName={changeLableName}
                                     deleteHandle={deleteItem}
                                     setActive={setActive}
                                     moveList={moveList}
                                     changeValueHanlde={changeValueHanlde}
                                     setSettingDataActive={setSettingDataActive}
                        />
                    </div>
                </DragDropContext>
                <div className={'rightNav-wrap'}>
                    <div className={'rightNav'} style={
                        rightNav ? {width: 300} : { width: 0, overflow: 'hidden' }
                    }>
                        {
                            rightData ?
                                renderRight(rightData)
                                :
                                <div style={{ width:'100%' }}>
                                    <div style={{ display:'flex', justifyContent:'flex-end' }}>
                                        <Tooltip placement="bottom" title={`收起`}>
                                            <Button icon="double-right" onClick={() => {
                                                hiddenRightHandle(false)
                                            }} />
                                        </Tooltip>
                                    </div>
                                    <div style={{ marginTop: 50 }}>
                                        <Empty description={'暂无选中数据'} />
                                    </div>
                                </div>
                        }
                    </div>
                    <div className={'right-more-btn'} style={
                        rightNav? {display: 'none'} : {}
                    }>
                        <Tooltip placement="right" title={`展开`}>
                            <Button icon="double-left" onClick={() => {
                                hiddenRightHandle(true)
                            }} />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
};
