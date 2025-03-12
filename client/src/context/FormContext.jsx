import React, { createContext, useContext, useReducer } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

export const FormContext = createContext();

const formReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FIELD':
      return {
        ...state,
        formFields: [...state.formFields, action.payload],
      };

    case 'UPDATE_FIELD':
      return {
        ...state,
        formFields: state.formFields.map(field =>
          field.id === action.payload.id
            ? { ...field, ...action.payload.updates }
            : field
        ),
      };

    case 'REMOVE_FIELD':
      return {
        ...state,
        formFields: state.formFields.filter(field => field.id !== action.payload),
      };

    case 'MOVE_FIELD':
      return {
        ...state,
        formFields: arrayMove(
          state.formFields,
          action.payload.oldIndex,
          action.payload.newIndex
        ),
      };

    case 'SET_SELECTED_FIELD':
      return {
        ...state,
        selectedField: action.payload,
      };

    case 'UPDATE_CONDITIONS':
      return {
        ...state,
        formFields: state.formFields.map(field =>
          field.id === action.payload.fieldId
            ? {
                ...field,
                conditions: {
                  ...field.conditions,
                  [action.payload.questionId]: action.payload.condition,
                },
              }
            : field
        ),
      };

    default:
      return state;
  }
};

export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, {
    formFields: [],
    selectedField: null,
  });

  const addField = (field) => {
    dispatch({
      type: 'ADD_FIELD',
      payload: {
        ...field,
        id: `field-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    });
  };

  const updateField = (fieldId, updates) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: { id: fieldId, updates },
    });
  };

  const removeField = (fieldId) => {
    dispatch({ type: 'REMOVE_FIELD', payload: fieldId });
  };

  const moveField = (oldIndex, newIndex) => {
    dispatch({
      type: 'MOVE_FIELD',
      payload: { oldIndex, newIndex },
    });
  };

  const setSelectedField = (fieldId) => {
    dispatch({ type: 'SET_SELECTED_FIELD', payload: fieldId });
  };

  const updateConditions = (fieldId, questionId, condition) => {
    dispatch({
      type: 'UPDATE_CONDITIONS',
      payload: { fieldId, questionId, condition },
    });
  };

  return (
    <FormContext.Provider
      value={{
        ...state,
        addField,
        updateField,
        removeField,
        moveField,
        setSelectedField,
        updateConditions,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};