import { createContext, PropsWithChildren } from "react";
import { OperationStore } from "../Stores/Operation";
import { StageManager } from "../Stores/StageManager";
import { DataManagement } from "../Stores/DataManagement";

export const AlbumPaintingStore = createContext(
  {} as {
    // 列表数据管理器
    dataManager: DataManagement,
    // 画布数据管理器
    stageManager: StageManager,
    // 其他响应数据管理
    operationStore: OperationStore,
  }
);
//  画册
export function AlbumPaintingProvider({ children }: PropsWithChildren) {
  const [dataManager] = useState(() => new DataManagement())
  const [stageManager] = useState(() => new StageManager(dataManager))
  const [operationStore] = useState(() => new OperationStore(dataManager));
  return (
    <AlbumPaintingStore.Provider
      value={{
        dataManager,
        stageManager,
        operationStore
      }}>
      {children}
    </AlbumPaintingStore.Provider>
  )
}