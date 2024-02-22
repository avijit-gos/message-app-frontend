/** @format */

import { Box } from "@chakra-ui/react";
import React, { useLayoutEffect } from "react";
import { GlobalContext } from "../../Context/Context";
import "./Profile.css";
import Layout from "../../Layout/Layout";

const Profile = () => {
  const { setPageType } = GlobalContext();

  useLayoutEffect(() => {
    setPageType("profile")
  },[])
  return <Layout><Box className='profile_container'>Profile</Box></Layout>
};

export default Profile;
