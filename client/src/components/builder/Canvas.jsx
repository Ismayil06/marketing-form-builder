import React, { useContext } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormContext } from '../../context/FormContext';
import TextInput from '../fields/TextInput';
import Dropdown from '../fields/Dropdown';
import TableEditor from '../fields/TableEditor.jsx';
import Field from './Field';
import { arrayMove } from '@dnd-kit/sortable';
import './canvas.css';


const Canvas = () => {
  const { formFields, addField, moveFields } = useContext(FormContext);
  const { setNodeRef } = useDroppable({ id: 'canvas' });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Handle new field addition from toolbox
    if (active.data.current?.isToolboxItem && over?.id === 'canvas') {
      const newField = {
        id: Date.now().toString(),
        type: active.data.current.type,
        question: '',
        ...(active.data.current.type === 'text' && { minLength: 0, maxLength: 100 }),
        ...(active.data.current.type === 'dropdown' && { options: ['Option 1'] }),
        ...(active.data.current.type === 'table' && { columns: [] }),
      };
      addField(newField);
      return;
    }

    // Handle field reordering
    if (active.id !== over?.id) {
      const oldIndex = formFields.findIndex((f) => f.id === active.id);
      const newIndex = formFields.findIndex((f) => f.id === over?.id);
      moveFields(arrayMove(formFields, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div ref={setNodeRef} className="canvas">
        <SortableContext items={formFields} strategy={verticalListSortingStrategy}>
            {formFields.map((field) => (
                <Field key={field.id} field={field} isBuilder={true} />
            ))}
        </SortableContext>

        {formFields.length === 0 && (
          <div className="empty-state">
            Drag form elements here to start building
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default Canvas;