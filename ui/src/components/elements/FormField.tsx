import React from "react";

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  options = [],
  valueEnd,
  onChangeEnd,
}) => {
  const inputClass = `form-control ${error ? "is-invalid" : ""}`;

  return (
    <div className="mb-3 text-start">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
      </label>

      {type === "select" ? (
        <select
          id={id}
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
            id={`${id}-start`}
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
            id={`${id}-end`}
            name={`${name}End`}
            type="date"
            className={inputClass}
            value={valueEnd}
            onChange={onChangeEnd}
          />
        </div>
      ) : (
        <input
          id={id}
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
  id: string;
  name?: string;
  type?: InputType;
  value: any;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  error?: string;
  options?: Option[]; // For select
  valueEnd?: string; // For date-range end value
  onChangeEnd?: (e: React.ChangeEvent<HTMLInputElement>) => void; // For date-range end
}
