import { useRef, useState } from "react";
import { DndContext, DragOverlay, useDndMonitor, useDroppable } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { useDraggable } from "@dnd-kit/core";
import { nanoid } from "nanoid";
import { CSS } from '@dnd-kit/utilities'
import './index.less';
import { useImmer } from "use-immer";
import DraggableComp from "./components/CusDraggable";
import { SerialNumberConfig } from "./config";


export const renderers = {
  input: () => <input type="text" placeholder="This is a text input" />,
  textarea: () => <textarea rows={5} />,
  select: () => (
    <select>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
  ),
  text: () => (
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem
      Ipsum.
    </p>
  ),
  button: () => <button>Button</button>
} as any;




function getData(prop: any) {
  return prop?.data?.current ?? {};
}

function createSpacer({ id }: any) {
  return {
    id,
    type: "spacer",
    title: "spacer"
  };
}

export function CollectionTable() {
  const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(
    Date.now()
  );
  const spacerInsertedRef = useRef<any>();
  const currentDragFieldRef = useRef<any>();
  const [activeSidebarField, setActiveSidebarField] = useState<any>(); // only for fields from the sidebar
  const [activeField, setActiveField] = useState<any>(); // only for fields that are in the form.
  const [data, updateData] = useImmer<any>({
    fields: []
  });

  const cleanUp = () => {
    setActiveSidebarField(null);
    setActiveField(null);
    currentDragFieldRef.current = null;
    spacerInsertedRef.current = false;
  };

  const handleDragStart = (e: any) => {
    const { active } = e;
    const activeData = getData(active);

    // This is where the cloning starts.
    // We set up a ref to the field we're dragging
    // from the sidebar so that we can finish the clone
    // in the onDragEnd handler.
    if (activeData.fromSidebar) {
      const { field } = activeData;
      const { type } = field;
      setActiveSidebarField(field);
      // Create a new field that'll be added to the fields array
      // if we drag it over the canvas.
      currentDragFieldRef.current = {
        id: active.id,
        type,
        name: `${type}${fields.length + 1}`,
        parent: null
      };
      return;
    }

    // We aren't creating a new element so go ahead and just insert the spacer
    // since this field already belongs to the canvas.
    const { field, index } = activeData;

    setActiveField(field);
    currentDragFieldRef.current = field;
    updateData((draft: any) => {
      draft.fields.splice(index, 1, createSpacer({ id: active.id }));
    });
  };

  const handleDragOver = (e: any) => {
    const { active, over } = e;
    const activeData = getData(active);

    // Once we detect that a sidebar field is being moved over the canvas
    // we create the spacer using the sidebar fields id with a spacer suffix and add into the
    // fields array so that it'll be rendered on the canvas.

    // 🐑 CLONING 🐑
    // This is where the clone occurs. We're taking the id that was assigned to
    // sidebar field and reusing it for the spacer that we insert to the canvas.
    if (activeData.fromSidebar) {
      const overData = getData(over);

      if (!spacerInsertedRef.current) {
        // const spacer = createSpacer({
        //   id: active.id + "-spacer"
        // });

        updateData((draft: any) => {
          if (!draft.fields.length) {
            // draft.fields.push(spacer);
          } else {
            const nextIndex =
              overData.index > -1 ? overData.index : draft.fields.length;

            // draft.fields.splice(nextIndex, 0, spacer);
          }
          spacerInsertedRef.current = true;
        });
      } else if (!over) {
        // This solves the issue where you could have a spacer handing out in the canvas if you drug
        // a sidebar item on and then off
        updateData((draft: any) => {
          draft.fields = draft.fields.filter((f: any) => f.type !== "spacer");
        });
        spacerInsertedRef.current = false;
      } else {
        // Since we're still technically dragging the sidebar draggable and not one of the sortable draggables
        // we need to make sure we're updating the spacer position to reflect where our drop will occur.
        // We find the spacer and then swap it with the over skipping the op if the two indexes are the same
        updateData((draft: any) => {
          const spacerIndex = draft.fields.findIndex(
            (f: any) => f.id === active.id + "-spacer"
          );

          const nextIndex =
            overData.index > -1 ? overData.index : draft.fields.length - 1;

          if (nextIndex === spacerIndex) {
            return;
          }

          draft.fields = arrayMove(draft.fields, spacerIndex, overData.index);
        });
      }
    }
  };

  const handleDragEnd = (e: any) => {
    const { over } = e;

    // We dropped outside of the over so clean up so we can start fresh.
    if (!over) {
      cleanUp();
      updateData((draft: any) => {
        draft.fields = draft.fields.filter((f: any) => f.type !== "spacer");
      });
      return;
    }

    // This is where we commit the clone.
    // We take the field from the this ref and replace the spacer we inserted.
    // Since the ref just holds a reference to a field that the context is aware of
    // we just swap out the spacer with the referenced field.
    let nextField = currentDragFieldRef.current;

    if (nextField) {
      const overData = getData(over);

      updateData((draft: any) => {
        const spacerIndex = draft.fields.findIndex((f: any) => f.type === "spacer");
        draft.fields.splice(spacerIndex, 1, nextField);

        draft.fields = arrayMove(
          draft.fields,
          spacerIndex,
          overData.index || 0
        );
      });
    }

    setSidebarFieldsRegenKey(Date.now());
    cleanUp();
  };

  const { fields } = data;

  return (
    <SerialNumberConfig></SerialNumberConfig>
  )

  return (
    <div className="app">
      <div className="content">
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          autoScroll
        >
          {/* <Announcements /> */}
          <Sidebar fieldsRegKey={sidebarFieldsRegenKey} />
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={fields.map((f: any) => f.id)}
          >
            <Canvas fields={fields} />
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeSidebarField ? (
              <SidebarField overlay field={activeSidebarField} />
            ) : null}
            {activeField ? <Field overlay field={activeField} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}


const defaultAnnouncements = {
  onDragStart({ active }: any) {
    const { id } = active;
    console.log(`Start: Picked up draggable item ${id}.`);
  },
  onDragMove({ active, over }: any) {
    const { id } = active;
    const overId = over?.id;

    if (overId) {
      console.log(
        `Move: Draggable item ${id} was moved over droppable area ${overId}.`
      );
      return;
    }

    console.log(
      `Move: Draggable item ${id} is no longer over a droppable area.`
    );
  },
  onDragOver({ active, over }: any) {
    const { id } = active;
    const overId = over?.id;

    if (overId) {
      console.log(
        `Over: Draggable item ${id} was moved over droppable area ${overId}.`
      );
      return;
    }

    console.log(
      `Over: Draggable item ${id} is no longer over a droppable area.`
    );
  },
  onDragEnd({ active, over }: any) {
    const { id } = active;
    const overId = over?.id;

    if (overId) {
      console.log(
        `End: Draggable item ${id} was dropped over droppable area ${overId}`
      );
      return;
    }

    console.log(`End: Draggable item ${id} was dropped.`);
  },
  onDragCancel(id: any) {
    console.log(id);
    console.log(
      `Cancel: Dragging was cancelled. Draggable item ${id} was cancelled.`
    );
  }
};

export function Announcements() {
  useDndMonitor(defaultAnnouncements);

  return null;
}



function getRenderer(type: any) {
  if (type === "spacer") {
    return () => {
      return <div className="spacer">spacer</div>;
    };
  }

  return renderers[type] || (() => <div>No renderer found for {type}</div>);
}

export function Field(props: any) {
  const { field, overlay, ...rest } = props;
  const { type } = field;


  const Component = getRenderer(type);

  let className = "canvas-field";
  if (overlay) {
    // className += " overlay";
  }

  return (
    <div 
    className={className}
    >
      <Component {...rest} />
    </div>
  );
}

function SortableField(props: any) {
  const { id, index, field } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id,
    data: {
      index,
      id,
      field
    }
  });

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition
  // };

  // const {
  //   isDragging,
  //   attributes,
  //   listeners,
  //   setNodeRef,
  //   transform,
  //   transition,
  // } = useSortable({id: props.id});

  const backgroundColor =
    props.id == 1 ? 'Orange' : props.id == 2 ? 'pink' : 'gray';

  const style = {
    position: 'relative',
    zIndex: isDragging ? 1 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
    // height: 100,
    // width: 100,
    border: '2px solid black',
    backgroundColor,
    borderRadius: 10,
    touchAction: 'none',
    margin: 20,
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Field field={field} />
    </div>
  );
}

export function Canvas(props: any) {
  const { fields } = props;
  const {
    setNodeRef,
    // transform,
    // transition
  } = useDroppable({
    id: "canvas_droppable",
    data: {
      parent: null,
      isContainer: true
    }
  });

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition
  // };

  return (
    <div
      ref={setNodeRef}
      className="canvas"
      // style={style}
      // {...attributes}
      // {...listeners}
    >
      <div className="canvas-fields">
        {fields?.map((f:any, i:any) => (
          <SortableField key={f.id} id={f.id} field={f} index={i} />
        ))}
      </div>
    </div>
  );
}






export function SidebarField(props: any) {
  const { field, overlay } = props;
  const { title } = field;

  let className = "sidebar-field";
  if (overlay) {
    className += " overlay";
  }

  return <div className={className}>{title}</div>;
}

function DraggableSidebarField(props: any) {
  const { field, ...rest } = props;

  const id = useRef(nanoid());

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id.current,
    data: {
      field,
      fromSidebar: true
    }
  });

  return (
    <div
      ref={setNodeRef}
      className="sidebar-field"
      {...listeners}
      {...attributes}
    >
      <SidebarField field={field} {...rest} />
    </div>
  );
}

export function Sidebar(props: any) {
  const { fieldsRegKey } = props;

  return (
    <div key={fieldsRegKey} className="sidebar">
      { [
  {
    type: "input",
    title: "Text Input"
  },
  {
    type: "select",
    title: "Select"
  },
  {
    type: "text",
    title: "Text"
  },
  {
    type: "button",
    title: "Button"
  },
  {
    type: "textarea",
    title: "Text Area"
  }
].map((f) => (
        <DraggableSidebarField key={f.type} field={f} />
      ))}
    </div>
  );
}
