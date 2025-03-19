import React, { useContext } from 'react';
import { DragOverlayWrapper } from './components/DragOverlayWrapper';

import './App.css';
import { useState } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import Designer from './components/Designer';
import DesignerContextProvider from './components/context/DesignerContext';
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
      <DesignerContextProvider>
        <PreviewDialogBtn></PreviewDialogBtn>
        <Designer/>
      <DragOverlayWrapper/>
      </DesignerContextProvider>
      
    </DndContext>
    
  );
};

export default App;