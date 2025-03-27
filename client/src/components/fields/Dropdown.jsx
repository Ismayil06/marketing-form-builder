import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import useCanvas from "../hooks/useCanvas";
import "./Dropdown.css";

// filepath: /Users/ismayil/Desktop/VS Code/marketing-form-builder/client/src/components/fields/Dropdown.jsx



const extraAttributes = {
  label: "Dropdown",
  helperText: "Helper text",
  required: false,
  // Comma separated options string (will be split into an array)
  options: "Option 1,Option 2,Option 3",
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  options: z.string(),
});

export const DropdownFormElement = {
  type: "Dropdown",
  construct: (id) => ({
    id,
    type: "Dropdown",
    extraAttributes,
  }),
  canvasBtnElement: {
    icon: null,
    label: "Dropdown",
  },
  canvasComponent: CanvasComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    if (formElement.extraAttributes.required) {
      return currentValue !== "";
    }
    return true;
  },
};

function CanvasComponent({ elementInstance }) {
  const element = elementInstance;
  const { label, required, helperText, options } = element.extraAttributes;
  const optionList = options.split(",").map(opt => opt.trim());
  
  return (
    <div className="canvas-component">
      <label>
        {label}
        {required && "*"}
      </label>
      <select disabled>
        {optionList.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
      {helperText && <p className="helper-text">{helperText}</p>}
    </div>
  );
}

function FormComponent({ elementInstance, submitValue, isInvalid, defaultValue }) {
  const element = elementInstance;
  const { label, required, helperText, options } = element.extraAttributes;
  const optionList = options.split(",").map(opt => opt.trim());
  
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(false);
  
  useEffect(() => {
    setError(!!isInvalid);
  }, [isInvalid]);
  
  return (
    <div className="form-component">
      <label className={error ? "error-label" : ""}>
        {label}
        {required && "*"}
      </label>
      <select
        className={error ? "error-select" : ""}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return;
          const valid = DropdownFormElement.validate(element, e.target.value);
          setError(!valid);
          if (valid) submitValue(element.id, e.target.value);
        }}
      >
        <option value="">Select an option</option>
        {optionList.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
      {helperText && <p className={error ? "error-helper" : "helper-text"}>{helperText}</p>}
    </div>
  );
}

function PropertiesComponent({ elementInstance }) {
  const element = elementInstance;
  const { label, helperText, options } = element.extraAttributes;
  const { updateElement } = useCanvas();
  const { register, handleSubmit, reset, getValues } = useForm({
    resolver: zodResolver(propertiesSchema),
    defaultValues: { ...element.extraAttributes, options },
  });

  // Initialize localOptions state from the options string
  const initialOptions = options.split(",").map(opt => opt.trim());
  const [localOptions, setLocalOptions] = useState(initialOptions);

  useEffect(() => {
    reset({ ...element.extraAttributes, options });
    setLocalOptions(initialOptions);
  }, [element, reset, options]);

  const applyChanges = (data) => {
    // Merge localOptions into the options string field
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...data,
        options: localOptions.join(","),
      },
    });
  };

  const addOption = () => {
    setLocalOptions([...localOptions, "New Option"]);
  };

  const removeOption = (index) => {
    if (localOptions.length === 1) return;
    setLocalOptions(localOptions.filter((_, idx) => idx !== index));
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

      <div className="options-list">
        {localOptions.map((option, index) => (
          <div key={index} className="option-item">
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...localOptions];
                newOptions[index] = e.target.value;
                setLocalOptions(newOptions);
              }}
              placeholder={`Option ${index + 1}`}
              onBlur={handleSubmit(applyChanges)}
            />
            <button
              type="button"
              className="remove-option"
              onClick={() => removeOption(index)}
              disabled={localOptions.length === 1}
            >
              &times;
            </button>
          </div>
        ))}
        <button type="button" onClick={addOption}>
          Add Option
        </button>
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
          onChange={(e) =>
            handleSubmit(applyChanges)({
              ...getValues(),
              required: e.target.checked,
            })
          }
        />
      </div>
      <input type="submit" value="Submit" />
    </form>
  );
}