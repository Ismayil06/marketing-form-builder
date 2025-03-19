import React from "react";
import { useDraggable } from "@dnd-kit/core";
import "./SidebarBtnElement.css"
function SidebarBtnElement({ formElement }) {
    console.log(formElement);
  const { label, icon: Icon } = formElement.designerBtnElement;
  const draggable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });

  return (
    <button
      ref={draggable.setNodeRef}
      className={`sidebar-btn ${draggable.isDragging ? "dragging" : ""}`}
      {...draggable.listeners}
      {...draggable.attributes}
    >

      <span className="sidebar-btn-label">{label}</span>
    </button>
  );
}

export function SidebarBtnElementDragOverlay({ formElement }) {
  const { label, icon: Icon } = formElement.designerBtnElement;

  return (
    <button className="sidebar-btn">

      <span className="sidebar-btn-label">{label}</span>
    </button>
  );
}

export default SidebarBtnElement;