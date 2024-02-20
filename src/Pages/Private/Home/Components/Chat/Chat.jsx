/** @format */

import React, { useState, useEffect, useRef } from "react";
import "../../Home.css";
import {
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import { MdCreate } from "react-icons/md";
import Chats from "./Components/Chats";
import Channels from "./Components/Channels";
import Groups from "./Components/Groups";
import FullPageModal from "../../../../../Components/ModalComp/FullPageModal";
import InputComp from "../../../../../Components/InputComp/InputComp";
import TextareaComp from "../../../../../Components/InputComp/TextareaComp";
import { useDebounce } from "../../../../../hooks/useDebouncer";
import CircleLoader from "../../../../../Components/Loader/CircleLoader/CircleLoader";
import UserCard from "../../../../../Components/UserCard/UserCard";
import UserCard2 from "../../../../../Components/UserCard/UserCard2";
import AuthButton from "../../../../../Components/ButtonComp/AuthButton";
import Interests from "../../../../../Config/interests.json";
import axios from "axios";

const Chat = () => {
  const [active, setActive] = useState("my_chat");
  const [openSingleChatModal, setSingleChatModal] = useState(false);
  const [openGroupChatModal, setOpenGroupChatModal] = useState(false);
  const [openChannelModal, setOpenChannelModal] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [type, setType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(5);
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersId, setSelectedUsersId] = useState([]);
  const [disable, setDisable] = useState(true);
  const [groupCreateBtnLoading, setGroupCreateBtnLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleCloseSingleChatModal = () => {
    setSingleChatModal(false);
  };

  useEffect(() => {
    if (!name.trim() || !bio.trim() || !type.trim()) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [name, bio, type]);

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
      url: `${process.env.REACT_APP_BASE_URL}api/user?search=${searchTerm}&page=${page}&limit=${limit}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
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

  // *** Create single chat
  const handleCreateSingleChat = (user) => {
    let data = JSON.stringify({
      user: user._id,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat`,
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
        setSingleChatModal(false);
        setSearchTerm("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCloseGroupChatModal = () => {
    setName("");
    setBio("");
    setSearchTerm("");
    setOpenGroupChatModal(false);
  };

  const inputRef = useRef(null);
  const handleAddMemebers = (user) => {
    if (!selectedUsersId.includes(user._id)) {
      setSelectedUsers((prev) => [...prev, user]);
      setSelectedUsersId((prev) => [...prev, user._id]);
      setSearchTerm("");
      setUsers([]);
      inputRef.current.focus();
    }
  };

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

  // *** Create group chat
  const createGroupChat = () => {
    setGroupCreateBtnLoading(true);
    setDisable(true);
    let data = JSON.stringify({
      name: name,
      isGroup: true,
      bio: bio,
      type: type,
      members: selectedUsersId,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/chat/create/group`,
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
        setName("");
        setBio("");
        setType("");
        setSelectedUsers([]);
        setSelectedUsersId([]);
        setOpenGroupChatModal(false);
        setGroupCreateBtnLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box className='chat_container'>
      {/* Handle Single chat modal */}
      {openSingleChatModal && (
        <FullPageModal
          isOpen={openSingleChatModal}
          onClose={handleCloseSingleChatModal}
          title={<>Create a new chat</>}
          body={
            <Box className='full_page_modal_body'>
              <Box className='modal_form_section'>
                <AiOutlineSearch className='modal_search_icon' />
                <InputComp
                  type='search'
                  placeholder='Search user'
                  className='modal_input'
                  value={searchTerm}
                  handleChange={(e) => setSearchTerm(e.target.value)}
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
                    {(users || []).length > 0 ? (
                      <>
                        {users.map((user) => (
                          <UserCard
                            key={user._id}
                            data={user}
                            clickHandler={handleCreateSingleChat}
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
                    ) : (
                      <Box className='empty_search_list'>
                        No search result found
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          }
        />
      )}

      {/* Handle Group chat Modal */}
      {openGroupChatModal && (
        <FullPageModal
          isOpen={openGroupChatModal}
          onClose={handleCloseGroupChatModal}
          title={"Create group chat"}
          body={
            <Box className='full_page_modal_group_create_body'>
              {/* Name */}
              <InputComp
                type='text'
                placeholder='Group name'
                className='input_field'
                value={name}
                handleChange={(e) => setName(e.target.value.slice(0, 50))}
              />

              {/* Bio */}
              <TextareaComp
                type='text'
                placeholder='Group name'
                className='input_field'
                value={bio}
                handleChange={(e) => setBio(e.target.value.slice(0, 250))}
              />

              {/* Group Type */}
              <Box className='group_type_section'>
                <Box className='group_type_header'>Group Type</Box>
                <Box className='group_type_btns'>
                  {Interests.map((data) => (
                    <Box
                      className={
                        data.title === type
                          ? "group_type_btn active_type"
                          : "group_type_btn"
                      }
                      key={data.title}
                      onClick={() => setType(data.title)}>
                      {data.title}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Memebrs List */}
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
            <Box className='group_created_modal_footer'>
              <AuthButton
                loading={groupCreateBtnLoading}
                disable={disable}
                text='Create group'
                className={"group_create_btn"}
                disableClassName={"disable_group_create_btn group_create_btn"}
                clickHandler={createGroupChat}
              />
            </Box>
          }
        />
      )}

      {/* Handle Channel Modal */}

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
              active === "groups" ? "active_tab tab_container" : "tab_container"
            }
            onClick={() => setActive("groups")}>
            Groups
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
        {active === "my_chat" ? (
          <Chats />
        ) : (
          <>{active === "groups" ? <Groups /> : <Channels />}</>
        )}

        <Menu>
          <MenuButton as={Button} className='action_chat_btn'>
            <MdCreate />
          </MenuButton>
          <MenuList>
            <MenuItem
              className='menu_item'
              onClick={() => setSingleChatModal(true)}>
              Create a chat
            </MenuItem>
            <MenuItem
              className='menu_item'
              onClick={() => setOpenGroupChatModal(true)}>
              Create a group
            </MenuItem>
            <MenuItem className='menu_item'>Create a channel</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};

export default Chat;
