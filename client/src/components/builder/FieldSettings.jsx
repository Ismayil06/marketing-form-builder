import React, { useState, useEffect } from 'react';
import './FieldSettings.css';

const FieldSettings = ({ field, onClose, onSave }) => {
  const [settings, setSettings] = useState({ ...field });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setSettings({ ...field });
    setErrors({});
  }, [field]);

  const validate = () => {
    const newErrors = {};
    
    if (!settings.question.trim()) {
      newErrors.question = 'Question is required';
    }

    if (settings.type === 'text') {
      if (settings.minLength > settings.maxLength) {
        newErrors.length = 'Min length cannot exceed max length';
      }
    }

    if (settings.type === 'dropdown' && settings.options.length === 0) {
      newErrors.options = 'At least one option is required';
    }

    if (settings.type === 'table' && settings.columns.length === 0) {
      newErrors.columns = 'At least one column is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(settings);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...settings.options];
    newOptions[index] = value;
    setSettings({ ...settings, options: newOptions });
  };

  const addOption = () => {
    setSettings({
      ...settings,
      options: [...settings.options, `Option ${settings.options.length + 1}`]
    });
  };

  const removeOption = (index) => {
    const newOptions = settings.options.filter((_, i) => i !== index);
    setSettings({ ...settings, options: newOptions });
  };

  const handleColumnChange = (index, key, value) => {
    const newColumns = [...settings.columns];
    newColumns[index] = { ...newColumns[index], [key]: value };
    setSettings({ ...settings, columns: newColumns });
  };

  const addColumn = () => {
    setSettings({
      ...settings,
      columns: [
        ...settings.columns,
        { name: `Column ${settings.columns.length + 1}`, type: 'text', options: [] }
      ]
    });
  };

  const removeColumn = (index) => {
    const newColumns = settings.columns.filter((_, i) => i !== index);
    setSettings({ ...settings, columns: newColumns });
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="modal-header">
          <h3>{field.type.charAt(0).toUpperCase() + field.type.slice(1)} Field Settings</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label>
              Question *
              <input
                type="text"
                value={settings.question}
                onChange={(e) => setSettings({ ...settings, question: e.target.value })}
                className={errors.question ? 'error' : ''}
              />
            </label>
            {errors.question && <span className="error-message">{errors.question}</span>}
          </div>

          {settings.type === 'text' && (
            <div className="form-group">
              <div className="validation-row">
                <label>
                  Min Length
                  <input
                    type="number"
                    min="0"
                    value={settings.minLength || 0}
                    onChange={(e) => setSettings({ ...settings, minLength: parseInt(e.target.value) || 0 })}
                  />
                </label>
                <label>
                  Max Length
                  <input
                    type="number"
                    min="1"
                    value={settings.maxLength || 100}
                    onChange={(e) => setSettings({ ...settings, maxLength: parseInt(e.target.value) || 100 })}
                  />
                </label>
              </div>
              {errors.length && <span className="error-message">{errors.length}</span>}
            </div>
          )}

          {settings.type === 'dropdown' && (
            <div className="form-group">
              <label>Options *</label>
              <div className="options-list">
                {settings.options.map((option, index) => (
                  <div key={index} className="option-item">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeOption(index)}
                      disabled={settings.options.length === 1}
                    >
                      &minus;
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="add-button" onClick={addOption}>
                Add Option
              </button>
              {errors.options && <span className="error-message">{errors.options}</span>}
            </div>
          )}

          {settings.type === 'table' && (
            <div className="form-group">
              <label>Columns *</label>
              <div className="columns-list">
                {settings.columns.map((column, index) => (
                  <div key={index} className="column-item">
                    <input
                      type="text"
                      placeholder="Column name"
                      value={column.name}
                      onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                    />
                    <select
                      value={column.type}
                      onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
                    >
                      <option value="text">Text</option>
                      <option value="dropdown">Dropdown</option>
                    </select>

                    {column.type === 'dropdown' && (
                      <div className="column-options">
                        {column.options.map((option, optIndex) => (
                          <div key={optIndex} className="option-input">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...column.options];
                                newOptions[optIndex] = e.target.value;
                                handleColumnChange(index, 'options', newOptions);
                              }}
                            />
                            <button
                              type="button"
                              className="remove-button"
                              onClick={() => {
                                const newOptions = column.options.filter((_, i) => i !== optIndex);
                                handleColumnChange(index, 'options', newOptions);
                              }}
                            >
                              &minus;
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="add-button"
                          onClick={() => {
                            const newOptions = [...column.options, `Option ${column.options.length + 1}`];
                            handleColumnChange(index, 'options', newOptions);
                          }}
                        >
                          Add Option
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeColumn(index)}
                      disabled={settings.columns.length === 1}
                    >
                      &minus;
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="add-button" onClick={addColumn}>
                Add Column
              </button>
              {errors.columns && <span className="error-message">{errors.columns}</span>}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldSettings;