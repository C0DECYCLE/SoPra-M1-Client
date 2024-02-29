import React, { useState } from "react";
import "styles/ui/LogRegForm.scss";
import PropTypes from "prop-types";

const FormField = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  let passwordToggle = undefined;
  if (props.isPassword) {
    passwordToggle = (
      <input
        className="logregform togglePassword"
        type="checkbox"
        value={showPassword}
        onChange={() => setShowPassword((prev) => !prev)}
      />
    );
  }
  return (
    <div className="logregform field">
      <label className="logregform label">{props.label}</label>
      {passwordToggle}
      <input
        className="logregform input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        type={props.isPassword ? (showPassword ? "text" : "password") : "text"}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  isPassword: PropTypes.bool,
};

export default FormField;
