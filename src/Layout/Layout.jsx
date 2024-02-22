/** @format */

import React from "react";
import { GlobalContext } from "../Context/Context";
import { Box } from "@chakra-ui/react";
import HomeHeader from "../Components/Headers/HomeHeader/HomeHeader";
import ProfileHeader from "../Components/Headers/ProfileHeader/ProfileHeader";
import Chat from "../Components/LeftSidebar/Chat";

const Header = ({ pageType, title }) => {
  if (pageType === "home" || pageType === "profile") {
    return <HomeHeader />;
  }
};

const Layout = ({ children, title }) => {
  const { pageType } = GlobalContext();

  return (
    <Box className='layout_container'>
      <Header pageType={pageType} title={title} />
      <Box className='app_section'>
        <Chat />
        <Box className='app_container'>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
