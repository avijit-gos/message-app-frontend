/** @format */

import React from "react";
import "./ProfileHeader.css";
import { Box, Button } from "@chakra-ui/react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({ title }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <Box className='profile_header_section'>
      <Button className='header_back_btn' onClick={goBack}>
        <MdOutlineKeyboardBackspace />
      </Button>
      <Box className='header_title'>{title}</Box>
    </Box>
  );
};

export default ProfileHeader;
