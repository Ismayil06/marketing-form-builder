import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import { z } from "zod";
import "./TableEditor.css";




const extraAttributes = {
  label: "Table Field",
  helperText: "Helper text",
  required: false,
  rows: 3,
  columns: 3,
  cellType: "text", // new: "text" or "dropdown"
  choices: "", // comma separated options when cellType is dropdown
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  rows: z.number().min(1).max(10),
  columns: z.number().min(1).max(10),
  cellType: z.enum(["text", "dropdown"]).default("text"),
  choices: z.string().optional(),
});

export const TableFormElement = {
  type: "Table",
  construct: (id) => ({
    id,
    type: "Table",
    extraAttributes,
  }),
  designerBtnElement: {
    icon: null,
    label: "Table",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const { required } = formElement.extraAttributes;
    if (!required) return true;
    if (!Array.isArray(currentValue)) return false;
    for (const row of currentValue) {
      for (const cell of row) {
        if (cell.trim() === "") {
          return false;
        }
      }
    }
    return true;
  },
};

function DesignerComponent({ elementInstance }) {
  const { label, helperText, required, rows, columns } = elementInstance.extraAttributes;
  // A simple preview table with static cell content
  const tablePreview = Array.from({ length: rows }).map((_, rowIndex) => (
    <tr key={rowIndex}>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <td key={colIndex}>Cell</td>
      ))}
    </tr>
  ));

  return (
    <div className="designer-component">
      <label>
        {label}
        {required && "*"}
      </label>
      <table className="designer-table">
        <tbody>{tablePreview}</tbody>
      </table>
      {helperText && <p className="helper-text">{helperText}</p>}
    </div>
  );
}

function FormComponent({ elementInstance, submitValue, isInvalid, defaultValue }) {
  const { label, helperText, required, rows, columns, cellType, choices } = elementInstance.extraAttributes;
  const [tableData, setTableData] = useState(
    defaultValue ||
      Array.from({ length: rows }, () => Array.from({ length: columns }, () => ""))
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(!!isInvalid);
  }, [isInvalid]);

  const handleCellChange = (rowIndex, colIndex, value) => {
    setTableData((prev) => {
      const newData = prev.map((row) => [...row]);
      newData[rowIndex][colIndex] = value;
      return newData;
    });
  };

  const validateTable = (data) => {
    if (!required) return true;
    for (const row of data) {
      for (const cell of row) {
        if (cell.trim() === "") return false;
      }
    }
    return true;
  };

  const handleBlur = () => {
    if (!submitValue) return;
    const valid = validateTable(tableData);
    setError(!valid);
    if (valid) {
      submitValue(elementInstance.id, tableData);
    }
  };

  // For dropdown cells, derive options from the choices string
  const dropdownOptions = cellType === "dropdown" && choices
    ? choices.split(",").map(opt => opt.trim()).filter(opt => opt !== "")
    : [];

  return (
    <div className="form-component">
      <label className={error ? "error-label" : ""}>
        {label}
        {required && "*"}
      </label>
      <table className="form-table">
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  {cellType === "dropdown" ? (
                    <select
                      className={error ? "error-input" : ""}
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      onBlur={handleBlur}
                    >
                      <option value="">Select...</option>
                      {dropdownOptions.map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className={error ? "error-input" : ""}
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
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
  const { updateElement } = useDesigner();
  const { register, handleSubmit, reset, watch, getValues } = useForm({
    resolver: zodResolver(propertiesSchema),
    defaultValues: elementInstance.extraAttributes,
  });

  // Initialize localChoices state from the choices string (for dropdown cellType)
  const initialChoices = (elementInstance.extraAttributes.choices || "")
    .split(",")
    .map((opt) => opt.trim())
    .filter((opt) => opt !== "");
  const [localChoices, setLocalChoices] = useState(
    initialChoices.length ? initialChoices : ["New Option"]
  );

  // Initialize cellTypeMatrix: If elementInstance.extraAttributes.cellTypes exists, use it.
  // Otherwise, fill with the global "cellType" value.
  const { rows, columns, cellType } = elementInstance.extraAttributes;
  const [cellTypeMatrix, setCellTypeMatrix] = useState(() => {
    if (elementInstance.extraAttributes.cellTypes) {
      return elementInstance.extraAttributes.cellTypes;
    }
    return Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => cellType)
    );
  });

  useEffect(() => {
    reset(elementInstance.extraAttributes);
    const updatedChoices = (elementInstance.extraAttributes.choices || "")
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt !== "");
    setLocalChoices(updatedChoices.length ? updatedChoices : ["New Option"]);
    // Reset cellTypeMatrix when elementInstance changes.
    const updatedRows = elementInstance.extraAttributes.rows;
    const updatedColumns = elementInstance.extraAttributes.columns;
    setCellTypeMatrix(
      elementInstance.extraAttributes.cellTypes ||
        Array.from({ length: updatedRows }, () =>
          Array.from({ length: updatedColumns }, () => elementInstance.extraAttributes.cellType)
        )
    );
  }, [elementInstance, reset]);

  // Watch for changes to rows/columns to update cellTypeMatrix dimensions.
  const watchRows = watch("rows");
  const watchColumns = watch("columns");
  useEffect(() => {
    setCellTypeMatrix((prevMatrix) => {
      const newMatrix = [];
      for (let i = 0; i < watchRows; i++) {
        newMatrix[i] = [];
        for (let j = 0; j < watchColumns; j++) {
          newMatrix[i][j] =
            prevMatrix[i] && prevMatrix[i][j] ? prevMatrix[i][j] : getValues("cellType");
        }
      }
      return newMatrix;
    });
  }, [watchRows, watchColumns, getValues]);

  const toggleCellType = (rowIndex, colIndex) => {
    setCellTypeMatrix((prevMatrix) => {
      const newMatrix = prevMatrix.map((row) => [...row]);
      newMatrix[rowIndex][colIndex] =
        newMatrix[rowIndex][colIndex] === "text" ? "dropdown" : "text";
      return newMatrix;
    });
  };

  const applyChanges = (data) => {
    updateElement(elementInstance.id, {
      ...elementInstance,
      extraAttributes: {
        ...data,
        choices: localChoices.join(","),
        cellTypes: cellTypeMatrix,
      },
    });
  };

  const watchCellType = watch("cellType");

  const addChoice = () => {
    setLocalChoices([...localChoices, "New Option"]);
  };

  const removeChoice = (index) => {
    if (localChoices.length === 1) return;
    setLocalChoices(localChoices.filter((_, idx) => idx !== index));
  };

  return (
    <form className="properties-form" onSubmit={handleSubmit(applyChanges)}>
      <div className="form-field">
        <label>Label</label>
        <input
          type="text"
          {...register("label")}
          onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
        />
        <span className="form-description">The label displayed above the table</span>
      </div>

      <div className="form-field">
        <label>Helper Text</label>
        <input
          type="text"
          {...register("helperText")}
          onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
        />
        <span className="form-description">Help text displayed below the table</span>
      </div>

      <div className="form-field">
        <label>Rows</label>
        <input
          type="number"
          {...register("rows", { valueAsNumber: true })}
          onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
        />
        <span className="form-description">Number of rows in the table</span>
      </div>

      <div className="form-field">
        <label>Columns</label>
        <input
          type="number"
          {...register("columns", { valueAsNumber: true })}
          onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
        />
        <span className="form-description">Number of columns in the table</span>
      </div>

      <div className="form-field">
        <label>Cell Type</label>
        <select {...register("cellType")}>
          <option value="text">Text</option>
          <option value="dropdown">Dropdown</option>
        </select>
        <span className="form-description">Select the default cell type for table cells</span>
      </div>

      {watchCellType === "dropdown" && (
        <div className="form-field">
          <label>Dropdown Options</label>
          <div className="options-list">
            {localChoices.map((option, index) => (
              <div key={index} className="option-item">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newChoices = [...localChoices];
                    newChoices[index] = e.target.value;
                    setLocalChoices(newChoices);
                  }}
                  onBlur={handleSubmit(applyChanges)}
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  type="button"
                  className="remove-option"
                  onClick={() => removeChoice(index)}
                  disabled={localChoices.length === 1}
                >
                  &times;
                </button>
              </div>
            ))}
            <button type="button" onClick={addChoice}>
              Add Option
            </button>
          </div>
          <span className="form-description">
            Enter a comma-separated list of options for the dropdown.
          </span>
        </div>
      )}

      <div className="form-field">
        <label>Toggle Each Cell's Type</label>
        <table className="cell-type-grid">
          <tbody>
            {cellTypeMatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>
                    <button
                      type="button"
                      onClick={() => toggleCellType(rowIndex, colIndex)}
                    >
                      {cell}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <span className="form-description">
          Click on a cell to toggle between "text" and "dropdown"
        </span>
      </div>

      <div className="switch-field">
        <label>
          Required Field
          <span className="form-description">All cells must be filled if required</span>
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