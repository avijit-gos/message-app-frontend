/** @format */

import { Avatar, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import "./ChatCard.css";
import { getChatName } from "../../Utils/getChatName";
import { GlobalContext } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import { useSocket, socket } from "../../socket/socket";
import { handleDecrypt } from "../../Utils/decrypt";

const ChatCard = ({ chat }) => {
  useSocket();
  const { setSelectChatId, selectChatId } = GlobalContext();
  const getData = getChatName(
    chat.users,
    JSON.parse(localStorage.getItem("user"))
  );
  const [lastMessage, setLastMessage] = useState(handleDecrypt(chat.lastMsg));
  const navigate = useNavigate();

  const handleRedirectToChat = (id) => {
    setSelectChatId(id);
    if (window.innerWidth < 650) {
      navigate(`/chat/${id}`);
    }
  };

  useEffect(() => {
    socket.on("send new message", (data) => {
      if (chat._id === data.chat) {
        setLastMessage(handleDecrypt(data.content));
      }
    });
  }, []);

  return (
    <>
      {chat.isGroup ? (
        <Box
          className={
            selectChatId === chat._id
              ? "chat_card select_chat_card"
              : "chat_card"
          }
          onClick={() => handleRedirectToChat(chat._id)}>
          <Avatar src={chat.p_i} className='chat_avatar' />
          {/* chat info */}
          <Box className='chat_card_info'>
            <Box className='chat_name'>{chat.name}</Box>
            <Box className='chat_message'>{lastMessage.slice(0, 57)}</Box>
          </Box>
        </Box>
      ) : (
        <Box
          className={
            selectChatId === chat._id
              ? "chat_card select_chat_card"
              : "chat_card"
          }
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
