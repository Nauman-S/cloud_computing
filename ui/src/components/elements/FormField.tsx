import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import tooltipIcon from "../../assets/tooltip-48.png";
const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  options = [],
  valueEnd,
  onChangeEnd,
  tooltipText,
}) => {
  const inputClass = `form-control ${error ? "is-invalid" : ""}`;

  return (
    <div className="mb-3 text-start">
      <label htmlFor={name} className="form-label fw-semibold">
        {label + " "}
        {tooltipText && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${name}`}>{tooltipText}</Tooltip>}
          >
            <img
              src={tooltipIcon}
              alt="info"
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </OverlayTrigger>
        )}
      </label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          className={inputClass}
          value={value}
          onChange={onChange}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "date-range" ? (
        <div className="d-flex flex-row align-items-end gap-2">
          <input
            id={`${name}-start`}
            name={`${name}Start`}
            type="date"
            className={inputClass}
            value={value}
            onChange={onChange}
          />{" "}
          <span className="align-text-bottom">
            <p className="align-text-bottom">To</p>
          </span>
          <input
            id={`${name}-end`}
            name={`${name}End`}
            type="date"
            className={inputClass}
            value={valueEnd}
            onChange={onChangeEnd}
          />
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={inputClass}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={!!error}
        />
      )}

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormField;
export type InputType =
  | "text"
  | "email"
  | "password"
  | "select"
  | "date"
  | "date-range";

export interface Option {
  label: string;
  value: string;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: InputType;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  error?: string;
  options?: Option[]; // For select
  valueEnd?: string; // For date-range end value
  onChangeEnd?: (e: React.ChangeEvent<HTMLInputElement>) => void; // For date-range end
  tooltipText?: string;
}
