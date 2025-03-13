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
import { ModeContext } from '../../context/ModeContext.jsx';


const Canvas = () => {
  const { formFields, addField, moveFields } = useContext(FormContext);
  const { isPreviewMode } = useContext(ModeContext);
  const { setNodeRef } = useDroppable({ id: 'canvas' });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  return (
      <div ref={setNodeRef} className="canvas">
        <SortableContext items={formFields} strategy={verticalListSortingStrategy}>
            {formFields.map((field) => {if (formFields.length > 0) {
                return (
                    <Field key={field.id} field={field} isBuilder={!isPreviewMode} />
                );
              
            }})}
        </SortableContext>

        {formFields.length === 0 && (
          <div className="empty-state">
            Drag form elements here to start building
          </div>
        )}
      </div>
  );
};

export default Canvas;