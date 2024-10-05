import { IconFont } from '@/utils/iconFont'

export const DragOriginNode = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('nodeType', nodeType)
  }

  return (
    <aside className="box_main">
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 't-node-btn')} draggable>
        <IconFont
          type="icon-anniu"
          size={54}
          style={{
            fontSize: 54,
          }}
        />
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 't-node-image')} draggable>
        <IconFont
          type="icon-tupian1"
          size={49}
          style={{
            fontSize: 49,
          }}
        />
      </div>
    </aside>
  )
}
