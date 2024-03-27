/** @format */

import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button } from "@chakra-ui/react";
import { GlobalContext } from "../../../Context/Context";
import CircleLoader from "../../../Components/Loader/CircleLoader/CircleLoader";
import "./ChatMainPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { socket, useSocket, isConnected } from "../../../socket/socket";
import Layout from "../../../Layout/Layout";
import ChatHeader from "./Components/ChatHeader";
import ChatBody from "./Components/ChatBody";
import ChatFooter from "./Components/ChatFooter";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const ChatMainPage = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const {
    setPageType,
    selectChatId,
    setSelectChatId,
    selectChat,
    setSelectChat,
  } = GlobalContext();
  const [loader, setLoader] = useState(false);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [updateChat, setUpdateChat] = useState(null);

  useSocket();

  useLayoutEffect(() => {
    setPageType("chat");
  });

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
    <Layout>
      <Box className='chat_main_page_container'>
        {loader ? (
          <Box className='chat_page_loader'>
            <CircleLoader />
          </Box>
        ) : (
          <>
            {chat ? (
              <>
                <ChatHeader chat={chat} />
                <ChatBody
                  chat={chat}
                  messages={messages}
                  setMessages={setMessages}
                />
                {chat.isGroup ? (
                  <>
                    {chat.users.includes(user._id) ||
                    chat.creator._id === user._id ? (
                      <ChatFooter chat={chat} setMessages={setMessages} />
                    ) : (
                      <Box className='not_member_group'>
                        You are not a member of this group
                      </Box>
                    )}
                  </>
                ) : (
                  <ChatFooter chat={chat} setMessages={setMessages} />
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
    </Layout>
  );
};

export default ChatMainPage;
