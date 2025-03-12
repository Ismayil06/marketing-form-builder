import React from 'react';
import { useContext } from 'react';
import { DndContext } from '@dnd-kit/core';
import { FormContext } from '../../context/FormContext';

export const DragHandler = ({ children }) => {
  const {formFields, moveField, addField } = useContext(FormContext);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
};