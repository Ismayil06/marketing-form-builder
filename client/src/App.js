import React, { useContext } from 'react';
import { DragOverlayWrapper } from './components/DragOverlayWrapper';

import './App.css';
import { useState } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import Canvas from './components/Canvas';
import CanvasContextProvider from './components/context/CanvasContext';
import PreviewDialogBtn from './components/PreviewDialogBtn';
const App = () => {

  const [isReady, setIsReady] = useState(false);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // 10px
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);


  return (
    <DndContext sensors={sensors}>
      <CanvasContextProvider>
        <PreviewDialogBtn></PreviewDialogBtn>
        <Canvas/>
      <DragOverlayWrapper/>
      </CanvasContextProvider>
      
    </DndContext>
    
  );
};

export default App;