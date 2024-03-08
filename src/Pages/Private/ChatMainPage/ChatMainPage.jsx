/** @format */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button } from "@chakra-ui/react";
import { GlobalContext } from "../../../Context/Context";
import CircleLoader from "../../../Components/Loader/CircleLoader/CircleLoader";
import "./ChatMainPage.css";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatMessageHeader from "../Home/Components/Message/Components/ChatMessageHeader";
import ChatMessageBody from "../Home/Components/Message/Components/ChatMessageBody";
import ChatMessageFooter from "../Home/Components/Message/Components/ChatMessageFooter";
import { socket, useSocket, isConnected } from "../../../socket/socket";

const ChatMainPage = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const { selectChatId, setSelectChatId, selectChat, setSelectChat } =
    GlobalContext();
  const [loader, setLoader] = useState(false);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [updateChat, setUpdateChat] = useState(null);

  useSocket();

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
      url: `${process.env.REACT_APP_BASE_URL}api/chat/${id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
        setChat(response.data);
        setLoader(false);
        setSelectChat(response.data);
        socket.emit("join chat", {
          message: response.data._id,
          user: user._id,
        });
      })
      .catch((error) => {
        console.log(error);
        setChat(null);
        setLoader(false);
      });
  }, [id, updateChat]);

  useEffect(() => {
    socket.off("received new message").on("received new message", (data) => {
      // if room has been selected then append mesage
      if (data.chat === id) {
        setMessages((prev) => [...prev, data]);
      }
      // otherwise send notification
    });
  }, []);

  useEffect(() => {
    console.log("useEffect in footer");
    socket.on("send block chat", (data) => {
      // console.log("send block chat", data.updateData);
      setUpdateChat(data.updateData);
    });
  }, []);

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
              <ChatMessageBody
                chat={chat}
                messages={messages}
                setMessages={setMessages}
              />
              {chat.isGroup ? (
                <>
                  {chat.users.includes(user._id) ||
                  chat.creator._id === user._id ? (
                    <ChatMessageFooter chat={chat} setMessages={setMessages} />
                  ) : (
                    <Box className='not_member_group'>
                      You are not a member of this group
                    </Box>
                  )}
                </>
              ) : (
                <ChatMessageFooter chat={chat} setMessages={setMessages} />
              )}
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

export default ChatMainPage;
