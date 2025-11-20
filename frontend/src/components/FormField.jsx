import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const FormField = ({
  label,
  type = "text",
  value,
  onChange,
  required = true,
  placeholder = "",
}) => {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="grid items-center w-full gap-2 mb-4">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormField;
