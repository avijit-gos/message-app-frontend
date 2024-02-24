/** @format */

import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";

const CreateContext = createContext();

function CreateContextProvider({ children }) {
  const [pageType, setPageType] = React.useState("home");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectChatId, setSelectChatId] = useState("");

  return (
    <CreateContext.Provider
      value={{
        pageType,
        setPageType,
        windowWidth,
        setWindowWidth,
        selectChatId,
        setSelectChatId,
      }}>
      {children}
    </CreateContext.Provider>
  );
}

export const GlobalContext = () => {
  return useContext(CreateContext);
};

export default CreateContextProvider;
