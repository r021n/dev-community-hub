import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";

const FormField = ({
  label,
  type = "text",
  value,
  onChange,
  required = true,
  placeholder = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const id = label.toLowerCase().replace(/\s+/g, "-");

  const isPasswordField = type === "password";

  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="grid items-center w-full gap-2 mb-4">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={isPasswordField ? "pr-10" : ""}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700 focus:outline-none"
            tabIndex="-1"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormField;
