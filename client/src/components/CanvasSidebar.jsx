import React from "react";
import useCanvas from "./hooks/useCanvas";
import FormElementsSidebar from "./FormElementsSidebar";
import PropertiesFormSidebar from "./PropertiesFormSidebar";
import "./CanvasSidebar.css";
function CanvasSidebar() {
  const { selectedElement } = useCanvas();
  return (
    <aside className="canvas-sidebar">
      {!selectedElement && <FormElementsSidebar />}
      {selectedElement && <PropertiesFormSidebar />}
    </aside>
  );
}

export default CanvasSidebar;