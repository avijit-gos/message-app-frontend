/** @format */
import { Box, Button, Img, Input } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { GlobalContext } from "../../../../../../Context/Context";
import { GrGallery } from "react-icons/gr";
import { BsEmojiLaughing, BsSendFill } from "react-icons/bs";
import AuthButton from "../../../../../../Components/ButtonComp/AuthButton";
import { MdOutlineClose } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { socket, useSocket } from "../../../../../../socket/socket";
import { AiOutlineClose } from "react-icons/ai";
import { handleDecrypt } from "../../../../../../Utils/decrypt";

const ChannelFooter = () => {
  
  return <Box className='channel_footer'>ChannelFooter</Box>;
};

export default ChannelFooter;
