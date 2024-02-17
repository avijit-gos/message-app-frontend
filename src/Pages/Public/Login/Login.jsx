/** @format */

import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import "./Login.css";
import axios from "axios";
import InputComp from "../../../Components/InputComp/InputComp";
import AuthButton from "../../../Components/ButtonComp/AuthButton";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [logUser, setLogUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!logUser.trim() || !password.trim()) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [logUser, password]);

  const handleLogin = () => {
    setDisable(true);
    setLoading(true);
    let data = JSON.stringify({
      userInfo: logUser,
      password: password,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/user/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        setLogUser("");
        setPassword("");
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setErrorMsg(error.response.data.error.message);
        setLogUser("");
        setPassword("");
        setLoading(false);
      });
  };

  return (
    <Box className='register_container'>
      <Box className='register_box'>
        <Box className='register_header'>
          <p className='app_name'>Vootel</p>
          <Box className='register_header_title'>Welcome back</Box>
          <Box className='register_sub_header'>
            By Sign Up you can join our messaging app to start chatting with you
            close ones
          </Box>
        </Box>

        <Box className='form_section'>
          <Box className='error_messaage'>{errorMsg}</Box>
          {/* Email */}
          <InputComp
            type='email'
            placeholder='Enter your email'
            className='auth_form_input'
            value={logUser}
            handleChange={(e) => setLogUser(e.target.value)}
          />

          {/* Password */}
          <InputComp
            type='password'
            placeholder='Enter your password'
            className='auth_form_input'
            value={password}
            handleChange={(e) => setPassword(e.target.value)}
          />
        </Box>

        <Box className='auth_button_section'>
          <AuthButton
            loading={loading}
            disable={disable}
            text={"Login"}
            className={"auth_btn_button"}
            disableClassName={"disable_auth_btn_button"}
            clickHandler={handleLogin}
          />
          <Box className='login_link'>
            Don't have an account?{" "}
            <Link to='/register' className='link_tag'>
              Register
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
