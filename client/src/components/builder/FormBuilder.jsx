import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

const FormBuilder = () => {
    const [formElements, setFormElements] = useState([
        { id: 'element-1', type: 'text', label: 'Text Input' },
        { id: 'element-2', type: 'select', label: 'Dropdown' },
        { id: 'element-3', type: 'checkbox', label: 'Checkbox' },
        { 
            id: 'element-4', 
            type: 'table', 
            label: 'Table',
            columns: ['Column 1', 'Column 2', 'Column 3'],
            rows: 3
        }
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setFormElements((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const renderFormElement = (element) => {
        // ... your existing renderFormElement code ...
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="form-builder">
                <SortableContext
                    items={formElements.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="form-elements-container">
                        {formElements.map((element) => (
                            <SortableItem key={element.id} id={element.id}>
                                {renderFormElement(element)}
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </div>
        </DndContext>
    );
};

export default FormBuilder;
