/** @format */

import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";

const CreateContext = createContext();

function CreateContextProvider({ children }) {
  const [pageType, setPageType] = React.useState("home");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectChatId, setSelectChatId] = useState("");
  const [selectChat, setSelectChat] = useState(null);
  const [selectReplyMessage, setSelectReplyMessage] = useState(null);
  const [selectChannelId, setSelectChannelId] = useState("");

  return (
    <CreateContext.Provider
      value={{
        pageType,
        setPageType,
        windowWidth,
        setWindowWidth,
        selectChatId,
        setSelectChatId,
        selectChat,
        setSelectChat,
        selectReplyMessage,
        setSelectReplyMessage,
        selectChannelId,
        setSelectChannelId,
      }}>
      {children}
    </CreateContext.Provider>
  );
}

export const GlobalContext = () => {
  return useContext(CreateContext);
};

export default CreateContextProvider;
