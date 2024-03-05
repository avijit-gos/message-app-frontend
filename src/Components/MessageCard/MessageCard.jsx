/** @format */

import React, { useState, useEffect } from "react";
import { useSocket, socket } from "../../socket/socket";
import {
  Box,
  Button,
  Avatar,
  Img,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import "./MessageCard.css";
import { handleDecrypt } from "../../Utils/decrypt";
import { timeDifference } from "../../Utils/timeDifference";
import { FiMoreHorizontal } from "react-icons/fi";
import { isSameSender } from "../../Utils/sameSender";
import ModalComp from "../ModalComp/ModalComp";
import AuthButton from "../ButtonComp/AuthButton";
import axios from "axios";
import { TbPinFilled } from "react-icons/tb";
import TextareaComp from "../InputComp/TextareaComp";

const MessageCard = ({ message, index, messages, chat }) => {
  useSocket();
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("user"));
  const [content, setContent] = useState(message.content);
  const [image, setImage] = useState(message.image);
  const [messageUser, setMessageUser] = useState(message.user);
  const [pin, setPin] = useState(message.pin || false);
  const [openPinModal, setOpenPinModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectMessage, setSelectMessage] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [disableUpdateBtn, setDisableUpdateBtn] = useState(true);
  const [loadingUpdateBtn, setLoadingUpdateBtn] = useState(false);

  const handleOpenPinModal = (message) => {
    setOpenPinModal(true);
    setSelectMessage(message);
  };
  // pinned or unpinned message
  const handlePinnedMessage = (message) => {
    let data = JSON.stringify({
      messageId: selectMessage._id,
      chatId: selectMessage.chat,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/message/pin-messsage`,
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
        toast({
          title: "Success",
          description: `${response.data.msg}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setPin(response.data.message.pin);
        setOpenPinModal(false);
        // update in socket
        socket.emit("pinned message", response.data.message);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `${error.response.data.error.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        // console.log(error.response.data.error.message);
        setOpenPinModal(false);
      });
  };

  const handleOpenEditModal = (message) => {
    setMessageText(handleDecrypt(message.content));

    setSelectMessage(message);
    setOpenEditModal(true);
  };

  useEffect(() => {
    if (!messageText.trim()) {
      setDisableUpdateBtn(true);
    } else {
      setDisableUpdateBtn(false);
    }
  }, [messageText]);

  useEffect(() => {
    socket.on("update pin message", (data) => {
      if (data._id === message._id) {
        setPin(data.pin);
      }
    });
  }, []);

  // handle edit message
  const handleUpdateMessage = () => {
    setDisableUpdateBtn(true);
    setLoadingUpdateBtn(true);
    let data = JSON.stringify({
      message: messageText,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/message/update-message/${selectMessage._id}`,
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
        setContent(response.data.message.content);
        toast({
          title: "Success",
          description: `${response.data.msg}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setOpenEditModal(false);
        setLoadingUpdateBtn(false);
        socket.emit("update message", response.data.message);
      })
      .catch((error) => {
        // console.log(error);.
        toast({
          title: "Error",
          description: `${error.response.data.error.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        // console.log(error.response.data.error.message);
        setOpenEditModal(false);
      });
  };

  //
  useEffect(() => {
    socket.on("sent update message", (data) => {
      // if (data._id === message._id) {
      //   setContent(data.content);
      // }
      console.log("sent update message");
    });
  }, []);

  return (
    <>
      {/* Pinned/Unpinned modal */}
      {openPinModal && (
        <ModalComp
          isOpen={openPinModal}
          onClose={setOpenPinModal}
          title={pin ? <>Unpinn message</> : <>Pinn message</>}
          body={
            <Box className='leave_group_modal_body'>
              {pin ? (
                <>Do you want to unpinned this message?</>
              ) : (
                <>Do you want to pinned this message?</>
              )}
            </Box>
          }
          footer={
            <Box className='modal_footer_section'>
              <AuthButton
                disable={false}
                loading={false}
                text={pin ? <>Unpin</> : <>Pin</>}
                className='modal_update_btn leave_btn'
                disableClassName='disable_modal_update_btn'
                clickHandler={handlePinnedMessage}
              />
            </Box>
          }
        />
      )}

      {/* Edit modal */}
      {openEditModal && (
        <ModalComp
          isOpen={openEditModal}
          onClose={setOpenEditModal}
          title='Edit message'
          body={
            <Box className='leave_group_modal_body'>
              <TextareaComp
                type='text'
                className='modal_form_input'
                placeholder='Update message'
                value={messageText}
                handleChange={(e) =>
                  setMessageText(e.target.value.slice(0, 400))
                }
              />
            </Box>
          }
          footer={
            <Box className='modal_footer_section'>
              <AuthButton
                disable={disableUpdateBtn}
                loading={loadingUpdateBtn}
                text='Update'
                className='modal_update_btn leave_btn'
                disableClassName='disable_modal_update_btn'
                clickHandler={handleUpdateMessage}
              />
            </Box>
          }
        />
      )}
      {messageUser._id === user._id ? (
        <Box className='message_outer_section'>
          <Box className='message_card'>
            <Box className='message_inner_section'>
              <Box className='message_content'>
                {/* Pin icon */}
                {pin && <TbPinFilled className='message_pin_icon' />}
                <Box className='message_text'>{handleDecrypt(content)}</Box>
                {image && <Img src={image} className='message_image' />}
                <span className='timestamp'>
                  {timeDifference(new Date(), new Date(message.createdAt))}
                </span>
              </Box>
              <Menu>
                <MenuButton
                  className='message_menu_btn'
                  as={Button}
                  rightIcon={<FiMoreHorizontal />}></MenuButton>
                <MenuList>
                  <MenuItem
                    className='menu_item'
                    onClick={() => handleOpenEditModal(message)}>
                    Edit
                  </MenuItem>

                  {/* Pin message */}
                  {chat.creator._id === user._id && (
                    <MenuItem
                      className='menu_item'
                      onClick={() => handleOpenPinModal(message)}>
                      {pin ? <>Unpin</> : <>Pin</>}
                    </MenuItem>
                  )}

                  <MenuItem className='menu_item delete'>Delete</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box className='message_outer_section others'>
          <Box className='_message_card'>
            {!isSameSender(messages, index, message) ? (
              <Avatar src={message.user.p_i} className='_message_avatar' />
            ) : (
              <Box className='_message_avatar'></Box>
            )}
            {/* Message_body */}
            <Box className='_message_content_box'>
              {/* Pin icon */}
              {pin && <TbPinFilled className='other_message_pin_icon' />}
              {!isSameSender(messages, index, message) && (
                <Box className='sender_name'>{message.user.name}</Box>
              )}
              <Box className='message_text'>{handleDecrypt(content)}</Box>
              {image && <Img src={image} className='message_image' />}

              <span className='timestamp'>
                {timeDifference(new Date(), new Date(message.createdAt))}
              </span>
            </Box>
            {/* Menu */}
          </Box>
        </Box>
      )}
    </>
  );
};

export default MessageCard;
