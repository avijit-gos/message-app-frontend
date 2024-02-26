/** @format */

import React, { useState, useEffect } from "react";
import "../../Home.css";
import { Box, Button } from "@chakra-ui/react";
import { GlobalContext } from "../../../../../Context/Context";
import "./Message.css";
import CircleLoader from "../../../../../Components/Loader/CircleLoader/CircleLoader";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatMessageHeader from "./Components/ChatMessageHeader";
import ChatMessageBody from "./Components/ChatMessageBody";
import ChatMessageFooter from "./Components/ChatMessageFooter";

const Message = () => {
  const navigate = useNavigate();
  const { selectChatId, setSelectChatId, selectChat, setSelectChat } =
    GlobalContext();
  const [loader, setLoader] = useState(false);
  const [chat, setChat] = useState(null);

  const goBack = () => {
    if (window.innerWidth > 650) {
      setSelectChatId("");
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    setLoader(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/${selectChatId}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        setChat(response.data);
        setLoader(false);
        setSelectChat(response.data);
      })
      .catch((error) => {
        console.log(error);
        setChat(null);
        setLoader(false);
      });
  }, [selectChatId]);

  return (
    <Box className='message_container'>
      {loader ? (
        <Box className='main_chat_page_leader'>
          <CircleLoader />
        </Box>
      ) : (
        <>
          {chat && selectChat ? (
            <>
              <ChatMessageHeader chat={chat} />
              <ChatMessageBody chat={chat} />
              <ChatMessageFooter chat={chat} />
            </>
          ) : (
            <Box className='empty_chat_container'>
              {/* Header */}
              <Box className='empty_chat_header'>
                <Button className='goback_btn' onClick={goBack}>
                  <MdOutlineKeyboardBackspace />
                </Button>
              </Box>
              {/* Body */}
              <Box className='empty_chat_body'>No chat found</Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Message;
