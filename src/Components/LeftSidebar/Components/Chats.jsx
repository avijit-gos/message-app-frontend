/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import SkeletonLoader from "../../Loader/SkeletonLoader/SkeletonLoader";
import ChatCard from "../../ChatCard/ChatCard";

const Chats = () => {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    setLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setChats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setChats([]);
        setLoading(false);
      });
  }, []);
  return (
    <Box className='chat_cards_section'>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <>
          {(chats || []).length > 0 ? (
            <>
              {chats.map((chat) => (
                <ChatCard key={chat._id} chat={chat} />
              ))}
            </>
          ) : (
            <Box className='empty_chat_section'>No data found</Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Chats;
