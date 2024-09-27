import { IMenuItem, MenuItem } from "@/components/menuItem/menuItem";
import { autorun } from "mobx";
import { useLocalObservable, useObserver } from "mobx-react-lite";
import Dropdown from "rc-dropdown";
import { createContext } from "react";

const ContextMenu = createContext(null as any);


interface IContextMenu {
  visible: boolean;
  items: IMenuItem[];
  selectedKeys: never[];
  readonly isOpen: boolean | 0;
  handleItems(items: IMenuItem[]): void;
}

export const ContextMenuProvider = (props: any) => {
  const contextMenu = useLocalObservable(() => {
    return {
      visible: false,
      items: [] as IMenuItem[],
      selectedKeys: [],
      handleItems(items: IMenuItem[]) {
        this.items = items;
      }
    };
  });

  const store = useLocalObservable<{ items: IMenuItem[] }>(() => ({ items: [] }));

  useEffect(
    () =>
      autorun(async () => {
        store.items = (await Promise.all(contextMenu.items)).flat();
      }),
    []
  );

  const onVisibleChange = useCallback((visible: boolean) => {
    if (visible && contextMenu.items.length) {
      contextMenu.visible = visible;
    } else {
      (contextMenu.visible = false);
      (contextMenu.items = []);
      // contextMenu.visible && (contextMenu.visible = false);
      // contextMenu.items.length && (contextMenu.items = []);
    }
  }, []);

  const onMenuClick = useCallback((params: any) => {
    const { closeAfterClick = true } = params;
    if (closeAfterClick) {
      contextMenu.visible = false;
      contextMenu.items = [];
    }
  }, []);

  return useObserver(() => (
    <ContextMenu.Provider value={contextMenu}>
      <Dropdown
        trigger={['contextMenu']}
        visible={contextMenu.visible}
        onVisibleChange={onVisibleChange}
        overlayStyle={{
          border: 'none',
          boxShadow: 'none'
        }}
        placement="bottomRight"
        overlay={
          <MenuItem
            items={store.items}
            style={{ minWidth: 160 }}
            onClick={onMenuClick}
          ></MenuItem>
        }
        animation="slide-up"
        alignPoint>
        <div
          role="button"
          style={{
            border: '1px solid #000',
          }}
        >
          {props.children}
        </div>
      </Dropdown>
    </ContextMenu.Provider>
  ))
}

export function useContextMenu() {
  return useContext(ContextMenu) as IContextMenu;
}
