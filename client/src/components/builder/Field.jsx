import React, { useState, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFormContext } from '../../context/FormContext';
import TextInput from '../fields/TextInput';
import Dropdown from '../fields/Dropdown';
import TableEditor from '../fields/TableEditor';
import FieldSettings from './FieldSettings';
import './field.css';

const Field = ({ field, isBuilder = true }) => {
  const { updateField } = useFormContext();
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id, disabled: !isBuilder });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  const handleSettingsChange = (newSettings) => {
    updateField(field.id, newSettings);
    setShowSettings(false);
  };

  const renderField = () => {
    const commonProps = {
      ...field,
      readOnly: !isBuilder,
      onChange: (value) => isBuilder ? null : updateField(field.id, { answer: value })
    };

    switch (field.type) {
      case 'text':
        return <TextInput {...commonProps} />;
      case 'dropdown':
        return <Dropdown {...commonProps} />;
      case 'table':
        return <TableEditor {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`field-container ${isBuilder ? 'builder-mode' : 'preview-mode'}`}
      {...attributes}
      {...listeners}
    >
      {isBuilder && (
        <div className="field-header">
          <button 
            className="drag-handle"
            {...listeners}
            aria-label="Drag handle"
          >
            ⠿
          </button>
          <span className="field-type">{field.type}</span>
          <button
            className="settings-button"
            onClick={() => setShowSettings(true)}
            aria-label="Field settings"
          >
            ⚙️
          </button>
        </div>
      )}

      <div className="field-content">
        {renderField()}
      </div>

      {showSettings && isBuilder && (
        <FieldSettings
          field={field}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsChange}
        />
      )}
    </div>
  );
};

export default Field;