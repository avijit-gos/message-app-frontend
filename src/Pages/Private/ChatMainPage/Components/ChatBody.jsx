/** @format */

import { Box } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import CircleLoader from "../../../../Components/Loader/CircleLoader/CircleLoader";
import MessageCard from "../../../../Components/MessageCard/MessageCard";
import axios from "axios";
import { useSocket } from "../../../../socket/socket";

const ChatBody = ({ chat, messages, setMessages }) => {
  const bottomRef = useRef(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [subLoader, setSubLoader] = useState(false);
  const [active, setactive] = useState("message");
  useSocket();

  const scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  // fetching messages related to the chats
  useEffect(() => {
    if (active === "message") {
      if (page === 1) setLoading(true);
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/message/${chat._id}?page=${page}&limit=${limit}`,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      };

      axios
        .request(config)
        .then((response) => {
          if (page === 1) {
            scrollToBottom();
          }
          setCount(response.data.length);
          if (page === 1) {
            setMessages(response.data.reverse());
          } else {
            setMessages((prev) => [...response.data.reverse(), ...prev]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [page, chat._id, active]);

  const handleChangeTab = (value) => {
    setPage(1);
    setLoading(true);
    setactive(value);
  };

  const handleScroll = () => {
    // Check if user has scrolled to the top of the page
    // if (window.scrollY === 0) {
    //   console.log("Increment page count");
    //   setPage((prevCount) => prevCount + 1);
    // }
    console.log(window.scrollY);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Box Box className='chat_page_body_section' onScroll={handleScroll}>
      {loading ? (
        <Box className='chat_page_body_loader'>
          <CircleLoader />
        </Box>
      ) : (
        <>
          {chat.isGroup && (
            <Box className='tab_section'>
              <Box
                onClick={() => handleChangeTab("message")}
                className={
                  active === "message"
                    ? "message_tab_section active_message_tab_section"
                    : "message_tab_section"
                }>
                Message
              </Box>

              <Box
                onClick={() => handleChangeTab("timeline")}
                className={
                  active === "timeline"
                    ? "message_tab_section active_message_tab_section"
                    : "message_tab_section"
                }>
                Timeline
              </Box>
            </Box>
          )}
          <>
            {active === "message" ? (
              <>
                {(messages || []).length > 0 ? (
                  <Box className='messages_section'>
                    {messages.map((data, index) => (
                      <MessageCard
                        key={data._id}
                        message={data}
                        index={index}
                        messages={messages}
                        chat={chat}
                        setMessages={setMessages}
                      />
                    ))}
                    <Box ref={bottomRef} />
                  </Box>
                ) : (
                  <Box className='empty_message_section'>No data found</Box>
                )}
              </>
            ) : (
              <>Timeline</>
            )}
          </>
        </>
      )}
    </Box>
  );
};

export default ChatBody;
