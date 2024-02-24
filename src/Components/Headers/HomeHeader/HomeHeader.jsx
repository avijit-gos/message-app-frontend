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
  Input,
  Img,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import "./HomeHeader.css";
import ProfileDrawer from "../../DrawerComp/ProfileDrawer/ProfileDrawer";
import { FaCamera } from "react-icons/fa";
import InputComp from "../../InputComp/InputComp";
import AuthButton from "../../ButtonComp/AuthButton";
import ModalComp from "../../ModalComp/ModalComp";
import axios from "axios";
import TextareaComp from "../../InputComp/TextareaComp";
import Interests from "../../../Config/interests.json";

const HomeHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [image, setImage] = useState(user.p_i);
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  const [loading, setLoading] = useState(false);

  // name state
  const [openNameModal, setOpenNameModal] = useState(false);
  const [name, setName] = useState(user.name);
  const [prevname, setPrevname] = useState(user.name);
  const [loadingNameBtn, setLoadingNameBtn] = useState(false);
  const [disableNameBtn, setDisableNameBtn] = useState(true);

  // bio state
  const [openBioModal, setOpenBioModal] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [prevbio, setPrevbio] = useState(user.bio);
  const [loadingBioBtn, setLoadingBioBtn] = useState(false);
  const [disableBioBtn, setDisableBioBtn] = useState(true);

  // hobbies state
  const [openHobbyModal, setOpenHobbyModal] = useState(false);
  const [hobbies, setHobbies] = useState(user.hobbies);
  const [prevHobbies, setPrevHobbies] = useState(user.hobbies);
  const [loadingHobbyBtn, setLoadingHobbyBtn] = useState(false);
  const [disableHobbyBtn, setDisableHobbyBtn] = useState(true);

  const handleUploadImage = (e) => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("x-access-token", localStorage.getItem("token"));

    const formdata = new FormData();
    formdata.append("image", e.target.files[0]);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_BASE_URL}api/user/profile/image`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setImage(result.result.p_i);
        localStorage.setItem("user", JSON.stringify(result.result));
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (!name.trim() || name === prevname) {
      setDisableNameBtn(true);
    } else {
      setDisableNameBtn(false);
    }
  }, [name, prevname]);

  const handleUpdateName = () => {
    setDisableNameBtn(true);
    let data = JSON.stringify({
      name: prevname,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/user/update/profile/name`,
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
        setName(response.data.user.name);
        setPrevname(response.data.user.name);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setOpenNameModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeNameModal = () => {
    setOpenNameModal(false);
    setName(user.name);
    setPrevname(user.name);
    setOpenBioModal(false);
    setBio(user.bio);
    setPrevbio(user.bio);
    setOpenHobbyModal(false);
  };

  useEffect(() => {
    if (!prevbio.trim() || prevbio === bio) {
      setDisableBioBtn(true);
    } else {
      setDisableBioBtn(false);
    }
  }, [bio, prevbio]);

  const handleUpdateBio = () => {
    let data = JSON.stringify({
      bio: prevbio,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/user/update/profile/bio`,
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
        setBio(response.data.user.bio);
        setPrevbio(response.data.user.bio);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setOpenBioModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddHobbies = (data) => {
    if (prevHobbies.includes(data.title)) {
      const arr = prevHobbies;
      const temp = arr.filter((i) => i !== data.title);
      setPrevHobbies(temp);
    } else {
      setPrevHobbies((prev) => [...prev, data.title]);
    }
  };

  useEffect(() => {
    if (JSON.stringify(hobbies) === JSON.stringify(prevHobbies)) {
      setDisableHobbyBtn(true);
    } else {
      setDisableHobbyBtn(false);
    }
  }, [hobbies, prevHobbies]);

  const handleUpdateHobbies = () => {
    let data = JSON.stringify({
      hobbies: prevHobbies,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/user/update/profile/interest`,
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
        setHobbies(response.data.user.hobbies);
        setPrevHobbies(response.data.user.hobbies);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setOpenHobbyModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box className='home_header_container'>
      {/* Update profile name modal */}
      {openNameModal && (
        <ModalComp
          isOpen={openNameModal}
          onClose={closeNameModal}
          title='Update profile name'
          body={
            <Box>
              <InputComp
                type='text'
                className='update_input'
                placeholder={"Enter name"}
                value={prevname}
                handleChange={(e) => setPrevname(e.target.value)}
              />
            </Box>
          }
          footer={
            <Box className='modal_footer_section'>
              <AuthButton
                loading={loadingNameBtn}
                disable={disableNameBtn}
                className={"update_profile_btn"}
                disableClassName={"disable_update_profile_btn"}
                text={"Update"}
                clickHandler={handleUpdateName}
              />
            </Box>
          }
        />
      )}

      {/* Update profile bio modal */}
      {openBioModal && (
        <ModalComp
          isOpen={openBioModal}
          onClose={closeNameModal}
          title='Update profile bio'
          body={
            <Box>
              <TextareaComp
                type='text'
                className='update_input'
                placeholder={"Enter bio"}
                value={prevbio}
                handleChange={(e) => setPrevbio(e.target.value)}
              />
            </Box>
          }
          footer={
            <Box className='modal_footer_section'>
              <AuthButton
                loading={loadingBioBtn}
                disable={disableBioBtn}
                className={"update_profile_btn"}
                disableClassName={"disable_update_profile_btn"}
                text={"Update"}
                clickHandler={handleUpdateBio}
              />
            </Box>
          }
        />
      )}

      {/* Update profile hobbies modal */}
      {openHobbyModal && (
        <ModalComp
          isOpen={openHobbyModal}
          onClose={closeNameModal}
          title='Update profile interest'
          body={
            <Box className='hobbies_modal_body'>
              {Interests.map((data) => (
                <Button
                  key={data.title}
                  onClick={() => handleAddHobbies(data)}
                  className={
                    prevHobbies.includes(data.title)
                      ? "interest_btn active_interest_btn"
                      : "interest_btn"
                  }>
                  {data.title}
                </Button>
              ))}
            </Box>
          }
          footer={
            <Box className='modal_footer_section'>
              <AuthButton
                loading={loadingHobbyBtn}
                disable={disableHobbyBtn}
                className={"update_profile_btn"}
                disableClassName={"disable_update_profile_btn"}
                text={"Update"}
                clickHandler={handleUpdateHobbies}
              />
            </Box>
          }
        />
      )}

      {openProfileDrawer && (
        <ProfileDrawer
          isOpen={openProfileDrawer}
          onClose={setOpenProfileDrawer}
          header={<>Profile</>}
          body={
            <Box className='drwaer_profile_container'>
              {/* Profile image section */}
              <Box className='profile_image_section'>
                <Box className='avatar_section'>
                  <Img src={image} className='user_drawer_avatar' />
                  {loading ? (
                    <Box className='image_loading_section'>
                      <span className='image-loader'></span>
                    </Box>
                  ) : (
                    <label htmlFor='image-file' className='image_file_label'>
                      <Input
                        type='file'
                        className='file_input'
                        id='image-file'
                        onChange={(e) => handleUploadImage(e)}
                        accept='image/*'
                      />
                      <FaCamera className='image_upload_icon' />
                    </label>
                  )}
                </Box>
              </Box>

              {/* Drawer Accordion section */}
              <Box className='drawer_accordion_section'>
                <Accordion defaultIndex={[0]} allowMultiple>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box
                          as='span'
                          flex='1'
                          textAlign='left'
                          className='accordion_header'>
                          Profile Settings
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      {/* Name */}
                      <Box className='update_section'>
                        <Box
                          className='accrodion_box'
                          onClick={() => setOpenNameModal(true)}>
                          <span className='user_name'>{name}</span>
                        </Box>
                      </Box>

                      {/* Bio */}

                      <Box className='update_section'>
                        <Box
                          className='accrodion_box'
                          onClick={() => setOpenBioModal(true)}>
                          <span className='user_bio'>
                            {bio || "No profile bio has been set"}
                          </span>
                        </Box>
                      </Box>

                      {/* Interests */}
                      <Box
                        className='hobbies_update_section'
                        onClick={() => setOpenHobbyModal(true)}>
                        {(hobbies || []).map((data) => (
                          <Box className='hobbies_box' key={data}>
                            {data}
                          </Box>
                        ))}
                      </Box>

                      {/* Account created */}
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box
                          as='span'
                          flex='1'
                          textAlign='left'
                          className='accordion_header'>
                          Security Settings
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>{/* Update password */}</AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </Box>
          }
        />
      )}
      <Box className='home_header_app_name'>Vootel</Box>
      <Box className='home_header_buttons'>
        {/* Notification */}
        <Box className='notification_box'>
          <FaBell />
        </Box>

        {/* Menu */}
        <Menu>
          <MenuButton as={Button} className='menu_btn'>
            <Avatar src={image} className='menu_avatar' />
          </MenuButton>
          <MenuList>
            <MenuItem
              className='menu_item'
              onClick={() => setOpenProfileDrawer(true)}>
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
