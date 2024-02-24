/** @format */

import { Avatar, Box } from "@chakra-ui/react";
import React from "react";
import "./ChatCard.css";
import { getChatName } from "../../Utils/getChatName";
import { GlobalContext } from "../../Context/Context";
import { useNavigate } from "react-router-dom";

const ChatCard = ({ chat }) => {
  const { windowWidth, setWindowWidth, setSelectChatId } = GlobalContext();
  const getData = getChatName(
    chat.users,
    JSON.parse(localStorage.getItem("user"))
  );
  const navigate = useNavigate();

  const handleRedirectToChat = (id) => {
    setSelectChatId(id);
    if (window.innerWidth < 650) {
      navigate(`/chat/${id}`);
    }
  };
  return (
    <>
      {chat.isGroup ? (
        <Box
          className='chat_card'
          onClick={() => handleRedirectToChat(chat._id)}>
          <Avatar src={chat.p_i} className='chat_avatar' />
          {/* chat info */}
          <Box className='chat_card_info'>
            <Box className='chat_name'>{chat.name}</Box>
            <Box className='chat_message'>Sample latest message</Box>
          </Box>
        </Box>
      ) : (
        <Box
          className='chat_card'
          onClick={() => handleRedirectToChat(chat._id)}>
          {/* Chat avatar */}
          <Avatar src={getData.p_i} className='chat_avatar' />
          {/* chat info */}
          <Box className='chat_card_info'>
            <Box className='chat_name'>{getData.name}</Box>
            <Box className='chat_message'>Sample latest message</Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatCard;
