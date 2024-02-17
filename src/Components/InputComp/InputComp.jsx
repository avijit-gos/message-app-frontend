/** @format */

import React from "react";
import { Input } from "@chakra-ui/react";

const InputComp = ({ type, placeholder, className, value, handleChange }) => {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      className={className}
      valkue={value}
      onChange={(e) => handleChange(e)}
    />
  );
};

export default InputComp;
