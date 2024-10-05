import { AlbumPaintingStore } from "../AlbumPainting/Context";

export function useAlbumPaintingStore() {
  return useContext(AlbumPaintingStore);
}