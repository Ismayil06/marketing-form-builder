import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import useCanvas from "../hooks/useCanvas";
import "./Table.css";

// filepath: /Users/ismayil/Desktop/VS Code/marketing-form-builder/client/src/components/fields/Table.jsx

const extraAttributes = {
  label: "Table",
  helperText: "Helper text",
  required: false,
  // Comma separated lists for columns and rows
  columns: "Column 1,Column 2,Column 3",
  rows: "Row 1,Row 2",
  // New attributes for cell type and dropdown options
  cellType: "text", // or "dropdown"
  cellOptions: "Option 1,Option 2", // Only used when cellType is "dropdown"
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  columns: z.string(),
  rows: z.string(),
  cellType: z.enum(["text", "dropdown"]),
  cellOptions: z.string().optional(),
});

export const TableFormElement = {
  type: "Table",
  construct: (id) => ({
    id,
    type: "Table",
    extraAttributes,
  }),
  canvasBtnElement: {
    icon: null,
    label: "Table",
  },
  canvasComponent: CanvasComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    // When required, validate that all table cells are filled
    if (formElement.extraAttributes.required) {
      for (let row in currentValue) {
        for (let col in currentValue[row]) {
          if (!currentValue[row][col]) return false;
        }
      }
    }
    return true;
  },
};

function CanvasComponent({ elementInstance }) {
  const { label, helperText, required, columns, rows, cellType, cellOptions } = elementInstance.extraAttributes;
  const cols = columns.split(",").map((col) => col.trim());
  const rowLabels = rows.split(",").map((row) => row.trim());
  // For dropdown cells, prepare options list
  const options = cellOptions ? cellOptions.split(",").map(opt => opt.trim()) : [];
  
  return (
    <div className="canvas-component">
      <label>
        {label} {required && "*"}
      </label>
      <table className="table-preview">
        <thead>
          <tr>
            <th></th>
            {cols.map((col, colIndex) => (
              <th key={colIndex}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((rowLabel, rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowLabel}</td>
              {cols.map((_, colIndex) => (
                <td key={colIndex}>
                  {cellType === "dropdown" ? (
                    <select disabled>
                      <option value="">Select an option</option>
                      {options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input type="text" placeholder="Answer" disabled />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {helperText && <p className="helper-text">{helperText}</p>}
    </div>
  );
}

function FormComponent({ elementInstance, submitValue, isInvalid, defaultValue }) {
  const { label, helperText, required, columns, rows, cellType, cellOptions } = elementInstance.extraAttributes;
  const cols = columns.split(",").map((col) => col.trim());
  const rowLabels = rows.split(",").map((row) => row.trim());
  const options = cellOptions ? cellOptions.split(",").map(opt => opt.trim()) : [];
  
  const initialTableValues = {};
  rowLabels.forEach((_, rowIdx) => {
    initialTableValues[rowIdx] = {};
    cols.forEach((_, colIdx) => {
      initialTableValues[rowIdx][colIdx] =
        (defaultValue && defaultValue[rowIdx] && defaultValue[rowIdx][colIdx]) || "";
    });
  });

  const [tableValues, setTableValues] = useState(initialTableValues);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(!!isInvalid);
  }, [isInvalid]);

  const handleChange = (rowIdx, colIdx, value) => {
    setTableValues((prev) => ({
      ...prev,
      [rowIdx]: {
        ...prev[rowIdx],
        [colIdx]: value,
      },
    }));
  };

  const handleBlur = () => {
    const valid = TableFormElement.validate(elementInstance, tableValues);
    setError(!valid);
    if (valid && submitValue) {
      submitValue(elementInstance.id, tableValues);
    }
  };

  return (
    <div className="form-component">
      <label className={error ? "error-label" : ""}>
        {label} {required && "*"}
      </label>
      <table className="table-form">
        <thead>
          <tr>
            <th></th>
            {cols.map((col, colIndex) => (
              <th key={colIndex}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((rowLabel, rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowLabel}</td>
              {cols.map((_, colIndex) => (
                <td key={colIndex}>
                  {cellType === "dropdown" ? (
                    <select
                      className={error ? "error-select" : ""}
                      value={tableValues[rowIndex][colIndex]}
                      onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                      onBlur={handleBlur}
                    >
                      <option value="">Select an option</option>
                      {options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className={error ? "error-input" : ""}
                      value={tableValues[rowIndex][colIndex]}
                      onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                      onBlur={handleBlur}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {helperText && <p className={error ? "error-helper" : "helper-text"}>{helperText}</p>}
    </div>
  );
}

function PropertiesComponent({ elementInstance }) {
  const { updateElement } = useCanvas();
  const { register, handleSubmit, reset, watch } = useForm({
    resolver: zodResolver(propertiesSchema),
    defaultValues: elementInstance.extraAttributes,
  });

  // Watch cellType to conditionally display cellOptions
  const cellTypeValue = watch("cellType");

  useEffect(() => {
    reset(elementInstance.extraAttributes);
  }, [elementInstance, reset]);

  const applyChanges = (data) => {
    updateElement(elementInstance.id, {
      ...elementInstance,
      extraAttributes: {
        ...data,
      },
    });
  };

  return (
    <form className="properties-form" onSubmit={handleSubmit(applyChanges)}>
      <div className="form-field">
        <label>Label: </label>
        <input type="text" {...register("label")} onKeyDown={(e) => e.key === "Enter" && e.target.blur()} />
      </div>
      <div className="form-field">
        <label>Columns (comma separated): </label>
        <input type="text" {...register("columns")} onKeyDown={(e) => e.key === "Enter" && e.target.blur()} />
      </div>
      <div className="form-field">
        <label>Rows (comma separated): </label>
        <input type="text" {...register("rows")} onKeyDown={(e) => e.key === "Enter" && e.target.blur()} />
      </div>
      <div className="form-field">
        <label>Helper Text: </label>
        <input type="text" {...register("helperText")} onKeyDown={(e) => e.key === "Enter" && e.target.blur()} />
      </div>
      <div className="form-field">
        <label>Cell Type: </label>
        <select {...register("cellType")}>
          <option value="text">Text</option>
          <option value="dropdown">Dropdown</option>
        </select>
      </div>
      {cellTypeValue === "dropdown" && (
        <div className="form-field">
          <label>Dropdown Options (comma separated): </label>
          <input type="text" {...register("cellOptions")} onKeyDown={(e) => e.key === "Enter" && e.target.blur()} />
        </div>
      )}
      <div className="switch-field">
        <label>Required Field:</label>
        <input
          type="checkbox"
          {...register("required")}
          onChange={(e) =>
            handleSubmit(applyChanges)({
              ...elementInstance.extraAttributes,
              required: e.target.checked,
            })
          }
        />
      </div>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default TableFormElement;