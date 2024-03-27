/** @format */

import React from "react";
import { Box, Avatar } from "@chakra-ui/react";
import "./ChannelCard.css";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../Context/Context";
import { useSocket, socket } from "../../socket/socket";

const ChannelCard = ({ channel }) => {
  const { setSelectChatId, setSelectChannelId } = GlobalContext();
  const navigate = useNavigate();

  const handleRedirect = (id) => {
    setSelectChatId("");
    setSelectChannelId(id);
    if (window.innerWidth < 650) {
      // navigate(`/chat/${id}`);
    }
  };

  return (
    <Box className='channel_card' onClick={() => handleRedirect(channel._id)}>
      <Avatar className='channel_avatar' src={channel.p_i} />
      <Box className='channel_info_section'>
        <Box className='channel_info_header'>
          <Box className='channel_name'>{channel.name}</Box>
          <Box className='channel_type'>{channel.cat}</Box>
        </Box>
        <Box className='channel_last_msg'>Sample channel message</Box>
      </Box>
    </Box>
  );
};

export default ChannelCard;
