/** @format */

import React from "react";
import { Textarea } from "@chakra-ui/react";

const TextareaComp = ({
  type,
  className,
  value,
  placeholder,
  handleChange,
}) => {
  return (
    <Textarea
      type={type}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={(e) => handleChange(e)}
    />
  );
};

export default TextareaComp;
