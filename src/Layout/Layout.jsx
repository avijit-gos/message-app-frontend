/** @format */

import React from "react";
import { GlobalContext } from "../Context/Context";
import { Box } from "@chakra-ui/react";
import HomeHeader from "../Components/Headers/HomeHeader/HomeHeader";


const Header = ({ pageType }) => {
  if (pageType === "home") {
    return <HomeHeader />;
  }
};

const Layout = ({ children }) => {
  const { pageType } = GlobalContext();

  return (
    <Box className='layout_container'>
      <Header pageType={pageType} />
      <Box className='app_container'>{children}</Box>
    </Box>
  );
};

export default Layout;
