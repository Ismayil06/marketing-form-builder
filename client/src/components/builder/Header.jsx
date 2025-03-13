import React from 'react';
import { useMode } from '../../context/ModeContext';

const Header = () => {
  const { isPreviewMode, toggleMode } = useMode();

  return (
    <header className="header">
      <button onClick={toggleMode} className="mode-toggle">
        {isPreviewMode ? 'Edit Form' : 'Preview Form'}
      </button>
    </header>
  );
};

export default Header;