import React, { useState, useEffect } from 'react';
import './Dropdown.css';

const Dropdown = ({
  options = [],
  value = '',
  onChange,
  readOnly,
  question,
  required
}) => {
  const [localOptions, setLocalOptions] = useState(options);
  const [error, setError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  // Handle builder mode option updates
  const handleOptionChange = (index, newValue) => {
    const updatedOptions = [...localOptions];
    updatedOptions[index] = newValue;
    setLocalOptions(updatedOptions);
    onChange(updatedOptions);
  };

  // Handle preview mode selection
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    onChange(selectedValue);
    if (required) validate(selectedValue);
  };

  const addOption = () => {
    const newOptions = [...localOptions, `Option ${localOptions.length + 1}`];
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  const validate = (val) => {
    if (required && !val) {
      setError('This field is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleBlur = () => {
    if (!readOnly) {
      setIsTouched(true);
      validate(value);
    }
  };

  useEffect(() => {
    if (isTouched) validate(value);
  }, [value, isTouched]);

  // Builder Mode
  if (readOnly) {
    return (
      <div className="dropdown-builder">
        <div className="builder-header">
          <h4 className="dropdown-question">{question}</h4>
          <span className="required-hint">{required && '*'}</span>
        </div>
        
        <div className="options-list">
          {localOptions.map((option, index) => (
            <div key={index} className="option-item">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <button
                type="button"
                className="remove-option"
                onClick={() => removeOption(index)}
                disabled={localOptions.length === 1}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        
        <button type="button" className="add-option" onClick={addOption}>
          + Add Option
        </button>
      </div>
    );
  }

  // Preview Mode
  return (
    <div className="dropdown-preview">
      <label className="dropdown-label">
        {question}
        {required && <span className="required-star"> *</span>}
      </label>
      
      <select
        value={value}
        onChange={handleSelectChange}
        onBlur={handleBlur}
        className={`dropdown-select ${error ? 'error' : ''}`}
      >
        <option value="">Select an option</option>
        {localOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Dropdown;