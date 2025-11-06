import React from "react";

const FormField = ({
  label,
  type = "text",
  value,
  onChange,
  required = true,
}) => {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default FormField;
