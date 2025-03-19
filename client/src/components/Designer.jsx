"use client";

import React, { useState } from "react";
import DesignerSidebar from "./DesignerSidebar";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import useDesigner from "./hooks/useDesigner";
import { FormElements } from "./FormElements";
import "./Designer.css"

export function Designer() {
  const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useDesigner();

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;

      const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea;

      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type].construct(Date.now());
        addElement(elements.length, newElement);
        return;
      }

      const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;
      const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement;

      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type].construct(Date.now());
        const overId = over.data?.current?.elementId;
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        
        if (overElementIndex === -1) throw new Error("element not found");
        
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) indexForNewElement = overElementIndex + 1;
        
        addElement(indexForNewElement, newElement);
        return;
      }

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement;

      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId;
        const overId = over.data?.current?.elementId;
        const activeElementIndex = elements.findIndex((el) => el.id === activeId);
        const overElementIndex = elements.findIndex((el) => el.id === overId);

        if (activeElementIndex === -1 || overElementIndex === -1) throw new Error("element not found");

        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);

        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) indexForNewElement = overElementIndex + 1;

        addElement(indexForNewElement, activeElement);
      }
    },
  });

  return (
    <div className="designer-container">
      <div
        className="designer-main-content"
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={`designer-drop-area ${droppable.isOver ? "drag-over" : ""}`}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="empty-drop-message">Drop here</p>
          )}

          {droppable.isOver && elements.length === 0 && (
            <div className="drop-preview">
              <div className="drop-preview-indicator"></div>
            </div>
          )}
          {elements.length > 0 && (
            <div className="elements-container">
              {elements.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
}

function DesignerElementWrapper({ element }) {
  const { removeElement, setSelectedElement } = useDesigner();
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  const DesignerElement = FormElements[element.type].designerComponent;
  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="element-wrapper"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
    >
      <div ref={bottomHalf.setNodeRef} className="drop-bottom-indicator" />
      <div ref={topHalf.setNodeRef} className="drop-top-indicator" />
      
      {mouseIsOver && (
        <>
          <div className="delete-button-container">
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
            >
            </button>
          </div>
          <div className="drag-hint">
            <p>Click for properties or drag to move</p>
          </div>
        </>
      )}
      {bottomHalf.isOver && <div className="bottom-drop-indicator-active" />}
      {topHalf.isOver && <div className="top-drop-indicator-active" />}
      <div className={`element-content ${mouseIsOver ? "hover-effect" : ""}`}>
        <DesignerElement elementInstance={element} />
      </div>
      
      
    </div>
  );
}

export default Designer;