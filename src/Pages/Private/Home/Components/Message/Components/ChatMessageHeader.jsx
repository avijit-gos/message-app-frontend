/** @format */

import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Img,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { getChatName } from "../../../../../../Utils/getChatName";
import { MdMoreVert } from "react-icons/md";
import { GlobalContext } from "../../../../../../Context/Context";
import { useNavigate, useParams } from "react-router-dom";
import ModalComp from "../../../../../../Components/ModalComp/ModalComp";
import { LuUploadCloud } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import AuthButton from "../../../../../../Components/ButtonComp/AuthButton";
import InputComp from "../../../../../../Components/InputComp/InputComp";
import TextareaComp from "../../../../../../Components/InputComp/TextareaComp";
import FullPageModal from "../../../../../../Components/ModalComp/FullPageModal";
import axios from "axios";

const ChatMessageHeader = ({ chat }) => {
  const toast = useToast();
  const id = useParams();
  const { selectChatId, setSelectChatId } = GlobalContext();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [chatName, setChatName] = useState(chat.isGroup && chat.name);
  const [chatBio, setChatBio] = useState(chat.bio);
  const [p_i, setP_i] = useState(chat.p_i);
  const [blockList, setBlockList] = useState(chat.block);
  const [admins, setAdmins] = useState(chat.admins);

  //upload profile image state
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [prevImage, setPrevImage] = useState("");
  const [image, setImage] = useState("");
  const [disableImageBtn, setDisableImageBtn] = useState(true);
  const [loadingImageBtn, setLoadingImageBtn] = useState(false);

  //update group details state
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [previousChatName, setPreviousChatName] = useState(
    chat.isGroup && chat.name
  );
  const [previousChatBio, setPreviousChatBio] = useState(
    chat.isGroup && chat.bio
  );
  const [disableDetailsBtn, setDisableDetilsBtn] = useState(true);
  const [loadingDetailsBtn, setLoadingDetailsBtn] = useState(false);

  // update group bio
  const [openBioModal, setOpenBioModal] = useState(false);
  const [disableBioBtn, setDisableBioBtn] = useState(true);
  const [loadingBioBtn, setLoadingDBioBtn] = useState(false);

  //
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(10);
  const [users, setUsers] = useState([]);

  const [openAdminModal, setOpenAdminModal] = useState(false);

  useEffect(() => {
    if (!chat.isGroup) {
      const result = getChatName(chat.users, user);
      // setChatName(result.name);
      // setChatBio(result.bio);
    }
  }, [chat]);

  const handleRedirectToChat = (id) => {
    setSelectChatId("");
    if (window.innerWidth < 650) {
      navigate(-1);
    }
  };

  const closeProfileModal = () => {
    setImage("");
    setPrevImage("");
    setOpenProfileModal(false);
  };

  const handleUpdateImage = (e) => {
    setImage(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
  };

  const closeImage = () => {
    setImage("");
    setPrevImage("");
  };

  useEffect(() => {
    if (!image || !prevImage.trim()) {
      setDisableImageBtn(true);
    } else {
      setDisableImageBtn(false);
    }
  }, [prevImage, image]);

  const handleUploadImage = () => {
    setDisableImageBtn(true);
    setLoadingImageBtn(true);
    const myHeaders = new Headers();
    myHeaders.append("x-access-token", localStorage.getItem("token"));

    const formdata = new FormData();
    formdata.append("image", image);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_BASE_URL}api/chat/update-profile-image/${
        selectChatId || id
      }`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setImage("");
        setPrevImage("");
        setOpenProfileModal(false);
        if (result.error) {
          toast({
            title: "Error",
            description: `${result.error.message}`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          setP_i(prevImage);
          toast({
            title: "Success",
            description: `${result.msg}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          // send data to socket
        }
        setLoadingImageBtn(false);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (!previousChatName.trim()) {
      setDisableDetilsBtn(true);
    } else {
      setDisableDetilsBtn(false);
    }
  }, [previousChatName]);

  useEffect(() => {
    if (!previousChatName.trim()) {
      setDisableDetilsBtn(true);
    } else {
      setDisableDetilsBtn(false);
    }
  }, [previousChatName]);

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setOpenBioModal(false);
  };

  const handleUpdateGroupInfo = () => {
    setDisableDetilsBtn(true);
    setLoadingDetailsBtn(true);
    let data = JSON.stringify({
      name: previousChatName,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/update-name/${
        selectChatId || id
      }`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setChatName(response.data.group.name);
        console.log(response.data);
        toast({
          title: "Success",
          description: `${response.data.msg}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        handleCloseDetailsModal();
        setLoadingDetailsBtn(false);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `${error.response.data.error.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        handleCloseDetailsModal();
        setLoadingDetailsBtn(false);
      });
  };

  useEffect(() => {
    if (!previousChatBio.trim()) {
      setDisableBioBtn(true);
    } else {
      setDisableBioBtn(false);
    }
  }, [previousChatBio]);

  const handleUpdateGroupBio = () => {
    setDisableDetilsBtn(true);
    setLoadingDetailsBtn(true);
    let data = JSON.stringify({
      bio: previousChatBio,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/update-bio/${
        selectChatId || id
      }`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setChatBio(response.data.group.bio);
        console.log(response.data);
        toast({
          title: "Success",
          description: `${response.data.msg}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        handleCloseDetailsModal();
        setLoadingDetailsBtn(false);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `${error.response.data.error.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        handleCloseDetailsModal();
        setLoadingDetailsBtn(false);
      });
  };

  const fetchMembers = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/members/${
        selectChatId || id
      }?page=${page}&limit=${limit}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpenMembersModal = () => {
    setOpenAdminModal(true);
  };
  useEffect(() => {
    if (openAdminModal) {
      fetchMembers();
    }
  }, [page, openAdminModal]);

  return (
    <>
      {/* Group profile image upload modal */}
      {openProfileModal && (
        <ModalComp
          isOpen={openProfileModal}
          onClose={closeProfileModal}
          title={"Update group avatar"}
          body={
            <Box className='modal_body_section'>
              {!prevImage ? (
                <label
                  htmlFor='image-file'
                  className='modal_image_upload_section'>
                  <Input
                    type='file'
                    className='file_input'
                    id='image-file'
                    onChange={(e) => handleUpdateImage(e)}
                    accept='image/*'
                  />
                  <LuUploadCloud className='modal_image_upload_icon' />
                </label>
              ) : (
                <Box className='preview_image_section'>
                  <Img src={prevImage} className='preview_image' />
                  <Button
                    className='image_close_btn'
                    onClick={() => closeImage()}>
                    <MdClose />
                  </Button>
                </Box>
              )}
            </Box>
          }
          footer={
            <Box className='modal_footer_section'>
              <AuthButton
                loading={loadingImageBtn}
                disable={disableImageBtn}
                text='Upload'
                className='modal_update_btn'
                disableClassName='disable_modal_update_btn'
                clickHandler={handleUploadImage}
              />
            </Box>
          }
        />
      )}

      {/* Open group details modal */}
      {openDetailsModal && (
        <ModalComp
          isOpen={openDetailsModal}
          onClose={handleCloseDetailsModal}
          title={<>Update group name</>}
          body={
            <Box className='modal_body_input_section'>
              <InputComp
                type='text'
                className='modal_form_input'
                placeholder='Enter group name'
                value={chatName}
                handleChange={(e) =>
                  setPreviousChatName(e.target.value.slice(0, 50))
                }
              />
              {/* <TextareaComp
                type='text'
                className='modal_form_input'
                placeholder='Enter group bio'
                value={previousChatBio}
                handleChange={(e) =>
                  setPreviousChatBio(e.target.value.slice(0, 100))
                }
              /> */}
            </Box>
          }
          footer={
            <Box className='modal_footer_section'>
              <AuthButton
                disable={disableDetailsBtn}
                loading={loadingDetailsBtn}
                text='Update'
                className='modal_update_btn'
                disableClassName='disable_modal_update_btn'
                clickHandler={handleUpdateGroupInfo}
              />
            </Box>
          }
        />
      )}

      {/* Open group details modal */}
      {openBioModal && (
        <ModalComp
          isOpen={openBioModal}
          onClose={handleCloseDetailsModal}
          title={<>Update group bio</>}
          body={
            <Box className='modal_body_input_section'>
              <TextareaComp
                type='text'
                className='modal_form_input'
                placeholder='Enter group bio'
                value={previousChatBio}
                handleChange={(e) =>
                  setPreviousChatBio(e.target.value.slice(0, 100))
                }
              />
            </Box>
          }
          footer={
            <Box className='modal_footer_section'>
              <AuthButton
                disable={disableBioBtn}
                loading={loadingBioBtn}
                text='Update'
                className='modal_update_btn'
                disableClassName='disable_modal_update_btn'
                clickHandler={handleUpdateGroupBio}
              />
            </Box>
          }
        />
      )}

      {openAdminModal && (
        <FullPageModal
          isOpen={openAdminModal}
          onClose={setOpenAdminModal}
          title={"Group Members"}
          body={<Box>Memebers</Box>}
        />
      )}

      {chat.isGroup ? (
        <Box className='chat_message_header_section'>
          <Box className='chat_header_box'>
            <Button className='back_btn' onClick={handleRedirectToChat}>
              <MdOutlineKeyboardBackspace />
            </Button>
            <Avatar src={p_i} className='chat_header_avatar' />
            <Box className='chat_info_section'>
              <p className='chat_header_name'>
                {chatName} <span className='chat_header_type'>{chat.cat}</span>
              </p>
              <span className='chat_header_bio'>{chatBio}</span>
            </Box>
          </Box>

          <Menu>
            <MenuButton
              className='chat_header_menu_btn'
              as={Button}
              rightIcon={<MdMoreVert />}></MenuButton>
            <MenuList>
              {/* Upload group image */}
              {chat.creator._id === user._id && (
                <MenuItem
                  className='menu_item'
                  onClick={() => setOpenProfileModal(true)}>
                  Upload Profile image
                </MenuItem>
              )}

              {/* Add new members */}
              {chat.creator._id === user._id && (
                <MenuItem
                  className='menu_item'
                  onClick={handleOpenMembersModal}>
                  Add members
                </MenuItem>
              )}

              {/* Remove members from group */}
              {chat.creator._id === user._id && (
                <MenuItem className='menu_item'>Remove members</MenuItem>
              )}

              {/* Group info */}
              {chat.creator._id === user._id && (
                <MenuItem
                  className='menu_item'
                  onClick={() => setOpenDetailsModal(true)}>
                  Update group name
                </MenuItem>
              )}

              {/* update group bio */}
              {chat.creator._id === user._id && (
                <MenuItem
                  className='menu_item'
                  onClick={() => setOpenBioModal(true)}>
                  Update group bio
                </MenuItem>
              )}

              {/* Privacy settings */}
              {chat.creator._id === user._id && (
                <MenuItem className='menu_item'>Privacy settings</MenuItem>
              )}

              {/* Leave group */}
              {chat.creator._id !== user._id && (
                <MenuItem className='menu_item'>Leave group</MenuItem>
              )}

              {/* Report */}
              {chat.creator._id !== user._id && (
                <MenuItem className='menu_item'>Report</MenuItem>
              )}

              {/* Delete settings */}
              {chat.creator._id === user._id && (
                <MenuItem className='menu_item delete'>Delete group</MenuItem>
              )}
            </MenuList>
          </Menu>
        </Box>
      ) : (
        <Box className='chat_message_header_section'>
          {/* <Box className='chat_header_box'>
            <Button className='back_btn'>
              <MdOutlineKeyboardBackspace />
            </Button>
          </Box> */}
          Single chat
        </Box>
      )}
    </>
  );
};

export default ChatMessageHeader;
