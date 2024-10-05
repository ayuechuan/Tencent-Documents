import { createContext } from "react";
import { AlbumPaintingProvider } from "./Context";
import { Item } from "./components/Item";
import { AlbumPaintingStage } from "./AlbumPaintingStage";

export const AlbumPainting = () => {
  return (
    <AlbumPaintingProvider>
      <AlbumPaintingStage
        ItemChildrenRender={(props) => <Item {...props} />}
        //  可自定义
        ActiveDragElement={(props) => <Item {...props} />}
        StageWidth={800}
        StageHeight={600}
        autofit={false}
      />
    </AlbumPaintingProvider>
  )
}
