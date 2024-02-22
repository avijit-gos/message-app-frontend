/** @format */

import React, { useEffect, useState } from "react";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import "./HomeHeader.css";
import { useNavigate } from "react-router-dom";

const HomeHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <Box className='home_header_container'>
      <Box className='home_header_app_name'>Vootel</Box>
      <Box className='home_header_buttons'>
        {/* Notification */}
        <Box className='notification_box'>
          <FaBell />
        </Box>

        {/* Menu */}
        <Menu>
          <MenuButton as={Button} className='menu_btn'>
            <Avatar className='menu_avatar' />
          </MenuButton>
          <MenuList>
            <MenuItem
              className='menu_item'
              onClick={() => navigate(`/profile/${user._id}`)}>
              Profile & Settings
            </MenuItem>
            <MenuItem className='menu_item logout'>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};

export default HomeHeader;
