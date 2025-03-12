import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import './TableEditor.css';

const TableEditor = ({
  columns = [],
  data = [],
  onChange,
  readOnly,
  question,
  required
}) => {
  const [localData, setLocalData] = useState(data);
  const [errors, setErrors] = useState({});

  // Handle builder mode column configuration
  const handleColumnChange = (index, key, value) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [key]: value };
    onChange({ columns: newColumns });
  };

  // Handle preview mode data input
  const handleDataChange = (rowIndex, columnIndex, value) => {
    const newData = [...localData];
    if (!newData[rowIndex]) newData[rowIndex] = {};
    newData[rowIndex][columnIndex] = value;
    setLocalData(newData);
    onChange({ data: newData });
    validateCell(rowIndex, columnIndex, value);
  };

  const addRow = () => {
    const newData = [...localData, {}];
    setLocalData(newData);
    onChange({ data: newData });
  };

  const validateCell = (rowIndex, columnIndex, value) => {
    const column = columns[columnIndex];
    const newErrors = { ...errors };
    
    if (column?.required && !value?.trim()) {
      newErrors[`${rowIndex}-${columnIndex}`] = 'This field is required';
    } else if (column?.type === 'text' && column?.minLength && value?.length < column.minLength) {
      newErrors[`${rowIndex}-${columnIndex}`] = `Minimum ${column.minLength} characters`;
    } else {
      delete newErrors[`${rowIndex}-${columnIndex}`];
    }

    setErrors(newErrors);
  };

  // Builder mode UI
  if (readOnly) {
    return (
      <div className="table-builder">
        <div className="builder-header">
          <h4 className="table-question">{question}</h4>
          <button 
            type="button" 
            className="add-column-button"
            onClick={() => onChange({ columns: [...columns, { name: '', type: 'text' }] })}
          >
            + Add Column
          </button>
        </div>

        <div className="columns-config">
          {columns.map((column, index) => (
            <div key={index} className="column-config">
              <input
                type="text"
                placeholder="Column name"
                value={column.name}
                onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                className="column-name-input"
              />
              <select
                value={column.type}
                onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
                className="column-type-select"
              >
                <option value="text">Text</option>
                <option value="dropdown">Dropdown</option>
              </select>

              {column.type === 'dropdown' && (
                <div className="dropdown-options">
                  {column.options?.map((option, optIndex) => (
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
                        className="remove-option"
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
                    className="add-option"
                    onClick={() => {
                      const newOptions = [...(column.options || []), `Option ${(column.options?.length || 0) + 1}`];
                      handleColumnChange(index, 'options', newOptions);
                    }}
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Preview mode UI
  return (
    <div className="table-preview">
      <div className="table-header">
        <h4 className="table-question">{question}{required && <span className="required-star"> *</span>}</h4>
      </div>

      <div className="table-container">
        <div className="table-row header">
          {columns.map((col, index) => (
            <div key={index} className="table-cell">
              {col.name}
              {col.required && <span className="required-star"> *</span>}
            </div>
          ))}
        </div>

        {localData.map((row, rowIndex) => (
          <div key={rowIndex} className="table-row">
            {columns.map((col, colIndex) => (
              <div key={colIndex} className="table-cell">
                {col.type === 'dropdown' ? (
                  <Dropdown
                    options={col.options || []}
                    value={row[colIndex] || ''}
                    onChange={(value) => handleDataChange(rowIndex, colIndex, value)}
                  />
                ) : (
                  <input
                    type="text"
                    value={row[colIndex] || ''}
                    onChange={(e) => handleDataChange(rowIndex, colIndex, e.target.value)}
                    placeholder={`Enter ${col.name}`}
                    maxLength={col.maxLength}
                  />
                )}
                {errors[`${rowIndex}-${colIndex}`] && (
                  <div className="cell-error">{errors[`${rowIndex}-${colIndex}`]}</div>
                )}
              </div>
            ))}
          </div>
        ))}

        <button type="button" className="add-row-button" onClick={addRow}>
          + Add Row
        </button>
      </div>
    </div>
  );
};

export default TableEditor;