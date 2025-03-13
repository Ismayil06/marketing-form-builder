import React from 'react';
import { useContext } from 'react';
import { DndContext , DragOverlay} from '@dnd-kit/core';
import { FormContext } from '../../context/FormContext';
import { useState } from 'react';
import { ToolboxItem } from './Toolbox';
import './Toolbox.css';
const formElements = [
  { type: 'text', label: 'Text Input', icon: 'T' },
  { type: 'dropdown', label: 'Dropdown', icon: '▼' },
  { type: 'table', label: 'Table', icon: '◫' },
  { type: 'file', label: 'File Upload', icon: '📁' }, // Bonus
];

export const DragHandler = ({ children }) => {
  const {formFields, moveField, addField } = useContext(FormContext);
  const [activeType, setActiveType] = useState(null);
  const handleDragEnd = (event) => {
    
    const { active, over } = event;
    if (formFields.length > 0 && active.id !== over?.id) {
        const oldIndex = formFields.findIndex(f => f.id === active.id);
        const newIndex = formFields.findIndex(f => f.id === over?.id);
        moveField(oldIndex, newIndex);
    }
    
    if (active.data.current?.isToolboxItem && over?.id === 'canvas') {

      const newField = {
        id: `field-${Date.now()}`,
        type: active.data.current.type,
        question: 'New Question',
        required: false,
        // Type-specific defaults
        ...(active.data.current.type === 'text' && { 
          minLength: 0,
          maxLength: 100 
        }),
        ...(active.data.current.type === 'dropdown' && { 
          options: ['Option 1'] 
        }),
        ...(active.data.current.type === 'table' && { 
          columns: [{ name: 'Column 1', type: 'text' }] 
        })
      };
      addField(newField);
    }
  };
  function handleDragStart(event) {
    console.log(event.active.data.current.type);
    setActiveType(event.active.data.current.type);
  }
  return (
    <>
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          {children}
      </DndContext>
      <DragOverlay>
        {activeType ? (
          formElements.map((element) => {
            if (element.type === activeType) {

              return <ToolboxItem key={element.type} element={element} />;
            }
            return null;
          }
          )
        ): null}
      </DragOverlay>
    </>
    
  );
};