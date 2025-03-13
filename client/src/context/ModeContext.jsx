import React, { createContext, useContext, useState } from 'react';

export const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const toggleMode = () => {
    setIsPreviewMode(prev => !prev);
  };

  return (
    <ModeContext.Provider value={{ isPreviewMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};