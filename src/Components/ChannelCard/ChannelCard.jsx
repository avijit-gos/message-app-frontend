/** @format */

import React from "react";
import { Box, Avatar } from "@chakra-ui/react";
import "./ChannelCard.css";

const ChannelCard = ({ channel }) => {
  return (
    <Box className='channel_card'>
      <Avatar className='channel_avatar' src={channel.p_i} />
      <Box className='channel_info_section'>
        <Box className='channel_info_header'>
          <Box className='channel_name'>{channel.name}</Box>
          <Box className='channel_type'>{channel.type}</Box>
        </Box>
        <Box className='channel_last_msg'>Sample channel message</Box>
      </Box>
    </Box>
  );
};

export default ChannelCard;
