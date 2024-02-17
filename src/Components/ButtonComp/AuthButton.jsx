/** @format */

import React from "react";
import { Button, Spinner } from "@chakra-ui/react";
const AuthButton = ({
  loading,
  disable,
  text,
  className,
  disableClassName,
  clickHandler,
}) => {
  return (
    <>
      {disable ? (
        <Button className={disableClassName}>
          {loading ? <Spinner /> : <>{text}</>}
        </Button>
      ) : (
        <Button className={className} onClick={clickHandler}>
          {text}
        </Button>
      )}
    </>
  );
};

export default AuthButton;
