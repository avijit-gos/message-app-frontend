/** @format */

import React, { useState } from "react";
import { GlobalContext } from "../../Context/Context";
import {
  Box,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import "./UserCard.css";
import { MdOutlineMoreHoriz } from "react-icons/md";
import axios from "axios";

const Members = ({ user, users, setUsers }) => {
  const { selectChat } = GlobalContext();
  const [admins, setAdmins] = useState(selectChat.admin);
  const [members, setMemebers] = useState(selectChat.users);
  const [blocks, setBlocks] = useState(selectChat.block);

  const handleAddRemoveAsAmin = (id) => {
    let data = JSON.stringify({
      user: id,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/add/admin/${selectChat._id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        if (admins.includes(id)) {
          const arr = admins;
          const temp = arr.filter((data) => data !== id);
          setAdmins(temp);
        } else {
          setAdmins((prev) => [...prev, id]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRemoveFromGroup = (id) => {
    // alert(id);
    let data = JSON.stringify({
      user: id,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/remove-group/${selectChat._id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        // admins
        const arr = admins;
        const temp = arr.filter((data) => data !== id);
        setAdmins(temp);

        // members
        const arr1 = members;
        const temp1 = arr1.filter((data) => data !== id);
        setMemebers(temp1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {members.includes(user._id) ? (
        <Box className='members_card'>
          <Box className='members_card_section'>
            <Avatar src={user.p_i} className='user_card_avatar' />
            <Box className='user_info_section'>
              <span className='user_name'>{user.name}</span>
              <span className='user_username'>@{user.username}</span>
              {admins.includes(user._id) && (
                <span className='admin_tag'>Admin</span>
              )}
            </Box>
          </Box>
          <Box className='members_card_buttons_section'>
            <Menu>
              <MenuButton
                className='chat_header_menu_btn'
                as={Button}
                rightIcon={<MdOutlineMoreHoriz />}></MenuButton>
              <MenuList>
                {members.includes(user._id) ? (
                  <>
                    <MenuItem
                      className='menu_item'
                      onClick={() => handleAddRemoveAsAmin(user._id)}>
                      {admins.includes(user._id) ? (
                        <>Remove from admin</>
                      ) : (
                        <>Add as admin</>
                      )}
                    </MenuItem>

                    <MenuItem className='menu_item'>
                      {blocks.includes(user._id) ? (
                        <>Unblock user</>
                      ) : (
                        <>Block user</>
                      )}
                    </MenuItem>

                    <MenuItem
                      className='menu_item'
                      onClick={() => handleRemoveFromGroup(user._id)}>
                      Remove from group
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem className='menu_item'>Add to group</MenuItem>
                )}
              </MenuList>
            </Menu>
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default Members;
