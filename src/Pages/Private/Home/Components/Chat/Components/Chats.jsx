/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import SkeletonLoader from "../../../../../../Components/Loader/SkeletonLoader/SkeletonLoader";
import ChatCard from "../../../../../../Components/ChatCard/ChatCard";
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
        "x-access-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWNiMWIxZjM3ZDlmMmVkYjRlOTQyMWQiLCJlbWFpbCI6ImFjY291bnRfZm91ckB0ZXN0LmNvbSIsIm5hbWUiOiJBY2NvdW50IEZvdXIiLCJ1c2VybmFtZSI6ImFjY291bnRfZm91ciIsImlhdCI6MTcwNzgwOTc0OCwiZXhwIjoxNzEwNDAxNzQ4fQ.ZBnnAxB9sDuljJzgs6YtZbyNWHrZ9U9lMfo-DYs2wWo",
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
