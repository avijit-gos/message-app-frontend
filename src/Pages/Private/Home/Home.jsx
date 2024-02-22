/** @format */

import React, { useState, useEffect, useLayoutEffect } from "react";
import { Box, Button, useToast } from "@chakra-ui/react";
import "./Home.css";
import { GlobalContext } from "../../../Context/Context";
import Layout from "../../../Layout/Layout";
import Message from "./Components/Message/Message";
import InterestModal from "../../../Components/ModalComp/InterestModal";
import Interests from "../../../Config/interests.json";
import AuthButton from "../../../Components/ButtonComp/AuthButton";
import axios from "axios";

const Home = () => {
  const toast = useToast();
  const { setPageType } = GlobalContext();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);

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

  const handleAddHobies = (data) => {
    if (!hobbies.includes(data.title)) {
      setHobbies((prev) => [...prev, data.title]);
    } else {
      const temp = hobbies;
      const arr = temp.filter((i) => i !== data.title);
      setHobbies(arr);
    }
  };

  useEffect(() => {
    if (!hobbies.length) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [hobbies]);

  const handleUpdateInterest = () => {
    setDisable(true);
    setLoading(true);
    let data = JSON.stringify({
      hobbies: hobbies,
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
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast({
          title: "Success",
          description: `${response.data.msg}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        setIsOpenModal(false);
      })
      .catch((error) => {
        console.log(error.response.data.error.message);
        toast({
          title: "Error",
          description: `${error.response.data.error.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      });
  };

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
                  <Button
                    key={data.title}
                    className={
                      hobbies.includes(data.title)
                        ? "interest_btn active_interest_btn"
                        : "interest_btn"
                    }
                    onClick={() => handleAddHobies(data)}>
                    {data.title}
                  </Button>
                ))}
              </Box>
            }
            footer={
              <Box className='interest_modal_footer'>
                <AuthButton
                  loading={loading}
                  disable={disable}
                  text={"Update"}
                  className={"upadte_btn"}
                  disableClassName={"disable_update_btn"}
                  clickHandler={handleUpdateInterest}
                />
              </Box>
            }
          />
        )}
        <Message />
      </Box>
    </Layout>
  );
};

export default Home;
