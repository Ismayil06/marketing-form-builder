import React from 'react';
import { FormProvider } from './context/FormContext';
import { ModeProvider } from './context/ModeContext';
import { DragHandler } from './components/builder/DragHandler';
import Toolbox from './components/builder/Toolbox';
import Canvas from './components/builder/Canvas';
import './App.css';
import Header from './components/builder/Header';
const App = () => {
  return (
    <FormProvider>
      <ModeProvider>
        <Header/>
        <DragHandler>
          <div className="app-container">
            <Toolbox />
            <Canvas />
          </div>
        </DragHandler>
      </ModeProvider>
      
    </FormProvider>
  );
};

export default App;