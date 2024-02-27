/** @format */

import React, { useState } from "react";
import { Box, Avatar, Button } from "@chakra-ui/react";
import { FiUserPlus } from "react-icons/fi";
import "./UserCard.css";
import axios from "axios";

const UserCard2 = ({ data, clickHandler }) => {
  return (
    <Box className='user_card' onClick={() => clickHandler(data)}>
      {/* User info */}
      <Box className='user_info_section'>
        <Avatar src={data.p_i} className='user_card_avatar' />
        <span className='user_card_name'>{data.name}</span>
        <span className='user_card_username'>@{data.username}</span>
      </Box>
    </Box>
  );
};
export default UserCard2;
