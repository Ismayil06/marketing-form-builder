"use client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useCanvas from "../hooks/useCanvas";
import { z } from "zod";
import "./TextInput.css";
const extraAttributes = {
  label: "Text field",
  helperText: "Helper text",
  required: false,
  placeHolder: "Value here...",
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
});

export const TextFieldFormElement = {
  type: "TextField",
  construct: (id) => ({
    id,
    type: "TextField",
    extraAttributes,
  }),
  canvasBtnElement: {
    icon: null,
    label: "Text Field",
  },
  canvasComponent: CanvasComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const element = formElement;
    if (element.extraAttributes.required) {
      return currentValue.length > 0;
    }
    return true;
  },
};

function CanvasComponent({ elementInstance }) {
  const element = elementInstance;
  const { label, required, placeHolder, helperText } = element.extraAttributes;
  return (
    <div className="canvas-component">
      <label>
        {label}
        {required && "*"}
      </label> 
      <input type="text" readOnly disabled placeholder={placeHolder} />
      {helperText && <p className="helper-text">{helperText}</p>}
    </div>
  );
}

function FormComponent({ elementInstance, submitValue, isInvalid, defaultValue }) {
  const element = elementInstance;
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(false);
  const { label, required, placeHolder, helperText } = element.extraAttributes;

  useEffect(() => {
    setError(!!isInvalid);
  }, [isInvalid]);

  return (
    <div className="form-component">
      <label className={error ? "error-label" : ""}>
        {label}
        {required && "*"}
      </label>
      <input
        type="text"
        className={error ? "error-input" : ""}
        placeholder={placeHolder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return;
          const valid = TextFieldFormElement.validate(element, e.target.value);
          setError(!valid);
          if (valid) submitValue(element.id, e.target.value);
        }}
      />
      {helperText && <p className={error ? "error-helper" : "helper-text"}>{helperText}</p>}
    </div>
  );
}

function PropertiesComponent({ elementInstance }) {
  const element = elementInstance;
  const { updateElement } = useCanvas();
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(propertiesSchema),
    defaultValues: element.extraAttributes,
  });

  useEffect(() => {
    reset(element.extraAttributes);
  }, [element, reset]);

  const applyChanges = (data) => {
    updateElement(element.id, {
      ...element,
      extraAttributes: data,
    });
  };

  return (
    <form className="properties-form" onSubmit={handleSubmit(applyChanges)}>
      <div className="form-field">
        <label>Label: </label>
        <input
          type="text"
          {...register("label")}
          onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
        />

      </div>

      <div className="form-field">
        <label>Placeholder: </label>
        <input
          type="text"
          {...register("placeHolder")}
          onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
        />
      </div>

      <div className="form-field">
        <label>Helper Text: </label>
        <input
          type="text"
          {...register("helperText")}
          onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
        />
      </div>

      <div className="switch-field">
        <label>
          Required Field: 
        </label>
        <input
          type="checkbox"
          {...register("required")}
          onChange={(e) => handleSubmit(applyChanges)({ ...element.extraAttributes, required: e.target.checked })}
        />
      </div>
      <input type="submit" value="Submit"/>
    </form>
  );
}