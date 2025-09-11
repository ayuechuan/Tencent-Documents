/**
 * @Author zhiyuan.xu
 * @Date 2020/12/18
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/18
 */
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { droppableBtn } from '../com-setting/DroppableIDs';
import { Tabs, Button, Empty, Tooltip } from 'antd';
const { TabPane } = Tabs;

export const LeftWrap = ({btnList, addFormItem, hiddenLeftHandle}) => {

    function getStyle(style, snapshot) {
        if (!snapshot.isDragging) return {
        };
        if (!snapshot.isDropAnimating) {
            return {
                ...style,
            };
        }
        return {
            ...style,
            // cannot be 0, but make it super tiny
            transitionDuration: `0.0000001s`
        };
    }


    return <Droppable key={droppableBtn} droppableId={ droppableBtn } isDropDisabled={true}>
        {(provided, snapshot) => (
            <>
                <Tabs key={'tab---2'} tabBarExtraContent={
                    <Tooltip placement="right" title={`收起`}>
                        <Button icon="double-left" onClick={() => {
                            hiddenLeftHandle(false)
                        }} />
                    </Tooltip>
                }>
                    {
                        btnList.map((list, index) => (
                            <TabPane tab={`${list.name}`} key={`tab--as${index}`}>
                                {
                                    list.list.length > 0 ? list.list.map((data, i) => (
                                        <div key={`w123${i}`}>
                                            <div key={`${i}-title`} className={'btn-title'}> {data.name} </div>
                                            <div key={`${i}-wrap`} className={'btn-wrap'} ref={provided.innerRef}>
                                                {
                                                    data.list.map((item, index) => (
                                                        <Draggable
                                                            key={`${i}-${item.mode}`}
                                                            draggableId={`${item.mode}`}
                                                            index={i > 0 ? list.list[i-1].list.length + index : index}>
                                                            {(provided, snapshot) => (
                                                                <>
                                                                    <div
                                                                        key={`${index}-${item.mode}-btnDes`}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={'box-btn'}
                                                                        style={
                                                                            getStyle(provided.draggableProps.style, snapshot)
                                                                        }
                                                                        onClick={(event) => {
                                                                            event.stopPropagation();
                                                                            addFormItem(item.mode)
                                                                        }}
                                                                    >
                                                                        <div className={'box-btn-wrap'}>
                                                                            {/* <Icon className={'box-btn-btn'} component={item.svg} /> */}
                                                                            <span>{item.name}</span>
                                                                        </div>
                                                                    </div>
                                                                    {snapshot.isDragging && (
                                                                        <div key={`${index}-${item.mode}-ssss`} className={'box-btn'}>
                                                                            <div className={'box-btn-wrap'}>
                                                                                {/* <Icon className={'box-btn-btn'} component={item.svg} /> */}
                                                                                <span>{item.name}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                    :
                                    <Empty style={{
                                        marginTop: 60
                                    }} description={'控件火速正在开发中..'} />
                                }
                            </TabPane>
                        ))
                    }
                </Tabs>
                <span key={'span'} style={{
                    display: "none"
                }}>
                    {provided.placeholder}
                 </span>
            </>
        )}
    </Droppable>
}
