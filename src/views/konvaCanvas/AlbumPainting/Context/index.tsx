import { createContext, PropsWithChildren } from "react";
import { OperationStore } from "../Stores/Operation";
import { StageManager } from "../Stores/StageManager";
import { DataManagement } from "../Stores/DataManagement";

export const AlbumPaintingStore = createContext(
  {} as {
    dataManager: DataManagement,
    stageManager: StageManager,
    operationStore: OperationStore,
  }
);

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