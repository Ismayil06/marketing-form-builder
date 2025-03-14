import React, { useContext, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormContext } from '../../context/FormContext';
import TextInput from '../fields/TextInput';
import Dropdown from '../fields/Dropdown';
import TableEditor from '../fields/TableEditor';
import FieldSettings from './FieldSettings';
import './field.css';

const Field = ({ field, isBuilder = true }) => {
  const { updateField } = useContext(FormContext);
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id, disabled: !isBuilder });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSettingsChange = (newSettings) => {
    updateField(field.id, newSettings);
    setShowSettings(false);
  };

  const renderField = () => {
    const commonProps = {
      ...field,
      readOnly: isBuilder,
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
    >
      {isBuilder && (
        <div className="field-header">
          <button 
            className="drag-handle"
            {...attributes}
            {...listeners}
          >
            ⠿
          </button>
          <span className="field-type">{field.type}</span>
          <button
            className="settings-button"
            onClick={() => setShowSettings(true)}
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