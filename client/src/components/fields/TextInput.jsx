import React, { useState, useEffect } from 'react';
import './TextInput.css';

const TextInput = ({
  question,
  value = '',
  onChange,
  readOnly,
  minLength,
  maxLength,
  required
}) => {
  const [error, setError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const validate = (val) => {
    if (required && !val.trim()) {
      return 'This field is required';
    }
    if (minLength && val.length < minLength) {
      return `Minimum ${minLength} characters required`;
    }
    if (maxLength && val.length > maxLength) {
      return `Maximum ${maxLength} characters allowed`;
    }
    return '';
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (!readOnly) {
      onChange(newValue);
      setError(validate(newValue));
    }
  };

  const handleBlur = () => {
    if (!readOnly) {
      setIsTouched(true);
    }
  };

  useEffect(() => {
    if (isTouched) {
      setError(validate(value));
    }
  }, [value, isTouched]);

  return (
    <div className={`text-input ${readOnly ? 'builder-mode' : ''}`}>
      <div className="question-header">
        <label className="question-label">
          {question}
          {required && <span className="required-star"> *</span>}
        </label>
        {readOnly && (
          <div className="validation-hint">
            {minLength > 0 && `Min ${minLength}${maxLength ? `, ` : ''}`}
            {maxLength > 0 && `Max ${maxLength}`}
            {(minLength || maxLength) && ' characters'}
          </div>
        )}
      </div>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly={readOnly}
        placeholder={readOnly ? 'Preview input' : 'Type your answer here...'}
        className={error ? 'error' : ''}
        maxLength={maxLength}
      />

      {!readOnly && error && (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
};

export default TextInput;