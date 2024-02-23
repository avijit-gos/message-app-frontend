/** @format */

import { Avatar, Box } from "@chakra-ui/react";
import React from "react";
import "./ChatCard.css";
import { getChatName } from "../../Utils/getChatName";

const chatCard = ({ chat }) => {
  const getData = getChatName(
    chat.users,
    JSON.parse(localStorage.getItem("user"))
  );
  return (
    <>
      {chat.isGroup ? (
        <Box className='chat_card'>
          <Avatar src={chat.p_i} className='chat_avatar' />
          {/* chat info */}
          <Box className='chat_card_info'>
            <Box className='chat_name'>{chat.name}</Box>
            <Box className='chat_message'>Sample latest message</Box>
          </Box>
        </Box>
      ) : (
        <Box className='chat_card'>
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

export default chatCard;
