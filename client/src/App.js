import React from 'react';
import { FormProvider } from './context/FormContext';
import { DragHandler } from './components/builder/DragHandler';
import Toolbox from './components/builder/Toolbox';
import Canvas from './components/builder/Canvas';
import './App.css';

const App = () => {
  return (
    <FormProvider>
      <DragHandler>
        <div className="app-container">
          <Toolbox />
          <Canvas />
        </div>
      </DragHandler>
    </FormProvider>
  );
};

export default App;