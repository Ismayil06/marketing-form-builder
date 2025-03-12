import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import './Toolbox.css';

const formElements = [
  { type: 'text', label: 'Text Input', icon: 'T' },
  { type: 'dropdown', label: 'Dropdown', icon: '▼' },
  { type: 'table', label: 'Table', icon: '◫' },
  { type: 'file', label: 'File Upload', icon: '📁' }, // Bonus
];

export const ToolboxItem = ({ element }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
    id: `toolbox-${element.type}`,
    data: { type: element.type }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="toolbox-item"
      {...attributes}
      {...listeners}
    >
      <span className="item-icon">{element.icon}</span>
      <span className="item-label">{element.label}</span>
    </div>
  );
};

const Toolbox = () => {
  return (
    <div className="toolbox-container">
      <h3 className="toolbox-title">Form Elements</h3>
      <div className="toolbox-items">
        {formElements.map((element) => (
          <ToolboxItem key={element.type} element={element} />
        ))}
      </div>
    </div>
  );
};

export default Toolbox;