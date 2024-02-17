/** @format */

import React, { useState, useEffect } from "react";
import "../../Home.css";
import {
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import { MdCreate } from "react-icons/md";
import Chats from "./Components/Chats";
import Channels from "./Components/Channels";

const Chat = () => {
  const [active, setActive] = useState("my_chat");
  return (
    <Box className='chat_container'>
      {/* Search Section */}
      <Box className='chat_search_section'>
        <Input
          type='search'
          placeholder='Search'
          className='chat_search_input'
        />
        <AiOutlineSearch className='search_icon' />
      </Box>

      {/* Chats Section */}
      <Box className='chat_secions'>
        {/* Chat tab section */}
        <Box className='chat_tab_section'>
          <li
            className={
              active === "my_chat"
                ? "active_tab tab_container"
                : "tab_container"
            }
            onClick={() => setActive("my_chat")}>
            My chats
          </li>

          <li
            className={
              active === "channels"
                ? "active_tab tab_container"
                : "tab_container"
            }
            onClick={() => setActive("channels")}>
            Channels
          </li>
        </Box>

        {/* Redering components */}
        {active === "my_chat" ? <Chats /> : <Channels />}

        <Menu>
          <MenuButton as={Button} className='action_chat_btn'>
            <MdCreate />
          </MenuButton>
          <MenuList>
            <MenuItem className='menu_item'>Create a chat</MenuItem>
            <MenuItem className='menu_item'>Create a group</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};

export default Chat;
