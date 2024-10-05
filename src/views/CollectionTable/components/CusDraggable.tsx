import React from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, useDroppable, useDraggable } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { observer } from "mobx-react-lite";
import { CSS } from '@dnd-kit/utilities'

function SortableItem({ item ,id }:any) {
  const { attributes, listeners,isDragging,transition,setNodeRef, transform } = useSortable({ id: item.id });
  // const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;


  const backgroundColor =
    id == 1 ? "Orange" : id == 2 ? "pink" : "gray";

  const style = {
    position: "relative",
    zIndex: isDragging ? 1 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
    border: "2px solid black",
    backgroundColor,
    borderRadius: 10,
    touchAction: "none",
    // margin: 20,
  } as React.CSSProperties;

  return (
    <div key={item.id} ref={setNodeRef} style={style} {...attributes}>
      {item.content(item, listeners)}
    </div>
  );
}

export const DraggableComp = observer(({ items, onDragEnd }: { items: any[], onDragEnd: (items: any) => void }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onDragEnd(newItems);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}
      </SortableContext>
    </DndContext>
  );
});

export default DraggableComp;


export function AppD() {
  const [isDropped, setIsDropped] = useState(false);
  const draggableMarkup = (
    <Draggable>Drag me</Draggable>
  );
  

  function handleDragEnd(event:any) {
    console.log(event);
    
    if (event.over && event.over.id === 'droppable123') {
      setIsDropped(true);
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      {!isDropped ? draggableMarkup : draggableMarkup}
      <Droppable>
        {isDropped ? <>无敌是多么寂寞</> : 'Drop here'}
      </Droppable>
    </DndContext>
  );
}

function Droppable(props:any) {
  const {isOver, setNodeRef} = useDroppable({
    id: 'droppable123',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

function Draggable(props:any) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: 'draggable',
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}