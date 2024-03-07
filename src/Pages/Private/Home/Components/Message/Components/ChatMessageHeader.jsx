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
import React, { useState, useEffect, useRef } from "react";
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
import Members from "../../../../../../Components/UserCard/Members";
import { useDebounce } from "../../../../../../hooks/useDebouncer";
import CircleLoader from "../../../../../../Components/Loader/CircleLoader/CircleLoader";
import UserCard2 from "../../../../../../Components/UserCard/UserCard2";
import PendingUsers from "../../../../../../Components/UserCard/PendingUsers";
import {
  socket,
  useSocket,
  isConnected,
} from "../../../../../../socket/socket";

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
  const [pending, setPending] = useState(chat.pending);

  //upload profile image state
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [prevImage, setPrevImage] = useState("");
  const [image, setImage] = useState("");
  const [disableImageBtn, setDisableImageBtn] = useState(true);
  const [loadingImageBtn, setLoadingImageBtn] = useState(false);

  //update group details state
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [previousChatName, setPreviousChatName] = useState(
    chat.isGroup ? chat.name : ""
  );
  const [previousChatBio, setPreviousChatBio] = useState(
    chat.isGroup ? chat.bio : ""
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

  const [openUsersModal, setOpenUsersModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersId, setSelectedUsersId] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [openLeaveGroupModal, setOpenLeaveGroupModal] = useState(false);
  const [openPendingGroupModal, setOpenPendingGroupModal] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useSocket();

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
      `${process.env.REACT_APP_BASE_URL}api/chat/update-profile-image/${chat._id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        socket.emit("update chat", result.result);
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
    setOpenDeleteModal(false);
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
      url: `${process.env.REACT_APP_BASE_URL}api/chat/update-name/${chat._id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        socket.emit("update chat", response.data.group);
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
      url: `${process.env.REACT_APP_BASE_URL}api/chat/update-bio/${chat._id}`,
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
      url: `${process.env.REACT_APP_BASE_URL}api/chat/members/${chat._id}?page=${page}&limit=${limit}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        setCount(response.data);
        if (page === 1) {
          setUsers(response.data);
        } else {
          setUsers((prev) => [...prev, ...response.data]);
        }
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

  const inputRef = useRef(null);

  const handleRemoveSelectUser = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUsers.length > 0
    ) {
      const arr = selectedUsers;
      const temp = arr.splice(0, arr.length - 1);
      setSelectedUsers(temp);

      const arr1 = selectedUsersId;
      const temp1 = arr1.splice(0, arr.length - 1);
      setSelectedUsersId(temp1);
    }
  };

  const handleAddMemebers = (user) => {
    if (!selectedUsersId.includes(user._id)) {
      setSelectedUsers((prev) => [...prev, user]);
      setSelectedUsersId((prev) => [...prev, user._id]);
      setSearchTerm("");
      setUsers([]);
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (searchTerm.length > 1) {
      handleSearchUser(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, page]);

  const handleSearchUser = (debouncedSearchTerm) => {
    if (page === 1) {
      setLoading(true);
    }
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/list-users/${chat._id}?search=${searchTerm}&page=${page}&limit=${limit}`,
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
          setUsers(response.data);
        } else {
          setUsers((prev) => [...prev, ...response.data]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleIncrementPage = () => {
    setBtnDisable(true);
    setBtnLoading(true);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (selectedUsersId.length === 0) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [selectedUsersId]);

  const handleAddMembers = () => {
    setBtnLoading(true);
    setIsDisable(true);
    let data = JSON.stringify({
      user: selectedUsersId,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/add-member/${chat._id}`,
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
        setSelectedUsers([]);
        setSelectedUsersId([]);
        setOpenUsersModal(false);
        setSearchTerm("");
        setBtnLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setSelectedUsers([]);
        setSelectedUsersId([]);
        setOpenUsersModal(false);
        setSearchTerm("");
      });
  };

  const handleLeaveGroup = () => {
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/leave-group/${chat._id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setOpenLeaveGroupModal(false);
        const arr = admins;
        const temp = arr.filter((data) => data !== user._id);
        setAdmins(temp);
        //
        const arr2 = users;
        const temp2 = arr2.filter((data) => data !== user._id);
        setUsers(temp2);
      })
      .catch((error) => {
        console.log(error);
        setOpenLeaveGroupModal(false);
      });
  };

  const handleJoinRequest = () => {
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/join-request/${chat._id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data.chat);
        if (pending.includes(user._id)) {
          const arr = pending;
          const temp = arr.filter((data) => data !== user._id);
          setPending(temp);
        } else {
          setPending((prev) => [...prev, user._id]);
          socket.emit("join request", {
            ...response.data.chat,
            ...{ pendingUser: user._id },
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpenGroupModal = () => {
    setOpenPendingGroupModal(true);
    setPage(1);
  };

  const fetchPendingUsers = () => {
    if (page === 1) {
      setLoading(true);
    }
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/chat/pending/${chat._id}?page=${page}&limit=${limit}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if (page === 1) {
          setPendingUsers(response.data);
        } else {
          setPendingUsers((prev) => [...prev, ...response.data]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (openPendingGroupModal) {
      fetchPendingUsers();
    }
  }, [page, openPendingGroupModal]);

  const handleDeleteGroup = () => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/delete-group/${chat._id}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        socket.emit("update chat", response.data.chat);
        setSelectChatId("");
        if (window.innerWidth < 650) {
          navigate(`/`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    socket.on("received new join request", (data) => {
      // console.log("### received new join request", data);
      if (data._id === chat._id) {
        setPending(data.pending);
      }
    });
  });

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

      {/* Update group name modal */}
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

      {/* Update group bio modal */}
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

      {/* Group members modal */}
      {openAdminModal && (
        <FullPageModal
          isOpen={openAdminModal}
          onClose={setOpenAdminModal}
          title={"Group Members"}
          body={
            <Box className='members_modal'>
              {(users || []).length > 0 ? (
                <>
                  {users.map((data) => (
                    <Members
                      key={data._id}
                      user={data}
                      setUsers={setUsers}
                      users={user}
                    />
                  ))}
                </>
              ) : (
                <Box className='empty_members_modal'>No memebers found</Box>
              )}
            </Box>
          }
        />
      )}

      {/* Add new members in group chat */}
      {openUsersModal && (
        <FullPageModal
          isOpen={openUsersModal}
          onClose={setOpenUsersModal}
          title={"Add Members"}
          body={
            <Box className='members_modal_body'>
              <Box className='group_members_section'>
                <Box className='search_input_container'>
                  {selectedUsers.map((user) => (
                    <Box className='pills_section'>
                      <Avatar src={user.p_i} className='pills_avatar' />
                      <span className='pills_name'>{user.name}</span>
                    </Box>
                  ))}
                  <Input
                    type='text'
                    placeholder='Search user'
                    className='modal_search_input'
                    value={searchTerm}
                    ref={inputRef}
                    onKeyDown={(e) => handleRemoveSelectUser(e)}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Box>
                {/* Search Result section */}
                <Box className='modal_search_body'>
                  {loading ? (
                    <Box className='modal_loadder_section'>
                      <CircleLoader />
                    </Box>
                  ) : (
                    <>
                      {(users || []).length > 0 && (
                        <>
                          {users.map((user) => (
                            <UserCard2
                              key={user._id}
                              data={user}
                              clickHandler={handleAddMemebers}
                            />
                          ))}
                          {limit === count && (
                            <Box className='load_more_btn_section'>
                              <AuthButton
                                loading={btnLoading}
                                disable={btnDisable}
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
          footer={
            <AuthButton
              loading={btnLoading}
              disable={isDisable}
              text={"Add"}
              className={"modal_add_members_btn"}
              disableClassName={"disable_modal_add_members_btn"}
              clickHandler={handleAddMembers}
            />
          }
        />
      )}

      {/* Leave group modal */}
      {openLeaveGroupModal && (
        <ModalComp
          isOpen={openLeaveGroupModal}
          onClose={setOpenLeaveGroupModal}
          title={"Leave group"}
          body={
            <Box className='leave_group_modal_body'>
              Do you want to leave this group?
            </Box>
          }
          footer={
            <Box className='modal_footer_section'>
              <AuthButton
                disable={false}
                loading={false}
                text='Leave'
                className='modal_update_btn leave_btn'
                disableClassName='disable_modal_update_btn'
                clickHandler={handleLeaveGroup}
              />
            </Box>
          }
        />
      )}

      {/* Group join request modal */}
      {openPendingGroupModal && (
        <FullPageModal
          isOpen={openPendingGroupModal}
          onClose={setOpenPendingGroupModal}
          title={"Join request"}
          body={
            <Box className='members_modal'>
              {(pendingUsers || []).length > 0 ? (
                <>
                  {pendingUsers.map((data) => (
                    <PendingUsers
                      key={data._id}
                      data={data}
                      id={chat._id}
                      setPendingUsers={setPendingUsers}
                      pendingUsers={pendingUsers}
                    />
                  ))}
                </>
              ) : (
                <Box className='empty_members_modal'>No memebers found</Box>
              )}
            </Box>
          }
        />
      )}

      {/* Group delete modal */}
      {openDeleteModal && (
        <ModalComp
          isOpen={openDeleteModal}
          onClose={handleCloseDetailsModal}
          title={<>Delete group</>}
          body={
            <Box className='modal_body_input_section'>
              <dpan className='delete_msg'>
                Do you want to delete this group chat?
              </dpan>
            </Box>
          }
          footer={
            <Box className='modal_footer_section'>
              <AuthButton
                disable={false}
                loading={false}
                text='Delete'
                className='modal_update_btn delete_btn'
                disableClassName='disable_modal_update_btn disable_delete_btn'
                clickHandler={handleDeleteGroup}
              />
            </Box>
          }
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

          {chat.users.includes(user._id) || chat.creator._id === user._id ? (
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
                    className='menu_item members_menu_item'
                    onClick={handleOpenMembersModal}>
                    Group members
                    <span className='members_count'>{chat.users.length}</span>
                  </MenuItem>
                )}

                {/* Update group name */}
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

                {/* Update group Privacy settings */}
                {chat.creator._id === user._id && (
                  <MenuItem className='menu_item'>Privacy settings</MenuItem>
                )}

                {/* Add new members */}
                {chat.creator._id === user._id && (
                  <MenuItem
                    className='menu_item'
                    onClick={() => setOpenUsersModal(true)}>
                    Add members
                  </MenuItem>
                )}

                {/* Request to join group */}
                {chat.creator._id === user._id && (
                  <MenuItem
                    className='menu_item members_menu_item'
                    onClick={handleOpenGroupModal}>
                    Join request
                    <span className='members_count'>{pending.length}</span>
                  </MenuItem>
                )}

                {/* Leave the group */}
                {chat.creator._id !== user._id && (
                  <MenuItem
                    className='menu_item'
                    onClick={() => setOpenLeaveGroupModal(true)}>
                    Leave group
                  </MenuItem>
                )}

                {/* Report */}
                {chat.creator._id !== user._id && (
                  <MenuItem className='menu_item'>Report</MenuItem>
                )}

                {/* Delete settings */}
                {chat.creator._id === user._id && (
                  <MenuItem
                    className='menu_item delete'
                    onClick={() => setOpenDeleteModal(true)}>
                    Delete group
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          ) : (
            <Button
              onClick={handleJoinRequest}
              className={
                pending.includes(user._id)
                  ? "join_chat_btn join_requested"
                  : "join_chat_btn"
              }>
              {pending.includes(user._id) ? <>Request send</> : <>Join</>}
            </Button>
          )}
        </Box>
      ) : (
        <Box className='chat_message_header_section'>Single chat</Box>
      )}
    </>
  );
};

export default ChatMessageHeader;
