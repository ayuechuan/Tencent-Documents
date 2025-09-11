/**
 * @Author zhiyuan.xu
 * @Date 2020/12/18
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/18
 */
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Empty, Tooltip } from 'antd'
import { useRef } from 'react';
import { droppableFrom } from '../com-setting/DroppableIDs';
import '../antd-com/commonCompetent/viewCom.scss';
import '../antd-com/picture/picture.scss';
import '../antd-com/inputAndAdd/inputAndAdd.scss'
import { changeMapKey } from "../com-setting";

export const ContentWrap = ({ moveList, setActive, deleteHandle,
    changeLableName, changeValueHanlde,
    setSettingDataActive }) => {
    const text = useRef('');

    const setItem = (index, item) => {
        setSettingDataActive({
            pSort: index,
            data: item,
            key: changeMapKey.cpChange
        })
    }

    return <Droppable key={`DroppableContent`} droppableId={droppableFrom}>
        {(provided, snapshot) => (
            <div className={'drop-wrap'}>
                <div ref={provided.innerRef}
                    className={moveList && moveList.length ? 'drop-content-wrap' : ''}
                    style={snapshot.isDraggingOver ? { border: '1px dashed #000', pointerEvents: 'none' } : {
                        border: '1px' +
                            ' solid #f5f5f5'
                    }}
                >
                    {
                        moveList && moveList.length ?
                            moveList.map((item, index) => {
                                const ViewCom = item.ViewCom;
                                text.current = item.name;
                                return <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(
                                        provided,
                                        snapshot
                                    ) => (
                                        <div
                                            onClick={() => {
                                                setActive(item.id)
                                                setItem(index, item)
                                            }}
                                            ref={provided.innerRef}
                                            className={'form-item-wrap'}
                                            {...provided.draggableProps}
                                            style={
                                                (() => {
                                                    console.log('napshot.isdragging',snapshot);
                                                    
                                                    const style = snapshot.isDragging ? {
                                                        border: '2px solid #1890ff',
                                                        boxShadow: '0 10px 15px 0 rgba(0,0,0,.1)',
                                                        // transition: `transform 5s cubic-bezier(0.2, 0, 0.2, 1)` 
                                                    }
                                                        : {}
                                                        if(!provided.draggableProps.style.transition && snapshot.isdragging){
                                                            // provided.draggableProps.style['transition-duration'] = '300ms'
                                                            provided.draggableProps.style.transition = `transform 2s cubic-bezier(0.2, 0, 0.2, 1)`
                                                        }
                                                    return {
                                
                                                        ...provided.draggableProps.style,
                                                        ...style,

                                                    }
                                                })()
                                            }>

                                            <div className={'title-wrap'}>
                                             {item.active && <div style={{
                                                backgroundColor : 'red',
                                                width : 300
                                             }}>啦啦啦啦</div>}

                                                <div className={'title-action-wrap'}>
                                                    <Tooltip placement="top" title={'移动排序'}>
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className={'ico-btn sort-btn'}
                                                        >
                                                            1234566
                                                            {/* <Icon type="drag" /> */}
                                                        </div>
                                                    </Tooltip>
                                                    <Tooltip placement="top" onClick={(event) => { event.stopPropagation(); deleteHandle(item.id) }} title={'删除选项'}>
                                                        {/* <Icon className={'ico-btn delete-btn'} type="delete" /> */}
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <div className={'view-form-wrap'}>
                                                <ViewCom defaultValue={item.defaultValue}
                                                    changeVlaue={changeValueHanlde}
                                                    viewId={item.id}
                                                    key={`${item.id}-view`}
                                                    data={item}
                                                    sort={index}
                                                    setSettingDataActive={setSettingDataActive}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            })
                            :
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'拖拽到此'} />
                    }
                    {provided.placeholder}
                </div>
            </div>
        )}
    </Droppable>
}
