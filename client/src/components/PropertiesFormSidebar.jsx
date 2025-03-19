import React from "react";
import useDesigner from "./hooks/useDesigner";
import { FormElements } from "./FormElements";
import "./PropertiesFormSidebar.css";
export function PropertiesFormSidebar() {
  const { selectedElement, setSelectedElement } = useDesigner();
  if (!selectedElement) return null;

  const PropertiesForm = FormElements[selectedElement.type].propertiesComponent;

  return (
    <div className="properties-sidebar">
      <div className="properties-header">
        <p className="properties-title">Element properties</p>
        <button 
          className="close-button"
          onClick={() => setSelectedElement(null)}
        >
          X
        </button>
      </div>
      <div className="separator" />
      <PropertiesForm elementInstance={selectedElement} />
    </div>
  );
}

export default PropertiesFormSidebar;