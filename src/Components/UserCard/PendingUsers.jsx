/** @format */

import React, { useState } from "react";
import { Box, Avatar, Button } from "@chakra-ui/react";
import { FiUserPlus } from "react-icons/fi";
import "./UserCard.css";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import axios from "axios";

const PendingUsers = ({ data, id, pendingUsers, setPendingUsers }) => {
  const handleAddUser = (type, user_id) => {
    let data = JSON.stringify({
      user: user_id,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/accept-join-request/${id}?isAccept=${type}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const arr = pendingUsers;
        const temp = arr.filter((data) => data._id !== user_id);
        setPendingUsers(temp);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Box className='user_card'>
      {/* User info */}
      <Box className='user_info_section'>
        <Avatar src={data.p_i} className='user_card_avatar' />
        <span className='user_card_name'>{data.name}</span>
        <span className='user_card_username'>@{data.username}</span>
      </Box>

      {/* card buttons */}
      <Box className='users_card_btns'>
        <Button
          className='user_card_send_chat_btn accept'
          onClick={() => handleAddUser(true, data._id)}>
          <FaUserPlus />
        </Button>

        <Button
          className='user_card_send_chat_btn cancel'
          onClick={() => handleAddUser(false, data._id)}>
          <FaUserMinus />
        </Button>
      </Box>
    </Box>
  );
};

export default PendingUsers;
