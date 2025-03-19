import React from "react";
import SidebarBtnElement from "./SidebarBtnElement";
import { FormElements } from "./FormElements";
import "./FormElementsSidebar.css"
function FormElementsSidebar() {
  return (
    <div className="elements-sidebar">
      <p className="sidebar-description">Drag and drop elements</p>
      <div className="separator" />
      <div className="elements-grid">

        <p className="category-heading form-elements">Form elements</p>
        <SidebarBtnElement formElement={FormElements.TextField} />
        <SidebarBtnElement formElement={FormElements.Table} />
        <SidebarBtnElement formElement={FormElements.Dropdown} />
      </div>
    </div>
  );
}

export default FormElementsSidebar;