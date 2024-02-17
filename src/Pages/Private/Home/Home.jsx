/** @format */

import React, { useState, useEffect, useLayoutEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import "./Home.css";
import { GlobalContext } from "../../../Context/Context";
import Layout from "../../../Layout/Layout";
import Chat from "./Components/Chat/Chat";
import Message from "./Components/Message/Message";
import InterestModal from "../../../Components/ModalComp/InterestModal";
import Interests from "../../../Config/interests.json";
const Home = () => {
  const { setPageType } = GlobalContext();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpenModal, setIsOpenModal] = useState(false);

  useLayoutEffect(() => {
    setPageType("home");
  }, []);

  useEffect(() => {
    if (user.hobbies.length > 0) {
      setIsOpenModal(false);
    } else {
      setIsOpenModal(true);
    }
  }, []);
  return (
    <Layout>
      <Box className='home_container'>
        {isOpenModal && (
          <InterestModal
            isOpen={isOpenModal}
            title={<Box className='modal_title'>Update your interests</Box>}
            body={
              <Box className='interest_modal_body'>
                {Interests.map((data) => (
                  <Button key={data.title} className='interest_btn'>
                    {data.title}
                  </Button>
                ))}
              </Box>
            }
            footer={<Box className='interest_modal_footer'>FOOTER</Box>}
          />
        )}
        <Chat />
        <Message />
      </Box>
    </Layout>
  );
};

export default Home;
