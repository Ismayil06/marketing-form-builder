import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import { SidebarBtnElementDragOverlay } from "./SidebarBtnElement";
import { FormElements } from "./FormElements";
import useCanvas from "./hooks/useCanvas";
import "./DragOverlayWrapper.css";
export function DragOverlayWrapper() {
  const { elements } = useCanvas();
  const [draggedItem, setDraggedItem] = useState(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) return null;

  let node = <div>No drag overlay</div>;
  const isSidebarBtnElement = draggedItem.data?.current?.isCanvasBtnElement;

  if (isSidebarBtnElement) {
    const type = draggedItem.data?.current?.type;
    node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />;
  }

  const isCanvasElement = draggedItem.data?.current?.isCanvasElement;
  if (isCanvasElement) {
    const elementId = draggedItem.data?.current?.elementId;
    const element = elements.find((el) => el.id === elementId);
    if (!element) node = <div>Element not found!</div>;
    else {
      const CanvasElementComponent = FormElements[element.type].canvasComponent;

      node = (
        <div className="drag-overlay-element" style={{ opacity: 0.8, pointerEvents: "none" }}>
          <CanvasElementComponent elementInstance={element} />
        </div>
      );
    }
  }

  return <DragOverlay>{node}</DragOverlay>;
}

export default DragOverlayWrapper;