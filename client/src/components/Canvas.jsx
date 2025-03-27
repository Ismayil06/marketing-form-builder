"use client";

import React, { useState } from "react";
import CanvasSidebar from "./CanvasSidebar";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import useCanvas from "./hooks/useCanvas";
import { FormElements } from "./FormElements";
import "./Canvas.css"

export function Canvas() {
  const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useCanvas();

  const droppable = useDroppable({
    id: "canvas-drop-area",
    data: {
      isCanvasDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isCanvasBtnElement = active.data?.current?.isCanvasBtnElement;
      const isDroppingOverCanvasDropArea = over.data?.current?.isCanvasDropArea;

      const droppingSidebarBtnOverCanvasDropArea = isCanvasBtnElement && isDroppingOverCanvasDropArea;

      if (droppingSidebarBtnOverCanvasDropArea) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type].construct(Date.now());
        addElement(elements.length, newElement);
        return;
      }

      const isDroppingOverCanvasElementTopHalf = over.data?.current?.isTopHalfCanvasElement;
      const isDroppingOverCanvasElementBottomHalf = over.data?.current?.isBottomHalfCanvasElement;
      const isDroppingOverCanvasElement = isDroppingOverCanvasElementTopHalf || isDroppingOverCanvasElementBottomHalf;
      const droppingSidebarBtnOverCanvasElement = isCanvasBtnElement && isDroppingOverCanvasElement;

      if (droppingSidebarBtnOverCanvasElement) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type].construct(Date.now());
        const overId = over.data?.current?.elementId;
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        
        if (overElementIndex === -1) throw new Error("element not found");
        
        let indexForNewElement = overElementIndex;
        if (isDroppingOverCanvasElementBottomHalf) indexForNewElement = overElementIndex + 1;
        
        addElement(indexForNewElement, newElement);
        return;
      }

      const isDraggingCanvasElement = active.data?.current?.isCanvasElement;
      const draggingCanvasElementOverAnotherCanvasElement = isDroppingOverCanvasElement && isDraggingCanvasElement;

      if (draggingCanvasElementOverAnotherCanvasElement) {
        const activeId = active.data?.current?.elementId;
        const overId = over.data?.current?.elementId;
        const activeElementIndex = elements.findIndex((el) => el.id === activeId);
        const overElementIndex = elements.findIndex((el) => el.id === overId);

        if (activeElementIndex === -1 || overElementIndex === -1) throw new Error("element not found");

        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);

        let indexForNewElement = overElementIndex;
        if (isDroppingOverCanvasElementBottomHalf) indexForNewElement = overElementIndex + 1;

        addElement(indexForNewElement, activeElement);
      }
    },
  });

  return (
    <div className="canvas-container">
      <div
        className="canvas-main-content"
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={`canvas-drop-area ${droppable.isOver ? "drag-over" : ""}`}
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
                <CanvasElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
      <CanvasSidebar />
    </div>
  );
}

function CanvasElementWrapper({ element }) {
  const { removeElement, setSelectedElement } = useCanvas();
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfCanvasElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfCanvasElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isCanvasElement: true,
    },
  });

  if (draggable.isDragging) return null;

  const CanvasElement = FormElements[element.type].canvasComponent;
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
        <CanvasElement elementInstance={element} />
      </div>
      
      
    </div>
  );
}

export default Canvas;