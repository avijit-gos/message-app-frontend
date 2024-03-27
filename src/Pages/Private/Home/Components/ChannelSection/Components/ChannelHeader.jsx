/** @format */

import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Img,
  Input,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { GlobalContext } from "../../../../../../Context/Context";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { MdMoreVert } from "react-icons/md";
import userEvent from "@testing-library/user-event";
import { useNavigate, useParams } from "react-router-dom";
import ModalComp from "../../../../../../Components/ModalComp/ModalComp";
import { LuUploadCloud } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import AuthButton from "../../../../../../Components/ButtonComp/AuthButton";
import InputComp from "../../../../../../Components/InputComp/InputComp";
import TextareaComp from "../../../../../../Components/InputComp/TextareaComp";
import FullPageModal from "../../../../../../Components/ModalComp/FullPageModal";
import axios from "axios";
import CircleLoader from "../../../../../../Components/Loader/CircleLoader/CircleLoader";
import UserCard2 from "../../../../../../Components/UserCard/UserCard2";

const ChannelHeader = ({ channel }) => {
  console.log(channel);
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("user"));
  const { setSelectChatId, setSelectChannelId } = GlobalContext();
  const navigate = useNavigate();

  const [chatName, setchatName] = useState(channel.name);
  const [p_i, setP_i] = useState(channel.p_i);
  const [bio, setBio] = useState(channel.bio);

  // profile image state
  const [openImageModal, setOpenImageModal] = useState(false);
  const [image, setImage] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [isBtnDisable, setBtnDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // channel name update
  const [openNameModal, setOpenNameModal] = useState(false);
  const [prevChatName, setPrevChatName] = useState("");
  const [disableNameBtn, setDisableNameBtn] = useState(true);
  const [loadingNameBtn, setLoadingNameBtn] = useState(false);

  // channel bio update state
  const [openBioModal, setOpenBioModal] = useState(false);
  const [newBioName, setNewBioName] = useState("");
  const [disableBioBtn, setDisableBioBtn] = useState(true);
  const [loadingBioBtn, setLoadingBioBtn] = useState(false);

  // channel delete update state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Followed channel state
  const [followers, setFollowers] = useState(channel.followers || []);
  const [openFollowersModal, setOpenFollowersModel] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(10);
  const [useLoading, setUserLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (!prevImage.trim()) {
      setBtnDisable(true);
    } else {
      setBtnDisable(false);
    }
  }, [prevImage]);

  const handleRedirectToChat = (id) => {
    setSelectChatId("");
    setSelectChannelId("");
    if (window.innerWidth < 650) {
      navigate(-1);
      setSelectChatId("");
      setSelectChannelId("");
    }
  };

  const handleUpdateImage = (e) => {
    setImage(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
  };

  const closeProfileModal = () => {
    setImage("");
    setPrevImage("");
    setOpenImageModal(false);
  };
  const closeImage = () => {
    setImage("");
    setPrevImage("");
  };
  const handleUploadImage = () => {
    setIsLoading(true);
    setBtnDisable(true);
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
      `${process.env.REACT_APP_BASE_URL}api/channel/update-image/${channel._id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setP_i(prevImage);
        console.log(result);
        setOpenImageModal(false);
        setIsLoading(false);
        setBtnDisable(true);
        setImage("");
        setPrevImage("");
      })
      .catch((error) => console.error(error));
  };
  const handleCloseDetailsModal = () => {
    setOpenNameModal(false);
    setOpenBioModal(false);
    setOpenDeleteModal(false);
    setOpenFollowersModel(false);
  };

  // *** Handle update channel name
  useEffect(() => {
    if (chatName === prevChatName || !prevChatName.trim()) {
      setDisableNameBtn(true);
    } else {
      setDisableNameBtn(false);
    }
  }, [chatName, prevChatName]);
  const handleUpdateChannelName = () => {
    setDisableNameBtn(true);
    setLoadingNameBtn(true);
    let data = JSON.stringify({
      name: prevChatName,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/channel/update-names/${channel._id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setchatName(response.data.group.name);
        setLoadingNameBtn(false);
        setOpenNameModal(false);
        setPrevChatName("");
        toast({
          title: "Success",
          description: `${response.data.mag}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        // console.log(error.response.data.error.message);
        setLoadingNameBtn(false);
        setOpenNameModal(false);
        setPrevChatName("");
        toast({
          title: "Success",
          description: `${error.response.data.error.message}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      });
  };









































  
  // *** Handle update channel bio
  useEffect(() => {
    if (bio === newBioName || !newBioName.trim()) {
      setDisableBioBtn(true);
    } else {
      setDisableBioBtn(false);
    }
  }, [bio, newBioName]);
  const handleUpdateChannelBio = () => {
    let data = JSON.stringify({
      bio: newBioName,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/channel/update-bio/${channel._id}`,
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
        setBio(response.data.group.bio);
        setLoadingBioBtn(false);
        setOpenBioModal(false);
        setNewBioName("");
        toast({
          title: "Success",
          description: `${response.data.mag}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        setLoadingBioBtn(false);
        setOpenBioModal(false);
        setNewBioName("");
        toast({
          title: "Success",
          description: `${error.response.data.error.message}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  // *** Handle delete channel
  const handleDeleteChannel = () => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/channel/${channel._id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        toast({
          title: "Success",
          description: `${response.data.mag}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        handleRedirectToChat();
      })
      .catch((error) => {
        console.log(error);
        setLoadingBioBtn(false);
        setOpenBioModal(false);
        setNewBioName("");
        toast({
          title: "Success",
          description: `${error.response.data.error.message}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  // *** Handle join/leave group
  const handleJoinGroup = () => {
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/channel/follow/${channel._id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if (followers.includes(user._id)) {
          const temp = followers;
          const arr = temp.filter((data) => data !== user._id);
          setFollowers(arr);
        } else {
          setFollowers((prev) => [...prev, user._id]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // fetch channel followers
  useEffect(() => {
    if (openFollowersModal) {
      if (page === 1) {
        setUserLoading(true);
      }
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/channel//followers-list/${channel._id}?page=${page}&limit=${limit}`,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response.data);
          setCount(response.data.length);
          if (page === 1) {
            setFollowers(response.data);
          } else {
            setFollowers((prev) => [...prev, ...response.data]);
          }
          setUserLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [page, openFollowersModal]);

  const handleIncrementPage = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <Box className='channel_header'>
      {/* Group profile image upload modal */}
      {openImageModal && (
        <ModalComp
          isOpen={openImageModal}
          onClose={closeProfileModal}
          title={"Update channel avatar"}
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
                loading={isLoading}
                disable={isBtnDisable}
                text='Upload'
                className='modal_update_btn'
                disableClassName='disable_modal_update_btn'
                clickHandler={handleUploadImage}
              />
            </Box>
          }
        />
      )}

      {/* Update group name modal */}
      {openNameModal && (
        <ModalComp
          isOpen={openNameModal}
          onClose={handleCloseDetailsModal}
          title={<>Update channel name</>}
          body={
            <Box className='modal_body_input_section'>
              <InputComp
                type='text'
                className='modal_form_input'
                placeholder='Enter group name'
                value={prevChatName}
                handleChange={(e) =>
                  setPrevChatName(e.target.value.slice(0, 50))
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
                disable={disableNameBtn}
                loading={loadingNameBtn}
                text='Update'
                className='modal_update_btn'
                disableClassName='disable_modal_update_btn'
                clickHandler={handleUpdateChannelName}
              />
            </Box>
          }
        />
      )}

      {/* Update chennel bio modal */}
      {openBioModal && (
        <ModalComp
          isOpen={openBioModal}
          onClose={handleCloseDetailsModal}
          title={<>Update channel bio</>}
          body={
            <Box className='modal_body_input_section'>
              <TextareaComp
                type='text'
                className='modal_form_input'
                placeholder='Enter group bio'
                value={newBioName}
                handleChange={(e) =>
                  setNewBioName(e.target.value.slice(0, 100))
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
                clickHandler={handleUpdateChannelBio}
              />
            </Box>
          }
        />
      )}

      {/* Update chennel delete modal */}
      {openDeleteModal && (
        <ModalComp
          isOpen={openDeleteModal}
          onClose={handleCloseDetailsModal}
          title={<>Update channel bio</>}
          body={
            <Box className='modal_body_input_section'>
              Do you want to delete this channel
            </Box>
          }
          footer={
            <Box className='modal_footer_section'>
              <AuthButton
                disable={false}
                loading={false}
                text='Delete'
                className='modal_update_btn'
                disableClassName='disable_modal_update_btn'
                clickHandler={handleDeleteChannel}
              />
            </Box>
          }
        />
      )}

      {/* Channel followers modal */}
      {openFollowersModal && (
        <FullPageModal
          isOpen={openFollowersModal}
          onClose={handleCloseDetailsModal}
          title={"Chennel Members"}
          body={
            <Box className='members_modal_body'>
              <Box className='group_members_section'>
                <Box className='modal_search_body'>
                  {useLoading ? (
                    <Box className='modal_loadder_section'>
                      <CircleLoader />
                    </Box>
                  ) : (
                    <>
                      {(followers || []).length > 0 && (
                        <>
                          {followers.map((user) => (
                            <UserCard2 key={user._id} data={user} />
                          ))}
                          {limit === count && (
                            <Box className='load_more_btn_section'>
                              <AuthButton
                                loading={btnLoading}
                                disable={false}
                                text={"Load more"}
                                className={"load_more_btn"}
                                disableClassName={"load_more_btn"}
                                clickHandler={handleIncrementPage}
                              />
                            </Box>
                          )}
                        </>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          }
          footer={<></>}
        />
      )}

      <Box className='channel_box'>
        <Button className='channel_back_btn' onClick={handleRedirectToChat}>
          <MdOutlineKeyboardBackspace />
        </Button>
        <Avatar src={p_i} className='chat_header_avatar' />
        <Box className='channel_info_box'>
          <Box className='channel_name_section'>
            <span className='channel_header_name'>{chatName}</span>
            <span className='channel_header_type'>{channel.cat}</span>
          </Box>
          <Box className='channel_header_bio'>{bio}</Box>
        </Box>
      </Box>

      {channel.creator._id === user._id ? (
        <Menu>
          <MenuButton
            className='chat_header_menu_btn'
            as={Button}
            rightIcon={<MdMoreVert />}></MenuButton>
          <MenuList>
            {/* Update channel image */}
            <MenuItem
              className='menu_item'
              onClick={() => setOpenImageModal(true)}>
              Update channel image
            </MenuItem>

            {/* Update channel name */}
            <MenuItem
              className='menu_item'
              onClick={() => setOpenNameModal(true)}>
              Update channel name
            </MenuItem>

            {/* Update channel bio */}
            <MenuItem
              className='menu_item'
              onClick={() => setOpenBioModal(true)}>
              Update channel bio
            </MenuItem>
            {/* Get members list */}
            <MenuItem
              className='menu_item'
              onClick={() => setOpenFollowersModel(true)}>
              Members
            </MenuItem>
            <MenuItem className='menu_item'>Update channel settings</MenuItem>
            <MenuItem className='menu_item'>View channel followers</MenuItem>
            <MenuItem
              className='menu_item delete'
              onClick={() => setOpenDeleteModal(true)}>
              Delete channel
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <>
          {!followers.includes(user._id) ? (
            <Button
              className='channel_join_btn'
              onClick={() => handleJoinGroup()}>
              Join
            </Button>
          ) : (
            <Menu>
              <MenuButton
                className='chat_header_menu_btn'
                as={Button}
                rightIcon={<MdMoreVert />}></MenuButton>
              <MenuList>
                {/* Leave channel */}
                <MenuItem
                  className='menu_item delete'
                  onClick={handleJoinGroup}>
                  Leave
                </MenuItem>
                <MenuItem className='menu_item'>Report</MenuItem>
              </MenuList>
            </Menu>
          )}
        </>
      )}
    </Box>
  );
};

export default ChannelHeader;
