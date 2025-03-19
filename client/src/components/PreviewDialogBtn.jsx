import React, { useState } from "react";
import useDesigner from "./hooks/useDesigner";
import { FormElements } from "./FormElements";
import "./PreviewDialogBtn.css"
function PreviewDialogBtn() {
  const { elements } = useDesigner();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <button 
        className="preview-dialog-trigger"
        onClick={() => setIsPreviewOpen(true)}
      >

        Preview
      </button>

      {isPreviewOpen && (
        <div className="preview-dialog">
          <div className="preview-dialog-content">
            <div className="preview-header">
              <p className="preview-title">Form preview</p>
              <p className="preview-subtitle">This is how your form will look like to your users.</p>
              <button 
                className="close-button"
                onClick={() => setIsPreviewOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="preview-content">
              <div className="form-preview-container">
                {elements.map((element) => {
                  const FormComponent = FormElements[element.type].formComponent;
                  return <FormComponent key={element.id} elementInstance={element} />;
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PreviewDialogBtn;