import { ClearIcon, CursorIcon, GestureRanslationIcon, MoonIcon, RollbackIcon, RollfrontIcon } from "tdesign-icons-react";
import { Space, Tooltip } from "tdesign-react";
import { useFlowStore } from "../../FlowProvider";
import { observer } from "mobx-react-lite";
import { useRedoWithUndo } from "../../hooks/useRedoWithUndo";
import { useClearFlow } from "../../hooks/useClearFlow";

export const ModeBar = observer(() => {
  const store = useFlowStore();
  const { redo, undo } = useRedoWithUndo();
  const clear = useClearFlow();
  return (
    <div className='flow_panel'>
      <div className='controller'>
        <Space size={14}>
          <Tooltip
            content="撤销"
            destroyOnClose
            showArrow
            theme="default"
          >
            <RollbackIcon
              style={{ opacity: store.history.canBeUndo ? 1 : 0.2 }}
              onClick={() => {
                if (!store.history.canBeUndo) {
                  return;
                }
                undo();
              }}
            />
          </Tooltip>
          <Tooltip
            content="重做"
            destroyOnClose
            showArrow
            theme="default"
          >
            <RollfrontIcon
              style={{ opacity: store.history.canBeRedo ? 1 : 0.2 }}
              onClick={() => {
                if (!store.history.canBeRedo) {
                  return;
                }
                redo();
              }}
            />
          </Tooltip>
          <div style={{ width: '100%', height: '100%' }}>
            <CursorIcon onClick={() => {
              store.mode.type = 'selection';
            }} />
          </div>
          <GestureRanslationIcon onClick={() => {
            store.mode = {
              ...store.mode,
              type: 'move'
            };
          }} />
          <ClearIcon onClick={clear} />
          <MoonIcon onClick={() => {
            store.mode.colorMode = store.mode.colorMode === 'light' ? 'dark' : 'light';
          }} />
        </Space>
      </div>
    </div>
  )
});
